/*---------------------------------------------------------------------------*/
/* innovaphone.appwebsocket.Connection.js                                    */
/* A client for connecting to the innovaphone PBX                            */
/*---------------------------------------------------------------------------*/

/*
 * Copyright (C) 2015 innovaphone AG
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in
 *    the documentation and/or other materials provided with the
 *    distribution.
 *  * Neither the name of the copyright holder nor the names of
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS
 * OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
 * OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

/// <reference path="../common/innovaphone.common.crypto.js" />

var innovaphone = innovaphone || {};
innovaphone.appwebsocket = innovaphone.appwebsocket || {};
innovaphone.appwebsocket.Connection = innovaphone.appwebsocket.Connection || function (url, app, password) {
    console.log("AppWebsocket(" + app + ")");
    var TIMEOUT_MIN = 1000,
        TIMEOUT_MAX = 8000,
        states = { "CONNECT": 1, "OPENED": 2, "LOGIN2": 3, "CONNECTED": 4, "CLOSED": 5 };

    var instance = this,
        url = url,
        ws = null,
        state = states.CONNECT,
        domain = null,
        user = null,
        dn = null,
        sessionKey = null,
        unique = 0,
        timeout = TIMEOUT_MIN;

    window.addEventListener('message', onpostmessage);
        
    function onopen() {
        timeout = TIMEOUT_MIN;
        console.log("opened " + ws.url + " location " + location.href);
        state = states.OPENED;
        send({ mt: "AppChallenge" });
    }

    function onmessage(message) {
        var obj = JSON.parse(message.data);
        if (obj && obj.mt) {
            console.log("recv: " + message.data);
            switch (obj.mt) {
                case "AppChallengeResult":
                    if (obj.sysClient) password = "";
                    if (password || obj.sysClient) passwordLogin(obj.challenge);
                    else if (window.self == window.top) adminLogin(obj.challenge);
                    else window.parent.postMessage(JSON.stringify({ mt: "getLogin", app: app, challenge: obj.challenge }), "*");
                    break;
                case "AppLoginResult":
                    if (obj.ok) {
                        state = states.CONNECTED;
                        instance.onconnected(domain, user, dn);
                    }
                    break;
                default:
                    if (state == states.CONNECTED) {
                        for (i = 0; i < srcs.length; i++) {
                            if (srcs[i].src == obj.src) {
                                srcs[i].onmessage(obj);
                                return;
                            }
                        }
                        instance.onmessage(obj);
                    }
                    break;
            }

        }
    }

    function onpostmessage(e) {
        obj = JSON.parse(e.data);
        if (obj.mt && obj.mt == "Login") {
            console.log(app + ": AppLogin(" + obj.sip + "@" + obj.domain + ", guid=" + obj.guid + ", dn=" + obj.dn + ", app=" + obj.app + ")");
            if (app == obj.pbxObj) login(obj);
            else delete obj.key;
        }
        else {
            instance.onFromPBX(obj);
        }
    }

    function login(obj) {
        user = obj.sip;
        domain = obj.domain;
        dn = obj.dn;
        sessionKey = obj.key;
        delete obj.key;
        send({ mt: "AppLogin", app: obj.app, domain: obj.domain, sip: obj.sip, guid: obj.guid, dn: obj.dn, info: obj.info, digest: obj.digest, pbxObj: app });
    }

    function passwordLogin(challenge) {
        var obj = new Object();
        obj.app = app;
        obj.sip = app;
        obj.domain = "";
        obj.lang = "en";
        obj.guid = "00000000000000000000000000000000";
        obj.dn = "Admin";
        obj.digest = innovaphone.common.crypto.sha256(app + ":" + obj.domain + ":" + obj.sip + ":" + obj.guid + ":" + obj.dn + ":" + challenge + ":" + password);
        obj.key = innovaphone.common.crypto.sha256("innovaphoneAppSessionKey:" + challenge + ":" + password);
        login(obj);
    }

    function adminLogin(challenge) {
        innovaphone.lib1.loadObjectScript("web/common/innovaphone.common.crypto", function () {
            var inp = document.createElement("input");
            inp.type = "password";
            inp.setAttribute("style", "position: absolute; left: 10px; top: 10px");
            inp.onkeypress = function (event) { if (event.keyCode == 13) click(); };
            document.body.appendChild(inp);
            var button = document.createElement("button");
            button.setAttribute("style", "position: absolute; left: 10px; top: 50px");
            button.innerHTML = "Login";
            document.body.appendChild(button);
            button.addEventListener('click', click);
            inp.focus();

            function click() {
                var obj = new Object();
                obj.app = app;
                obj.sip = app;
                obj.domain = "";
                obj.lang = "en";
                obj.guid = "00000000000000000000000000000000";
                obj.dn = "Admin";
                obj.digest = innovaphone.common.crypto.sha256(app + ":" + obj.domain + ":" + obj.sip + ":" + obj.guid + ":" + obj.dn + ":" + challenge + ":" + inp.value);
                obj.key = innovaphone.common.crypto.sha256("innovaphoneAppSessionKey:" + challenge + ":" + inp.value);
                login(obj);
            }
        });
    }

    function onerror(error) {
        console.log("error");
        ws.onclose = null;
        ws.onmessage = null;
        ws.onopen = null;
        ws.onerror = null;
        close("WEBSOCKET_ERROR");
    }

    function onclose() {
        console.log("closed");
        ws = null;
        close();
    }

    // general control functions
    function connect() {
        state = states.CONNECT;
        if (ws) ws.close();
        ws = new WebSocket(url);
        ws.onopen = onopen;
        ws.onmessage = onmessage;
        ws.onerror = onerror;
        ws.onclose = onclose;
    }

    function close(error) {
        if(state!=states.CONNECTED && window.self == window.top) {
            // do nothing for now
        }
        else if (state != states.CLOSED) {
            state = states.CLOSED;
            if (ws) ws.close();
            ws = null;
            if (error) instance.onerror(error);
            else instance.onclosed();
        }
        console.log("reconnect in " + timeout + "ms");
        window.setTimeout(connect, timeout);
        if (timeout < TIMEOUT_MAX) timeout *= 2;
    }

    function encrypt(seed, data) {
        return innovaphone.common.crypto.str2hex(innovaphone.common.crypto.rc4(seed + ":" + sessionKey, data));
    }

    function decrypt(seed, data) {
        return innovaphone.common.crypto.rc4(seed + ":" + sessionKey, innovaphone.common.crypto.hex2str(data));
    }

    function hash (seed, data) {
        return innovaphone.common.crypto.sha256(seed + ":" + sessionKey + ":" + data);
    }

    // outgoing messages
    // session
    function send(obj) {
        var messageJSON = JSON.stringify(obj);
        if (ws) {
            console.log("send: " + messageJSON);
            ws.send(messageJSON);
        }
        else {
            console.log("discard: " + messageJSON);
        }
    }

    function sendChallenge() {
        send({ messageType: "AppChallenge" });;
    }

    // public interface
    this.send = function (message) {
        if (state == states.CONNECTED) send(message);
    }
    this.close = function () {
        close();
    }
    this.toPBX = function (obj) {
        window.parent.postMessage(JSON.stringify(obj), "*");
    }
    this.dn = function () {
        return dn;
    }
    this.user = function () {
        return user;
    }
    this.encrypt = encrypt;
    this.decrypt = decrypt;
    this.hash = hash;

    // public event handlers
    // session
    this.onconnected = function () { };
    this.onmessage = function (message) { };
    this.onerror = function (error) { };
    this.onclosed = function () { };
    this.onFromPBX = function () { };

    // start
    connect();

    var srcs = [];
    this.src = function (src) {
        if (!src) src = "src" + unique++;
        this.src = src;
        this.onmessage = null;
        this.send = function (message) {
            message.src = src;
            send(message)
        }
        this.close = function () {
            srcs.splice(srcs.indexOf(this), 1);
        }
        for (var i = 0; i < srcs.length; i++) {
            if (srcs[i].src == src) {
                console.log("duplicate src " + src);
                srcs.splice(i, 1);
            }
        }
        srcs.push(this);

        this.encrypt = encrypt;
        this.decrypt = decrypt;
        this.hash = hash;
    }

    this.Src = function (on, src) {
        if (!src) src = "src" + unique++;
        this.src = src;
        this.onmessage = on;
        this.send = function (message) {
            message.src = src;
            send(message)
        }
        this.close = function () {
            srcs.splice(srcs.indexOf(this), 1);
        }
        for (var i = 0; i < srcs.length; i++) {
            if (srcs[i].src == src) {
                console.log("duplicate src " + src);
                srcs.splice(i, 1);
            }
        }
        srcs.push(this);

        this.encrypt = encrypt;
        this.decrypt = decrypt;
        this.hash = hash;
    }
};
