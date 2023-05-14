{
  "targets": [
    {
      "target_name": "stormlib",
      "sources": [
        "src/stormlib.cc",
      ],
      "include_dirs": [
        "<(module_root_dir)/lib/src",
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "libraries": [
        "<(module_root_dir)/lib/StormLibRAS.lib",
        "<(module_root_dir)/lib/StormLib.lib",
      ],
      "defines": [
        "NAPI_DISABLE_CPP_EXCEPTIONS"
      ],
    }
  ]
}