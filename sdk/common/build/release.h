
// the components release state. usually applied in platform/config.h
# define RELEASE_STATE "dvl "
# define VERSION_STR_MAJOR "13r1"
# define VERSION_STR "13r1"
# define VERSION_SOAP 1300

#define DO_QUOTE(X)     #X
#define QUOTE(X)        DO_QUOTE(X)
#define BUILD_STRING    QUOTE(BUILD)
