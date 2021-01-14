import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UserService from '@modules/users/services/UserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, phone, cpf, password } = request.body;
    const createUser = container.resolve(UserService);
    const user = await createUser.create({
      name,
      email,
      phone,
      cpf,
      password,
    });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, phone, cpf } = request.body;
    const userId = request.user.id;
    const { idUserUpdate } = request.params;
    const createUser = container.resolve(UserService);
    const user = await createUser.update({
      userId,
      idUserUpdate,
      name,
      phone,
      cpf,
    });

    return response.json(classToClass(user));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { idUserDelete } = request.params;
    const createUser = container.resolve(UserService);
    await createUser.delete({
      userId,
      idUserDelete,
    });

    return response.status(204).json({
      status: 'No Content',
    });
  }

  public async findAll(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const page = Number(request.query.page) || 0;
    const linesPerPage = Number(request.query.linesPerPage) || 5;
    const userService = container.resolve(UserService);
    const [users, total] = await userService.findAll({
      linesPerPage,
      page,
    });
    const results = {
      number: page,
      startIndex: page * linesPerPage,
      size: users.length,
      totalElements: total,
      totalPages: Math.ceil(total / linesPerPage),
      content: classToClass(users),
    };
    return response.json(results);
  }
}
