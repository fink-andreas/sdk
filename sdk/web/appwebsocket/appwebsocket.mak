
$(OUTDIR)/obj/appwebsocket_httpdata.cpp: $(IP_SRC)/web/appwebsocket/appwebsocket.mak $(IP_SRC)/web/appwebsocket/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/appwebsocket_httpdata.cpp \
		web/appwebsocket/innovaphone.appwebsocket.Connection.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/appwebsocket_httpdata.o
$(OUTDIR)/obj/appwebsocket_httpdata.o: $(OUTDIR)/obj/appwebsocket_httpdata.cpp
