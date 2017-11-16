/*---------------------------------------------------------------------------*/
/* debug.h	                                                                 */
/* copyright (c) innovaphone 2015                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

enum LogFlags {						// Additional logflags can be added to the logFlags enum, but not removed.
    LOG_APP = 0x0001,				// The logFlags enum must be maintained simultaneously with the static TraceFlags array below.
    LOG_DATABASE = 0x0002,
    LOG_DB_FILES = 0x0004,
    LOG_DNS = 0x0008,
    LOG_ETHERNET = 0x0010,
    LOG_FILE = 0x0020,
    LOG_FILES = 0x0040,
    LOG_HTTP_CLIENT = 0x0080,
    LOG_HTTP_FILE = 0x0100,
    LOG_PROCESS = 0x0200,
    LOG_TLS = 0x0400,
    LOG_TCP = 0x0800,
    LOG_LDS = 0x1000,
    LOG_WEBSERVER_PLUGIN = 0x2000,
    LOG_WEBSOCKET_CLIENT = 0x4000,
    LOG_APP_WEBSOCKET = 0x8000,
    LOG_WEBDAV_SERVICE = 0x10000,
    LOG_COMMAND = 0x20000,
    LOG_CONFIG = 0x40000,
    LOG_TIME = 0x80000,
    LOG_SMTP = 0x100000,
    LOG_UDP = 0x200000,
    LOG_DTLS = 0x400000,
    LOG_MEDIA = 0x800000,
    LOG_MEDIA_CHANNEL = 0x1000000,
    LOG_ICE = 0x2000000,
    LOG_TURN = 0x4000000,
    LOG_WINDOWS_FRAME_BUFFER = 0x8000000,
    LOG_WINDOWS_CANVAS = 0x10000000,
    LOG_AUDIO = 0x20000000,
};

static const char * const TraceFlags[] = { "APP", "DATABASE", "DB FILES", "DNS", "ETHERNET", "FILE", "FILES", "HTTP CLIENT", "HTTP FILE", "PROCESS",
                                           "TLS", "TCP", "LDS", "WEBSERVER TRAFFIC", "WEBSOCKET CLIENT", "APP WEBSOCKET", "WEBDAV SERVICE", "COMMAND", 
                                           "CONFIG", "TIME", "SMTP", "UDP", "DTLS", "MEDIA", "MEDIA CHANNEL", "ICE", "TURN",
                                           "WINDOWS FRAME BUFFER", "WINDOWS CANVAS", "AUDIO", NULL };

class IDebug {
public:
    virtual ~IDebug();

    static IDebug * Create();

    virtual void printf(const char * format, ...) = 0;
    virtual void hexdump(const void * buffer, size_t size) = 0;
    virtual void appPrintf(const char * appName, const char * appDomain, const char * format, ...) = 0;
    virtual void appPrintfV(const char * appName, const char * appDomain, const char * format, va_list ap) = 0;
    virtual void appHexdump(const char * appName, const char * appDomain, const void * buffer, size_t size) = 0;
    virtual bool IsDebuggerPresent() { return false; };
    virtual void CheckCoreDump() {};
    virtual void SetIIoMux(void * iomux) {};
    virtual void ReOpenLogFile() {};
};

extern IDebug * debug;  // Will be allocated automatically

class IInstanceLog {
private:
    virtual const char * GetAppName() const = 0;
    virtual const char * GetAppDomain() const = 0;

protected:
    ulong64 logFlags;

public:
    IInstanceLog() {
        logFlags = 0;
    }

    inline void Log(enum LogFlags flag, const char * format, ...)
    {
        if (logFlags & flag) {
            va_list ap;
            va_start(ap, format);
            debug->appPrintfV(this->GetAppName(), this->GetAppDomain(), format, ap);
            va_end(ap);
        }
    }

    inline void LogV(enum LogFlags flag, const char * format, va_list ap)
    {
        if (logFlags & flag) {
            debug->appPrintfV(this->GetAppName(), this->GetAppDomain(), format, ap);
        }
    }

    inline void HexDump(enum LogFlags flag, const void * buffer, size_t size)
    {
        if (logFlags & flag) {
            debug->appHexdump(this->GetAppName(), this->GetAppDomain(), buffer, size);
        }
    }

    inline bool LogFlagSet(enum LogFlags flag)
    {
        return (logFlags & flag) > 0;
    }
};

