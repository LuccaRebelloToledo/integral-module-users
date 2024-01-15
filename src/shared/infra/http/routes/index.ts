import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res, next) => {
  res.json({ message: 'Hello World!' });
});

export default routes;
