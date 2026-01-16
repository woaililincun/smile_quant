// Flutter web bootstrap script
(function() {
  "use strict";

  var _flutter = window._flutter = window._flutter || {};
  _flutter.loader = _flutter.loader || {};

  _flutter.loader.loadEntrypoint = function(options) {
    var serviceWorker = options.serviceWorker;
    var entrypointUrl = options.entrypointUrl || "main.dart.js";
    var onEntrypointLoaded = options.onEntrypointLoaded;

    var script = document.createElement("script");
    script.src = entrypointUrl;
    script.type = "application/javascript";
    
    // 监听脚本加载完成
    script.onload = function() {
      if (!onEntrypointLoaded) {
        return;
      }
      onEntrypointLoaded({
        initializeEngine: function(config) {
          config = config || {};
          // 这里的 appRunner 是 flutter 引擎加载后的核心对象
          return window._flutter.loader.loaderPromise.then(function(engineApp) {
             return engineApp.initializeEngine(config);
          });
        }
      });
    };

    document.body.appendChild(script);
  };

  // 简单的 Promise polyfill 模拟，用于通过 engineInitializer API
  _flutter.loader.loaderPromise = new Promise(function(resolve, reject) {
      // 这里的逻辑主要是为了兼容新版 API
      // 实际上 main.dart.js 加载后会覆盖 window._flutter.loader.loaderPromise
      // 我们只需要确保它存在即可
      window.addEventListener('flutter-first-frame', function() {
          resolve(window._flutter.appRunner);
      });
  });
}());

// 注意：这是一个简化版的加载器，专门配合强制 CanvasKit 使用。
// 它能绕过部分复杂的版本检查，直接加载 main.dart.js