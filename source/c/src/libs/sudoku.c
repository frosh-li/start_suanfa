//
// Created by flavor on 2018/9/14.
//
#include "sudoku.h"

int square_index(int x, int y) {
    return x / 3 * 3 + y / 3;
}

int may_fill_number(int x, int y, const int data[][9], int * out) {
    int node = data[x][y];
    if (0 == node) {
        int row, col, r;
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
                    testNumber[col - 1] = 1;
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
        int result = 0;
        for (int i = 0; i < 9; i++) {
            if (testNumber[i] == 0) {
                out[result] = i + 1;
                result++;
            }
        }

        return result;
    }


    return 0;
}

int test_number(int x, int y, int number, const int data[][9], const int * sumRow, const int * sumColumn, const int * sumSquare) {
    if (sumRow[x] + number > SUM_MAX) {
        return 1;
    }

    if (sumColumn[y] + number > SUM_MAX) {
        return 1;
    }

    if (sumSquare[x / 3 * 3 + y / 3] + number > SUM_MAX) {
        return 1;
    }

    for (int i = 0; i < 9; i++) {
        if (i != x) {
            if (data[i][y] == number) {
                return 1;
            }
        }

        if (i != y) {
            if (data[x][i] == number) {
                return 1;
            }
        }
    }

    // 3X3 搜索，排除掉已有的数字
    int row = x / 3 * 3;
    int col = y / 3 * 3;
    int r;
    for (int i = 0; i < 3; i++) {
        r = i + row;
        for (int j = 0; j < 3; j++) {
            if (!((r == x) && (y == col + j))) {
                if (data[r][col + j] == number) {
                    return 1;
                }
            }
        }
    }

    return 0;
}

void fill_number(int x, int y, int number, int data[][9], int * sumRow, int * sumColumn, int * sumSquare) {
    data[x][y] = number;
    sumRow[x] += number;
    sumColumn[y] += number;
    sumSquare[square_index(x, y)] += number;
}

void roll_back(int x, int y, int number, int data[][9], int * sumRow, int * sumColumn, int * sumSquare) {
    data[x][y] = 0;
    sumRow[x] -= number;
    sumColumn[y] -= number;
    sumSquare[square_index(x, y)] -= number;
}
