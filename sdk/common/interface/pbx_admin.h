
/*---------------------------------------------------------------------------*/
/* pbx_admin.h                                                               */
/* copyright (c) innovaphone 2017                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

class IPbxAdminApi : public UJsonApiContext {
public:
    static class IPbxAdminApi * Create(const char * pbx);
    virtual ~IPbxAdminApi() {};

    virtual void MonitorAdminObject(class UPbxMonitorAdminObject * monitor) = 0;
    virtual void MonitorConfig(class UPbxMonitorConfig * monitor) = 0;
};

class UPbxMonitorAdminObject {
public:
    virtual void PbxAdminObjectUpdate(const char * pwd, const char * key) = 0;
};

class UPbxMonitorConfig {
public:
    virtual void PbxConfigUpdate(const char * domain, const char * pbx, const char * dns) = 0;
};