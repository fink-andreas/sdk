
$(OUTDIR)/obj/ui.radioButton_httpdata.cpp: $(IP_SRC)/web/ui.radioButton/ui.radioButton.mak $(IP_SRC)/web/ui.radioButton/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.radioButton_httpdata.cpp \
		web/ui.radioButton/innovaphone.ui.radioButton.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.radioButton_httpdata.o
$(OUTDIR)/obj/ui.radioButton_httpdata.o: $(OUTDIR)/obj/ui.radioButton_httpdata.cpp
