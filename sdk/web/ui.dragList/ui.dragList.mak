$(OUTDIR)/obj/ui.dragList_httpdata.cpp: $(IP_SRC)/web/ui.dragList/ui.dragList.mak $(IP_SRC)/web/ui.dragList/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.dragList_httpdata.cpp \
		web/ui.dragList/innovaphone.ui.dragList.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.dragList_httpdata.o
$(OUTDIR)/obj/ui.dragList_httpdata.o: $(OUTDIR)/obj/ui.dragList_httpdata.cpp
