const Sudoku = require('./libs/sudoku');
const maps = require('./maps');

// for(let map in maps) {
//     let sdk = new Sudoku({
//         display: false, // 是否打印过程，打印的速度慢很多
//         sudokuMap: maps[map],
//     }).start();
// }
let sdk = new Sudoku({
    display: false, // 是否打印过程，打印的速度慢很多
    sudokuMap: maps['hard1'],
}).start();
//console.log(sdk.sudokuMap);
