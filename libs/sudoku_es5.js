'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 数独算法
 */

var Sudoku = function () {
    function Sudoku(_ref) {
        var _ref$display = _ref.display,
            display = _ref$display === undefined ? false : _ref$display,
            _ref$sudokuMap = _ref.sudokuMap,
            sudokuMap = _ref$sudokuMap === undefined ? [] : _ref$sudokuMap;

        _classCallCheck(this, Sudoku);

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
    }

    /**
     * 初始化确定每个可填写的格子可以的填入的数值，做成一个MAP
     */


    _createClass(Sudoku, [{
        key: 'init',
        value: function init() {
            var exsitTimes = {};
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    var node = this.sudokuMap[i][j];
                    if (node === 0) {
                        this.testMayFill(i, j);
                    } else {
                        // 记录每个数字出现的次数
                        exsitTimes[node] ? exsitTimes[node]++ : exsitTimes[node] = 1;
                    }
                }
            }

            // 进行一次可填入数字的排序
            // 回溯的时候找下一个节点的时候从小到大进行搜索

            var data = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.dataMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _slicedToArray(_step.value, 2),
                        key = _step$value[0],
                        value = _step$value[1];

                    data.push({
                        x: parseInt(key.split('-')[0]),
                        y: parseInt(key.split('-')[1]),
                        value: value.sort(function (a, b) {
                            exsitTimes[a] - exsitTimes[b] > 0 ? 1 : -1;
                        })
                    });
                }
                // //
                // data.sort(function(a , b) {
                //     return a.value.length >= b.value.length ? 1 : -1;
                // })
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.orders = data;

            // console.log(this.orders);
            // process.exit();
        }

        /**
         * 设置当前格子可能填入的值
         */

    }, {
        key: 'testMayFill',
        value: function testMayFill(x, y) {
            var mayFillNumber = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

            // 横向查找
            for (var i = 0; i < 9; i++) {
                if (i === x) {
                    continue;
                }
                var node = this.sudokuMap[i][y];
                if (mayFillNumber.has(node)) {
                    mayFillNumber.delete(node);
                }
            }

            // 纵向查找
            for (var _i = 0; _i < 9; _i++) {
                if (_i === y) {
                    continue;
                }
                var _node = this.sudokuMap[x][_i];

                if (mayFillNumber.has(_node)) {
                    mayFillNumber.delete(_node);
                }
            }

            // 3X3 方格查找
            for (var _i2 = 0; _i2 < 9; _i2++) {
                for (var j = 0; j < 9; j++) {
                    if (_i2 >= Math.floor(x / 3) * 3 && _i2 < Math.floor(x / 3) * 3 + 3 && j >= Math.floor(y / 3) * 3 && j < Math.floor(y / 3) * 3 + 3) {
                        var _node2 = this.sudokuMap[_i2][j];
                        if (mayFillNumber.has(_node2)) {
                            mayFillNumber.delete(_node2);
                        }
                    }
                }
            }

            this.dataMap.set(x + '-' + y, [].concat(_toConsumableArray(mayFillNumber)));
        }

        /**
         * 如果某一个方格填写的测试数据能够经过校验
         * 就寻找到一下个需要填写数的方格
         * 这个方格的不能已经填写过数字
         * 找到这个方格的坐标返回
         */

    }, {
        key: 'getNextPoint',
        value: function getNextPoint() {
            var currentStack = this.stacks[this.stacks.length - 1];
            var ret = {
                x: -1,
                y: -1,
                value: 1
            };
            for (var i = 0, len = this.orders.length; i < len; i++) {
                var cvalue = this.orders[i];

                if (cvalue.x === currentStack.x && cvalue.y === currentStack.y) {
                    var nextValue = this.orders[i + 1];
                    if (!nextValue) {
                        this.resolved = true;
                        return ret;
                        break;
                    }
                    ret.x = nextValue.x;
                    ret.y = nextValue.y;
                    ret.value = nextValue.value[0];
                    break;
                }
            }

            if (ret.x === -1 && ret.y === -1) {
                this.resolved = true;
                process.exit();
            }
            // console.log('next value', ret);
            return ret;
        }

        /**
         * 获取初始节点
         * 初始节点为第一个不为0的方格
         * 0 0 坐标节点上面可能已经填写了数字
         */

    }, {
        key: 'getFirstPoint',
        value: function getFirstPoint() {
            var ret = {
                x: this.orders[0].x,
                y: this.orders[0].y,
                value: this.orders[0].value[0]
            };
            return ret;
        }

        /**
         * 程序入口
         * 开始执行
         */

    }, {
        key: 'start',
        value: function start() {
            var s = new Date();

            // 清空命令行
            var resolved = this.resolved,
                stacks = this.stacks;

            if (this.display) {
                process.stdout.cursorTo(0, 0);
                process.stdout.clearScreenDown();
            }

            while (resolved === false) {
                //setInterval(() => {


                // 如果记录填写数字的历史表为空，直接找第一个可以填写的方格填入
                if (stacks.length === 0) {
                    stacks.push(this.getFirstPoint());
                }

                var cStack = stacks[stacks.length - 1];

                if (this.display) {
                    process.stdout.cursorTo(0, 0);
                    console.log(this.sudokuMap);
                    console.log('已经填入数量', stacks.length);
                    console.log('\u5F53\u524D\u8017\u65F6' + (new Date() - s) + 'ms');
                }

                /**
                 * 结束判断
                 * 如果获取不到需要填写的方格
                 * 说明已经全部填写完成
                 */
                if (cStack.x === -1 && cStack.y === -1) {
                    resolved = true;
                    // console.log(this.sudokuMap);
                    console.log(this.sudokuMap);
                    console.log('已经填入数量', stacks.length);
                    console.log('\u5F53\u524D\u8017\u65F6' + (new Date() - s) + 'ms');
                    return this;
                }

                var valid = this.testRules(cStack);

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

    }, {
        key: 'rollback',
        value: function rollback() {
            var stacks = this.stacks,
                dataMap = this.dataMap;


            var currentStack = stacks.pop();
            // let currentStack = stacks[stacks.length - 1];


            this.sudokuMap[currentStack.x][currentStack.y] = 0;
            var needRollbackDirect = false;
            for (var i = 0, len = this.orders.length; i < len; i++) {
                var cOrder = this.orders[i];
                if (cOrder.x === currentStack.x && cOrder.y === currentStack.y) {
                    var orderIndex = cOrder.value.indexOf(currentStack.value);
                    if (orderIndex < 0) {
                        console.log('查找完成');
                        process.exit();
                    }
                    var cValue = cOrder.value[orderIndex + 1];
                    if (orderIndex === cOrder.value.length - 1) {
                        needRollbackDirect = true;
                        break;
                    } else {

                        stacks.push({
                            x: currentStack.x,
                            y: currentStack.y,
                            value: cValue
                        });
                    }
                    break;
                }
            }
            if (needRollbackDirect) {
                this.rollback();
            }
        }

        /**
         * 判断填入的数值是否满足数独规则
         * 1、横向扫描，当前填入的数字是否有重复
         * 2、纵向扫描，当前填入的数字是否有重复
         * 3、扫描当前格子所在的3X3的小格子中是否有重复数字
         */

    }, {
        key: 'testRules',
        value: function testRules(stack) {
            var x = stack.x,
                y = stack.y,
                val = stack.value;

            var ret = true;
            // 横向查找
            for (var i = 0; i < 9; i++) {
                if (i === x) {
                    continue;
                }
                var node = this.sudokuMap[i][y];
                if (node === 0) {
                    continue;
                }
                if (node === val) {
                    ret = false;
                    break;
                }
            }

            if (ret === false) {
                return ret;
            }

            // 纵向查找
            for (var _i3 = 0; _i3 < 9; _i3++) {
                if (_i3 === y) {
                    continue;
                }
                var _node3 = this.sudokuMap[x][_i3];
                if (_node3 === 0) {
                    continue;
                }
                if (_node3 === val) {
                    ret = false;
                    break;
                }
            }

            if (ret === false) {
                return ret;
            }

            var found = false;
            for (var _i4 = 0; _i4 < 9; _i4++) {
                if (found) {
                    break;
                }
                for (var j = 0; j < 9; j++) {
                    if (_i4 >= Math.floor(x / 3) * 3 && _i4 < Math.floor(x / 3) * 3 + 3 && j >= Math.floor(y / 3) * 3 && j < Math.floor(y / 3) * 3 + 3) {

                        if (_i4 === x && j === y) {
                            continue;
                        }

                        var _node4 = this.sudokuMap[_i4][j];
                        if (_node4 === 0) {
                            continue;
                        }
                        // console.log(i,j, node);
                        if (_node4 === val) {
                            found = true;
                            ret = false;
                            break;
                        }
                    }
                }
            }
            return ret;
        }
    }]);

    return Sudoku;
}();

module.exports = Sudoku;
