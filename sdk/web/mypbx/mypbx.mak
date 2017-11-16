
$(OUTDIR)/obj/mypbx_httpdata.cpp: $(IP_SRC)/web/mypbx/mypbx.mak $(IP_SRC)/web/mypbx/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/mypbx_httpdata.cpp \
		web/mypbx/innovaphone.mypbx.ui.apps.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/mypbx_httpdata.o
$(OUTDIR)/obj/mypbx_httpdata.o: $(OUTDIR)/obj/mypbx_httpdata.cpp
