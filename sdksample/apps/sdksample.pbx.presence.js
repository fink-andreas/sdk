
/// <reference path="~/sdk/web/lib1/innovaphone.lib1.js" />
/// <reference path="~/sdk/web/ui1.lib/innovaphone.ui1.lib.js" />
/// <reference path="~/sdk/web/appwebsocket/innovaphone.appwebsocket.Connection.js" />
/// <reference path="lang/pbx-presencelang.en.js" />

var sdksample = sdksample || {};
sdksample.pbx = sdksample.pbx || {};
sdksample.pbx.presence = sdksample.pbx.presence || function (start) {
    var currentSip = null;
    var str = sdksample.pbxpresenceLang;

    // UI

    this.createNode("body");
    var that = this;
    var page1 = new innovaphone.ui1.Div("background-color: white; position:absolute; left: 0px; right: 0px; top: 0px; bottom: 0px;");
    var page2 = new innovaphone.ui1.Div("background-color: white; position:absolute; left: 0px; right: 0px; top: 0px; bottom: 0px; display: none;");
    this.add(page1);
    this.add(page2);

    var page1Title = new innovaphone.ui1.Div("position: absolute; top: 20px; left: 40px; right: 40px; height: 28px; border: none; border-bottom: 2px solid #808080; font-size: 16px; vertical-align: baseline;");
    var inputSip = new innovaphone.ui1.Node("input", "font-family: Titillium; font-size: 22px; margin: 0px; padding: 0px; border: none; outline: none; height: auto; width: auto; background: transparent;");
    var buttonNext = new innovaphone.ui1.Div("position: absolute; top: 20px; right: 0px; height: 30px; width: 30px; background-color: #808080; text-align: center; cursor: pointer; font-size: 22px; color:white;", ">")
    inputSip.container.setAttribute("placeholder", str.sip);
    page1Title.add(inputSip);
    page1.add(page1Title);
    page1.add(buttonNext);

    var page2Title = new innovaphone.ui1.Div("position: absolute; top: 20px; left: 40px; right: 40px; height: 28px; border: none; border-bottom: 2px solid #808080; font-size: 22px;", "endeavor");
    var buttonBack = new innovaphone.ui1.Div("position: absolute; top: 20px; left: 0px; height: 30px; width: 30px; background-color: #808080; text-align: center; cursor: pointer; font-size: 22px; color:white;", "<")
    var page2Content = new innovaphone.ui1.Div("position:absolute; top: 60px; left: 40px; right: 40px; bottom: 20px;");
    var infoTitle = new innovaphone.ui1.Div("color: #808080; margin: 10px 0px 10px 0px; font-size: 22px;", "Info");
    var infoDn = new innovaphone.ui1.Div();
    var infoNum = new innovaphone.ui1.Div();
    var infoEmail = new innovaphone.ui1.Div();
    var presenceTitle = new innovaphone.ui1.Div("color: #808080; margin: 10px 0px 10px 0px; font-size: 22px;", str.presence);
    var presenceContent = new innovaphone.ui1.Div();
    var presenceColor = new innovaphone.ui1.Div("float: left; width: 30px; height: 30px; margin-right: 10px; background-color: #808080;");
    var presenceActivity = new innovaphone.ui1.Div();
    var presenceNote = new innovaphone.ui1.Div();
    var presenceClear = new innovaphone.ui1.Div("clear: both");
    var setActivityTitle = new innovaphone.ui1.Div("color: #808080; margin: 10px 0px 10px 0px; font-size: 22px;", str.setActivity);
    var setActivityContainer = new innovaphone.ui1.Div();
    var buttonAvailable = new innovaphone.ui1.Div("cursor: pointer; float: left; width: 30px; height: 30px; margin-right: 10px; background-color: #5dd255;");
    var buttonAway = new innovaphone.ui1.Div("cursor: pointer; float: left; width: 30px; height: 30px; margin-right: 10px; background-color: #ffd200;");
    var buttonBusy = new innovaphone.ui1.Div("cursor: pointer; float: left; width: 30px; height: 30px; margin-right: 10px; background-color: #d00e0d;");
    presenceContent.add(presenceColor);
    presenceContent.add(presenceActivity);
    presenceContent.add(presenceNote);
    presenceContent.add(presenceClear);
    setActivityContainer.add(buttonAvailable);
    setActivityContainer.add(buttonAway);
    setActivityContainer.add(buttonBusy);
    page2.add(page2Title);
    page2.add(buttonBack);
    page2.add(page2Content);
    page2Content.add(infoTitle);
    page2Content.add(infoDn);
    page2Content.add(infoNum);
    page2Content.add(infoEmail);
    page2Content.add(presenceTitle);
    page2Content.add(presenceContent);
    page2Content.add(setActivityTitle);
    page2Content.add(setActivityContainer);

    inputSip.container.focus();

    function setInfo(sip, dn, num, email) {
        page2Title.container.innerText = sip || "";
        infoDn.container.innerText = dn || "";
        infoNum.container.innerText = num || "";
        infoEmail.container.innerText = email || "";
    }

    function setPresence(activity, note) {
        presenceColor.container.style.backgroundColor = activity == "available" ? "#5dd255" : activity == "away" ? "#ffd200" : activity == "busy" ? "#d00e0d" : "#808080";
        presenceActivity.container.innerText = activity || "";
        presenceNote.container.innerText = note || "";
    }

    // Interaction

    buttonNext.addEvent("click", clickNext);
    buttonBack.addEvent("click", clickBack);
    buttonAvailable.addEvent("click", clickAvailable);
    buttonAway.addEvent("click", clickAway);
    buttonBusy.addEvent("click", clickBusy);

    function clickNext() {
        currentSip = inputSip.container.value;
        app.send({ mt: "SetUser", sip: currentSip });
    }

    function clickBack() {
        currentSip = null;
        app.send({ mt: "ClearUser" });
    }

    function clickAvailable() {
        app.send({ mt: "SetActivity", activity: "available" });
    }

    function clickAway() {
        app.send({ mt: "SetActivity", activity: "away" });
    }

    function clickBusy() {
        app.send({ mt: "SetActivity", activity: "busy" });
    }

    // Functionality

    var app = new innovaphone.appwebsocket.Connection(start.url + "/pbx", start.name);
    app.onconnected = appConnected;
    app.onmessage = appMessage;

    function appConnected(domain, user, dn) {
        console.log("Presence demo");
    }

    function appMessage(message) {
        if (message.mt == "SetUserResult" && !message.error) {
            setInfo(currentSip);
            setPresence();
            page2.container.style.display = "block";
            page1.container.style.display = "none";
        }
        else if (message.mt == "ClearUserResult") {
            page1.container.style.display = "block";
            page2.container.style.display = "none";
            inputSip.container.value = "";
            inputSip.container.focus();
        }
        else if (message.mt == "Info") {
            setInfo(currentSip, message.dn, message.num, message.email);
        }
        else if (message.mt == "Presence") {
            setPresence(message.activity, message.note);
        }
    }
};

sdksample.pbx.presence.prototype = innovaphone.ui1.nodePrototype;
