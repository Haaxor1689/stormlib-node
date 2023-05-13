declare module 'stormlib-node' {
  type Handle = BigInt;

  function openArchive(fileName: string, mode: number): Handle;
  function closeArchive(handle: Handle): void;
}
