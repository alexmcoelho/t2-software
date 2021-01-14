import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to updade the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '(47) 3533-333',
      cpf: '165.432.190-76',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      userId: user.id.toString(),
      name: 'John Trê',
      email: 'johntre@example.com',
      phone: '(47) 3533-333',
      cpf: '165.432.190-76',
    });

    expect(updatedUser.name).toBe('John Trê');
    expect(updatedUser.email).toBe('johntre@example.com');
  });

  it('should be able to updade the profile from non-existing user', async () => {
    await expect(
      updateProfileService.execute({
        userId: 'non-existing-user-id',
        name: 'Teste',
        email: 'teste@example.com',
        phone: '(47) 3533-333',
        cpf: '165.432.190-76',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to change another user email', async () => {
    // aqui também poderia usar o FakeUserRepository
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(47) 3533-333',
      cpf: '165.432.190-76',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@example.com',
      phone: '(47) 3533-333',
      cpf: '165.432.190-76',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        userId: user.id.toString(),
        name: 'John Trê',
        email: 'johndoe@example.com',
        phone: '(47) 3533-333',
        cpf: '165.432.190-76',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(47) 3533-333',
      cpf: '165.432.190-76',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      userId: user.id.toString(),
      name: 'John Trê',
      email: 'johntre@example.com',
      phone: '(47) 3533-333',
      cpf: '165.432.190-76',
      oldPassword: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(47) 3533-333',
      cpf: '165.432.190-76',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        userId: user.id.toString(),
        name: 'John Trê',
        email: 'johntre@example.com',
        phone: '(47) 3533-333',
        cpf: '165.432.190-76',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password without wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(47) 3533-333',
      cpf: '165.432.190-76',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        userId: user.id.toString(),
        name: 'John Trê',
        email: 'johntre@example.com',
        phone: '(47) 3533-333',
        cpf: '165.432.190-76',
        oldPassword: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
