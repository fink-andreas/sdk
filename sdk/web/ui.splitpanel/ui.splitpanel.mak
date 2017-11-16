
$(OUTDIR)/obj/ui.splitpanel_httpdata.cpp: $(IP_SRC)/web/ui.splitpanel/ui.splitpanel.mak $(IP_SRC)/web/ui.splitpanel/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.splitpanel_httpdata.cpp \
		web/ui.splitpanel/innovaphone.ui.SplitPanel.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.splitpanel_httpdata.o
$(OUTDIR)/obj/ui.splitpanel_httpdata.o: $(OUTDIR)/obj/ui.splitpanel_httpdata.cpp
