
$(OUTDIR)/obj/ui.editor_httpdata.cpp: $(IP_SRC)/web/ui.editor/ui.editor.mak $(IP_SRC)/web/ui.editor/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.editor_httpdata.cpp \
		web/ui.editor/innovaphone.ui.Editor.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.editor_httpdata.o
$(OUTDIR)/obj/ui.editor_httpdata.o: $(OUTDIR)/obj/ui.editor_httpdata.cpp
