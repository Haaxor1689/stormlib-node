#include <napi.h>
#include <StormLib.h>
#include "iostream"

auto ReadHandle(const Napi::Value &value)
{
  bool lossless;
  return (HANDLE)value.As<Napi::BigInt>().Uint64Value(&lossless);
}

auto ThrowError(const Napi::Env &env, const std::string &message)
{
  auto err = GetLastError();
  Napi::Error::New(env, "Failed to " + message + " (ERR:" + std::to_string(err) + ")").ThrowAsJavaScriptException();
}

Napi::Value _SFileOpenArchive(const Napi::CallbackInfo &info)
{
  auto env = info.Env();

  // Get the archive filename and open mode from the arguments
  auto szMpqName = info[0].As<Napi::String>().Utf8Value();
  auto dwFlags = info[1].As<Napi::Number>().Int32Value();

  // Open the archive
  HANDLE hMpq;
  if (!SFileOpenArchive(szMpqName.c_str(), dwFlags, 0, &hMpq))
    ThrowError(env, "open archive");

  // Wrap the archive handle in a Napi::BigInt object
  return Napi::BigInt::New(env, (uint64_t)hMpq);
}

Napi::Value _SFileCreateArchive(const Napi::CallbackInfo &info)
{
  auto env = info.Env();

  auto szMpqName = info[0].As<Napi::String>().Utf8Value();
  auto dwCreateFlags = info[1].As<Napi::Number>().Int32Value();
  auto dwMaxFileCount = info[2].As<Napi::Number>().Int32Value();

  HANDLE hMpq;
  if (!SFileCreateArchive(szMpqName.c_str(), dwCreateFlags, dwMaxFileCount, &hMpq))
    ThrowError(env, "create archive");

  return Napi::BigInt::New(env, (uint64_t)hMpq);
}

void _SFileFlushArchive(const Napi::CallbackInfo &info)
{
  auto env = info.Env();

  auto hMpq = ReadHandle(info[0]);

  if (!SFileFlushArchive(hMpq))
    ThrowError(env, "flush archive");
}

void _SFileCloseArchive(const Napi::CallbackInfo &info)
{
  auto env = info.Env();

  auto hMpq = ReadHandle(info[0]);

  // Close the archive
  if (!SFileCloseArchive(hMpq))
    ThrowError(env, "close archive");
}

void _SFileCompactArchive(const Napi::CallbackInfo &info)
{
  auto env = info.Env();

  auto hMpq = ReadHandle(info[0]);

  std::string szListFile;
  if (info.Length() > 1 && info[1].IsString())
    auto szListFile = info[1].As<Napi::String>().Utf8Value();

  // Close the archive
  if (!SFileCompactArchive(hMpq, szListFile.empty() ? nullptr : szListFile.c_str(), 0))
    ThrowError(env, "compact archive");
}

Napi::Value _SFileOpenFileEx(const Napi::CallbackInfo &info)
{
  auto env = info.Env();

  auto hMpq = ReadHandle(info[0]);
  auto szFileName = info[1].As<Napi::String>().Utf8Value();
  auto dwSearchScope = info[2].As<Napi::Number>().Int32Value();

  HANDLE hFile;
  if (!SFileOpenFileEx(hMpq, szFileName.c_str(), dwSearchScope, &hFile))
    ThrowError(env, "open file");

  return Napi::BigInt::New(env, (uint64_t)hFile);
}

Napi::Value _SFileGetFileSize(const Napi::CallbackInfo &info)
{
  auto env = info.Env();

  auto hFile = ReadHandle(info[0]);

  DWORD pdwFileSizeHigh;
  DWORD pdwFileSizeLow = SFileGetFileSize(hFile, &pdwFileSizeHigh);
  if (pdwFileSizeLow == SFILE_INVALID_SIZE)
    ThrowError(env, "get file size");

  return Napi::BigInt::New(env, (uint64_t)((ULONGLONG)pdwFileSizeHigh << 32) | pdwFileSizeLow);
}

void _SFileReadFile(const Napi::CallbackInfo &info)
{
  auto env = info.Env();

  auto hFile = ReadHandle(info[0]);
  auto lpBuffer = info[1].As<Napi::ArrayBuffer>();

  DWORD pdwRead;
  if (!SFileReadFile(hFile, lpBuffer.Data(), lpBuffer.ByteLength(), &pdwRead, nullptr))
    ThrowError(env, "read file");
}

void _SFileCloseFile(const Napi::CallbackInfo &info)
{
  auto env = info.Env();

  auto hFile = ReadHandle(info[0]);
  if (!SFileCloseFile(hFile))
    ThrowError(env, "close file");
}

Napi::Value _SFileHasFile(const Napi::CallbackInfo &info)
{
  auto env = info.Env();

  auto hMpq = ReadHandle(info[0]);
  auto szFileName = info[1].As<Napi::String>().Utf8Value();

  if (!SFileHasFile(hMpq, szFileName.c_str()))
  {
    if (GetLastError() == ERROR_FILE_NOT_FOUND)
      return Napi::Boolean::New(env, false);
    ThrowError(env, "check file");
  }

  return Napi::Boolean::New(env, true);
}

Napi::Value _SFileFindFirstFile(const Napi::CallbackInfo &info)
{
  auto env = info.Env();

  auto hMpq = ReadHandle(info[0]);
  auto szMask = info[1].As<Napi::String>().Utf8Value();

  SFILE_FIND_DATA lpFindFileData;
  auto hFind = SFileFindFirstFile(hMpq, szMask.c_str(), &lpFindFileData, nullptr);

  if (hFind == nullptr)
    ThrowError(env, "find firt file");

  Napi::Object obj = Napi::Object::New(env);
  obj.Set(Napi::String::New(env, "hFind"), Napi::BigInt::New(env, (uint64_t)hFind));
  obj.Set(Napi::String::New(env, "cFileName"), Napi::String::New(env, lpFindFileData.cFileName));
  obj.Set(Napi::String::New(env, "szPlainName"), Napi::String::New(env, lpFindFileData.szPlainName));
  obj.Set(Napi::String::New(env, "dwHashIndex"), Napi::Number::New(env, lpFindFileData.dwHashIndex));
  obj.Set(Napi::String::New(env, "dwBlockIndex"), Napi::Number::New(env, lpFindFileData.dwBlockIndex));
  obj.Set(Napi::String::New(env, "dwFileSize"), Napi::Number::New(env, lpFindFileData.dwFileSize));
  obj.Set(Napi::String::New(env, "dwCompSize"), Napi::Number::New(env, lpFindFileData.dwCompSize));
  obj.Set(Napi::String::New(env, "dwFileTimeLo"), Napi::Number::New(env, lpFindFileData.dwFileTimeLo));
  obj.Set(Napi::String::New(env, "dwFileTimeHi"), Napi::Number::New(env, lpFindFileData.dwFileTimeHi));
  obj.Set(Napi::String::New(env, "lcLocale"), Napi::Number::New(env, lpFindFileData.lcLocale));

  return obj;
}

Napi::Value _SFileFindNextFile(const Napi::CallbackInfo &info)
{
  auto env = info.Env();

  auto hFind = ReadHandle(info[0]);

  // Find the next file
  SFILE_FIND_DATA lpFindFileData;
  if (!SFileFindNextFile(hFind, &lpFindFileData))
  {
    if (GetLastError() == ERROR_NO_MORE_FILES)
      return env.Null();
    ThrowError(env, "find next file");
  }

  Napi::Object obj = Napi::Object::New(env);
  obj.Set(Napi::String::New(env, "cFileName"), Napi::String::New(env, lpFindFileData.cFileName));
  obj.Set(Napi::String::New(env, "szPlainName"), Napi::String::New(env, lpFindFileData.szPlainName));
  obj.Set(Napi::String::New(env, "dwHashIndex"), Napi::Number::New(env, lpFindFileData.dwHashIndex));
  obj.Set(Napi::String::New(env, "dwBlockIndex"), Napi::Number::New(env, lpFindFileData.dwBlockIndex));
  obj.Set(Napi::String::New(env, "dwFileSize"), Napi::Number::New(env, lpFindFileData.dwFileSize));
  obj.Set(Napi::String::New(env, "dwCompSize"), Napi::Number::New(env, lpFindFileData.dwCompSize));
  obj.Set(Napi::String::New(env, "dwFileTimeLo"), Napi::Number::New(env, lpFindFileData.dwFileTimeLo));
  obj.Set(Napi::String::New(env, "dwFileTimeHi"), Napi::Number::New(env, lpFindFileData.dwFileTimeHi));
  obj.Set(Napi::String::New(env, "lcLocale"), Napi::Number::New(env, lpFindFileData.lcLocale));

  return obj;
}

void _SFileFindClose(const Napi::CallbackInfo &info)
{
  auto env = info.Env();

  auto hFind = ReadHandle(info[0]);

  if (!SFileFindClose(hFind))
    ThrowError(env, "find close file search");
}

Napi::Value _SFileCreateFile(const Napi::CallbackInfo &info)
{
  auto env = info.Env();

  auto hMpq = ReadHandle(info[0]);
  auto szArchivedName = info[1].As<Napi::String>().Utf8Value();
  auto FileTime = info[2].As<Napi::Number>().Int32Value();
  auto dwFileSize = info[3].As<Napi::Number>().Int32Value();
  auto lcLocale = info[4].As<Napi::Number>().Int32Value();
  auto dwFlags = info[5].As<Napi::Number>().Int32Value();

  HANDLE hFile;
  if (!SFileCreateFile(hMpq, szArchivedName.c_str(), (ULONGLONG)FileTime, dwFileSize, lcLocale, dwFlags, &hFile))
    ThrowError(env, "create file");

  return Napi::BigInt::New(env, (uint64_t)hFile);
}

void _SFileWriteFile(const Napi::CallbackInfo &info)
{
  auto env = info.Env();

  auto hFile = ReadHandle(info[0]);
  auto pvData = info[1].As<Napi::ArrayBuffer>();
  auto dwCompression = info[2].As<Napi::Number>().Int32Value();

  if (!SFileWriteFile(hFile, pvData.Data(), pvData.ByteLength(), dwCompression))
    ThrowError(env, "read file");
}

void _SFileFinishFile(const Napi::CallbackInfo &info)
{
  auto env = info.Env();

  auto hFile = ReadHandle(info[0]);
  if (!SFileFinishFile(hFile))
    ThrowError(env, "finish file");
}

void _SFileRemoveFile(const Napi::CallbackInfo &info)
{
  auto env = info.Env();

  auto hMpq = ReadHandle(info[0]);
  auto szFileName = info[1].As<Napi::String>().Utf8Value();

  if (!SFileRemoveFile(hMpq, szFileName.c_str(), 0))
    ThrowError(env, "remove file");
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
#define BIND(function) exports.Set(Napi::String::New(env, #function), Napi::Function::New(env, _##function))

  // Manipulating MPQ archives
  BIND(SFileOpenArchive);
  BIND(SFileCreateArchive);
  BIND(SFileFlushArchive);
  BIND(SFileCloseArchive);
  BIND(SFileCompactArchive);

  // Using patched archives
  // TODO

  // Reading files
  BIND(SFileOpenFileEx);
  BIND(SFileGetFileSize);
  BIND(SFileReadFile);
  BIND(SFileCloseFile);
  BIND(SFileHasFile);

  // File searching
  BIND(SFileFindFirstFile);
  BIND(SFileFindNextFile);
  BIND(SFileFindClose);

  // Adding files to MPQ
  BIND(SFileCreateFile);
  BIND(SFileWriteFile);
  BIND(SFileFinishFile);
  BIND(SFileRemoveFile);

  // Compression functions
  // TODO

  return exports;
}

NODE_API_MODULE(stormlib, Init)