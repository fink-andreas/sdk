
$(OUTDIR)/obj/ui.clipboard_httpdata.cpp: $(IP_SRC)/web/ui.clipboard/ui.clipboard.mak $(IP_SRC)/web/ui.clipboard/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.clipboard_httpdata.cpp \
		web/ui.clipboard/innovaphone.ui.ClipBoard.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.clipboard_httpdata.o
$(OUTDIR)/obj/ui.clipboard_httpdata.o: $(OUTDIR)/obj/ui.clipboard_httpdata.cpp
