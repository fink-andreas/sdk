
/*---------------------------------------------------------------------------*/
/* sdksample.cpp                                                             */
/* copyright (c) innovaphone 2016                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

#include "platform/platform.h"
#include "common/os/iomux.h"
#include "common/interface/webserver_plugin.h"
#include "common/interface/database.h"
#include "common/interface/httpfile.h"
#include "common/interface/socket.h"
#include "common/interface/json_api.h"
#include "common/lib/appservice.h"
#include "common/lib/appwebsocket.h"
#include "sdksample/sdksample.h"

int main(int argc, char *argv[])
{
    class IIoMux * iomux = IIoMux::Create();
	ISocketProvider * localSocketProvider = CreateLocalSocketProvider();
    IWebserverPluginProvider * webserverPluginProvider = CreateWebserverPluginProvider();
    IDatabaseProvider * databaseProvider = CreatePostgreSQLDatabaseProvider();

    AppServiceArgs  serviceArgs;
    serviceArgs.serviceID = "sdksample";
    serviceArgs.Parse(argc, argv);
    AppInstanceArgs instanceArgs;
    instanceArgs.appName = "sdksample";
    instanceArgs.appDomain = "example.com";
    instanceArgs.appPassword = "pwd";
    instanceArgs.webserver = "/var/run/admin/webserver";
    instanceArgs.webserverPath = "/sdksample";
    instanceArgs.dbHost = "";
    instanceArgs.dbName = "sdksample";
    instanceArgs.dbUser = "sdksample";
    instanceArgs.dbPassword = "pwd";
    instanceArgs.Parse(argc, argv);
	
    SDKSampleService * service = new SDKSampleService(iomux, localSocketProvider, webserverPluginProvider, databaseProvider, &serviceArgs);
    if (!serviceArgs.taskmanager) service->AppStart(&instanceArgs);
    iomux->Run();

    delete service;
	delete localSocketProvider;
    delete webserverPluginProvider;
    delete databaseProvider;
    delete iomux;
    delete debug;
    
    return 0;
}
