
/*---------------------------------------------------------------------------*/
/* appwebsocket.h                                                            */
/* copyright (c) innovaphone 2016                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

class AppWebsocket : public UWebsocket, public IJsonApiConnection {
    void WebsocketAcceptComplete(class IWebsocket * websocket) override;
    void WebsocketSendResult(class IWebsocket * websocket) override;
    void * WebsocketRecvBuffer(size_t len) override;
    void WebsocketRecvResult(class IWebsocket * websocket, void * buffer, size_t len, bool text, bool isFragmented) override;
    void WebsocketCloseComplete(class IWebsocket * websocket, ws_close_reason_t reason) override;
    void WebsocketMessage(IWebsocket * websocket, size_t messageSize) { };

    class IWebsocket * websocket;
    IInstanceLog * const log;
    JsonApiContext * const jsonApiContext;
    dword challenge;
    char * digest;
    char * info;
    bool connected;
    char * fragmented;
    unsigned fragmentedLen;
    int sendCount;
    std::list<class JsonApi *> apis;
    
    inline void CalculateKey(const char * password);
    inline bool CheckHash(const char * app, const char * domain, const char * sip, const char * guid, const char * dn, const char * digest, const char * infoText, size_t infoLen, const char * password);
    inline char * UserAppWebsocketPassword();
    inline void UserAppWebsocketAppInfo(const char * app, class json_io & msg, word base);
    inline void UserAppWebsocketClosed();

public:
    AppWebsocket(IWebserverPlugin * plugin, class IInstanceLog * const log, class JsonApiContext * jsonApiContext = 0);
    ~AppWebsocket();

    virtual char * AppWebsocketPassword() { return 0; };
    virtual char * AppWebsocketPassword(const char * domain) { return NULL; };
    virtual void AppWebsocketMessage(class json_io & msg, word base, const char * mt, const char * src) = 0;
    virtual void AppWebsocketAppInfo(const char * app, class json_io & msg, word base) { }
    virtual void AppWebsocketLogin(class json_io & msg, word info) { };
    virtual bool AppWebsocketConnectComplete(class json_io & msg, word info) { return true; }
    virtual void AppWebsocketClosed() = 0;
    virtual bool AppWebsocketApiPermission(const char * api) { return true; }
    virtual void AppWebsocketSendResult() = 0;

    bool AppWebsocketLoginComplete(const char * password, char * key = 0, unsigned keyLen = 0);
    void AppWebsocketMessageComplete();
    void AppWebsocketMessageSend(class json_io & msg, char * buffer);
    void AppWebsocketMessageSendBinary(char * buffer, int len);
    void AppWebsocketClose();

    void AppWebsocketEncrypt(const char * seed, const char * data, char * out, size_t outLen);
    void AppWebsocketDecrypt(const char * seed, const char * data, char * out, size_t outLen);
    void AppWebsocketHash(const char * seed, const char * data, char * out, size_t outLen);

    void RegisterJsonApi(class JsonApi * api) override;
    void UnRegisterJsonApi(class JsonApi * api) override;
    void JsonApiMessage(class json_io & msg, char * buffer) override;
    void JsonApiMessageComplete() override;
    bool JsonApiPermission(const char * api) override { return AppWebsocketApiPermission(api); };

    char * domain;
    char * sip;
    char * guid;
    char * dn;
    char * app;
    char key[65];
};