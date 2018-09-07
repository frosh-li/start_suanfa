/**
 * 数独算法测试
 */
const tty = require('tty');

class Sudoku {
	constructor({display = false}) {
        this.display = display;
		this.initMap = [
			[-1 ,-1 ,-1 , 2 ,-1, -1 , 8 , -1 ,-1 ,],
			[5, -1 , 9 , -1 , 4, -1 , 7 , -1 , -1 ,],
			[-1, -1, -1, -1, -1, -1, -1, 1, 5 ,],
			[1, 4, 3, 5, 6 ,2 , 9, 7, 8,],
			[-1, 6, -1 ,8 ,-1 ,4 , 1, 3, 2],
			[-1, 7, 2, 9, 3, 1, 5, -1, 4],
			[3, 1, 8, 7, 2, 5, -1 , 4 ,9],
			[2, 9 ,6 ,-1 ,-1, 8 ,-1 ,-1 ,-1],
			[7, -1, 4, -1, -1 ,3, -1 ,-1, -1],
		]

		this.initMap = [
			[ 0 , 1 ,0 , 0 ,0, 0 ,  7 , 0 , 0 ],
			[ 5 ,0 ,0 , 0 , 7,  3 , 0 , 0 , 0 ],
			[0 ,0 ,0 ,  9 , 2,  8 , 0 , 0 ,  5 ],
			[0 ,0 , 3 , 0 , 4, 0 , 0 ,  8 ,  6 ],
			[0 , 9 ,0 , 0 ,0, 0 , 0 , 0 ,  4 ],
			[0 , 2 ,0 , 0 ,0, 0 ,  9 , 0 ,  7 ],
			[0 , 8 ,0 , 0 ,0,  2 , 0 , 0 ,  1 ],
			[ 9 ,0 , 6 , 0 ,0, 0 , 0 , 0 ,  3 ],
			[0 ,0 ,0 , 0 ,0, 0 , 0 ,  6 , 0 ]
		]

		// this.initMap = [
		// 	[-1 , -1 ,-1 , -1 ,-1, -1 ,  2 , -1 , -1 ,],
		// 	[-1 ,  9 , 8 , -1 ,-1, -1 ,  4 , -1 , -1 ,],
		// 	[ 4 , -1 ,-1 , -1 , 2, -1 ,  3 , -1 , -1 ,],
		// 	[-1 ,  4 ,-1 ,  9 ,-1, -1 , -1 , -1 ,  6 ,],
		// 	[ 5 , -1 ,-1 ,  1 ,-1, -1 ,  7 ,  3 , -1 ,],
		// 	[-1 , -1 ,-1 , -1 ,-1,  6 , -1 ,  5 , -1 ,],
		// 	[ 9 ,  8 , 4 , -1 ,-1,  1 ,  6 , -1 , -1 ,],
		// 	[-1 , -1 ,-1 , -1 ,-1,  4 , -1 , -1 ,  3 ,],
		// 	[-1 ,  2 ,-1 , -1 , 9, -1 ,  1 , -1 , -1 ,],
		// ]

        // 回溯数组
        this.stacks = [];

        // 开始结束的标志位
        this.gameOver = false;
	}

    getNextPoint() {
        let currentStack = this.stacks[this.stacks.length - 1];
        let find = false; // 是否已经找到初始点
        let ret = {
            x:-1,
            y:-1,
            value: 1,
        }
        for(let i = 0 ; i < 9 ; i++) {
            if(find) {
                break;
            }
			for(let j = 0 ; j < 9 ; j++) {
                // if(((currentStack.x+1)*3+currentStack.y) > ((i+1)*3+j)) {
                //     continue;
                // }
                let node = this.initMap[i][j];
                if(node === 0 && find === false) {
                    ret.x = i;
                    ret.y = j;
                    ret.value = 1;
                    find=true;
                    break;
                }
            }
        }
        if(ret.x === -1 && ret.y === -1) {
            this.gameOver = true;
        }
        return ret;
    }

    getFirstEmptyPoint() {
        let ret = {
            x: 0,
            y: 0,
            value: 1,
        }

        let find = false; // 是否已经找到初始点

        for(let i = 0 ; i < 9 ; i++) {
            if(find) {
                break;
            }
			for(let j = 0 ; j < 9 ; j++) {
                let node = this.initMap[i][j];
                if(node === 0 && find === false && !(ret.x === 0 && ret.y===0)) {
                    ret.x = i ;
                    ret.y = j;
                    find=true;
                    break;
                }
            }
        }
        return ret;
    }

	start() {
        process.stdout.cursorTo(0,0);
        process.stdout.clearScreenDown();
        // console.log(this.initMap);
        let {gameOver: gameOver, stacks: stacks} = this;

        while(gameOver === false){

            if(stacks.length === 0) {
                stacks.push(this.getFirstEmptyPoint())
            }

            let cStack = stacks[stacks.length - 1];

            // process.stdout.clearScreenDown();
            process.stdout.cursorTo(0,0);
            if(this.display) {
                console.log(this.initMap);
            }
            if(cStack.x === -1 && cStack.y === -1) {
                gameOver = true;
                return this;
            }
            let out = this.testRules(cStack);

            // out 为true说明测试满足条件，如果满足条件，进行下一个点的测试
            // 如果out 为false说明不满足条件，直接对这个点进行操作
            if(out) {
                // 设置为了值以后再进行计算
                this.initMap[cStack.x][cStack.y] = cStack.value;
                // console.log(this.initMap);
                stacks.push(this.getNextPoint());
            }else{
                this.initMap[cStack.x][cStack.y] = 0;
                this.huisu();
            }
        };
	}

    huisu() {
        let {stacks} = this;
        let currentStack = stacks.pop();
        this.initMap[currentStack.x][currentStack.y] = 0;
        if(currentStack.x === 0 && currentStack.y === 0 && currentStack.value < 9) {
            let nextValue = currentStack.value+1;
            stacks.push({
                x: 0,
                y: 0,
                value: nextValue
            });
            //this.initMap[0][0] = nextValue;
        }else{
            // 重置shift出来的点的数值

            if(currentStack.value < 9) {
                currentStack.value++;
                stacks.push(currentStack);
            }else{
                this.huisu();
            }
        }
    }

    // 测试规则，看看这个点是否满足条件，如果不满足继续
    testRules(stack) {
        let {x:x,y:y,value:val} = stack;
        let ret = true;
        // 横向查找
		for(let i = 0 ; i < 9 ; i++) {
			if(i === x) {
				continue;
			}
			let node = this.initMap[i][y];
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
			let node = this.initMap[x][i];
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

		// 所在的3X3单元格中查找
        let in33 = false;
		for(let i = 0 ; i < 9 ; i++) {
            if(in33) {
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

					let node = this.initMap[i][j];
                    if(node === 0) {
                        continue;
                    }
					// console.log(i,j, node);
					if(node === val) {
                        in33 = true;
                        ret = false;
						break;
					}
				}
			}
		}
        return ret;
    }

}

let s = new Date();
//
let sdk = new Sudoku({
    display:false // 是否打印过程，打印的速度慢很多
}).start();
console.log(`共用时${new Date()-s}ms`);
console.log(sdk.initMap);
