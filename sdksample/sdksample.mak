include sdksample/apps/apps.mak

APP_OBJS += $(OUTDIR)/obj/sdksample.o
$(OUTDIR)/obj/sdksample.o: sdksample/sdksample.cpp

APP_OBJS += $(OUTDIR)/obj/helloworldsession.o
$(OUTDIR)/obj/helloworldsession.o: sdksample/helloworldsession.cpp

APP_OBJS += $(OUTDIR)/obj/pbxsession.o
$(OUTDIR)/obj/pbxsession.o: sdksample/pbxsession.cpp

