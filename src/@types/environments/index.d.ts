interface IEnvironments {
  NODE_ENV: string;
  JWT_SECRET: string;
  DSN: string;
  PORT: number;
  PG_HOST: string;
  PG_PORT: number;
  PG_USER: string;
  PG_PASS: string;
  PG_DB: string;
}

export {};

declare global {
  namespace NodeJS {
    export interface ProcessEnv extends IEnvironments {}
  }
}
