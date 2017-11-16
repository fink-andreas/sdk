#----------------------------------------------------------------------------
# sdksample.mak
# copyright (c) innovaphone 2015
#----------------------------------------------------------------------------

OUT = sdksample

include sdk/sdk-defs.mak
LIBS += -lpq

include sdk/web/fonts/fonts.mak
include sdk/web/lib1/lib1.mak
include sdk/web/ui1.lib/ui1.lib.mak
include sdk/web/appwebsocket/appwebsocket.mak
include sdk/web/common/common.mak

include sdksample/sdksample.mak

APP_OBJS += $(OUTDIR)/obj/sdksample-main.o
$(OUTDIR)/obj/sdksample-main.o: sdksample-main.cpp

include sdk/sdk.mak
