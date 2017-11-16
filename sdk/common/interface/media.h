/*---------------------------------------------------------------------------*/
/* media.h                                                                   */
/* copyright (c) innovaphone 2017                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

class IMediaProvider * CreateMediaProvider();

class IMediaProvider {
public:
    virtual ~IMediaProvider() {}
    virtual class IMedia * CreateMedia(class IIoMux * const iomux, class UMedia * const user, class IInstanceLog * log) = 0;
};

enum AudioCoder {
    UNDEFINED = 0,
    G711_A,
    G711_U,
    G723_53,
    G723_63,
    G729,
    G729A,
    G729B,
    G729AB,
    G726_40,
    G726_32,
    G726_24,
    G726_16,
    GSM,
    DVI4,
    LPC,
    L16,
    ILBC,
    SPEEX,
    DTMF,
    CN,
    RED,
    G722,
    G7221,
    CLEARCHANNEL,
    OPUS_NB,
    OPUS_WB,
    AMR_WB,
};

enum VideoCoder {
    H264 = 128,
    VP8
};

enum AppSharingCoder {
    JRFB = 192,
};

enum MediaType {
    AUDIO = 0,
    VIDEO,
    APPSHARING,
    MP4_CONTAINER,
    WEBM_CONTAINER
};

#define CoderMediaType(c) (((c) < ((int) VideoCoder::H264)) ? MediaType::AUDIO : (((c) < ((int) AppSharingCoder::JRFB)) ? MediaType::VIDEO : MediaType::APPSHARING))

#define DEFAULT_PAYLOAD_TYPE_G711_U 0
#define DEFAULT_PAYLOAD_TYPE_G726   2
#define DEFAULT_PAYLOAD_TYPE_GSM    3
#define DEFAULT_PAYLOAD_TYPE_G723   4
#define DEFAULT_PAYLOAD_TYPE_DVI4   5
#define DEFAULT_PAYLOAD_TYPE_LPC    7
#define DEFAULT_PAYLOAD_TYPE_G711_A 8
#define DEFAULT_PAYLOAD_TYPE_G722   9
#define DEFAULT_PAYLOAD_TYPE_L16    10
#define DEFAULT_PAYLOAD_TYPE_G729   18
#define DEFAULT_PAYLOAD_TYPE_CN     19
#define DEFAULT_PAYLOAD_TYPE_H264   102
#define DEFAULT_PAYLOAD_TYPE_VP8    107
#define DEFAULT_PAYLOAD_TYPE_OPUS   109
#define DEFAULT_PAYLOAD_TYPE_AMR    110

#define DEFAULT_SCTP_CHANNEL_NUMBER 5000

#define CHANNEL_CANDIDATE_HOST      0
#define CHANNEL_CANDIDATE_SRFLX     1
#define CHANNEL_CANDIDATE_PRFLX     2
#define CHANNEL_CANDIDATE_RELAY     3

// Codecs: h264, vp8, FB
class Codec: public istd::listElement<Codec> {
public:
    Codec() {
        coder = AudioCoder::UNDEFINED;
        this->addr = NULL; 
        this->mcAddr = NULL; 
    };
    ~Codec() { 
        if(addr) free(addr); 
        if(mcAddr) free(mcAddr); 
    };
public:
    int coder;
    int number;
    int xmitPacket;
    int recvPacket;
    int rate;
    char * addr;
    int port;
    char * mcAddr;
    int mcPort;
    int flags;
    int pt;
};

class IceCandidate : public istd::listElement<IceCandidate> {
public:
    IceCandidate() { 
        this->addr = NULL;
        this->relatedAddr = NULL;
        this->foundation = NULL;
        this->rtpPort = 0;
        this->rtcpPort = 0;
        this->relatedRtpPort = 0;
        this->relatedRtcpPort = 0;
        this->rtpPriority = 0;
        this->rtcpPriority = 0;
        this->type = 0;
    };
    ~IceCandidate() { 
        if(addr) free(addr);
        if(relatedAddr) free(relatedAddr);
        if(foundation) free(foundation);
    };
public:
    char * addr;
    char * relatedAddr;
    word rtpPort;
    word rtcpPort;
    word relatedRtpPort;
    word relatedRtcpPort;
    word rtpPriority;
    word rtcpPriority;
    dword type;
    char * foundation;
};

class IceCandidates {
public:
    IceCandidates() { 
        this->fingerprint = NULL;
        this->iceUfrag = NULL;
        this->icePwd = NULL;
        this->lIceUfrag = NULL;
        this->lIcePwd = NULL;
        this->rtcpMux = false;
    };
    ~IceCandidates() { 
        if(fingerprint) free(fingerprint);
        if(iceUfrag) free(iceUfrag);
        if(icePwd) free(icePwd);
        if(lIceUfrag) free(lIceUfrag);
        if(lIcePwd) free(lIcePwd);
        while(this->candidateList.front()) {
            delete this->candidateList.front();
        }
    };
public:
    char * fingerprint;
    char * iceUfrag;
    char * icePwd;
    char * lIceUfrag;
    char * lIcePwd;
    bool rtcpMux;
    istd::list<class IceCandidate> candidateList;
};

class MediaConfig {
public:
    MediaConfig() { this->ice = NULL; this->defAddr = NULL; };
    ~MediaConfig() { 
        if(ice) delete ice;
        while(this->codecList.front()) {
            delete this->codecList.front();
        }
        if(defAddr) free(defAddr);
    };

public:
    enum MediaType type;
    char * defAddr;
    word defPort;
    class IceCandidates * ice;
    istd::list<class Codec> codecList;
};

class IMedia {
public:
    virtual ~IMedia() {};
    virtual void Initialize(ISocketProvider * udpSocketProvider, ISocketProvider * tcpSocketProvider, class ISocketContext * socketContext, char * certificateFingerprint, word minPort, word maxPort, const char * stunServers, const char * turnServers, const char * turnUsername, const char * turnPassword, enum MediaType media, bool stunSlow, bool turnOnly) = 0;
    virtual void Connect(class MediaConfig *remoteMediaConfig, bool iceControlling) = 0;
    virtual void RtpSend(const void * buf, size_t len, dword timestamp) = 0;
    virtual void SctpSend(const void * buf, size_t len) = 0;
    virtual void Recv(void * buf, size_t len, bool recvPartial = false) = 0;
    virtual void Close() = 0;
};

class UMedia {
public:
    virtual void MediaInitializeComplete(IMedia * const media, class MediaConfig *localMediaConfig) {};
    virtual void MediaConnectResult(IMedia * const media, bool error) {};
    virtual void MediaRtpSendResult(IMedia * const media) {};
    virtual void MediaSctpSendResult(IMedia * const media) {};
    virtual void MediaRtpRecvResult(IMedia * const media, void * buf, size_t len, dword timestamp) {};
    virtual void MediaSctpRecvResult(IMedia * const media, void * buf, size_t len) {};
    virtual void MediaCloseComplete(IMedia * const media) {};
};

class IMediaEndpoint {
public:
    virtual ~IMediaEndpoint() {};
    virtual void Recv(char * buf, int len, dword timestamp, short sequenceNumberDiff) = 0;
    virtual void Send(char * buf, int len, dword timestamp) = 0;
};

class UMediaEndpoint {
public:
    virtual void RtpRecvResult(char * buf, int len, dword timestamp) {};
    virtual void RtpSendResult() {};
    virtual void RtpSend(char * buf, int len, dword timestamp, bool marker = false) = 0;
    virtual void SctpRecvResult(char * buf, int len) {};
    virtual void SctpSendResult() {};
    virtual void SctpSend(char * buf, int len) = 0;
};

class IMediaIoChannel {
public:
    virtual ~IMediaIoChannel() {};
    virtual void Open() = 0;
    virtual void RtpRecv(void * buf, size_t len, dword timestamp) = 0;
    virtual void SctpRecv(void * buf, size_t len) = 0;
    virtual void Close() = 0;
};

class UMediaIoChannel {
public:
    virtual void MediaIoRtpSend(const void * buf, size_t len, dword timestamp) = 0;
    virtual void MediaIoSctpSend(const void * buf, size_t len) = 0;
};

class IMediaIo {
public:
    virtual void QueryDevices(void * context) = 0; // Calls DeviceAdded() for all present devices.
    virtual const char * StartDevice(int deviceType, const char *deviceName) = 0;
    virtual void StopDevice(int deviceType, const char *deviceName) = 0;
};

class UMediaIo {
public:
    virtual void MediaIoDeviceAdded(void * context, int deviceType, const char *deviceName) = 0;
    virtual void MediaIoDeviceRemoved(void * context, int deviceType, const char *deviceName) = 0;
};

class IAudioIoChannel : public IMediaIoChannel {
public:
    static class IAudioIoChannel * Create(class IAudioIo * audioIo, class UMediaIoChannel * const user);
    static unsigned AvailableCoderCount();
    static enum AudioCoder AvailableCoder(unsigned coderNumber);
    virtual ~IAudioIoChannel() {};
    virtual void Initialize(enum AudioCoder coder, bool sc, unsigned mediaPacketizationMs, unsigned execInterval8khz,
        unsigned execJitter8khz, unsigned pullSampleRate, unsigned putSampleRate) = 0;
    virtual bool Pull() = 0;
    virtual const short *PulledSamples() = 0;
    virtual const short *FeedbackSamples() = 0;
    virtual void PutSamples(const short *buffer) = 0;
};

#define AUDIO_IO_DUAL_TONE_MODULATE     0x00000001
#define AUDIO_IO_DUAL_TONE_LOOP         0x00000002
#define AUDIO_IO_DUAL_TONE_AUTOOFF      0x00000004
#define AUDIO_IO_DUAL_TONE_PASSTHROUGH  0x00000008
#define AUDIO_IO_DUAL_TONE_PEER         0x00000010 /* local / peer */
#define AUDIO_IO_DUAL_TONE_BOTH         0x00000020 /* local + full peer / peer + attenuated local */

struct AudioIoDualTone {
    word onTimeMs;
    word offTimeMs;
    word frequency0; /* Hz */
    short level0; /* (0x8000:-infinity, 0x8001:-127.996 dBm ... 0x7fff:127.996 dBm) */
    word frequency1; /* Hz */
    short level1; /* (0x8000:-infinity, 0x8001:-127.996 dBm ... 0x7fff:127.996 dBm) */
};

class IAudioIo : public IMediaIo {
public:
    static class IAudioIo * Create(class IIoMux * const iomux, class IAudioPhone * const audioPhone, unsigned execInterval8khz);
    virtual ~IAudioIo() {};
    virtual class IAudioPhone *Initialize(class UAudioIo * const user, class UMediaIo * const mediaIoUser,
        int microphoneDeviceType, const char *microphoneDeviceName, int speakerDeviceType, const char *seakerDeviceName) = 0;
    virtual void AudioExec(class IAudioExec *audioExec) = 0;

    virtual void StartDualTones(dword toneFlags, unsigned toneCount, const struct AudioIoDualTone *tones) = 0;
    virtual void StopDualTones() = 0;

    virtual class IAudioIoChannel *CreateChannel(class UMediaIoChannel * const user) = 0;
    virtual void InitializeChannel(class IAudioIoChannel *audioIoChannel, enum AudioCoder coder, bool sc, unsigned mediaPacketizationMs) = 0;

    virtual void ChannelOpened(class IAudioIoChannel *audioIoChannel) = 0;
    virtual void ChannelClosed(class IAudioIoChannel *audioIoChannel) = 0;
    virtual void ChannelDestroyed(class IAudioIoChannel *audioIoChannel) = 0;
};

class UAudioIo {
public:
};

enum VideoDeviceType {
    Webcam = 128,
    VideoScreen,
};

class IVideoIoChannel : public IMediaIoChannel {
public:
    static class IVideoIoChannel * Create(class IVideoIo * videoIo, class UMediaIoChannel * const user, class IInstanceLog * log);
    static unsigned AvailableCoderCount();
    static enum VideoCoder AvailableCoder(unsigned coderNumber);
    virtual ~IVideoIoChannel() {};
    virtual void Initialize(enum VideoCoder coder) = 0;
};

class IVideoIo : public IMediaIo {
public:
    static class IVideoIo * Create(class IIoMux * const iomux, class IInstanceLog * log);
    virtual ~IVideoIo() {};
    virtual void Initialize(class UVideoIo * const user, class UMediaIo * const mediaIoUser) = 0;
};

class UVideoIo {
public:
};

enum AppSharingDeviceType {
    FrameBuffer = 192,
    Canvas,
};

class IAppSharingIoChannel : public IMediaIoChannel {
public:
    static class IAppSharingIoChannel * Create(class IAppSharingIo * appSharingIo, class UMediaIoChannel * const user);
    static unsigned AvailableCoderCount();
    static enum AppSharingCoder AvailableCoder(unsigned coderNumber);
    virtual ~IAppSharingIoChannel() {};
    virtual void Initialize() = 0;
};

class IAppSharingIo : public IMediaIo {
public:
    static class IAppSharingIo * Create(class IIoMux * const iomux, class IInstanceLog * log);
    virtual ~IAppSharingIo() {};
    virtual void Initialize(class UAppSharingIo * const user, class UMediaIo * const mediaIoUser) = 0;
};

class UAppSharingIo {
public:
};

class IJitterBuffer {
public:
    static IJitterBuffer * Create(class UJitterBuffer * user);
    virtual ~IJitterBuffer() {};

    virtual unsigned Configure(enum AudioCoder coder, unsigned mediaPacketizationMs, unsigned pullInterval8khz,
        unsigned minBufferMs, unsigned initialBufferMs, unsigned maxBufferMs) = 0;
    virtual void Adjust(unsigned initialBufferMs) = 0;
    virtual unsigned GetDelay() = 0;
    virtual void Push(const void * buf, size_t len, dword timestamp) = 0;
    virtual bool Pull(bool discard) = 0;
};

class UJitterBuffer {
public:
    virtual void JitterBufferPulled(IJitterBuffer * const jitterBuffer, const void * buf, size_t len) = 0;
};

class ISrtpSession {
public:
    static ISrtpSession * Create(byte * srtpMasterkey, byte * srtpMastersalt, const char * profile);
    virtual ~ISrtpSession() {};

    virtual byte * Protect(byte * header, int hLen, byte * payload, int pLen, int * olen) = 0;
    virtual int Unprotect(char * srtpPacket, int len) = 0;
    virtual byte * SrtcpProtect(byte * rtcpPacket, int pLen, int * olen) = 0;
    virtual int SrtcpUnprotect(char * srtcpPacket, int len) = 0;
};

class UMediaContainer {
public:
    virtual void ContainerSample(char * buf, int len) = 0;
};

class IMediaContainer {
public:
    virtual ~IMediaContainer() {};
    virtual void PutSample(char * buf, int len, dword timestamp) = 0;
};
