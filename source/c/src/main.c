//
// Created by flavor on 2018/9/14.
//

#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <sys/time.h>
#include "libs/sudoku.h"

/**
 * 原始待解题数组
 */
//static int dataMap[9][9] = {
//        {0, 0, 5, 3, 0, 0, 0, 0, 0},
//        {8, 0, 0, 0, 0, 0, 0, 2, 0},
//        {0, 7, 0, 0, 1, 0, 5, 0, 0},
//        {4, 0, 0, 0, 0, 5, 3, 0, 0},
//        {0, 1, 0, 0, 7, 0, 0, 0, 6},
//        {0, 0, 3, 2, 0, 0, 0, 8, 0},
//        {0, 6, 0, 5, 0, 0, 0, 0, 9},
//        {0, 0, 4, 0, 0, 0, 0, 3, 0},
//        {0, 0, 0, 0, 0, 9, 7, 0, 0},
//};

static int dataMap[9][9] = {
        {8, 0, 0, 0, 0, 0, 0, 0, 0},
        {0, 0, 3, 6, 0, 0, 0, 0, 0},
        {0, 7, 0, 0, 9, 0, 2, 0, 0},
        {0, 5, 0, 0, 0, 7, 0, 0, 0},
        {0, 0, 0, 0, 4, 5, 7, 0, 0},
        {0, 0, 0, 1, 0, 0, 0, 3, 0},
        {0, 0, 1, 0, 0, 0, 0, 6, 8},
        {0, 0, 8, 5, 0, 0, 0, 1, 0},
        {0, 9, 0, 0, 0, 0, 4, 0, 0},
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

static struct timeval startTime, endTime;
/**
 * 迭代次数
 */
static int times = 0;

int main() {
    int queueLength = 0;
    gettimeofday(&startTime, NULL);
    // 遍历初始待解题数组,找出每个空可填写的数字,
    for (int x = 0; x < 9; x++) {
        for (int y = 0; y < 9; y++) {
            int count = may_fill_number(x, y, dataMap, mayFillNumberMap[x][y]);
            mayFillCountMap[x][y] = count;
            if (count > 0) {
                dataCountQueue[queueLength].x = x;
                dataCountQueue[queueLength].y = y;
                dataCountQueue[queueLength].count = count;
                queueLength++;
            }

            int node = dataMap[x][y];
            sumRow[x] += node;
            sumColumn[y] += node;
            sumSquare[square_index(x, y)] += node;
        }
    }

    // 解题
    int index = 0;
    int isResolved = -1;
    for (;;) {
        struct point * ptrPoint = &dataCountQueue[index];
        int x = ptrPoint->x;
        int y = ptrPoint->y;
        int * fillNumber = mayFillNumberMap[x][y];

        int isSuccess = -1;
        for (; ptrPoint->index < ptrPoint->count; ptrPoint->index++) {
            times++;
            // 成功填入则将指针指向下一个
            if (0 == test_number(x, y, fillNumber[ptrPoint->index], dataMap, sumRow, sumColumn, sumSquare)) {
                fill_number(x, y, fillNumber[ptrPoint->index], dataMap, sumRow, sumColumn, sumSquare);
                isSuccess = 0;
                ptrPoint->index++;
                break;
            }
        }

        if (0 != isSuccess) {
            ptrPoint->index = 0;
            index--;
            ptrPoint = &dataCountQueue[index];
            x = ptrPoint->x;
            y = ptrPoint->y;
            fillNumber = mayFillNumberMap[x][y];
            roll_back(x, y, fillNumber[ptrPoint->index - 1], dataMap, sumRow, sumColumn, sumSquare);
        } else {
            index++;
        }

        if (index >= queueLength) {
            isResolved = 0;
            break;
        }

        if (index < 0) {
            break;
        }
    }

    gettimeofday(&endTime, NULL);
    long time = (endTime.tv_sec * 1000000  + endTime.tv_usec) - (startTime.tv_sec * 1000000 + startTime.tv_usec);
    if (0 == isResolved) {
        printf("已解题:\n");
        printf("迭代次数:%d\n", times);
        printf("共耗时: %f s\n",  time * 1.0 / 1000000);
        for (int x = 0; x < 9; x++) {
            for (int y = 0; y < 9; y++) {
                printf("%d ", dataMap[x][y]);
            }
            printf("\n");
        }
    } else {
        printf("该题无解.\n");
        printf("迭代次数:%d\n", times);
        printf("共耗时: %f s\n",  time * 1.0 / 1000000);
    }

    return 0;
}