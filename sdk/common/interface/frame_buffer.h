/*---------------------------------------------------------------------------*/
/* frame_buffer.h                                                            */
/* copyright (c) innovaphone 2016                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

class UFrameBuffer {
public:
    virtual void Add(unsigned int id, const char * name, const char * description) {};
    virtual void Update(unsigned int id, const char * name, const char * description) {};
    virtual void Remove(unsigned int id) {};
};


class IFrameBuffer {
public:
    static IFrameBuffer * CreateFrameBuffer(UFrameBuffer * const user);

    virtual ~IFrameBuffer() {};
    virtual void Capture(unsigned int appId) = 0;  // MakeCapture, CreateDiffBlocks and CompressDiffBlocks

    virtual class CompressedBlock * GetNextBlock(unsigned int appId, bool retransmissions) = 0;
    virtual void Mark(unsigned int appId, int coorX, int coorY, int dimX, int dimY) = 0;
    virtual void Clean(unsigned int appId) = 0;

    virtual void SubscribeApplications(void) = 0;
    virtual void UnsubscribeApplications(void) = 0;
};
