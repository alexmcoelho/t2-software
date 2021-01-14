export default interface IStorageProvider {
  saveFile(Ffile: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
}
