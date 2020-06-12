<template>
    <div class='rightSider'>
        <div class="selectDate">
            <el-date-picker
                @change="dateChangeEvent"
              class="dateSelected"
              v-model="timeValue"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <div class="" @click="showDateSelected">
                <span><img src="@/assets/scene/date.png" alt=""> </span>
                <span>{{ formatTimeValue }}</span>
                <span><img src="@/assets/scene/xiala.png" alt=""> </span>
            </div>

        </div>

        <div class="showData">
            <div class="edit">
                <div class="showHeader">
                    <span @click="changeRole(index)" :class="{'currentActive': currentHeaderIndex == index}" :key="index" v-for="(item, index) in roles">{{ item }}</span>
                </div>
                <div class="topContent">
                    <div class="content1 quota" :class="{'topContentActive': currentPieIndex == index}" :key="index" v-for="(item, index) in peiEcharts">
                        <div class='Inventory'>
                            <PieChart :inventory='item.inventory'></PieChart>
                        </div>
                        <div class='Inventorytext'>
                            <div>
                                <p>{{ item.firstName }}</p>
                                <div><span>{{ item.percent}}</span>%<span class="second">{{ item.useNum }}</span><font v-html="item.spanHtml"></font></div>
                                <div class="border"></div>
                            </div>
                            <div>
                                <p>{{ item.secondName }}</p>
                                <div><span class='yellow'>{{ item.percent}}</span>%<span class="second">{{ item.noUseNum }}</span><font v-html="item.spanHtml"></font></div>
                                <div class="border"></div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="splitLine">
                    <img alt=""
                      src="@/assets/scene/split2.png">
                </div>
                <div class="btns" v-show="rightBtnsShow.whaleShow">
                    <div class="btnsContain" @click="transformEvent">
                        <p class="first"><img class="img-left" src="@/assets/scene/leftMore.png" alt=""> </p>
                        <div :class="{'center': true, 'left': centerBool.leftBool, 'right': centerBool.rightBool}" :style="btnsStyle">
                            <span @click.capture="changeData(index)"   :key="index" :class="{'active':currentBtnIndex == index }" v-for="(item, index) in whalehouseBtns[0]">{{item}}</span>
                        </div>
                        <p class="second"><img class="img-right" src="@/assets/scene/rightMore.png" alt=""> </p>
                    </div>
                </div>
                <div class="robotBtns" v-show="rightBtnsShow.robotShow">
                    <span @click="changeRobotData(index)" :key="index" :class="{'active':currentRobotDataIndex == index }" v-for="(item, index) in whalehouseBtns[1]">{{item}}</span>
                </div>
                <div class="robotBtns" v-show="rightBtnsShow.menShow">
                    <span @click="changeMenData(index)" :key="index" :class="{'active':currentMenDataIndex == index }" v-for="(item, index) in whalehouseBtns[2]">{{item}}</span>
                </div>

                <div class="lowContentWrapper">
                    <easy-scroll :barOption="reactiveScrollOpt"
                      :viewStyle='viewStyle'
                      :wrapStyle='wrapStyle'
                      v-show="rightBtnsShow.whaleShow"
                    >
                        <div :key='key'
                          class='stockList'
                          v-for='(item,key) in goodsList[currentIndex]'>
                            <div class="stockName"> {{item.name}}</div>
                            <div class='progress'>
                                <div :class='classObj(key)' :style="{ width: item.num/2000*80+'%',maxWidth:'80%' }"
                                  class='progress_value'></div>
                                <div class='progress_num'> {{item.num}}<span>件</span></div>
                            </div>

                        </div>
                    </easy-scroll>
                    <easy-scroll :barOption="reactiveScrollOpt"
                      :viewStyle='viewStyle'
                      :wrapStyle='wrapStyle'
                      v-show="rightBtnsShow.robotShow"
                    >
                        <div :key='key'
                          class='stockList'
                          v-for='(item,key) in robotList[currentRobotIndex]'>
                            <div class="stockName robotTitle"> <span class="robotName">{{item.name}}</span>
                                <span class="robotTime">{{ item.hour }}h {{ item.min }}m</span></div>
                            <div class='progress'>
                                <div :class='classObj(key)' :style="{ width: item.hour/24*80+'%',maxWidth:'80%' }"
                                  class='progress_value'></div>
                            </div>

                        </div>
                    </easy-scroll>
                    <easy-scroll :barOption="reactiveScrollOpt"
                      :viewStyle='viewStyle'
                      :wrapStyle='wrapStyle'
                      v-show="rightBtnsShow.menShow"
                    >
                        <div :key='key'
                          class='stockList'
                          v-for='(item,key) in menList[currentMenIndex]'>
                            <div class="stockName robotTitle"> <span class="robotName">{{item.name}}</span>
                                <span class="robotTime">{{ item.hour }}h {{ item.min }}m</span></div>
                            <div class='progress'>
                                <div :class='classObj(key)' :style="{ width: item.hour/24*80+'%',maxWidth:'80%' }"
                                  class='progress_value'></div>
                            </div>
                        </div>
                    </easy-scroll>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PieChart from './basicPie';
import {mapGetters, mapMutations} from "vuex";
let TWEEN = require('tween.js');


export default {
    data() {
        return {
            timeValue: [new Date(2020, 4, 10, 10, 10), new Date(2020, 4, 11, 10, 10)],
            // formatTimeValue: '2020-04-08 17:15~2020-04-09 17:15',   // 格式化时间
			formatTimeValue:'请选择任务时间段',
            currentHeaderIndex: 0,      // 当前 header 标题
            roles: ['仓库库存', '机器人', '工作人员'],     // 右边栏目的标题
            currentPieIndex: 0,     // 当前象形图的位置下标
            // 右边栏目象形图的数据
            peiEcharts: [{
                firstName: '占用率',
                useNum: 8000,
                secondName: '空置率',
                noUseNum: 2000,
                spanHtml: 'm<span style="width: 0.23vw;height: 0.45vh;color: #ffffff;opacity: 0.5;font-size: 0.35vw;vertical-align: super;">2</span>',
                // spanHtml: 'm²',
                percent: 80,
                inventory: {
                    used: 300,
                    all: 1000,
                    title: '仓库面积',
                    unit: 'm²',
                },
            },{
                firstName: '运作率',
                useNum: 8000,
                secondName: '闲置率',
                noUseNum: 2000,
                spanHtml: '台',
                percent: 80,
                inventory: {
                    used: 30,
                    all: 100,
                    title: '工作状态',
                    unit: '台',
                },
            },{
                firstName: '运作率',
                useNum: 8000,
                secondName: '闲置率',
                noUseNum: 2000,
                spanHtml: '人',
                percent: 80,
                inventory: {
                    used: 30,
                    all: 100,
                    title: '工作状态',
                    unit: '人',
                },
            }],
            currentIndex: 0,
			stockList: ['SKU', 'SPU', '库存占用率'],
			goodsList: [
				[{name: 'Iphone x(全网通)-64GB', num: 600}, {
					name: 'Iphone x(全网通)-64GB',
					num: 3000
				}, {name: 'Iphone x(全网通)-64GB', num: 596}, {
					name: 'Iphone x(全网通)-64GB',
					num: 1262
				}, {name: 'Iphone x(全网通)-64GB', num: 1262}, {
					name: 'Iphone x(全网通)-64GB',
					num: 1500
				}, {name: 'Iphone x(全网通)-64GB', num: 1100}, {
					name: 'Iphone x(全网通)-64GB',
					num: 1000
				}, {name: 'Iphone x(全网通)-64GB', num: 700}, {
					name: 'Iphone x(全网通)-64GB',
					num: 602
				}, {name: 'Iphone x(全网通)-64GB', num: 323}],
				[{name: 'Iphone x(全网通)-64GB', num: 1000}, {
					name: 'Iphone x(全网通)-64GB',
					num: 1262
				}, {name: 'Iphone x(全网通)-64GB', num: 681}],
				[{name: 'Iphone x(全网通)-64GB', num: 551}, {
					name: 'Iphone x(全网通)-64GB',
					num: 600
				}, {name: 'Iphone x(全网通)-64GB', num: 1262}, {
					name: 'Iphone x(全网通)-64GB',
					num: 1262
				}, {name: 'Iphone x(全网通)-64GB', num: 800}, {name: 'Iphone x(全网通)-64GB', num: 600}]
			],
            // 右边栏目机器人作业时长 搬运次数等 数据
            currentRobotIndex: 0,
            robotList: [
                [{
					name: '机器人A',
					hour: 22,
                    min: 20,
				}, {
					name: '机器人b',
                    hour: 22,
                    min: 20,
				}, {
					name: '机器人C',
                    hour: 22,
                    min: 40,
				},{
					name: '机器人D',
                    hour: 12,
                    min: 40,
				},{
					name: '机器人A',
                    hour: 21,
                    min: 20,
				},{
					name: '机器人f',
                    hour: 21,
                    min: 40,
				},{
					name: '机器人A',
                    hour: 22,
                    min: 20,
				}, {
					name: '机器人b',
                    hour: 22,
                    min: 60,
				}, {
					name: '机器人C',
                    hour: 15,
                    min: 20,
				},{
					name: '机器人A',
                    hour: 13,
                    min: 20,
				}, {
					name: '机器人b',
                    hour: 12,
                    min: 20,
				}, {
					name: '机器人C',
                    hour: 22,
                    min: 20,
				},]
            ],
            // 右边栏目 工作人员 数据
            currentMenIndex: 0,
            menList: [
                [{
					name: '工作人员A',
					hour: 21,
                    min: 20,
				}, {
					name: '工作人员b',
                    hour: 12,
                    min: 20,
				}, {
					name: '工作人员C',
                    hour: 22,
                    min: 30,
				},{
					name: '工作人员D',
                    hour: 12,
                    min: 50,
				},{
					name: '工作人员A',
                    hour: 11,
                    min: 20,
				},{
					name: '工作人员C',
                    hour: 15,
                    min: 60,
				},{
					name: '工作人员A',
                    hour: 13,
                    min: 40,
				}, {
					name: '工作人员b',
                    hour: 12,
                    min: 20,
				}, {
					name: '工作人员',
                    hour: 22,
                    min: 20,
				},{
					name: '工作人员A',
                    hour: 13,
                    min: 40,
				}, {
					name: '工作人员b',
                    hour: 12,
                    min: 20,
				}, {
					name: '工作人员',
                    hour: 22,
                    min: 20,
				},]
            ],
            whalehouseBtns: [['SKU', '库存占用率', '发货率', '销量'],
                ['作业时长', '搬运次数', '设备产能'], ['作业时长', '人均拣货', '人产能订单/h']],  // 右边栏目按钮
            wrapStyle: {
				paddingBottom: '1.8vw',
			},
			viewStyle: {
				paddingRight: '1.1vw',
			},
            rightBtnsShow: {
                whaleShow: true,  // 右边栏目 仓库库存 是否显示
                robotShow: false, // 右边栏目  机器人是否显示
                menShow: false,   // 右边栏目 工作人员 是否显示
            },
            centerBool: {
                leftBool: false,
                rightBool: true,
            },
            btnsStyle: {},      // 按钮样式
            currentBtnIndex: 0,             // 仓库库存按钮的下标
            currentRobotDataIndex: 0,           // 机器人按钮的下标
            currentMenDataIndex: 0,         // 工作人员按钮的下标

        }
    },
    props: {
        projectId: Number,
    },
    components: {
        PieChart,
    },
    computed: {
        ...mapGetters('index', {
            currentProjectData: 'getCurrentProjectData',
            getSelectedDate: 'getSelectedDate',
            getplayState: 'getplayState',
        }),
        classObj(index) {
            return (index) => {
                if(index == 0) {
                    return 'process_first'
                } else if(index == 1) {
                    return 'process_second'
                } else if(index == 2) {
                    return 'process_third'
                }
            }
        },
    },
    methods: {
        ...mapMutations('index', {
            setSelectDate: 'setSelectDate',
            setPlayedAnimateState: 'setPlayedAnimateState',
            setPlayedAnimateDate: 'setPlayedAnimateDate',
            setFirstPlay: 'setFirstPlay',
            setDataSelected: 'setDataSelected',
            setProgress: 'setProgress',
            setplayState: 'setplayState',
            setReqTimes: 'setReqTimes',
        }),
        formatTime(str) {
            let s = String(str);
            if(s.length == 1) {
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
            let sec=date.getSeconds();
            return `${year}-${this.formatTime(mon)}-${this.formatTime(day)} ${this.formatTime(hour)}:${this.formatTime(min)}:${this.formatTime(sec)}`;
        },
        // 划分时间 请求要用
        divideTime(d1, d2) {
            let day = 1000 * 60 * 60 * 24
            let days = (d2.getTime() - d1.getTime()) / day
            let d = (d2.getTime() - d1.getTime()) % day
            this.setReqTimes([])
            let result = []
            for (var i = 0; i < parseInt(days); i++) {
                let start = this.getDate(new Date(d1.getTime() + day * i))
                let end = this.getDate(new Date(d1.getTime() + day * (i + 1)))
                result.push({
                    start,
                    end,
                })
            }
            if(d > 0) {
                let start = this.getDate(new Date(d1.getTime() + day * i))
                result.push({
                    start,
                    end: this.getDate(d2),
                })
            }
            this.setReqTimes(result)
        },
        // 日期选择器 change 事件
        dateChangeEvent(event) {
            let d1 = this.timeValue[0];
            let d2 = this.timeValue[1];
            let s1 = this.getDate(d1);
            let s2 = this.getDate(d2);
            this.divideTime(d1, d2)

            this.formatTimeValue = s1 + '~' + s2;
            let scene = this.$parent.$parent.scene
            let wall = scene.getObjectByName('boardteam')
            let wallPosition = new this.$THREE.Vector3();
            wall.getWorldPosition(wallPosition)
            console.log('播种墙', wall, wallPosition, this.getplayState, TWEEN.getAll())
            if (this.getplayState) {
                // let boxPosition = new this.$THREE.Vector3();
                // let box = TWEEN.getAll()[0].box
                // console.log('box  sdfsa ', box, TWEEN.getAll())
                // debugger
                // let psb = scene.getObjectById(box.id)
                // psb.getWorldPosition(boxPosition)
                // console.log('position', psb.position, psb)
                // psb.position.set(100000, 3000, 5000)
                // // console.log('postiiion after', box.position, wallPosition.x, boxPosition.y, boxPosition.z)
                // // console.log('TWEEN.getAll', TWEEN.getAll()[0], box)
                // TWEEN.getAll()[0].stop()
            }
            this.$store.commit('index/setSelectDate', {s1, s2});
            this.setPlayedAnimateState(false);
            this.$store.commit('index/setplayState', false);
            this.$store.commit('index/setFirstPlay', true);
            this.$store.commit('index/setMoveTime', 0);
            this.$store.commit('index/setTotalTime', 0);

        },
        // 日期选择器 click 事件
        showDateSelected(event) {
            let date = document.querySelector('.dateSelected');
            date.click();
        },
        // 处理 gCoreData 接口返回的数据
        handleData(data) {
            let startTime = data.proj_time.start_time;
            let endTime = data.proj_time.end_time;
            if (startTime !== null && endTime !== null) {
                let startDate = new Date(startTime);
                let endDate = new Date(endTime);
                let start = this.getDate(startDate);
                let end = this.getDate(endDate);
                this.formatTimeValue = start + '~' + end;
                this.timeValue[0] = startDate;
                this.timeValue[1] = endDate;
                this.setSelectDate({
                    s1: start,
                    s2: end,
                })
            }

        },
        // 请求时间
        requestTime(id) {
            let params = {
                project_id: id,
            };
            if(id !== undefined) {
                this.$get('gCoreData', params).then(res => {
                    if (res.code == '200' && res.data) {
                        this.handleData(res.data);
                        if (res.data.proj_3D) {
                            this.setPlayedAnimateState(true);
                            this.setPlayedAnimateDate(res.data.proj_3D);
                        } else {
                            this.setPlayedAnimateState(false);
                        }
                    } else {
                        this.setPlayedAnimateState(false);
                    }
                });
            }
        },
        //  右边栏目( 仓库库存 机器人 工作人员 )的切换
        changeRole(index) {
            this.currentHeaderIndex = index;
            let whaleShow = false;
            let robotShow = false;
            let menShow = false;
            if(index == 0) {
                whaleShow = true;
            } else if (index == 1) {
                robotShow = true;
            } else if (index == 2) {
                menShow = true;
            }
            this.rightBtnsShow = {
                whaleShow: whaleShow,
                robotShow: robotShow,
                menShow: menShow,
            }
            this.currentPieIndex = index;
        },
        transformEvent(event) {
            let target = event.target;
            let list = target.classList;
            if(list.contains('img-left')) {
                this.centerBool = {
                    leftBool: false,
                    rightBool: true,
                }
                this.currentBtnIndex = 0;
            } else if (list.contains('img-right')) {
                this.centerBool = {
                    leftBool: true,
                    rightBool: false,
                }
                this.currentBtnIndex = 3
            }
        },
        // 右边栏目 机器人 按钮点击切换事件
        changeRobotData(index) {
            this.currentRobotDataIndex = index;
        },
        // 右边栏目 工作人员 按钮点击切换事件
        changeMenData(index) {
            this.currentMenDataIndex = index;
        },
        reactiveScrollOpt() {
			return {
				barColor: '#95A0B6', //滚动条颜色
				railColor: '#475566', //导轨颜色
				barOpacityMin: 0.1, //滚动条非激活状态下的透明度
				barWidth: this.$getVw(4),
				barMarginRight: 0,
				autohidemode: true,
				borderWidth: this.$vwToPx(0.125)
			};
		},
        // 右边栏目 仓库库存按钮的点击事件
        changeData(index) {
            let target = event.target;
            this.currentBtnIndex = index;
            if(index == 3) {
                this.centerBool = {
                    leftBool: true,
                    rightBool: false,
                }
            } else if(index == 0) {
                this.centerBool = {
                    leftBool: false,
                    rightBool: true,
                }
            }
        },
    },
    watch: {
        currentProjectData: {
            immediate: true,
            deep: true,
            handler(val) {
                if(val !== undefined) {
                    let id = val.id;
                    this.requestTime(id);
                }
            }
        }
    },
    mounted() {
    }
}
</script>

<style lang="scss" scoped>
.rightSider {
    position: absolute;
    top: 1.5vh;
    right: 2.4vw;
    .selectDate {
        background: url('~@/assets/scene/selectDate.png');
        width: 17vw;
        height: 3.5vh;
        background-size: 100% 100%;
        text-align: center;
        position: relative;
        cursor: pointer;
        div {
            padding-top: 0.8vh;
            position: absolute;
            top: 0;
            padding-left: 0.8vw;
        }
        span {
            width: 0.8vw;
            height: 0.8vw;
            font-size: 1.3vh;
            color: #999999;
            vertical-align: top;
            img {
                width: 0.8vw;
                height: 0.8vw;
            }
            &:nth-child(3) {
                opacity: 0.2;
            }
            &:nth-child(2) {
                padding: 0 0.5vw;
            }
        }
        .dateSelected {
            width: 16.8vw;
            height: 3.5vh;
            opacity: 0;
        }
    }
    .showData {
        width: 17vw;
        height: 85.6vh;
        background: url('~@/assets/scene/rightSide.png');
        background-size: 100% 100%;
        position: absolute;
        top: 4.9vh;
        display: flex;
        .splitLine {
            width: 16.8vw;
            height: 0.2vh;
            position: absolute;
            display: flex;
            justify-content: center;
            top: 19.5vh;
            img {
                width: 12.7vw;
                height: 0.2vh;
            }
        }
        .edit {
            width: 17vw;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            margin: 0px;
            padding: 0px;
            .showHeader {
                display: flex;
                justify-content: space-between;
                width: 15.3vw;
                height: 2.9vh;
                span {
                    justify-content: center;
                    display: flex;
                    align-items: center;
                    width: 4.9vw;
                    height: 2.9vh;
                    font-size: 0.8vw;
                    cursor: pointer;
                    color: #ffffff;
                    background: url('~@/assets/scene/whalehous.png');
                }
                .currentActive {
                    background: url('~@/assets/scene/whalehouseSelected.png');
                }
            }
            .btns {
                height: 1.9vh;
                width: 15.5vw;
                overflow: hidden;
                position: absolute;
                top: 21.6vh;
                .btnsContain {
                    display: flex;
                    .center {
                        width: 15vw;
                        height: 1.9vh;
                        margin-left: 0.7vw;
                        position: relative;
                        left: 0.5vw;
                        overflow: hidden;
                        display: flex;
                        flex-wrap: nowrap;
                        span {
                            display: inline-block;
                            width: 3.3vw;
                            height: 1.9vh;
                            font-size: 1.3vh;
                            text-align: center;
                            color: #ffffff;
                            opacity: 0.5;
                            background: rgba(113, 113, 113, 0.3);
                            border: 0.1vh solid #717171;
                            margin-left: 0.3vw;
                            cursor: pointer;
                        }
                        .active {
                            border: 0.1vh solid #ffac29;
                            color: #ffffff;
                            opacity: 1;
                        }
                    }
                    .left {
                        left: -1.5vw;
                    }
                    .right {
                        left: 0.5vw;
                    }
                }
                p {
                    width: 1.5vw;
                    height: 1.9vh;
                    background-image: linear-gradient(to left, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.3));
                    img {
                        width: 1.9vh;
                        height: 1.9vh;
                        cursor: pointer;
                    }
                }
                .first {
                    position: absolute;
                    left: 0;
                    top: 0;
                    img {
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: 999;
                    }
                }
                .second {
                    position: absolute;
                    right: 0;
                    top: 0;
                    img {
                        position: absolute;
                        top: 0;
                        right: 0;
                    }
                }
            }
            .robotBtns {
                width: 14.5vw;
                height: 1.9vh;
                display: flex;
                justify-content: flex-start;
                position: absolute;
                top: 21.6vh;
                span {
                    display: inline-block;
                    width: 4.2vw;
                    height: 1.9vh;
                    font-size: 1.3vh;
                    text-align: center;
                    color: #ffffff;
                    opacity: 0.5;
                    background: rgba(113, 113, 113, 0.3);
                    border: 0.1vh solid #717171;
                    margin-left: 0.3vw;
                    cursor: pointer;
                    ::-webkit-scrollbar {
                      display: none;
                    }
                }
                .active {
                    border: 0.1vh solid #ffac29;
                    color: #ffffff;
                    opacity: 1;
                }
            }
        }
    }
    .topContent {
        width: 13.5vw;
        height: 10.5vh;
        display: flex;
        position: absolute;
        top: 6.4vh;
        left: 1.7vw;
        .topContentActive {
            display: flex !important;
        }
        content1: {
            width: 13.5vw;
        }

        .quota {
            display: flex;
            display: none;
        }
        .Inventory {
            width: 12.7vh;
            height: 10.4vh;
            font-size: 0.6vw;
            background: url('~@/assets/scene/Inventory.png');
            background-size: 100% 100%;
        }

        .Inventorytext {
            flex: 1;
            font-size: 0.6vw;
            margin-left: 1.4vw;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: #9a9a9a;
            div {
                width: 5vw;
                color: #9a9a9a;
                font-size: 0.6vw;
            }
            .border {
                width: 4.9vw;
                height: 0.5vh;
                border-bottom: 0.1vh solid  #717171;
                border-left: 0.1vh solid  #717171;
            }
            p {
                font-size: 1.1vh;
                color: #9a9a9a;
            }
            span {
                font-family: 'DM';
                color: #ffffff;
                padding-right: 0.2vw;
                font-size: 1.1vw;
            }
            .second {
                margin-left: 0.9vw;
            }
            .sqare {
                width: 0.23vw;
                height: 0.45vh;
                color: #ffffff;
                opacity: 0.5;
                font-family: 'DM';
                font-size: 0.35vw;
                vertical-align: text-top;
            }
            .yellow {
                color: #ffac29;
            }
        }

    }
    .lowContentWrapper {
        height: 58vh;
        width: 16.6vw;
        position: absolute;
        top: 26vh;
        box-sizing: border-box;
        background-size: 100% 100%;
        padding: 0 0.6vw;
        ::v-deep .easy-scrollbar {
            width: calc(100% + 0.8vw);
        }
        .content1 {
            display: flex;
            justify-content: space-between;

            div {
                display: flex;
                align-items: center;
                padding: 0 0.6vw;
                height: 2.6vh;
                opacity: 0.5;
                border: solid 0.1vh #717171;
                cursor: pointer;
            }

            .choosed {
                opacity: 1;
                border: solid 0.1vh #ffac29;
            }
        }

        .deployInfo {
            padding: 1.8vh 0;
            display: flex;

            .robotImg {
                width: 5.3vw;
                height: 9.4vh;
                border: solid 0.1vh #9a9a9a;
            }

            .deployNews {
                padding: 1.6vh 0 0 1.3vw;

                div:nth-child(2) {
                    padding: 1.9vh 0 0.3vh 0;
                }

                span {
                    font-family: DM;
                    font-size: 2vh;
                    color: #ffac29;
                    margin-right: 0.2vw;
                }
            }
        }

        .content2 {
            padding-top: 2vh;
            margin-bottom: 0.8vh;

            .sliderList {
                height: 3.1vh;
                margin-bottom: 0.9vh;

                .parameterName {
                    margin-right: 2.3vw;
                    opacity: 0.8;
                }

                .parameterValue {
                    color: #9a9a9a;
                }
            }
        }

        .stockList {
            width: 15.4vw;
            margin-top: 1vh;
            height: 4.8vh;
            background-color: rgba(60, 60, 60, 0.3);
            // opacity: 0.3;
            div:nth-child(1) {
                font-size: 1.1vh;
                // opacity: 0.8;
            }
            .stockName {
                padding: 0.9vh 0 0 0.6vw;
            }
            .robotTitle {
                display: flex;
                justify-content: space-between;
                padding-right: 0.5vw;
                .robotName {
                    opacity: 0.8;
                }
                .robotTime {
                    font-size: 1.7vh;
                    color: #ffffff;
                    font-family: 'DINCond-Medium';
                }
            }
        }
        .progress {
            width: 14.4vw;
            height: 0.4vh;
            margin-top: 0.9vh;
            margin-left: 0.5vw;
            display: flex;
            align-items: center;
            background-image: linear-gradient(90deg,
              #3d3d3d 0%,
              #3d3d3d 100%);
            /*.progress_value_middle{*/
            /*    background-color: #ffac29!important;*/
            /*}*/

            .progress_value_min {
                background-color: #9a9a9a !important;
            }

            .progress_value_max {
                background-color: #ff7f29 !important;
            }
            .process_first {
                background-color: #ffac29 !important;
            }
            .process_second {
                background-color: #ff7f29 !important;
            }
            .process_third {
                background-color: #ffffff !important;
            }
            .progress_value {
                height: 0.4vh;
                position: relative;
                background-color: #808080;

                &:after {
                    content: '';
                    width: 0.1vw;
                    height: 0.7vh;
                    background-color: #ffffff;
                    position: absolute;
                    top: -50%;
                    right: 0;
                }
            }
            .progress_num {
                font-size: 0.9vw;
                padding-left: 0.3vw;
                width: 20%;
                font-family: "DM";
                color: #ffffff;
                span {
                    padding-left: 0.1vw;
                    font-size: 0.6vw;
                    color: #9a9a9a;
                }
            }
        }
    }
}
</style>
