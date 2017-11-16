
$(OUTDIR)/obj/ui.dropdown_httpdata.cpp: $(IP_SRC)/web/ui.dropdown/ui.dropdown.mak $(IP_SRC)/web/ui.dropdown/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.dropdown_httpdata.cpp \
		web/ui.dropdown/innovaphone.ui.DropDown.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.dropdown_httpdata.o
$(OUTDIR)/obj/ui.dropdown_httpdata.o: $(OUTDIR)/obj/ui.dropdown_httpdata.cpp
