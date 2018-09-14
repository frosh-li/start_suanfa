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
struct point dataCountQueue[81] = {{0,0,0}};

int main() {
    int count;
    int queueLength = 0;
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
        }
    }

    return 0;
}