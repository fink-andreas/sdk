
$(OUTDIR)/obj/ui.label_httpdata.cpp: $(IP_SRC)/web/ui.label/ui.label.mak $(IP_SRC)/web/ui.label/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.label_httpdata.cpp \
		web/ui.label/innovaphone.ui.Label.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.label_httpdata.o
$(OUTDIR)/obj/ui.label_httpdata.o: $(OUTDIR)/obj/ui.label_httpdata.cpp
