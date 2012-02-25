openurl – Node.js module for opening URLs
=========================================

openurl is a Node.js module for opening a URL via the operating system. This will usually trigger actions such as:

- http URLs: open the default browser
- mailto URLs: open the default email client
- file URLs: open a window showing the directory (on OS X)

Example interaction on the Node.js REPL:

    > require("openurl").open("http://rauschma.de")
    > require("openurl").open("mailto:john@example.com")
    
Install via npm:

    npm install openurl

I’m not yet terribly familiar with implementing npm packages, so any feedback is welcome
(especially experience reports on Windows, which I can’t test on)