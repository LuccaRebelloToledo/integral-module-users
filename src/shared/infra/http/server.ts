import { appDataSourceConnection } from './data-source';

import { env } from './env';

import app from './app';

appDataSourceConnection().then(() => {
  const port = env.PORT ?? 4000;

  app.listen(port, () => {
    console.log(`🚀 HTTP Server listening on port ${port}`);
  });
});
