//
// Created by flavor on 2018/9/12.
//

#ifndef START_SUANFA_SUDOKU_H
#define START_SUANFA_SUDOKU_H

#include <iostream>
#include <map>
#include <queue>
#include <string>

struct SuDokuPoint {
    int x;
    int y;
};

struct SuDokuPointValue {
    int x;
    int y;
    int value;
};

class SudoKu {
    public:
        SudoKu(bool display, const int map[9][9]);
        ~SudoKu();
        void start();
    private:
        void init();
        void testMayFill(int x, int y);
        SuDokuPointValue getNextPointValue();
        SuDokuPointValue getFirstPointValue();
        void rollBack();
        bool testRules(const SuDokuPointValue & stack);
    private:
        bool isDisplay;
        int sudokuMap[9][9];
        bool isResolved;
        std::map<SuDokuPoint, std::queue<int> *> dataMap;
        int testRuleTimesOk;
        int testRuleTimesFail;
        int allTimes;
        int currentOrder;

};

#endif //START_SUANFA_SUDOKU_H
