import { container } from 'tsyringe';

import uploadConfig from '@config/upload';
import DiskStorageProvider from './implementations/DiskStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';
import IStoarageProvider from './models/IStoarageProvider';

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStoarageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);
