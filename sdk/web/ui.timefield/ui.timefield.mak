
$(OUTDIR)/obj/ui.timefield_httpdata.cpp: $(IP_SRC)/web/ui.timefield/ui.timefield.mak $(IP_SRC)/web/ui.timefield/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.timefield_httpdata.cpp \
		web/ui.timefield/innovaphone.ui.TimeField.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.timefield_httpdata.o
$(OUTDIR)/obj/ui.timefield_httpdata.o: $(OUTDIR)/obj/ui.timefield_httpdata.cpp
