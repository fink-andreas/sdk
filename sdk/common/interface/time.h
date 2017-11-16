/*---------------------------------------------------------------------------*/
/* time.h                                                                    */
/* copyright (c) innovaphone 2016                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

#define EPOCH_YEAR		1970
#define MAX_TRANSITS	(2 * (2037 - EPOCH_YEAR + 1))

typedef struct {
    struct {
        dword   utc;
        long    off;
    }   transits[MAX_TRANSITS];
    int numTransits;
    long tzStdOff;
    long tzDstOff;
} timezone_info_t;

typedef struct {
    int tmSec;			/* Seconds.	[0-60] (1 leap second) */
    int tmMin;			/* Minutes.	[0-59] */
    int tmHour;		    /* Hours.	[0-23] */
    int tmMDay;		    /* Day.		[1-31] */
    int tmMon;			/* Month.	[0-11] */
    int tmYear;		    /* Year	- 1900.  */
    int tmWDay;		    /* Day of week.	[0-6] */
    int tmYDay;		    /* Days in year.[0-365]	*/
    int tmIsDst;		/* DST.		[-1/0/1] */
} time_tm_t;

class ITime {
public:
    static bool ParseTimeZoneString(const char * tz, timezone_info_t & tiOut, int * errPos = NULL);

    static ulong64 TimeStampMilliseconds();
    static ulong64 TimeStampMilliseconds(timezone_info_t & ti);
    static ulong64 UTCTimeToLocalTime(ulong64 timeMsUtc, timezone_info_t & ti);

    static ulong64 GetMonotonicTime();
    static size_t GetTimeStamp(char * buf, unsigned sz);
    static void GetTimeStruct(ulong64 timeMs, time_tm_t * t);
    static void GetTimeStruct(ulong64 timeMs, time_tm_t * t, timezone_info_t & ti);

    static ulong64 TimeStructToMilliseconds(time_tm_t * ts);
    static bool NormalizeTimeStruct(time_tm_t * ts);

    static size_t FormatTimeStampISO(char * buf, unsigned length, ulong64 timeMs);
    static size_t FormatTimeStampRFC1123(char * buf, unsigned length, ulong64 timeMs);
    static size_t FormatTimeStamp(char * buf, unsigned length, const char * formatStr, ulong64 timeMs);
    static size_t FormatTimeStamp(char * buf, unsigned length, const char * formatStr, ulong64 timeMs, timezone_info_t & ti);
};
