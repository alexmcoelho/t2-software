import { MongoRepository, getMongoRepository } from 'typeorm';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import { ObjectId } from 'mongodb';

class UsersRepository implements IUsersRepository {
  private ormRepository: MongoRepository<User>;

  constructor() {
    this.ormRepository = getMongoRepository(User, 'mongo');
  }

  public async findById(id: string | undefined): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });
    return user;
  }

  public async findAllProviders({
    linesPerPage,
    page,
  }: IFindAllProvidersDTO): Promise<[User[], number]> {
    let users = [];
    let total = 0;

    const startIndex = page * linesPerPage;

    [users, total] = await this.ormRepository.findAndCount({
      take: linesPerPage,
      skip: startIndex,
    });
    return [users, total];
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);
    await this.ormRepository.save(user);
    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async delete(id: ObjectId): Promise<void> {
    this.ormRepository.delete(id.toString());
  }
}

export default UsersRepository;
