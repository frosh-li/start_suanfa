/**
 * 数独算法测试
 */

class Sudoku {

	constructor({display = false, sudokuMap = []}) {

        // 是否展示算法过程
        this.display = display;

        // 原始数独数组
		this.sudokuMap = sudokuMap;

        // 回溯数组
        this.stacks = [];

        // 是否已经解答完成
        this.resolved = false;

        // 第一个可以填写的空白格
        this.startPoint = {
            x: 0,
            y: 0,
            value: 1,
        };
	}

    /**
     * 如果某一个方格填写的测试数据能够经过校验
     * 就寻找到一下个需要填写数的方格
     * 这个方格的不能已经填写过数字
     * 找到这个方格的坐标返回
    */
    getNextPoint() {
        let currentStack = this.stacks[this.stacks.length - 1];
        let found = false; // 是否已经找到初始点
        let ret = {
            x:-1,
            y:-1,
            value: 1,
        }
        for(let i = 0 ; i < 9 ; i++) {
            if(found) {
                break;
            }
			for(let j = 0 ; j < 9 ; j++) {
                let node = this.sudokuMap[i][j];
                if(node === 0 && found === false) {
                    ret.x = i;
                    ret.y = j;
                    ret.value = 1;
                    found=true;
                    break;
                }
            }
        }
        if(ret.x === -1 && ret.y === -1) {
            this.resolved = true;
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
            x: 0,
            y: 0,
            value: 1,
        };

        let found = false;

        for(let i = 0 ; i < 9 ; i++) {
            if(found) {
                break;
            }
			for(let j = 0 ; j < 9 ; j++) {
                let node = this.sudokuMap[i][j];
                if(node === 0 && found === false && !(ret.x === 0 && ret.y===0)) {
                    ret.x = i ;
                    ret.y = j;
                    found=true;
                    break;
                }
            }
        }
        this.startPoint = ret;
        return ret;
    }

    /**
     * 程序入口
     * 开始执行
     */
	start() {

        // 清空命令行
        process.stdout.cursorTo(0,0);
        process.stdout.clearScreenDown();

        let {resolved: resolved, stacks: stacks} = this;

        while(resolved === false){

            // 如果记录填写数字的历史表为空，直接找第一个可以填写的方格填入
            if(stacks.length === 0) {
                stacks.push(this.getFirstPoint())
            }

            let cStack = stacks[stacks.length - 1];

            process.stdout.cursorTo(0,0);

            if(this.display) {
                console.log(this.sudokuMap);
            }

            /**
             * 结束判断
             * 如果获取不到需要填写的方格
             * 说明已经全部填写完成
             */
            if(cStack.x === -1 && cStack.y === -1) {
                resolved = true;
                return this;
            }

            let valid = this.testRules(cStack);

            if(valid) {
                /**
                 * 填写的数字满足校验
                 * 先设置数独数组的值为当前测试的值
                 * 然后寻找下一个方格
                 */
                this.sudokuMap[cStack.x][cStack.y] = cStack.value;
                stacks.push(this.getNextPoint());
            }else{
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
                this.sudokuMap[cStack.x][cStack.y] = 0;
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

        let {stacks, startPoint} = this;

        let currentStack = stacks.pop();

        this.sudokuMap[currentStack.x][currentStack.y] = 0;

        if(
        currentStack.x === startPoint.x
        && currentStack.y === startPoint.y
        && currentStack.value < 9) {

            let nextValue = currentStack.value+1;
            stacks.push({
                x: 0,
                y: 0,
                value: nextValue
            });

        }else{

            if(currentStack.value < 9) {
                currentStack.value++;
                stacks.push(currentStack);
            }else{
                this.rollback();
            }
        }
    }

    /**
     * 判断填入的数值是否满足数独规则
     * 1、横向扫描，当前填入的数字是否有重复
     * 2、纵向扫描，当前填入的数字是否有重复
     * 3、扫描当前格子所在的3X3的小格子中是否有重复数字
     */
    testRules(stack) {
        let { x: x, y: y, value: val} = stack;
        let ret = true;
        // 横向查找
		for(let i = 0 ; i < 9 ; i++) {
			if(i === x) {
				continue;
			}
			let node = this.sudokuMap[i][y];
            if(node === 0) {
                continue;
            }
			if(node === val) {
				ret = false;
                break;
			}
		}

        if(ret === false) {
            return ret;
        }

		// 纵向查找
		for(let i = 0 ; i < 9 ; i++) {
			if(i === y) {
				continue;
			}
			let node = this.sudokuMap[x][i];
            if(node === 0) {
                continue;
            }
            if(node === val) {
				ret = false;
                break;
			}
		}

        if(ret === false) {
            return ret;
        }

        let found = false;
		for(let i = 0 ; i < 9 ; i++) {
            if(found) {
                break;
            }
			for(let j = 0 ; j < 9 ; j++) {
				if(
					i >= Math.floor(x/3)*3
					&& i < (Math.floor(x/3)*3 + 3)
					&& j >= Math.floor(y/3)*3
					&& j < (Math.floor(y/3)*3 + 3)) {

					if(i === x && j === y) {
						continue;
					}

					let node = this.sudokuMap[i][j];
                    if(node === 0) {
                        continue;
                    }
					// console.log(i,j, node);
					if(node === val) {
                        found = true;
                        ret = false;
						break;
					}
				}
			}
		}
        return ret;
    }

}

module.exports = Sudoku;
