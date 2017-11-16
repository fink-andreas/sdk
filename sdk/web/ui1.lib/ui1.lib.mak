
ifndef WEB_UI1_LIB
WEB_UI1_LIB = 1
$(OUTDIR)/obj/ui1.lib_httpdata.cpp: $(IP_SRC)/web/ui1.lib/ui1.lib.mak $(IP_SRC)/web/ui1.lib/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui1.lib_httpdata.cpp \
		web/ui1.lib/innovaphone.ui1.lib.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui1.lib_httpdata.o
$(OUTDIR)/obj/ui1.lib_httpdata.o: $(OUTDIR)/obj/ui1.lib_httpdata.cpp
endif