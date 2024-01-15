import session from 'express-session';

import { addDays } from 'date-fns';

const sessionConfig = session({
  secret: process.env.SESSION_SECRET!,
  name: 'token',
  saveUninitialized: false,
  resave: false,
  cookie: {
    path: '/api',
    expires: addDays(new Date(), 1),
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    signed: true,
    secure: true,
    sameSite: true,
  },
});

export default sessionConfig;
