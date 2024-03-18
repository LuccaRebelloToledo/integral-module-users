declare namespace Express {
  type SessionUser = {
    id: string;
  };

  export interface Request {
    user: SessionUser;
  }
}
