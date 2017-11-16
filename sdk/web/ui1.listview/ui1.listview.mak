
$(OUTDIR)/obj/ui1.listview_httpdata.cpp: $(IP_SRC)/web/ui1.listview/ui1.listview.mak $(IP_SRC)/web/ui1.listview/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui1.listview_httpdata.cpp \
		web/ui1.listview/innovaphone.ui1.listview.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD \
		web/ui.listview/arrow.png,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui1.listview_httpdata.o
$(OUTDIR)/obj/ui1.listview_httpdata.o: $(OUTDIR)/obj/ui1.listview_httpdata.cpp
