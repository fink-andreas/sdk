
$(OUTDIR)/obj/ui.hider_httpdata.cpp: $(IP_SRC)/web/ui.hider/ui.hider.mak $(IP_SRC)/web/ui.hider/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.hider_httpdata.cpp \
		web/ui.hider/innovaphone.ui.Hider.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.hider_httpdata.o
$(OUTDIR)/obj/ui.hider_httpdata.o: $(OUTDIR)/obj/ui.hider_httpdata.cpp
