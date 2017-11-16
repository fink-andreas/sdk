
$(OUTDIR)/obj/ui.lang_httpdata.cpp: $(IP_SRC)/web/ui.lang/ui.lang.mak $(IP_SRC)/web/ui.lang/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.lang_httpdata.cpp \
		web/ui.lang/innovaphone.ui.Lang.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.lang_httpdata.o
$(OUTDIR)/obj/ui.lang_httpdata.o: $(OUTDIR)/obj/ui.lang_httpdata.cpp
