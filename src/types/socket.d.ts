import { Socket } from "socket.io";
import { TokenContent } from "./auth.types";

interface SocketLocals {
  user: ResponseLocalsUser;
}

declare module "socket.io" {
  interface Socket {
    data: SocketLocals;
  }
}
