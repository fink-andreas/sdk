
$(OUTDIR)/obj/app_lang.cpp: sdksample/apps/lang/*.*
		$(IP_SRC)/exe/httpfiles -k -d sdksample/apps -t $(OUTDIR) -o $(OUTDIR)/obj/app_lang.cpp \
        lang/helloworldlang.en.js,0,HTTP_GZIP \
        lang/helloworldlang.de.js,0,HTTP_GZIP \
        lang/pbx-presencelang.en.js,0,HTTP_GZIP \
        lang/pbx-presencelang.de.js,0,HTTP_GZIP

APP_OBJS += $(OUTDIR)/obj/app_lang.o
$(OUTDIR)/obj/app_lang.o: $(OUTDIR)/obj/app_lang.cpp
