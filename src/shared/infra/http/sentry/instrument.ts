import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import env from "@shared/infra/environments/environments";

Sentry.init({
  dsn: env.DSN,
  environment: env.NODE_ENV,
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});