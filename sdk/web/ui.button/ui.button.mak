
$(OUTDIR)/obj/ui.button_httpdata.cpp: $(IP_SRC)/web/ui.button/ui.button.mak $(IP_SRC)/web/ui.button/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.button_httpdata.cpp \
		web/ui.button/innovaphone.ui.Button.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.button_httpdata.o
$(OUTDIR)/obj/ui.button_httpdata.o: $(OUTDIR)/obj/ui.button_httpdata.cpp
