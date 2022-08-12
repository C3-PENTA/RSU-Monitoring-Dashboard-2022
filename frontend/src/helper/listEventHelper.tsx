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

