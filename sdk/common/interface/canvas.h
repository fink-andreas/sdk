/*---------------------------------------------------------------------------*/
/* canvas.h                                                                  */
/* copyright (c) innovaphone 2017                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

enum MouseType {
    Arrow = 0,
    Hand,
    Wait,
    AppStarting,
    Ibeam,
    Cross,
    Help,
    No,
    SizeAll,
    SizeWs,
    SizeNwse,
    SizeWe,
    UpArrow
};

class ICanvas {
public:
    static ICanvas * CreateCanvas();
    virtual ~ICanvas() {};

    virtual void PutBlock(unsigned int userId, unsigned int appId, class CompressedBlock * block) = 0;
    virtual void DrawMouse(unsigned int userId, unsigned int appId, enum MouseType mouse, int coorX, int coorY) = 0;

    virtual void Add(unsigned int userId, char * userName, unsigned int appId, char * appName, char * appDesc) = 0;
    virtual void Update(unsigned int userId, char * userName, unsigned int appId, char * appName, char * appDesc) = 0;
    virtual void Remove(unsigned int userId, unsigned int appId) = 0;
};