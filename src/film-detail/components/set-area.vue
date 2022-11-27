<template>
    <div class="w-full h-full bg-gray-bg">
        <!-- 高度为行数 * （每行高度 + 每行margin-top）+ 58（58是顶部厅名和荧幕中央的高度） -->
        <movable-area :style="{ height: (seatRow * (seatSize + 5)) + 58 + 'px' }" class="fixed left-0 t-132px w-100vw">
            <movable-view class="w-full h-full" :inertia="true" :scale="true" :scale-min="0.5" :scale-max="4"
                direction="all" @change="onMove" @scale="onScale">
                <div class="Stage flex justify-center items-center text-11px text-gray-333">
                    {{ hallTitle }}
                </div>
                <div class="flex justify-center items-center pt-24px">
                    <span
                        class="b-1 rounded-5px inline-block text-10px text-gray-999 h-15px px-20px leading-15px">荧幕中央</span>
                </div>
                <!-- 中心线条 -->
                <div class="absolute pa-v-2 b-d-1 top-60px w-0px" :style="{ height: seatRow * (5 + seatSize) + 'px' }">
                </div>
                <div v-for="(item, index) in seatArray" :key="index" class="flex justify-center mt-5px text-0px"
                    :style="'width:' + boxWidth + 'px;height:' + seatSize + 'px'">
                    <div v-for="(seat, col) in item" :key="col" class="inline-block"
                        :style="{ width: seatSize + 'px', height: seatSize + 'px', opacity: seat.active ? 1 : 0.25 }"
                        @click="handleChooseSeat(index, col)">
                        <!-- Status为-10，不做座位展示 -->
                        <template v-if="seat.status !== -10">
                            <!-- 座位当前已选中的状态 或者 被他人选中占用的状态（此时图片一样，放在一起判断，通过状态区分颜色） -->
                            <template v-if="seat.status === 10 || seat.status === 1">
                                <!-- 座位选中，并且是情侣座-左 -->
                                <div class="w-full h-full" v-if="seat.links && seat.LinkDir === 'L'"
                                    :style="{ background: seat.status === 10 ? '#2BC881' : '#E3E3E3' }">
                                    <image class="w-full h-full" src="../static/seat-qinglv1-sel@10.png"
                                        mode="aspectFit">
                                    </image>
                                </div>
                                <!-- 座位选中，并且是情侣座-右 -->
                                <div class="w-full h-full" v-else-if="seat.links && seat.LinkDir === 'R'"
                                    :style="{ background: seat.status === 10 ? '#2BC881' : '#E3E3E3' }">
                                    <image class="w-full h-full" src="../static/seat-qinglv2-sel@10.png"
                                        mode="aspectFit">
                                    </image>
                                </div>
                                <div class="w-full h-full" v-else
                                    :style="{ background: seat.status === 10 ? '#2BC881' : '#E3E3E3' }">
                                    <image class="w-full h-full" src="../static/seat-sel@10.png" mode="aspectFit">
                                    </image>
                                </div>
                            </template>

                            <!-- 除了以上情况，以下Status === 0是可选且还未选的座位 -->
                            <template v-else-if="seat.status === 0">
                                <!-- 座位可选，并且是情侣座-左 -->
                                <div class="w-full h-full" v-if="seat.links && seat.LinkDir === 'L'"
                                    :style="{ background: '#FA6400' }">
                                    <image class="w-full h-full" src="../static/seat-qinglv1-nor@10.png"
                                        mode="aspectFit">
                                    </image>
                                </div>
                                <!-- 座位可选，并且是情侣座-右 -->
                                <div class="w-full h-full" v-else-if="seat.links && seat.LinkDir === 'R'"
                                    :style="{ background: '#FA6400' }">
                                    <image class="w-full h-full" src="../static/seat-qinglv2-nor@10.png"
                                        mode="aspectFit">
                                    </image>
                                </div>
                                <!-- 座位可选，并且有配置颜色则用颜色座位 -->
                                <div class="w-full h-full" v-else :style="{ background: seat.color || '#B4CCBD' }">
                                    <image class="w-full h-full" src="../static/seat.png" mode="aspectFit">
                                    </image>
                                </div>
                            </template>
                        </template>
                    </div>
                </div>
                <!-- 左侧排数提示 -->
                <div class="fixed bg-line rounded-15px overflow-hidden top-58px px-2px"
                    :style="'left: ' + (10 - moveX / scale) + 'px;'">
                    <div class="w-full flex items-center justify-center text-10px text-white mt-5px"
                        :style="'height:' + seatSize + 'px;'" v-for="(m, mindex) in mArr" :key="mindex">
                        {{ m }}</div>
                    <div :style="'height: 5px;'"></div>
                </div>
            </movable-view>
        </movable-area>
    </div>
</template>
<script>

/*
 *特别声明：
 * 该页面的逻辑及思路来自作者[houzisbw](https://github.com/houzisbw)的vue选座项目github地址[点击](https://github.com/houzisbw/MeiTuanCinemaSmartChoose)。
 * 这里只针对uni-app做了样式及逻辑适配。
 */

export default {
    data() {
        return {
            scaleMin: 1,//h5端为解决1无法缩小问题，设为0.95
            boxWidth: 400, //屏幕宽度px
            space: ' ', //空格
            seatArray: [], //影院座位的二维数组,-10为非座位，0为未购可选座位，10为当前已选座位, 1为已被他人占用座位,一维行，二维列
            seatRow: 0, //影院座位行数
            seatCol: 0, //影院座位列数
            seatSize: 0, //座位尺寸
            SelectNum: 0, //选择座位数
            moveX: 0, //水平移动偏移量
            scale: 1, //放大倍数
            minRow: 0, //从第几行开始排座位
            minCol: 0, //从第几列开始排座位
            showTis: true, //显示选座提示
            seatList: [], //接口获取的原始位置
            mArr: [], //排数提示
            optArr: [], //选中的座位数组。
            isWXAPP: false,
        };
    },
    props: {
        hallTitle: String,
        mapData: {
            type: Array,
            default: () => []
        },
        maxSelect: {
            type: Number,
            default: 0
        }
    },
    computed: {
        aPrice() {
            return this.SelectNum * 36
        },
        rpxNum() {
            return this.boxWidth / 750
        },
        pxNum() {
            return 750 / this.boxWidth
        },
    },
    created() {
        //获取宽度
        uni.getSystemInfo({
            success: (e) => {
                this.boxWidth = e.screenWidth
                this.initData()
            }
        })
    },
    methods: {
        initData: function () {
            let arr = this.mapData;
            //假数据说明：SeatCode座位编号，RowNum-行号，ColumnNum-纵号，YCoord-Y坐标，XCoord-X坐标，Status-状态
            let row = 0
            let col = 0
            let minCol = parseInt(arr[0].XCoord)
            let minRow = parseInt(arr[0].YCoord)
            for (let i of arr) {
                minRow = parseInt(i.YCoord) < minRow ? parseInt(i.YCoord) : minRow
                minCol = parseInt(i.XCoord) < minCol ? parseInt(i.XCoord) : minCol
                row = parseInt(i.YCoord) > row ? parseInt(i.YCoord) : row
                col = parseInt(i.XCoord) > col ? parseInt(i.XCoord) : col
            }
            this.seatList = arr
            this.seatRow = row - minRow + 1
            this.seatCol = col - minCol + 3
            this.minRow = minRow
            this.minCol = minCol - 1
            this.initSeatArray()
        },
        //初始座位数组
        initSeatArray: function () {
            let seatArray = Array(this.seatRow).fill(0).map(() => Array(this.seatCol).fill({
                status: -10,  // 默认为无座位，当status为-10时，不会渲染座位
            }));
            this.seatArray = seatArray;
            this.seatSize = this.boxWidth > 0 ?
                parseInt(parseInt(this.boxWidth, 10) / (this.seatCol + 1), 10) :
                parseInt(parseInt(414, 10) / (this.seatCol + 1), 10)
            this.initNonSeatPlace();
            this.initLove();
        },
        initLove() {
            this.seatArray.forEach(el => {
                for (let index = 0; index < el.length; index++) {
                    const element = el[index];
                    if (element.links && !element.linkId) {
                        // 把当前跟接下来的情侣座的linkId设置成一样。
                        element.linkId = element.seatCode;
                        el[index + 1].linkId = element.seatCode;
                        // 设置当前跟接下来的情侣座的方向，用来区分图片展示
                        element.LinkDir = 'L';
                        el[index + 1].LinkDir = 'R';
                        index++;
                    }
                }
            })
        },
        // 对当前分区做高亮处理
        changeActivePart(part) {
            this.seatArray.forEach(row => {
                row.forEach(seat => {
                    if (!part || !part.id) {
                        seat.active = true;
                    } else {
                        if (seat.part_id === part.id) {
                            seat.active = true;
                        } else {
                            seat.active = false;
                        }
                    }
                })
            });
            this.seatArray = [...this.seatArray]
        },
        //初始化是座位的地方
        initNonSeatPlace: function () {
            let seat = this.seatList.slice()
            let arr = this.seatArray.slice()
            for (let num in seat) {
                // 这里给有座位的地方覆盖数据，没有座位的地方则是上方的Status: -10，控制了座位的展示
                arr[parseInt(seat[num].YCoord) - this.minRow][parseInt(seat[num].XCoord) - this.minCol] = {
                    ...seat[num]
                }
            }
            this.seatArray = arr.slice();
            let mArr = []
            for (let i in arr) {
                let m = ''
                for (let n of arr[i]) {
                    if (n.seatCode) {
                        m = n.RowNum
                    }
                }
                if (m) {
                    mArr.push(m)
                } else {
                    mArr.push('')
                }
            }
            this.mArr = mArr
        },
        //放大缩小事件
        onScale: function (e) {
            this.showTis = false
            // this.moveX=-e.detail.x
            let w = this.boxWidth * 0.5
            let s = 1 - e.detail.scale
            this.moveX = w * s
            this.scale = e.detail.scale
            if (s > 0 || s === 0) {
                this.showTis = true
            }
        },
        //移动事件
        onMove: function (e) {
            this.showTis = false
            this.moveX = e.detail.x
        },
        //处理座位选择逻辑
        handleChooseSeat: function (row, col, loveFlag) {
            if (!this.seatArray[row][col]) {
                return;
            }
            let seatValue = this.seatArray[row][col].status;
            let newArray = this.seatArray;

            //如果是已购座位，直接返回(1表示座位已经被他人占用, -10表示无座位)
            if (seatValue == 1 || seatValue === -10) return;

            // 如果是选择情侣座，检查空余可选择数是否大于2
            const isLink = this.seatArray[row][col].links;
            // loveFlag为true的时候不需要检查，否则这个时候10个座位可能占用了9个还剩1个，是能完成本次动作的
            if (!loveFlag && isLink && this.maxSelect - this.SelectNum < 2 && seatValue === 0) {
                uni.showToast({
                    title: `超过最大可选座位数～`,
                    icon: 'none'
                })
                return;
            }
            // 如果超过最大可选座位数还在继续选
            if (this.optArr.length >= this.maxSelect && seatValue === 0) {
                uni.showToast({
                    title: `最多可选${this.maxSelect}个座位喔～`,
                    icon: 'none'
                })
                return;
            }

            //如果是已选座位点击后变未选（10为已选择）
            if (seatValue === 10) {
                newArray[row][col].status = 0; // 0为可选择
                this.SelectNum--
                this.getOptArr(newArray[row][col], 0);
            } else if (seatValue === 0) {
                newArray[row][col].status = 10;
                this.SelectNum++;
                this.getOptArr(newArray[row][col], 10);
            }
            //必须整体更新二维数组，Vue无法检测到数组某一项更新,必须slice复制一个数组才行
            this.seatArray = newArray.slice();

            // 如果是点击情侣座
            if (loveFlag) {   // 只需要找一次情侣座，防止递归调用
                return;
            }
            const linkId = this.seatArray[row][col].linkId;
            if (this.seatArray[row][col].links && linkId) {
                // 通过linkId找到另一个情侣座。
                const love = this.seatArray[row].find(el => el.linkId === linkId && el.seatCode !== this.seatArray[row][col].seatCode);
                this.handleChooseSeat(row, love.XCoord, true);
            }
        },
        //处理已选座位数组
        getOptArr: function (item, status) {
            let optArr = this.optArr;
            if (status === 10) {
                optArr.push(item);
            } else if (status === 0) {
                let arr = [];
                optArr.forEach(v => {
                    if (v.seatCode !== item.seatCode) {
                        arr.push(v);
                    }
                })
                optArr = arr;
            }
            this.optArr = optArr.slice();
            this.$emit('seatChange', this.optArr.slice());
        },
        // 删除已选中的座位
        deleteSeat(item) {
            this.handleChooseSeat(item.YCoord - 1, item.XCoord);
        },




        //选定且购买座位（暂时没用）
        buySeat: function () {
            if (this.SelectNum === 0) {
                return
            }
            let oldArray = [];
            for (let i = 0; i < this.seatRow; i++) {
                for (let j = 0; j < this.seatCol; j++) {
                    if (this.seatArray[i][j].status === 10) {
                        oldArray.push(this.seatArray[i][j].seatCode)
                    }
                }
            }
        },



        /**
         * 
         * 以下为智能快速选座，暂时没用，方法先保留---------------------分割线----------------------------
         */



        //推荐选座,参数是推荐座位数目，（暂时没用，保留方法）
        smartChoose: function (num) {
            // 先重置
            this.resetSeat()
            //找到影院座位水平垂直中间位置的后一排
            let rowStart = parseInt((this.seatRow - 1) / 2, 10) + 1;
            //先从中间排往后排搜索
            let backResult = this.searchSeatByDirection(rowStart, this.seatRow - 1, num);
            if (backResult.length > 0) {
                this.chooseSeat(backResult);
                this.SelectNum += num
                return
            }
            //再从中间排往前排搜索
            let forwardResult = this.searchSeatByDirection(rowStart - 1, 0, num);
            if (forwardResult.length > 0) {
                this.chooseSeat(forwardResult);
                this.SelectNum += num
                return
            }
            //提示用户无合法位置可选
            uni.showToast({
                title: "无合法位置可选",
                icon: 'none'
            })
        },
        //重置座位
        resetSeat: function () {
            this.SelectNum = 0
            this.optArr = []
            //将所有已选座位的值变为0
            let oldArray = this.seatArray.slice();
            for (let i = 0; i < this.seatRow; i++) {
                for (let j = 0; j < this.seatCol; j++) {
                    if (oldArray[i][j].status === 10) {
                        oldArray[i][j].status = 0
                    }
                }
            }
            this.seatArray = oldArray;
        },
        //搜索函数,参数:fromRow起始行，toRow终止行,num推荐座位数
        searchSeatByDirection: function (fromRow, toRow, num) {
            /*
             * 推荐座位规则
             * (1)初始状态从座位行数的一半处的后一排的中间开始向左右分别搜索，取离中间最近的，如果满足条件，
             *    记录下该结果离座位中轴线的距离，后排搜索完成后取距离最小的那个结果座位最终结果，优先向后排进行搜索，
             *    后排都没有才往前排搜，前排逻辑同上
             *
             * (2)只考虑并排且连续的座位，不能不在一排或者一排中间有分隔
             *
             * */

            /*
             * 保存当前方向搜索结果的数组,元素是对象,result是结果数组，offset代表与中轴线的偏移距离
             * {
             *   result:Array([x,y])
             *   offset:Number
             * }
             *
             */
            let currentDirectionSearchResult = [];

            let largeRow = fromRow > toRow ? fromRow : toRow,
                smallRow = fromRow > toRow ? toRow : fromRow;

            for (let i = smallRow; i <= largeRow; i++) {
                //每一排的搜索,找出该排里中轴线最近的一组座位
                let tempRowResult = [],
                    minDistanceToMidLine = Infinity;
                for (let j = 0; j <= this.seatCol - num; j++) {
                    //如果有合法位置
                    if (this.checkRowSeatContinusAndEmpty(i, j, j + num - 1)) {
                        //计算该组位置距离中轴线的距离:该组位置的中间位置到中轴线的距离
                        let resultMidPos = parseInt((j + num / 2), 10);
                        let distance = Math.abs(parseInt(this.seatCol / 2) - resultMidPos);
                        //如果距离较短则更新
                        if (distance < minDistanceToMidLine) {
                            minDistanceToMidLine = distance;
                            //该行的最终结果
                            tempRowResult = this.generateRowResult(i, j, j + num - 1)
                        }
                    }
                }
                //保存该行的最终结果
                currentDirectionSearchResult.push({
                    result: tempRowResult,
                    offset: minDistanceToMidLine
                })
            }

            //处理后排的搜索结果:找到距离中轴线最短的一个
            //注意这里的逻辑需要区分前后排，对于后排是从前往后，前排则是从后往前找
            let isBackDir = fromRow < toRow;
            let finalReuslt = [],
                minDistanceToMid = Infinity;
            if (isBackDir) {
                //后排情况,从前往后
                currentDirectionSearchResult.forEach((item) => {
                    if (item.offset < minDistanceToMid) {
                        finalReuslt = item.result;
                        minDistanceToMid = item.offset;
                    }
                });
            } else {
                //前排情况，从后往前找
                currentDirectionSearchResult.reverse().forEach((item) => {
                    if (item.offset < minDistanceToMid) {
                        finalReuslt = item.result;
                        minDistanceToMid = item.offset;
                    }
                })
            }
            //直接返回结果
            return finalReuslt
        },
        /*辅助函数，判断每一行座位从i列到j列是否全部空余且连续
         *
         */
        checkRowSeatContinusAndEmpty: function (rowNum, startPos, endPos) {
            let isValid = true;
            for (let i = startPos; i <= endPos; i++) {
                if (this.seatArray[rowNum][i].status !== 0) {
                    isValid = false;
                    break;
                }
            }
            return isValid
        },
        //辅助函数：返回每一行的某个合理位置的座位数组
        generateRowResult: function (row, startPos, endPos) {
            let result = [];
            for (let i = startPos; i <= endPos; i++) {
                result.push([row, i])
            }
            return result
        },
        //辅助函数:智能推荐的选座操作
        chooseSeat: function (result) {
            let opt = this.optArr
            let oldArray = this.seatArray.slice();
            for (let i = 0; i < result.length; i++) {
                //选定座位
                oldArray[result[i][0]][result[i][1]].status = 10
                this.optArr.push(oldArray[result[i][0]][result[i][1]])
            }
            this.seatArray = oldArray;
        },
    }
}
</script>

<style lang="scss" scoped>
.pa-v-2 {
    /* 定位垂直对齐 */
    left: 50%;
    transform: translateX(-50%)
}

.b-d-1 {
    border: 1px dashed #ddd;
}

.b-1 {
    border: 1px solid #CCCCCC;
}

.br-5 {
    border-radius: 5rpx;
}

.Stage {
    background-color: #dddddd;
    width: 380rpx;
    height: 17px;
    transform: perspective(34rpx) rotateX(-10deg);
    margin: 0 auto;
}

.bg-line {
    background-color: rgba(0, 0, 0, 0.3);
}
</style>
