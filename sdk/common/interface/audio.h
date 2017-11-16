/*---------------------------------------------------------------------------*/
/* audio.h                                                                   */
/* copyright (c) innovaphone 2017                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

enum AudioDeviceType {
    DeviceTypeUnknown,
    HandsetSpeaker,
    HandsetMicrophone,
    HandsfreeSpeaker,
    HandsfreeMicrophone,
    HeadsetSpeaker,
    HeadsetMicrophone
};

#define KEY_EHS_TALK	0x81		// Talk button pressed
#define KEY_EHS_FLASH	0x82		// accept knocking call, toggle calls (if any)
#define KEY_EHS_REDIAL	0x83		// redial last number dialled (if any)


NAMESPACE_BEGIN
#if defined(__cplusplus)


class IAudioExec {
public:
    virtual ~IAudioExec() {};
    virtual unsigned ExecJitter8khz() = 0;
};

class IAudioProcessor : public IAudioExec {
public:
    static class IAudioProcessor * Create(class IIoMux * const iomux, class IInstanceLog * log, unsigned execInterval8khz) ;

    virtual void Initialize(class UAudioProcessor * const user) = 0;
};

class UAudioExec {
public:
    virtual void AudioExec(class IAudioExec *audioExec) = 0;
};

class UAudioProcessor : public UAudioExec {
public:
 
};



class UAudioPhone : public UAudioExec {
public:
    virtual void AudioDeviceList(void * context) = 0;
    virtual void HeadsetKeyReceive(byte key) = 0;
};

class IAudioPhone : public IAudioExec {
public:
    static class IAudioPhone * Create(class IIoMux * const iomux, class IInstanceLog * log, unsigned execInterval8khz/* z.B . 80 ~ 10ms*/, class ISocketProvider * udpSocketProvider);
    virtual ~IAudioPhone() {};

    virtual void Initialize(class UAudioPhone * const user) = 0;

    virtual void QueryDevices(void * context) = 0;
    virtual unsigned DeviceCount() = 0;
    virtual enum AudioDeviceType DeviceType(unsigned deviceNumber) = 0;
    virtual const char * DeviceName(unsigned deviceNumber) = 0;
    virtual void StartMicrophone(unsigned sampleRate /*Hz z.B. 8000*/, enum AudioDeviceType deviceType, const char *deviceName) = 0;
    virtual void StartSpeaker(unsigned sampleRate /*Hz z.B. 8000*/, enum AudioDeviceType deviceType, const char *deviceName) = 0;
    virtual void StopMicrophone() = 0;
    virtual void StopSpeaker() = 0;
    virtual unsigned AudioDelay8khz() = 0;
    virtual const short * MicrophoneSamplePtr() = 0;
    virtual short * SpeakerSamplePtr() = 0;
    virtual void SelectHeadset(const char *deviceName) = 0;
    virtual void HeadsetKeySend(byte key) = 0;
};

#endif /* defined(__cplusplus) */
NAMESPACE_END
