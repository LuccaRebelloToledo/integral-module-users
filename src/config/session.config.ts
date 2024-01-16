import session from 'express-session';

const sessionSecret = String(process.env.SESSION_SECRET!);
const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
import { isProduction } from '@shared/infra/http/data-source';

const sessionConfig = session({
  secret: sessionSecret,
  cookie: {
    maxAge: oneDayInMilliseconds,
    httpOnly: true,
    secure: isProduction,
    sameSite: true,
  },
  resave: false,
  saveUninitialized: false,
});

export default sessionConfig;
