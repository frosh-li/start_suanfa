//
// Created by flavor on 2018/9/14.
//

#ifndef SUDOKU_SUDOKU_H
#define SUDOKU_SUDOKU_H

#include <stdlib.h>
#include <stdio.h>

struct point {
    int x;
    int y;
    int count;
};

/**
 * 计算该位置可填写的数字
 *
 * @param x
 * @param y
 * @param data
 * @param out
 * @return 可填写的数字的数量
 */
int may_fill_number(int x, int y, int data[][9], int * out);

/**
 * 检测该位置填写的数字是否可行
 *
 * @param x
 * @param y
 * @param number
 * @param data
 * @return 0-成功;1-失败
 */
int test_number(int x, int y, int number, int data[][9]);

#endif //SUDOKU_SUDOKU_H
