import { ErrorCode } from './httpConfig/apis';
import { socket } from './httpConfig/socket';
import { INotiConfig } from '@/interface/interfaceNotification';

import { ExclamationMark, QuestionMark, Virus, WifiOff } from 'tabler-icons-react';

export const notificationConfig: INotiConfig[] = [
  {
    code: ErrorCode.ERR,
    message: 'common.error.sth_wrong',
    color: 'red',
    icon: <ExclamationMark />,
  },
  {
    code: ErrorCode.ERR_SOCKET,
    title: 'common.error.socket.title',
    message: 'common.error.socket.message',
    color: 'red',
    icon: <WifiOff />,
    autoClose: false,
    onClose: () => socket.connect(),
  },
  {
    code: ErrorCode.ERR_SOCKET_DEVICE_NOTFOUND,
    title: 'common.error.device_notfound.title',
    message: '',
    color: 'red',
    icon: <QuestionMark />,
  },
  {
    code: ErrorCode.ERR_VIRUS,
    title: 'common.error.virus.title',
    message: '',
    color: 'red',
    icon: <Virus />,
  },
  {
    code: ErrorCode.ERR_EXCEED_THRESHOLD,
    title: 'common.error.exceed_threshold.title',
    message: '',
    color: 'red',
    icon: <ExclamationMark />,
  },
  {
    code: ErrorCode.ERR_NETWORK,
    title: 'common.error.network.title',
    message: 'common.error.network.message',
    color: 'red',
    icon: <WifiOff />,
  },
];
