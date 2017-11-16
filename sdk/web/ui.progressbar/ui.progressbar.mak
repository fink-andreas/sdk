
$(OUTDIR)/obj/ui.progressbar_httpdata.cpp: $(IP_SRC)/web/ui.progressbar/ui.progressbar.mak $(IP_SRC)/web/ui.progressbar/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.progressbar_httpdata.cpp \
		web/ui.progressbar/innovaphone.ui.ProgressBar.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.progressbar_httpdata.o
$(OUTDIR)/obj/ui.progressbar_httpdata.o: $(OUTDIR)/obj/ui.progressbar_httpdata.cpp
