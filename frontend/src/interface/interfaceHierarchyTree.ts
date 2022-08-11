import { CSSProperties } from 'react';

export type NodeData = {
  label: JSX.Element | string;
  sourceHandlerIDs?: string[];
  targetHandlerIDs?: string[];
};

export enum ENodeStatus {
  DRIVING = 1,
  STOP = 0,
  TURN_AROUND = 2,
  PASS = 3,
  VIRUS_EXCEED = 4,
}

export interface IDiagramDataCommon {
  id: string;
  type?: string;
  connectionFlow?: 'normal' | 'reverse'; // 2-way connection. "normal": parent to children, "reverse": reverse
  edgeAnimated?: boolean;
  edgeStyle?: CSSProperties;
  nodeStatus?: ENodeStatus;
  isRoot?: boolean;
}

export interface IDiagramData extends IDiagramDataCommon {
  label: NodeData['label'];
  source?: IDiagramDataCommon['id'] | IDiagramDataCommon[]; // source edge/connection
}

export interface IStatusConfig {
  key: keyof typeof ENodeStatus;
  className?: string;
  status: ENodeStatus;
  icon?: string;
  label: string;
  color?: string;
}

export interface IDiagramDeviceEDGE {
  id: string;
  name: string;
  listRsu: IDiagramDeviceRSU[];
  createdAt: string;
  updatedAt: string;
}

export interface IDiagramDeviceRSU {
  id: string;
  name: string;
  cpu: number;
  ram: number;
  rx: number;
  tx: number;
  listObu: IDiagramDeviceOBU[];
  createdAt: string;
  updatedAt: string;
}

export interface IDiagramDeviceOBU {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDiagramResData {
  listEdge: IDiagramDeviceEDGE[];
}
