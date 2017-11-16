
$(OUTDIR)/obj/ui.text_httpdata.cpp: $(IP_SRC)/web/ui.text/ui.text.mak $(IP_SRC)/web/ui.text/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.text_httpdata.cpp \
		web/ui.text/innovaphone.ui.Text.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.text_httpdata.o
$(OUTDIR)/obj/ui.text_httpdata.o: $(OUTDIR)/obj/ui.text_httpdata.cpp
