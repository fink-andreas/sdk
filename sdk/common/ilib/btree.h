/*---------------------------------------------------------------------------*/
/* btree.h                                                                   */
/* copyright (c) innovaphone 2001                                            */
/*                                                                           */
/*---------------------------------------------------------------------------*/

#ifndef _BTREE_H_
#define _BTREE_H_

NAMESPACE_BEGIN

class btree {
    int count;

    virtual int btree_compare(void * key) = 0;
    virtual int btree_compare(class btree * b) = 0;
    virtual void leak_check() {};

    class btree * rotate_left();
    class btree * rotate_right();

protected:
    class btree * left;
    class btree * right;

public:
    btree();
    virtual ~btree() {};
    class btree * btree_find(const void * key);
    class btree * btree_find_first_left(const void * key);
    class btree * btree_find_first_right(const void * key);
    class btree * btree_find_next_left(const void * key);
    class btree * btree_find_next_right(const void * key);
    class btree * btree_find_left();
    class btree * btree_find_right();
    class btree * btree_put(class btree * in);
    class btree * btree_put(class btree * in, bool & before, class btree * & p);
    class btree * btree_get(class btree * out);
    int get_count() { return count; };
    void print_tree(int level);
    void tree_leak_check();
};

NAMESPACE_END

#endif
