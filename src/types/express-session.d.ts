import { SessionData } from 'express-session';

type SessionUser = {
  id: string;
};

declare module 'express-session' {
  export interface SessionData {
    user: SessionUser;
  }
}
