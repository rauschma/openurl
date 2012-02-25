var format = require("util").format;
var exec = require('child_process').exec;

var command;

switch (process.platform) {
    case "darwin":
        command = "open '%s'";
        break;
    case "win32":
        command = "start '%s'";
        break;
    case "linux2":
        command = "xdg-open '%s'";
        break;
    default:
        throw new Error("Unsupported platform: "+process.platform);
}

/**
 * Error handling is deliberately minimal, as this function is to be easy to use for shell scripting
 *
 * @param url The URL to open
 * @param callback A 0-argument function called after everything finishes successfully
 */
exports.open = function (url, callback) {
    exec(format(command, url), function (error, stdout, stderr) {
        if (error) {
            throw error;
        } else {
            callback();
        }
    });
}
