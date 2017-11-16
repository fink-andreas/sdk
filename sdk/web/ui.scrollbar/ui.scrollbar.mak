
$(OUTDIR)/obj/ui.scrollbar_httpdata.cpp: $(IP_SRC)/web/ui.scrollbar/ui.scrollbar.mak $(IP_SRC)/web/ui.scrollbar/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.scrollbar_httpdata.cpp \
		web/ui.scrollbar/innovaphone.ui.ScrollBar.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.scrollbar_httpdata.o
$(OUTDIR)/obj/ui.scrollbar_httpdata.o: $(OUTDIR)/obj/ui.scrollbar_httpdata.cpp
