
$(OUTDIR)/obj/ui.tilelist_httpdata.cpp: $(IP_SRC)/web/ui.tilelist/ui.tilelist.mak $(IP_SRC)/web/ui.tilelist/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.tilelist_httpdata.cpp \
		web/ui.tilelist/innovaphone.ui.tilelist.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.tilelist_httpdata.o
$(OUTDIR)/obj/ui.tilelist_httpdata.o: $(OUTDIR)/obj/ui.tilelist_httpdata.cpp
