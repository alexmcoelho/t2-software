import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import UserService from './UserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let userService: UserService;

describe('UserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    userService = new UserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user and update', async () => {
    const user = await userService.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '(47) 3533-333',
      cpf: '165.432.190-76',
      password: '123456',
    });

    const userUpdate = await userService.update({
      userId: '777',
      idUserUpdate: user.id.toString(),
      name: 'John Trê',
      phone: '(47) 3533-333',
      cpf: '165.432.190-76',
    });

    expect(user).toHaveProperty('id');
    expect(userUpdate.name).toBe('John Trê');
  });

  it('should not be able to create a new user with CPF invalid', async () => {
    await expect(
      userService.create({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        phone: '(47) 3533-333',
        cpf: '000.000.000-00',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new user with same email from another', async () => {
    await userService.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '(47) 3533-333',
      cpf: '165.432.190-76',
      password: '123456',
    });

    await expect(
      userService.create({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        phone: '(47) 3533-333',
        cpf: '165.432.190-76',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new user with same email from another', async () => {
    await userService.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '(47) 3533-333',
      cpf: '165.432.190-76',
      password: '123456',
    });

    await expect(
      userService.create({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        phone: '(47) 3533-333',
        cpf: '165.432.190-76',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a user trying to update your own registration on the user registration screen. He can only change his user in the path profile', async () => {
    await expect(
      userService.update({
        userId: '777',
        idUserUpdate: '777',
        name: 'John Doe',
        phone: '(47) 3533-333',
        cpf: '000.000.000-00',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a user nonexistent', async () => {
    await expect(
      userService.update({
        userId: '7778',
        idUserUpdate: 'non-existing-user',
        name: 'John Doe',
        phone: '(47) 3533-333',
        cpf: '165.432.190-76',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user with CPF invalid', async () => {
    const user = await userService.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '(47) 3533-333',
      cpf: '165.432.190-76',
      password: '123456',
    });

    await expect(
      userService.update({
        userId: '7778',
        idUserUpdate: user.id.toString(),
        name: 'John Doe',
        phone: '(47) 3533-333',
        cpf: '000.000.000-00',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete user', async () => {
    const user = await userService.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '(47) 3533-333',
      cpf: '165.432.190-76',
      password: '123456',
    });

    await userService.delete({
      userId: '777',
      idUserDelete: user.id.toString(),
    });

    const users = await fakeUsersRepository.findAllTest();

    expect(users.length).toBe(0);
  });

  it('should be able to delete user', async () => {
    const user = await userService.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '(47) 3533-333',
      cpf: '165.432.190-76',
      password: '123456',
    });

    await userService.delete({
      userId: '777',
      idUserDelete: user.id.toString(),
    });

    const users = await fakeUsersRepository.findAllTest();

    expect(users.length).toBe(0);
  });

  it('should not be able to delete user trying to delete your own record on the user registration screen', async () => {
    await expect(
      userService.delete({
        userId: '777',
        idUserDelete: '777',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete a user nonexistent', async () => {
    await userService.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '(47) 3533-333',
      cpf: '165.432.190-76',
      password: '123456',
    });

    await expect(
      userService.delete({
        userId: '777',
        idUserDelete: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able list users', async () => {
    await userService.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '(47) 3533-333',
      cpf: '165.432.190-76',
      password: '123456',
    });

    await userService.create({
      name: 'John Doe 2',
      email: 'johndoe2@gmail.com',
      phone: '(47) 3533-333',
      cpf: '803.900.130-72',
      password: '123456',
    });

    await userService.create({
      name: 'John Doe 3',
      email: 'johndoe3@gmail.com',
      phone: '(47) 3533-333',
      cpf: '647.032.210-71',
      password: '123456',
    });

    await userService.create({
      name: 'John Doe 4',
      email: 'johndoe4@gmail.com',
      phone: '(47) 3533-333',
      cpf: '892.023.800-66',
      password: '123456',
    });

    await userService.create({
      name: 'John Doe 5',
      email: 'johndoe5@gmail.com',
      phone: '(47) 3533-333',
      cpf: '323.853.610-94',
      password: '123456',
    });

    await userService.create({
      name: 'John Doe 6',
      email: 'johndoe6@gmail.com',
      phone: '(47) 3533-333',
      cpf: '533.910.460-58',
      password: '123456',
    });

    const [users, total] = await userService.findAll({
      linesPerPage: 5,
      page: 1,
    });
    expect(users.length).toBe(1);
    expect(total).toBe(6);
  });
});
