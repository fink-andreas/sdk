
/// <reference path="../lib/innovaphone.lib.js" />

var innovaphone = innovaphone || {};
innovaphone.phpsession = innovaphone.phpsession || (function () {

    // Constructor
    function Session(url, app, appStart) {
        var instance = this,
            url = url;

        window.addEventListener('message', onpostmessage);
        innovaphone.lib.submitGet(url + "?mt=AppChallenge", onchallenge);


        function onchallenge(text) {
            obj = JSON.parse(text);
            if (obj && obj.mt) {
                if (obj.mt == "AppChallengeResult") {
                    window.parent.postMessage(JSON.stringify({ mt: "getLogin", app: app, challenge: obj.challenge }), "*");
                }
            }
        }

        function onpostmessage(e) {
            obj = JSON.parse(e.data);
            if (obj.mt && obj.mt == "Login") {
                console.log(app + ": AppLogin(" + obj.sip + "@" + obj.domain + ")");
                innovaphone.lib.submitGet(url + "?mt=AppLogin&app=" + encodeURIComponent(obj.app) + "&domain=" + encodeURIComponent(obj.domain) + "&sip=" + encodeURIComponent(obj.sip) + "&guid=" + encodeURIComponent(obj.guid) + "&dn=" + encodeURIComponent(obj.dn) + (obj.info ? "&info=" + encodeURIComponent(JSON.stringify(obj.info)) : "") + "&digest=" + encodeURIComponent(obj.digest), onlogin);
            }
        }

        function onlogin(text) {
            obj = JSON.parse(text);
            if (obj && obj.mt && obj.mt == "AppLoginResult" && obj.ok) {
                var u = location.href.substring(0, location.href.lastIndexOf("/") + 1);
                location.href = u + appStart;
            }
        }
    }

    // public API
    return Session;
})();
