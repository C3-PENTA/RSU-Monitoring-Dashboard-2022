import { io } from 'socket.io-client';

export const socket = io(import.meta.env.VITE_API_SOCKET_URI);

export enum SocketEvents {
  GET_COMMUNICATION_EVENT = 'event_to_client',
}
