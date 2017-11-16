
$(OUTDIR)/obj/ui.calendar_httpdata.cpp: $(IP_SRC)/web/ui.calendar/ui.calendar.mak $(IP_SRC)/web/ui.calendar/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.calendar_httpdata.cpp \
		web/ui.calendar/innovaphone.ui.Calendar.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD \
		web/ui.calendar/innovaphone.ui.FlatButton.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD \
		web/ui.calendar/cal_icons.png,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.calendar_httpdata.o
$(OUTDIR)/obj/ui.calendar_httpdata.o: $(OUTDIR)/obj/ui.calendar_httpdata.cpp
