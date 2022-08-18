import { NotificationProps, showNotification, updateNotification } from '@mantine/notifications';
import { t } from 'i18next';

import { notificationConfig } from '@/config/notificationConfig';
import { ErrorCode } from '@/config/httpConfig/apis';
import { renderEventInfo } from '@/helper/listEventHelper';
import { IEventInfoVirus, IListEvent } from '@/interface/interfaceListEvent';
import { INotiConfig } from '@/interface/interfaceNotification';

import { Check } from 'tabler-icons-react';

export const findNotiConfig = (code?: ErrorCode): INotiConfig => {
  const notiConfig = notificationConfig.find((c) => c.code === code) || notificationConfig[0];
  return {
    ...notiConfig,
    title: notiConfig.title ? t(notiConfig.title) : undefined,
    message: t(notiConfig.message),
  };
};

export const showNotiFetch = ({
  notiID,
  notiQueue,
  isSuccess,
  errCode,
}: {
  notiID: string;
  notiQueue: NotificationProps[];
  isSuccess?: boolean;
  errCode?: ErrorCode;
}) => {
  if (errCode || isSuccess === false) {
    updateNotification({
      id: notiID,
      ...findNotiConfig(errCode || ErrorCode.ERR),
    });
    return;
  }

  if (isSuccess) {
    updateNotification({
      id: notiID,
      color: 'teal',
      message: <>{t('common.success')}</>,
      icon: <Check />,
    });
    return;
  }

  // if there are any notiID noti exist on noti queue, update it instead of create new one.
  (notiQueue.findIndex(({ id }) => id === notiID) === -1 ? showNotification : updateNotification)({
    id: notiID,
    loading: true,
    title: <>{t('common.communication.fetching.title')}</>,
    message: <>{t('common.communication.fetching.message')}</>,
    autoClose: false,
    disallowClose: true,
  });
};

export const showNotiSocket = (event?: IListEvent) => {
  if (!event) {
    return;
  }

  if (event.category === 1) {
    showNotification({
      ...findNotiConfig(ErrorCode.ERR_EXCEED_THRESHOLD),
      message: (
        <div className="noti__exceed">
          {`${t('common.error.exceed_threshold.message', {
            nodeName: event.detectionNode,
            nodeID: event.detectionNodeId,
          })}`}
          {renderEventInfo(event, true)}
        </div>
      ),
    });
  }

  if (event.category === 2) {
    showNotification({
      ...findNotiConfig(ErrorCode.ERR_VIRUS),
      message: `${t('common.error.virus.message', {
        nodeName: event.detectionNode,
        nodeID: event.detectionNodeId,
        fileName: (event.eventInfo as IEventInfoVirus).fileName || '',
      })}`,
    });
  }
};
