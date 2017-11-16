
/*---------------------------------------------------------------------------*/
/* task.h                                                                    */
/* copyright (c) innovaphone 2016                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

#define TASK_PROGRESS_USER 0x80000000

class UTask {
public:
    virtual void TaskComplete(class ITask * const task) = 0;
    virtual void TaskFailed(class ITask * const task) = 0;
    virtual void TaskProgress(class ITask * const task, dword progress = 0) {};
};

class ITask {
protected:
    class UTask * user;

public:
    ITask() { user = 0; error = false; stopped = false; }
    virtual ~ITask() {}
    virtual void Start(class UTask * user) = 0;
    virtual void Stop() { stopped = true; };
    virtual void Progress(dword progress) { user->TaskProgress(this, progress); };
    bool error;
    bool stopped;
};

template <class B, class T> class UTaskTemplate : public UTask {
    B * base;
    void (B::* taskComplete)(T * const task);
    void (B::* taskFailed)(T * const task);
    void (B::* taskProgress)(T * const task, dword progress);
    void TaskComplete(class ITask * const task) {
        ASSERT(taskComplete, "taskComplete undefined");
        task->error = false;
        (*base.*(taskComplete))((T *)task);
    }
    void TaskFailed(class ITask * const task) {
        ASSERT(taskFailed, "taskFailed undefined");
        task->error = true;
        (*base.*(taskFailed))((T *)task);
    }
    void TaskProgress(class ITask * const task, dword progress) {
        if (taskProgress) {
            (*base.*(taskProgress))((T *)task, progress);
        }
    }
public:
    UTaskTemplate(B * base,
                  void (B::* taskComplete)(T * task),
                  void (B::* taskFailed)(T * task) = 0,
                  void (B::* taskProgress)(T * task, dword progress) = 0) {
        this->base = base;
        this->taskComplete = taskComplete;
        this->taskFailed = taskFailed;
        this->taskProgress = taskProgress;
    };
};

