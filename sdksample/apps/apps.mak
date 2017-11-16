$(OUTDIR)/obj/apps.cpp: sdksample/apps/*.* sdksample/apps/lang/*.*
		$(IP_SRC)/exe/httpfiles -k -d sdksample/apps -t $(OUTDIR) -o $(OUTDIR)/obj/apps.cpp \
        helloworld.htm,0,HTTP_GZIP \
        helloworld.png,0,HTTP_GZIP \
        sdksample.helloworld.js,0,HTTP_GZIP \
		pbx-presence.htm,0,HTTP_GZIP \
        pbx-presence.png,0,HTTP_GZIP \
        sdksample.pbx.presence.js,0,HTTP_GZIP

APP_OBJS += $(OUTDIR)/obj/apps.o
$(OUTDIR)/obj/apps.o: $(OUTDIR)/obj/apps.cpp

include sdksample/apps/styles/styles.mak
include sdksample/apps/lang/lang.mak
