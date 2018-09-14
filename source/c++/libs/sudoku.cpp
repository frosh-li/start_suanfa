//
// Created by flavor on 2018/9/12.
//
#include <iostream>
#include <MacTypes.h>
#include "sudoku.h"

using namespace std;

SudoKu::SudoKu(bool display, const int map[9][9]):
    isDisplay(display),
    sudokuMap(),
    isResolved(false),
    dataMap(),
    testRuleTimesOk(0),
    testRuleTimesFail(0),
    allTimes(0),
    currentOrder(0)
{
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            sudokuMap[i][j] = map[i][j];
        }
    }

    init();
}

SudoKu::~SudoKu() {
}

void SudoKu::init() {
    int exsitTimes[] = {0,0,0, 0,0,0, 0,0,0};
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            allTimes++;
            int node = sudokuMap[i][j];
            if (node == 0) {
                testMayFill(i, j);
            } else {
                // 记录每个数字出现的次数
                0 == exsitTimes[node - 1] ? exsitTimes[node - 1] ++ : exsitTimes[node - 1] = 1;
            }
        }
    }

    // 进行一次可填入数字的排序
    // 回溯的时候找下一个节点的时候从小到大进行搜索

}

void SudoKu::testMayFill(int x, int y) {
    int mayFillNumber[] = {0, 0, 0,  0, 0, 0,  0, 0, 0};
    // 横向查找
    for (int i = 0; i < 9; i++) {
        allTimes++;
        int node = sudokuMap[i][y];
        if (node > 0) {
            mayFillNumber[node - 1] = 1;
        }
    }

    // 纵向查找
    for (int i = 0; i < 9; i++) {
        allTimes++;
        int node = sudokuMap[x][i];
        if (node > 0) {
            mayFillNumber[node - 1] = 1;
        }
    }

    // 3X3 方格查找
    int i = x / 3;
    int j = y / 3;

    for (int px = 0; px < 3; px ++) {
        int xx = px + i * 3;
        for (int py = 0; py < 3; py ++) {
            int node = sudokuMap[xx][py + j * 3];
            if (node > 0) {
                mayFillNumber[node - 1] = 1;
            }
        }
    }

    queue<int> * ptrFillNumber = new queue<int>();
    for (int i = 0; i < sizeof(mayFillNumber); i++) {
        if (mayFillNumber[i] == 0) {
            ptrFillNumber->push(i + 1);
        }
    }

    SuDokuPoint point;
    point.x = x;
    point.y = y;

    if (!ptrFillNumber->empty()) {
        dataMap[point] = ptrFillNumber;
    }
}

void SudoKu::start() {
}

SuDokuPointValue SudoKu::getFirstPointValue() {
    return SuDokuPointValue();
}

SuDokuPointValue SudoKu::getNextPointValue() {
    return SuDokuPointValue();
}

bool SudoKu::testRules(const SuDokuPointValue & stack) {
    return false;
}

void SudoKu::rollBack() {
}