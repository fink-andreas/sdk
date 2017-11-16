/*---------------------------------------------------------------------------*/
/* compression.h                                                             */
/* copyright (c) innovaphone 2016                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

enum CompressionType {
    SAME_COLOR = 0,
    PNG = 1,
    JPEG
};

enum BlockType {
    BLOCK_MSG = 0,
    PLAIN_MSG,
    EQUAL_MSG
};

class CompressedBlock {

public:
    CompressedBlock() {
        this->buf = NULL;
        this->len = 0;
    };
    ~CompressedBlock() { if(this->buf) free(this->buf); };

public:
    int coorX;
    int coorY;
    int dimX;
    int dimY;
    int picW;
    int picH;
    enum CompressionType compressionType;
    enum BlockType blockType;
    int numEqBlocks;
    unsigned char *buf;
    int len;
};