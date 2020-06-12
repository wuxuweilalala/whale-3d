<template>
    <div class="edit2" @click="clearActive('all')" @mousedown="editMouseEvent">
        <div class="sidebar">
            <div class="backBtn" @click.stop="addActive($event, 'backBtnActive')" ref="backBtn"></div>
            <div class="help" @click.stop="addActive($event, 'helpActive')" ref="help"></div>
        </div>

        <!-- 模型库 -->
        <div class="modelBase">
            <div class="modelBaseTitle">
                <div class="modelBoxIcon"></div>
                <span>模型库</span>
            </div>
            <div class="modelBaseContent">
                <div v-for="(item, index) in modelBaseList" :key="index" class="modelBox"
                     @click.stop="modelBox(index, 'modelBoxBg')">
                    <div
                            class="model"
                            :imgName="modelBaseList"
                            @mousedown="mouseDownEvent"
                            :draggable="draggable"
                            @dragstart="modelDragstartEvent($event, item)"
                            @drag="modelDragEvent"
                            @dragend="modelDragendEvent"
                            :class="{ [item.bg]: true }"
                            ref="modelBoxC"
                    ></div>
                    <div class="modelTitle">{{ item.name }}</div>
                </div>
            </div>
        </div>

        <!-- 楼层 -->
        <div class="floor">
            <div class="floorTitle">
                <div class="floorTitleLeft">
                    <div style="height: 1.6vh;font-size: 1.7vh;line-height: 2.2vh;;margin: 0.5vw;flex-shrink: 0;">
                        楼层
                        <!-- width: 1.9vw -->
                    </div>
                    <div
                            v-for="(item, index) in floorList"
                            :key="index"
                            class="everyFloor"
                            :class="{ thisFloor: index == thisFloorIndex }"
                            @click="chooseFloor(index)"
                            ref="chooseFloor"
                    >
                        <div>{{ item.floorName }}</div>
                        <!-- 删除楼层 -->
                        <!-- <div @click.stop="delFloor(index)" class="closeIcon"></div> -->
                    </div>
                    <!-- 添加楼层 -->
                    <!-- <div
                            class="addFloor"
                            @click.stop="
							addFloor(thisFloorIndex);
							addActive($event, 'addFloorActive');
						"
                            ref="addFloor"
                    ></div> -->
                </div>
                <div class="floorTitleRight">
                    <!-- <div>场地大小</div>
                    <input type="text" class="inputLeft" placeholder="5000"/>
                    <div class="closeIcon"></div>
                    <input type="text" class="inputRight" placeholder="5000"/>
                    <div>m</div> -->
                </div>
            </div>
            <div class="edit-content">

                <template v-for="(itemfloor, indexfloor) in floorList">
                    <div
                            :key="indexfloor"
                            v-show="indexfloor == thisFloorIndex"
                            class="floorContent"
                            id="workPlace"
                            @dragover.stop="workDragoverEvent"
                            @drop.stop="workDropEvent"
                            ref="workPlace"
                    >
                        <canvas class="class-workPlace" width="2584" height="2000" ref="refWorkPlace"></canvas>
                        <!-- 组件 -->
                        <template v-for="(item, index) in itemfloor.componentList">
                            <!-- 默认第一项 -->
                            <div v-if="itemfloor.unitList[clickIndex].unitId == item.unitId" :key="index"
                                 ref="allComponents" style="position: relative;width: 200%;height: 100%;">
                                <div
                                        v-for="(itemChild, indexChild) in item.itemList"
                                        :is="itemChild.name"
                                        :item="itemChild"
                                        :key="indexChild"
                                        @click.native="changeChildIndex(indexChild, index)"
                                ></div>
                            </div>
                        </template>

                        <div class="operationBorad">
                            <!-- 处理事件冒泡 -->
                            <div
                                    class="operationBoradLeft"
                                    @click.stop="
									addActive($event, 'operationBoradLRBorderActive');
									calibration();
								"
                                    @mouseup.stop="function(){}"
                                    @mousedown.stop="function(){}"
                            >
                                <div class="operationBoradLeftIcon"></div>
                                <div class="operationBoradLeftText">校准</div>
                                <div style="position: absolute;width: 100%; height: 100%;"
                                     ref="operationBoradLRBorderActive1"></div>
                            </div>
                            <!-- 处理事件冒泡 -->
                            <div
                                    class="operationBoradRight"
                                    @click.stop="
									addActive($event, 'operationBoradLRBorderActive');
									generate();
								"
                                    @mouseup.stop="function(){}"
                                    @mousedown.stop="function(){}"
                            >
                                <div class="operationBoradRightIcon"></div>
                                <div class="operationBoradRightText">生成</div>
                                <div style="position: absolute;width: 100%; height: 100%;"
                                     ref="operationBoradLRBorderActive2"></div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- 图层 -->
        <div class="layer">
            <div class="layerTitle">
                <div class="layerTitleIcon"></div>
                图层
            </div>

            <div class="layerContent">
                <template v-for="(item, index) in floorList[thisFloorIndex].unitList">
                    <div v-if="unitList.length != 0" :key="index" @click.stop="showData(item.infoList, index)"
                         class="unitTitle">
                        <div :class="{ 'border-style': index == clickIndex }" class="list-item">
                            <span style="font-size: 1vw; width: 1.5vw; height: 1.5vw;;display: inline-block;"
                                  ref="rorateIcon" class="collectIcon"></span>
                            <span style="line-height: 3.7vh;">{{ item.unit }}</span>
                        </div>
                        <div ref="unitList" style="display: none;">
                            <div
                                    v-for="(childItem, childIndex) in item.infoList"
                                    :key="childIndex"
                                    class="uniList"
                                    @click.stop="childOpenIcon($event, childIndex, index)"
                                    :ref="'rorateChildIcon' + index + '-' + childIndex"
                            >
                                {{ childItem }}
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <div :class="posContent">
                <div class="posHeader">
                    <span class="posIcon"></span>
                    <span>属性</span>
                </div>
                <div class="posMain">
                    <div class="mainTop">
                        X:<input class="classInput" v-model="posLeft" @blur="inputBlurEvent" name="left" type="text" placeholder="距离左边的位置">
                        Y:<input class="classInput" v-model="posTop" @blur="inputBlurEvent" name="top" type="text" placeholder="距离上边的位置">
                    </div>
                    <div class="mainBottom" v-show="numShow">
                        {{ elementName }}:<input class="classInput" v-model="posNum" @blur="inputBlurEvent" name="num" type="text" placeholder="请输入数量">
<!--                        Y:<input class="classInput" type="text" placeholder="请输入距离上边的位置">-->
                    </div>
                </div>


            </div>
            <div class="layerFooter">
                <div class="layerFooterBox" ref="layerFooterBox">
                    <div class="bind" @click.stop="addActive($event, 'operation')"></div>
                    <!-- 复制图层 -->
                    <div
                            class="editGround"
                            @click.stop="
							addActive($event, 'operation');
							copyLayer();
						"
                    ></div>
                    <!-- 删除图层 -->
                    <div
                            class="delete"
                            @click.stop="
							addActive($event, 'operation');
							delLayer();
						"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import bzq from './bzq/bzq.vue'; // 播种墙
    import gd from './gd/gd.vue'; // 轨道
    import hj from './hj/hj.vue'; // 货架
    import other from './other/other.vue'; // 其他
    import station from '../../assets/2dEdit/station@2.png'; // 播种墙
    import guidao from '../../assets/2dEdit/guidao@2.png'; // 轨道
    import huojia from '../../assets/2dEdit/huojia@2.png'; // 货架
    import tuiche from '../../assets/2dEdit/tuiche@2.png'; // 推车
    import tuita from '../../assets/2dEdit/tuita@2.png'; // 推塔
    import psb from '../../assets/2dEdit/psb@2.png'; // 推塔
    import fenlianyuan from '../../assets/2dEdit/fenlianyuan@2.png'; // 分练员
    import gongzuozhan from '../../assets/2dEdit/gongzuozhan@2.png';
    import PSBPassageway from '../../assets/2dEdit/PSBPassageway.png';
    import pickingChannel from '../../assets/2dEdit/pickingChannel.png';
    import {mapGetters, mapMutations} from 'vuex'; // 推塔
    export default {
        components: {
            bzq,
            gd,
            hj,
            other
        },
        data() {
            return {
                modelBaseList: [
                    {name: '货架', bg: 'carRack', bgImg: huojia, componentName: 'hj'},
                    {
                        name: '播种墙',
                        bg: 'wall',
                        bgImg: station,
                        componentName: 'bzq',
                        create: true
                    },
                    {name: '轨道', bg: 'rack', bgImg: guidao, componentName: 'gd'},
                    {
                        name: '推车',
                        bg: 'car',
                        bgImg: tuiche,
                        componentName: 'other',
                        width: '1.6vw',
                        height: '3.8vh'
                    },
                    {
                        name: '堆塔',
                        bg: 'box',
                        bgImg: tuita,
                        componentName: 'other',
                        width: '1.4vw',
                        height: '1.9vw'
                    },
                    {
                        name: 'PSB',
                        bg: 'psb',
                        bgImg: psb,
                        componentName: 'other',
                        width: '2vw',
                        height: '1.9vw'
                    },
                    {
                        name: '分拣员',
                        bg: 'people',
                        bgImg: fenlianyuan,
                        componentName: 'other',
                        width: '1.3vw',
                        height: '3.5vh'
                    },
                    {
                        name: '工作站',
                        bg: 'station',
                        bgImg: gongzuozhan,
                        componentName: 'other',
                        width: '2.4vw',
                        height: '3.2vh',
                        create: true
                    },
                    {
                        name: '拣货通道',
                        bg: 'pickingChannel',
                        bgImg: pickingChannel,
                        componentName: 'bzq',
                    },
                    {
                        name: 'pst通道',
                        bg: 'PSBPassageway',
                        bgImg: PSBPassageway,
                        componentName: 'bzq',
                    },
                ],
                floorList: [
                    {
                        floorName: '一层',
                        unitList: [
                            {
                                unit: '单元1',
                                unitId: '1',
                                infoList: []
                            }
                        ],
                        componentList: [
                            {
                                unitId: '1',
                                itemList: []
                            }
                        ] // 所有组件列表
                    },
                    // {
                    //     floorName: '二层',
                    //     unitList: [
                    //         {
                    //             unit: '单元1',
                    //             unitId: '1',
                    //             infoList: []
                    //         }
                    //     ],
                    //     componentList: [
                    //         {
                    //             unitId: '1',
                    //             itemList: []
                    //         }
                    //     ] // 所有组件列表
                    // },
                    // {
                    //     floorName: '三层',
                    //     unitList: [
                    //         {
                    //             unit: '单元1',
                    //             unitId: '1',
                    //             infoList: []
                    //         }
                    //     ],
                    //     componentList: [
                    //         {
                    //             unitId: '1',
                    //             itemList: []
                    //         }
                    //     ] // 所有组件列表
                    // }
                ],
                // 初始化点击的索引
                clickIndex: 0,
                clickChildIndex: 0,
                // 初始化楼层数
                thisFloorIndex: 0,
                // 是否可拖拽
                draggable: false,
                // 相对拖拽元素的位置坐标
                offset: {
                    x: 0,
                    y: 0
                },
                addModule: false, // 拖拽标志
                selectComponent: [],
                mouseX: 0, // 鼠标按下的位置
                mouseY: 0,
                dom1Left: 0, // 原拖拽盒子的相对body距离
                dom1Top: 0,
                dragItem: null,
                drapComponentName: null,
                div: null,
                isMove: false, // 鼠标移动的标志位
                dom2Left: 0, // 原拖拽盒子的相对body距离
                dom2Top: 0,
                startLeft: null, // 记录鼠标开始的位置
                startLeftCopy: null, // 记录鼠标开始的位置
                startTop: null, // 记录鼠标开始的位置
                startTopCopy: null, // 记录鼠标开始的位置
                startRight: null, // 记录鼠标开始的位置
                startBottom: null, // 记录鼠标开始的位置
                divStartLeft: 0,
                divStartTop: 0,
                divOffsetLeft: 0,
                divOffsetTop: 0,
                isDivMove: false,
                divMoveBeforeLeft: 0,
                divMoveBeforeTop: 0,
                selectModuleList: [],
                selectModuleLeftTopList: [],
                elementName: '货架数量',
                numShow: true,
                posContent: {
                    posContent: true,
                    none: true,
                },
                posLeft: '',    // 距离左边的位置
                posTop: '',     // 距离上边的位置
                posNum: '',     // 数量
                selectedElement: null,  // 选中的元素
            };
        },
        mounted() {
            // 初始化默认选择第一个楼层
            this.chooseFloor(0);
            this.remove();
            this.drawGrid();
        },
        computed: {
            ...mapGetters('edit', {
                getZIndex: 'getZIndex',
                getPositions: 'getPositions',
                getTrackWidth: 'getTrackWidth',
                getTrackPos: 'getTrackPos',
                getPsbPos: 'getPsbPos',
                getBoxValue: 'getBoxValue'
            }),
            unitList: {
                get: function () {
                    return this.floorList[this.thisFloorIndex].unitList;
                },
                set: function (newValue) {
                }
            }
        },
        methods: {
            ...mapMutations('edit', {
                setZIndex: 'setZIndex',
                setTrackWidth: 'setTrackWidth',
                setShelve: 'setShelve',
                setBoxValue: 'setBoxValue',
                changeBox: 'changeBox'
            }),
            // 绘制线条
            drawLine(work) {
                let ctx = work.getContext('2d');
                ctx.lineWidth = 0.4
                ctx.strokeStyle = "gray";
                let width = 5000
                let height = 5000
                for (let j = 0; j < 100; j++) {
                    let y = j * 30
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                    ctx.stroke();
                }
                for (let k = 0; k < 100; k++) {
                    let x = k * 30
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, height);
                    ctx.stroke();
                }
            },
            // 绘制网格背景
            drawGrid() {
                let workPlaces = this.$refs.refWorkPlace
                for (let i = 0; i < workPlaces.length; i++) {
                    let work = workPlaces[i]
                    if (work.getContext) {
                        this.drawLine(work)
                    }
                }
            },
            // 选择楼层
            chooseFloor(index) {
                console.log('选择: ', index);
                this.thisFloorIndex = index;
                // 清空, 等待虚拟dom更新为dom
                this.$nextTick(() => {
                    for (let i = 0; i < this.$refs.chooseFloor.length; i++) {
                        this.$refs.chooseFloor[i].style.flexShrink = 1;
                    }
                    // 设置
                    this.$refs.chooseFloor[index].style.flexShrink = 0;
                });
                console.log(this.floorList[this.thisFloorIndex]);

                if (this.div) {
                    for (let i = 0; i < this.$refs.workPlace.length; i++) {
                        try {
                            this.$refs.workPlace[i].removeChild(this.div);
                            this.div = null;
                            this.changeComponentStyle('clear');
                        } catch (error) {
                            console.log('选框以移除');
                        }
                    }
                }
            },
            // 添加楼层
            addFloor(index) {
                console.log(index);
                if (index >= 4) return;
                if(this.floorList.length <= 5) {
                    let length = this.nToc(this.floorList.length + 1);
                    let work1 = this.$refs.refWorkPlace
                    this.log('workd', work1)
                    this.floorList.push({
                        floorName: length + '层',
                        unitList: [
                            {
                                unit: '单元1',
                                unitId: '1',
                                infoList: []
                            }
                        ],
                        componentList: [
                            {
                                unitId: '1',
                                itemList: []
                            }
                        ] // 所有组件列表
                    });
                    // 添加时默认选择最后一个楼层
                    this.thisFloorIndex = this.floorList.length;
                    this.chooseFloor(this.thisFloorIndex - 1);
                    this.$nextTick(() => {
                        let work = this.$refs.refWorkPlace
                        let w = work[work.length - 1]
                        if(w.getContext) {
                            this.drawLine(w)
                        }
                    })
                }
            },
            // n to c
            nToc(num) {
                var arr1 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
                //可继续追加更高位转换值
                var arr2 = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿'];
                if (!num || isNaN(num)) {
                    return '零';
                }
                var english = num.toString().split('');
                var result = '';
                for (var i = 0; i < english.length; i++) {
                    var des_i = english.length - 1 - i; //倒序排列设值
                    result = arr2[i] + result;
                    var arr1_index = english[des_i];
                    result = arr1[arr1_index] + result;
                } //将【零千、零百】换成【零】 【十零】换成【十】
                result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十'); //合并中间多个零为一个零
                result = result.replace(/零+/g, '零'); //将【零亿】换成【亿】【零万】换成【万】
                result = result.replace(/零亿/g, '亿').replace(/零万/g, '万'); //将【亿万】换成【亿】
                result = result.replace(/亿万/g, '亿'); //移除末尾的零
                result = result.replace(/零+$/, ''); //将【零一十】换成【零十】 //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十 //将【一十】换成【十】
                result = result.replace(/^一十/g, '十');
                return result;
            },
            // 删除楼层
            delFloor(num) {
                let index = this.floorList.length - 1;
                this.floorList.splice(index, 1);
                if (index > 0) {
                    this.floorList.forEach((item, index) => {
                    item.floorName = this.nToc(index + 1) + "层";
                    });
                    this.thisFloorIndex = this.floorList.length;
                    this.chooseFloor(this.thisFloorIndex - 1);
                }
            },
            // 添加激活背景
            addActive(e, name) {
                this.clearActive(name);
                console.log(name);
                e.target.classList.add(name);
            },
            // 取消激活的背景
            clearActive(name) {
                try {
                    this.$refs.backBtn.classList.remove('backBtnActive');
                    this.$refs.help.classList.remove('helpActive');
                    this.$refs.addFloor.classList.remove('addFloorActive');
                    let arr = this.$refs.layerFooterBox.children;
                    for (let i = 0; i < arr.length; i++) {
                        arr[i].classList.remove('operation');
                    }
                    let arr2 = this.$refs.modelBoxC;
                    for (let i = 0; i < arr2.length; i++) {
                        arr2[i].classList.remove('modelBoxBg');
                    }
                    this.$refs.operationBoradLRBorderActive1[this.thisFloorIndex].classList.remove('operationBoradLRBorderActive');
                    this.$refs.operationBoradLRBorderActive2[this.thisFloorIndex].classList.remove('operationBoradLRBorderActive');
                } catch (error) {
                    console.log(error);
                }
            },
            // 点击模型添加背景
            modelBox(index, name) {
                this.clearActive(name);
                this.$refs.modelBoxC[index].classList.add(name);
            },
            // 鼠标按下(图标)
            mouseDownEvent(event) {
                this.draggable = true;
            },
            // 拖拽中...(图标)
            modelDragEvent(event) {
                // console.log('拖拽事件', event)
                this.mouseX = event.clientX;
                this.mouseY = event.clientY;
            },
            // 拖拽开始
            modelDragstartEvent(event, item) {
                this.addModule = true;
                this.dragItem = item;
                this.log('this drag item', this.dragItem, event);
                this.dom1Left = 0;
                this.dom1Top = 0;
                this.offset.x = event.offsetX;
                this.offset.y = event.offsetY - 15;
            },
            // 拖拽生成模型
            workDropEvent(event) {
                if (this.addModule) {
                    this.getParentTag(this.$refs.workPlace[this.thisFloorIndex]);
                    let left = event.clientX - this.dom1Left;
                    let top = event.clientY - this.dom1Top;

                    if (this.dragItem.width) {
                        this.floorList[this.thisFloorIndex].componentList[this.clickIndex].itemList.push({
                            name: this.dragItem.componentName,
                            modelName: this.dragItem.name,
                            // left: left,
                            // top: top,
                            // 解决删除布局错乱
                            left: left-this.offset.x,
                            top: top-this.offset.y,
                            bgImg: this.dragItem.bgImg,
                            width: this.dragItem.width,
                            height: this.dragItem.height,
                            offsetParentLeft: this.dom1Left,
                            offsetParentTop: this.dom1Top,
                            offset: {
                                x: this.offset.x,
                                y: this.offset.y
                            },
                            generateModelName: this.dragItem.name
                        });
                    } else {
                        this.floorList[this.thisFloorIndex].componentList[this.clickIndex].itemList.push({
                            name: this.dragItem.componentName,
                            modelName: this.dragItem.name,
                            left: left,
                            top: top,
                            bgImg: this.dragItem.bgImg,
                            offsetParentLeft: this.dom1Left,
                            offsetParentTop: this.dom1Top,
                            offset: {
                                x: this.offset.x,
                                y: this.offset.y
                            },
                            generateModelName: this.dragItem.name
                        });
                    }

                    // 否则就是添加单元的工具
                    this.unitList[this.clickIndex].infoList.push(this.dragItem.name);
                    this.unitList = [...this.unitList];
                }
                console.log(this.floorList)
            },
            // 拖拽结束
            modelDragendEvent(event) {
                this.log('left top ((((', this.getPsbPos)
                let left = this.getPsbPos.left
                let top = this.getPsbPos.top
                this.log('tracks', this.$refs.tracks, event, this.getPsbPos)
                if (this.getPositions.length > 0 && this.dragItem.name === 'PSB') {
                    this.log('psb test', this.dragItem);
                    let width = this.$vwToPx(this.getTrackWidth.width.replace('vw', ''));
                    let widthSplit = this.$vwToPx(parseInt(this.getTrackWidth.width.replace('vw', '')) / this.getTrackWidth.num);
                    let height = this.getPositions[this.getPositions.length - 1].top - this.getPositions[0].top;
                    // let this.getPositions.length
                    this.log('this.getPositions', this.getPositions);
                    let posArray = [];
                    let len = parseInt(this.getPositions.length / 12);
                    let psbWidth = this.$vwToPx(2);
                    let psbHeight = this.$vwToPx(1.9);
                    for (let k = 0; k < len; k++) {
                        let index = k * 12;
                        // let pos = this.getPositions[index];
                        let posLeft = this.getTrackPos.left;
                        let posTop = this.getTrackPos.top;
                        let heightSingle = this.getPositions[index + 1].top - posTop + this.$vhToPx(2.1);
                        this.log('posLeft posTop', posLeft, posTop);
                        let levelPos = -1;
                        let verticalPos = -1;
                        this.log('test ****((((((((', posLeft, left, posTop, top)
                        if (posLeft <= left && left + psbWidth < width + posLeft && posTop <= top && top + psbHeight < posTop + height) {
                            for (let i = 0; i < this.getTrackWidth.num; i++) {
                                let bool = posLeft + widthSplit * i <= left && left + psbWidth <= posLeft + widthSplit * (i + 1);
                                this.log('rows ', posLeft + widthSplit * i, left, left + psbWidth, posLeft + widthSplit * (i + 1))
                                this.log('bool**', bool);
                                if (bool) {
                                    levelPos = i;
                                }
                            }
                            // for (let j = 0; j < 6; j++) {
                            //     let bool = posTop + heightSingle * j <= top && top <= posTop + heightSingle * (j + 1);
                            //     // this.log('bool', posTop + heightSingle * j, top, top + psbHeight, posTop + heightSingle * (j + 1))
                            //     this.log('bool', bool, posTop + heightSingle * j <= top, top <= posTop + heightSingle * (j + 1));
                            //     if (bool) {
                            //         verticalPos = j;
                            //     }
                            // }
                            posArray.push({
                                levelPos,
                                verticalPos,
                                k
                            });
                        }
                    }
                    this.log('posArray', posArray);
                }
                this.log(' drag end')
                this.draggable = false;
                this.addModule = false;
            },
            // 接受拖拽事件
            workDragoverEvent(event) {
                event.preventDefault();
            },
            // 展示图层
            showData(infoList, index) {
                this.clickIndex = index; // 保存点击展示的图层
                // 获取选中的图层显示相应的模型
                // this.selectComponent = this.componentList.slice(this.clickIndex, this.clickIndex+1)
                this.$refs.unitList[index].style.display = this.$refs.unitList[index].style.display == 'none' ? 'block' : 'none';

                if (this.$refs.rorateIcon[index].classList.contains('openIcon')) {
                    this.$refs.rorateIcon[index].classList.remove('openIcon');
                } else {
                    this.$refs.rorateIcon[index].classList.add('openIcon');
                }

                try {
                    this.floorList[this.thisFloorIndex].unitList.forEach((item, index) => {
                        item.infoList.forEach((itemChild, indexChild) => {
                            if (this.$refs[`rorateChildIcon${index}-${indexChild}`][0].classList.contains('border-style')) {
                                this.$refs[`rorateChildIcon${index}-${indexChild}`][0].classList.remove('border-style');
                            }
                        });
                    });
                } catch (error) {
                    console.log('清除图层样式错误');
                }
            },
            // 展示子图层
            childOpenIcon(e, childIndex, index) {
                try {
                    this.floorList[this.thisFloorIndex].unitList.forEach((item, index) => {
                        item.infoList.forEach((itemChild, indexChild) => {
                            if (this.$refs[`rorateChildIcon${index}-${indexChild}`][0].classList.contains('border-style')) {
                                this.$refs[`rorateChildIcon${index}-${indexChild}`][0].classList.remove('border-style');
                            }
                        });
                    });
                } catch (error) {
                    console.log('清除图层样式错误');
                }

                // 修改父级的索引标志, 来显示或隐藏边框
                this.clickIndex = index; // 保存点击的图层
                this.clickChildIndex = childIndex; // 保存点击的子图层
                // 点击的元素添加类名 rorateChildIcon是所有的图层子项, 需要运算
                console.log(this.$refs[`rorateChildIcon${this.clickIndex}-${this.clickChildIndex}`], '===================================================================');
                this.$refs[`rorateChildIcon${this.clickIndex}-${this.clickChildIndex}`][0].classList.add('border-style');
            },
            // 拖拽工作事件
            getParentTag(dom, arg = 'default') {
                // 传入标签是否是DOM对象
                if (!(dom instanceof HTMLElement)) return console.error('receive only HTMLElement');
                // 父级标签是否是body,是着停止返回集合,反之继续
                if (dom.offsetParent !== null) {
                    if (arg == 'default') {
                        console.log(arg);
                        this.dom1Top += dom.offsetTop * 1;
                        this.dom1Left += dom.offsetLeft * 1;
                    } else if (arg == 'dom2') {
                        // console.log(arg);
                        // console.log(dom);
                        this.dom2Top += dom.offsetTop * 1;
                        this.dom2Left += dom.offsetLeft * 1;
                    } else if (arg == 'div') {
                        this.divOffsetLeft += dom.offsetLeft * 1;
                        this.divOffsetTop += dom.offsetTop * 1;
                    }
                    // 再上一层寻找
                    return this.getParentTag(dom.offsetParent, arg);
                }
            },
            // 删除图层
            delLayer() {
                // 更新top， 因为子组件的left不会导致父组件传递的left更新
                let arr2 = Array.from(this.getAllDom())
                this.floorList[this.thisFloorIndex].componentList[this.clickIndex].itemList.forEach((item, index) => {
                    item.left = this.pxToNum(arr2[index].style.left)
                    item.top = this.pxToNum(arr2[index].style.top)
                })

                // ------------------------------------------------------------------------------------------------
                if (this.floorList[this.thisFloorIndex].unitList[this.clickIndex].infoList.lenght != 0) {
                    this.floorList[this.thisFloorIndex].unitList[this.clickIndex].infoList.splice(this.clickChildIndex, 1);
                } else {
                    this.floorList[this.thisFloorIndex].unitList[this.clickIndex].splice(this.clickIndex, 1);
                }
                console.log(this.floorList[this.thisFloorIndex].componentList[this.clickIndex].itemList)
                if (this.floorList[this.thisFloorIndex].componentList[this.clickIndex].itemList != 0) {
                    this.floorList[this.thisFloorIndex].componentList[this.clickIndex].itemList.splice(this.clickChildIndex, 1);
                } else {
                    console.log(this.floorList[this.thisFloorIndex].componentList)
                    // this.floorList[this.thisFloorIndex].componentList[this.clickIndex].splice(this.clickIndex, 1);
                }
            },
            // copy图层
            copyLayer() {
                this.floorList[this.thisFloorIndex].unitList.push({
                    unit: '单元' + (this.floorList[this.thisFloorIndex].unitList.length + 1),
                    unitId: '' + (this.floorList[this.thisFloorIndex].unitList.length + 1),
                    infoList: [...this.floorList[this.thisFloorIndex].unitList[this.clickIndex].infoList]
                });

                this.floorList[this.thisFloorIndex].componentList.push({
                    unitId: '' + this.floorList[this.thisFloorIndex].unitList.length, // 添加id
                    itemList: [...this.floorList[this.thisFloorIndex].componentList[this.clickIndex].itemList] // 添加组件名称
                });
                console.log(this.floorList[this.thisFloorIndex].componentList);
            },
            // 选中子图层
            changeChildIndex(indexChild, index) {
                this.clickChildIndex = indexChild;
                this.clickIndex = index;
                this.childOpenIcon([`rorateChildIcon${this.clickIndex}-${this.clickChildIndex}`][0], indexChild, index);
            },
            // 选中功能
            createDom(e) {
                // 如果有选择框, 鼠标按下操作板就直接让他消失
                // 才操作板里鼠标按下, 没有选择框就创建一个
                if (this.div) {
                    this.$refs.workPlace[this.thisFloorIndex].removeChild(this.div);
                    this.div = null;
                    this.changeComponentStyle('clear');
                } else {
                    this.dom1Left = 0;
                    this.dom1Top = 0;
                    this.getParentTag(this.$refs.workPlace[this.thisFloorIndex]);
                    this.div = document.createElement('div');
                    this.div.className = 'createDom';

                    // 记录div的初始位置值用于限制范围 和 设置它的创始初始位置
                    this.div.style.left = e.clientX - this.dom1Left + 'px';
                    this.div.style.top = e.clientY - this.dom1Top + 'px';

                    // this.div.addEventListener('mousedown', e => {
                    //     this.div.style.cursor = 'move';
                    //     this.divOffsetLeft = 0;
                    //     this.divOffsetTop = 0;
                    //
                    //     this.divMoveBeforeLeft = this.div.style.left;
                    //     this.divMoveBeforeTop = this.div.style.top;
                    //
                    //     e.stopPropagation(); // 取消右键点击默认事件, 阻止冒泡到this.$refs.workPlace触发鼠标按下事件
                    //     this.getParentTag(this.div, 'div');
                    //     this.getParentTag(this.$refs.workPlace[this.thisFloorIndex]); // div移动时必须重新获取, 因为鼠标弹起this.$refs.workPlace清除了dom1Left, dom1Top
                    //     // 获取点击的距离
                    //     this.divStartLeft = e.clientX - this.divOffsetLeft;
                    //     this.divStartTop = e.clientY - this.divOffsetTop;
                    //     this.isDivMove = true;
                    //
                    //     // 框选移动(1): 记录每一个module按下的位置: 用于div框选计算选中移动
                    //     for (let i = 0; i < this.selectModuleList.length; i++) {
                    //         this.selectModuleLeftTopList.push({
                    //             left: this.selectModuleList[i].style.left.replace('px', '') * 1,
                    //             top: this.selectModuleList[i].style.top.replace('px', '') * 1
                    //         });
                    //     }
                    // });
                    // window.addEventListener('mousemove', e => {
                    //     e.stopPropagation(); // 取消右键点击默认事件, 阻止冒泡到this.$refs.workPlace触发鼠标按下事件
                    //     if (!this.isDivMove) return;
                    //
                    //     this.div.style.left = e.clientX - this.dom1Left - this.divStartLeft + 'px';
                    //     this.div.style.top = e.clientY - this.dom1Top - this.divStartTop + 'px';
                    //
                    //     this.moduleMove();
                    //
                    //     // 框选限制
                    //     let divMovePosition = {
                    //         left: e.clientX,
                    //         top: e.clientY
                    //     };
                    //     // 鼠标移动left - 鼠标距离div左边的left <= 操作板left(到body距离)
                    //     if (divMovePosition.left - this.divStartLeft <= this.dom1Left) {
                    //         divMovePosition.left = this.dom1Left + this.divStartLeft;
                    //     }
                    //     if (divMovePosition.top - this.divStartTop <= this.dom1Top) {
                    //         divMovePosition.top = this.dom1Top + this.divStartTop;
                    //     }
                    //     //  操作板left(到body距离)+操作板的offsetWidth <= 鼠标移动div的left+鼠标到盒子右边的距离(盒子大小-鼠标->left的值)
                    //     if (this.dom1Left + this.div.offsetParent.offsetWidth <= divMovePosition.left + (this.div.offsetWidth - this.divStartLeft)) {
                    //         divMovePosition.left = this.dom1Left + this.div.offsetParent.offsetWidth - (this.div.offsetWidth - this.divStartLeft);
                    //     }
                    //     if (this.dom1Top + this.div.offsetParent.offsetHeight <= divMovePosition.top + (this.div.offsetHeight - this.divStartTop)) {
                    //         divMovePosition.top = this.dom1Top + this.div.offsetParent.offsetHeight - (this.div.offsetHeight - this.divStartTop);
                    //     }
                    //
                    //     this.div.style.left = divMovePosition.left - this.dom1Left - this.divStartLeft + 'px';
                    //     this.div.style.top = divMovePosition.top - this.dom1Top - this.divStartTop + 'px';
                    // });

                    this.$refs.workPlace[this.thisFloorIndex].appendChild(this.div);
                    this.isMove = true;
                    this.startLeft = e.clientX;
                    this.startLeftCopy = e.clientX;
                    this.startTop = e.clientY;
                    this.startTopCopy = e.clientY;
                }
            },
            selectOtherDom(e) {
                try {
                    this.div.style.cursor = 'default';
                } catch (error) {
                    console.log('div已移出, 没有默认鼠标样式');
                }
                // 重置操作板到body的距离
                this.dom1Left = 0;
                this.dom1Top = 0;
                this.isMove = false;

                // div鼠标弹起
                this.isDivMove = false;
                this.divOffsetLeft = 0;
                this.divOffsetTop = 0;

                // 框选移动(3): 更新: 记录每一个module移动后的left/top
                for (let i = 0; i < this.selectModuleList.length; i++) {
                    this.selectModuleLeftTopList[i] = {
                        left: this.selectModuleList[i].style.left.replace('px', '') * 1,
                        top: this.selectModuleList[i].style.top.replace('px', '') * 1
                    };
                }

                // 没有选择移出选框
                if (this.selectModuleList.length == 0 && this.div) {
                    this.$refs.workPlace[this.thisFloorIndex].removeChild(this.div);
                    this.div = null;
                }
            },
            moveDom(e) {
                // 鼠标没按下就不移动
                if (!this.isMove) return;
                let top = this.div.style.top.replace('px', '');
                let left = this.div.style.left.replace('px', '');
                if (this.startLeftCopy - e.clientX > 0) {
                    this.div.style.left = e.clientX - this.dom1Left + 'px';
                    this.div.style.width = this.startLeftCopy - e.clientX + 'px';
                    this.endRight = this.startLeftCopy;
                    this.startLeft = e.clientX;
                } else {
                    this.div.style.width = e.clientX - this.dom1Left - left + 'px';
                    this.endRight = e.clientX;
                }

                if (this.startTopCopy - e.clientY > 0) {
                    this.div.style.top = e.clientY - this.dom1Top + 'px';
                    this.div.style.height = this.startTopCopy - e.clientY + 'px';
                    this.endBottom = this.startTopCopy;
                    this.startTop = e.clientY;
                } else {
                    this.div.style.height = e.clientY - this.dom1Top - top + 'px';
                    this.endBottom = e.clientY;
                }
                console.log(this.startLeftCopy, this.startTopCopy);
                // this.endRight = e.clientX;
                // this.endBottom = e.clientY;
                this.changeComponentStyle();
            },
            // 修改选中组件的样式
            changeComponentStyle(status = 'defalut') {
                let allDom = this.getAllDom();
                // 框选移动(5): 清除选中的module
                this.selectModuleList = [];
                if (status == 'defalut') {
                    for (let j = 0; j < allDom.length; j++) {
                        this.dom2Top = 0;
                        this.dom2Left = 0;
                        console.log(allDom[j])
                        this.getParentTag(allDom[j], 'dom2');
                        console.log(this.dom2Top > this.startTop &&
                            this.dom2Left > this.startLeft &&
                            this.endRight > this.dom2Left + allDom[j].offsetWidth &&
                            this.endBottom > this.dom2Top + allDom[j].offsetHeight)
                        if (
                            this.dom2Top > this.startTop &&
                            this.dom2Left > this.startLeft &&
                            this.endRight > this.dom2Left + allDom[j].offsetWidth &&
                            this.endBottom > this.dom2Top + allDom[j].offsetHeight
                        ) {
                            // allDom[j].style.border = '1px solid green';
                            // 框选移动: 添加module元素
                            this.selectModuleList.push(allDom[j]);
                        } else {
                            allDom[j].style.border = '';
                        }
                    }
                } else if (status == 'clear') {
                    for (let k = 0; k < allDom.length; k++) {
                        allDom[k].style.border = '';
                    }
                }
            },
            // 获取当前的组件 => 返回所有元素
            getAllDom() {
                let allComponents = this.$refs.allComponents.slice(this.thisFloorIndex);
                console.log(allComponents);
                for (let i = 0; i < allComponents.length; i++) {
                    if (allComponents[i].style.display !== 'none') {
                        if (allComponents[i].children && allComponents[i].children.lenght != 0) {
                            return allComponents[i].children;
                        }
                    }
                }
            },
            moduleMove() {
                // 框选移动(2)
                // 选择的目标也进行移动: 1. 选择的目标移动(div添加/减小的距离: 选择目标的距离(添加/减少))   2. 范围限制
                let divLeft = this.div.style.left.replace('px', '') * 1;
                if (divLeft > 0 && this.div.offsetParent.offsetWidth - this.div.offsetWidth > this.div.style.left.replace('px', '') * 1) {
                    divLeft = this.div.style.left.replace('px', '') * 1;
                } else if (this.div.offsetParent.offsetWidth - this.div.offsetWidth < this.div.style.left.replace('px', '') * 1) {
                    divLeft = this.div.offsetParent.offsetWidth - this.div.offsetWidth;
                } else {
                    divLeft = 0;
                }

                let divTop = this.div.style.top.replace('px', '') * 1;
                // console.log(divTop);
                if (divTop > 0 && this.div.offsetParent.offsetHeight - this.div.offsetHeight > this.div.style.top.replace('px', '') * 1) {
                    divTop = this.div.style.top.replace('px', '') * 1;
                } else if (this.div.offsetParent.offsetTop - this.div.offsetTop < this.div.style.top.replace('px', '') * 1) {
                    divTop = this.div.offsetParent.offsetHeight - this.div.offsetHeight;
                } else {
                    divTop = 0;
                }
                // console.log(divLeft);

                let left = divLeft - parseInt(this.divMoveBeforeLeft.replace('px', ''));
                let top = divTop - parseInt(this.divMoveBeforeTop.replace('px', ''));

                // this.selectModuleList[i].style.top = this.selectModuleLeftTopList[i].top + top + 'px'
                // this.selectModuleList[i].style.left = this.selectModuleList[i].style.left.replace('px', '') + left + 'px' => this.selectModuleList[i].style.left +=  left + 'px'  // 就会不断变大
                // this.selectModuleList[i].style.top = this.selectModuleList[i].style.top.replace('px', '') + top + 'px' +> 应该是鼠标按下就就好位置, 选择的)

                console.log(this.selectModuleList, '============================================================')
                for (let i = 0; i < this.selectModuleList.length; i++) {
                    this.selectModuleList[i].style.left = this.selectModuleLeftTopList[i].left + left + 'px';
                    this.selectModuleList[i].style.top = this.selectModuleLeftTopList[i].top + top + 'px';
                }
            },
            // 校准
            /* 
                冒泡对比两个元素的left   小 -> 大
            */
            calibration() {
                let data = {
                    // 播种墙
                    seedingWallList: [],
                    // 货架
                    goodsShelvesList: [],
                    // 堆塔
                    heapedTowerList: [],
                    // 拣货通道 pst通道 播种墙
                    screenList: []
                }
                
                let arr = Array.from(this.getAllDom());

                for (let i = 0; i < arr.length; i++) { 
                    for (let j = 0; j < arr.length - 1; j++) {
                        // 对所有模型进行排列(left)
                         if (this.pxToNum(arr[j].style.left) > this.pxToNum(arr[j + 1].style.left)) {
                            let temp = arr[j];
                            arr[j] = arr[j + 1];
                            arr[j + 1] = temp;
                        }
                    }
                }
                // 冒泡完成 小 -》 大
                console.log(arr)

                // 播种墙标志
                let isSeedingWall = false, firstSeedingWall, seedingWallList = [];
                // 轨道标志
                let isTrack = false, TrackList=[];
                // psb标志位
                let isPSB = false, PSBList = [];
                let isGoodsShelves = false, goodsShelvesList = []
                // 堆塔标志
                let isHeapedTower = false, heapedTowerList=[]
                // 分拣员
                let isSorter = false, sorterList=[]
                // 推车
                let isGardenCart = false, gardenCartList=[]
                arr.forEach((item, index) => {
                     // 查找播种墙是否存在, 只获取第一个
                    if(arr[index].dataset['name'] == '播种墙') {
                        isSeedingWall = true;
                        seedingWallList.push(arr[index])
                        firstSeedingWall = seedingWallList[0]
                    }
                    // 查找轨道是否存在， 获取所有
                    if(arr[index].dataset['name'] == '轨道') {
                        isTrack = true;
                        TrackList.push(arr[index])
                        console.log('轨道已存在', TrackList)
                    }

                    if(arr[index].dataset['name'] == 'PSB') {
                        isPSB = true;
                        PSBList.push(arr[index])
                        console.log('psb已存在', PSBList)
                    }

                    // 货架
                    if(arr[index].dataset['name'] == '货架') {
                        isGoodsShelves = true;
                        goodsShelvesList.push(arr[index])
                    }

                    // 堆塔
                    if(arr[index].dataset['name'] == '堆塔') {
                        console.log('堆塔存在')
                        isHeapedTower = true;
                        heapedTowerList.push(arr[index])
                    }

                    // 分拣员
                    if(arr[index].dataset['name'] == '分拣员') {
                        isSorter = true;
                        sorterList.push(arr[index])
                    }

                    // 推车
                    if(arr[index].dataset['name'] == '推车') {
                        isGardenCart = true
                        gardenCartList.push(arr[index])
                    }
                })

                for (let i = 0; i < arr.length; i++) {
                    if(arr[i].className != 'toolOther') {
                        arr[i].style.top = this.vhVwToPx('vh', '12vh') + 'px'
                    }

                    for (let j = 0; j < arr.length - 1; j++) { 

                        // 修改播种墙的left
                        if(arr[i].dataset['name'] == '轨道' && isSeedingWall == true) {
                            arr[i].style.left = firstSeedingWall.style.left
                            isSeedingWall = 'ok'
                        }

                        // 对所有相同模型进行排列(left)
                        if ((arr[j].className == arr[j + 1].className)) {
                            console.log(arr[j].className)
                            // 第一个比第二个left大

                            let offsetWidth, offsetHeight
                            if(arr[j].children.length != 0) {
                                offsetWidth = arr[j].children[0].offsetWidth
                                } else {
                                offsetWidth = arr[j].offsetWidth
                            }

                            // 高度是否大于本身高度 并且两个盒子left重叠(除了不需要处理: 推车堆塔分拣员工作站)
                            if(this.pxToNum(arr[j].style.left) >= this.pxToNum(arr[j + 1].style.left) && arr[j].dataset['name'].indexOf('推车堆塔分拣员工作站') == -1) {
                                // 它们之间的left小于offsetWidth, 调整距离; 否则不做处理
                                if(this.pxToNum(arr[j].style.left) - this.pxToNum(arr[j + 1].style.left) < offsetWidth) {
                                    arr[j + 1].style.left = this.pxToNum(arr[j].style.left) + offsetWidth + 'px'
                                }

                            } else if(this.pxToNum(arr[j].style.left) <= this.pxToNum(arr[j + 1].style.left) && arr[j].dataset['name'].indexOf('推车堆塔分拣员工作站') == -1) {
                                if(this.pxToNum(arr[j + 1].style.left) - this.pxToNum(arr[j].style.left) < offsetWidth) {
                                    arr[j + 1].style.left = this.pxToNum(arr[j].style.left) + offsetWidth + 'px'
                                }
                                console.log(this.pxToNum(arr[j].style.left), this.pxToNum(arr[j + 1].style.left))
                            }

                        } else {
                            console.log('class不一样')
                        }

                    }
                }

                /* 
                // 只有轨道
                if(isTrack && !isSeedingWall && isPSB) {
                    console.log('只有轨道， 没有播种墙')

                    let length = TrackList[0].children.length
                    PSBList.forEach((item, index) => {

                        // TODO: 先写死， 以后使用vuex  公式：2(n-1) +> 2(n+1-1)
                        item.style.top = this.pxToNum(TrackList[0].children[2*(index)%length].style.top) + 20 + vhTopx + 'px'
                        
                        item.style.left = this.pxToNum(TrackList[0].style.left) + 8 + 30*Math.floor(index/6) + 'px'

                    })
                }

                // 分拣员 和 推车
                if(isSeedingWall && isSorter) {
                    sorterList.forEach((item, index) => {
                        item.style.top = this.pxToNum(TrackList[0].children[2*(index)%length].style.top) + 20 + vhTopx + 'px'
                        item.style.left = this.pxToNum(seedingWallList[1].style.left) - 30 + 'px'
                    })
                }
                */

                // psb 和 播种墙
                if(isSeedingWall&&isPSB) {
                    PSBList.forEach((item, index) => {
                        item.style.top = this.vhVwToPx('vh', '2vh') + seedingWallList[0].offsetHeight/6*index + this.vhVwToPx('vh', '12vh') + 'px'
                        item.style.left = this.pxToNum(seedingWallList[0].style.left) + this.vhVwToPx('vw', '0.4vw') + this.vhVwToPx('vw', '1.5625vw')*Math.floor(index/6) + 'px'
                    })
                }

                // 推塔 和 货架
                if(isHeapedTower && isGoodsShelves) {

                    heapedTowerList.forEach((item, index) => {
                        item.style.top =  this.vhVwToPx('vh', '2.13vh') + this.vhVwToPx('vh', '12vh') + 'px'
                        item.style.left = this.pxToNum(goodsShelvesList[index].style.left) + this.vhVwToPx('vw', '0.52vw') + 'px'
                    })
                }

                /* 
                // 轨道+播种墙1+PSB
                else if(isTrack && isSeedingWall && seedingWallList.length > 0 && isPSB) {
                    let length = TrackList[0].children.length
                    PSBList.forEach((item, index) => {

                        // TODO: 先写死， 以后使用vuex  公式：2(n-1) => 索引从0开始 +> 2(n+1-1)
                        item.style.top = this.pxToNum(TrackList[0].children[2*(index)%length].style.top) + 20 + vhTopx + 'px'
                        item.style.left = this.pxToNum(seedingWallList[0].style.left) + 8 + 30*Math.floor(index/6) + 'px'
                        
                    })
                }
                // 轨道+播种墙2+货架/堆塔
                if(isTrack && isSeedingWall && seedingWallList.length == 2) {
                    console.log('轨道+播种墙2+货架')
                    if(isGoodsShelves) {
                        goodsShelvesList.forEach((item, index) => {
                            console.log(seedingWallList[1].style.left)
                            // 播种墙位置0-1的间隔
                            item.style.left = this.pxToNum(seedingWallList[0].style.left)
                            item.style.left = this.pxToNum(seedingWallList[1].style.left) + 60 * (index+1) + 'px'
                        })
                    }
                    

                    if(isHeapedTower) {
                        let length = TrackList[0].children.length
                        heapedTowerList.forEach((item, index) => {
                            item.style.top =  20 + vhTopx + 'px'
                            item.style.left = this.pxToNum(seedingWallList[1].style.left) + 60 * (index+1) + 10 + 'px'
                            
                        })
                    }

                } 
                //  轨道+播种墙4+货架/堆塔
                else if(isTrack && isSeedingWall && seedingWallList.length == 4) {
                    if(isGoodsShelves) {
                        goodsShelvesList.forEach((item, index) => {
                            console.log(seedingWallList[1].style.left)
                            item.style.left = this.pxToNum(seedingWallList[3].style.left) + 60 * (index+1) + 'px'
                        })
                    }
                     if(isHeapedTower) {
                        let length = TrackList[0].children.length
                        heapedTowerList.forEach((item, index) => {
                            item.style.top =  20 + vhTopx + 'px'
                            item.style.left = this.pxToNum(seedingWallList[3].style.left) + 60 * (index+1) + 10 + 'px'
                            
                        })
                    }
                }
                */

                let maxObj = {
                    MaxRight: 0,
                    MaxBottom: 0
                }
                // 获取右/下边的最大值来调整轨道
                let mewArr = Array.from(this.getAllDom());
                mewArr.forEach((item, index) => {
                    if(item.dataset['name'] == '堆塔') {
                        let left = this.pxToNum(item.style.left)+this.pxToNum(item.lastElementChild.style.left)+item.lastElementChild.offsetWidth
                        let top = this.pxToNum(item.style.top)+this.pxToNum(item.lastElementChild.style.top)-this.pxToNum(item.children[0].style.top)+item.lastElementChild.offsetHeight
                        if(left>maxObj.MaxRight) {
                            maxObj.MaxRight = left
                        }
                        if(top>maxObj.MaxBottom) {
                            maxObj.MaxBottom = top
                        }
                        console.log('堆塔')
                        console.log(this.pxToNum(item.style.left), (item.children.length/6-1)*6, item.children[0].offsetWidth)
                        // console.log((this.pxToNum(item.children[1].style.top)-this.pxToNum(item.children[0].style.top))*5+item.children[0].offsetHeight)
                        
                    }
                    else if(item.dataset['name'] == '货架') {
                        let left = this.pxToNum(item.style.left)+this.pxToNum(item.lastElementChild.style.left)+ item.lastElementChild.offsetWidth
                        let top = this.pxToNum(item.style.top)+this.pxToNum(item.lastElementChild.style.top)+ item.lastElementChild.offsetHeight
                        if(left>maxObj.MaxRight) {
                            maxObj.MaxRight = left
                        }
                        if(top>maxObj.MaxBottom) {
                            maxObj.MaxBottom = top
                        }
                    }
                    else {
                        if(item.dataset['name'] != '轨道') {
                            
                            let left = this.pxToNum(item.style.left)+item.offsetWidth
                            let top = this.pxToNum(item.style.top)+item.offsetHeight 
                            if(left>maxObj.MaxRight) {
                                maxObj.MaxRight = this.pxToNum(item.style.left)+item.offsetWidth 
                            }
                            if(top>maxObj.MaxBottom) {
                                maxObj.MaxBottom = this.pxToNum(item.style.top)+item.offsetHeight 
                            }

                        }
                        
                    }

                    // 保存调整后的数据
                    if(arr[index].dataset['name'] == '播种墙') {
                        data.seedingWallList.push(
                            {
                                id: data.seedingWallList.length+1,
                                name: 'seedingWall-'+ (data.seedingWallList.length+1),
                                left: arr[index].style.left,
                                top: arr[index].style.top,
                                offsetWidth: arr[index].offsetWidth,
                                offsetHeight: arr[index].offsetHeight,
                                dom: arr[index]
                            }
                        )
                    }
                    // 货架
                    if(arr[index].dataset['name'] == '货架') {
                        data.goodsShelvesList.push(
                            {
                                id: data.goodsShelvesList.length+1,
                                name: 'goodsShelves-' + (data.goodsShelvesList.length+1),
                                left: arr[index].style.left,
                                top: arr[index].style.top,
                                offsetWidth: this.pxToNum(arr[index].lastElementChild.style.left)+arr[index].lastElementChild.offsetWidth,
                                offsetHeight: this.pxToNum(arr[index].lastElementChild.style.top)+arr[index].lastElementChild.offsetHeight,
                                dom: arr[index]
                            }
                        )
                    }

                    // 堆塔
                    if(arr[index].dataset['name'] == '堆塔') {
                        data.heapedTowerList.push(
                            {
                                id: data.heapedTowerList.length+1,
                                name: 'heapedTower-' + (data.heapedTowerList.length+1),
                                left: arr[index].style.left,
                                top: arr[index].style.top,
                                offsetWidth: this.pxToNum(arr[index].lastElementChild.style.left)+arr[index].lastElementChild.offsetWidth,
                                offsetHeight: this.pxToNum(arr[index].lastElementChild.style.top)+arr[index].lastElementChild.offsetHeight,
                                dom: arr[index]
                            }
                        )
                    }

                    // 拣货通道
                    if('拣货通道 pst通道 播种墙'.indexOf(arr[index].dataset['name']) != -1) {
                        data.screenList.push(
                            {
                                id: data.screenList.length+1,
                                name: 'screen-' + (data.screenList.length+1),
                                left: arr[index].style.left,
                                top: arr[index].style.top,
                                offsetWidth: this.pxToNum(arr[index].lastElementChild.style.left)+arr[index].lastElementChild.offsetWidth,
                                offsetHeight: this.pxToNum(arr[index].lastElementChild.style.top)+arr[index].lastElementChild.offsetHeight,
                                dom: arr[index]
                            }
                        )
                    }

                })
                // 修改轨道宽度
                TrackList.forEach((item, index) => {
                    // item.style.width = maxObj.MaxRight + 'px'
                    if(mewArr.length != 1) {
                        for(let i = 0; i < item.children.length; i++) {
                            item.children[i].style.width = maxObj.MaxRight - this.pxToNum(item.style.left) + this.vhVwToPx('vw', '1.04vw') + 'px'
                            if((this.vhVwToPx('vw', item.children[i].style.width) || this.pxToNum(item.children[i].style.width))  < this.vhVwToPx('vw', '10vw')) {
                                item.children[i].style.width = this.vhVwToPx('vw', '10vw') + 'px'
                            } 
                        }
                    }
                })
                console.log(maxObj)
                console.log(data)

            },
            // px 转 number
            pxToNum(px) {
                let num = px.replace("px", "") * 1;
                return num;
            },
            // vh/vw 转 px
            vhVwToPx(type, str) {
                let output
                switch(type) {
                    case 'vh':
                        output = window.innerHeight / 100 * str.replace('vh', '')
                        break;
                    case 'vw':
                       output = window.innerWidth / 100 * str.replace('vw', '')
                       break;
                }
                if(isNaN(output)) {
                    console.log('传递类型和传递的数值类型不同')
                }
                return output
            },
            // 生成
            generate() {
            },
            // 当前画布图层按键删除 监听 delete 和 退格键
            remove() {
                let self = this;
                window.addEventListener('keydown', function (event) {
                    let key = event.key;
                    if (key === 'Delete') {
                        self.delLayer();
                    }
                });
            },
            // 输入框失去焦点事件
            inputBlurEvent(event) {
                this.log('event name', event, event.target.name)
                let name = event.target.name
                if(name === 'left') {
                    if(this.posLeft !== '') {
                        this.log(`${this.posLeft}px`)
                        this.selectedElement.style.left = `${this.posLeft}px`
                    }
                } else if(name === 'top') {
                    if(this.posTop !== '') {
                        this.selectedElement.style.top = `${this.posTop}px`
                    }
                } else if(name === 'num') {
                    this.log(this.selectedElement.classList)
                    if(this.selectedElement.classList.contains('track-list')) {
                        this.setTrackWidth({
                            width: this.posNum * 37.3 + 'vw'
                        })
                    } else if(this.selectedElement.classList.contains('shelves')) {
                        this.setShelve({
                            shelvesNum: parseInt(this.posNum)
                        })
                    } else if(this.selectedElement.classList.contains('box')) {
                        this.setBoxValue({
                            boxColumns: parseInt(this.posNum),
                        })
                    }

                }
                // console.log(this.getBoxValue)
                // this.$nextTick(() => {
                //     this.changeBox({
                //         xSpace: 60, // x 的间距
                //         ySpace: 80, // y 的间距
                //         boxColumns: 1, // 堆塔一列的数量
                //         boxRows: 6, // 堆塔一行的数量
                //     })
                // })
                // console.log(this.getBoxValue)
            },
            findElement(paths, className) {
                for (let i = 0; i < paths.length; i++) {
                    let list = paths[i].classList
                    if(list !== undefined && list.contains(className)) {
                        return true
                    }
                }
                return false
            },
            setAllValue() {
                this.posLeft = ''
                this.posTop = ''
                this.posNum = ''
            },
            // 全局鼠标按下事件
            editMouseEvent(event) {
                this.log('event', event, event.target.closest('.psbContent'), event.path)
                let bool = this.findElement(event.path, 'posContent')
                this.log('bool', bool)
                if(!bool) {
                    this.posContent.none = true
                    this.setAllValue()
                }
            },
        },
        watch: {
            // selectedElement:{
                // handler(val, old) {
                //     this.log('val ((((((((((', val, old)
                //     if(val === null) {
                //         this.posContent.none = true
                //     }
                // }
            // }
        }
    };
</script>

<style lang="scss" scoped>
    .edit2 {
        width: 100%;
        display: flex;

        .sidebar {
            width: 2.6vw;
            height: 93.1vh;
            background-color: #333333;
            position: relative;

            .backBtn {
                height: 3vh;
                width: 1.7vw;
                position: absolute;
                top: 0.5vw;
                left: 50%;
                transform: translateX(-50%);
                background: url('../../assets/scene/backBtn@2.png');
                background-size: 100% 100%;
            }

            .help {
                height: 3vh;
                width: 1.7vw;
                position: absolute;
                bottom: 0.5vw;
                left: 50%;
                transform: translateX(-50%);
                background: url('../../assets/scene/help@2.png');
                background-size: 100% 100%;
            }
        }

        // 模型库
        .modelBase {
            .modelBaseTitle {
                width: 13.5vw;
                height: 3.7vh;
                background-color: #2f2f2f;
                display: flex;
                align-items: center;

                .modelBoxIcon {
                    height: 2vh;
                    width: 1vw;
                    background: url('../../assets/scene/modelBoxIcon@2.png');
                    background-size: 100% 100%;
                    margin: 0.5vw;
                }

                span {
                    width: 2.9vw;
                    height: 0.9vw;
                    font-family: SourceHanSansCN-Regular;
                    font-size: 0.9vw;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 0.9vw;
                    letter-spacing: 0vw;
                    color: #fffcfc;
                }
            }

            .modelBaseContent {
                width: 13.5vw;
                height: calc(93.1vh - 3.7vh);
                background-color: #262626;
                display: flex;
                flex-wrap: wrap;
                align-content: flex-start;

                .modelBox {
                    display: flex;
                    flex-direction: column;
                    margin: 0.5vw;
                    width: 3.4vw;

                    .model {
                        height: 6.9vh;
                        /*width: 3.4vw;*/
                        margin: 0.5vw;
                        /*color: #ffffff;*/
                        /*background-color: #2f2f2f;*/
                        /*cursor: pointer;*/
                    }

                    .modelTitle {
                        text-align: center;
                    }
                }
            }
        }

        // 楼层
        .floor {
            height: 93.1vh;
            width: calc(51.9vw + 15.4vw);
            background-color: #333333;

            .floorTitle {
                height: 3.7vh;
                width: calc(51.9vw + 15.4vw);
                display: flex;

                .floorTitleLeft {
                    width: 51.9vw;
                    height: 3.7vh;
                    background-color: #333333;
                    display: flex;
                    align-items: center;
                    margin-right: 1px;
                    flex-shrink: 0;

                    .everyFloor {
                        width: 7.3vw;
                        height: 3.7vh;
                        font-size: 1.7vh;
                        line-height: 3.7vh;
                        background-color: #404040;
                        display: flex;
                        align-items: center;
                        justify-content: space-around;
                        margin: 0 1px 0 0;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;

                        .closeIcon {
                            width: 1.2vw;
                            height: 2vh;
                            background: url('../../assets/scene/close@2.png') no-repeat;
                            background-size: 0.8vw 1.4vh;
                            background-position: center center;
                        }
                    }

                    .addFloor {
                        width: 2.8vh;
                        height: 2.8vh;
                        background: url('../../assets/scene/add@2.png') no-repeat;
                        background-size: 100% 100%;
                        margin-left: 0.5vw;
                        // 不缩小该盒子
                        flex-shrink: 0;
                    }
                }

                .floorTitleRight {
                    width: 15.4vw;
                    height: 3.7vh;
                    font-size: 0.9vw;
                    line-height: 3vh;
                    flex-shrink: 0;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding: 0.2vw;
                    box-sizing: border-box;

                    .inputLeft {
                        width: 3.3vw;
                        height: 2.8vh;
                    }

                    .inputRight {
                        width: 3.3vw;
                        height: 2.8vh;
                    }

                    input {
                        border: 1px solid #7f7f7f;
                        background-color: #333333;
                        text-align: center;
                        color: #fff;
                    }

                    input:focus {
                        border: solid 0.1vw #ffffff;
                        outline: none;
                    }

                    .closeIcon {
                        width: 1.2vw;
                        height: 2vh;
                        background: url('../../assets/scene/close@2.png') no-repeat;
                        background-size: 0.8vw 1.4vh;
                        background-position: center center;
                    }
                }
            }

            .edit-content {
                width: 67.3vw;
                height: 89.4vh;
                overflow: scroll;
                /*overflow-y: hidden;*/
                background: #101012;
            }

            .class-workPlace {
                position: absolute;
                z-index: 0;
            }

            /*滚动条整体样式*/
            ::-webkit-scrollbar {
                width: 8px !important;
                height: 8px !important;
                background: #ffffff !important;
                cursor: pointer !important;
            }

            ::-webkit-scrollbar-thumb {
                /*滚动条里面小方块*/
                border-radius: 8px !important;
                background: #414141 !important;
                cursor: pointer !important;
                border-radius: 100px;
            }

            ::-webkit-scrollbar-track {
                /*滚动条里面轨道*/
                border-radius: 0 !important;
                background-color: #000000;
                cursor: pointer !important;
            }

            .floorContent {
                height: calc(93.1vh - 3.7vh);
                width: calc(51.9vw + 15.4vw);
                /*background: url('~@/assets/2dEdit/2dBg.jpg');*/
                /*background: black;*/
                background-size: 95% 100%;
                position: relative;

                .operationBorad {
                    width: 21.9vw; // 67.3 / 2 = 33.65   21.9 / 2 = 10.95
                    height: 5vh;
                    position: fixed;
                    left: 37vw;
                    bottom: 6.5vh;
                    display: flex;
                    justify-content: space-between;

                    .operationBoradLeft {
                        width: calc(21.9vw - 12.9vw);
                        height: 5vh;
                        background-color: #ffac29;
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        background: url('../../assets/scene/operationBoradBorder@2.png');
                        background-size: 100% 100%;
                        position: relative;
                        cursor: pointer;

                        .operationBoradLeftIcon {
                            width: 1.3vw;
                            height: 2.2vh;
                            background: url('../../assets/scene/calibration@2.png');
                            background-size: 100% 100%;
                            margin-right: 0.5vw;
                        }

                        .operationBoradLeftText {
                            width: 2.3vw;
                            height: 1.1vw;
                            font-size: 1.1vw;
                            line-height: 1.3vw;
                        }
                    }

                    .operationBoradRight {
                        width: calc(21.9vw - 12.9vw);
                        height: 5vh;
                        background-color: #ffac29;
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        background: url('../../assets/scene/operationBoradBorder@2.png');
                        background-size: 100% 100%;
                        position: relative;
                        cursor: pointer;

                        .operationBoradRightIcon {
                            width: 1.3vw;
                            height: 2.2vh;
                            background: url('../../assets/scene/generate@2.png');
                            background-size: 100% 100%;
                            margin-right: 0.5vw;
                        }

                        .operationBoradRightText {
                            width: 2.3vw;
                            height: 1.1vw;
                            font-size: 1.1vw;
                            line-height: 1.3vw;
                        }
                    }

                    .stationBg {
                        width: 10px;
                        height: 20px;
                        background: url('~@/assets/2dEdit/station.png');
                    }
                }
            }
        }

        // 图层
        .layer {
            width: 16.6vw;
            height: 93.1vh;
            background-color: #262626;
            position: fixed;
            right: 0;

            .layerTitle {
                width: 16.6vw;
                height: 3.7vh;
                background-color: #3f3f3f;
                display: flex;
                align-items: center;

                .layerTitleIcon {
                    width: 1.1vw;
                    height: 1.9vh;
                    background: url('../../assets/scene/tuceng@2.png');
                    background-size: 100% 100%;
                    margin: 0 0.5vw;
                }
            }

            .layerContent {
                width: 16.6vw;
                height: calc(73.1vh - 3.7vh - 4.6vh);
                background-color: #262626;
                font-size: 1.5vh;

                .unitTitle {
                    width: 16.6vw;

                    .list-item {
                        display: flex;
                        align-items: center;
                    }

                    .collectIcon {
                        background: url('../../assets/scene/collectIcon@2.png') no-repeat;
                        background-size: 0.4vw 1.4vh;
                        background-position: center center;
                    }

                    .uniList {
                        width: 16.6vw;
                        height: 3.7vh;
                        line-height: 3.7vh;
                        background-color: #262626;
                        font-size: 1.5vh;
                        text-indent: 0.6vw;
                    }
                }
            }
            .none {
                opacity: 0;
            }
            .posContent {
                width: 16.6vw;
                height: 20vh;
                background-color: #262626;
                .posIcon {
                    width: 1.1vw;
                    height: 1.9vh;
                    background: url('../../assets/scene/tuceng@2.png');
                    background-size: 100% 100%;
                    display: inline-block;
                    margin: 0 0.5vw;
                }
                .posHeader {
                    width: 16.6vw;
                    background-color: #2f2f2f;
                    height: 3.7vh;
                    line-height: 3.7vh;
                    font-size: 0.9vw;
                }
                .posMain {
                    width: 16.6vw;
                    .classInput {
                        width: 5vw;
                        margin: 0 0.5vw;
                        border: 0.1vh solid #a59a9a;
                        background-color: black;
                        height: 2.8vh;
                        font-size: 0.5vw;
                        color: white;
                    }
                    .mainTop, .mainBottom {
                        margin: 0.5vw;
                        text-align: left;
                    }
                }
            }

            .layerFooter {
                width: 16.6vw;
                height: 4.6vh;
                background-color: #404040;
                display: flex;
                align-items: center;
                justify-content: center;

                .layerFooterBox {
                    width: 8.9vw;
                    height: 3.1vh;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;

                    div {
                        width: 1.6vw;
                        height: 2.8vh;
                    }

                    .bind {
                        background: url('../../assets/scene/bind@2.png') no-repeat;
                        background-size: 1vw 1.6vh;
                        background-position: center center;
                    }

                    .bindDisable {
                        background: url('../../assets/scene/bindDisable@2.png') no-repeat;
                        background-size: 1vw 1.6vh;
                        background-position: center center;
                    }

                    .editGround {
                        background: url('../../assets/scene/editGround@2.png') no-repeat;
                        background-size: 1vw 1.6vh;
                        background-position: center center;
                    }

                    .editGroundDisable {
                        background: url('../../assets/scene/editGroundDisable@2.png') no-repeat;
                        background-size: 1vw 1.6vh;
                        background-position: center center;
                    }

                    .delete {
                        background: url('../../assets/scene/delete@2.png') no-repeat;
                        background-size: 1vw 1.6vh;
                        background-position: center center;
                    }

                    .deleteDisable {
                        background: url('../../assets/scene/deleteDisable@2.png') no-repeat;
                        background-size: 1vw 1.6vh;
                        background-position: center center;
                    }
                }
            }
        }
    }

    .border-style {
        border: solid 0.1vh #ffac29;
    }

    .thisFloor {
        background-color: #4d4d4d !important;
    }

    .openIcon {
        background: url('../../assets/scene/openIcon@2.png') no-repeat !important;
        background-size: 1.4vh 0.4vw !important;
        background-position: center center !important;
    }

    .operation {
        background-color: #2d2d2d !important;
    }

    .modelBoxBg {
        /*background-color: #ffac29 !important;*/
    }

    .floorContentMapBodyLeftActive {
        background: url('../../assets/2dEdit/station@2.png') no-repeat !important;
        background-size: 100% 100% !important;
    }

    // 激活类名
    @mixin activeClass($img) {
        background: url('../../assets/scene/' +$img) no-repeat !important;
        background-size: 100% 100% !important;
    }

    $activeObj: (
            backBtnActive: 'backBtn-select@2.png',
            helpActive: 'help-select@2.png',
            addFloorActive: 'add-select@2.png',
            operationBoradLRBorderActive: 'operationBoradBorder-select@2.png'
    );
    @each $key2, $value2 in $activeObj {
        .#{$key2} {
            @include activeClass($value2);
        }
    }

    // 模型背景
    @mixin addClass($img, $width, $height) {
        background-image: url('../../assets/scene/' +$img) !important;
        background-size: $width $height;
        background-repeat: no-repeat;
        background-position: center center;
    }

    .carRack {
        @include addClass('guijijia@2.png', 2.4vw, 3.2vh);
    }

    .wall {
        @include addClass('bozhongqiang@2.png', 2.4vw, 3.2vh);
    }

    .rack {
        @include addClass('guidao@2.png', 2.4vw, 3.4vh);
    }

    .car {
        @include addClass('tuiche@2.png', 1.6vw, 3.8vh);
    }

    .box {
        @include addClass('tuita@2.png', 1.4vw, 3.6vh);
    }

    .psb {
        @include addClass('PSB@2.png', 2vw, 3.4vh);
    }

    .people {
        @include addClass('fenlianyuan@2.png', 1.3vw, 3.5vh);
    }

    .station {
        @include addClass('gongzuozhan@2.png', 2.4vw, 3.3vh);
    }
    .PSBPassageway {
        @include addClass('PSBPassageway.png', 2.4vw, 3.3vh);
    }
    .pickingChannel {
        @include addClass('pickingChannel.png', 2.4vw, 3.3vh);
    }
</style>

<style>
    /**
      新添加的dom需要设置全局
     */
    .createDom {
        background: rgba(255, 172, 41, 0.2);
        position: absolute;
        z-index: 999;
    }
</style>
