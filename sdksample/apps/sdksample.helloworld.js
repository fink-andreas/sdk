
/// <reference path="~/sdk/web/lib1/innovaphone.lib1.js" />
/// <reference path="~/sdk/web/ui1.lib/innovaphone.ui1.lib.js" />
/// <reference path="~/sdk/web/appwebsocket/innovaphone.appwebsocket.Connection.js" />
/// <reference path="lang/helloworldlang.en.js" />

var sdksample = sdksample || {};
sdksample.helloworld = sdksample.helloworld || function (start) {
    this.createNode("body", null, null, "helloworld-body");
    var that = this;
    var str = sdksample.helloworldLang;

    var app = new innovaphone.appwebsocket.Connection(start.url + "/helloworld", start.name);
    app.onconnected = appConnected;
    app.onmessage = appMessage;

    function appConnected(domain, user, dn) {
        log("Connected as " + user + "@" + domain);
        app.send({ mt: "Echo", text: str.hello });
    }

    function appMessage(message) {
        console.log("Recv: " + JSON.stringify(message));
        if (message.mt == "EchoResult") {
            log(message.text);
        }
    }

    function log(text) {
        that.add(new innovaphone.ui1.Div(null, text));
    }
};

sdksample.helloworld.prototype = innovaphone.ui1.nodePrototype;
