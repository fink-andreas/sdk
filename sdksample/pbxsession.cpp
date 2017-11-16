#include "platform/platform.h"
#include "common/os/iomux.h"
#include "common/interface/task.h"
#include "common/interface/socket.h"
#include "common/interface/webserver_plugin.h"
#include "common/interface/database.h"
#include "common/interface/json_api.h"
#include "common/interface/pbx.h"
#include "common/ilib/json.h"
#include "common/lib/appservice.h"
#include "common/lib/appwebsocket.h"
#include "pbxsession.h"
#include "sdkSample.h"

PbxApiSampleSession::PbxApiSampleSession(class SDKSample * sdkSample, class IWebserverPlugin * webserverPlugin) : AppWebsocket(webserverPlugin, sdkSample)
{
    this->sdkSample = sdkSample;
    monitor = 0;
    setPresence = 0;
    closing = false;
    appWebsocketClosed = false;
}

PbxApiSampleSession::~PbxApiSampleSession()
{
    TEST_WATCH("_PbxApiSampleSession");
}

char * PbxApiSampleSession::AppWebsocketPassword()
{
    return (char *)sdkSample->GetAppPassword();
}

void PbxApiSampleSession::AppWebsocketMessage(class json_io & msg, word base, const char * mt, const char * src)
{
    if (!strcmp(mt, "SetUser")) {
        dword error = 0;
        const char * sip = msg.get_string(base, "sip");
        if (!monitor && sdkSample->pbx && sip && sip[0]) {
            monitor = sdkSample->pbx->CreatePresenceSubscription(sip, 0);
            monitor->Start(this);
        }
        else {
            error = 1;
        }
        char sb[200];
        char temp[64];
        char * tmp = temp;
        class json_io send(sb);
        word base = send.add_object(0xFFFF, 0);
        send.add_string(base, "mt", "SetUserResult");
        if (error) send.add_unsigned(base, "error", error, tmp);
        AppWebsocketMessageSend(send, sb);
        AppWebsocketMessageComplete();
    }
    else if (!strcmp(mt, "ClearUser")) {
        if (monitor) monitor->Stop();
        AppWebsocketMessageComplete();
    }
    else if (!strcmp(mt, "SetActivity")) {
        if (monitor && !setPresence && sdkSample->pbx) {
            setPresence = sdkSample->pbx->CreateSetPresence(0, monitor->GetSip(), "tel:", msg.get_string(base, "activity"), 0);
            setPresence->Start(this);
        }
        AppWebsocketMessageComplete();
    }
    else {
        AppWebsocketMessageComplete();
    }
}

void PbxApiSampleSession::AppWebsocketClosed()
{
    appWebsocketClosed = true;
    TryClose();
}

void PbxApiSampleSession::TaskComplete(class ITask * const task)
{
    if (task == monitor) {
        delete monitor;
        monitor = 0;
        if (!closing) {
            char sb[200];
            class json_io send(sb);
            word base = send.add_object(0xFFFF, 0);
            send.add_string(base, "mt", "ClearUserResult");
            AppWebsocketMessageSend(send, sb);
        }
        else {
            TryClose();
        }
    }
    else if (task == setPresence) {
        delete setPresence;
        setPresence = 0;
        if (closing) TryClose();
    }
}

void PbxApiSampleSession::TaskFailed(class ITask * const task)
{
    if (task == monitor) {
        delete monitor;
        monitor = 0;
        if (!closing) {
            char sb[200];
            class json_io send(sb);
            word base = send.add_object(0xFFFF, 0);
            send.add_string(base, "mt", "ClearUserResult");
            AppWebsocketMessageSend(send, sb);
        }
        else {
            TryClose();
        }
    }
    else if (task == setPresence) {
        delete setPresence;
        setPresence = 0;
        if (closing) TryClose();
    }
}

void PbxApiSampleSession::TaskProgress(class ITask * const task, dword progress)
{
    if (task == monitor) {
        if (progress == PBX_API_PROGRESS_SUBSCIPTION) {
            char sb[200];
            class json_io send(sb);
            word base = send.add_object(0xFFFF, 0);
            send.add_string(base, "mt", "Info");
            send.add_bool(base, "up", monitor->IsUp());
            send.add_string(base, "dn", monitor->GetDn());
            send.add_string(base, "num", monitor->GetNum());
            send.add_string(base, "email", monitor->GetEmail());
            AppWebsocketMessageSend(send, sb);
        }
        else if (progress == PBX_API_PROGRESS_PRESENCE) {
            char sb[200];
            class json_io send(sb);
            word base = send.add_object(0xFFFF, 0);
            send.add_string(base, "mt", "Presence");
            class IPbxApiPresence * presence = monitor->GetPresence();
            if (presence) {
                const char * activity = presence->GetActivity();
                if (!activity) activity = "available";
                send.add_string(base, "activity", activity);
                send.add_string(base, "note", presence->GetNote());
            }
            AppWebsocketMessageSend(send, sb);
        }
    }
}

void PbxApiSampleSession::TryClose()
{
    this->closing = true;
    if (setPresence) {
        return;
    }
    if (!this->appWebsocketClosed) {
        AppWebsocketClose();
        return;
    }
    if (monitor) {
        monitor->Stop();
        return;
    }
    sdkSample->PbxApiSampleClosed(this);
}

void PbxApiSampleSession::Close()
{
    TryClose();
}
