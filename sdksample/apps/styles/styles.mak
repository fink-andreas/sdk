
$(OUTDIR)/obj/app_styles.cpp: sdksample/apps/styles/*.*
		$(IP_SRC)/exe/httpfiles -k -d sdksample/apps -t $(OUTDIR) -o $(OUTDIR)/obj/app_styles.cpp \
        styles/sdksample.css,0,HTTP_GZIP 

APP_OBJS += $(OUTDIR)/obj/app_styles.o
$(OUTDIR)/obj/app_styles.o: $(OUTDIR)/obj/app_styles.cpp
