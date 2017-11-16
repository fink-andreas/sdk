
$(OUTDIR)/obj/ui.splitpanelvertical_httpdata.cpp: $(IP_SRC)/web/ui.splitpanelvertical/ui.splitpanelvertical.mak $(IP_SRC)/web/ui.splitpanelvertical/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.splitpanelvertical_httpdata.cpp \
		web/ui.splitpanelvertical/innovaphone.ui.SplitPanelVertical.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.splitpanelvertical_httpdata.o
$(OUTDIR)/obj/ui.splitpanelvertical_httpdata.o: $(OUTDIR)/obj/ui.splitpanelvertical_httpdata.cpp
