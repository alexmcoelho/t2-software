import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarServices';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updadeUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updadeUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to updade avatar user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '(47) 3533-333',
      cpf: '165.432.190-76',
      password: '123456',
    });

    await updadeUserAvatar.execute({
      userId: user.id.toString(),
      avatarFileName: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar from none existing user', async () => {
    await expect(
      updadeUserAvatar.execute({
        userId: 'non-existing-user',
        avatarFileName: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when new one updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile'); // colocar função deleteFile dentro da constante

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '(47) 3533-333',
      cpf: '165.432.190-76',
      password: '123456',
    });

    await updadeUserAvatar.execute({
      userId: user.id.toString(),
      avatarFileName: 'avatar.jpg',
    });

    await updadeUserAvatar.execute({
      userId: user.id.toString(),
      avatarFileName: 'avatar-new.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg'); // espera que a função deleteFile tenha sido chamada com o parâmetro específico, no caso a descrição da imagem anterior
    expect(user.avatar).toBe('avatar-new.jpg');
  });
});
