
class PbxApiSampleSession : public AppWebsocket, public UTask {
    class SDKSample * sdkSample;
    class IPbxApiPresenceSubscription * monitor;
    class ITask * setPresence;

    bool closing;
    bool appWebsocketClosed;

    char * AppWebsocketPassword();
    void AppWebsocketMessage(class json_io & msg, word base, const char * mt, const char * src);
    void AppWebsocketClosed();
    void AppWebsocketSendResult() {};

    void TaskComplete(class ITask * const task);
    void TaskFailed(class ITask * const task);
    void TaskProgress(class ITask * const task, dword progress = 0);

    void TryClose();

public:
    PbxApiSampleSession(class SDKSample * sdkSample, class IWebserverPlugin * webserverPlugin);
    ~PbxApiSampleSession();

    void Close();
};
