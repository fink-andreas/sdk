/*---------------------------------------------------------------------------*/
/* ringer.h                                                                  */
/* copyright (c) innovaphone 2017                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

enum RingerDeviceType {
    Ringer = 127
};

NAMESPACE_BEGIN
#if defined(__cplusplus)

class URinger {
public:
    virtual void RingerList(void * context) = 0;
    virtual void RingtoneList(void * context) = 0;
};

class IRinger {
public:
    static class IRinger * Create(class IIoMux * const iomux, class IInstanceLog * log);
    virtual ~IRinger() {};

    virtual void Initialize(class URinger * const user) = 0;

    virtual void QueryDevices(void * context) = 0;
    virtual unsigned DeviceCount() = 0;
    virtual enum RingerDeviceType DeviceType(unsigned deviceNumber) = 0;
    virtual const char * DeviceName(unsigned deviceNumber) = 0;

    virtual void QueryRingtones(void * context) = 0;
    virtual unsigned RingtoneCount() = 0;
    virtual const char * RingtoneTitle(unsigned ringtoneNumber) = 0;
    virtual const char * RingtoneIdent(unsigned ringtoneNumber) = 0;
    virtual void RingtoneStart(const char *ident, enum RingerDeviceType deviceType, const char *deviceName, bool allowVibrate = true) = 0;
    virtual void RingtoneStop() = 0;
};

#endif /* defined(__cplusplus) */
NAMESPACE_END
