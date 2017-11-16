
$(OUTDIR)/obj/ui.wizard_httpdata.cpp: $(IP_SRC)/web/ui.wizard/ui.wizard.mak $(IP_SRC)/web/ui.wizard/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.wizard_httpdata.cpp \
		web/ui.wizard/innovaphone.ui.Wizard.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.wizard_httpdata.o
$(OUTDIR)/obj/ui.wizard_httpdata.o: $(OUTDIR)/obj/ui.wizard_httpdata.cpp
