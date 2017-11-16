
/*---------------------------------------------------------------------------*/
/* sdksample.h                                                               */
/* copyright (c) innovaphone 2015                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

class SDKSampleService : public AppService {

	class IIoMux * iomux;
    class ISocketProvider * localSocketProvider;
    class IWebserverPluginProvider * webserverPluginProvider;
    class IDatabaseProvider * databaseProvider;

public:
    SDKSampleService(class IIoMux * const iomux, class ISocketProvider * localSocketProvider, IWebserverPluginProvider * const webserverPluginProvider, class IDatabaseProvider * databaseProvider, AppServiceArgs * args);
	~SDKSampleService();

	class AppInstance * CreateInstance(AppInstanceArgs * args);
    void AppServiceApps(istd::list<AppServiceApp> * appList);
};

typedef std::list<class SDKSampleSession *> SDKSampleSessionList;
typedef std::list<class HelloWorldSession *> HelloWorldSessionList;
typedef std::list<class PbxApiSampleSession *> PbxApiSampleSessionList;

class SDKSample : public UWebserverPlugin, public UDatabase, public AppInstance
{
    class IDatabase * database;
    class IWebserverPlugin * webserverPlugin;
    bool stopping;
    SDKSampleSessionList sdkSampleSessions;
    HelloWorldSessionList helloWorldSessions;
    PbxApiSampleSessionList pbxApiSessions;

    virtual void WebserverPluginClose(IWebserverPlugin * plugin, wsp_close_reason_t reason, bool lastUser);
    virtual void WebserverPluginWebsocketListenResult(IWebserverPlugin * plugin, const char * path, const char * registeredPathForRequest, const char * host);
    virtual void DatabaseConnectComplete(IDatabase * const database);
    virtual void DatabaseShutdown(IDatabase * const database, db_error_t reason);
	virtual void DatabaseError(IDatabase * const database, db_error_t error) {};
    void TryStop();

public:
    SDKSample(IIoMux * const iomux, ISocketProvider * localSocketProvider, IWebserverPluginProvider * const webserverPluginProvider, IDatabaseProvider * databaseProvider, SDKSampleService * service, AppInstanceArgs * args);
    ~SDKSample();
    void Stop();

    class IPbxApi * pbx;
    const char * GetAppPassword();
    void SDKSampleSessionClosed(SDKSampleSession * session);
    void HelloWorldSessionClosed(HelloWorldSession * session);
    void PbxApiSampleClosed(PbxApiSampleSession * session);
};


class SDKSampleSession : public AppWebsocket {
    class SDKSample * sdkSample;
    class IPbxApi * pbx;
    bool closing;
    bool appWebsocketClosed;

    char * AppWebsocketPassword();
    void AppWebsocketMessage(class json_io & msg, word base, const char * mt, const char * src);
    void AppWebsocketClosed();
    void AppWebsocketSendResult() {};
    void TryClose();

public:
    SDKSampleSession(class SDKSample * sdkSample, class IWebserverPlugin * webserverPlugin);
	~SDKSampleSession();

    void Close();
};

