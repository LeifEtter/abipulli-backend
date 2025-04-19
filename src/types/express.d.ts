import "express";

interface AppLocals {
  user: ResponseLocalsUser;
  params: ResponseLocalsParams;
}

declare global {
  namespace Express {
    interface Locals extends AppLocals {}
  }
}
