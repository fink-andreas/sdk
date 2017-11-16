
$(OUTDIR)/obj/fonts_httpdata.cpp: $(IP_SRC)/web/fonts/*.*
		$(IP_SRC)/exe/httpfiles  $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/fonts_httpdata.cpp \
		web/fonts/titilliumweb-regular.ttf,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD \

COMMONOBJS += $(OUTDIR)/obj/fonts_httpdata.o
$(OUTDIR)/obj/fonts_httpdata.o: $(OUTDIR)/obj/fonts_httpdata.cpp
