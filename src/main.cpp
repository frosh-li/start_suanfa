//
// Created by flavor on 2018/9/12.
//
#include <iostream>
#include "libs/sudoku.h"

using namespace std;

int main() {
    int hardMap[9][9] = {
            {0 , 0 ,5 , 3 ,0, 0 , 0 , 0 , 0},
            {8 , 0 ,0 , 0 ,0, 0 , 0 , 2 , 0},
            {0 , 7 ,0 , 0 ,1, 0 , 5 , 0 , 0},
            {4 , 0 ,0 , 0 ,0, 5 , 3 , 0 , 0},
            {0 , 1 ,0 , 0 ,7, 0 , 0 , 0 , 6},
            {0 , 0 ,3 , 2 ,0, 0 , 0 , 8 , 0},
            {0 , 6 ,0 , 5 ,0, 0 , 0 , 0 , 9},
            {0 , 0 ,4 , 0 ,0, 0 , 0 , 3 , 0},
            {0 , 0 ,0 , 0 ,0, 9 , 7 , 0 , 0},
    };

    SudoKu sudoKu(false, hardMap);
    sudoKu.start();
    return 0;
}