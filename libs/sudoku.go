package main

import (
	"fmt"
	"math"
	"time"
)

type sArray struct {
	x     int
	y     int
	elems []int
}

type Point struct {
	x     int
	y     int
	value int
}

var dataMap = [9][9]int{{8, 0, 0, 0, 0, 0, 0, 0, 0}, {0, 0, 3, 6, 0, 0, 0, 0, 0}, {0, 7, 0, 0, 9, 0, 2, 0, 0}, {0, 5, 0, 0, 0, 7, 0, 0, 0}, {0, 0, 0, 0, 4, 5, 7, 0, 0}, {0, 0, 0, 1, 0, 0, 0, 3, 0}, {0, 0, 1, 0, 0, 0, 0, 6, 8}, {0, 0, 8, 5, 0, 0, 0, 1, 0}, {0, 9, 0, 0, 0, 0, 4, 0, 0}}
var cmap = make(map[string]sArray)

var orders = []sArray{}

var stacks = []Point{}

var currentOrder = 0

var resolved = false

func initOrders() {
	for i := 0; i < 9; i++ {
		for j := 0; j < 9; j++ {
			node := dataMap[i][j]
			if node == 0 {
				orders = append(orders, sArray{i, j, testMayFill(i, j)})
			}
		}
	}

	fmt.Println(orders)
}

func getFirstPoint() Point {
	return Point{orders[0].x, orders[0].y, orders[0].elems[0]}
}

func getNextPoint() Point {

	currentOrder++
	if currentOrder >= len(orders) {
		resolved = true
		return Point{-1, -1, 1}
	}

	nextValue := orders[currentOrder]

	return Point{nextValue.x, nextValue.y, nextValue.elems[0]}
}

func start() {
	stacks = append(stacks, getFirstPoint())

	for {
		if resolved == true {
			fmt.Println("all is over")
			sPrint()
			break
		}

		cStack := stacks[len(stacks)-1]
		if cStack.x == -1 && cStack.y == -1 {
			fmt.Println("over")
			sPrint()
			break
		}
		valid := testRules(cStack)

		if valid {
			dataMap[cStack.x][cStack.y] = cStack.value
			stacks = append(stacks, getNextPoint())
		} else {
			rollback()
		}
	}

}

func testRules(cStack Point) bool {
	ret := true
	x := cStack.x
	y := cStack.y
	val := cStack.value

	for i := 0; i < 9; i++ {
		node := dataMap[i][y]
		if node == val {
			return false
		}
	}

	for j := 0; j < 9; j++ {
		node := dataMap[x][j]
		if node == val {
			return false
		}
	}

	startX := int(math.Floor(float64(x)/3) * 3)
	startY := int(math.Floor(float64(y)/3) * 3)

	for i := startX; i < startX+3; i++ {
		for j := startY; j < startY+3; j++ {
			node := dataMap[i][j]
			if node == val {
				return false
			}
		}
	}

	return ret

}

func rollback() {
	// 类似pop方法
	currentStack := stacks[len(stacks)-1]
	stacks = removePoint(stacks, len(stacks)-1)
	dataMap[currentStack.x][currentStack.y] = 0
	cOrder := orders[currentOrder]

	if currentStack.value == cOrder.elems[len(cOrder.elems)-1] {
		currentOrder--
		rollback()
	} else {
		var orderIndex int
		for k, v := range cOrder.elems {
			if v == currentStack.value {
				orderIndex = k
				break
			}
		}
		currentStack.value = cOrder.elems[orderIndex+1]
		stacks = append(stacks, currentStack)
	}
}

func removePoint(slice []Point, index int) []Point {
	copy(slice[index:], slice[index+1:])
	return slice[:len(slice)-1]
}

func remove(slice []int, index int) []int {
	copy(slice[index:], slice[index+1:])
	return slice[:len(slice)-1]
}

func testMayFill(x int, y int) (ret []int) {
	mayFillNumber := []int{1, 2, 3, 4, 5, 6, 7, 8, 9}
	for i := 0; i < 9; i++ {
		node := dataMap[i][y]
		for index, v := range mayFillNumber {
			if v == node {
				mayFillNumber = remove(mayFillNumber, index)
				break
			}
		}
	}

	for j := 0; j < 9; j++ {
		node := dataMap[x][j]
		for index, v := range mayFillNumber {
			if v == node {
				mayFillNumber = remove(mayFillNumber, index)
				break
			}
		}
	}

	startX := int(math.Floor(float64(x)/3) * 3)
	startY := int(math.Floor(float64(y)/3) * 3)

	for i := startX; i < startX+3; i++ {
		for j := startY; j < startY+3; j++ {
			node := dataMap[i][j]
			for index, v := range mayFillNumber {
				if v == node {
					mayFillNumber = remove(mayFillNumber, index)
					break
				}
			}
		}
	}

	return mayFillNumber
}

func sPrint() {
	for _, v := range dataMap {
		for _, _v := range v {
			fmt.Print(_v, " ")
		}
		fmt.Println("")
	}
}

func main() {
	startTime := time.Now().UnixNano() / 1e6
	sPrint()
	initOrders()
	start()
	endTime := time.Now().UnixNano() / 1e6
	fmt.Println("消耗时间", endTime-startTime, "ms")
	// fmt.Println("map is", dataMap)
}
