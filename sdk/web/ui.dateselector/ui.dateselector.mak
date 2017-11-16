
$(OUTDIR)/obj/ui.dateselector_httpdata.cpp: $(IP_SRC)/web/ui.dateselector/ui.dateselector.mak $(IP_SRC)/web/ui.dateselector/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.dateselector_httpdata.cpp \
		web/ui.dateselector/innovaphone.ui.DateSelector.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.dateselector_httpdata.o
$(OUTDIR)/obj/ui.dateselector_httpdata.o: $(OUTDIR)/obj/ui.dateselector_httpdata.cpp
