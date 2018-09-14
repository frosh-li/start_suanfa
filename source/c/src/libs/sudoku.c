//
// Created by flavor on 2018/9/14.
//
#include "sudoku.h"

int* mayFillNumber(int x, int y, int data[][9]) {
    int row, col, r;
    int node = data[x][y];
    if (0 == node) {
        int testNumber[9] = {0};
        // 横向和纵向搜索，排除掉已有的数字
        for (int i = 0; i < 9; i++) {
            if (i != x) {
                row = data[i][y];
                if (row > 0) {
                    testNumber[row - 1] = 1;
                }
            }

            if (i != y) {
                col = data[x][i];
                if (col > 0) {
                    testNumber[row - 1] = 1;
                }
            }
        }

        // 3X3 搜索，排除掉已有的数字
        row = x / 3 * 3;
        col = y / 3 * 3;
        for (int i = 0; i < 3; i++) {
            r = i + row;
            for (int j = 0; j < 3; j++) {
                if (!((r == x) && (y == col + j))) {
                    node = data[r][col + j];
                    if (node > 0) {
                        testNumber[node - 1] = 1;
                    }
                }

            }
        }

        // 该位置可填写的数字
        for (int i = 0; i < 9; i++) {
            if (testNumber[i] == 1) {
                printf("x = %d, y = %d, v = %d\n", x, y, i + 1);
            }
        }
    }


    return NULL;
}