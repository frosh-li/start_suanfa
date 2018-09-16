//
// Created by flavor on 2018/9/14.
//

#include <stdio.h>
#include <stdlib.h>
#include "libs/sudoku.h"

/**
 * 原始待解题数组
 */
static int dataMap[9][9] = {
        {0, 0, 5, 3, 0, 0, 0, 0, 0},
        {8, 0, 0, 0, 0, 0, 0, 2, 0},
        {0, 7, 0, 0, 1, 0, 5, 0, 0},
        {4, 0, 0, 0, 0, 5, 3, 0, 0},
        {0, 1, 0, 0, 7, 0, 0, 0, 6},
        {0, 0, 3, 2, 0, 0, 0, 8, 0},
        {0, 6, 0, 5, 0, 0, 0, 0, 9},
        {0, 0, 4, 0, 0, 0, 0, 3, 0},
        {0, 0, 0, 0, 0, 9, 7, 0, 0},
};

/***
 * 每个位置可填写数字个数
 */
static int mayFillCountMap[9][9] = {0};
/***
 * 每个位置可填写数字
 */
static int mayFillNumberMap[9][9][9] = {0};
/**
 * 可填写位置队列
 */
static struct point dataCountQueue[81] = {{0, 0, 0, 0}};

/**
 * 每行的和
 */
static int sumRow[9] = {0};

/**
 * 每列的和
 */
static int sumColumn[9] = {0};

/**
 * 每个正方形矩阵的和
 */
static int sumSquare[9] = {0};

int main() {
    int count, node;
    int queueLength = 0;

    // 遍历初始待解题数组,找出每个空可填写的数字,
    for (int x = 0; x < 9; x++) {
        for (int y = 0; y < 9; y++) {
            count = may_fill_number(x, y, dataMap, mayFillNumberMap[x][y]);
            mayFillCountMap[x][y] = count;
            if (count > 0) {
                dataCountQueue[queueLength].x = x;
                dataCountQueue[queueLength].y = y;
                dataCountQueue[queueLength].count = count;
                queueLength++;
            }

            node = dataMap[x][y];
            sumRow[x] += node;
            sumColumn[y] += node;
            sumSquare[square_index(x, y)] += node;
        }
    }

    // 解题
    struct point *ptrPoint = NULL;
    int * fillNumber = NULL;
    int index = 0;
    int x,y;
    for (;;) {
        ptrPoint = &dataCountQueue[index];
        x = ptrPoint->x;
        y = ptrPoint->y;
        fillNumber = mayFillNumberMap[x][y];

        int isSuccess = -1;
        for (int j = ptrPoint->index; j < ptrPoint->count; j++) {
            if (0 == test_number(x, y, fillNumber[j], dataMap, sumRow, sumColumn, sumSquare)) {
                fill_number(x, y, fillNumber[j], dataMap, sumRow, sumColumn, sumSquare);
                isSuccess = 0;
            }
        }

        if (0 != isSuccess) {
        } else {
            index++;
        }

        if (index >= queueLength) {
            break;
        }
    }

    return 0;
}