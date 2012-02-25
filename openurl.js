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

// /usr/local/lib/node_modules/openurl -> /Users/rauschma/git/js/openurl
// ./node_modules/openurl -> /usr/local/lib/node_modules/openurl -> /Users/rauschma/git/js/openurl


var exec = require('child_process').exec;

export.open = function (url, callback) {
    exec(command+" "+url, callback);
}
