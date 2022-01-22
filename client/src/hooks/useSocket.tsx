import React from "react";
import { SocketContext } from "../contexts/socket";

export const useSocket = () => React.useContext(SocketContext);