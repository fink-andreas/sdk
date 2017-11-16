
$(OUTDIR)/obj/ui.textarea_httpdata.cpp: $(IP_SRC)/web/ui.textarea/ui.textarea.mak $(IP_SRC)/web/ui.textarea/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.textarea_httpdata.cpp \
		web/ui.textarea/innovaphone.ui.TextArea.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.textarea_httpdata.o
$(OUTDIR)/obj/ui.textarea_httpdata.o: $(OUTDIR)/obj/ui.textarea_httpdata.cpp
