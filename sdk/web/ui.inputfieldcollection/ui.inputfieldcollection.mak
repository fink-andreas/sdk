
$(OUTDIR)/obj/ui.inputfieldcollection_httpdata.cpp: $(IP_SRC)/web/ui.inputfieldcollection/ui.inputfieldcollection.mak $(IP_SRC)/web/ui.inputfieldcollection/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.inputfieldcollection_httpdata.cpp \
		web/ui.inputfieldcollection/innovaphone.ui.InputFieldCollection.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.inputfieldcollection_httpdata.o
$(OUTDIR)/obj/ui.inputfieldcollection_httpdata.o: $(OUTDIR)/obj/ui.inputfieldcollection_httpdata.cpp
