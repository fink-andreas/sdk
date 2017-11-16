/*---------------------------------------------------------------------------*/
/* socket.h                                                                  */
/* copyright (c) innovaphone 2015                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

typedef enum {
    SOCKET_SHUTDOWN_NORMAL,
    SOCKET_SHUTDOWN_BY_PEER,
    SOCKET_LOST,
    SOCKET_ADDRESS_INVALID,
    SOCKET_OPEN_FAILED,
    SOCKET_CONNECT_FAILED,
    SOCKET_CONNECT_REJECTED,
    SOCKET_BIND_FAILED,
    SOCKET_LISTEN_FAILED,
    SOCKET_ACCEPT_FAILED,
    SOCKET_TLS_HANDSHAKE_FAILED
} shutdownreason_t;


class ISocket {
public:
    virtual ~ISocket() {};
    virtual void Connect(const char * address) = 0;
    virtual void Bind(const char * localAddr = NULL, word localPort = 0) = 0;
    virtual void Listen() = 0;
    virtual void Accept(class USocket * remoteUser) = 0;
    virtual void Shutdown() = 0;
    virtual void Send(const void * buf, size_t len) = 0;
    virtual void SendTo(const void * buf, size_t len, struct sockaddr_storage * dstAddr) {};
    virtual void Recv(void * buf, size_t len, bool recvPartial = false) = 0;
};


class USocket {
public:
    virtual void SocketConnectComplete(ISocket * const socket) {};
    virtual void SocketBindResult(ISocket * const socket, const char * localAddr, word localPort) {};
    virtual void SocketListenResult(ISocket * const socket, const char * remoteAddr, word remotePort) {};
    virtual void SocketAcceptComplete(ISocket * const socket) {};
    virtual void SocketShutdown(ISocket * const socket, shutdownreason_t reason) = 0;
    virtual void SocketSendResult(ISocket * const socket) {};
    virtual void SocketRecvResult(ISocket * const socket, void * buf, size_t len) {};
    virtual void SocketRecvFromResult(ISocket * const socket, void * buf, size_t len, struct sockaddr_storage * dstAddr) {};
};

class ISocketContext {
public:
    virtual ~ISocketContext() {};
    virtual void EnableDTLS(bool useSrtp) = 0;
    virtual void SetServerCertificate(const byte * cert, size_t certLen, const char * hostName = NULL) = 0;
    virtual void SetClientCertificate(const byte * cert, size_t certLen, const char * hostName = NULL) = 0;
};

class ISocketProvider {
public:
    virtual ~ISocketProvider() {};
    virtual ISocketContext * CreateSocketContext(class IInstanceLog * const log) = 0;
    virtual ISocket * CreateSocket(class IIoMux * const iomux, USocket * const user, class IInstanceLog * const log, bool useIPv6, class ISocketContext * socketContext = NULL) = 0;
};

extern "C" ISocketProvider * CreateUDPSocketProvider();
extern "C" ISocketProvider * CreateTCPSocketProvider();
extern "C" ISocketProvider * CreateTLSSocketProvider();
extern "C" ISocketProvider * CreateLocalSocketProvider();

