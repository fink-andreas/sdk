
$(OUTDIR)/obj/ui1.editor_httpdata.cpp: $(IP_SRC)/web/ui1.editor/ui1.editor.mak $(IP_SRC)/web/ui1.editor/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui1.editor_httpdata.cpp \
		web/ui1.editor/innovaphone.ui1.editor.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD \
        web/ui1.editor/ui1.editor.png,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD \

COMMONOBJS += $(OUTDIR)/obj/ui1.editor_httpdata.o
$(OUTDIR)/obj/ui1.editor_httpdata.o: $(OUTDIR)/obj/ui1.editor_httpdata.cpp
