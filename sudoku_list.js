class Point {
    constructor(value, x, y) {
      this.value = value;  //当前取值
      this.set = new Set(); //可能的取值列表
      this.x = x; //当前点坐标x
      this.y = y; //当前点坐标y
    }
}

// var originArray = [[0,0,4,0,0,0,0,0,9],
//                    [2,0,0,0,9,7,1,0,0],
//                    [0,6,0,5,0,0,4,0,0],
//                    [0,5,0,0,0,3,0,0,2],
//                    [0,0,8,6,0,5,7,0,0],
//                    [3,0,0,1,0,0,0,5,0],
//                    [0,0,3,0,0,4,0,9,0],
//                    [0,0,2,3,6,0,0,0,4],
//                    [7,0,0,0,0,0,3,0,0]];
// var originArray = [[0,8,0,7,9,0,0,0,0],
//                    [0,0,0,0,0,2,0,9,0],
//                    [0,0,3,0,0,8,4,5,0],
//                    [0,0,8,0,0,0,0,0,1],
//                    [0,9,6,0,0,0,3,7,0],
//                    [3,0,0,0,0,0,2,0,0],
//                    [0,3,2,5,0,0,9,0,0],
//                    [0,4,0,8,0,0,0,0,0],
//                    [0,0,0,0,6,4,0,2,0]];
// var originArray = [[0,0,3,8,4,9,1,0,0],
//                    [0,1,0,0,0,0,0,3,0],
//                    [8,0,0,1,0,6,0,0,5],
//                    [3,0,5,2,0,4,8,0,1],
//                    [1,0,0,0,7,0,0,0,2],
//                    [6,0,7,5,0,1,3,0,4],
//                    [9,0,0,6,0,7,0,0,3],
//                    [0,3,0,0,0,0,0,1,0],
//                    [0,0,1,3,5,8,2,0,0]];
// var originArray = [[0,0,0,0,0,0,0,0,0],
//                    [0,0,0,0,0,0,0,0,0],
//                    [0,0,0,0,0,0,0,0,0],
//                    [0,0,0,0,0,0,0,0,0],
//                    [0,0,0,0,0,0,0,0,0],
//                    [0,0,0,0,0,0,0,0,0],
//                    [0,0,0,0,0,0,0,0,0],
//                    [0,0,0,0,0,0,0,0,0],
//                    [0,0,0,0,0,0,0,0,0]];
var originArray = [[8,0,0,0,0,0,0,0,0],
                   [0,0,3,6,0,0,0,0,0],
                   [0,7,0,0,9,0,2,0,0],
                   [0,5,0,0,0,7,0,0,0],
                   [0,0,0,0,4,5,7,0,0],
                   [0,0,0,1,0,0,0,3,0],
                   [0,0,1,0,0,0,0,6,8],
                   [0,0,8,5,0,0,0,1,0],
                   [0,9,0,0,0,0,4,0,0]];
//没通过的
// var originArray = [[0,0,0,0,6,0,0,0,9],
//                    [0,3,0,0,1,0,0,6,0],
//                    [0,0,0,0,0,2,1,8,0],
//                    [5,0,8,0,0,0,9,0,0],
//                    [0,0,7,0,0,0,4,1,0],
//                    [0,0,0,0,3,1,0,0,0],
//                    [0,2,0,0,0,7,0,0,0],
//                    [8,0,1,0,4,0,0,0,5],
//                    [9,0,0,0,0,6,0,0,3]];
// var originArray = [[0,0,5,3,0,0,0,0,0],
//                    [8,0,0,0,0,0,0,2,0],
//                    [0,7,0,0,1,0,5,0,0],
//                    [4,0,0,0,0,5,3,0,0],
//                    [0,1,0,0,7,0,0,0,6],
//                    [0,0,3,2,0,0,0,8,0],
//                    [0,6,0,5,0,0,0,0,9],
//                    [0,0,4,0,0,0,0,3,0],
//                    [0,0,0,0,0,9,7,0,0]];
let startTime = (new Date().getTime())/1000;
var times=0;
console.time('time');
console.log('input:');
console.log(originArray);
let pointsList = arrayToPointsList(originArray);
if (testArray(originArray, pointsList)){
    console.log('Success!')
}else{
    console.log('failed!')
}
console.timeEnd('time');
console.log(`test ${times} times!`);


//迭代函数,传入9*9数组和待计算位置列表
function testArray(fatherArray, fatherList){
    times++;
    if (fatherList.length===0){
        //如果待计算位置长度为零，说明已经都找到,迭代结束，返回成功
        console.log('output:');
        console.log(fatherArray);
        return true;
    }
    //计算概率最小的位置
    let minPoint = getMinPoint(fatherList);

    //取位置概率最小的位置进行测试
    for(let testValue of minPoint.set.values()){
        let childArray = cloneTwoDimArray(fatherArray);
        let childList = getChildPointsList(fatherList, minPoint, testValue);
        childArray[minPoint.x][minPoint.y] = testValue;
        if (testArray(childArray, childList)){
            //子项测试成功，返回成功
            return true
        }else{
            //子项测试失败，自动测试下一个值
        }
    }
    //如果测试循环结束还没有成功退出，说明父值测试失败，返回false
    return false;
}
//传入数字set，返回没有出现过的数字set
function getNullSet(listSet){
    var allSet = new Set([1,2,3,4,5,6,7,8,9]);
    for(let value of listSet.values()){
        if (allSet.has(value)) {
            allSet.delete(value);
        }
    }
    return allSet;
}


//获取行列上出现过的数字列表
function getXYNumbers(x,y,array){
    let numbers = new Set();
    //取列已出现数字set
    for(i=0;i<9;i++){
        numbers.add(array[x][i]);
    }

    //取行亿出现数字set  
    for(i=0;i<9;i++){
        numbers.add(array[i][y]);
    }

    //取9格内出现过的数字set
    //计算左上角坐标
    xTimes=Math.floor((x)/3);
    yTimes=Math.floor((y)/3);
    for(i=0;i<3;i++){
        for(j=0;j<3;j++){
            numbers.add(array[xTimes*3 + i][yTimes*3 + j]);
        }
    }

    return numbers;
}


//取出矩阵中概率最小的点（不包括已经确定值的点）
function getMinPoint(list){
    let minX = 0;
    let minSetSize = 10;
    for(i=0;i<list.length;i++){
            if(list[i].set.size < minSetSize){
                minSetSize = list[i].set.size;
                minX = i;
            }
            }
    let point = new Point(list[minX].value, list[minX].x, list[minX].y);
    point.set = new Set(list[minX].set.values());
    return point;
}


//数组转成point数组
function arrayToPointsList(array){
    let list = new Array(); 
    for (x=0;x<9;x++){
        for (y=0;y<9;y++){
            let point = new Point(array[x][y], x, y);
            if(point.value===0){
                let numbers = getXYNumbers(x,y,array); //当前位置行列上出现过的数字
                point.set = getNullSet(numbers); //当前位置行列上没有出现过的数字
                list.push(point);
            }
        }
    }  
    return list;
}
//pointlist删除某个节点后的子list
function getChildPointsList(list, deletedPoint, value){
    let childList = new Array();
    for (i=0;i<list.length;i++){
        //如果是被删除点，不复制，进入下个循环
        let oldPoint = list[i];
        if(oldPoint.x===deletedPoint.x && oldPoint.y===deletedPoint.y) {
            continue;
        }
        //进行节点复制
        let point = new Point(oldPoint.value, oldPoint.x, oldPoint.y);
        point.set = new Set(oldPoint.set.values());
        //如果是同一行或同一列，删除测试值
        if(oldPoint.x===deletedPoint.x || oldPoint.y===deletedPoint.y) {
            point.set.delete(value);
        }
        //如果再同一3*3小矩阵内，删除测试值
        if(Math.floor(oldPoint.x/3)===Math.floor(deletedPoint.x/3) && Math.floor(oldPoint.y/3) === Math.floor(deletedPoint.y/3)) {
            point.set.delete(value);
        }
        childList.push(point);
    }
    return childList;
}

//实现二维数组的复制
function cloneTwoDimArray(array){
    let newArray = new Array(9);
    for(i=0;i<9;i++){
        newArray[i]= new Array(9);
        for(j=0;j<9;j++){
            newArray[i][j]= array[i][j];
        }
    }
    return newArray;
}

