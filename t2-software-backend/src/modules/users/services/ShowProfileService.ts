import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestFindOne {
  userId: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) { }

  public async findOne({ userId }: IRequestFindOne): Promise<User> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found.');
    }

    delete user.password;

    return user;
  }
}

export default ShowProfileService;
