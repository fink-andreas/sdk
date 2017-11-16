
IP_SRC   = sdk
HTTPFILES-FLAGS = -k

SYSROOT  =
INCLUDES = -I sdk
# we need -fno-delete-null-pointer-checks as the btree implementations uses if(!this) ... GCC 6 removes this, as the new standard assumes that this is always NOT NULL
CFLAGS	 = -Wall -Werror -fno-delete-null-pointer-checks -c -D NO_LEGACY -D BUILD=$(BUILD) 
LIBS     = -lpthread -luuid 
OUTDIR   = .
BUILDDIR = .
OBJ_EXT  = o

ifeq ($(DEBUG), 1)
    CFLAGS += -g3 -O0 -DDEBUG
else
    CFLAGS += -g -O3
endif

TOOLSDIR := $(T)


### i386 #############
ifeq ($(MAKECMDGOALS),i386)
SYSROOT := $(TOOLSDIR)/app-platform-libs/10003/i386
ifeq ($(DEBUG),1)
    OUTDIR = i386-debug
else
    OUTDIR = i386
endif
CC       = i486-linux-gnu-g++.exe
AR       = i486-linux-gnu-ar.exe
OBJCPY   = i486-linux-gnu-objcopy.exe
CFLAGS  += -isystem $(TOOLSDIR)/i486-7.1.0-linux-gnu/i486-linux-gnu/include/c++/7.1.0 -isystem $(SYSROOT)/usr/include
LFLAGS  += --sysroot=$(SYSROOT)
LFLAGS  += -Wl,-rpath,$(SYSROOT)/usr/lib
LFLAGS  += -Wl,-rpath,$(SYSROOT)/lib
LFLAGS  += -Wl,--warn-common
#LFLAGS  += -v 
#LFLAGS  += -Wl,-verbose 
#LFLAGS  += -Wl,--print-map,--cref
endif

ifeq ($(MAKECMDGOALS),clean-i386)
ifeq ($(DEBUG),1)
    OUTDIR = i386-debug
else
    OUTDIR = i386
endif
endif
####################

### arm #############
ifeq ($(MAKECMDGOALS),arm)
SYSROOT := $(TOOLSDIR)/app-platform-libs/10003/armel
ifeq ($(DEBUG),1)
    OUTDIR = arm-debug
else
    OUTDIR = arm
endif
CC       = arm-linux-gnueabi-g++.exe
AR       = arm-linux-gnueabi-ar.exe
OBJCPY   = arm-linux-gnueabi-objcopy.exe
CFLAGS  += -isystem $(TOOLSDIR)/arm-7.1.0-linux-gnu/arm-linux-gnueabi/include/c++/7.1.0 -isystem $(SYSROOT)/usr/include
LFLAGS  += --sysroot=$(SYSROOT)
LFLAGS  += -Wl,-rpath,$(SYSROOT)/usr/lib
LFLAGS  += -Wl,-rpath,$(SYSROOT)/lib
LFLAGS  += -Wl,--warn-common
#LFLAGS  += -v 
#LFLAGS  += -Wl,-verbose 
endif

ifeq ($(MAKECMDGOALS),clean-arm)
ifeq ($(DEBUG),1)
    OUTDIR = arm-debug
else
    OUTDIR = arm
endif
endif
ifeq ($(MAKECMDGOALS),clean-i386)
ifeq ($(DEBUG),1)
    OUTDIR = i386-debug
else
    OUTDIR = i386
endif
endif
####################

ifeq ($(MAKE_SDK),1)
    OUTBIN = sdk-out/sdk/lib/$(OUTDIR)
    OUTSDK = $(OUTBIN)
else
    OUTBIN = $(OUTDIR)
    OUTSDK = sdk/lib/$(OUTDIR)
endif

bins = $(OUTDIR) $(OUTDIR)/dep $(OUTDIR)/obj $(OUTBIN)/$(OUT) 

force: