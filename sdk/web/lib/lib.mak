
$(OUTDIR)/obj/lib_httpdata.cpp: $(IP_SRC)/web/lib/lib.mak $(IP_SRC)/web/lib/*.js $(IP_SRC)/web/lib/*.css 
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/lib_httpdata.cpp \
		web/lib/innovaphone.lib.css,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD \
		web/lib/innovaphone.lib.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/lib_httpdata.o
$(OUTDIR)/obj/lib_httpdata.o: $(OUTDIR)/obj/lib_httpdata.cpp
