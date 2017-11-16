
$(OUTDIR)/obj/ui1.player_httpdata.cpp: $(IP_SRC)/web/ui1.player/ui1.player.mak $(IP_SRC)/web/ui1.player/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui1.player_httpdata.cpp \
		web/ui1.player/innovaphone.ui1.player.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui1.player_httpdata.o
$(OUTDIR)/obj/ui1.player_httpdata.o: $(OUTDIR)/obj/ui1.player_httpdata.cpp
