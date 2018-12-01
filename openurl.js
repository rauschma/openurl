var spawn = require('child_process').spawn;

var command;

switch(process.platform) {
    case 'darwin':
        command = 'open';
        break;
    case 'win32':
        command = 'start';
        break;
    default:
        command = 'xdg-open';
        break;
}

/**
 * Error handling is deliberately minimal, as this function is to be easy to use for shell scripting
 *
 * @param url The URL to open
 * @param options (optional) An object of options to pass. silent: don't log errors;
 * @param callback A function with a single error argument. Optional.
 * @returns a Promise if no callback is given
 */

function open(url, options, callback) {
    if(typeof options === 'function') {
        callback = options;
        options = {};
    }
    else {
        options = Object.assign({}, options);
    }
    if(callback === undefined) {
        return new Promise((resolve, reject) => {
            open(url, (error) => {
                if(error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            })
        });
    }

    let child = spawn(command, [url]);

    let errorText = "";
    let exitCode = null;
    let exitSignal = null;
    let endedStderr = false;
    // 'end' can be called before or after 'exit', so we need a separate method to handle the exit state
    const finish = () => {
        if (exitCode != null && exitCode != 0) {
            if(errorText.length == 0) {
                errorText = "process exited with code "+exitCode;
            }
            var error = new Error(errorText);
            if (callback) {
                callback(error);
            } else {
                if(!options.silent) {
                    console.error(error.message);
                }
            }
        } else if (callback) {
            callback();
        }
    }

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
        errorText += data;
    });
    child.stderr.on('end', function () {
        endedStderr = true;
        if(exitCode != null || exitSignal != null) {
            finish();
        }
    });
    child.on('exit', (code, signal) => {
        exitCode = code;
        exitSignal = signal;
        if(endedStderr) {
            finish();
        }
    }
}

/**
 * @param fields Common fields are: "subject", "body".
 *     Some email apps let you specify arbitrary headers here.
 * @param recipientsSeparator Default is ",". Use ";" for Outlook.
 */
function mailto(recipients, fields, recipientsSeparator, ...openargs) {
    recipientsSeparator = recipientsSeparator || ",";

    let url = "mailto:"+recipients.join(recipientsSeparator);
    Object.keys(fields).forEach(function (key, index) {
        if (index === 0) {
            url += "?";
        } else {
            url += "&";
        }
        url += key + "=" + encodeURIComponent(fields[key]);
    });
    return open(url, ...openargs);
}

exports.open = open;
exports.mailto = mailto;