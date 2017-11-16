/// <reference path="~/sdk/web/lib1/innovaphone.lib1.js" />
/// <reference path="~/sdk/web/common/innovaphone.common.crypto.js" />

var innovaphone = innovaphone || {};

innovaphone.Avatar = innovaphone.Avatar || function (start) {
    var api = start.consumeApi("com.innovaphone.avatar"),
        base = null,
        token = null,
        salt = null;

    api.onupdate.attach(init);
    init();

    function init() {
        if (api.providers.length) {
            var model = api.model[api.providers[0]];
            var url = model.url;
            base = url.slice(0, url.lastIndexOf("/") + 1) + model.info.filename;
            token = model.info.token;
            salt = innovaphone.common.crypto.randomString(16);
        }
    }

    this.url = function (sip, size) {
        if (base) {
            return base + "?sip=" + sip + "&salt=" + salt + "&auth=" + encodeURIComponent(innovaphone.common.crypto.sha256(token + salt + sip)) + "&size=" + size;
        }
        else {
            return "";
        }
    }
}
