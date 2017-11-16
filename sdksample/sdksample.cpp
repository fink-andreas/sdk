
/*---------------------------------------------------------------------------*/
/* sdksample.cpp                                                             */
/* copyright (c) innovaphone 2016                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

#include "platform/platform.h"
#include "common/os/iomux.h"
#include "common/interface/socket.h"
#include "common/interface/webserver_plugin.h"
#include "common/interface/database.h"
#include "common/interface/task.h"
#include "common/interface/json_api.h"
#include "common/interface/pbx.h"
#include "common/ilib/json.h"
#include "common/lib/appservice.h"
#include "common/lib/appwebsocket.h"
#include "helloworldsession.h"
#include "pbxsession.h"
#include "sdksample.h"

/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/

SDKSampleService::SDKSampleService(class IIoMux * const iomux, class ISocketProvider * localSocketProvider, class IWebserverPluginProvider * const webserverPluginProvider, class IDatabaseProvider * databaseProvider, AppServiceArgs * args) : AppService(iomux, localSocketProvider, args)
{
    this->iomux = iomux;
    this->localSocketProvider = localSocketProvider;
    this->webserverPluginProvider = webserverPluginProvider;
    this->databaseProvider = databaseProvider;
}

SDKSampleService::~SDKSampleService()
{

}

class AppInstance * SDKSampleService::CreateInstance(AppInstanceArgs * args)
{
    return new SDKSample(iomux, localSocketProvider, webserverPluginProvider, databaseProvider, this, args);
}

void SDKSampleService::AppServiceApps(istd::list<AppServiceApp> * appList)
{
    appList->push_back(new AppServiceApp("helloworld"));
    appList->push_back(new AppServiceApp("pbx-presence"));
}

/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/

SDKSample::SDKSample(IIoMux * const iomux, ISocketProvider * localSocketProvider, IWebserverPluginProvider * const webserverPluginProvider, IDatabaseProvider * databaseProvider, class SDKSampleService * service, AppInstanceArgs * args) : AppInstance(service, args)
{
    this->stopping = false;
    this->webserverPlugin = webserverPluginProvider->CreateWebserverPlugin(iomux, localSocketProvider, this, args->webserver, args->webserverPath, this);
    this->database = databaseProvider->CreateDatabase(iomux, this, this);
    this->database->Connect(args->dbHost, args->dbName, args->dbUser, args->dbPassword);
    this->pbx = 0;
    Log("App instance started");
}

SDKSample::~SDKSample()
{
}

void SDKSample::Stop()
{
    TryStop();
}

void SDKSample::TryStop()
{
    stopping = true;
    if (sdkSampleSessions.size() > 0) {
        for (SDKSampleSessionList::iterator sessionItr = sdkSampleSessions.begin(); sessionItr != sdkSampleSessions.end(); sessionItr++) {
            (*sessionItr)->Close();
        }
        return;
    }
    if (helloWorldSessions.size() > 0) {
        for (HelloWorldSessionList::iterator sessionItr = helloWorldSessions.begin(); sessionItr != helloWorldSessions.end(); sessionItr++) {
            (*sessionItr)->Close();
        }
        return;
    }
    if (pbxApiSessions.size() > 0) {
        for (PbxApiSampleSessionList::iterator sessionItr = pbxApiSessions.begin(); sessionItr != pbxApiSessions.end(); sessionItr++) {
            (*sessionItr)->Close();
        }
        return;
    }
    if (webserverPlugin) {
        webserverPlugin->Close();
        return;
    }
    if (database) {
        database->Shutdown();
        return;
    }
    appService->AppStopped(this);
}

const char * SDKSample::GetAppPassword()
{
    return this->args.appPassword;
}

void SDKSample::SDKSampleSessionClosed(SDKSampleSession * session)
{
    sdkSampleSessions.remove(session);
    delete session;
    if (stopping) TryStop();
}

void SDKSample::HelloWorldSessionClosed(HelloWorldSession * session)
{
    helloWorldSessions.remove(session);
    delete session;
    if (stopping) TryStop();
}

void SDKSample::PbxApiSampleClosed(PbxApiSampleSession * session)
{
    pbxApiSessions.remove(session);
    delete session;
    if (stopping) TryStop();
}

/* Webserver plugin */

void SDKSample::WebserverPluginClose(IWebserverPlugin * plugin, wsp_close_reason_t reason, bool lastUser)
{
    Log("WebserverPlugin closed");
    delete webserverPlugin;
    webserverPlugin = 0;
    TryStop();
}

void SDKSample::WebserverPluginWebsocketListenResult(IWebserverPlugin * plugin, const char * path, const char * registeredPathForRequest, const char * host)
{
    Log("SDKSample::WebserverWebsocketListenResult path=%s", path);
    if (stopping) {
        plugin->Cancel(WSP_CANCEL_UNAVAILABLE);
        return;
    }
    if (registeredPathForRequest && !strcmp(registeredPathForRequest, "/helloworld")) helloWorldSessions.push_back(new HelloWorldSession(this, plugin));
    else if (registeredPathForRequest && !strcmp(registeredPathForRequest, "/pbx")) pbxApiSessions.push_back(new PbxApiSampleSession(this, plugin));
    else sdkSampleSessions.push_back(new SDKSampleSession(this, plugin));
}

/* Database connection */

void SDKSample::DatabaseConnectComplete(IDatabase * const database)
{
    Log("SDKSample::DatabaseConnectComplete");
    this->webserverPlugin->HttpListen();
    this->webserverPlugin->WebsocketListen();
    this->webserverPlugin->WebsocketListen("helloworld");
    this->webserverPlugin->WebsocketListen("pbx");
}

void SDKSample::DatabaseShutdown(IDatabase * const database, db_error_t reason)
{
    Log("Database closed");
    delete this->database;
    this->database = 0;
    TryStop();
}

/*---------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/

SDKSampleSession::SDKSampleSession(class SDKSample * sdkSample, class IWebserverPlugin * webserverPlugin) : AppWebsocket(webserverPlugin, sdkSample)
{
    this->sdkSample = sdkSample;
    this->pbx = 0;
    this->closing = false;
    this->appWebsocketClosed = false;
}

SDKSampleSession::~SDKSampleSession()
{
    TEST_WATCH("_SDKSampleSession");
    if (pbx) {
        if (sdkSample->pbx == pbx) sdkSample->pbx = 0;
        delete pbx;
        pbx = 0;
    }
}

char * SDKSampleSession::AppWebsocketPassword()
{
    return (char *)sdkSample->GetAppPassword();
}

void SDKSampleSession::AppWebsocketMessage(class json_io & msg, word base, const char * mt, const char * src)
{
    if (!strcmp(mt, "PbxInfo")) {
        pbx = CreatePbxApi(this);
        if (!sdkSample->pbx) sdkSample->pbx = pbx;
        AppWebsocketMessageComplete();
    }
    else {
        AppWebsocketClose();
    }
}

void SDKSampleSession::AppWebsocketClosed()
{
    this->appWebsocketClosed = true;
    TryClose();
}

void SDKSampleSession::TryClose()
{
    this->closing = true;
    if (!this->appWebsocketClosed) {
        this->AppWebsocketClose();
        return;
    }
    sdkSample->SDKSampleSessionClosed(this);
}

void SDKSampleSession::Close()
{
    TryClose();
}
