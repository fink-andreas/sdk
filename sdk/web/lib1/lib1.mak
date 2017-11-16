
$(OUTDIR)/obj/lib1_httpdata.cpp: $(IP_SRC)/web/lib1/lib1.mak $(IP_SRC)/web/lib1/*.js $(IP_SRC)/web/lib1/*.css
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/lib1_httpdata.cpp \
		web/lib1/innovaphone.lib1.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD \
		web/lib1/innovaphone.lib1.css,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD \

COMMONOBJS += $(OUTDIR)/obj/lib1_httpdata.o
$(OUTDIR)/obj/lib1_httpdata.o: $(OUTDIR)/obj/lib1_httpdata.cpp
