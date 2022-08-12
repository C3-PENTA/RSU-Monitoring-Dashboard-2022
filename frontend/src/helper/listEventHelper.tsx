import { Tooltip } from '@mantine/core';
import dayjs from 'dayjs';
import { t } from 'i18next';

import { categoryConfig, listEventTableConfig } from '@/config/listEventConfig';
import { CPUThreshold, NICThreshold, paginationConfig, RAMThreshold } from '@/config/system';
import {
  IEventInfoAvailability,
  IEventInfoCommunication,
  IEventInfoVirus,
  IListEvent,
  IListEventForm,
  IListEventReq,
} from '@/interface/interfaceListEvent';
import { TypesOf } from '@/interface/interfaceCommon';
import { checkStrArrIncludeKeyword } from '@/util/arrayHandle';
import { safeAnyToNumber } from '@/util/primitiveHandle';

export const getCategoryConfig = (category: TypesOf<IListEvent>) =>
  categoryConfig.find(({ id }) => id === category);

export const renderEventInfo = (data: IListEvent, disableTooltip?: boolean) => {
  const category = getCategoryConfig(data.category);
  switch (category?.id) {
    case 1: {
      const eventInfoData = data.eventInfo as IEventInfoAvailability;
      const traffic = Math.round((eventInfoData.nic.tx / eventInfoData.nic.rx) * 100);
      return (
        <Tooltip
          className="text-ellipsis--2"
          label={`CPU ${eventInfoData.cpu}%, Memory ${eventInfoData.ram}%, Traffic volume ${traffic}%`}
          disabled={disableTooltip}
        >
          CPU (
          <span className={`text-${eventInfoData.cpu < CPUThreshold ? 'green' : 'red'}`}>
            {eventInfoData.cpu}%
          </span>
          ), Memory (
          <span className={`text-${eventInfoData.ram < RAMThreshold ? 'green' : 'red'}`}>
            {eventInfoData.ram}%
          </span>
          ),
          <br />
          Current traffic volume (
          <span className={`text-${traffic < NICThreshold ? 'green' : 'red'}`}>{traffic}%</span>)
        </Tooltip>
      );
    }
    case 2: {
      return (
        <div className="table__event-info text-ellipsis--2">
          <>
            {t('list_event.info.virus', {
              fileName: (data.eventInfo as IEventInfoVirus).fileName || '',
            })}
          </>
        </div>
      );
    }
    case 3:
      return (
        <>
          {t('list_event.info.communication', {
            detectionNode: data.detectionNode || '',
            info: (data.eventInfo as IEventInfoCommunication).info || '',
          })}
        </>
      );

    default:
      return <></>;
  }
};

export const getEventInfoTextOnly = (data: IListEvent): string => {
  const category = getCategoryConfig(data.category);

  switch (category?.id) {
    case 1: {
      const eventInfoData = data.eventInfo as IEventInfoAvailability;
      const traffic = Math.round((eventInfoData.nic.tx / eventInfoData.nic.rx) * 100);

      return `CPU ${eventInfoData.cpu}%, Memory ${eventInfoData.ram}%, Traffic volume ${traffic}%`;
    }

    case 2:
      return t('list_event.info.virus', {
        fileName: (data.eventInfo as IEventInfoVirus).fileName || '',
      });

    case 3:
      return t('list_event.info.communication', {
        detectionNode: data.detectionNode || '',
        info: (data.eventInfo as IEventInfoCommunication).info || '',
      });

    default:
      return '';
  }
};

export const handleGetValueFromEvent = (data: IListEvent): string => {
  let content = '';
  listEventTableConfig.forEach(({ key, label, rawContent }) => {
    if (rawContent) {
      content += ` ${label}: ${rawContent(data)},`;
      return;
    }
    content += data[key] ? ` ${label}: ${data[key]},` : '';
  });
  return content.trim().slice(0, -1);
};

export const handleListEventPagingReq = (
  filterValues: IListEventForm,
): IListEventReq | undefined => {
  const [startDate, endDate] = filterValues.dateRange;

  if (startDate !== null && endDate === null) {
    return undefined;
  }

  return {
    keyword: filterValues.keyword.trim().toLowerCase() || undefined,
    category: filterValues.categoryID.map(safeAnyToNumber),
    startTime: startDate ? dayjs(startDate).toISOString() : undefined,
    endTime: endDate ? dayjs(endDate).endOf('day').toISOString() : undefined,
    page: filterValues.currentPage || 1,
    size: filterValues.size || paginationConfig.pageSizePool[0],
  };
};

export const handleListEventReqDebounce = (
  filterValues: IListEventForm,
  isScrollLoadMore?: boolean,
): IListEventReq | undefined => {
  const [startDate, endDate] = filterValues.dateRange;

  if (startDate !== null && endDate === null) {
    return undefined;
  }

  return {
    lastRecordCreatedTime: isScrollLoadMore ? filterValues.lastRecordCreatedTime : undefined,
    size: paginationConfig.pageSizePool[1],
    category: filterValues.categoryID.map((c) => Number(c)),
    keyword: filterValues.keyword.trim().toLowerCase() || undefined,
    startTime: startDate ? dayjs(startDate).toISOString() : undefined,
    endTime: endDate ? dayjs(endDate).endOf('day').toISOString() : undefined,
  };
};

/**
 * @param keyword Pre-condition: This string must be normalized.
 */
export const isSocketEventValid = (
  { keyword, category, startTime, endTime }: IListEventReq,
  eventData?: IListEvent,
): boolean => {
  if (!eventData) {
    return false;
  }

  const isValidKeyWord = keyword
    ? checkStrArrIncludeKeyword(keyword, [
        eventData.sendNode,
        eventData.receiveNode,
        eventData.detectionNode,
      ])
    : true;
  const isValidCategory = category.some((categoryID) => categoryID === eventData.category);

  const isValidDateRange =
    startTime && endTime
      ? dayjs(startTime).diff(eventData.createdAt, 'day') >= 0 &&
        dayjs(endTime).diff(eventData.createdAt, 'day') <= 0
      : true;

  return isValidKeyWord && isValidCategory && isValidDateRange;
};
