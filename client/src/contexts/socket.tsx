import React from 'react';
import io from "socket.io-client"; 
import { REACT_APP_SOCKET_URL } from '../SocketConfig';

export const socket = io(REACT_APP_SOCKET_URL, { transports : ['websocket'] });
export const SocketContext = React.createContext(socket);