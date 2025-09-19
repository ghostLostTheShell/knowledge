"use strict";

var path = require('path');

var _require = require('vscode-test'),
    runTests = _require.runTests;

function main() {
  var extensionDevelopmentPath, extensionTestsPath;
  return regeneratorRuntime.async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // The folder containing the Extension Manifest package.json
          // Passed to `--extensionDevelopmentPath`
          extensionDevelopmentPath = path.resolve(__dirname, '../'); // The path to the extension test script
          // Passed to --extensionTestsPath

          extensionTestsPath = path.resolve(__dirname, './suite/index'); // Download VS Code, unzip it and run the integration test

          _context.next = 5;
          return regeneratorRuntime.awrap(runTests({
            extensionDevelopmentPath: extensionDevelopmentPath,
            extensionTestsPath: extensionTestsPath
          }));

        case 5:
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error('Failed to run tests');
          process.exit(1);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}

main();