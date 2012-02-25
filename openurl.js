var format = require('util').format,
    spawn = require('child_process').spawn;

var command;

switch(process.platform) {
  case 'darwin':
    command = 'open';
    break;
  case 'win32':
    command = 'explorer.exe';
    break;
  case 'linux':
    command = 'xdg-open';
    break;
  default:
    throw new Error('Unsupported platform: ' + process.platform);
}

/**
 * Error handling is deliberately minimal, as this function is to be easy to use for shell scripting
 *
 * @param url The URL to open
 * @param callback A 0-argument function called after everything finishes successfully
 */

exports.open = function(url, callback) {
  spawn(command, [url], function(error, stdout, stderr) {
    if (error) {
      throw error;
    }
    else {
      callback();
    }
  });
}