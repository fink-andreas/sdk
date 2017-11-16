
$(OUTDIR)/obj/ui.listview_httpdata.cpp: $(IP_SRC)/web/ui.listview/ui.listview.mak $(IP_SRC)/web/ui.listview/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.listview_httpdata.cpp \
		web/ui.listview/innovaphone.ui.ListView.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.listview_httpdata.o
$(OUTDIR)/obj/ui.listview_httpdata.o: $(OUTDIR)/obj/ui.listview_httpdata.cpp
