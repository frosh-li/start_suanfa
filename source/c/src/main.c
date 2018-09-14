//
// Created by flavor on 2018/9/14.
//

#include <stdio.h>
#include <stdlib.h>
#include "libs/sudoku.h"

int dataMap[9][9] = {
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

int ** mayFillNumberMap = NULL;

int main() {
    int * fillNumberArray = NULL;

    for (int x = 0; x < 9; x++) {
        for (int y = 0; y < 9; y++) {
            printf("x = %d, y = %d, node = %d\n", x, y, dataMap[x][y]);
            fillNumberArray = mayFillNumber(x, y, dataMap);
        }
    }
    return 0;
}