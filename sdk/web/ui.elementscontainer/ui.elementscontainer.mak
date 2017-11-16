
$(OUTDIR)/obj/ui.elementscontainer_httpdata.cpp: $(IP_SRC)/web/ui.elementscontainer/ui.elementscontainer.mak $(IP_SRC)/web/ui.elementscontainer/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.elementscontainer_httpdata.cpp \
		web/ui.elementscontainer/innovaphone.ui.ElementsContainer.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.elementscontainer_httpdata.o
$(OUTDIR)/obj/ui.elementscontainer_httpdata.o: $(OUTDIR)/obj/ui.elementscontainer_httpdata.cpp
