import dayjs from 'dayjs';
import { t } from 'i18next';

import { getCategoryConfig, getEventInfoTextOnly, renderEventInfo } from '@/helper/listEventHelper';
import { IListEventTable } from '@/interface/interfaceListEvent';

export const categoryConfig = [
  {
    id: 1,
    label: 'list_event.category.availability_status_tranfer',
  },
  {
    id: 2,
    label: 'list_event.category.virus',
  },
  {
    id: 3,
    label: 'list_event.category.communication',
  },
];

export const listEventTableConfig: IListEventTable[] = [
  {
    key: 'category',
    label: 'Event Category',
    render: ({ category }) => <>{t(getCategoryConfig(category)?.label || '')}</>,
    rawContent: ({ category }) => t(getCategoryConfig(category)?.label || ''),
  },
  {
    key: 'datetime',
    label: 'Date/Time',
    render: ({ createdAt }) => <>{dayjs(createdAt).format('hh:mm a DD/MM/YYYY')}</>,
    rawContent: ({ createdAt }) => dayjs(createdAt).format('hh:mm a DD/MM/YYYY'),
  },
  { key: 'sendNode', label: 'Send Node' },
  { key: 'receiveNode', label: 'Receive Node' },
  { key: 'detectionNode', label: 'Detection Node' },
  {
    key: 'eventType',
    label: 'Event type',
    render: ({ eventType }) =>
      eventType ? <span className="list-event__eventType">{eventType.toString()}</span> : <></>,
  },
  { key: 'status', label: 'Status' },
  { key: 'request', label: 'Request' },
  { key: 'action', label: 'Action' },
  {
    key: 'eventInfo',
    label: 'Event Information',
    render: (data) => renderEventInfo(data),
    rawContent: (data) => getEventInfoTextOnly(data),
  },
];
