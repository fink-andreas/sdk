/*---------------------------------------------------------------------------*/
/* appservice.h                                                                 */
/* copyright (c) innovaphone 2016                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

struct AppInstanceArgs {
    AppInstanceArgs();
    void Parse(int argc, char ** argv, bool keepDefaults = true);
    const char * appName;
    const char * appDomain;
    const char * appPassword;
    const char * webserver;
    const char * webserverPath;
    const char * dbHost;
    const char * dbName;
    const char * dbUser;
    const char * dbPassword;
    const char * workingPath;
    ulong64 logFlags;
};

struct AppServiceArgs {
    AppServiceArgs();
    void Parse(int argc, char ** argv, bool keepDefaults = true);
    const char * serviceID;
    const char * taskmanager;
    ulong64 logFlags;
    bool segfaulted;
};

class AppServiceApp : public istd::listElement<AppServiceApp> {
    char * name;
    bool websocketOnly;

public:
    AppServiceApp(const char * name, bool websocketOnly = false);
    ~AppServiceApp();

    const char * GetName();
    bool IsWebsocketOnly();
};

class AppService : public USocket, public IShutdownHandler, public IInstanceLog {
    friend class AppInstance;

    class IIoMux * const iomux;
    class ISocket * localSocket;
    AppServiceArgs serviceArgs;
    bool connected;
    bool appsClosed;
    bool closing;
    class btree * appInstances;
    char * recvBuffer;
    byte * cert;
    size_t certLen;

    void AppSocketShutdown();
    void AppSocketMessageSend(class json_io & send, char * buff);

    void SocketConnectComplete(ISocket * const socket) override;
    void SocketShutdown(ISocket * const socket, shutdownreason_t reason) override;
    void SocketSendResult(ISocket * const socket) override;
    void SocketRecvResult(ISocket * const socket, void * buf, size_t len) override;
    void SocketRecv(size_t len, bool partial);

    void AppSendStatus(const char * appName, const char * appDomain, bool status);
    void AppStop(const char * appName, const char * appDomain);
    void AppSetLogflags(const char * appName, const char * appDomain, ulong64 logflags);
    void CloseApps();
    void UpdateServerCertificate(const char * cert);

    void TryStop();

    void Shutdown() override;

    const char * GetAppDomain() const override { return NULL; }
    const char * GetAppName() const override { return NULL; }

public:
    AppService(class IIoMux * const iomux, class ISocketProvider * const localSocketProvider, AppServiceArgs * serviceArgs);
    virtual ~AppService();

    void AppStart(AppInstanceArgs * args);
    void AppStopped(class AppInstance * instance);
    virtual class AppInstance * CreateInstance(AppInstanceArgs * args) = 0;
    virtual void AppServiceApps(istd::list<AppServiceApp> * appList) = 0;
    const char * GetAppServiceId() const;
};

class AppInstance : public btree, public IInstanceLog {
private:
    char * key;

    virtual int btree_compare(void * key);
    virtual int btree_compare(class btree * b);

protected:
    AppInstanceArgs args;
    class AppService * appService;

public:
    AppInstance(class AppService * appService, AppInstanceArgs * args);
    virtual ~AppInstance();

    const char * GetAppServiceId() const { return appService->GetAppServiceId(); };
    const char * GetAppName() const override;
    const char * GetAppDomain() const override;
    const char * GetKey() const;
    void EditLogflags(ulong64 flags) { this->logFlags = flags; };    
    static char * GenerateKey(const char * appName, const char * appDomain);

    inline void LogV(const char * format, va_list ap)
    {
        // do only trace is LOG_APP is set
        if (this->logFlags & LOG_APP) {
            debug->appPrintfV(this->args.appName, this->args.appDomain, format, ap);
        }
    }

    inline void Log(const char * format, ...)
    {
        // do only trace is LOG_APP is set
        if (this->logFlags & LOG_APP) {
            va_list ap;
            va_start(ap, format);
            debug->appPrintfV(this->args.appName, this->args.appDomain, format, ap);
            va_end(ap);
        }
    }

    inline void HexDump(const void * buffer, size_t size)
    {
        // do only trace is LOG_APP is set
        if (this->logFlags & LOG_APP) {
            debug->appHexdump(this->args.appName, this->args.appDomain, buffer, size);
        }
    }
    
    virtual void Stop() = 0;
    virtual void ServerCertificateUpdate(const byte * cert, size_t certLen) {};
};
