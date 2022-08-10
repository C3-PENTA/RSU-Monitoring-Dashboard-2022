import { AxiosRequestConfig } from 'axios';
import { from } from 'rxjs';
import { APIs } from '@/config/httpConfig/apis';
import { http } from '@/helper/http';
import { IListEventReq, IListEventResData } from '@/interface/interfaceListEvent';

export const getListEvent = (payload: IListEventReq, config: AxiosRequestConfig) =>
  from(http.post<IListEventResData>(APIs.GET_LIST_EVENT, payload, config));

export const getListEventPaging = (payload: IListEventReq, config?: AxiosRequestConfig) =>
  from(http.post<IListEventResData>(APIs.GET_LIST_EVENT_PAGING, payload, config));
