const Sudoku = require('./libs/sudoku');
const maps = require('./maps');


for(let key in maps) {
    let map = maps[key];
    let sdk = new Sudoku({
        display: false, // 是否打印过程，打印的速度慢很多
        sudokuMap: map,
    }).start();
}

//console.log(sdk.sudokuMap);
