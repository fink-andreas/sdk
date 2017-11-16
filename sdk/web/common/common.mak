
$(OUTDIR)/obj/common_httpdata.cpp: $(IP_SRC)/web/common/common.mak $(IP_SRC)/web/common/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/common_httpdata.cpp \
		web/common/innovaphone.common.crypto.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/common_httpdata.o
$(OUTDIR)/obj/common_httpdata.o: $(OUTDIR)/obj/common_httpdata.cpp
