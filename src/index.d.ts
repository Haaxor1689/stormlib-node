/// <reference path="../dist/enums.d.ts" />
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
  /** [Full documentation](http://www.zezula.net/en/mpq/stormlib/sfileopenarchive.html) */
  export function SFileOpenArchive(szMpqName: string, dwFlags: number): HANDLE;
  /** [Full documentation](http://www.zezula.net/en/mpq/stormlib/sfilecreatearchive.html) */
  export function SFileCreateArchive(
    szMpqName: string,
    dwCreateFlags: number,
    dwMaxFileCount: number
  ): HANDLE;
  /** [Full documentation](http://www.zezula.net/en/mpq/stormlib/sfileflusharchive.html) */
  export function SFileFlushArchive(hMpq: HANDLE): void;
  /** [Full documentation](http://www.zezula.net/en/mpq/stormlib/sfileclosearchive.html) */
  export function SFileCloseArchive(hMpq: HANDLE): void;

  // Using patched archives

  // Reading files
  /** [Full documentation](http://www.zezula.net/en/mpq/stormlib/sfileopenfileex.html) */
  export function SFileOpenFileEx(
    hMpq: HANDLE,
    szFileName: string,
    dwSearchScope: number
  ): HANDLE;
  /** [Full documentation](http://www.zezula.net/en/mpq/stormlib/sfilegetfilesize.html) */
  export function SFileGetFileSize(hFile: HANDLE): bigint;
  /** [Full documentation](http://www.zezula.net/en/mpq/stormlib/sfilereadfile.html) */
  export function SFileReadFile(hFile: HANDLE, lpBuffer: ArrayBuffer): void;
  /** [Full documentation](http://www.zezula.net/en/mpq/stormlib/sfileclosefile.html) */
  export function SFileCloseFile(hFile: HANDLE): void;
  /** [Full documentation](http://www.zezula.net/en/mpq/stormlib/sfilehasfile.html) */
  export function SFileHasFile(hFile: HANDLE, szFileName: string): boolean;

  // File searching
  /** [Full documentation](http://www.zezula.net/en/mpq/stormlib/sfilefindfirstfile.html) */
  export function SFileFindFirstFile(
    hMpq: HANDLE,
    szMask: string
  ): SFILE_FIND_DATA & { hFind: HANDLE };
  /** [Full documentation](http://www.zezula.net/en/mpq/stormlib/sfilefindnextfile.html) */
  export function SFileFindNextFile(hFind: HANDLE): SFILE_FIND_DATA | null;
  /** [Full documentation](http://www.zezula.net/en/mpq/stormlib/sfilefindclose.html) */
  export function SFileFindClose(hFind: HANDLE): void;

  // Adding files to MPQ
  /** [Full documentation](http://www.zezula.net/en/mpq/stormlib/sfilecreatefile.html) */
  export function SFileCreateFile(
    hMpq: HANDLE,
    szArchivedName: string,
    dwFileSize: number,
    lcLocale: number,
    dwFlags: number
  ): HANDLE;
  /** [Full documentation](http://www.zezula.net/en/mpq/stormlib/sfilewritefile.html) */
  export function SFileWriteFile(
    hFile: HANDLE,
    pvData: ArrayBuffer,
    dwCompression: number
  ): void;
  /** [Full documentation](http://www.zezula.net/en/mpq/stormlib/sfilefinishfile.html) */
  export function SFileFinishFile(hFile: HANDLE): void;

  // Compression functions
}
