/* eslint-disable no-useless-escape */
import { Router } from 'express';
import multer from 'multer';
import { celebrate, Segments, Joi } from 'celebrate';

import uploadConfig from '@config/upload';
import ensureAuthenticated from '../middleware/ensureAuthenticated';
import UsersController from '../controllers/UsersController';
import UsersAvatarController from '../controllers/UsersAvatarController';

const usersRoutes = Router();
const upload = multer(uploadConfig.multer);
const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

usersRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string()
        .regex(/(\(?\d{2}\)?\s)?(\d{4,5})-(\d{4})/)
        .required(),
      cpf: Joi.string()
        .regex(
          /([0-9]{2}[\\.]?[0-9]{3}[\\.]?[0-9]{3}[\\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\\.]?[0-9]{3}[\\.]?[0-9]{3}[-]?[0-9]{2})/,
        )
        .required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRoutes.put(
  '/:idUserUpdate',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      phone: Joi.string()
        .regex(/(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/)
        .required(),
      cpf: Joi.string()
        .regex(
          /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/,
        )
        .required(),
    },
  }),
  usersController.update,
);

usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  usersAvatarController.update,
);

usersRoutes.delete(
  '/:idUserDelete',
  ensureAuthenticated,
  usersController.delete,
);

usersRoutes.get('/', ensureAuthenticated, usersController.findAll);

export default usersRoutes;
