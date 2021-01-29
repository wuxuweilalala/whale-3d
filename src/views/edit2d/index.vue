<template>
    <div class="edit2"
      @mousedown="editMouseEvent">
        <!-- 模型库 -->
        <div class="modelBase">
            <div class="modelBaseTitle">
                <div class="modelBoxIcon"></div>
                <span>模型库</span>
            </div>
            <div class="modelBaseContent">
                <div v-for="(item, index) in modelBaseList"
                  :key="index"
                  class="modelBox"
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
            <div class="edit-content" ref="editContent" @scroll="handleScrollEvent">
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
                        <canvas class="class-workPlace"
                          :width="width"
                          :height="height"
                          ref="refWorkPlace"></canvas>
                        <!-- 组件 -->
                        <template v-for="(item, index) in itemfloor.componentList">
                            <!-- 默认第一项 -->
                            <div :key="index"
                              ref="allComponents"
                              style="position: relative;width: 200%;height: 100%;">
                                <div
                                  v-for="(itemChild, indexChild) in item.itemList"
                                  :is="itemChild.name"
                                  :index="indexChild"
                                  :componentIds="componentIds"
                                  :item="itemChild"
                                  :key="indexChild"
                                  @click.native="changeChildIndex(indexChild, index)"
                                ></div>
                                <div class="border"
                                  :style="borderStyle"
                                  :key="key">
                                </div>
                            </div>
                        </template>

                        <div class="operationBorad"
                          @click="calibration">
                            <div>
                                <img src="../../assets/scene/correct.png"
                                  alt="">
                                <span>校准</span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- 图层 -->
        <div class="layer">
            <div class="btns">
                <span class="span-btn done"
                  @click="btnEvent(0)">
                    <img src="../../assets/2dEdit/done.png"
                      alt="">
                    <span>保存</span>
                </span>
                <span class="span-btn exit"
                  @click="btnEvent(1)">
                    <img src="../../assets/2dEdit/exit.png"
                      alt="">
                    <span>退出</span>
                </span>
            </div>
            <div class="layerTitle">
                <div class="layerTitleIcon"></div>
                图层
            </div>

            <div class="layerContent">
                <template v-for="(item, index) in floorList[thisFloorIndex].unitList">
                    <div v-if="unitList.length != 0"
                      :key="index"
                      class="unitTitle">
                        <div ref="unitList">
                            <template v-for="(childItem, childIndex) in item.infoList">
                                <div v-if="!childItem.isDeleted"
                                  :key="childIndex"
                                  class="uniList"
                                  @click.stop="modelNameClickEvent(childItem.id, childIndex)"
                                  :data-id="childItem.id"
                                  :ref="'modelName' + childIndex"
                                  :style="{ border: childItem.border }"
                                >
                                    <span>{{ childItem.name }}</span>
                                    <span class="removeIcon">
                                            <img @click.stop="removeClickEvent(childItem.id, childIndex)"
                                              src="../../assets/2dEdit/delete.png"
                                              alt="">
                                    </span>
                                </div>
                            </template>
                        </div>
                    </div>
                </template>
            </div>

            <div class="position-main">
                <div class="posContent">
                    <div class="posHeader">
                        <span class="posIcon"></span>
                        <span>属性</span>
                    </div>
                    <div :class="posContent"
                      ref="posMain"
                      @keydown.enter="enterKeyEvent"
                      @click="posClickEvent">
                        <div>
                            <span>Left</span>
                            <input :class="inputClass[0]"
                              ref="classInput"
                              v-model="posLeft"
                              @blur="inputBlurEvent"
                              name="left"
                              type="text"
                              placeholder="距离左边的位置">
                        </div>
                        <div>
                            <span>Top</span>
                            <input :class="inputClass[1]"
                              ref="classInput"
                              v-model="posTop"
                              @blur="inputBlurEvent"
                              name="top"
                              type="text"
                              placeholder="距离上边的位置">
                        </div>
                        <div v-show="numShow">
                            <span>数量</span>
                            <input :class="inputClass[2]"
                              ref="classInput"
                              v-model="posNum"
                              @blur="inputBlurEvent"
                              name="num"
                              type="text"
                              placeholder="请输入数量">
                        </div>
                        <div v-show="spaceShow">
                            <!--                            <span>间距</span>-->
                            <!--                            <input :class="inputClass[3]"-->
                            <!--                              ref="classInput"-->
                            <!--                              v-model="posSpace"-->
                            <!--                              @blur="inputBlurEvent"-->
                            <!--                              name="space"-->
                            <!--                              type="text"-->
                            <!--                              placeholder="请输入间距">-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 弹窗 -->
        <div class="tooltip"
          v-show="tipShow">
            <div class="tip-main">
                <header>
                    <span>{{ projectName }}</span>
                    <span @click="closeTip"><img src="../../assets/scene/close.png"
                      alt=""></span>
                </header>
                <section>
                    <div class="class-station">
                        <span>单元数</span>
                        <input type="text"
                          v-model="stationNum">
                        <span>个</span>
                    </div>
                    <div class="class-line"></div>
                    <div class="generate">
                        <span class="generate-msg">是否立即生成</span>
                        <div class="tip-btns">
                            <span class="tip-false"
                              @click="tipBtnClickEvent(false)">否</span>
                            <span class="tip-true"
                              @click="tipBtnClickEvent(true)">是</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import bzq from './components/station.vue'; // 播种墙
    import gd from './components/track.vue'; // 轨道
    import hj from './components/shelves.vue'; // 货架
    import other from './components/other.vue'; // 其他
    import station from '../../assets/2dEdit/station@2.png'; // 播种墙
    import guidao from '../../assets/2dEdit/track.png'; // 轨道
    import huojia from '../../assets/2dEdit/huojia@2.png'; // 货架
    import tuiche from '../../assets/2dEdit/tuiche@2.png'; // 推车
    import tuita from '../../assets/2dEdit/tuita@2.png'; // 推塔
    import psb from '../../assets/2dEdit/psb@2.png'; // psb
    import fenlianyuan from '../../assets/2dEdit/fenlianyuan@2.png'; // 分练员
    import gongzuozhan from '../../assets/2dEdit/gongzuozhan@2.png';
    import PSBPassageway from '../../assets/2dEdit/PSBPassageway.png';
    import pickingChannel from '../../assets/2dEdit/pickingChannel.png';
    import pickWay from '../../assets/2dEdit/pickWay.png';
    import pstWay from '../../assets/2dEdit/pstWay.png';
    import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';
    import Vue from 'vue';

    export default {
        components: {
            bzq,
            gd,
            hj,
            other
        },
        data() {
            return {
                // 模型库的数组
                modelBaseList: [
                    {name: '货架', bg: 'carRack', bgImg: huojia, componentName: 'hj'},
                    {
                        name: '工作站',
                        bg: 'wall',
                        bgImg: station,
                        componentName: 'bzq',
                        create: true
                    },
                    {name: '轨道', bg: 'rack', bgImg: guidao, componentName: 'gd'},
                    // {
                    //     name: '推车',
                    //     bg: 'car',
                    //     bgImg: tuiche,
                    //     componentName: 'other',
                    //     width: '1.6vw',
                    //     height: '2.1vw'
                    // },
                    // {
                    //     name: '堆塔',
                    //     bg: 'box',
                    //     bgImg: tuita,
                    //     componentName: 'other',
                    //     width: '1.4vw',
                    //     height: '1.9vw'
                    // },
                    // {
                    //     name: 'PSB',
                    //     bg: 'psb',
                    //     bgImg: psb,
                    //     componentName: 'other',
                    //     width: '2vw',
                    //     height: '1.9vw'
                    // },
                    // {
                    //     name: '分拣员',
                    //     bg: 'people',
                    //     bgImg: fenlianyuan,
                    //     componentName: 'other',
                    //     width: '1.3vw',
                    //     height: '1.98vw',
                    // },
                    // {
                    //     name: '工作站',
                    //     bg: 'station',
                    //     bgImg: gongzuozhan,
                    //     componentName: 'other',
                    //     width: '2.4vw',
                    //     height: '3.2vh',
                    //     create: true
                    // },
                    {
                        name: '拣货通道',
                        bg: 'pickingChannel',
                        bgImg: pickingChannel,
                        componentName: 'hj',
                    },
                    {
                        name: 'PST通道',
                        bg: 'PSBPassageway',
                        bgImg: PSBPassageway,
                        componentName: 'hj',
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
                        ], // 所有组件列表
                        width: 6000,
                        height: 4000,
                        num: 200,
                    },
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
                spaceName: '间距',
                numShow: true,
                spaceShow: false,
                posContent: {
                    posMain: true,
                    none: true,
                },
                posLeft: '',    // 距离左边的位置
                posTop: '',     // 距离上边的位置
                posNum: '',     // 数量
                posSpace: '',   // 间距
                selectedElement: null,  // 选中的元素
                selectedIndex: -1,   // 选中元素的下标
                componentId: '',     // 组件 ID
                componentIds: [],   // 组件的所有 ID
                selectedId: '',     // 选中元素的id
                modelData: [],      // 存储3d模型数据
                peoplePos: [],      // 存储分拣员的位置
                stations: [],
                scrollTop: 0,       // 滚动条的距离
                scrollLeft: 0,
                inputClass: [{
                    classInput: true,
                    inputActive: false,
                }, {
                    classInput: true,
                    inputActive: false,
                }, {
                    classInput: true,
                    inputActive: false,
                }, {
                    classInput: true,
                    inputActive: false,
                }],
                tipShow: false,
                projectName: '',
                stationNum: -1,
                border: '',
                ruleWidth: this.$vwToPx(0.63),
                width: 6000,
                height: 4000,
                num: 200,
                borderStyle: {},
                key: this.uuid(),
                docWidth: 0,        // 屏幕宽度
                docHeight: 0,       // 屏幕高度
            };
        },
        created() {
            // this.initModelOption()
            this.initModelData()

            // localStroge floorList 存储的是已经拖进来的模型
            if (localStorage.getItem('floorList') !== null) {
                this.floorList = JSON.parse(localStorage.getItem('floorList'))
                // this.setBoxStyle()
                this.width = this.floorList[0].width
                this.height = this.floorList[0].height
                this.num = this.floorList[0].num
            }
        },
        mounted() {
            // 初始化默认选择第一个楼层
            // this.chooseFloor(0);
            this.drawGrid(this.width, this.height, this.num);
            this.drawRules(1000, this.width);
            this.setFloorName();
            this.remove();
            let infos = this.floorList[0].unitList[0].infoList
            for (let i = 0; i < infos.length; i++) {
                let info = infos[i]
                info.border = ''
            }
            this.$nextTick(() => {
                this.borderStyle = {}
            })
            let work = document.querySelector('.class-workPlace')
            let rect = work.getBoundingClientRect()
            sessionStorage.setItem('rect', JSON.stringify(rect))
            this.docWidth = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth
            this.docHeight = document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight
        },
        beforeRouteEnter(to, form, next) {
            next(vm => {
                if (sessionStorage.getItem('fromIndex') !== 'true') {
                    sessionStorage.setItem('fromIndex', 'false')
                    next('/index/scene')
                }
            })
        },
        beforeRouteLeave(to, from, next) {
            // localStorage.removeItem('floorList')
            // localStorage.removeItem('modelOptions')
            next()
        },
        computed: {
            ...mapState('edit', {
                modelOptions: 'modelOptions',
            }),
            ...mapGetters('edit', {
                getZIndex: 'getZIndex',
                getPositions: 'getPositions',
                getTrackWidth: 'getTrackWidth',
                getTrackPos: 'getTrackPos',
                getPsbPos: 'getPsbPos',
                getBoxValue: 'getBoxValue',
                getModelOption: 'getModelOption',
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
                setModelOptions: 'setModelOptions',
                setOptions: 'setOptions',
                changeBox: 'changeBox',
                initModelOption: 'initModelOption',
                setCurrentProjectData: 'setCurrentProjectData',
            }),
            ...mapActions('index', {
                creatProjectData: 'creatProjectData',
            }),
            // 设置楼层名字
            setFloorName() {
                let num = {
                    1: '一层',
                    2: '二层',
                }
                let index = this.$route.query.index
                if (index === undefined) {
                    this.floorList[0].floorName = '一层'
                } else {
                    this.floorList[0].floorName = num[index]
                }
            },
            setBoxStyle() {
                let infos = this.floorList[0].unitList[0].infoList
                let id = ''
                for (let i = 0; i < infos.length; i++) {
                    let info = infos[i]
                    if (info.border != '') {
                        id = info.id
                        break
                    }
                }
                let items = this.floorList[0].componentList[0].itemList
                for (let i = 0; i < items.length; i++) {
                    let item = items[i]
                    if (item.id == id) {
                        this.borderStyle = {
                            width: item.widthStyle,
                            height: Number(item.heightStyle.replace('px', '')) + 4 + 'px',
                            top: item.topStyle + 'px',
                            left: item.leftStyle + 'px',
                        }
                    }
                }
            },
            // 绘制线条
            drawLine(work, width, height, num) {
                let ctx = work.getContext('2d');
                ctx.lineWidth = 0.4
                ctx.strokeStyle = "gray";

                for (let j = 0; j < 200; j++) {
                    let y = j * 30
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                    ctx.stroke();
                }
                for (let k = 0; k < num; k++) {
                    let x = k * 30
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, height);
                    ctx.stroke();
                }
            },
            // 绘制网格背景
            drawGrid(width, height, num = 200) {
                let workPlaces = this.$refs.refWorkPlace
                for (let i = 0; i < workPlaces.length; i++) {
                    let work = workPlaces[i]
                    if (work.getContext) {
                        this.drawLine(work, width, height, num)
                    }
                }
            },
            // 绘制长方形
            drawRect(context, x, y, w, h) {
                context.fillStyle = "rgba(54, 55, 56, 1)";
                context.fillRect(x, x, w, h);
            },
            // 画水平标尺
            drawLevelRule(context, left, h, width) {
                let numIndex = -5
                for (let i = 0; i < width; i++) {
                    let height = 5
                    let x = i * 13.5 + left;
                    // console.log('x xxxxxxxx', x)
                    context.beginPath();
                    context.strokeStyle = 'rgba(128, 128, 128, 1)';
                    context.lineWidth = 1;
                    context.moveTo(x, h);
                    // console.log('(i + 1) % 4', (i + 1) % 4)
                    if ((i + 1) % 4 == 0) {
                        height = 10
                        context.font = `${h}px ArialMT`;
                        context.fillStyle = "rgba(239, 239, 239, 1)";
                        context.fillText(`${numIndex}`, x + 1, 12);
                        numIndex += 1
                    }
                    context.lineTo(x, h - height);
                    context.stroke();
                }
            },
            // 画垂直标尺
            drawVerticalRule(context, width = 1000) {
                let numIndex = 1
                let start = this.$vwToPx(0.61)
                let top = this.$vwToPx(1.2)
                for (let i = 0; i < width; i++) {
                    let height = 0.31
                    let y = i * 20 + top;
                    context.beginPath();
                    context.strokeStyle = 'rgba(128, 128, 128, 1)';
                    context.lineWidth = this.$vwToPx(0.05);
                    context.moveTo(start, y);
                    // console.log('(i + 1) % 4', (i + 1) % 4)
                    if ((i + 1) % 4 == 0) {
                        height = 0.54
                        let num = String(numIndex)
                        if (num.length > 0) {
                            let textTop = this.$vwToPx(0.63)
                            for (let j = 0; j < num.length; j++) {
                                let n = num[j]
                                let dis = textTop * j
                                context.font = `${this.$vwToPx(0.63)}px ArialMT`;
                                context.fillStyle = "rgba(239, 239, 239, 1)";
                                context.fillText(`${n}`, this.$vwToPx(0.21), y + this.$vwToPx(0.63) + dis);
                            }
                            numIndex += 1
                        }
                    }
                    context.lineTo(start - this.$vwToPx(height), y);
                    context.stroke();
                }
            },
            // 绘制标尺
            drawRules(width = 1000, rectWidth = 6000) {
                let work = this.$refs.refWorkPlace[0]
                if (work.getContext) {
                    let ctx = work.getContext('2d');
                    let px = this.$vwToPx(0.63)
                    this.drawRect(ctx, 0, 0, rectWidth, px)
                    this.drawRect(ctx, 0, px, px, 4000)
                    ctx.font = `${px}px ArialMT`;
                    ctx.fillStyle = "rgba(239, 239, 239, 1)";
                    let left = this.$vwToPx(0.16)
                    ctx.fillText('0', left, 10);
                    let first = this.$vwToPx(1.2)
                    ctx.moveTo(first, px);
                    this.drawLevelRule(ctx, first, px, width)
                    this.drawVerticalRule(ctx)
                }
            },
            // 初始化model data 生成模型的数据
            initModelData() {
                let model = localStorage.getItem('modelData')
                let projectData = JSON.parse(sessionStorage.getItem('projectData'))
                if (projectData !== null) {
                    this.projectName = projectData.projectName
                    let index = Number(this.$route.query.index) - 1
                    this.stationNum = projectData.stationNum[index]
                }
                if (model !== null) {
                    this.modelData = JSON.parse(model)
                } else {
                    this.modelData = []
                }
            },
            // 选择楼层
            chooseFloor(index) {
                this.thisFloorIndex = index;
                // 清空, 等待虚拟dom更新为dom
                this.$nextTick(() => {
                    for (let i = 0; i < this.$refs.chooseFloor.length; i++) {
                        this.$refs.chooseFloor[i].style.flexShrink = 1;
                    }
                    // 设置
                    this.$refs.chooseFloor[index].style.flexShrink = 0;
                });

                if (this.div) {
                    for (let i = 0; i < this.$refs.workPlace.length; i++) {
                        // 2020-06-13 linwenjun
                        this.$refs.workPlace[i].removeChild(this.div);
                        this.div = null;
                        this.changeComponentStyle('clear');
                    }
                }
            },
            // 添加楼层
            addFloor(index) {
                if (index >= 4) return;
                if(this.floorList.length <= 5) {
                    let length = this.nToc(this.floorList.length + 1);
                    let work1 = this.$refs.refWorkPlace
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
            /**
             * @author hfm
             */
            backClickEvent(event) {
                this.addActive(event, 'backBtnActive')
                this.open()
            },
            /**
            * @Description
            * @author HuangFangming
            * @date 2020/6/12
             * 弹窗
            */
            open() {
                sessionStorage.setItem('isEdit', true)
                this.$confirm('退出前必须先点击生成, 否则数据会丢失?', '提示', {
                    confirmButtonText: '生成',
                    cancelButtonText: '退出',
                    type: 'warning'
                }).then(() => {
                    this.generate(false)
                    this.$message({
                        type: 'success',
                        message: '生成成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'success',
                        message: '退出成功!'
                    });
                    this.$router.push({
                        path: '/index/scene'
                    })
                    localStorage.removeItem('floorList')
                    localStorage.removeItem('modelOptions')
                });

            },
            // 添加激活背景
            addActive(e, name) {
                this.clearActive(name);
                e.target.classList.add(name);
            },
            // 取消激活的背景
            clearActive(name) {

                // 2020-06-13 linwenjun
                // if(this.$refs.backBtn) {
                //     this.$refs.backBtn.classList.remove('backBtnActive');
                // }
                // if(this.$refs.help) {
                //     this.$refs.help.classList.remove('helpActive');
                // }

                // this.$refs.addFloor.classList.remove('addFloorActive');
                // let arr = this.$refs.layerFooterBox.children;
                // for (let i = 0; i < arr.length; i++) {
                //     arr[i].classList.remove('operation');
                // }
                // let arr2 = this.$refs.modelBoxC;
                // for (let i = 0; i < arr2.length; i++) {
                //     arr2[i].classList.remove('modelBoxBg');
                // }
                // if(this.$refs.operationBoradLRBorderActive1.length != 0) {
                //     this.$refs.operationBoradLRBorderActive1[this.thisFloorIndex].classList.remove('operationBoradLRBorderActive');
                // }
                //
                // if(this.$refs.operationBoradLRBorderActive2.length != 0) {
                //     this.$refs.operationBoradLRBorderActive2[this.thisFloorIndex].classList.remove('operationBoradLRBorderActive');
                // }

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
                this.mouseX = event.clientX;
                this.mouseY = event.clientY;
            },
            // 拖拽开始
            modelDragstartEvent(event, item) {
                this.addModule = true;
                this.dragItem = item;
                this.dom1Left = 0;
                this.dom1Top = 0;
                this.offset.x = event.offsetX;
                this.offset.y = event.offsetY - 15;
            },
            addModelOption() {
                let name = this.dragItem.name
                if(name === '货架' || name === '拣货通道' || name === 'PST通道') {
                    this.setModelOptions({
                        id: this.componentId,
                        name: this.dragItem.name,
                        shelvesNum: 1,
                        shevlesSpace: 90,
                        num: 1,
                        space: 90,
                        isDeleted: false,
                        border: '',
                    })
                } else if(name === '堆塔') {
                    this.setModelOptions({
                        id: this.componentId,
                        name: this.dragItem.name,
                        boxColumns: 1,
                        boxSpace: 62,
                        num: 1,
                        space: 62,
                        isDeleted: false,
                        border: '',
                    })
                } else if(name === '轨道') {
                    this.setModelOptions({
                        id: this.componentId,
                        name: this.dragItem.name,
                        trackNum: 1,
                        trackWidth: '2.8vw',
                        num: 1,
                        space: 62,
                        isDeleted: false,
                        border: '',
                    })
                } else {
                    this.setModelOptions({
                        id: this.componentId,
                        name: this.dragItem.name,
                        num: 1,
                        space: 62,
                        isDeleted: false,
                        border: '',
                    })
                }
            },
            // 生成 uuid
            uuid() {
                var s = [];
                var hexDigits = "0123456789abcdef";
                for (var i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";

                var uuid = s.join("");
                return uuid;
            },
            // 拖拽生成模型
            workDropEvent(event) {
                if (this.addModule) {
                    this.componentId = this.uuid()
                    // this.componentIds.push(this.componentId)
                    this.addModelOption()
                    this.getParentTag(this.$refs.workPlace[this.thisFloorIndex]);
                    let left = event.clientX - this.dom1Left;
                    let top = event.clientY - this.dom1Top;
                    let items = this.floorList[0].componentList[0].itemList
                    for (let i = 0; i < items.length; i++) {
                        let item = items[i]
                        item.isSelected = false
                    }
                    sessionStorage.setItem('isDrag', true)
                    if (this.dragItem.width) {
                        this.floorList[0].componentList[0].itemList.push({
                            id: this.componentId,
                            name: this.dragItem.componentName,
                            modelName: this.dragItem.name,
                            // left: left,
                            // top: top,
                            // 解决删除布局错乱
                            left: left - this.offset.x + this.scrollLeft,
                            top: top - this.offset.y + this.scrollTop,
                            bgImg: this.dragItem.bgImg,
                            width: this.dragItem.width,
                            height: this.dragItem.height,
                            offsetParentLeft: this.dom1Left / this.docWidth,
                            offsetParentTop: this.dom1Top / this.docHeight,
                            border: '',
                            offset: {
                                x: this.offset.x,
                                y: this.offset.y
                            },
                            generateModelName: this.dragItem.name,
                            isDeleted: false,
                            isSelected: true,
                            isDrag: true,
                        });
                    } else {
                        this.floorList[0].componentList[0].itemList.push({
                            id: this.componentId,
                            name: this.dragItem.componentName,
                            modelName: this.dragItem.name,
                            left: left + this.scrollLeft,
                            top: top + this.scrollTop,
                            border: '',
                            bgImg: this.dragItem.bgImg,
                            offsetParentLeft: this.dom1Left / this.docWidth,
                            offsetParentTop: this.dom1Top / this.docHeight,
                            offset: {
                                x: this.offset.x,
                                y: this.offset.y
                            },
                            generateModelName: this.dragItem.name,
                            isDeleted: false,
                            isSelected: true,
                            isDrag: true,
                        });
                    }

                    // 否则就是添加单元的工具
                    this.unitList[this.clickIndex].infoList.push({
                        id: this.componentId,
                        name: this.dragItem.name,
                        isDeleted: false,
                        border: '',
                    });
                    this.unitList = [...this.unitList];
                    this.setModelBorder()
                    let index = this.floorList[0].componentList[0].itemList.length - 1
                    this.floorList[0].unitList[0].infoList[index].border = '0.05vw solid rgba(230, 162, 64, 1)'
                }
            },
            // 拖拽结束
            modelDragendEvent(event) {
                let left = this.getPsbPos.left
                let top = this.getPsbPos.top
                if (this.getPositions.length > 0 && this.dragItem.name === 'PSB') {
                    let width = this.$vwToPx(this.getTrackWidth.width.replace('vw', ''));
                    let widthSplit = this.$vwToPx(parseInt(this.getTrackWidth.width.replace('vw', '')) / this.getTrackWidth.num);
                    let height = this.getPositions[this.getPositions.length - 1].top - this.getPositions[0].top;
                    // let this.getPositions.length
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
                        let levelPos = -1;
                        let verticalPos = -1;
                        if (posLeft <= left && left + psbWidth < width + posLeft && posTop <= top && top + psbHeight < posTop + height) {
                            for (let i = 0; i < this.getTrackWidth.num; i++) {
                                let bool = posLeft + widthSplit * i <= left && left + psbWidth <= posLeft + widthSplit * (i + 1);
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
                }
                this.draggable = false;
                this.addModule = false;
                this.updataDate()
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

                // 2020-06-13 linwenjun
                this.floorList[this.thisFloorIndex].unitList.forEach((item, index) => {
                    item.infoList.forEach((itemChild, indexChild) => {
                        if (this.$refs[`rorateChildIcon${index}-${indexChild}`][0].classList.contains('border-style')) {
                            this.$refs[`rorateChildIcon${index}-${indexChild}`][0].classList.remove('border-style');
                        }
                    });
                });

            },
            // 展示子图层
            childOpenIcon(e, childIndex, index) {

                // 2020-06-13 linwenjun
                this.floorList[this.thisFloorIndex].unitList.forEach((item, index) => {
                    item.infoList.forEach((itemChild, indexChild) => {
                        if (this.$refs[`rorateChildIcon${index}-${indexChild}`][0].classList.contains('border-style')) {
                            this.$refs[`rorateChildIcon${index}-${indexChild}`][0].classList.remove('border-style');
                        }
                    });
                });

                // 修改父级的索引标志, 来显示或隐藏边框
                this.clickIndex = index; // 保存点击的图层
                this.clickChildIndex = childIndex; // 保存点击的子图层
                // 点击的元素添加类名 rorateChildIcon是所有的图层子项, 需要运算
                // this.$refs[`rorateChildIcon${this.clickIndex}-${this.clickChildIndex}`][0].classList.add('border-style');
            },
            // 拖拽工作事件
            getParentTag(dom, arg = 'default') {
                // 传入标签是否是DOM对象
                if (!(dom instanceof HTMLElement)) return console.error('receive only HTMLElement');
                // 父级标签是否是body,是着停止返回集合,反之继续
                if (dom.offsetParent !== null) {
                    if (arg == 'default') {
                        this.dom1Top += dom.offsetTop * 1;
                        this.dom1Left += dom.offsetLeft * 1;
                    } else if (arg == 'dom2') {
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
            delLayer(id) {
                let infoList = this.floorList[0].unitList[0].infoList
                if (infoList.lenght != 0) {
                    let infos = this.floorList[0].unitList[0].infoList
                    let arrayIndex = this.getIndexFromId(infos, id)
                    this.floorList[0].unitList[0].infoList[arrayIndex].isDeleted = true
                }
                if (this.floorList[0].componentList[0].itemList != 0) {
                    let index = this.getIndexFromId(this.floorList[0].componentList[0].itemList, id)
                    // this.floorList[this.thisFloorIndex].componentList[this.clickIndex].itemList.splice(this.selectedIndex, 1);
                    this.floorList[0].componentList[0].itemList[index].isDeleted = true
                } else {
                    // console.log(this.floorList[this.thisFloorIndex].componentList)
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
                // console.log(this.floorList[this.thisFloorIndex].componentList);
            },
            // 选中子图层
            changeChildIndex(indexChild, index) {
                this.clickChildIndex = indexChild;
                this.clickIndex = index;
                // this.childOpenIcon([`rorateChildIcon${this.clickIndex}-${this.clickChildIndex}`][0], indexChild, index);
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
                        // console.log(allDom[j])
                        this.getParentTag(allDom[j], 'dom2');
                        // console.log(this.dom2Top > this.startTop &&
                        //     this.dom2Left > this.startLeft &&
                        //     this.endRight > this.dom2Left + allDom[j].offsetWidth &&
                        //     this.endBottom > this.dom2Top + allDom[j].offsetHeight)
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
                // console.log(allComponents);
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

                for (let i = 0; i < this.selectModuleList.length; i++) {
                    this.selectModuleList[i].style.left = this.selectModuleLeftTopList[i].left + left + 'px';
                    this.selectModuleList[i].style.top = this.selectModuleLeftTopList[i].top + top + 'px';
                }
            },
            // 校准轨道
            correctTracks(trackList, array) {
                let width = 0
                // 获取 width
                if(array.length > 0) {
                    let arr = this.recursionList(array)
                    width = Number(arr[arr.length - 1].style.left.replace('px', '')) - Number(arr[0].style.left.replace('px', ''))
                }
                let tracks = this.recursionList(trackList)
                let allWidth = 0
                for (let i = 0; i < tracks.length; i++) {
                    let w = this.$vwToPx(Number(tracks[i].style.width.replace('vw', '')))
                    allWidth = allWidth + w
                }
                // if(allWidth >= width) {
                //     for (let i = 0; i < tracks.length - 1; i++) {
                //         let left = Number(tracks[i].style.left.replace('px', ''))
                //         let width = this.$vwToPx(Number(tracks[i].style.width.replace('vw', '')))
                //         tracks[i + 1].style.left = (left + width - 14) + 'px'
                //     }
                // } else {
                //     if(tracks.length > 1) {
                //         tracks[tracks.length - 1].style.width = width - allWidth + 'px'
                //     } else if(length == 1){
                //         tracks[0].style.width = width + 'px'
                //     }
                // }
                if (tracks.length > 0) {
                    tracks[0].style.left = this.$vwToPx(17.3) + 'px'
                }
                for (let i = 0; i < tracks.length - 1; i++) {
                    let left = Number(tracks[i].style.left.replace('px', ''))
                    let width = this.$vwToPx(Number(tracks[i].style.width.replace('vw', '')))
                    tracks[i + 1].style.left = (left + width - 30) + 'px'
                }
            },
            // 校准所有元素高度
            correctAllTop(arr, top) {
                for (let i = 0; i < arr.length; i++) {
                    let a = arr[i]
                    let name = a.dataset.name
                    if(name === '轨道' || name === '货架' || name === '工作站' || name === 'PST通道' || name === '拣货通道') {
                        a.style.top = top + 'px'
                    } else if(name === '堆塔') {
                        a.style.top = top + 20 + 'px'
                    }
                }
            },
            //  校准所有元素的左边
            correctAllLeft(array, trackList) {
                let tracks = this.recursionList(trackList)
                let arrs = this.recursionList(array)
                if(arrs.length > 0) {
                    arrs[0].style.left = tracks[0].style.left  || '50px'
                    for (let i = 0; i < arrs.length - 1; i++) {
                        let arr = arrs[i]
                        let left = Number(arr.style.left.replace('px', ''))
                        let width = Number(arr.style.width.replace('px', ''))
                        let name = arr.dataset.name
                        arrs[i + 1].style.left = left + width + 7.6 + 'px'
                    }
                }
            },
            // 校准所有 psb
            correctAllPsb(array, wall) {
                if(array.length > 0 && wall !== undefined) {
                    let left = Number(wall.style.left.replace('px', '')) || 50
                    let top = Number(wall.style.top.replace('px', '')) + 20 || 50
                    let width = Number(wall.style.width.replace('px', '')) || 50
                    if(array.length > 0) {
                        let psbWidth = this.$vwToPx(Number(array[0].style.width.replace('vw', ''))) || 38
                        let psbLeft = (width - psbWidth) / 2 || 20
                        for (let i = 0; i < array.length; i++) {
                            let arr = array[i]
                            arr.style.left = left + psbLeft + 'px'
                            arr.style.top = top + i * 80 + 'px'
                            arr.style.zIndex = 99
                        }
                    }
                }

            },
            // 校准所有 box
            correctAllBox(array, shelves) {
                if(array.length > 0 && shelves.length > 0) {
                    let width = 46
                    // let boxWidth = this.$vwToPx(Number(array[0].style.width.replace('vw', ''))) || 26
                    // let boxLeft = (width - boxWidth) / 2
                    // for (let i = 0; i < array.length; i++) {
                    //     let left = Number(shelves[i].style.left.replace('px', '')) || 50
                    //     let arr = array[i]
                    //     // if(i > shelves.length) {
                    //     //     arr.style.left = left + boxLeft + (i - shelves.length) * boxWidth + 'px'
                    //     // }
                    //     arr.style.left = left + boxLeft + 'px'
                    // }
                }
            },
            // 获取 station array
            getStationArray(arrs) {
                let result = []
                let rs = []
                let indexs = []
                for (let i = 0; i < arrs.length; i++) {
                    let a = arrs[i]
                    let name = a.dataset.name
                    if (name === '工作站') {
                        result.push(i + 1)
                    }
                }
                for (let j = result[0] - 1; j >= 0; j--) {
                    let arr = arrs[j]
                    let name = arr.dataset.name
                    let index = Number(arr.dataset.index)
                    if (name === '拣货通道') {
                        rs.push(j)
                        indexs.push(index)
                        break
                    }
                }
                for (let i = 0; i < result.length; i++) {
                    let last = result[i]
                    let next = result[i + 1]

                    for (let j = last; j < next; j++) {
                        let arr = arrs[j]
                        let name = arr.dataset.name
                        let index = Number(arr.dataset.index)
                        if (name === '拣货通道') {
                            rs.push(j)
                            indexs.push(index)
                            break
                        }
                    }
                }
                // for (let j = result[result.length - 1]; j < arrs.length; j++) {
                //     let arr = arrs[j]
                //     let name = arr.dataset.name
                //     let index = Number(arr.dataset.index)
                //     if(name === '拣货通道') {
                //         rs.push(j)
                //         indexs.push(index)
                //         break
                //     }
                // }
                return {
                    pickWays: rs,
                    pickIndexs: indexs,
                }
            },
            // 校准分拣员和推车
            correctPeopleAndCar(arr, peopleArr, carArr) {
                let arrs = this.recursionList(arr)
                // let peoples = this.recursionList(peopleArr)
                let peoples = peopleArr
                let cars = carArr
                // let cars = this.recursionList(carArr)
                this.peoplePos = this.getStationArray(arrs)
                console.log('this peoples pos', this.peoplePos)
                // this.peoplePos.pickWays.pop()
                let result = this.peoplePos.pickWays
                // 校准 people
                if(arrs.length > 0 && peoples.length > 0) {
                    for (let j = 0; j < peoples.length; j++) {
                        let re = result[j]
                        if(re !== undefined) {
                            let left = Number(arrs[re].style.left.replace('px', ''))
                            let top = Number(arrs[re].style.top.replace('px', ''))
                            peoples[j].style.left = left + 14 + 'px'
                            peoples[j].style.top = top + 230 + 'px'
                            peoples[j].style.zIndex = this.getZIndex + 1
                            this.setZIndex(this.getZIndex + 1)
                        }
                    }
                }
                // 校准 car
                if(arrs.length > 0 && cars.length > 0) {
                    console.log('result', result)
                    for (let j = 0; j < cars.length; j++) {
                        let re = result[j]
                        if(re !== undefined) {
                            let left = Number(arrs[re].style.left.replace('px', ''))
                            let top = Number(arrs[re].style.top.replace('px', ''))
                            cars[j].style.left = left + 14 + 'px'
                            cars[j].style.top = top + 260 + 'px'
                            cars[j].style.zIndex = this.getZIndex + 1
                            this.setZIndex(this.getZIndex + 1)
                        }
                    }
                }
            },
            // 获取模型数据
            getModelArray() {
                let modelDoms = this.recursionList(Array.from(this.getAllDom()))
                let result = []     // 货架数组
                let psbs = []       // psb 数组
                let peoples = []    // 分拣员数组
                let peopleDoms = []
                let cars = []       // 小车 数组
                let carDoms = []
                let psts = []       // pst 数组
                let k = 0
                let x = 1
                for (let i = 0; i < modelDoms.length; i++) {
                    let model = modelDoms[i]
                    let name = model.dataset.name
                    let num = Number(model.dataset.num)
                    if(model.dataset.num == undefined) {
                        num = 1
                    }
                    // console.log('num', num, model)
                    /**
                     *  2020/11/25 11:53
                     *  author hfm
                     *  name: 'station', // 名称
                     *  num: 1,         // 模型数量
                     *  space: 60,      // 2d 编辑器的间距
                     *  x: x,           // 生成模型的位置下标
                     *  index: index,   // 拖进画布的顺序
                     *
                     */
                    let index = Number(model.dataset.index)
                    let deleted = Boolean(model.dataset.deleted)
                    if(!deleted) {
                        if(name === '工作站') {
                            result.push({
                                name: 'station',
                                num: 1,
                                space: 60,
                                x: x,
                                index: index,
                            })
                            x = x + 1
                        } else if(name === '货架') {
                            result.push({
                                name: 'shelve',
                                num: num,
                                space: Number(model.dataset.space) - 46 || 0,
                                x: x,
                                index: index,
                            })
                            x = x + num
                        } else if(name === 'PST通道') {
                            result.push({
                                name: 'pstWay',
                                num: num,
                                space: Number(model.dataset.space) - 46 || 0,
                                x: x,
                                index: index,
                            })
                            psts.push({
                                name: 'pstWay',
                                num: num,
                                space: Number(model.dataset.space) - 46 || 0,
                                x: x,
                                index: index,
                            })
                            x = x + num
                        } else if(name === '拣货通道') {
                            result.push({
                                name: 'pickWay',
                                num: num,
                                space: Number(model.dataset.space) - 46 || 0,
                                x: x,
                                index: index,
                            })
                            x = x + num
                        } else if(name === 'PSB') {
                            psbs.push({
                                name: 'psb',
                                z: k,
                                index: index,
                            })
                            k += 1
                        } else if(name === '分拣员') {
                            peopleDoms.push({
                                name: 'people',
                                x: x,
                                index: index,
                            })
                        } else if(name === '推车') {
                            carDoms.push({
                                name: 'car',
                                x: x,
                                index: index,
                            })
                        }
                    }
                }

                let people_len = 0
                if(peopleDoms.length >= carDoms.length) {
                    people_len = peopleDoms.length
                } else {
                    people_len = carDoms.length
                }
                for (let i = 0; i < result.length; i++) {
                    let re = result[i]
                    let index = re.index
                    for (let j = 0; j < people_len; j++) {
                        let pickIndex = this.peoplePos.pickIndexs[j]
                        let num = re.num
                        let value = re.x

                        if(index == pickIndex) {
                            peoples.push({
                                name: 'people',
                                x: value,
                                num: num,
                            })
                        }
                    }
                }
                return {
                    index: Number(this.$route.query.index),
                    shelve: result,
                    psb: psbs,
                    peoples: peoples,
                    psts: psts,
                }
            },
            // 冒泡排序 排序 people car
            sortArray(sorterList) {
                let result = []
                for (let i = 0; i < sorterList.length - 1; i++) {
                    for (let j = 0; j < sorterList.length - i - 1; j++) {
                        let last = sorterList[j]
                        let next = sorterList[j + 1]
                        let lastIndex = last.index
                        let nextIndex = next.index
                        if(lastIndex > nextIndex) {
                            let temp = sorterList[j]
                            sorterList[j] = sorterList[j + 1]
                            sorterList[j + 1] = temp
                        }
                    }
                }
                for (let i = 0; i < sorterList.length; i++) {
                    let sort = sorterList[i].element
                    result.push(sort)
                }
                return result
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
                // 冒泡 ： 从左到右排序
                let arr = this.recursionList(Array.from(this.getAllDom()))
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
                let stationWays = []
                arr.forEach((item, index) => {
                     // 查找播种墙是否存在, 只获取第一个
                    if(arr[index].dataset['name'] == '工作站') {
                        isSeedingWall = true;
                        seedingWallList.push(arr[index])
                        firstSeedingWall = seedingWallList[0]
                    } else if(arr[index].dataset['name'] == '轨道') {
                        isTrack = true;
                        TrackList.push(arr[index])
                        // console.log('轨道已存在', TrackList)
                    } else if(arr[index].dataset['name'] == 'PSB') {
                        isPSB = true;
                        PSBList.push(arr[index])
                        // console.log('psb已存在', PSBList)
                    } else if(arr[index].dataset['name'] == '货架') {
                        isGoodsShelves = true;
                        goodsShelvesList.push(arr[index])
                    } else if(arr[index].dataset['name'] == '堆塔') {
                        isHeapedTower = true;
                        heapedTowerList.push(arr[index])
                    } else if(arr[index].dataset['name'] == '分拣员') {
                        isSorter = true;
                        sorterList.push({
                            element: arr[index],
                            index: Number(arr[index].dataset.index)
                        })
                    } else if(arr[index].dataset['name'] == '推车') {
                        isGardenCart = true
                        gardenCartList.push({
                            element: arr[index],
                            index: Number(arr[index].dataset.index)
                        })
                    }
                    let name = arr[index].dataset['name']
                    if(name === '货架' || name === '工作站' || name === 'PST通道' || name === '拣货通道') {
                        stationWays.push(arr[index])
                    }
                })
                this.stations = stationWays
                // 排序 people car
                let peoples = this.sortArray(sorterList)
                let cars = this.sortArray(gardenCartList)
                // 校准轨道
                this.correctTracks(TrackList, arr)
                // 校准高度
                this.correctAllTop(arr, 18)
                // 校准左边的位置
                this.correctAllLeft(stationWays, TrackList)
                // 校准psb
                this.correctAllPsb(PSBList, firstSeedingWall)
                // 校准 box
                this.correctAllBox(heapedTowerList, goodsShelvesList)
                // 校准 people and car
                this.correctPeopleAndCar(stationWays, peoples, cars)

                this.updataDate()

                this.setBorderStyle(this.selectedId)
                localStorage.setItem('floorList', JSON.stringify(this.floorList))
            },
            // px 转 number
            pxToNum(px) {
                let num = px.replace("px", "") * 1;
                return num;
            },
            // 以元素的 left 进行冒泡排序
            recursionList(Arr) {
                for (let i = 0; i < Arr.length; i++) {
                    for (let j = 0; j < Arr.length - 1; j++) {
                        // 对所有模型进行排列(left)
                         if (this.pxToNum(Arr[j].style.left) > this.pxToNum(Arr[j + 1].style.left)) {
                            let temp = Arr[j];
                            Arr[j] = Arr[j + 1];
                            Arr[j + 1] = temp;
                        }
                    }
                }
                return Arr
            },
            download(name, data) {
                var urlObject = window.URL || window.webkitURL || window;

                var downloadData = new Blob([data]);

                var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
                save_link.href = urlObject.createObjectURL(downloadData);
                save_link.download = name;
                save_link.click();
            },
            // 生成
            generate(msgBool=true) {
                // 生成之前先校准
                this.calibration()
                // 生成3d模型需要的数组
                // this.modelData.push(this.getModelArray())
                // let index = Number(this.$route.query.index) - 1
                this.modelData = this.getModelArray()

                console.log('this model Data', this.modelData)
                // this.download('floorList.json', JSON.stringify(this.floorList, null, 4))
                // this.download('modelOptions.json', JSON.stringify(this.modelOptions, null, 4))
                // this.download('modelData.json', JSON.stringify(this.modelData, null, 4))

                // modelData 是生成模型所需的数据
                // floorList 是初始化 2d 编辑器 画布上所生成的组件
                localStorage.setItem('modelData', JSON.stringify(this.modelData))
                if (this.$route.query.index == 1) {
                    localStorage.setItem('floorListF1', JSON.stringify(this.floorList))
                    localStorage.setItem('modelOptionsF1', JSON.stringify(this.modelOptions))
                    localStorage.setItem('modelDataF1', JSON.stringify(this.modelData))
                } else if (this.$route.query.index == 2) {
                    localStorage.setItem('floorListF2', JSON.stringify(this.floorList))
                    localStorage.setItem('modelOptionsF2', JSON.stringify(this.modelOptions))
                    localStorage.setItem('modelDataF2', JSON.stringify(this.modelData))
                }
                return this.modelData
                // if(msgBool) {
                //     this.$message({
                //         showClose: true,
                //         message: '生成成功',
                //         type: 'success',
                //     });
                // }
            },
            getIndexFromId(array, selectedId) {
                // console.log('selectedId', selectedId)
                let index = -1
                for (let i = 0; i < array.length; i++) {
                    let re = array[i]
                    if(re.id === selectedId) {
                        index = i
                    }
                }
                return index
            },
            // 删除模型
            removeModel(id) {
                let result = this.getModelOption
                let index = this.getIndexFromId(result, id)
                if (index !== -1) {
                    // console.log('result', result, index)
                    result[index].isDeleted = true
                    this.setOptions(result)
                    this.delLayer(id);
                    this.updataDate()
                    this.borderStyle = {}
                }
            },
            deleteClickEvent(event) {
                // this.addActive(event, 'operation');
                this.removeModel(this.selectedId)
            },
            // 当前画布图层按键删除 监听 delete 和 退格键
            remove() {
                let self = this;
                window.addEventListener('keydown', function (event) {
                    let key = event.key;
                    if (key === 'Delete') {
                        self.removeModel(self.selectedId)
                    }
                });
            },
            setNumOrSpace(num, space) {
                // let option = this.getArrayFromUUID(this.getModelOption, this.selectedId)
                let option = this.getModelOption[this.selectedIndex]
                if (num >= 100) {
                    let width = this.width * (Number(num) + 10) / 100
                    this.width = width
                    this.$nextTick(function () {
                        this.drawGrid(this.width, this.height, width / 30);
                        this.drawRules(1000, this.width)
                        this.floorList[0].width = this.width;
                        this.floorList[0].height = this.height;
                        this.floorList[0].num = this.width / 30;
                        localStorage.setItem('floorList', JSON.stringify(this.floorList))
                    })
                }
                if (this.posNum == '') {
                    if (option['num'] !== -1) {
                        num = option.num
                    } else {
                        num = 1
                    }
                }
                // if (this.posSpace == '') {
                //     if (option['space'] !== -1) {
                //         space = option.space
                //     } else {
                //         space = 65
                //     }
                // }
                space = 54
                num = Number(num)
                if (this.selectedElement.classList.contains('track-list')) {
                    this.setModelOptions({
                        id: option.id,
                        trackWidth: num * 53 + 'px',
                        trackNum: parseInt(num),
                        num: num,
                        index: this.selectedIndex,
                        space: space,
                        name: '轨道',
                        isDeleted: false,
                    })
                    this.floorList[0].componentList[0].itemList[this.selectedIndex].trackWidth =  num * 53 + 'px'
                    this.floorList[0].componentList[0].itemList[this.selectedIndex].trackNum = parseInt(num)
                } else if(this.selectedElement.classList.contains('shelves')) {
                    this.setModelOptions({
                        id: option.id,
                        shelvesNum: parseInt(num),
                        shevlesSpace: parseInt(space),
                        name: '货架',
                        num: num,
                        space: space,
                        index: this.selectedIndex,
                        isDeleted: false,
                    })
                    this.floorList[0].componentList[0].itemList[this.selectedIndex].shelvesNum = parseInt(num)
                    this.floorList[0].componentList[0].itemList[this.selectedIndex].shevlesSpace = parseInt(space)
                } else if(this.selectedElement.classList.contains('box')) {
                    this.setModelOptions({
                        id: option.id,
                        boxColumns: parseInt(num),
                        boxSpace: parseInt(space),
                        num: num,
                        space: space,
                        index: this.selectedIndex,
                        name: '堆塔',
                        isDeleted: false,
                    })
                    this.floorList[0].componentList[0].itemList[this.selectedIndex].boxColumns = parseInt(num)
                    this.floorList[0].componentList[0].itemList[this.selectedIndex].boxSpace = parseInt(space)
                } else if(this.selectedElement.classList.contains('toolBZQ')) {
                    this.setModelOptions({
                        id: option.id,
                        stationNum: parseInt(num),
                        stationSpace: parseInt(space),
                        name: '通道',
                        num: num,
                        space: space,
                        index: this.selectedIndex,
                        isDeleted: false,
                    })
                    this.floorList[0].componentList[0].itemList[this.selectedIndex].stationNum = parseInt(num)
                    this.floorList[0].componentList[0].itemList[this.selectedIndex].stationSpace = parseInt(space)
                }
            },
            updateModelData(event) {
                let name = event.target.name
                if(name === 'left') {
                    if(this.posLeft !== '') {
                        this.selectedElement.style.left = `${this.posLeft}px`
                    }
                } else if(name === 'top') {
                    if(this.posTop !== '') {
                        this.selectedElement.style.top = `${this.posTop}px`
                    }
                } else if(name === 'num') {
                    if(this.posNum !== '') {
                        this.setNumOrSpace(this.posNum)
                    }
                } else if(name === 'space') {
                    // if(this.posSpace !== '') {
                    //     this.setNumOrSpace(this.posNum, this.posSpace)
                    // }
                }
                this.updataDate()
            },
            enterKeyEvent(event) {
                this.updateModelData(event)
            },
            // 输入框失去焦点事件
            inputBlurEvent(event) {
                this.updateModelData(event)
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
                this.posSpace = ''
            },
            // 全局鼠标按下事件
            editMouseEvent(event) {
                let bool = this.findElement(event.path, 'posContent')
                let hasTip = this.findElement(event.path, 'tip-main')
                if (!hasTip) {
                    this.tipShow = false
                }
                if (!bool) {
                    this.posContent.none = true
                    let inputs = document.querySelectorAll('.classInput')
                    for (let i = 0; i < inputs.length; i++) {
                        let input = inputs[i]
                        input.blur()
                    }
                    // this.setAllValue()
                }
            },
            updated() {
                this.updataDate()
            },
            updataDate() {
                let arr2 = Array.from(this.getAllDom())
                this.floorList[this.thisFloorIndex].componentList[this.clickIndex].itemList.forEach((item, index) => {
                    for (let i = 0; i < arr2.length; i++) {
                        let arr = arr2[i]
                        let id = arr.dataset.id
                        if(id === item.id) {
                            item.left = this.pxToNum(arr.style.left)
                            item.top = this.pxToNum(arr.style.top)
                            item.leftStyle = this.pxToNum(arr.style.left)
                            item.topStyle = this.pxToNum(arr.style.top)
                        }
                    }
                })
                localStorage.setItem('floorList', JSON.stringify(this.floorList))
            },
            handleScrollEvent(event) {
                let editContent = this.$refs.editContent
                this.scrollTop = editContent.scrollTop
                this.scrollLeft = editContent.scrollLeft
            },
            setInputClass(bool) {
                for (let i = 0; i < this.inputClass.length; i++) {
                    let input = this.inputClass[i]
                    input.inputActive = bool
                }
            },
            // input 的 点击事件
            posClickEvent(event) {
                console.log('event', event.target.name)
                let name = event.target.name
                this.setInputClass(false)
                if (name === 'left') {
                    this.inputClass[0].inputActive = true
                } else if (name === 'top') {
                    this.inputClass[1].inputActive = true
                } else if (name === 'num') {
                    this.inputClass[2].inputActive = true
                } else if (name === 'space') {
                    this.inputClass[3].inputActive = true
                }
            },
            // 完成 退出按钮点击事件
            btnEvent(index) {
                if (index == 0) {
                    this.calibration()
                    sessionStorage.setItem('isEdit', true)
                    let modelData = this.generate()
                    localStorage.setItem('modelData', JSON.stringify(modelData))
                    localStorage.setItem('floorList', JSON.stringify(this.floorList))
                    localStorage.setItem('modelOptions', JSON.stringify(this.getModelOption))
                    this.$router.push({
                        path: '/index/scene'
                    })
                    // this.tipShow = true
                } else if (index == 1) {
                    sessionStorage.setItem('isEdit', true)
                    localStorage.removeItem('floorList')
                    localStorage.removeItem('modelOptions')
                    this.$router.push({
                        path: '/index/scene',
                    })
                }
            },
            // 关闭弹窗点击事件
            closeTip() {
                this.tipShow = false
            },
            formatTime(str) {
                let s = String(str);
                if (s.length == 1) {
                    s = '0' + s;
                }
                return s;
            },
            getDate(date) {
                let year = date.getFullYear();
                let mon = date.getMonth() + 1;
                let day = date.getDate();
                let hour = date.getHours();
                let min = date.getMinutes();
                return `${year}/${this.formatTime(mon)}/${this.formatTime(day)} ${this.formatTime(hour)}:${this.formatTime(min)}`;
            },
            // 是否立即生成 点击事件
            tipBtnClickEvent(bool) {
                this.tipShow = false
                if (bool) {
                    let modelData = this.generate()
                    sessionStorage.setItem('enteredIndex', true)
                    sessionStorage.setItem('fromEdit', true)
                    sessionStorage.setItem('isEdit', true)
                    let projectData = JSON.parse(sessionStorage.getItem('projectData'))
                    let d = new Date();
                    let time = this.getDate(d);
                    console.log('projectData', projectData)
                    let index = this.$route.query.index - 1
                    projectData.sceneOption[index].stationNum = Number(this.stationNum)

                    let data = {
                        projectName: projectData.projectName,
                        areaInfo: [{
                            // 总面积的长宽
                            value: {
                                width: projectData.areaInfo[0].value.width,
                                height: projectData.areaInfo[0].value.height,
                            }
                        }, {
                            // 使用面积的长宽
                            value: {
                                width: projectData.areaInfo[0].value.width,
                                height: projectData.areaInfo[0].value.height,
                            }
                        },],
                        nowTime: time,
                        sceneOption: projectData.sceneOption,
                        whalehouseID: projectData.whalehouseID,
                        requestUrl: projectData.requestUrl,
                        modelData: modelData,
                        machineInfo: [{
                            value: projectData.machineInfo[0].value
                        },
                            {
                                value: projectData.machineInfo[1].value
                            },
                            {
                                value: projectData.machineInfo[2].value
                            },
                            {
                                value: projectData.machineInfo[3].value
                            },
                        ],
                    }
                    localStorage.setItem('currentProjectData', JSON.stringify(data))
                    // this.creatProjectData(data);
                    // this.$router.push({
                    //     path: '/preview'
                    // })
                    this.$router.push({
                        path: '/index/scene'
                    })
                }
            },
            setModelBorder() {
                for (let i = 0; i < this.floorList[0].unitList[0].infoList.length; i++) {
                    // let info = this.$refs[`modelName${i}`]
                    // if (info !== undefined) {
                    //     info[0].style.border = ''
                    // }
                    let info = this.floorList[0].unitList[0].infoList[i]
                    info.border = ''
                }
            },
            // 显示 border 边框
            showBorder(index) {
                // let model = this.$refs[`modelName${index}`]
                this.setModelBorder()
                this.floorList[0].unitList[0].infoList[index].border = '0.05vw solid rgba(230, 162, 64, 1)'
                // if (model !== undefined) {
                //     model[0].style.border = '0.05vw solid rgba(230, 162, 64, 1)'
                // }
            },
            setBorderStyle(id) {
                let items = this.floorList[0].componentList[0].itemList
                for (let i = 0; i < items.length; i++) {
                    let item = items[i]
                    console.log('item.heightStyle', item.heightStyle)
                    if (item.id == id) {
                        item.isSelected = true
                        this.key = this.uuid()
                        this.$nextTick(() => {
                            this.borderStyle = {
                                width: item.widthStyle,
                                height: Number(item.heightStyle.replace('px', '')) + 3 + 'px',
                                top: item.topStyle - 2 + 'px',
                                left: item.leftStyle - 2 + 'px',
                            }
                        })


                    } else {
                        item.isSelected = false
                    }
                }
            },
            // 点击图层中的名字
            modelNameClickEvent(id, index) {
                this.showBorder(index)
                this.setBorderStyle(id)
            },
            removeClickEvent(id, index) {
                this.removeModel(id)
            },
        },
        beforeDestroy() {
            // localStorage.removeItem('floorList')
            // localStorage.removeItem('modelOptions')
            // console.log('floorList', this.floorList)
        },
        beforeUpdate() {
            // console.log('floorList', this.floorList[0].componentList[0].itemList)
        },
        watch: {
            selectedElement: {
                handler(val, old) {
                    // if(val != null) {
                    //     this.setZIndex(this.getZIndex + 1)
                    // }
                }
            },
            borderStyle: {
                handler(val, old) {
                    // console.log('val', val, old)
                }
            },
        }
    };
</script>

<style lang="scss" scoped>
    .edit2 {
        width: 100%;
        display: flex;

        /*滚动条整体样式*/
        ::-webkit-scrollbar {
            width: 14px !important;
            height: 14px !important;
            background: #ffffff !important;
            cursor: pointer !important;
        }

        ::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            /*border-radius: 14px !important;*/
            background: #414141 !important;
            cursor: pointer !important;
        }

        ::-webkit-scrollbar-track {
            /*滚动条里面轨道*/
            border-radius: 0 !important;
            background-color: #262626;
            cursor: pointer !important;
        }

        ::-webkit-scrollbar-corner {
            background-color: #262626;
        }

        // 模型库
        .modelBase {
            .modelBaseTitle {
                width: 14.58vw;
                height: 3.7vh;
                background-color: rgba(74, 76, 82, 1);
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
                    font-size: 0.94vw;
                    font-weight: normal;
                    font-stretch: normal;
                    line-height: 0.9vw;
                    letter-spacing: 0vw;
                    color: #fffcfc;
                }
            }

            .modelBaseContent {
                width: 14.58vw;
                height: calc(93.1vh - 3.7vh);
                background-color: #262626;
                display: flex;
                flex-wrap: wrap;
                align-content: flex-start;
                padding-left: 0.75vw;

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
                        cursor: pointer;
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
            width: 72.05vw;
            margin-left: 0.2vw;
            background-color: black;

            .floorTitle {
                height: 3.7vh;
                width: 72.05vw;
                display: flex;


                .floorTitleLeft {
                    width: 72.25vw;
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
                width: 72.05vw;
                height: 92.73vh;
                overflow: scroll;
                /*overflow-y: hidden;*/
                background: #101012;

                .border {
                    position: absolute;
                    border: 0.05vw solid rgba(255, 172, 41, 1);
                }
            }

            .class-workPlace {
                position: absolute;
                z-index: 0;
            }
            .floorContent {
                height: calc(93.1vh - 3.7vh);
                width: calc(51.9vw + 15.4vw);
                /*background: url('~@/assets/2dEdit/2dBg.jpg');*/
                /*background: black;*/
                background-size: 95% 100%;
                position: relative;

                .operationBorad {
                    width: 6.04vw;
                    height: 1.56vw;
                    position: fixed;
                    left: 46.98vw;
                    bottom: 6.94vh;
                    background: rgba(255, 172, 41, 1);
                    text-align: center;

                    div {
                        line-height: 1.56vw;

                        img {
                            width: 0.78vw;
                            height: 0.78vw;
                            vertical-align: sub;
                        }

                        span {
                            margin-left: 0.57vw;
                            color: #272525;
                            opacity: 0.8;
                            font-family: SourceHanSansCN-Regular;
                        }
                    }

                    &:hover {
                        cursor: pointer;
                        background: #ffb129;
                    }

                }


            }
        }

        // 图层
        .layer {
            width: 12.5vw;
            margin-right: 0.52vw;
            height: 93.1vh;
            background-color: #050606;
            position: fixed;
            right: 0;
            font-family: SourceHanSansCN-Regular;
            font-size: 0.94vw;

            .btns {
                background: black;
                display: flex;
                justify-content: space-between;

                img {
                    vertical-align: middle;
                }

                .span-btn {
                    width: 6.09vw;
                    height: 1.56vw;
                    display: inline-block;
                    line-height: 1.56vw;
                    background-color: rgba(255, 172, 41, 1);
                    text-align: center;

                    span {
                        color: rgba(27, 27, 27, 1);
                        margin-left: 0.83vw;
                    }

                    &:hover {
                        cursor: pointer;
                        background: #ffb129;
                    }
                }

                span {
                    font-family: SourceHanSansCN-Regular;
                    font-size: 1.48vh;
                }
            }

            .layerTitle {
                margin-top: 0.65vh;
                width: 12.5vw;
                height: 3.7vh;
                background-color: rgba(74, 76, 82, 1);
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
                width: 12.5vw;
                height: 52.31vh;
                background-color: #262626;
                font-size: 1.5vh;

                .unitTitle {
                    width: 12.5vw;
                    height: 52.31vh;
                    overflow: auto;

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
                        /*width: 12.5vw;*/
                        height: 3.7vh;
                        line-height: 3.7vh;
                        background-color: #262626;
                        font-size: 1.5vh;
                        /*text-indent: 1.25vw;*/
                        padding-left: 1.25vw;
                        box-sizing: content-box;
                        /*cursor: pointer;*/
                        .removeIcon {
                            display: inline-block;
                            float: right;
                            margin-right: 0.31vw;

                            img {
                                width: 0.78vw;
                                height: 0.83vw;
                                vertical-align: middle;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
            .none {
                /*opacity: 0;*/
                display: none;
            }
            .position-main {
                width: 12.5vw;
                height: 35.09vh;
                background-color: #262626;

                .posContent {
                    /*width: 16.6vw;*/
                    height: 35.09vh;
                    background-color: #262626;

                    .posIcon {
                        width: 1.1vw;
                        height: 1.9vh;
                        background: url('../../assets/scene/attribute.png');
                        background-size: 100% 100%;
                        display: inline-block;
                        margin: 0 0.5vw;
                        vertical-align: baseline;
                    }
                    .posHeader {
                        /*width: 16.6vw;*/
                        background-color: rgba(74, 76, 82, 1);
                        height: 3.52vh;
                        line-height: 3.7vh;
                        font-size: 0.94vw;
                    }
                    .posMain {
                        /*width: 16.6vw;*/
                        font-family: ArialMT;
                        font-size: 0.73vw;

                        span {
                            width: 2.5vw;
                            display: inline-block;
                            margin-left: 1.5vw;
                            margin-right: 2.6vw;
                        }

                        div {
                            &:nth-child(1) {
                                margin-top: 1.04vw;
                            }

                            margin-top: 0.83vw;
                        }

                        .inputActive {
                            border: 0.05vw solid rgba(230, 162, 64, 1) !important;
                        }

                        .classInput {
                            width: 4.17vw;
                            /*margin: 0 0.5vw;*/
                            border: 0.1vh solid #a59a9a;
                            background-color: black;
                            height: 2.22vh;
                            font-size: 0.5vw;
                            color: white;
                            padding-left: 0.52vw;
                        }

                        .mainTop, .mainBottom {
                            margin: 0.5vw;
                            text-align: left;
                        }
                    }
                }
            }
        }

        .tooltip {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: block;
            position: fixed;
            z-index: 99999;
            top: 0;
            left: 0;
            text-align: center;

            .tip-main {
                width: 20vw;
                height: 27vh;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: url('../../assets/scene/tip2d.png') no-repeat;
                background-size: contain;
                display: inline-block;

                header {
                    margin-top: 1.2vh;
                    font-family: SourceHanSansCN-Regular;
                    font-size: 0.94vw;
                    width: 17.2vw;
                    margin-left: 1.4vw;
                    display: flex;
                    justify-content: space-between;

                    span {
                        &:hover {
                            cursor: pointer;
                        }
                    }
                }

                section {
                    .class-station {
                        margin-top: 3vh;
                        display: flex;
                        margin-left: 1.2vw;

                        span {
                            color: rgba(255, 255, 255, 1);
                            opacity: 0.5;
                            font-family: SourceHanSansCN-Regular;
                            font-size: 0.73vw;
                        }

                        input {
                            width: 3.75vw;
                            background: rgba(0, 0, 0, 0);
                            opacity: 1 !important;
                            color: white;
                            margin: 0 0.36vw;
                            border-bottom: 0.05vw solid rgba(255, 255, 255, 1);
                        }
                    }

                    .class-line {
                        width: 17.6vw;
                        height: 0.16vw;
                        border-bottom: solid 0.05vw rgba(154, 154, 154, 1);
                        opacity: 0.4;
                        display: inline-block;
                        margin-top: 1.2vw;
                    }

                    .generate {
                        .generate-msg {
                            color: rgba(255, 255, 255, 1);
                            opacity: 0.5;
                            margin-top: 1.09vw;
                            margin-left: 1vw;
                            display: flex;
                            font-size: 0.73vw;
                            font-family: SourceHanSansCN-Regular;
                        }

                        .tip-btns {
                            width: 20vw;
                            margin-top: 1.98vw;
                            display: flex;
                            justify-content: center;

                            .tip-false {
                                background: url("../../assets/scene/tipFalse.png") no-repeat;
                                background-size: cover;
                            }

                            .tip-true {
                                background: url('../../assets/scene/tipTrue.png') no-repeat;
                                background-size: cover;
                                margin-left: 1.8vw;
                                color: rgba(255, 172, 41, 1);
                            }

                            span {
                                width: 6.67vw;
                                height: 1.9vw;
                                line-height: 1.9vw;
                                display: inline-block;
                                cursor: pointer;
                            }
                        }
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
        @include addClass('pstWay.png', 2.4vw, 3.3vh);
    }
    .pickingChannel {
        @include addClass('pickWay.png', 2.4vw, 3.3vh);
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
