
$(OUTDIR)/obj/ui.input_httpdata.cpp: $(IP_SRC)/web/ui.input/ui.input.mak $(IP_SRC)/web/ui.input/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.input_httpdata.cpp \
		web/ui.input/innovaphone.ui.Input.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.input_httpdata.o
$(OUTDIR)/obj/ui.input_httpdata.o: $(OUTDIR)/obj/ui.input_httpdata.cpp
