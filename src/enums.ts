export enum HASH_TABLE_SIZE {
  MIN = 0x04,
  MAX = 0x80000
}

export enum STREAM_PROVIDER {
  /**
   * The MPQ is plain linear file. The file can have a block bitmap at the end, indicating that some file blocks may be missing. This is the default value.
   */
  FLAT = 0x0000,
  /**
   * The MPQ is stored in partial file. Partial files were used by trial version of World of Warcraft (build 10958 - 11685).
   */
  PARTIAL = 0x0010,
  /**
   * The MPQ is encrypted (.MPQE). Encrypted MPQs are used by Starcraft II and Diablo III installers. StormLib attempts to use all known keys. If no key can be used for decrypting the MPQ, the open operation fails.
   */
  MPQE = 0x0020,
  /**
   * The MPQ divided to multiple blocks and multiple files. Size of one block is 0x4000 bytes, maximum number of blocks per file is 0x2000. Each block is followed by MD5 hash in plain ANSI text form. If the total number of blocks in the archive is greater than 0x2000, then the archive is split into multiple files. These files have decimal numeric extensions in ascending order (.MPQ.0, .MPQ.1, .MPQ.2 and so on).
   */
  BLOCK4 = 0x0030,
  /**
   * The MPQ is in local file. This is the default value.
   */
  FILE = 0x0000
}

export enum BASE_PROVIDER {
  /**
   * The MPQ is in local file. Stormlib will attempt to map the file into memory. This speeds up the MPQ operations (reading, verifying), but has size and operating system limitations.
   */
  MAP = 0x0001,
  /**
   * The MPQ is on a web server available via HTTP protocol. The server must support random access. Only supported in Windows.
   */
  HTTP = 0x0002
}

export enum STREAM_FLAG {
  /**
   * This flag causes the file to be open read-only. This flag is automatically set for partial and encrypted MPQs, and also for all MPQs that are not open from BASE_PROVIDER_FILE. */
  READ_ONLY = 0x00000100,
  /**
   * This flag causes the writable MPQ being open for write share. Use with caution. If two applications write to an open MPQ simultaneously, the MPQ data get corrupted. */
  WRITE_SHARE = 0x00000200,
  /**
   * This flag tells the file stream handler to respect a file bitmap. File bitmap is used by MPQs whose file blocks are downloaded on demand by the game.
   */
  USE_BITMAP = 0x00000400
}

export enum MPQ_OPEN {
  /**
   * Don't read the internal listfile.
   */
  NO_LISTFILE = 0x00010000,
  /**
   * Don't open the "(attributes)" file.
   */
  NO_ATTRIBUTES = 0x00020000,
  /**
   * Do not search the header at 0x200 byte offsets.
   */
  NO_HEADER_SEARCH = 0x00040000,
  /**
   * Forces the MPQ to be open as MPQ format 1.0, ignoring "wFormatVersion" variable in the header.
   */
  FORCE_MPQ_V1 = 0x00080000,
  /**
   * SFileReadFile will check CRC of each file sector on any file in the archive until the archive is closed.
   */
  CHECK_SECTOR_CRC = 0x00100000
}

export enum MPQ_CREATE {
  /**
   * The newly created archive will have (listfile) present.
Note that all archives created by SFileCreateArchive have listfile present due to compatibility reasons.
   */
  LISTFILE = 0x00100000,
  /**
   * The newly created archive will have additional attributes in (attributes) file.
   */
  ATTRIBUTES = 0x00200000,
  /**
   * The newly created archive will be signed with weak digital signature (the "(signature) file).
   */
  SIGNATURE = 0x00400000,
  /**
   * The function creates a MPQ version 1.0 (up to 4 GB). This is the default value
   */
  ARCHIVE_V1 = 0x00000000,
  /**
   * The function creates a MPQ version 2.0 (supports MPQ of size greater than 4 GB).
   */
  ARCHIVE_V2 = 0x01000000,
  /**
   * The function creates a MPQ version 3.0 (introduced in WoW-Cataclysm Beta).
   */
  ARCHIVE_V3 = 0x02000000,
  /**
   * The function creates a MPQ version 4.0 (used in WoW-Cataclysm).
   */
  ARCHIVE_V4 = 0x03000000
}
