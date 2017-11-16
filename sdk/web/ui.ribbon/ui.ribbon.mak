
$(OUTDIR)/obj/ui.ribbon_httpdata.cpp: $(IP_SRC)/web/ui.ribbon/ui.ribbon.mak $(IP_SRC)/web/ui.ribbon/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.ribbon_httpdata.cpp \
		web/ui.ribbon/innovaphone.ui.Ribbon.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.ribbon_httpdata.o
$(OUTDIR)/obj/ui.ribbon_httpdata.o: $(OUTDIR)/obj/ui.ribbon_httpdata.cpp
