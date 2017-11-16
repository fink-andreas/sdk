
-include sdk/sdk-lib.mak

-include $(OUTDIR)/dep/*.dep

WINBINS := $(subst /,\,$(bins))
# we create the directories with a shell command before any target is executed, 
# as the directories have to exist before a target is executed and this creates issues with parallel builds
WINBINS_HACK := $(shell mkdir $(WINBINS) 2>NUL)

$(OUTDIR)/obj/%.o: $<
	$(CC) -MMD -MF $(OUTDIR)/dep/$(basename $(notdir $@)).dep $(INCLUDES) $(CFLAGS) $(APP_CFLAGS) -o $@ $<

$(OUTBIN)/$(OUT)/$(OUT): $(COMMONOBJS) $(APP_OBJS) $(LIB_SDK)
	$(CC) $(LFLAGS) -o $@ $(COMMONOBJS) $(APP_OBJS) $(LIBS) -L $(OUTSDK) -lsdk

$(OUTBIN)/$(OUT)/$(OUT).debug: $(OUTBIN)/$(OUT)/$(OUT)
	$(OBJCPY) --only-keep-debug $(OUTBIN)/$(OUT)/$(OUT) $@
	$(OBJCPY) --strip-debug $(OUTBIN)/$(OUT)/$(OUT)
	$(OBJCPY) --add-gnu-debuglink $@ $(OUTBIN)/$(OUT)/$(OUT)
#	copy /b $(subst /,\\,$@)+,,

ifeq ($(DEBUG),1)
native i386 arm: $(OUTBIN)/$(OUT)/$(OUT)
else
native i386 arm: $(OUTBIN)/$(OUT)/$(OUT) $(OUTBIN)/$(OUT)/$(OUT).debug
endif

clean clean-i386 clean-arm: $(SDK_CLEANUP)
	$(foreach bin,$(WINBINS),@rd /S /Q $(bin) 2>NUL &)
	@echo "cleaned"

