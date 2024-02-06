import { dataSourceConnection } from './data-source';

import app from './app';

import { env } from './env';

dataSourceConnection().then(() => {
  const port = env.PORT ?? 4000;

  app.listen(port, () => {
    console.log(`🚀 HTTP Server listening on port ${port}`);
  });
});
