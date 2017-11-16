
$(OUTDIR)/obj/ui.icon_httpdata.cpp: $(IP_SRC)/web/ui.icon/ui.icon.mak $(IP_SRC)/web/ui.icon/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.icon_httpdata.cpp \
		web/ui.icon/innovaphone.ui.Icon.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.icon_httpdata.o
$(OUTDIR)/obj/ui.icon_httpdata.o: $(OUTDIR)/obj/ui.icon_httpdata.cpp
