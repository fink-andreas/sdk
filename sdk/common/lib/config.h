
/*---------------------------------------------------------------------------*/
/* config.h                                                                  */
/* copyright (c) innovaphone 2017                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

class UConfigContextApi {
public:
    virtual ~UConfigContextApi() {}
    virtual void SendConfig(class IJsonApiConnection * connection, const char * mt) = 0;
    virtual void UpdateConfig(class IJsonApiConnection * connection, class json_io * json, dword base) = 0;
};


class ConfigApiContext : public istd::listElement<ConfigApiContext>, public JsonApi {
private:
    IJsonApiConnection * const connection;
    UConfigContextApi * const user;
    IInstanceLog * const log;

public:
    ConfigApiContext(IJsonApiConnection * connection, UConfigContextApi * user, IInstanceLog * const log);
    ~ConfigApiContext();

    const char * Name() override;
    IJsonApiConnection * GetConnection();
    void Message(class json_io & msg, word base, const char * mt, const char * src) override;
    void JsonApiConnectionClosed() override;
};


class ConfigContext : public UTask, public UJsonApiContext, public UConfigContextApi {
private:
    friend class ConfigItem;
    friend class TaskWriteConfigUnmanaged;
    friend class TaskWriteValue;

    class IDatabase * database;
    class IInstanceLog * const log;

    class istd::list<class ConfigItem> items;
    class istd::list<class ConfigApiContext> apiContextList;

    class ITask * CreateUpdateConfigTask(class json_io * json, dword base);
    void TaskComplete(class ITask * const task) override;
    void TaskFailed(class ITask * const task) override;

    void RegisterConfigItem(class ConfigItem * item);

    void SendWriteConfigResult(class IJsonApiConnection * connection, const char * result);
    void SendConfig(class IJsonApiConnection * connection, const char * mt) override;
    void UpdateConfig(class IJsonApiConnection * connection, class json_io * json, dword base) override;

    class JsonApi * CreateJsonApi(class IJsonApiConnection * connection, class json_io & msg, word base) override;
    const char * Name() override { return "Config"; }

protected:
    virtual void ConfigChanged() {}
    virtual void ConfigChangedUnmanaged() {}
    virtual bool CanReadConfig(IJsonApiConnection * const connection) { return true; }
    virtual bool CanWriteConfig(IJsonApiConnection * const connection) { return true; }
    class ITask * UpdateUnmanagedItems();

public:
    ConfigContext(class IDatabase * database, class IInstanceLog * log);
    virtual ~ConfigContext();

    class ITask * CreateInitTask(class IDatabase * database = 0);
    void ResetChangedFlag();
    class ITask * WriteItemValue(ConfigItem * item, const char * value, bool notify);
};


class ConfigItem : public istd::listElement<ConfigItem> {
private:
    char * name;

protected:
    friend class TaskWriteConfig;
    friend class TaskWriteConfigUnmanaged;
    friend class TaskInitConfig;
    friend class ConfigContext;

    class IInstanceLog * const log;
    bool changed;
    bool unmanaged;

    virtual void ReadValueFromDataset(class IDataSet * dataset) = 0;
    virtual bool ReadValueFromJSON(class json_io * json, dword base) = 0;
    virtual void WriteValueToJSON(class json_io * json, dword base, char * & convBuf) = 0;
    virtual int WriteValueToString(char * dest, size_t destSize) = 0;

public:
    ConfigItem(ConfigContext * context, const char * name, bool unmanaged);
    virtual ~ConfigItem();

    const char * GetName() const { return this->name; }
    bool Changed() const { return this->changed; }
    virtual bool HasDefaultValue() = 0;
};


class ConfigChoice : public ConfigItem {
private:
    size_t optionsCount;
    size_t defValueIdx;
    size_t valueIdx;
    const char ** choiceValues;

protected:
    friend class ConfigContext;
    void SetWriteValue(const char * option);
    virtual void ReadValueFromDataset(class IDataSet * dataset) override;
    virtual bool ReadValueFromJSON(class json_io * json, dword base) override;
    virtual void WriteValueToJSON(class json_io * json, dword base, char * & convBuf) override;
    virtual int WriteValueToString(char * dest, size_t destSize) override;

public:
    ConfigChoice(ConfigContext * context, const char * name, size_t defVal, const char ** options, bool unmanaged = false);
    virtual ~ConfigChoice();

    int ValueIdx() const { return this->valueIdx; }
    const char * Value() const { return (this->valueIdx < this->optionsCount ? this->choiceValues[this->valueIdx] : NULL); }
    void SetValue(const char * option);
    void SetValueIdx(size_t valudIdx);
    virtual bool HasDefaultValue();
};


class ConfigBool : public ConfigItem {
private:
    bool defValue;
    bool value;

protected:
    friend class ConfigContext;
    void SetWriteValue(const char * value);
    virtual void ReadValueFromDataset(class IDataSet * dataset) override;
    virtual bool ReadValueFromJSON(class json_io * json, dword base) override;
    virtual void WriteValueToJSON(class json_io * json, dword base, char * & convBuf) override;
    virtual int WriteValueToString(char * dest, size_t destSize) override;

public:
    ConfigBool(ConfigContext * context, const char * name, bool defVal, bool unmanaged = false);
    virtual ~ConfigBool();

    bool Value() const { return this->value; }
    void SetValue(bool value);
    virtual bool HasDefaultValue();
};


class ConfigInt: public ConfigItem {
private:
    int defValue;
    int value;

protected:
    friend class ConfigContext;
    void SetWriteValue(const char * value);
    virtual void ReadValueFromDataset(class IDataSet * dataset) override;
    virtual bool ReadValueFromJSON(class json_io * json, dword base) override;
    virtual void WriteValueToJSON(class json_io * json, dword base, char * & convBuf) override;
    virtual int WriteValueToString(char * dest, size_t destSize) override;

public:
    ConfigInt(ConfigContext * context, const char * name, int defVal, bool unmanaged = false);
    virtual ~ConfigInt();

    int Value() const { return this->value; }
    void SetValue(int value);
    virtual bool HasDefaultValue();
};


class ConfigDword : public ConfigItem {
private:
    dword defValue;
    dword value;

protected:
    friend class ConfigContext;
    void SetWriteValue(const char * value);
    virtual void ReadValueFromDataset(class IDataSet * dataset) override;
    virtual bool ReadValueFromJSON(class json_io * json, dword base) override;
    virtual void WriteValueToJSON(class json_io * json, dword base, char * & convBuf) override;
    virtual int WriteValueToString(char * dest, size_t destSize) override;

public:
    ConfigDword(ConfigContext * context, const char * name, dword defVal, bool unmanaged = false);
    virtual ~ConfigDword();

    dword Value() const { return this->value; }
    void SetValue(dword value);
    virtual bool HasDefaultValue();
};


class ConfigLong64 : public ConfigItem {
private:
    long64 defValue;
    long64 value;

protected:
    friend class ConfigContext;
    void SetWriteValue(const char * value);
    virtual void ReadValueFromDataset(class IDataSet * dataset) override;
    virtual bool ReadValueFromJSON(class json_io * json, dword base) override;
    virtual void WriteValueToJSON(class json_io * json, dword base, char * & convBuf) override;
    virtual int WriteValueToString(char * dest, size_t destSize) override;

public:
    ConfigLong64(ConfigContext * context, const char * name, long64 defVal, bool unmanaged = false);
    virtual ~ConfigLong64();

    long64 Value() const { return this->value; }
    void SetValue(long64 value);
    virtual bool HasDefaultValue();
};


class ConfigUlong64 : public ConfigItem {
private:
    ulong64 defValue;
    ulong64 value;

protected:
    friend class ConfigContext;
    void SetWriteValue(const char * value);
    virtual void ReadValueFromDataset(class IDataSet * dataset) override;
    virtual bool ReadValueFromJSON(class json_io * json, dword base) override;
    virtual void WriteValueToJSON(class json_io * json, dword base, char * & convBuf) override;
    virtual int WriteValueToString(char * dest, size_t destSize) override;

public:
    ConfigUlong64(ConfigContext * context, const char * name, ulong64 defVal, bool unmanaged = false);
    virtual ~ConfigUlong64();

    ulong64 Value() const { return this->value; }
    void SetValue(ulong64 value);
    virtual bool HasDefaultValue();
};


class ConfigString : public ConfigItem {
private:
    char * defValue;
    char * value;

protected:
    friend class ConfigContext;
    void SetWriteValue(const char * value);
    virtual void ReadValueFromDataset(class IDataSet * dataset) override;
    virtual bool ReadValueFromJSON(class json_io * json, dword base) override;
    virtual void WriteValueToJSON(class json_io * json, dword base, char * & convBuf) override;
    virtual int WriteValueToString(char * dest, size_t destSize) override;

public:
    ConfigString(ConfigContext * context, const char * name, const char * defVal, bool unmanaged = false);
    virtual ~ConfigString();

    const char * Value() const { return this->value; }
    void SetValue(const char * value);
    virtual bool HasDefaultValue();
};
