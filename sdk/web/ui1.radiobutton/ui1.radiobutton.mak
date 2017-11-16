
$(OUTDIR)/obj/ui1.radiobutton_httpdata.cpp: $(IP_SRC)/web/ui1.radiobutton/ui1.radiobutton.mak $(IP_SRC)/web/ui1.radiobutton/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui1.radiobutton_httpdata.cpp \
		web/ui1.radiobutton/innovaphone.ui1.radiobutton.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui1.radiobutton_httpdata.o
$(OUTDIR)/obj/ui1.radiobutton_httpdata.o: $(OUTDIR)/obj/ui1.radiobutton_httpdata.cpp
