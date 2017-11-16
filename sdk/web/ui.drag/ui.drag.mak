
$(OUTDIR)/obj/ui.drag_httpdata.cpp: $(IP_SRC)/web/ui.drag/ui.drag.mak $(IP_SRC)/web/ui.drag/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.drag_httpdata.cpp \
		web/ui.drag/innovaphone.ui.Drag.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.drag_httpdata.o
$(OUTDIR)/obj/ui.drag_httpdata.o: $(OUTDIR)/obj/ui.drag_httpdata.cpp
