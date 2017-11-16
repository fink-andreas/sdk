
class HelloWorldSession : public AppWebsocket{
    class SDKSample * sdkSample;

    bool closing;
    bool appWebsocketClosed;

    char * AppWebsocketPassword();
    void AppWebsocketMessage(class json_io & msg, word base, const char * mt, const char * src);
    void AppWebsocketClosed();
    void AppWebsocketSendResult() {};

    void TryClose();

public:
    HelloWorldSession(class SDKSample * sdkSample, class IWebserverPlugin * webserverPlugin);
    ~HelloWorldSession();

    void Close();
};
