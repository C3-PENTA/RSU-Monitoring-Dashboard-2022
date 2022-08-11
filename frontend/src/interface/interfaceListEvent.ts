import { IPaginationData } from './interfaceCommon';

export interface IListEventForm extends IPaginationData {
  keyword: string;
  lastRecordCreatedTime?: string;
  dateRange: [Date | null, Date | null];
  categoryID: string[];
}

export interface IListEventReq {
  page?: number;
  lastRecordCreatedTime?: string;
  size: number;
  category: IListEvent['category'][] | string[];
  keyword?: string;
  startTime?: string;
  endTime?: string;
}

export interface IListEventResData extends IPaginationData {
  listEvent: IListEvent[];
}

export interface IListEventTable {
  key: keyof IListEvent;
  label: string;
  render?: (data: IListEvent) => JSX.Element;
  rawContent?: (data: IListEvent) => string;
}

export interface IEventInfoAvailability {
  cpu: number;
  ram: number;
  nic: {
    tx: number;
    rx: number;
  };
}

export interface IEventInfoVirus {
  fileName: string;
}

export interface IEventInfoCommunication {
  info: string;
}

export interface IListEvent {
  id: string;
  category: number;
  datetime?: string;
  sendNodeType: string;
  sendNode: string;
  receiveNodeType?: string;
  receiveNode?: string;
  detectionNodeId?: number;
  detectionNodeType: string;
  detectionNode: string;
  status?: string;
  request?: string;
  action?: string;
  eventType?: string;
  eventInfo: IEventInfoAvailability | IEventInfoVirus | IEventInfoCommunication;
  createdAt: string;
  updatedAt?: string;
}
