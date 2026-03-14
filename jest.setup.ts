import '@testing-library/jest-native/extend-expect';

jest.mock('@react-native-async-storage/async-storage', () => {
  const storage = new Map<string, string>();

  return {
    setItem: jest.fn(async (key: string, value: string) => {
      storage.set(key, value);
    }),
    getItem: jest.fn(async (key: string) => storage.get(key) ?? null),
    removeItem: jest.fn(async (key: string) => {
      storage.delete(key);
    }),
    clear: jest.fn(async () => {
      storage.clear();
    }),
  };
});

jest.mock('react-native-fs', () => ({
  CachesDirectoryPath: '/tmp',
  mkdir: jest.fn(async () => undefined),
  readFile: jest.fn(async () => ''),
  unlink: jest.fn(async () => undefined),
}));

jest.mock('react-native-zip-archive', () => ({
  unzip: jest.fn(async () => '/tmp/unzipped'),
}));

jest.mock('react-native-document-picker', () => ({
  types: {allFiles: '*/*'},
  pickSingle: jest.fn(async () => null),
}));

jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(async () => ({didCancel: true})),
  launchImageLibrary: jest.fn(async () => ({didCancel: true})),
}));

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
}));
