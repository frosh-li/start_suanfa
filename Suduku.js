/**
 * 数独算法测试
 */

class Sudoku {
	constructor() {
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
			[-1 , 1 ,-1 , -1 ,-1, -1 ,  7 , -1 , -1 ,],
			[ 5 ,-1 ,-1 , -1 , 7,  3 , -1 , -1 , -1 ,],
			[-1 ,-1 ,-1 ,  9 , 2,  8 , -1 , -1 ,  5 ,],
			[-1 ,-1 , 3 , -1 , 4, -1 , -1 ,  8 ,  6 ,],
			[-1 , 9 ,-1 , -1 ,-1, -1 , -1 , -1 ,  4 ,],
			[-1 , 2 ,-1 , -1 ,-1, -1 ,  9 , -1 ,  7 ,],
			[-1 , 8 ,-1 , -1 ,-1,  2 , -1 , -1 ,  1 ,],
			[ 9 ,-1 , 6 , -1 ,-1, -1 , -1 , -1 ,  3 ,],
			[-1 ,-1 ,-1 , -1 ,-1, -1 , -1 ,  6 , -1 ,],
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

		this.backupMap = [];
		this.searchedPoints = new Set([]);
		this.numbers = 0;
		
		// this.updateMapByFixed();

		this.steps = 0;
		this.maxSteps = 5;
		this.runningMap = [];
		this.updateRule();
	}

	start() {
		let {steps, maxSteps} = this;

		// this.stepFunc(this.initMap);
	}

	stepFunc() {
		
		const {x, y, size, val} = this.getPoint();
		console.log('搜索位置',x,y,size,val);
		this.updateMapByFixed();
		for(let data of val) {
			// let [first,..._] = val;
			let tempMap = [] 
			this.initMap.forEach(item => {
				tempMap.push(item.slice(0));
			})
			tempMap[x][y] = data;
			console.log(tempMap);
			this.runningMap.push(tempMap)
		}
		console.log('runningMap',this.runningMap.length);
		this.running();
	}

	/**
	 * 根据横向竖向九宫格 所有集合判定出唯一值
	 * @return {[type]} [description]
	 */
	updateMapByFixed() {
		for(let i = 0 ; i < 9 ; i++){
			for(let j = 0 ; j < 9 ; j++) {
				let node = this.initMap[i][j];
				if(typeof node === 'object') {
					this.checkNode(i,j);	
				}
				
			}
		}

		console.log('updateMapByFixed')
		console.log(this.initMap);
		this.updateRule();
	}

	checkNode(x, y) {
		let cnode = this.initMap[x][y];

		for(let val of cnode) {
			let canFindX = false;	
			for(let i = 0 ; i < 9 ; i++) {
				if(i === x) {
					continue;
				}

				let node = this.initMap[i][y];
				if(
					(typeof node === 'object' && node.has(val))
					||
					val === node
					) {
					canFindX = true;
					break
				}
			}

			if(canFindX ===  false){
				this.initMap[x][y] = val;
			}

			let canFindY = false;

			for(let i = 0 ; i < 9 ; i++) {
				if(i === y) {
					continue;
				}

				let node = this.initMap[x][i];
				if(
					(typeof node === 'object' && node.has(val))
					||
					val === node
					) {
					canFindY = true;
					break
				}
			}

			if(canFindY ===  false){
				this.initMap[x][y] = val;
			}

			let canFindXY = false;
			for(let i = 0 ; i < 9 ; i++) {
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
						if(
							(typeof node === 'object' && node.has(val))
							||
							val === node
							) {
							canFindXY = true;
							break
						}
					}
				}
			}
			if(canFindXY === false) {
				this.initMap[x][y] = val;
			}
		}
		
	}

	running() {
		this.initMap = this.runningMap.pop();

		if(!this.initMap) {
			console.log('over runningMap');
			return;
		}
		console.log('start runningMap', this.initMap);
		let {
			isover,
			onchange,
			hasError
		} = this.updateRule();
		if(isover) {
			console.log('完美成功');
			console.log(this.initMap);
			return;
		}

		if(hasError) {
			console.log('出现错误');
			console.log(this.initMap);
			this.running();
			return;
		}

		setTimeout(() => {
			this.stepFunc();
		},10000)
	}

	getPoint() {
		let point = {};
		for(let i = 0 ; i < 9 ; i++) {
			for(let j = 0 ; j < 9 ; j++) {
				let node = this.initMap[i][j];
				if(typeof node === 'object') {
					if(!point.size) {
						point = {
							x: i,
							y: j,
							size: node.size,
							val: node,
						}
						break;
					}
					if(node.size < point.size) {
						point = {
							x: i,
							y: j,
							size: node.size,
							val: node,
						}
					}
				}
			}
		}
		return point;
	}
	
	/**
	 * 初始化空格数据， 根据规则，填入对应的数字
	 * @return {[type]} [description]
	 */
	updateRule() {
		if(this.numbers === 81) {
			return;
		}
		let isover = false;
		let onchange = false;
		let hasError = false;
		let ans = 0;
		this.numbers = 0;
		
		for(let i = 0 ; i < 9 ; i++) {
			for(let j = 0 ; j < 9 ; j++) {
				let node = this.initMap[i][j];
				if(node === -1 || typeof node === 'object') {
					ans++;
					hasError = this.setNode(i,j);
				}else{
					this.numbers++;
				}
			}
		}

		console.log('first init');
		console.log(this.initMap);
		console.log('已经解决',this.numbers, '待解决', ans);
		this.updateMapByFixed();
		return {
			isover: this.numbers === 81,
			onchange: true,
			hasError: hasError
		};

		
	}

	/**
	 * 填入单元格数据
	 * @param {[type]} x [description]
	 * @param {[type]} y [description]
	 */
	setNode(x, y) {
		let hasChanged = false;
		let datas = new Set([1,2,3,4,5,6,7,8,9]);
		if(typeof this.initMap[x][y] === 'object') {
			datas = this.initMap[x][y];
		}
		// 横向查找
		for(let i = 0 ; i < 9 ; i++) {
			if(i === x) {
				continue;
			}
			let node = this.initMap[i][y];
			
			if(datas.has(node)) {
				datas.delete(node);
				hasChanged = true;
			}
		}

		// 纵向查找
		for(let i = 0 ; i < 9 ; i++) {
			if(i === y) {
				continue;
			}
			let node = this.initMap[x][i];
			if(datas.has(node)) {
				datas.delete(node);
			}	
		}


		
		// 所在的3X3单元格中查找
		for(let i = 0 ; i < 9 ; i++) {

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
					// console.log(i,j, node);
					if(datas.has(node)) {
						datas.delete(node);
					}
				}else{
					continue;
				}
			}
		}



		if(datas.size === 1) {

			let [current, ..._] = datas;

			this.initMap[x][y] = current;	
			
		} else {
			this.initMap[x][y] = datas;	
		}		

		if(datas.size === 0) {
			console.log('出现错误');
			return false;
		}else{
			return true;
		}
	}
}

let s = new Date();
new Sudoku().start();
console.log(`共用时${new Date()-s}ms`);