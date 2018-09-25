let sign = false;

/* 创建数独矩阵 */
let num = [
    [0 , 0 ,0 , 0 ,0, 0 ,  2 , 0 , 0 ,],
    [0 ,  9 , 8 , 0 ,0, 0 ,  4 , 0 , 0 ,],
    [ 4 , 0 ,0 , 0 , 2, 0 ,  3 , 0 , 0 ,],
    [0 ,  4 ,0 ,  9 ,0, 0 , 0 , 0 ,  6 ,],
    [ 5 , 0 ,0 ,  1 ,0, 0 ,  7 ,  3 , 0 ,],
    [0 , 0 ,0 , 0 ,0,  6 , 0 ,  5 , 0 ,],
    [ 9 ,  8 , 4 , 0 ,0,  1 ,  6 , 0 , 0 ,],
    [0 , 0 ,0 , 0 ,0,  4 , 0 , 0 ,  3 ,],
    [0 ,  2 ,0 , 0 , 9, 0 ,  1 , 0 , 0 ,],
];

/* 主函数 */
function main()
{
    console.time("start");
    DFS(0);
    console.timeEnd("start");
    Output();
}

/* 输出数独矩阵 */
function Output()
{
    console.log(num);
}

/* 判断key填入n时是否满足条件 */
function Check(n, key)
{
    /* 判断n所在横列是否合法 */
    for (let i = 0; i < 9; i++)
    {
        /* j为n竖坐标 */
        let j = Math.floor(n / 9);
        if (num[j][i] == key) return false;
    }

    /* 判断n所在竖列是否合法 */
    for (let i = 0; i < 9; i++)
    {
        /* j为n横坐标 */
        let j = n % 9;
        if (num[i][j] == key) return false;
    }

    /* x为n所在的小九宫格左顶点竖坐标 */
    let x = Math.floor(n / 9 / 3 * 3);

    /* y为n所在的小九宫格左顶点横坐标 */
    let y = Math.floor(n % 9 / 3 * 3);

    // 3X3 方格查找
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            this.allTimes++;
            if (
                i >= Math.floor(x / 3) * 3
                && i < (Math.floor(x / 3) * 3 + 3)
                && j >= Math.floor(y / 3) * 3
                && j < (Math.floor(y / 3) * 3 + 3)
            ) {
                if (num[i][j] == key) return false;
            }
        }
    }

    /* 全部合法，返回正确 */
    return true;
}

/* 深搜构造数独 */
function DFS(n)
{
    /* 所有的都符合，退出递归 */
    if (n > 80)
    {
        sign = true;
        return 0;
    }
    /* 当前位不为空时跳过 */
    if (num[Math.floor(n/9)][n%9] != 0)
    {
        DFS(n+1);
    }
    else
    {
        /* 否则对当前位进行枚举测试 */
        for (let i = 1; i <= 9; i++)
        {
            /* 满足条件时填入数字 */
            if (Check(n, i) == true)
            {
                num[Math.floor(n/9)][n%9] = i;
                /* 继续搜索 */
                DFS(n+1);
                /* 返回时如果构造成功，则直接退出 */
                if (sign == true) return 0;
                /* 如果构造不成功，还原当前位 */
                num[Math.floor(n/9)][n%9] = 0;
            }
        }
    }
}


main()
