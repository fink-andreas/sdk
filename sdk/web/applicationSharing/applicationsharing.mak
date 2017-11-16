
$(OUTDIR)/obj/applicationsharing_httpdata.cpp: $(IP_SRC)/web/applicationsharing/applicationsharing.mak $(IP_SRC)/web/applicationsharing/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/applicationsharing_httpdata.cpp \
		web/applicationsharing/innovaphone.applicationSharing.jpeg.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD \
		web/applicationsharing/innovaphone.applicationSharing.main.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD \
		web/applicationsharing/innovaphone.applicationSharing.png.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD \
		web/applicationsharing/innovaphone.applicationSharing.zlib.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/applicationsharing_httpdata.o
$(OUTDIR)/obj/applicationsharing_httpdata.o: $(OUTDIR)/obj/applicationsharing_httpdata.cpp
