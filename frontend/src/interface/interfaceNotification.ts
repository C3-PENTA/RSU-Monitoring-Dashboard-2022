import { ErrorCode } from '@/config/httpConfig/apis';
import { NotificationProps } from '@mantine/notifications';

export interface INotiConfig extends NotificationProps {
  code: ErrorCode;
  title?: string;
  message: string;
}

export enum NotiID {
  DASHBOARD_FETCH = 'fetch-dashboard-diagram',
  LIST_EVENT_FETCH = 'fetch-event-list',
}
