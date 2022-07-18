import { ENodeStatus, IStatusConfig } from '@/interface/interfaceHierarchyTree';

export const rootCoordinate = { x: 0, y: 0 };

export const defaultNodeWidth = 90;
export const defaultNodeHeight = 50;

export const NodeStatusConfig: IStatusConfig[] = [
  { key: 'STOP', status: ENodeStatus.STOP, label: 'dashboard.status.stop', color: 'red' },
  {
    key: 'DRIVING',
    status: ENodeStatus.DRIVING,
    label: 'dashboard.status.driving',
    color: 'green',
  },
  {
    key: 'TURN_AROUND',
    status: ENodeStatus.TURN_AROUND,
    label: 'dashboard.status.turn_around',
    color: 'yellow',
  },
  { key: 'PASS', status: ENodeStatus.PASS, label: 'dashboard.status.pass', color: 'blue' },
  {
    key: 'VIRUS_EXCEED',
    status: ENodeStatus.VIRUS_EXCEED,
    label: 'dashboard.status.virus',
    className: 'virus',
    color: 'purple',
  },
];
