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

  // -------------------------
  // Manipulating MPQ archives
  // -------------------------

  /**
   * Function **SFileOpenArchive** opens a MPQ archive. During the open operation, the archive is checked for corruptions, internal (listfile) and (attributes) are loaded, unless specified otherwise. The archive is open for read and write operations, unless `MPQ_OPEN.READ_ONLY` is specified.
   *
   * Note that StormLib maintains list of all files within the MPQ, as long as the MPQ is open. At the moment of MPQ opening, when the MPQ contains an internal list file, that listfile is parsed and all files in the listfile are checked against the hash table. Every file name that exists within the MPQ is added to the internal name list. The name list can be further extended by calling {@link SFileAddListFile}.
   *
   * @param szMpqName Archive file name to open. See Archive Name section for more information.
   * @param dwFlags Flags that specify additional options about how to open the file. Several flags can be combined that can tell StormLib where to open the MPQ from, and what's the stream type of the MPQ. Accepts combination of these flags: {@link BASE_PROVIDER}, {@link STREAM_PROVIDER}, {@link STREAM_FLAG}`
   *
   * @return The opened archive handle.
   *
   * @remarks #### Archive name
   *
   * Since StormLib version 9.00, an archive name can have a prefix specifying the type of the archive. If a prefix is specified, it has greater priority than the appropriate stream flag. The list of possible prefixes is described in the table in the Parameters section above. A short list of examples how to use name prefix is below. Note that the `"//"` after the name prefix is optional. Both `"map:C:\file.ext"` and `"map://C:\file.ext"` are allowed and are equal. The http: prefix only works in Windows.
   *
   * * `"flat-file://C:\Data\expansion.MPQ"`
   * * `"part-file://C:\Data\Installer UI 2 deDE.MPQE"`
   * * `"blk4-http://www.site.com/MPQs/alternate.MPQ"`
   * * `"http://www.site.com/MPQs/alternate.MPQ"`
   *
   * The name string can also specify a master-mirror pair. The data are primarily taken from the mirror (e.g. local file), but if they are not available, they are loaded from the master (e.g. a web file). The name of the master archive must follow the name of the mirror archive, separated by an asterisk ('*'). An example how to use a master-mirror pair is below.
   *
   * ```ts
   * SFileOpenArchive("flat-file://C:\alternate.MPQ*http://www.server.com/data/mpqs/alternate.MPQ", ...);
   * ```
   *
   * {@link Source http://www.zezula.net/en/mpq/stormlib/sfileopenarchive.html}
   */
  export function SFileOpenArchive(szMpqName: string, dwFlags: number): HANDLE;

  /**
   * Function **SFileCreateArchive** opens or creates the MPQ archive. The function can also convert an existing file to MPQ archive. The MPQ archive is always open for write operations.
   *
   *  The function internally verifies the file using SFileOpenArchive. If the file already exists and it is an MPQ archive, the function throws an error.
   *
   * @param szMpqName Archive file name to be created.
   * @param dwCreateFlags Specifies additional flags for MPQ creation process. This parameter can be combination of the following flags: {@link MPQ_CREATE}
   * @param dwMaxFileCount File count limit. The value must be in range of `HASH_TABLE.SIZE_MIN` and `HASH_TABLE.SIZE_MAX`. StormLib will automatically calculate size of hash tables and block tables from this value.
   *
   * @return The opened archive handle.
   *
   * {@link Source http://www.zezula.net/en/mpq/stormlib/sfilecreatearchive.html}
   */
  export function SFileCreateArchive(
    szMpqName: string,
    dwCreateFlags: number,
    dwMaxFileCount: number
  ): HANDLE;

  /**
   * Function **SFileFlushArchive** saves any in-memory structures to the MPQ archive on disk. Due to performance reasons, StormLib caches several data structures in memory (e.g. block table or hash table). When a file is added to the MPQ, those structures are only updated in memory. Calling **SFileFlushArchive** forces saving in-memory MPQ tables to the file, preventing a MPQ corruption incase of power down or crash of the calling application.
   *
   * Note that this function is called internally when the archive is closed.
   *
   * @param hMpq Handle to an open MPQ.
   *
   * @remarks If the archive changed since it's been open, this function saves (listfile), (attributes) and MPQ tables. If any of those steps fail, the function tries to save as much as possible, and throws. There are several conditions when this function may fail:
   *
   * * There is not enough space in the hash table.
   * * There is not enough space on the disk.
   *
   * In the latter case, the archive will most likely be corrupt. The calling application must ensure that there is enough free disk space when modifying MPQ archives.
   *
   * {@link Source http://www.zezula.net/en/mpq/stormlib/sfileflusharchive.html}
   */
  export function SFileFlushArchive(hMpq: HANDLE): void;

  /**
   * Function **SFileCloseArchive** closes the MPQ archive. All in-memory data are freed and also any unsaved MPQ tables are saved to the archive. After this function finishes, the `hMpq` handle is no longer valid and may not be used in any MPQ operations.
   *
   * Note that this function calls {@link SFileFlushArchive} internally.
   *
   * @param hMpq Handle to an open MPQ.
   *
   * {@link Source http://www.zezula.net/en/mpq/stormlib/sfileclosearchive.html}
   */
  export function SFileCloseArchive(hMpq: HANDLE): void;

  /**
   * Performs a complete archive rebuild, effectively defragmenting the MPQ archive, removing all gaps that have been created by adding, replacing, renaming or deleting files within the archive. To succeed, the function requires all files in MPQ archive to be accessible. See remarks section for more information.
   *
   * **SFileCompactArchive** might take several minutes to complete, depending on size of the archive being rebuilt.
   *
   * @param hMpq Handle to an open MPQ. The MPQ must have been open by {@link SFileOpenArchive} or created by {@link SFileCreateArchive}.
   * @param szListFile Allows to specify an additional listfile, that will be used together with internal listfile.
   *
   * @remarks It is necessary that at the moment of calling **SFileCompactArchive**, all files must be accessible. This means, that either name of each file in the MPQ must be known, or the file in MPQ must not be encrypted. During initialization phase, **SFileCompactArchive** checks if the compacting can be done and returns an error code if otherwise. Callers of **SFileCompactArchive** are recommended to provide a full listfile for the compacted archive.
   *
   * {@link Source http://www.zezula.net/en/mpq/stormlib/sfilecompactarchive.html}
   */
  export function SFileCompactArchive(hMpq: HANDLE, szListFile?: string): void;

  // ----------------------
  // Using patched archives
  // ----------------------

  // -------------
  // Reading files
  // -------------

  /**
   * Function **SFileOpenFileEx** opens a file from MPQ archive. The file is only open for read. The file must be closed by calling {@link SFileCloseFile}. All files must be closed before the MPQ archive is closed.
   *
   * @param hMpq Handle to an open archive.
   * @param szFileName Name or index of the file to open.
   * @param dwSearchScope Value that specifies how exactly the file should be open. It can be one of the following values: {@link SFILE_OPEN}
   *
   * @return HANDLE to the open file.
   *
   * @remarks The function always tries to open file with the specified locale first. If such file doesn't exist in the MPQ, the function tries to open file with neutral language ID.
   *
   * When the archive is a patched archive, then the following StormLib functions behave dfferently:
   *
   * * {@link SFileReadFile} always retrieves patched data
   * * {@link SFileGetFileSize} returns the size of patched file, which may be different from original file size.
   *
   * When the caller doesn't know the proper file name, a pseudo name can be used. The pseudo name is in the form of `File%08u.xxx` (case sensitive). The numeric part of the file is the index in the file table. The open operation succeeds only if any of the following conditions is true:
   *
   * * The file is not encrypted
   * * The file is encrypted and compressed
   * * The file is encrypted and and it's either EXE or WAV file
   *
   * {@link Source http://www.zezula.net/en/mpq/stormlib/sfileopenfileex.html}
   */
  export function SFileOpenFileEx(
    hMpq: HANDLE,
    szFileName: string,
    dwSearchScope: number
  ): HANDLE;

  /**
   * Function **SFileGetFileSize** retrieves the size of an open file.
   *
   * @param hFile Handle to an open file. The file handle must have been created by {@link SFileOpenFileEx}.
   *
   * @return The file size
   *
   * @remarks Current implementation of MPQ archives doesn't support files of size greater than 4 GB.
   *
   * {@link Source http://www.zezula.net/en/mpq/stormlib/sfilegetfilesize.html}
   */
  export function SFileGetFileSize(hFile: HANDLE): bigint;

  /**
   * Function **SFileReadFile** reads data from an open file.
   *
   * @param hFile Handle to an open file. The file handle must have been created by {@link SFileOpenFileEx}.
   * @param lpBuffer Buffer that will receive loaded data.
   *
   * {@link Source http://www.zezula.net/en/mpq/stormlib/sfilereadfile.html}
   */
  export function SFileReadFile(hFile: HANDLE, lpBuffer: ArrayBuffer): void;

  /**
   * Function **SFileCloseFile** closes an open MPQ file. All in-memory data are freed. After this function finishes, the `hFile` handle is no longer valid and must not be used in any file operations.
   *
   * @param hFile Handle to an open file.
   *
   * {@link Source http://www.zezula.net/en/mpq/stormlib/sfileclosefile.html}
   */
  export function SFileCloseFile(hFile: HANDLE): void;

  /**
   * Function **SFileHasFile** performs a quick check if a file exists within the MPQ archive. The function does not perform file open, not even internally. It merely checks hash table if the file is present.
   *
   * @param hFile Handle to an open MPQ.
   * @param szFileName Name of the file to check.
   *
   * @remarks Unlike {@link SFileOpenFileEx}, this function doesn't support checking file presence by index. If you want to know the number of entries in the block table, use {@link SFileGetFileInfo}.
   *
   * {@link Source http://www.zezula.net/en/mpq/stormlib/sfilehasfile.html}
   */
  export function SFileHasFile(hFile: HANDLE, szFileName: string): boolean;

  // --------------
  // File searching
  // --------------

  /**
   * Function **SFileFindFirstFile** searches an MPQ archive and returns name of the first file that matches the given search mask and exists in the MPQ archive. When the caller finishes searching, the returned handle must be freed by calling {@link SFileFindClose}.
   *
   * @param hMpq Handle to an open archive.
   * @param szMask Name of the search mask. `"*"` will return all files.
   *
   * @return A {@link SFILE_FIND_DATA} structure with information about the found file and a handle to the MPQ search object under `hFind` key that can be used in {@link SFileFindNextFile}.
   *
   * @remarks Note that even if names within MPQs contain "folder names", the searching functions don't support folders. The entire line in the list file is considered a file name.
   *
   * {@link Source http://www.zezula.net/en/mpq/stormlib/sfilefindfirstfile.html}
   */
  export function SFileFindFirstFile(
    hMpq: HANDLE,
    szMask: string
  ): SFILE_FIND_DATA & { hFind: HANDLE };

  /**
   * Function **SFileFindNextFile** continues search that has been initiated by {@link SFileFindFirstFile}. When the caller finishes searching, the returned handle must be freed by calling {@link SFileFindClose}.
   *
   * @param hFind Search handle. Must have been obtained by call to {@link SFileFindFirstFile}.
   *
   * @return A {@link SFILE_FIND_DATA} structure with information about the found file or null if no more files match the find criteria.
   *
   * {@link Source http://www.zezula.net/en/mpq/stormlib/sfilefindnextfile.html}
   */
  export function SFileFindNextFile(hFind: HANDLE): SFILE_FIND_DATA | null;

  /**
   * Function **SFileFindClose** closes a find handle that has been created by {@link SFileFindFirstFile}.
   *
   * @param hFind Search handle. Must have been obtained by call to {@link SFileFindFirstFile}.
   *
   * {@link Source http://www.zezula.net/en/mpq/stormlib/sfilefindclose.html}
   */
  export function SFileFindClose(hFind: HANDLE): void;

  // -------------------
  // Adding files to MPQ
  // -------------------

  /**
   * Function **SFileCreateFile** creates a new file within archive and prepares it for storing the data.
   *
   * @param hMpq Handle to an open MPQ. This handle must have been obtained by calling {@link SFileOpenArchive} or {@link SFileCreateArchive}.
   * @param szArchivedName A name under which the file will be stored into the MPQ.
   * @param FileTime Specifies the file date-time (timestamp) that will be stored into "(attributes)" file in MPQ. This parameter is optional and can be zero.
   * @param dwFileSize Specifies the size of the data that will be written to the file. This size of the file is set by the call and cannot be changed. The subsequent amount of data written must exactly match the size given by this parameter.
   * @param lcLocale Specifies the locale for the new file.
   * @param dwFlags Specifies additional options about how to add the file to the MPQ. The value of this parameter can be a combination of this enum's values: {@link MPQ_FILE}
   *
   * @return Handle to the file. Note that this handle can only be used in call to {@link SFileWriteFile} and @{@link SFileFinishFile}. This handle must never be passed to another file function. Moreover, this handle must always be freed by {@link SFileFinishFile}.
   *
   * {@link Source http://www.zezula.net/en/mpq/stormlib/sfilecreatefile.html}
   */
  export function SFileCreateFile(
    hMpq: HANDLE,
    szArchivedName: string,
    FileTime: number,
    dwFileSize: number,
    lcLocale: number,
    dwFlags: number
  ): HANDLE;

  /**
   * Function **SFileWriteFile** writes data to the archive. The file must have been created by {@link SFileCreateFile}.
   *
   * @param hFile Handle to a new file within MPQ. This handle must have been obtained by calling {@link SFileCreateFile}.
   * @param pvData Data to be written to the file.
   * @param dwCompression Specifies the type of data compression that is to be applied to the data, in case the amount of the data will reach size of one file sector. Can be one of: {@link MPQ_COMPRESSION}
   *
   * @remarks The amount of data written by one call of **SFileWriteFile** may be arbitrary. Attempt to write zero data equals to no operation and succeeds. **SFileWriteFile** collects the data into a memory buffer, up to the size of one file sector. After that, the data is compressed (if wanted), encrypted (if wanted) and flushed to the MPQ.
   *
   * The caller must make sure that the total amount of data written to the file will exactly match to the file size, specified by call to {@link SFileCreateFile}. Attempting to write more data causes the function to throw.
   *
   * The `dwCompression` only applies when amount of buffered data stored by **SFileWriteFile** reaches size of one file sector, and thus the data will be written to the MPQ. Otherwise, it has no effect.
   *
   * {@link Source http://www.zezula.net/en/mpq/stormlib/sfilewritefile.html}
   */
  export function SFileWriteFile(
    hFile: HANDLE,
    pvData: ArrayBuffer,
    dwCompression: number
  ): void;

  /**
   * Function **SFileFinishFile** finalized creation of the archived file. The file must have been created by {@link SFileCreateFile}.
   *
   * @param hFile Handle to a new file within MPQ. This handle must have been obtained by calling {@link SFileCreateFile}.
   *
   * @remarks This function flushes any file data that are remaining after previous calls of {@link SFileWriteFile}.
   *
   * The amount of data previously written by {@link SFileWriteFile} must match the total file size initiated by {@link SFileCreateFile}. If the amount of data doesn't match, the function throws.
   *
   * This function must always be called when call to {@link SFileCreateFile} succeeds, regardless of the result of {@link SFileCreateFile} or {@link SFileWriteFile}. If any of these two functions failed, StormLib cleans up the file and reverts changes caused by the file writes.
   *
   * {@link Source http://www.zezula.net/en/mpq/stormlib/sfilefinishfile.html}
   */
  export function SFileFinishFile(hFile: HANDLE): void;

  /**
   * @description Function SFileRemoveFile removes a file from MPQ. The MPQ must have been open by {@link SFileOpenArchive} or created by {@link SFileCreateArchive}. Note that this operation leaves a gap in the MPQ file. To reduce size of the MPQ, use {@link SFileCompactArchive}.
   * @param hMpq Handle to an open MPQ. This handle must have been obtained by calling {@link SFileOpenArchive} or {@link SFileCreateArchive}.
   * @param szFileName Name of a file to be removed.
   *
   * @remarks The function only removes file with the specified locale. Unlike {@link SFileOpenFileEx}, if the file with preset locale doesn't exist in the MPQ, the function fails. For more information about preset locale, see {@link SFileSetLocale}.
   *
   * {@link http://www.zezula.net/en/mpq/stormlib/sfileremovefile.html}
   */
  export function SFileRemoveFile(hMpq: HANDLE, szFileName: string): void;

  // ---------------------
  // Compression functions
  // ---------------------
}
