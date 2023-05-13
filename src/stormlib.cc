#include <napi.h>
#include <StormLib.h>

Napi::Value OpenArchive(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  // Get the archive filename and open mode from the arguments
  std::string filename = info[0].As<Napi::String>().Utf8Value();
  int mode = info[1].As<Napi::Number>().Int32Value();

  // Open the archive
  HANDLE hArchive;
  if (!SFileOpenArchive(filename.c_str(), mode, 0, &hArchive))
  {
    Napi::Error::New(env, "Failed to open archive").ThrowAsJavaScriptException();
    return env.Undefined();
  }

  // Wrap the archive handle in a Napi::BigInt object
  return Napi::BigInt::New(env, (uint64_t)hArchive);
}

Napi::Value CloseArchive(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  // Get the archive handle from the argument
  bool success;
  HANDLE hArchive = (HANDLE)info[0].As<Napi::BigInt>().Uint64Value(&success);
  if (!success)
  {
    Napi::TypeError::New(env, "Invalid handle").ThrowAsJavaScriptException();
    return env.Null();
  }

  // Close the archive
  if (!SFileCloseArchive(hArchive))
  {
    Napi::Error::New(env, "Failed to close archive").ThrowAsJavaScriptException();
    return env.Undefined();
  }

  return env.Undefined();
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  exports.Set(Napi::String::New(env, "openArchive"), Napi::Function::New(env, OpenArchive));
  exports.Set(Napi::String::New(env, "closeArchive"), Napi::Function::New(env, CloseArchive));
  return exports;
}

NODE_API_MODULE(stormlib, Init)