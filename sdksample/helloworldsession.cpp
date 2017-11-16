#include "platform/platform.h"
#include "common/os/iomux.h"
#include "common/interface/socket.h"
#include "common/interface/webserver_plugin.h"
#include "common/interface/database.h"
#include "common/interface/json_api.h"
#include "common/ilib/json.h"
#include "common/lib/appservice.h"
#include "common/lib/appwebsocket.h"
#include "helloworldsession.h"
#include "sdkSample.h"

HelloWorldSession::HelloWorldSession(class SDKSample * sdkSample, class IWebserverPlugin * webserverPlugin) : AppWebsocket(webserverPlugin, sdkSample)
{
    this->sdkSample = sdkSample;
    this->appWebsocketClosed = true;
    this->closing = true;
}

HelloWorldSession::~HelloWorldSession()
{
    TEST_WATCH("_HelloWorldSession");
}

char * HelloWorldSession::AppWebsocketPassword()
{
    return (char *)sdkSample->GetAppPassword();
}

void HelloWorldSession::AppWebsocketMessage(class json_io & msg, word base, const char * mt, const char * src)
{
    if (!strcmp(mt, "Echo")) {
        const char * text = msg.get_string(base, "text");
        char sb[200];
        class json_io send(sb);
        word base = send.add_object(0xFFFF, 0);
        send.add_string(base, "mt", "EchoResult");
        if (text) send.add_string(base, "text", "Hi there from the PBX demo service!");
        if (src) send.add_string(base, "src", src);
        AppWebsocketMessageSend(send, sb);
        AppWebsocketMessageComplete();
    }
    else {
        AppWebsocketClose();
    }
}

void HelloWorldSession::AppWebsocketClosed()
{
    this->appWebsocketClosed = true;
    TryClose();
}

void HelloWorldSession::TryClose()
{
    this->closing = true;
    if (!this->appWebsocketClosed) {
        AppWebsocketClose();
        return;
    }
    sdkSample->HelloWorldSessionClosed(this);
}

void HelloWorldSession::Close()
{
    TryClose();
}
