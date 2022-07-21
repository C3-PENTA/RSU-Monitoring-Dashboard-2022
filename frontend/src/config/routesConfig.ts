import { lazy } from 'react';
import { IRoute } from '@/interface/interfaceCommon';
import { Path } from './path';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ListEvent = lazy(() => import('@/pages/ListEvent'));
const ListEventPaging = lazy(() => import('@/pages/ListEventPaging'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const routesConfig: IRoute[] = [
  {
    path: Path.DASHBOARD,
    component: Dashboard,
  },
  {
    path: Path.LIST_EVENT,
    component: ListEvent,
  },
  {
    path: Path.LIST_EVENT_PAGING,
    component: ListEventPaging,
  },
  {
    path: Path.UNDEFINED,
    component: NotFound,
  },
];

export default routesConfig;
