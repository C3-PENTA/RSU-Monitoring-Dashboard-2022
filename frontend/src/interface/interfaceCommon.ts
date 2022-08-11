import { Path } from '@/config/path';
import { LazyExoticComponent } from 'react';
import { Socket } from 'socket.io-client';
import { IDiagramData } from './interfaceHierarchyTree';

/**
 * Get all 'values' of `T` interface
 */
export type TypesOf<T> = T[keyof T];

export interface IRoute {
  path: Path;
  component: LazyExoticComponent<() => JSX.Element>;
}

export type TSupportedLangCode = 'en' | 'ko';

export interface ILanguageConfig {
  lang: TSupportedLangCode;
  img: string;
  alt?: string;
  tooltip?: string;
}

export interface IPaginationData {
  hasNext?: boolean;
  size?: number;
  currentPage?: number;
  totalPages?: number;
  totalRecords?: number;
}

export interface IPagination {
  pageSizePool: number[];
}

export interface IStore extends ISystemStore, IDiagramStore {}

export interface ISystemStore {
  socket: Socket;
  isAFK: boolean;
  setIsAFK: (value: boolean) => void;
}

export interface IDiagramStore {
  rawDiagramData: IDiagramData[];
  setRawDiagramData: (rawDiagramData: IDiagramData[]) => void;
}
