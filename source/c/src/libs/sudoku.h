//
// Created by flavor on 2018/9/14.
//

#ifndef SUDOKU_SUDOKU_H
#define SUDOKU_SUDOKU_H

#include <stdlib.h>
#include <stdio.h>

/**
 * 每行/每列/每个正方形的和不能超过45
 */
#define SUM_MAX 45

/**
 * 正方形矩阵的下标
 * @param x
 * @param y
 * @return
 */
int square_index(int x, int y);

/**
 * 每个位置可填写数量结构体
 */
struct point {
    int x;
    int y;
    int index;
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
int may_fill_number(int x, int y, const int data[][9], int * out);

/**
 * 检测该位置填写的数字是否可行
 *
 * @param x
 * @param y
 * @param number
 * @param data
 * @return 0-成功;1-失败
 */
int test_number(int x, int y, int number, const int data[][9], const int * sumRow, const int * sumColumn, const int * sumSquare);

/**
 * 在指定位置填写数字
 * @param x
 * @param y
 * @param number
 * @param data
 * @param sumRow
 * @param sumColumn
 * @param sumSquare
 */
void fill_number(int x, int y, int number, int data[][9], int * sumRow, int * sumColumn, int * sumSquare);

/**
 * 在尝试填写进行不下去时回退到上一步
 * @param x
 * @param y
 * @param number
 * @param data
 * @param sumRow
 * @param sumColumn
 * @param sumSquare
 */
void roll_back(int x, int y, int number, int data[][9], int * sumRow, int * sumColumn, int * sumSquare);
#endif //SUDOKU_SUDOKU_H
