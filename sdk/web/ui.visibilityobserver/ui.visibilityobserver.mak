
$(OUTDIR)/obj/ui.visibilityobserver_httpdata.cpp: $(IP_SRC)/web/ui.visibilityobserver/ui.visibilityobserver.mak $(IP_SRC)/web/ui.visibilityobserver/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.visibilityobserver_httpdata.cpp \
		web/ui.visibilityobserver/innovaphone.ui.VisibilityObserver.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.visibilityobserver_httpdata.o
$(OUTDIR)/obj/ui.visibilityobserver_httpdata.o: $(OUTDIR)/obj/ui.visibilityobserver_httpdata.cpp
