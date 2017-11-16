
$(OUTDIR)/obj/ui.editpopup_httpdata.cpp: $(IP_SRC)/web/ui.editpopup/ui.editpopup.mak $(IP_SRC)/web/ui.editpopup/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.editpopup_httpdata.cpp \
		web/ui.editpopup/innovaphone.ui.EditPopup.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.editpopup_httpdata.o
$(OUTDIR)/obj/ui.editpopup_httpdata.o: $(OUTDIR)/obj/ui.editpopup_httpdata.cpp
