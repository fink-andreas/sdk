
ifndef WEB_COM_INNOVAPHONE_AVATAR
WEB_COM_INNOVAPHONE_AVATAR = 1

$(OUTDIR)/obj/com_innovaphone_avatar_httpdata.cpp: $(IP_SRC)/web/com.innovaphone.avatar/com.innovaphone.avatar.mak $(IP_SRC)/web/com.innovaphone.avatar/*.js
		$(IP_SRC)/exe/httpfiles $(HTTPFILES-FLAGS) -d $(IP_SRC) -o $(OUTDIR)/obj/com_innovaphone_avatar_httpdata.cpp \
		web/com.innovaphone.avatar/com.innovaphone.avatar.js,SERVLET_STATIC,HTTP_CACHE+HTTP_NOPWD+HTTP_FORCENOPWD

COMMONOBJS += $(OUTDIR)/obj/com_innovaphone_avatar_httpdata.o
$(OUTDIR)/obj/com_innovaphone_avatar_httpdata.o: $(OUTDIR)/obj/com_innovaphone_avatar_httpdata.cpp

endif