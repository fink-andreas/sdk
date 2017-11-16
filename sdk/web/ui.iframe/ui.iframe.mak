
$(OUTDIR)/obj/ui.iframe_httpdata.cpp: $(IP_SRC)/web/ui.iframe/ui.iframe.mak $(IP_SRC)/web/ui.iframe/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.iframe_httpdata.cpp \
		web/ui.iframe/innovaphone.ui.IFrame.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.iframe_httpdata.o
$(OUTDIR)/obj/ui.iframe_httpdata.o: $(OUTDIR)/obj/ui.iframe_httpdata.cpp
