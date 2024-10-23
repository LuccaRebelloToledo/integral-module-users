type SessionUser = {
  id: string;
};

export {};

declare global {
  namespace Express {
    export interface Request {
      user: SessionUser;
    }
  }
}
