const Sudoku = require('./libs/sudoku');
const maps = require('./maps');

let s = new Date();

let sdk = new Sudoku({
    display: false, // 是否打印过程，打印的速度慢很多
    sudokuMap: maps.hard1,
}).start();

console.log(`共用时${new Date()-s}ms`);

console.log(sdk.sudokuMap);
