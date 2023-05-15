declare module 'stormlib-node' {
  export type HANDLE = bigint;

  export type SFILE_FIND_DATA = {
    cFileName: string;
    szPlainName: string;
    dwHashIndex: number;
    dwBlockIndex: number;
    dwFileSize: number;
    dwCompSize: number;
    dwFileTimeLo: number;
    dwFileTimeHi: number;
    lcLocale: number;
  };

  // Manipulating MPQ archives
  export function SFileOpenArchive(szMpqName: string, dwFlags: number): HANDLE;
  export function SFileCreateArchive(
    szMpqName: string,
    dwCreateFlags: number,
    dwMaxFileCount: number
  ): HANDLE;
  export function SFileFlushArchive(hMpq: HANDLE): void;
  export function SFileCloseArchive(hMpq: HANDLE): void;

  // Using patched archives

  // Reading files
  export function SFileOpenFileEx(
    hMpq: HANDLE,
    szFileName: string,
    dwSearchScope: number
  ): HANDLE;
  export function SFileReadFile(hFile: HANDLE, lpBuffer: ArrayBuffer): void;
  export function SFileCloseFile(hFile: HANDLE): void;

  // File searching
  export function SFileFindFirstFile(
    hMpq: HANDLE,
    szMask: string
  ): SFILE_FIND_DATA & { hFind: HANDLE };
  export function SFileFindNextFile(hFind: HANDLE): SFILE_FIND_DATA | null;
  export function SFileFindClose(hFind: HANDLE): void;

  // Adding files to MPQ
  export function SFileCreateFile(
    hMpq: HANDLE,
    szArchivedName: string,
    dwFileSize: number,
    lcLocale: number,
    dwFlags: number
  ): HANDLE;
  export function SFileWriteFile(
    hFile: HANDLE,
    pvData: ArrayBuffer,
    dwCompression: number
  ): void;
  export function SFileFinishFile(hFile: HANDLE): void;

  // Compression functions
}
