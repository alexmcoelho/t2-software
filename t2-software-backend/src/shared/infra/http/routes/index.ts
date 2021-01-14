import { Router } from 'express';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessiosRouter from '@modules/users/infra/http/routes/sessions.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';

const routes = Router();
routes.use('/users', usersRouter);
routes.use('/sessions', sessiosRouter);
routes.use('/profile', profileRouter);

export default routes;
