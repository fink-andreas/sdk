$(OUTDIR)/obj/ui.autocompleteinput_httpdata.cpp: $(IP_SRC)/web/ui.autocompleteinput/ui.autocompleteinput.mak $(IP_SRC)/web/ui.autocompleteinput/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.autocompleteinput_httpdata.cpp \
		web/ui.autocompleteinput/innovaphone.ui.autocompleteinput.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.autocompleteinput_httpdata.o
$(OUTDIR)/obj/ui.autocompleteinput_httpdata.o: $(OUTDIR)/obj/ui.autocompleteinput_httpdata.cpp

