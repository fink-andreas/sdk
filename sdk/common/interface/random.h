/*---------------------------------------------------------------------------*/
/* random.h                                                                  */
/* copyright (c) innovaphone 2015                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

class IRandom {
public:
    static void Init(dword seed);
    static dword GetRandom();
};
