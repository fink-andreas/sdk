$(OUTDIR)/obj/ui.accordion_httpdata.cpp: $(IP_SRC)/web/ui.accordion/ui.accordion.mak $(IP_SRC)/web/ui.accordion/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.accordion_httpdata.cpp \
		web/ui.accordion/innovaphone.ui.accordion.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.accordion_httpdata.o
$(OUTDIR)/obj/ui.accordion_httpdata.o: $(OUTDIR)/obj/ui.accordion_httpdata.cpp
