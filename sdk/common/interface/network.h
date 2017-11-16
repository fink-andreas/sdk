/*---------------------------------------------------------------------------*/
/* network.h                                                                 */
/* copyright (c) innovaphone 2017                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

class LocalAddr : public istd::listElement<LocalAddr> {
public:
    bool iPv6;
    char * addr;
    LocalAddr(char * addr, bool iPv6) { 
        this->addr = addr; 
        this->iPv6 = iPv6; 
    };
    ~LocalAddr() { if(addr) free(addr); };
};

class LocalAddresses {
    public:
        istd::list <class LocalAddr> localAddresses;

        ~LocalAddresses() {
            while(this->localAddresses.front()) {
                delete this->localAddresses.front();
            }
       }
};

class INetwork {
public:
    static LocalAddresses * GetLocalAddresses();
};