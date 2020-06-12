<template>
    <div class="leftSider">
        <div class="edit">
            <div class="topContentWrapper">
                <div class="nowScene">
                    <span class="iconContain">
                        <img class="nowSceneIcon" src="@/assets/scene/nowSceneIcon.png" alt="">
                    </span>
                    <span>当前场景</span>
                </div>
                <div class="nowSceneContent">
                    <div class="column">
                        <div class="column-top">
                            <div class="column-top-contain">
                                <div class="column-top-num">
                                    <span>{{ stationNum || 0 }}</span>
                                </div>

                                <div class="column-top-name">
                                    <span>单元</span>
                                </div>
                            </div>
                        </div>
                        <div class="column-bottom">
                            <div class="column-bottom-contain">
                                <div class="column-bottom-num">
                                    <span>{{ floorNum }}</span>
                                </div>
                                <div class="column-bottom-name">
                                    <span>层数</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="column1">
                        <div class="column1-top">
                            <div class="column1-top-num">
                                <span class="span-text">轨道数</span>
                                <span class="span-num">{{ stationNum * 6 || 0}} <span>个</span></span>
                            </div>
                            <div class="column1-top-len">
                                <span class="span-text">轨道长</span>
                                <span class="span-num">{{ shelvesUnitNum|| 0}} <span>堆塔</span></span>
                            </div>
                        </div>
                        <div class="column1-bottom">
                            <div class="column1-bottom-contain">
                                <div class="column1-top-num">
                                    <span class="span-text">PST</span>
                                    <span class="span-num">{{ stationNum || 0}} <span>个</span></span>
                                </div>
                                <div class="column1-top-len">
                                    <span class="span-text">工作站</span>
                                    <span class="span-num">{{ stationNum || 0}} <span>个</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="edit">
            <div class="topContentWrapper">
                <div class="nowScene">
                    <span class="iconContain">
                        <img class="nowSceneIcon" src="@/assets/scene/orderNum.png" alt="">
                    </span>
                    <span>订单量</span>
                </div>
                <div class="echartsContent" ref="orderNum">
                </div>
            </div>
        </div>
        <div class="edit">
            <div class="topContentWrapper">
                <div class="nowScene">
                    <span class="iconContain">
                        <img class="nowSceneIcon" src="@/assets/scene/shipments.png" alt="">
                    </span>
                    <span>发货量</span>
                </div>
                <div class="echartsContent" ref="orderLine">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex";

var echarts = require('echarts');

export default {
    data() {
        return {

            xAxisData: ['04/20', '04/21', '04/22', '04/23', '04/24', '04/25', '04/26'], // x 轴的名称
            yAxisData: [0, 10, 20, 30, 40, 50],     // y 轴的名称
            allOrderData: [22, 18, 19, 23, 29, 23, 30],     // 总订单的数据
            orderScaleData: [12, 13, 10, 13, 9, 23, 28],    // 订单占比的数据
            // echarts 一系列数据
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'line',        // 默认为直线，可选为：'line' | 'shadow'
                    lineStyle: {
                        type: 'dotted',
                    }
                },
                // formatter: function (params) {   //格式化函数
                //     console.log(params[1].marker)
                //     let marker = `<span style="display:inline-block;margin-right:5px;border-radius:0px;width:10px;height:10px;background-color:#ffac29;"></span>`
                //     let marker1 = `<span style="display:inline-block;margin-right:5px;border-radius:0px;width:10px;height:10px;background-color:#666666;"></span>`
                //     let s = `${marker1}总发货量：${params[1].value}件</br>${marker}发货占比：${params[2].value}%`
                //     return s
                // },
                formatter: `发货量：{c1}件`,

            },
            stationNum: 0,
            shelvesUnitNum: 0,
            machineInfo: [],
            floorNum: 0,
            sceneOption: [],
        }
    },
    computed: {
        ...mapGetters('index', {
            currentProjectData: 'getCurrentProjectData',
        })
    },
    mounted() {
        let element = this.$refs.orderNum
        let ele_line = this.$refs.orderLine
        this.initEcharts(element, '单位：千件', '', '订单量', 'bar', [], this.orderScaleData)
        this.initEcharts(ele_line, '单位：件', '', '发货量', 'line', [], this.orderScaleData, this.tooltip)
    },
    methods: {
        initEcharts(element, text, legendName1, legendName2, type, allData, scaleData, tooltip={}) {
            // element 要渲染的 dom 元素  text 标题
            // legendName1 legendName2 图例名称
            // type 图表类型  allData 总订单数据
            var myChart = echarts.init(element);
            let option = {
                title: {
                    text: text,
                    textStyle:{
                        color:'rgba(255,255,255,0.5)',
                        fontSize: this.$vhToPx(1.1),
                        fontWeight: 'normal',
                    },
                    top: this.$vhToPx(1.9),
                    left: this.$vhToPx(0.9),
                },
                tooltip: tooltip,
                legend: {
                    show: false,
                    data: [{
                        name: legendName1,
                        icon: 'rect',
                        backgroundColor: '#666666',
                        textStyle: {
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: this.$vhToPx(1.1),
                        }
                    }, {
                        name: legendName2,
                        icon: 'rect',
                        backgroundColor: '#ffac29',
                        textStyle: {
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: this.$vhToPx(1.1),
                        }
                    },],
                    right: this.$vhToPx(1.6),
                    itemWidth: 10,
                    itemHeight: 10,
                    top: this.$vhToPx(1.9),
                },
                grid: {
                    left: this.$vhToPx(0.9),
                    right: this.$vhToPx(1.6),
                    bottom: this.$vhToPx(2.1),
                    top: this.$vhToPx(4.8),
                    containLabel: true,
                    // show: true,
                    borderColor: 'red',
                    height: this.$vhToPx(13.9)
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.xAxisData,
                        nameTextStyle: {
                            color: 'red',
                            fontSize: this.$vhToPx(1.1),
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(154,154,154)',
                                type: 'solid',
                                fontSize: this.$vhToPx(1.1),
                            },
                        },
                        axisTick: {
                            show: false,

                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        data: this.yAxisData,
                        borderWidth: 0,
                        nameTextStyle: {
                            fontSize: this.$vhToPx(1.1),
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(255, 255, 255, 0.3)',
                                type: 'solid',
                                fontSize: this.$vhToPx(1.1),
                            },
                        },
                        splitLine: {
                            show: true,
                            lineStyle:{
                                color: 'rgba(154,154,154,0.3)',
                                width: 1,
                                type: 'dotted'
                            }
                        }
                    }
                ],
                series: [
                    {
                        // name: legendName1,
                        type: 'bar',
                        // stack: '广告',
                        showBackground: true,
                        barGap: "-55%",
                        barWidth: this.$vhToPx(2.2),
                        data: [50, 50, 50, 50, 50, 50, 50],
                        borderWidth: 30,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 1, 0, 0,
                                    [{offset: 0, color: 'rgba(113, 113, 113, 0.1)'},
                                    {offset: 1, color: 'rgba(113, 113, 113, 0.3)'}]
                                )
                            }
                        }
                    },
                    {
                        name: legendName2,
                        type: type,
                        stack: '订单',
                        barGap: "-55%",
                        data: scaleData,
                        borderWidth: 30,
                        barWidth: this.$vhToPx(0.4),
                        itemStyle: {
                            normal: {
                                color: '#ffac29',
                            }
                        }
                    },
                    {
                        name: legendName1,
                        type: type,
                        stack: '订单',
                        barGap: "-55%",
                        // showBackground: true,
                        barWidth: this.$vhToPx(0.4),
                        data: allData,
                        borderWidth: 30,
                        itemStyle: {
                            normal: {
                                color: '#666666',
                            }
                        }
                    },

                ]
            };
            myChart.setOption(option)
        },

        // 计算单元
        computedStationNum() {
            if(this.sceneOption.length >= 2) {
                this.stationNum = parseInt(this.sceneOption[0].stationNum) + parseInt(this.sceneOption[1].stationNum)
            } else {
                this.stationNum = parseInt(this.sceneOption[0].stationNum)
            }
        },
        computedShelvesNum() {
            if(this.sceneOption.length >= 2) {
                if(parseInt(this.sceneOption[0].shelvesUnitNum) > parseInt(this.sceneOption[1].shelvesUnitNum)) {
                    this.shelvesUnitNum = parseInt(this.sceneOption[0].shelvesUnitNum)
                } else {
                    this.shelvesUnitNum = parseInt(this.sceneOption[1].shelvesUnitNum)
                }
            } else {
                this.shelvesUnitNum = parseInt(this.sceneOption[0].shelvesUnitNum)
            }
        }
    },
    watch: {
        sceneOption: {
            handler(val) {
                // console.log('val ******', val)
            }
        },
        currentProjectData: {
            immediate: true,
            deep: true,
            handler(val) {
                this.machineInfo = this._get(val, 'projectDetail.machineInfo', []);
                this.floorNum = this._get(val, 'projectDetail.sceneOption', []).length;
                this.sceneOption = this._get(val, 'projectDetail.sceneOption', []);
                if(this.sceneOption.length > 0) {
                    this.computedStationNum();
                    this.computedShelvesNum();
                }
            }
        }

    }
}
</script>

<style lang="scss" scoped>
.leftSider {
    position: absolute;
    top: 5.5vh;
    .edit {
        width: 16.6vw;

        &:nth-child(1) {
            margin-top: 1vh;
        }
        &:nth-child(2), &:nth-child(3) {
            margin-top: 2.2vh;
        }

        .nowSceneLine {
            display: flex;
            justify-content: center;
            height: 0.2vh;
        }

        .nowScene {
            display: flex;
            align-items: center;
            width: 16.6vw;
            height: 3vh;
            background: url('~@/assets/scene/nowSceneTitle.png');
            background-size: 100% 100%;

            .iconContain {
                width: 1.1vw;
                height: 2vh;
                background: url('~@/assets/scene/iconContainer.png');
                margin: 0.3vw 0vw 0vw 0.6vw;
            }
            .nowSceneIcon {
                width: 0.7vw;
                height: 1.3vh;
                margin: 0.4vh 0vw 0vw 0.25vw;
            }
            span {
                font-size: 0.8vw;
                margin: 0.8vh 0vw 0vw 0.5vw;
            }
        }
        .topContentWrapper {
            height: 26.2vh;
            width: 16.6vw;
            background: url('~@/assets/scene/nowSceneContent1.png');
            background-size: 100% 100%;
            padding-bottom: 1.9vh;
            .echartsContent {
                display: flex;
                width: 16.6vw;
                height: 23.7vh;
            }

            .content1 {
                display: flex;
                justify-content: space-between;
                padding: 2.3vh 1.2vw;

                .list {
                    display: flex;
                    flex-direction: column;

                    .listName {
                        color: #9a9a9a;
                        font-size: 1.3vh;
                        margin-bottom: 1.3vh;
                    }

                    .listNum {
                        font-family: DM;
                        font-size: 2.2vh;

                        span {
                            font-size: 1.3vh;
                            color: #9a9a9a;
                        }
                    }
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
                    padding: 0.6vh 0 0 2.3vw;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    color: #9a9a9a;

                    span {
                        font-family: 'DM';
                        color: #ffffff;
                        padding-right: 0.3vw;
                        font-size: 1.1vw;
                    }

                    .yellow {
                        color: #ffac29;
                    }
                }
            }

            .content2 {
                display: flex;
                flex-wrap: wrap;

                .item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 1.3vh 3vw 0 3vw;

                    .itemNum {
                        font-family: DM;
                        display: block;
                        margin-bottom: 1.4vh;
                        color: #ffac29;
                        font-size: 2.6vh;
                    }

                    .itemBottom {
                        display: flex;
                        align-items: center;

                        .icon {
                            width: 0.7vw;
                            height: 0.9vw;
                            margin-right: 0.4vw;
                        }
                    }

                    &:nth-child(2) {
                        margin-left: 0;
                        margin-right: 0;
                    }

                    &:nth-child(4) {
                        margin-left: 0;
                        margin-right: 0;
                    }
                }
            }
            .nowSceneContent {
                display: flex;
                width: 16.6vw;
                height: 24.2vh;
                .column {
                    width: 5vw;
                    padding: 1.5vh 0 0 0.6vw;
                    display: flex;
                    flex-wrap: wrap;
                }
                .column-top, .column-bottom {
                    background: url('~@/assets/scene/unit.png');
                    background-size: 100% 100%;
                    width: 4.3vw;
                    height: 8.1vh;
                }
                .column-top-contain, .column-bottom-contain {
                    width: 3.3vw;
                    height: 6.3vh;
                    margin: 0.5vw 0.9vh;
                    text-align: center;
                }
                .column-top-num, .column-bottom-num {
                    width: 3.3vw;
                    height: 4vh;
                    font-size: 3.8vh;
                    color: #ffac29;
                }
                .column-top-name, .column-bottom-name {
                    width: 3.3vw;
                    height: 2.3vh;
                    font-size: 1.3vh;
                    color: #ffffff;
                    line-height: 2.3vh;
                }
                .column1 {
                    width: 10.4vw;
                    height: 24.2vh;
                    padding-left: 1.4vh;
                }
                .column1-top, .column1-top-len {
                    margin-top: 1.5vh;
                }
                .column1-bottom {
                    margin-top: 2.8vh;
                }
                .column1-top-num, .column1-top-len, .column1-bottom-num, .column1-top-len {
                    width: 10.4vw;
                    height: 3.4vh;
                    border: 0.1vh solid #9a9a9a;
                    line-height: 3.4vh;

                }
                .span-text {
                    margin-left: 0.6vw;
                    font-size: 1.3vh;
                    opacity: 0.64;
                }
                .span-num {
                    float: right;
                    font-size: 2.2vh;
                    color: #ffffff;
                    padding-right: 0.8vh;
                }
                .span-num span {
                    font-size: 1.3vh;
                }

            }


            .quota {
                padding-right: 0;
            }

            .quotaDetail {
                padding: 2.3vh 1.4vw;
                display: flex;
                color: #9a9a9a;
                flex-wrap: wrap;

                span {
                    font-size: 1.1vw;
                    font-family: 'DM';
                    color: #ffffff;
                    display: inline-block;
                    padding: 0.8vh 0.3vw 0 0;
                }
                .progress {
                    margin-top: 2vh;
                }
            }
            .editBtn {
                width: 11.5vw;
                padding: 0.3vw 0;
                margin: 0 auto;
                text-align: center;
                cursor: pointer;
                background: url('~@/assets/scene/edit.png');
                background-size: 100% 100%;
            }
        }

    }
}
</style>
