
typedef std::deque<class UDatabase *> UserQueue;

class DatabaseSwitch : public IDatabase, public UDatabase {
    UserQueue users;

    // Udatabase definitions
    void DatabaseConnectComplete(IDatabase * const database) override;
    void DatabaseError(IDatabase * const database, db_error_t error) override;
    void DatabaseShutdown(IDatabase * const database, db_error_t error) override;
    void DatabaseExecSQLResult(IDatabase * const database, class IDataSet * dataset) override;
    void DatabaseInsertSQLResult(IDatabase * const database, ulong64 id) override;
    void DatabaseBeginTransactionResult(IDatabase * const database) override;
    void DatabaseEndTransactionResult(IDatabase * const database) override;
    void DatabasePrepareStatementResult(IDatabase * const database, class IPreparedStatement * statement) override;

protected:
    class IDatabase * database;

public:
    DatabaseSwitch(class IDatabase * database);
    virtual ~DatabaseSwitch();
    IDatabase * GetDatabase();

    // IDatabase definitions
    void Connect(const char * address, const char * dbname, const char * user, const char * password);
    bool Connected();
    void Shutdown();
    size_t QueryPrint(char * buffer, size_t bufferSize, const char * sqlcmd, ...);
    size_t QueryPrintV(char * buffer, size_t bufferSize, const char * sqlcmd, va_list argList);
    void ExecSQL(UDatabase * const user, dword flags, const char * sqlcmd, ...);
    void ExecSQLV(UDatabase * const user, dword flags, const char * sqlcmd, va_list argList);
    void InsertSQL(UDatabase * const user, const char * sqlcmd, ...);
    void InsertSQLV(UDatabase * const user, const char * sqlcmd, va_list argList);
    void BeginTransaction(UDatabase * const user, const char * lockTableCmd = NULL);
    void EndTransaction(UDatabase * const user, bool doRollback = false);
    void PrepareStatement(UDatabase * user, const char * sqlcmd);
    void ExecSQL(UDatabase * const user, dword flags, class IPreparedStatement * const statement);
    void InsertSQL(UDatabase * const user, class IPreparedStatement * const statement);
    const char * GetLastErrorMessage();
};