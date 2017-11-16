
$(OUTDIR)/obj/ui.container_httpdata.cpp: $(IP_SRC)/web/ui.container/ui.container.mak $(IP_SRC)/web/ui.container/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.container_httpdata.cpp \
		web/ui.container/innovaphone.ui.Container.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.container_httpdata.o
$(OUTDIR)/obj/ui.container_httpdata.o: $(OUTDIR)/obj/ui.container_httpdata.cpp
