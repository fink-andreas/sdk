
$(OUTDIR)/obj/ui.grid_httpdata.cpp: $(IP_SRC)/web/ui.grid/ui.grid.mak $(IP_SRC)/web/ui.grid/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.grid_httpdata.cpp \
		web/ui.grid/innovaphone.ui.Grid.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.grid_httpdata.o
$(OUTDIR)/obj/ui.grid_httpdata.o: $(OUTDIR)/obj/ui.grid_httpdata.cpp
