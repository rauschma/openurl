var spawn = require('child_process').spawn;

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
    var child = spawn(command, [url]);
    var errorText = "";
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
        errorText += data;
    });
    child.stderr.on('end', function () {
        if (errorText.length > 0) {
            var error = new Error(errorText);
            if (callback) {
                callback(error);
            } else {
                if(!options.silent) {
                    console.error(error.message);
                }
            }
        }
        else if (callback) {
            callback();
        }
    });
}

/**
 * @param fields Common fields are: "subject", "body".
 *     Some email apps let you specify arbitrary headers here.
 * @param recipientsSeparator Default is ",". Use ";" for Outlook.
 */
function mailto(recipients, fields, recipientsSeparator, ...openargs) {
    recipientsSeparator = recipientsSeparator || ",";

    var url = "mailto:"+recipients.join(recipientsSeparator);
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