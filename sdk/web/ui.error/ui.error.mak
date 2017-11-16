
$(OUTDIR)/obj/ui.error_httpdata.cpp: $(IP_SRC)/web/ui.error/ui.error.mak $(IP_SRC)/web/ui.error/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.error_httpdata.cpp \
		web/ui.error/innovaphone.ui.Error.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.error_httpdata.o
$(OUTDIR)/obj/ui.error_httpdata.o: $(OUTDIR)/obj/ui.error_httpdata.cpp
