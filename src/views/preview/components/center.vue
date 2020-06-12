<template>
    <div class="centerSider">
        <div class="centerCell">
            <div class="titleIcon"></div>
            <div class="titleContain">
                <span class="workTime"
                  :key="index"
                  @click="changeStyle(index)"
                  v-for="(item, index) in processTitles">{{ item }}</span>
            </div>
            <div class="playTimes"
              v-show="playTimesShow">
                <span :class="[{'timeActive':currentPlayIndex===index, 'playTime': true}]"
                  :key="index"
                  @click='changePlayTimes(index)'
                  v-for="(time, index) in playTimes"
                >{{ time }}</span>
            </div>
            <div class="processRule">
                <div class="ruleLeft"></div>
                <div class="processContain">
                    <div class='progress_play'
                      :style="{width:progressTime?progressTime+'%':0+'%'}"></div>
                    <!--                    <vue-slider-->
                    <!--                      :tooltip="'none'"-->
                    <!--                      v-model="sliderValue"-->
                    <!--                      :processStyle="style"-->
                    <!--                    >-->
                    <!--                        <template v-slot:dot="{ value, focus }">-->
                    <!--                            <div :class="['custom-dot', { focus }]"></div>-->
                    <!--                        </template>-->
                    <!--                    </vue-slider>-->

                </div>
                <!-- <div class="processContain"  @click="processClick">
                    <div class="processStart" :style="startStyle">
                        <div class="processCirle" ref="play" @mouseup="processMouseUp" @mousedown="processMouseDown">
                            <div class="processCirleDecorate">
                                 @dragstart="processDragstartEvent" @drag="processDragEvent"
                            </div>
                        </div>
                    </div>

                </div> -->

                <div class="ruleRight">

                </div>
            </div>
            <div class="processName">
                <div class="processNameLeft">
                    <span class="title">{{ processNames[0].title  }}</span>
                    <span class="time">{{totalTime |formatSeconds  }}</span>
                </div>
                <div class="center">
                    <span class="playClass"
                      @click="changePlayState"><span
                      :class="{'play': playState, 'pause': !playState}"></span></span>
                </div>
                <div class="processNameRight">
                    <span class="title">{{ processNames[1].title }}</span>
                    <span class="time">{{totalTime-moveTime |formatSeconds  }}</span>
                </div>
            </div>
        </div>
        <div class="dialogWrapper"
          v-show="dialogShow">
            <div class="dialog">
                <header>
                    <span>播放倍数设置</span>
                    <svg aria-hidden="true"
                      @click="closeDialog"
                      class="icon">
                        <use xlink:href="#icon-Shutdown"/>
                    </svg>
                </header>
                <div class="content">
                    <span>自定义</span>
                    <input placeholder="请输入你要输入的倍数"
                      type="text"
                      @focus="removeText"
                      v-model="playTimeText">
                    <span class="text">倍</span>
                </div>
                <div class="projectBtn">
                    <global-button
                      @click.native="dialogShow = false"
                      name="取消"/>
                    <global-button
                      @click.native="determine"
                      class="createBtn"
                      name="确定"/>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    // import VueSlider from 'vue-slider-component';
    // import 'vue-slider-component/theme/default.css';
    // import VueSlider from 'vue-slider-component';
    // import 'vue-slider-component/theme/default.css';
    import {mapGetters, mapMutations} from 'vuex';

    export default {

        data() {
            return {
                processTitles: ['作业时间', '发货量'],        // 进度条的标题
                playTimesShow: true,            // 作业时间的播放速度是否显示
                playTimes: ['1x', '2x', '3x', '5x'],   // 播放速度
                currentPlayIndex: 0,    // 当前播放速度的位置
                sliderValue: 40,    // 进度条 的值
                processNames: [{
                    title: '作业所需时长',
                    num: '00:00:00',
                }, {
                    title: '剩余时长',
                    num: '00:00:00',
                },],    // 进度条下面的名称
                playStateStyle: {},    // 播放显示
                playTime: {
                    playTime: true,
                    timeActive: false,
                },
                style: {
                    backgroundImage: 'linear-gradient(90deg, #ffac29 0%, #ff7f29 100%)',
                },
                dialogShow: false,   // 自定义倍数对话框是否显示
                progressValue: 0,
                timer: null,
                playTimeText: '请输入你要输入的倍数',       // 默认倍数
            };
        },
        filters: {
            formatSeconds: function (value) {
                if (!value && value < 0) return '00:00:00'
                let result = parseInt(value)
                let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
                let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
                let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
                result = `${h}:${m}:${s}`
                return result
            }
        },
        components: {
            // VueSlider,
        },
        computed: {
            ...mapGetters('index', {
                speedTimes: 'getSpeedTimes',
                playState: 'getplayState', // 播放状态
                DateSolt: 'getSelectedDate',
                firstPlay: 'getFirstPlay',//获取初始请求
                progressTime: 'getProgressTime',//运动总时长
                animateState: 'getPlayedAnimateState',
                dataSelected: 'getDataSelected',
                totalTime: 'getTotalTime',
                moveTime: "getMoveTime",
            }),
        },
        methods: {
            ...mapMutations('index', {
                setplayState: 'setplayState',
                setMoveTime: 'setMoveTime',
                setTotalTime: 'setTotalTime',
            }),
            // 播放暂停按钮 点击事件
            changePlayState(event) {
                let self = this;
                if (!self.playState) {
                    if (JSON.stringify(self.DateSolt) !== '{}') {
                        if (self.animateState) {
                            self.$emit('play', self.DateSolt, true);
                        } else {
                            self.$emit('play', self.DateSolt, false);
                        }
                    } else {
                        self.$message({
                            showClose: true,
                            message: '请选择任务时间段',
                            type: 'error'
                        });
                        // self.$store.commit('index/setFirstPlay', true);
                        return;
                    }
                }
                // self.$store.commit('index/setFirstPlay', false);
                if (!self.playState) {
                    self.$store.commit('index/setplayState', true);
                } else {
                    self.$store.commit('index/setplayState', false);
                }
                console.log('播放vrtl', this.playState)

            },
            // 底部工作时间和发货量切换的事件绑定
            changeStyle(index) {
                if (index == 1) {
                    if (this.processTitles[0] == '发货量') {
                        this.processTitles = ['作业时间', '发货量'];
                    } else {
                        this.processTitles = ['发货量', '作业时间'];
                    }
                }
                if (this.processTitles[0] == '发货量') {
                    this.processNames = [{
                        title: '已发货量',
                        num: '10000件',
                    }, {
                        title: '未完成',
                        num: '10000件',
                    },];
                    this.playTimesShow = false;
                } else {
                    this.processNames = [{
                        title: '作业所需时长',
                        num: '00:00:00',
                    }, {
                        title: '剩余时长',
                        num: '00:00:00',
                    },];
                    this.playTimesShow = true;
                }
            },
            // 播放速度切换的点击事件
            changePlayTimes(index) {
                this.currentPlayIndex = index;
                let playTimes = 1;
                if (index == 4) {
                    this.dialogShow = true;
                    return;
                } else {
                    playTimes = this.playTimes[index].split('x')[0];
                }
                this.$store.commit('index/setSpeedTimes', playTimes);
            },
            // 关闭对话框事件
            closeDialog() {
                this.dialogShow = false;
            },
            // 删除 input 的文字
            removeText() {
                this.playTimeText = '';
            },


            // 确定按钮的点击事件
            determine() {
                console.log('deter mine');
                let playTimes = parseInt(this.playTimeText);
                if (isNaN(playTimes)) {
                    playTimes = 1;
                }
                this.$store.commit('index/setSpeedTimes', playTimes);
                this.dialogShow = false;
                this.playTimeText = '请输入你要输入的倍数';
            },

        },
        mounted() {
        },
        beforeDestroy() {
            clearInterval(this.timer);
        },
        watch: {
            progressTime() {
                // let progressTime=this.progressTime
                // console.log('this.progressTime', this.progressTime)
                if (this.progressTime >= 100) {
                    let self = this;
                    setTimeout(function () {
                        self.$store.commit('index/setplayState', false);
                    }, 2000)
                    // this.$store.commit('index/setplayState', false);
                    this.$store.commit('index/setFirstPlay', true);
                    this.setMoveTime(0);
                    this.setTotalTime(0);
                    clearInterval(this.timer);
                }
            },
            moveTime() {
                // if (this.moveTime >= 105) {
                //     this.$store.commit('index/setplayState', false);
                //     this.$store.commit('index/setFirstPlay', true);
                //     this.setMoveTime(0);
                //     this.setTotalTime(0);
                //     clearInterval(this.timer);
                // }
            }
        }
    };
</script>

<style lang="scss"
       scoped>
    .centerSider {
        position: absolute;
        bottom: 4vh;
        left: 20.3vw;

        .titleIcon {
            position: absolute;
            top: 0;
            left: 0;
            width: 8.1vw;
            height: 2.5vh;
            background: url('~@/assets/scene/processTitle.png');
            background-size: 100% 100%;
        }

        .centerCell {
            position: relative;
            background: url('~@/assets/scene/process.png');
            width: 54vw;
            height: 10.4vh;
            background-size: 100% 100%;

            .playTimes {
                /*width: 5.2vw;*/
                height: 2vh;
                display: flex;
                position: absolute;
                top: 1.5vh;
                right: 0.8vw;
                .playTime {
                    background-color: rgba(113, 113, 113, 0.3);
                    margin-left: 0.5vw;
                    /*width: 2vw;*/
                    height: 2vh;
                    border: 0.1vh solid #666666;
                    font-size: 1.4vh;
                    color: #9a9a9a;
                    text-align: center;
                    cursor: pointer;
                    padding: 0vw 0.4vw;
                }

                .timeActive {
                    color: #ffac29;
                    border: 0.1vh solid #ffac29;
                }

            }

            .processRule {
                position: absolute;
                top: 4vh;
                left: 1.8vw;
                width: 51.1vw;
                height: 2.7vh;
                background: url('~@/assets/scene/processRule.png');
                background-size: 100% 100%;

                .ruleLeft {
                    width: 0.2vw;
                    height: 1.6vh;
                    background-color: #ffffff;
                    position: absolute;
                    top: 0.55vh;
                    left: -0.4vw;
                }

                .processContain {
                    width: 51.15vw;
                    height: 0.3vh;
                    position: absolute;
                    top: 1.1vh;
                    left: 0;
                    background: #9a9a9a;

                    .progress_play {
                        height: 100%;
                        transition: width 0.5s;
                        background-image: linear-gradient(90deg, #ffac29 0%, #ff7f29 100%);
                        /*border: solid 0.1vw #9a9a9a;*/
                    }

                    .custom-dot {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background-image: linear-gradient(90deg, #ffac29 0%, #ff7f29 100%);
                        transition: all .3s;
                    }

                    .custom-dot:hover {
                        transform: rotateZ(45deg);
                    }

                    .custom-dot.focus {
                        border-radius: 50%;
                    }

                    .processStart {
                        width: 17.5vw;
                        height: 0.6vh;
                        position: absolute;
                        top: -0.15vh;
                        left: 0;
                        background-image: linear-gradient(90deg, #ffac29 0%, #ff7f29 100%);
                    }

                    .processCirle {
                        width: 1.4vw;
                        height: 1.4vw;
                        background: url('~@/assets/scene/processCircle.png');
                        background-size: 100% 100%;
                        display: flex;
                        position: absolute;
                        right: -0.7vw;
                        top: -1.15vh;
                        z-index: 999;
                        cursor: pointer;

                        .processCirleDecorate {
                            width: 1.6vw;
                            height: 2.4vh;
                            display: flex;
                            background: url('~@/assets/scene/circleDecorate.png');
                            background-size: 100% 100%;
                            position: absolute;
                            top: 1.2vh;
                            left: 0.8vw;
                        }
                    }
                }

                .ruleRight {
                    width: 0.2vw;
                    height: 1.6vh;
                    background-color: #ffffff;
                    position: absolute;
                    top: 0.55vh;
                    right: -0.4vw;
                }
            }

            .processName {
                position: absolute;
                top: 7vh;
                left: 1.7vw;
                display: flex;
                justify-content: space-between;
                width: 51.5vw;
                height: 2.6vh;

                .title {
                    font-size: 1.1vh;
                    color: #ffffff;
                }

                .time {
                    margin-left: 0.6vw;
                    font-size: 0.9vw;
                    color: #ffac29;
                }

                .center {
                    display: flex;
                    width: 1.3vw;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;

                    .playClass {
                        background: url('~@/assets/scene/playcontent.png');
                        background-size: 100% 100%;
                        width: 1.3vw;
                        height: 1.3vw;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        .play {
                            background: url('~@/assets/scene/play.png');
                            width: 0.5vw;
                            height: 1vh;
                            background-size: 98% 95%;
                        }

                        .pause {
                            background: url('~@/assets/scene/pause.png');
                            width: 0.5vw;
                            height: 1vh;
                            background-size: 98% 95%;
                        }
                    }

                    img {
                        width: 0.5vw;
                        height: 1vh;
                    }
                }

            }

        }

        .titleContain {
            font-size: 0.7vw;
            color: #808080;
            width: 8.1vw;
            height: 2.4vh;
            display: inline-block;
            margin: 0.2vh 0 0 0.5vw;
            position: absolute;
            z-index: 10;

            .workTime {
                color: #ffffff;
                font-size: 0.8vw;
                cursor: pointer;

                &:nth-child(2) {
                    margin-left: 0.9vw;
                    color: #808080;
                    font-size: 0.7vw;
                    cursor: pointer;
                }
            }
        }

        .dialogWrapper {
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            position: fixed;
            z-index: 999;
            background: rgba(0, 0, 0, .5);
            /*z-index: 1111;*/

            .dialog {
                width: 24.1vw;
                height: 17vw;
                background: url('~@/assets/scene/addProjectBg.png');
                background-size: 100% 100%;
                position: relative;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                padding: 0 1.3vw;

                span {
                    font-size: 1vw;
                }

                p {
                    margin-top: 2.4vw;
                    margin-bottom: 1.5vw;
                    font-size: .8vw;
                    color: rgba(255, 255, 255, 0.5)
                }

                header {
                    display: flex;
                    align-items: center;
                    height: 2.5vw;
                    justify-content: space-between;
                    color: rgba(255, 255, 255, 0.5);

                    .icon {
                        cursor: pointer;
                        width: 0.9vw;
                        height: 0.9vw;
                    }
                }

                .content {
                    margin-top: 1.7vw;

                    span {
                        color: #ffffff;
                        opacity: 0.5;
                    }

                    .text {
                        margin-left: 0.6vw;
                    }

                    input {
                        width: 19.7vw;
                        height: 2vw;
                        margin-top: 1.5vw;
                        background: transparent;
                        border: 0.1vh solid #7f7f7f;
                        padding-left: 0.4vw;
                        color: #666666;
                        font-size: 0.7vw;

                        &:focus {
                            border: 0.1vh solid #ffac29;
                        }
                    }
                }

                .projectBtn {
                    margin-left: -1.3vw;
                    width: 100%;
                    bottom: 2vw;
                    position: absolute;
                    display: flex;
                    justify-content: center;

                    .createBtn {
                        color: #ffac29;
                        margin-left: 2.2vw;
                    }
                }


            }
        }
    }
</style>
