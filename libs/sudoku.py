#coding=utf-8

#########################
#
# 数独算法
#
#########################
import math
import pprint
import threading
import time

class Sudoku:

    def __init__(self, display , sudokuMap):

        ' 是否展示算法过程 '

        self.display = display

        ' 原始数独数组 '
        self.sudokuMap = sudokuMap

        ' 回溯数组 '
        self.stacks = []

        self.orders = []

        ' 是否已经解答完成 '
        self.resolved = False
        ' 所有的循环次数统计 '
        self.allTimes = 0

        self.dataMap = {}
        self.init()
        self.testRuleTimes = {
            'ok': 0,
            'fail': 0,
        }
        self.currentOrder = 0


    ''''''''''''''''''''''''''''''
    #初始化确定每个可填写的格子可以的填入的数值，做成一个MAP
    ''''''''''''''''''''''''''''''
    def init(self):
        exsitTimes = {}
        for i in range(0, 9):
            for j in range(0, 9):
                self.allTimes = self.allTimes + 1
                node = self.sudokuMap[i][j]
                if node == 0:
                    self.orders.append({
                        'x': i,
                        'y': j,
                        'value': self.testMayFill(i, j)
                    })

                # else:
                #     # 记录每个数字出现的次数
                #     if exsitTimes[node]:
                #         exsitTimes[node] = exsitTimes[node] + 1
                #     else:
                #         exsitTimes[node]=1

        # 进行一次可填入数字的排序
        # 回溯的时候找下一个节点的时候从小到大进行搜索

        # data = []
        # print "dataMap"
        # pprint.pprint(self.dataMap)
        # for (key,value) in self.dataMap.items():
        #
        #     self.allTimes = self.allTimes+1
        #     data.append({
        #         'x': int(key.split('-')[0]),
        #         'y': int(key.split('-')[1]),
        #         'value': value,
        #     })
        # pprint.pprint(data)
        # self.orders = data
        # def sortFunc(elem):
        #     return elem['x']
        # self.orders.sort(key=sortFunc)
        #
        # pprint.pprint(self.orders)


    ##############
    #设置当前格子可能填入的值
    ############

    def testMayFill(self, x, y):
        mayFillNumber = [1,2,3,4,5,6,7,8,9]

        # 横向查找
        for i in range(0, 9):
            self.allTimes = self.allTimes + 1
            node = self.sudokuMap[i][y]
            if mayFillNumber.count(node) > 0 :
                mayFillNumber.remove(node)


        # 纵向查找
        for i in range(0, 9):
            self.allTimes = self.allTimes + 1
            node = self.sudokuMap[x][i]

            if mayFillNumber.count(node) > 0 :
                mayFillNumber.remove(node)


        # x为n所在的小九宫格左顶点竖坐标
        startX = int(math.floor(x / 3) * 3)

        # y为n所在的小九宫格左顶点横坐标
        startY  = int(math.floor(y / 3) * 3)


        # 判断n所在的小九宫格是否合法
        for i in range(startX, startX + 3):
            for j in range(startY, startY + 3):
                self.allTimes = self.allTimes + 1
                node = self.sudokuMap[i][j]
                if mayFillNumber.count(node) > 0 :
                    mayFillNumber.remove(node)


        self.dataMap[str(x)+'-'+str(y)] = mayFillNumber

        return mayFillNumber


    ######################################
    # 如果某一个方格填写的测试数据能够经过校验
    # 就寻找到一下个需要填写数的方格
    # 这个方格的不能已经填写过数字
    # 找到这个方格的坐标返回
    ######################################
    def getNextPoint(self):
        currentStack = self.stacks[len(self.stacks) - 1]

        ret = {
            'x': -1,
            'y': -1,
            'value': 1,
        }

        self.currentOrder = self.currentOrder + 1
        if self.currentOrder >= len(self.orders):
            return ret

        nextValue = self.orders[self.currentOrder]
        if nextValue == False:
            self.resolved = True
            return ret

        ret['x'] = nextValue['x']
        ret['y'] = nextValue['y']
        ret['value'] = nextValue['value'][0]

        return ret


    ################################################
    # 获取初始节点
    # 初始节点为第一个不为0的方格
    # 0 0 坐标节点上面可能已经填写了数字
    ################################################
    def getFirstPoint(self):
        ret = {
            'x': self.orders[0]['x'],
            'y': self.orders[0]['y'],
            'value': self.orders[0]['value'][0],
        }
        return ret


    ################################################
    # 程序入口
    # 开始执行
    ################################################
    def start(self):
        # 清空命令行
        startTime = int(round(time.time() * 1000))
        resolved = self.resolved
        stacks = self.stacks

        # 如果记录填写数字的历史表为空，直接找第一个可以填写的方格填入
        #
        self.stacks.append(self.getFirstPoint())

        while resolved == False :
            cStack = stacks[len(stacks) - 1]
            # print len(self.orders), 'in while', len(stacks)
            # print self.sudokuMap
            ################################################
            # 结束判断
            # 如果获取不到需要填写的方格
            # 说明已经全部填写完成
            ################################################
            if cStack['x'] == -1 and cStack['y'] == -1 :
                resolved = True
                endTime = int(round(time.time() * 1000)) - startTime
                print('cost', endTime, 'ms')
                pprint.pprint(self.sudokuMap)
                print('已经填入数量',len(stacks))
                print(self.testRuleTimes)
                print('所有For循环次数',self.allTimes)
                return self


            valid = self.testRules(cStack)

            if valid:

                # '''''''''''''''''''''''''''''''''''''''''''''''''
                 # * 填写的数字满足校验
                 # * 先设置数独数组的值为当前测试的值
                 # * 然后寻找下一个方格
                # '''''''''''''''''''''''''''''''''''''''''''''''''

                self.sudokuMap[cStack['x']][cStack['y']] = cStack['value']
                stacks.append(self.getNextPoint())
            else:
                # '''''''''''''''''''''''''''''''''''''''''''''''''
                #  * 如果校验不通过
                #  * 将当前方格的测试数据清空
                #  *
                #  * 在当前格子进行测试别的值
                #  * 从1到9依次测试
                #  * 如果全部失败
                #  * 回溯到上一级
                #  *
                # '''''''''''''''''''''''''''''''''''''''''''''''''
                # 'this.sudokuMap[cStack.x][cStack.y] = 0;
                # ' print(stacks);
                self.rollback()


    # '''''''''''''''''''''''''''''''''''''''''''''''''
    #  * 回退
    #  * 取出数组最后一次填入的数据
    #  * 1、如果当前位置是起始位置
    #  * 并且值小于9
    #  * 直接给这个值+1，并且推进堆栈数组中
    #  * 2、如果不是起始位置
    #  *  2.1 判定数值是否小于9，如果小于9直接进行+1并且推入堆栈进行计算
    #  *  2.2 如果已经是9了，等于说这个格子填写任何数都不合适，所以需要继续回溯到上一个步骤
    # '''''''''''''''''''''''''''''''''''''''''''''''''
    def rollback(self):

        currentStack = self.stacks.pop()


        self.sudokuMap[currentStack['x']][currentStack['y']] = 0

        cOrder = self.orders[self.currentOrder]

        if currentStack['value'] == cOrder['value'][len(cOrder['value'])-1]:
            self.currentOrder = self.currentOrder-1
            self.rollback()
        else:
            orderIndex = cOrder['value'].index(currentStack['value'])
            currentStack['value'] = cOrder['value'][orderIndex+1]
            self.stacks.append(currentStack)

    # '''''''''''''''''''''''''''''''''''''''''''''''''
    #  * 判断填入的数值是否满足数独规则
    #  * 1、横向扫描，当前填入的数字是否有重复
    #  * 2、纵向扫描，当前填入的数字是否有重复
    #  * 3、扫描当前格子所在的3X3的小格子中是否有重复数字
    # '''''''''''''''''''''''''''''''''''''''''''''''''
    def testRules(self, stack):
        x = stack['x']
        y = stack['y']
        val = stack['value']
        ret = True

        found = False
        for i in range(0, 9):
            self.allTimes = self.allTimes + 1
            node = self.sudokuMap[i][y]
            if node == val:
                self.testRuleTimes['fail'] = self.testRuleTimes['fail'] + 1
                return False


        for j in range(0, 9):
            self.allTimes = self.allTimes + 1
            node = self.sudokuMap[x][j]
            if node == val:
                self.testRuleTimes['fail'] = self.testRuleTimes['fail'] + 1
                return False

        # ' x为n所在的小九宫格左顶点竖坐标
        startX = int(math.floor(x / 3) * 3)

        # ' y为n所在的小九宫格左顶点横坐标
        startY  = int(math.floor(y / 3) * 3)


        # ' 判断n所在的小九宫格是否合法
        for i in range(startX, startX+3):
            for j in range(startY, startY+3):
                self.allTimes = self.allTimes+1
                node = self.sudokuMap[i][j]
                if node == val:
                    self.testRuleTimes['fail'] = self.testRuleTimes['fail'] + 1
                    return False

        if ret:
            self.testRuleTimes['ok'] = self.testRuleTimes['ok'] + 1
        else:
            self.testRuleTimes['fail'] = self.testRuleTimes['fail'] + 1

        return ret
map = [
    [8,0,0,0,0,0,0,0,0],
    [0,0,3,6,0,0,0,0,0],
    [0,7,0,0,9,0,2,0,0],
    [0,5,0,0,0,7,0,0,0],
    [0,0,0,0,4,5,7,0,0],
    [0,0,0,1,0,0,0,3,0],
    [0,0,1,0,0,0,0,6,8],
    [0,0,8,5,0,0,0,1,0],
    [0,9,0,0,0,0,4,0,0]
]
sdk = Sudoku(False, [
    [8,0,0,0,0,0,0,0,0],
    [0,0,3,6,0,0,0,0,0],
    [0,7,0,0,9,0,2,0,0],
    [0,5,0,0,0,7,0,0,0],
    [0,0,0,0,4,5,7,0,0],
    [0,0,0,1,0,0,0,3,0],
    [0,0,1,0,0,0,0,6,8],
    [0,0,8,5,0,0,0,1,0],
    [0,9,0,0,0,0,4,0,0]
])

pprint.pprint(map)

#
#
# def print_map() :
#     pprint.pprint(sdk.sudokuMap)
#     pprint.pprint(sdk.stacks)
#     global timer  #定义变量
#     timer = threading.Timer(10,print_map)   #60秒调用一次函数
#     #定时器构造函数主要有2个参数，第一个参数为时间，第二个参数为函数名
#
#     timer.start()    #启用定时器
#
#
# timer = threading.Timer(10,print_map)  #首次启动
# timer.start()

sdk.start()
