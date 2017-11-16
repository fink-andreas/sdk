/*---------------------------------------------------------------------------*/
/* iomux.h	                                                                 */
/* copyright (c) innovaphone 2013                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

class ISignalConsumer {

public:
	virtual void OnSignal(int signr) = 0;
};

class IShutdownHandler {

public:
    virtual void Shutdown() = 0;
};

class IChildExitedHandler {

public:
    virtual void ChildExited(signed int pid, int signr, int exitCode, bool sigFault) = 0;
};

class IIoMainLoopExtension {

public:
    virtual void IoMainLoopExtension(int timeoutMs) = 0;
};

class UIoContext {
protected:
    int		FDIIoMux;	// File descriptor	
public:
    bool    isError, isHangup, isClosed;
    class UserDataIoContext * ctx;

    UIoContext();
    virtual ~UIoContext();

    int	 GetFd();
    void SetFd(int fd);

    virtual void IoContextNotify(bool indRX, bool indTX) = 0;
};

class UIoExec {
	friend class IoMux;
    void * execContext;
    UIoExec * contextOwner;
    UIoExec * contextNext;
    UIoExec * contextPrev;
    UIoExec * next;
    UIoExec * prev;

public:
    UIoExec();
    virtual ~UIoExec();
    virtual void IoExec(void * execContext);
};

class IIoMux {
public:
	IIoMux();
	virtual ~IIoMux();
    static IIoMux * Create(bool locking=true, unsigned rlimitNoFile=0);

    virtual void Run() = 0;
    virtual void Terminate() = 0;
	virtual void FDAdd(int fd, UIoContext * context, bool pollOut) = 0;
	virtual void FDClose(UIoContext * context) = 0;
	virtual void FDUnblock(int fd) = 0;
	virtual bool CanAcceptFD() = 0;
    virtual void RegisterSignalConsumer(ISignalConsumer * consumer) = 0;
    virtual void RegisterShutdownHandler(IShutdownHandler * shutdownHandler) = 0;
    virtual void RegisterChildExitedHandler(IChildExitedHandler * childExitedHandler) = 0;
    virtual void UnRegisterChildExitedHandler(IChildExitedHandler * childExitedHandler) = 0;
    virtual void SetMainLoopExtension(IIoMainLoopExtension * mainLoopExtension) = 0;
    virtual void Lock() = 0;
    virtual void UnLock() = 0;
    virtual void SetExec(UIoExec * ioContext, void * execContext) = 0;
    virtual void SetExecLocked(UIoExec * ioContext, void * execContext) = 0;
    virtual void CancelSetExec(UIoExec * const ioContext) = 0;
};

class ITimer;
class UTimer {
public:
	virtual void TimerOnTimeout(ITimer * timer) = 0;
};

class ITimer : public btree {
	friend class IoMux;
    IIoMux * ioMux;
	UTimer * owner;

    bool running;
    dword expires;
    dword delta;
    class ITimer * next;
    class ITimer * prev;

    int btree_compare(void * key) { return *(dword *)key - expires; };
    int btree_compare(class btree * b) { return ((class ITimer *)b)->expires - expires; };
public:

    ITimer(IIoMux * ioMux, UTimer * owner);
	~ITimer();

	void Start(unsigned timeoutMs);
	void Cancel();
    bool IsRunning() { return running; };
};
