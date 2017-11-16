
$(OUTDIR)/obj/ui.confirmationpopup_httpdata.cpp: $(IP_SRC)/web/ui.confirmationpopup/ui.confirmationpopup.mak $(IP_SRC)/web/ui.confirmationpopup/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.confirmationpopup_httpdata.cpp \
		web/ui.confirmationpopup/innovaphone.ui.ConfirmationPopup.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.confirmationpopup_httpdata.o
$(OUTDIR)/obj/ui.confirmationpopup_httpdata.o: $(OUTDIR)/obj/ui.confirmationpopup_httpdata.cpp
