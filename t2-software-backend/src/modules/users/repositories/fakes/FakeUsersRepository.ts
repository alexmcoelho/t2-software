import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import { ObjectId } from 'mongodb';

class UsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id.toString() === id);
    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);
    return findUser;
  }

  public async findAllProviders({
    linesPerPage,
    page,
  }: IFindAllProvidersDTO): Promise<[User[], number]> {
    const list: User[] = [];
    const startIndex = page * linesPerPage;
    for (let i = startIndex; i <= linesPerPage; i++) {
      if (i <= this.users.length - 1) {
        list.push(this.users[i]);
      }
    }
    console.log('startIndex ', startIndex);
    console.log('list ', list);
    console.log('total ', this.users.length);
    return [list, this.users.length];
  }

  public async findAllTest(): Promise<User[]> {
    return this.users;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: new ObjectId() }, userData);
    this.users.push(user);
    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);
    this.users[findIndex] = user;
    return user;
  }

  public async delete(id: ObjectId): Promise<void> {
    const newUsers = this.users.filter(
      findUser => findUser.id.toString() !== id.toString(),
    );
    this.users = newUsers;
  }
}

export default UsersRepository;
