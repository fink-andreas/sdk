
$(OUTDIR)/obj/ui.bubblecontainer_httpdata.cpp: $(IP_SRC)/web/ui.bubblecontainer/ui.bubblecontainer.mak $(IP_SRC)/web/ui.bubblecontainer/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/ui.bubblecontainer_httpdata.cpp \
		web/ui.bubblecontainer/innovaphone.ui.BubbleContainer.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/ui.bubblecontainer_httpdata.o
$(OUTDIR)/obj/ui.bubblecontainer_httpdata.o: $(OUTDIR)/obj/ui.bubblecontainer_httpdata.cpp
