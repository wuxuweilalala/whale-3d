<template>
<div class="parameters">
    <header>配置详情</header>
    <div class="parametersContent">
        <div class="parametersLeftSide">
            <div class="parametersListWrapper" v-for="(list,index) in parametersLeftList" :key="index">
                <div class="parametersList"  @click="dropShow = !dropShow,currentIndex = index">
                    <div class="text">
                        <svg class="icon" aria-hidden="true">
                            <use :xlink:href="`#icon-${list.icon}`" />
                        </svg>
                        <span>{{list.name}}</span>
                    </div>
                    <div :class="[{bottomIcon:dropShow && currentIndex === index},'arrow']">
                        <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-xiabiao"/>
                    </svg> </div>
                </div>
                <div class="dropContent" v-if="dropShow && currentIndex === index">
                    <div class="dropList" @click="detailShow = true" v-for="(list,index) in dropList" :key="index">
                        {{list.name}}
                    </div>
                </div>
            </div>
        </div>
        <div class="parametersRightSide" v-if="!detailShow">
            <div class="rightItem" v-for="(item,index) in machineList" :key="index">
                <div class="bigImg">
                    <img :src="item.bigImg" alt="">
                </div>
                <div class="itemInfo">
                    <div class="itemName">{{item.title}}</div>
                    <div class="itemBottom">
                        <div class="bottomList" v-for="(list,bottomIndex) in item.info" :key="bottomIndex">
                            <span class="bottomTitle">{{list.name}}</span>
                            <div class="numList">
                                {{list.value}}
                                <span>{{list.unit}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="robotDetail" v-if="detailShow">
            <div class="detailWrapper">
                <div class="detailLeft">
                    <div class="detailBigImg">
                        <img src="" alt="">
                    </div>
                    <div class="detailListWrapper">
                        <div class="detailList">
                            <span class="detailTitle">自定义名称:</span>
                            <span class='detailContent'>{{detailInfo.name}}</span>
                        </div>
                        <div class="detailList">
                            <span class="detailTitle">工号ID:</span>
                            <span class='detailContent'>{{detailInfo.id}}</span>
                        </div>
                        <div class="detailList">
                            <span class="detailTitle">工作人员状态:</span>
                            <span class='detailContent yellowColor'>{{detailInfo.status}}</span>
                        </div>
                        <div class="detailList">
                            <span class="detailTitle">工作人员类型:</span>
                            <span class='detailContent yellowColor'>{{detailInfo.personType}}</span>
                        </div>
                    </div>
                </div>
                <div class="detailRight">
                    <div class="rightTop">
                        <div class="title">
                            <span>工作信息</span>
                            <div class="titleLine"></div>
                        </div>
                        <div class="centerSection">
                                <div class="centerList">
                                    <div>
                                        <span>岗位区域:</span>
                                        <span>{{detailInfo.jobArea}}</span>
                                    </div>
                                    <div>
                                        <span>作业类型:</span>
                                        <span>{{detailInfo.jobType}}</span>
                                    </div>
                                </div>
                            <div class="centerList">
                                <div>
                                    <span>所在区域:</span>
                                    <span>{{detailInfo.nowArea}}</span>
                                </div>
                                <div>
                                    <span>所属订单:</span>
                                    <span>{{detailInfo.order}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="bottomSection">
                            <div class="list">
                                <span class="listName">待完成数</span>
                                <span class="listNum">{{detailInfo.toBeCompletedNumber}} <span class="unit">件</span></span>
                            </div>
                            <div class="list">
                                <span class="listName">已完成数</span>
                                <span class="listNum">{{detailInfo.completed}} <span class="unit">件</span></span>
                            </div>
                            <div class="list">
                                <span class="listName">饱和比例</span>
                                <span class="listNum">{{detailInfo.saturationRatio}} <span class="unit">件</span></span>
                            </div>
                        </div>
                    </div>
                    <div class="rightBottom">
                        <div class="title">
                            <span>参数配置</span>
                            <div class="titleLine"></div>
                        </div>
                        <div class="paramsList" v-for="(list,index) in  detailInfo.speedData" :key="index">
                            <span class="parameterName">{{list.name}}</span>
                            <span class="parameterValue">{{list.value}}m/s</span>
                            <el-slider v-model="list.value" :max="6"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="saveBtn">保存</div>
        </div>
    </div>
</div>
</template>

<script>
    export default {
        name: "parameters",
        components:{
        },
        data(){
            return {
                dropShow:false,
                detailShow:false,
                currentIndex:-1,
                machineList:[
                    {
                        bigImg:'',
                        title:'机器人PST',
                        info:[
                            {name:'机器人 PSB 数量',value:200,unit:'台'},
                            {name:'任务待完成数',value:123,unit:'台'},
                            {name:'已完成数',value:77,unit:'台'},
                            {name:'饱和比例',value:'1.3:1',unit:''},
                        ]
                    }, {
                        bigImg:'',
                        title:'机器人PSB',
                        info:[
                            {name:'机器人 PSB 数量',value:200,unit:'台'},
                            {name:'任务待完成数',value:123,unit:'台'},
                            {name:'已完成数',value:77,unit:'台'},
                            {name:'饱和比例',value:'1.3:1',unit:''},
                        ]
                    },
                    {
                        bigImg:'',
                        title:'分拣员',
                        info:[
                            {name:'机器人 PSB 数量',value:200,unit:'台'},
                            {name:'任务待完成数',value:123,unit:'台'},
                            {name:'已完成数',value:77,unit:'台'},
                            {name:'饱和比例',value:'1.3:1',unit:''},
                        ]
                    }
                    ],
                parametersLeftList:[
                    {name:'机器人 PST',icon:'guidao'},
                    {name:'机器人 PSB',icon:'PSB'},
                    {name:'分拣员',icon:'Sortingmember'}],
                detailInfo:{
                    name:'分拣员一号',
                    id:12345677,
                    status:"处理任务中",
                    personType:"普通工人",
                    jobArea:"AI、A2、A3",
                    jobType:"分拣",
                    nowArea:"L1-3A区",
                    order:"1233466",
                    toBeCompletedNumber:123,
                    completed:77,
                    saturationRatio:"1.3: 1",
                    speedData:[
                        {name:'移动速度',value:1},
                        {name:'扫描速度',value:0},
                        {name:'拣货速度',value:0},
                        {name:'播种速度',value:0}]
                },
                dropList:[{
                    name:'机器人PST1号'
                },{
                    name:'机器人PST2号'
                },{
                    name:'机器人PST3号'
                },{
                    name:'机器人PST4号'
                },{
                    name:'机器人PST5号'
                },{
                    name:'机器人PST6号'
                },{
                    name:'机器人PST7号'
                }]
            }
        }
    }
</script>

<style lang="scss">
    .el-slider__bar {
        background: linear-gradient(to top right, rgba(31,31,31,0), rgba(106,106,106,0.8));
    }
    .el-slider__runway {
        background-color: #1f1f1f;
    }
    .el-slider__button {
        border:2px solid #595959;
        background-color: unset;
        position: relative;
        width: 1vw;
        height: 1vw;
        &::after {
            content:'';
            width: 0.3vw;
            height: 0.3vw;
            background-color: #ffac29;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
         }
    }
</style>

<style lang="scss" scoped>
.parameters {
    display: flex;
    flex-direction: column;
    padding:0!important;
    header {
        background: #2f2f2f;
        padding: 0.4vw 1vw;
    }
    .parametersContent {
        display: flex;
        margin:1vw;
        overflow: scroll;
        &::-webkit-scrollbar {display:none}
        .parametersLeftSide {
            margin-right: 3.6vw;
            .parametersList {
                display: flex;
                justify-content: space-between;
                background-color: #2f2f2f;
                cursor: pointer;
                width: 14.3vw;
                padding:0.4vw;
                margin-bottom: 0.5vw;
                .text {
                    .icon {
                        margin-right: 0.3vw;

                    }
                }
                .arrow {
                    transform: rotate(-90deg);
                }
                .bottomIcon {
                    transform: unset;
                }
            }
            .dropContent {
                width: 14.3vw;
                height: 10.5vw;
                padding: 0.5vw 0 1vw 0.5vw;
                background-color: rgb(15,18,18);
                border: solid 0.1vw #989898;
                margin-top: -0.5vw;
                margin-bottom: 0.5vw;
                overflow: scroll;
                &::-webkit-scrollbar {display:none}
                .dropList {
                    width: 14.3vw;
                    line-height: 1.6vw;
                    height: 1.6vw;
                    cursor: pointer;
                    &:hover {
                        width: 13.3vw;
                        background-color: #2f2f2f;
                    }
                }
            }
        }
        .parametersRightSide {
            .rightItem {
                display: flex;
                margin-bottom: 1.5vw;
                .bigImg {
                    width: 8.1vw;
                    height: 8.6vw;
                    border:1px solid red;
                    margin-right: 1.6vw;
                }
                .itemInfo {
                    .itemName {
                        color: #ffac29;
                        font-size: 1vw;
                        margin-top: 1.4vw;
                        margin-bottom: 1.9vw;
                    }
                    .itemBottom {
                        display: flex;
                        .bottomList {
                            margin-right: 3.6vw;
                            .bottomTitle {
                                display: block;
                                color: #9a9a9a;
                                font-size: 0.7vw;
                                margin-bottom: 0.6vw;
                            }
                            .numList {
                                font-size: 1.6vw;
                                span {
                                    font-size: 0.6vw;
                                    color: #9a9a9a;
                                }
                            }
                        }
                    }
                }
            }
        }
        .robotDetail {
            margin-top: 6.4vw;
            .detailWrapper {
                display: flex;
                .detailLeft {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-right: 8.4vw;
                    .detailBigImg {
                        width: 16vw;
                        height: 19vw;
                        border:1px solid red;
                        margin-bottom: 1.2vw;
                    }
                    .detailListWrapper {
                        text-align: left;
                        width: 11.2vw;
                        .detailList {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 1.1vw;
                            .yellowColor {
                                color: #ffac29;
                            }
                        }
                    }
                }
                .detailRight {
                    width: 24.5vw;
                    height: 27.5vw;
                    .titleLine {
                        width: 19.6vw;
                        height: 0.1vw;
                        margin-left: 0.7vw;
                        background: linear-gradient(to top right, rgba(154,154,154,0), #9a9a9a);
                        position: relative;
                        &::after {
                            content:'';
                            position: absolute;
                            right: 0;
                            top: -0.05vw;
                            width: 0.2vw;
                            height: 0.2vw;
                            background-color: #ffac29;
                        }
                    }
                    .rightTop {
                        margin-bottom: 3vw;
                        .title {
                            display: flex;
                            align-items: center;
                            margin-bottom: 1.6vw;
                        }
                        .centerSection {
                            display: flex;
                            justify-content: space-between;
                            padding-right: 1.3vw;
                            .centerList {
                                >div {
                                    margin-bottom: 1.2vw;
                                }
                            }
                        }
                        .bottomSection {
                            display: flex;
                            .list {
                                display: flex;
                                flex-direction: column;
                                margin-right: 3.8vw;
                                .listName {
                                    color: #9a9a9a;
                                    font-size: 0.7vw;
                                    margin-bottom: 0.3vw;
                                }
                                .listNum {
                                    font-size: 1.6vw;
                                    .unit {
                                        font-size: 0.6vw;
                                        color:#9a9a9a;
                                    }
                                }
                            }
                        }
                    }
                    .rightBottom {
                        .title {
                            display: flex;
                            align-items: center;
                        }
                        .paramsList {
                            .parameterName {
                                font-size: 0.7vw;
                                margin-right: 2.3vw;
                                opacity: 0.8;
                            }
                            .parameterValue {
                                font-size: 0.7vw;
                                color: #9a9a9a;
                            }
                        }
                    }
                }
            }
            .saveBtn {
                width: 11.3vw;
                height: 1.6vw;
                margin:0 auto;
                text-align: center;
                line-height: 1.4vw;
                cursor: pointer;
                border: solid 0.1vw #ffac29;
            }
        }
    }
}
</style>
