
$(OUTDIR)/obj/ui.contentheader_httpdata.cpp: $(IP_SRC)/web/ui.contentheader/ui.contentheader.mak $(IP_SRC)/web/ui.contentheader/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.contentheader_httpdata.cpp \
		web/ui.contentheader/innovaphone.ui.ContentHeader.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.contentheader_httpdata.o
$(OUTDIR)/obj/ui.contentheader_httpdata.o: $(OUTDIR)/obj/ui.contentheader_httpdata.cpp
