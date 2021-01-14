import { injectable, inject } from 'tsyringe';
import { cpf as cpfValidate } from 'cpf-cnpj-validator';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IFindAllProvidersDTO from '../dtos/IFindAllProvidersDTO';

interface IRequestCreate {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  password: string;
}

interface IRequestUpdate {
  userId: string;
  idUserUpdate: string;
  name: string;
  phone: string;
  cpf: string;
}

interface IRequestDelete {
  userId: string;
  idUserDelete: string;
}

@injectable()
class CreateUserService {
  private usersRepository: IUsersRepository;

  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
    @inject('HashProvider')
    hashProvider: IHashProvider,
  ) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  public async create({
    name,
    email,
    phone,
    cpf,
    password,
  }: IRequestCreate): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    if (!cpfValidate.isValid(cpf)) {
      throw new AppError('CPF invalid.');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);
    const cpfReplace = cpf.replace(/([^\d])+/g, '');
    const phoneReplace = phone.replace(/([^\d])+/g, '');

    const user = await this.usersRepository.create({
      name,
      email,
      phone: phoneReplace,
      cpf: cpfReplace,
      password: hashedPassword,
    });

    return user;
  }

  public async update({
    userId,
    idUserUpdate,
    name,
    phone,
    cpf,
  }: IRequestUpdate): Promise<User> {
    if (idUserUpdate === userId) {
      throw new AppError('You cannot edit your user by this path.');
    }
    const user = await this.usersRepository.findById(idUserUpdate);
    if (!user) {
      throw new AppError('User not found.');
    }

    if (!cpfValidate.isValid(cpf)) {
      throw new AppError('CPF invalid.');
    }

    user.name = name;
    user.phone = phone.replace(/([^\d])+/g, '');
    user.cpf = cpf.replace(/([^\d])+/g, '');

    return this.usersRepository.save(user);
  }

  public async delete({ userId, idUserDelete }: IRequestDelete): Promise<void> {
    if (idUserDelete === userId) {
      throw new AppError('You cannot edit your user by this path.');
    }
    const user = await this.usersRepository.findById(idUserDelete);
    if (!user) {
      throw new AppError('User not found.');
    }

    this.usersRepository.delete(user.id);
  }

  public async findAll({
    linesPerPage,
    page,
  }: IFindAllProvidersDTO): Promise<[User[], number]> {
    const [users, total] = await this.usersRepository.findAllProviders({
      linesPerPage,
      page,
    });

    return [users, total];
  }
}

export default CreateUserService;
