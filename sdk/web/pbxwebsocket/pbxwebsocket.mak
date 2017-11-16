
$(OUTDIR)/obj/pbxwebsocket_httpdata.cpp: $(IP_SRC)/web/pbxwebsocket/pbxwebsocket.mak $(IP_SRC)/web/pbxwebsocket/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/pbxwebsocket_httpdata.cpp \
		web/pbxwebsocket/innovaphone.pbxwebsocket.Connection.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD \
		web/pbxwebsocket/innovaphone.pbxwebsocket.OrtcEndpoint.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD \
		web/pbxwebsocket/innovaphone.pbxwebsocket.OrtcPeerConnection.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD \
		web/pbxwebsocket/innovaphone.pbxwebsocket.Preauthentication.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD \
		web/pbxwebsocket/innovaphone.pbxwebsocket.ToneGenerator.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD \
		web/pbxwebsocket/innovaphone.pbxwebsocket.WebRtcEndpoint.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/pbxwebsocket_httpdata.o
$(OUTDIR)/obj/pbxwebsocket_httpdata.o: $(OUTDIR)/obj/pbxwebsocket_httpdata.cpp
