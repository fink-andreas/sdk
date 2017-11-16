
/*---------------------------------------------------------------------------*/
/* stask.h                                                                   */
/* copyright (c) innovaphone 2017                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

class STaskThread;

class STask : public ITask, public UIoExec {
    void IoExec(void * execContext);

    class STaskContext * context;
    dword progress;

protected:
    void TaskComplete();
    void TaskFailed();
    void TaskProgress(dword progress = 0);

    class STaskThread * thread;

public:
    STask(class STaskContext * context);
    void Start(class UTask * user);
    virtual void SStart() = 0;
};

class STaskContext {
public:
    STaskContext(class IIoMux * iomux) {
        this->iomux = iomux;
    };

    class IIoMux * iomux;
    istd::list<STaskThread> threadsIdle;
    istd::list<STaskThread> threadsBusy;
};

class STaskThread : public istd::listElement<STaskThread> {
public:
    virtual void startTask(class STask * task) = 0;
    virtual void wait() = 0;
    virtual void cont() = 0;
};