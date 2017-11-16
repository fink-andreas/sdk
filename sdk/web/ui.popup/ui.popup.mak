
$(OUTDIR)/obj/ui.popup_httpdata.cpp: $(IP_SRC)/web/ui.popup/ui.popup.mak $(IP_SRC)/web/ui.popup/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.popup_httpdata.cpp \
		web/ui.popup/innovaphone.ui.Popup.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.popup_httpdata.o
$(OUTDIR)/obj/ui.popup_httpdata.o: $(OUTDIR)/obj/ui.popup_httpdata.cpp
