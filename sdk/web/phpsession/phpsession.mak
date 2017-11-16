
$(OUTDIR)/obj/phpsession_httpdata.cpp: $(IP_SRC)/web/phpsession/phpsession.mak $(IP_SRC)/web/phpsession/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/phpsession_httpdata.cpp \
		web/phpsession/innovaphone.phpsession.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/phpsession_httpdata.o
$(OUTDIR)/obj/phpsession_httpdata.o: $(OUTDIR)/obj/phpsession_httpdata.cpp
