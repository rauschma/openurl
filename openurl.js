var command;

switch (process.platform) {
    case "darwin":
        command = "open"
        break;
    case "win32":
        command = "start"
        break;
    case "linux2":
        command = "xdg-open"
        break;
    default:
        throw new Error("Unsupported platform: "+process.platform);
}

var exec = require('child_process').exec;

exports.open = function (url, callback) {
    exec(command+" "+url, function (error, stdout, stderr) {
        // Only rudimentary error handling, we want to be easy to use for shell scripting
        if (error) {
            throw error;
        } else {
            callback();
        }
    });
}
