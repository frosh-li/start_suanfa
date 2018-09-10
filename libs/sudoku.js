
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

        this.updateOrders();

    }

    /**
     * 初始化确定每个可填写的格子可以的填入的数值，做成一个MAP
     */
    updateOrders() {
        this.dataMap.clear();
        let exsitTimes = {};
        for(let i = 0 ; i < 9 ; i++ ) {
            for(let j = 0 ; j < 9; j ++) {
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
            data.push({
                x: parseInt(key.split('-')[0]),
                y: parseInt(key.split('-')[1]),
                value: value.sort((a, b) => {
                    exsitTimes[a] - exsitTimes[b] >= 0 ? -1:1;
                })
            })
        }
        // //
        // data.sort(function(a , b) {
        //     return a.value.length >= b.value.length ? 1 : -1;
        // })

        this.orders = data;

        console.log(this.orders);
        // process.exit();

    }

    /**
     * 设置当前格子可能填入的值
     */
    testMayFill(x, y) {
        let mayFillNumber = new Set([1,2,3,4,5,6,7,8,9]);

        // 横向查找
        for (let i = 0; i < 9; i++) {
            if (i === x) {
                continue;
            }
            let node = this.sudokuMap[i][y];
            if (mayFillNumber.has(node)) {
                mayFillNumber.delete(node);
            }
        }

        // 纵向查找
        for (let i = 0; i < 9; i++) {
            if (i === y) {
                continue;
            }
            let node = this.sudokuMap[x][i];

            if (mayFillNumber.has(node)) {
                mayFillNumber.delete(node);
            }
        }

        // 3X3 方格查找
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
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
        let stacksLen = this.stacks.length;
        let ret = {
            x: -1,
            y: -1,
            value: 1,
        }

        let nextValue = this.orders[stacksLen+1];

        if(!nextValue) {
            this.resolved = true;
            return ret;
            // break;
        }

        ret = {
            x: nextValue.x,
            y: nextValue.y,
            value: nextValue.value[0],
        }

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
        console.time('calc:time');

        let {
            resolved: resolved,
            stacks: stacks
        } = this;
        if(this.display) {
            // 清空命令行
            process.stdout.cursorTo(0, 0);
            process.stdout.clearScreenDown();
        }

        while (resolved === false) {
            // 如果记录填写数字的历史表为空，直接找第一个可以填写的方格填入
            if (stacks.length === 0) {
                console.log('stacks is zero');
                stacks.push(this.getFirstPoint());
            }

            let cStack = stacks[stacks.length - 1];

            if (this.display) {
                process.stdout.cursorTo(0,0);
                console.timeEnd('calc:time');
                console.log(this.sudokuMap);
            }

            /**
             * 结束判断
             * 如果获取不到需要填写的方格
             * 说明已经全部填写完成
             */
            if (cStack.x === -1 && cStack.y === -1) {
                resolved = true;
                // console.log(this.sudokuMap);
                console.timeEnd('calc:time');
                let cStack = stacks[stacks.length - 2];
                this.sudokuMap[cStack.x][cStack.y] = cStack.value;
                console.log(this.sudokuMap);
                process.exit();
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
        // this.updateOrders();
        let cnode = dataMap.get(`${currentStack.x}-${currentStack.y}`);

        let index = cnode.indexOf(currentStack.value);
        if(index === cnode.length - 1) {
            this.rollback();
        }else{
            stacks.push({
                x: currentStack.x,
                y: currentStack.y,
                value: cnode[index+1],
            });
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
        // 横向查找
        for (let i = 0; i < 9; i++) {
            if (i === x) {
                continue;
            }
            let node = this.sudokuMap[i][y];
            if (node === val) {
                ret = false;
                break;
            }
        }

        if (ret === false) {
            return ret;
        }
        // 纵向查找
        for (let i = 0; i < 9; i++) {
            if (i === y) {
                continue;
            }
            let node = this.sudokuMap[x][i];
            if (node === val) {
                ret = false;
                break;
            }
        }

        if (ret === false) {
            return ret;
        }

        let found = false;
        for (let i = 0; i < 9; i++) {
            if (found) {
                break;
            }
            for (let j = 0; j < 9; j++) {
                if (
                    i >= Math.floor(x / 3) * 3
                    && i < (Math.floor(x / 3) * 3 + 3)
                    && j >= Math.floor(y / 3) * 3
                    && j < (Math.floor(y / 3) * 3 + 3)
                ) {

                    if (i === x && j === y) {
                        continue;
                    }

                    let node = this.sudokuMap[i][j];
                    // console.log(i,j, node);
                    if (node === val) {
                        found = true;
                        ret = false;
                        break;
                    }
                }
            }
        }

        // 检查this.orders里面是否有空值
        for(let i = 0, len = this.orders.length ; i < len ; i++){
            let item = this.orders[i];
            if(item.value.length === 0) {
                console.log('return false');
                return false;
                break;
            }
        }
        // this.updateOrders();
        return ret;
    }

}

module.exports = Sudoku;
