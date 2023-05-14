declare module 'stormlib-node' {
  export type Handle = BigInt;

  export function openArchive(fileName: string, mode: number): Handle;
  export function closeArchive(handle: Handle): void;

  export default {
    Handle,
    openArchive,
    closeArchive
  };
}
