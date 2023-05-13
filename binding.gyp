{
  "targets": [
    {
      "target_name": "stormlib",
      "sources": [
        "src/stormlib.cc",
      ],
      "include_dirs": [
        "<(module_root_dir)/stormlib/src",
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "libraries": [
        "<(module_root_dir)/stormlib/bin/StormLib/x64/ReleaseAS/StormLibRAS.lib",
        "<(module_root_dir)/stormlib/bin/StormLib_dll/x64/Release/StormLib.lib",
      ],
      "defines": [
        "NAPI_DISABLE_CPP_EXCEPTIONS"
      ],
      "copies": [
        {
        "destination": "<(module_root_dir)/build/Release/",
            "files": [
                "<(module_root_dir)/stormlib/bin/StormLib_dll/x64/Release/StormLib.dll",
            ]
        },
      ]
    }
  ]
}