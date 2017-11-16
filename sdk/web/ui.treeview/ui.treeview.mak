
$(OUTDIR)/obj/ui.treeview_httpdata.cpp: $(IP_SRC)/web/ui.treeview/ui.treeview.mak $(IP_SRC)/web/ui.treeview/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.treeview_httpdata.cpp \
		web/ui.treeview/innovaphone.ui.TreeView.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.treeview_httpdata.o
$(OUTDIR)/obj/ui.treeview_httpdata.o: $(OUTDIR)/obj/ui.treeview_httpdata.cpp
