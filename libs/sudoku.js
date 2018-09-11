
/**
 * 数独算法
 */

class Sudoku {

    constructor({
        display = false,
        sudokuMap = []
    }) {

        // 是否展示算法过程
        this.display = display;

        // 原始数独数组
        this.sudokuMap = sudokuMap;

        // 回溯数组
        this.stacks = [];

        // 是否已经解答完成
        this.resolved = false;


        this.dataMap = new Map();

        this.init();

        this.testRuleTimes = {
            ok: 0,
            fail: 0,
        };

        this.allTimes = 0; // 所有的循环次数统计

        this.currentOrder = 0 ;
    }

    /**
     * 初始化确定每个可填写的格子可以的填入的数值，做成一个MAP
     */
    init() {
        let exsitTimes = {};
        for(let i = 0 ; i < 9 ; i++ ) {
            for(let j = 0 ; j < 9; j ++) {
                this.allTimes++;
                let node = this.sudokuMap[i][j];
                if(node === 0) {
                    this.testMayFill(i, j);
                }else{
                    // 记录每个数字出现的次数
                    exsitTimes[node] ? exsitTimes[node]++ : exsitTimes[node]=1;
                }
            }
        }

        // 进行一次可填入数字的排序
        // 回溯的时候找下一个节点的时候从小到大进行搜索

        let data = [];
        for(let [key, value] of this.dataMap) {
            this.allTimes++;
            data.push({
                x: parseInt(key.split('-')[0]),
                y: parseInt(key.split('-')[1]),
                value: value,
                // value: value.sort((a, b) => {
                //     exsitTimes[a] - exsitTimes[b] > 0 ? 1:-1;
                // })
            })
        }
        //
        // data.sort(function(a , b) {
        //     return a.value.length > b.value.length ? 1 : -1;
        // })
        //
        // data.reverse();

        this.orders = data;

    }

    /**
     * 设置当前格子可能填入的值
     */
    testMayFill(x, y) {
        let mayFillNumber = new Set([1,2,3,4,5,6,7,8,9]);

        // 横向查找
        for (let i = 0; i < 9; i++) {
            this.allTimes++;
            // if (i === x) {
            //     continue;
            // }
            let node = this.sudokuMap[i][y];
            if (mayFillNumber.has(node)) {
                mayFillNumber.delete(node);
            }
        }

        // 纵向查找
        for (let i = 0; i < 9; i++) {
            this.allTimes++;
            // if (i === y) {
            //     continue;
            // }
            let node = this.sudokuMap[x][i];

            if (mayFillNumber.has(node)) {
                mayFillNumber.delete(node);
            }
        }

        // 3X3 方格查找
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.allTimes++;
                if (
                    i >= Math.floor(x / 3) * 3
                    && i < (Math.floor(x / 3) * 3 + 3)
                    && j >= Math.floor(y / 3) * 3
                    && j < (Math.floor(y / 3) * 3 + 3)
                ) {
                    let node = this.sudokuMap[i][j];
                    if (mayFillNumber.has(node)) {
                        mayFillNumber.delete(node);
                    }
                }
            }
        }

        this.dataMap.set(`${x}-${y}`, [...mayFillNumber]);
    }

    /**
     * 如果某一个方格填写的测试数据能够经过校验
     * 就寻找到一下个需要填写数的方格
     * 这个方格的不能已经填写过数字
     * 找到这个方格的坐标返回
     */
    getNextPoint() {
        let currentStack = this.stacks[this.stacks.length - 1];
        let ret = {
            x: -1,
            y: -1,
            value: 1,
        }

        this.currentOrder++;

        let nextValue = this.orders[this.currentOrder];
        if(!nextValue) {
            this.resolved = true;
            return ret;
            // break;
        }
        ret.x = nextValue.x;
        ret.y = nextValue.y;
        ret.value = nextValue.value[0];

        return ret;
    }

    /**
     * 获取初始节点
     * 初始节点为第一个不为0的方格
     * 0 0 坐标节点上面可能已经填写了数字
     */
    getFirstPoint() {
        let ret = {
            x: this.orders[0].x,
            y: this.orders[0].y,
            value: this.orders[0].value[0],
        }
        return ret;
    }

    /**
     * 程序入口
     * 开始执行
     */
    start() {
        let s = new Date();

        // 清空命令行
        let {
            resolved: resolved,
            stacks: stacks
        } = this;
        if(this.display) {
            process.stdout.cursorTo(0, 0);
            process.stdout.clearScreenDown();
        }

        while (resolved === false) {
        //setInterval(() => {


            // 如果记录填写数字的历史表为空，直接找第一个可以填写的方格填入
            if (stacks.length === 0) {
                stacks.push(this.getFirstPoint());
            }

            let cStack = stacks[stacks.length - 1];

            if (this.display) {
                process.stdout.cursorTo(0,0);
                console.log(this.sudokuMap);
                console.log('已经填入数量',stacks.length);
                console.log(`当前耗时${new Date()-s}ms`);
            }

            /**
             * 结束判断
             * 如果获取不到需要填写的方格
             * 说明已经全部填写完成
             */
            if (cStack.x === -1 && cStack.y === -1) {
                resolved = true;
                console.log(this.sudokuMap);
                console.log('已经填入数量',stacks.length);
                console.log(`当前耗时${new Date()-s}ms`);
                console.log(this.testRuleTimes);
                console.log('所有For循环次数',this.allTimes);
                return this;
            }

            let valid = this.testRules(cStack);

            if (valid) {
                /**
                 * 填写的数字满足校验
                 * 先设置数独数组的值为当前测试的值
                 * 然后寻找下一个方格
                 */
                this.sudokuMap[cStack.x][cStack.y] = cStack.value;
                stacks.push(this.getNextPoint());


            } else {
                /**
                 * 如果校验不通过
                 * 将当前方格的测试数据清空
                 *
                 * 在当前格子进行测试别的值
                 * 从1到9依次测试
                 * 如果全部失败
                 * 回溯到上一级
                 *
                 */
                //this.sudokuMap[cStack.x][cStack.y] = 0;
                // console.log(stacks);

                this.rollback();

            }
        // }, 1000)
        };
    }

    /**
     * 回退
     * 取出数组最后一次填入的数据
     * 1、如果当前位置是起始位置
     * 并且值小于9
     * 直接给这个值+1，并且推进堆栈数组中
     * 2、如果不是起始位置
     *  2.1 判定数值是否小于9，如果小于9直接进行+1并且推入堆栈进行计算
     *  2.2 如果已经是9了，等于说这个格子填写任何数都不合适，所以需要继续回溯到上一个步骤
     */
    rollback() {

        let {
            stacks, dataMap
        } = this;

        let currentStack = stacks.pop();


        this.sudokuMap[currentStack.x][currentStack.y] = 0;

        let cOrder = this.orders[this.currentOrder];

        if(currentStack.value === cOrder.value[cOrder.value.length-1]) {
            this.currentOrder--;
            this.rollback()
        }else{
            let orderIndex = cOrder.value.indexOf(currentStack.value);
            currentStack.value = cOrder.value[orderIndex+1];
            stacks.push(currentStack);
        }
    }

    /**
     * 判断填入的数值是否满足数独规则
     * 1、横向扫描，当前填入的数字是否有重复
     * 2、纵向扫描，当前填入的数字是否有重复
     * 3、扫描当前格子所在的3X3的小格子中是否有重复数字
     */
    testRules(stack) {
        let {
            x: x,
            y: y,
            value: val
        } = stack;
        let ret = true;

        let found = false;

        for (let i = 0; i < 9; i++) {
            if (found) {
                break;
                return;
            }

            let node = this.sudokuMap[i][y];
            if (node === val) {
                ret = false;
                break;
                return;
            }

            for (let j = 0; j < 9; j++) {
                this.allTimes++;
                let node = this.sudokuMap[x][j];
                if (node === val) {
                    ret = false;
                    found = true;
                    break;
                    return;
                }

                if (
                    i >= Math.floor(x / 3) * 3
                    && i < (Math.floor(x / 3) * 3 + 3)
                    && j >= Math.floor(y / 3) * 3
                    && j < (Math.floor(y / 3) * 3 + 3)
                ) {
                    let node = this.sudokuMap[i][j];
                    if (node === val) {
                        found = true;
                        ret = false;
                        break;
                    }
                }
            }
        }
        if(ret) {
            this.testRuleTimes.ok++;
        }else{
            this.testRuleTimes.fail++;
        }

        return ret;
    }

}

module.exports = Sudoku;
