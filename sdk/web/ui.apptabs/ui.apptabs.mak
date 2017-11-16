
$(OUTDIR)/obj/ui.AppTabs_httpdata.cpp: $(IP_SRC)/web/ui.AppTabs/ui.AppTabs.mak $(IP_SRC)/web/ui.AppTabs/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.AppTabs_httpdata.cpp \
		web/ui.apptabs/innovaphone.ui.AppTabs.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.AppTabs_httpdata.o
$(OUTDIR)/obj/ui.AppTabs_httpdata.o: $(OUTDIR)/obj/ui.AppTabs_httpdata.cpp
