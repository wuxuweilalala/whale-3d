<template>
    <div class="editContainer">
        <div class="topBar"></div>
        <div class="leftSideBar">
            <div class="buttons">
                <button
                  :class="[item.iconfont,{active:leftSideTabActiveIndex==index}]"
                  :key="item.iconfont"
                  @click="toggleActiveButton(index)"
                  class="btn iconfont"
                  v-for="(item,index) in buttons"></button>
            </div>
            <div class="content">
                <div :key="index"
                  :style="{
                      top:$vhToPx(2.3)+index*$vwToPx(1.2+1.6)+'px'
                  }"
                  class="item"
                  v-for="(item,index) in buttons"
                  v-show="leftSideTabActiveIndex==index"
                >
                    <header>
                        <span class="name">机器人</span>
                        <span class="arrow iconfont icon-xiala"></span>
                    </header>
                    <div class="itemContainer gradientBorder">
                        <!--                        <div class="borderLine"></div>-->
                        <!--                        <div class="borderLine"></div>-->
                        <div class="borderLine"></div>
                        <div class="borderLine"></div>
                        <div class="svgBox">
                            <svg version="1.1"
                              xmlns="http://www.w3.org/2000/svg">
                                <line
                                  :style="{
                                        'stroke-width':$getVw(1)
                                      }"
                                  :x1="$vwToPx(15.4)"
                                  :y2="$vwToPx(22.2)"
                                  style="fill:none;stroke:#9a9a9a;"
                                  x2="100%"
                                  y1="100%"
                                />
                                <line
                                  :style="{
                                        'stroke-width':$getVw(1)
                                      }"
                                  :x1="$vwToPx(15.1)"
                                  :x2="$vwToPx(15.5)"
                                  :y2="$vwToPx(22.1)"
                                  style="fill:none;stroke:#9a9a9a;"
                                  y1="100%"
                                />
                                <line
                                  :style="{
                                        'stroke-width':$getVw(3)
                                      }"
                                  :x1="$vwToPx(15.1)"
                                  :x2="$vwToPx(13.5)"
                                  style="fill:none;stroke:#9a9a9a;"
                                  y1="100%"
                                  y2="100%"
                                />

                            </svg>
                        </div>

                        <!--                        <div class="innerCorner"></div>-->
                        <div class="bottomLeftLine"></div>
                        <ul class="body">
                            <li
                              :key="index"
                              v-for="(item,index) of 20"></li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
        <div class="rightSection">
            <div class="model">
                <header>
                    <span class="search iconfont icon-sousuo"></span>
                    <!--                    <input type="text"-->
                    <!--                      value="所有模型">-->
                    <span class="name">所有模型</span>
                </header>
                <div class="itemContainer gradientBorder"
                  ref="modelContainer">
                    <div class="borderLine"></div>
                    <div class="borderLine"></div>
                    <div class="svgBox">
                        <svg version="1.1"
                          xmlns="http://www.w3.org/2000/svg">
                            <line
                              :style="{
                                        'stroke-width':$getVw(1)
                                      }"
                              :x1="rightSideLine1Setting.x1"
                              :y2="rightSideLine1Setting.y2"
                              style="fill:none;stroke:#9a9a9a;"
                              x2="100%"
                              y1="100%"
                            />
                            <line
                              :style="{
                                        'stroke-width':$getVw(1)
                                      }"
                              :x1="rightSideLine2Setting.x1"
                              :x2="rightSideLine2Setting.x2"
                              :y2="rightSideLine2Setting.y2"
                              style="fill:none;stroke:#9a9a9a;"
                              y1="100%"
                            />
                            <line
                              :style="{
                                        'stroke-width':$getVw(3)
                                      }"
                              :x1="rightSideLine2Setting.x1"
                              :x2="rightSideLine3Setting.x2"
                              style="fill:none;stroke:#9a9a9a;"
                              y1="100%"
                              y2="100%"/>

                        </svg>
                    </div>

                    <div class="bottomLeftLine"></div>
                    <ul class="body">
                        <li :key="index"
                          :class="{active:modelTabActiveState[index]}"
                          v-for="(model,index) in modelLst">
                            <header >
                                <span class="name">{{model.name}}</span>
                                <span
                                  @click="toggleModelTabActiveState(index)"
                                  class="arrow iconfont icon-xiabiao"></span>
                                <!--                                  :class=""-->
                            </header>

                            <ul class="listBody"
                              v-show="modelTabActiveState[index]"
                            >
                                <li :key="childIndex"

                                  v-for="(childList,childIndex) in model.childList">
                                    <span class="name">{{childList.name}}</span>
                                    <button class="delete button iconfont icon-shanchu"></button>
                                    <button class="edit button iconfont icon-bianji"></button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="parameter">
                <header>
                    <span class="search iconfont icon-shezhi"></span>
                    <span class="name">模型设置</span>
                </header>
                <div class="itemContainer gradientBorder"
                  ref="parameterContainer">
                    <div class="borderLine"></div>
                    <div class="borderLine"></div>
                    <div class="svgBox">
                        <svg version="1.1"
                          xmlns="http://www.w3.org/2000/svg">
                            <line
                              :style="{
                                        'stroke-width':$getVw(1)
                                      }"
                              :x1="rightSideLine1Setting.x1"
                              :y2="rightSideLine1Setting.y2"
                              style="fill:none;stroke:#9a9a9a;"
                              x2="100%"
                              y1="100%"
                            />
                            <line
                              :style="{
                                        'stroke-width':$getVw(1)
                                      }"
                              :x1="rightSideLine2Setting.x1"
                              :x2="rightSideLine2Setting.x2"
                              :y2="rightSideLine2Setting.y2"
                              style="fill:none;stroke:#9a9a9a;"
                              y1="100%"
                            />
                            <line
                              :style="{
                                        'stroke-width':$getVw(3)
                                      }"
                              :x1="rightSideLine2Setting.x1"
                              :x2="rightSideLine3Setting.x2"
                              style="fill:none;stroke:#9a9a9a;"
                              y1="100%"
                              y2="100%"/>

                        </svg>
                    </div>

                    <div class="bottomLeftLine"></div>
                    <div class="body">
                        <div ></div>
                        <div ></div>
                        <div ></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="rightLine">
            <img src="@/assets/scene/rightDeoc.png" alt="">
        </div>
    </div>
</template>

<script>
    import {mapGetters,mapMutations} from 'vuex'

    export default {
        name: "index",
        data() {
            return {
                modelClient: {
                    width: 0,
                    height: 0,
                },
                leftSideTabActiveIndex: 0,
                buttons: [
                    {iconfont: 'icon-guidao'},
                    {iconfont: 'icon-PSB'},
                    {iconfont: 'icon-Sortingmember'},
                ],
            }
        },
        computed: {
            ...mapGetters('edit', {
                    modelLst: 'getModelList',
                    modelTabActiveState:'getModelTabActiveState'
                }
            ),
            rightSideLine1Setting() {
                return {
                    x1: this.modelClient.width - this.$vwToPx(0.2),
                    y2: this.modelClient.height - this.$vwToPx(0.3),
                }
            },
            rightSideLine2Setting() {
                return {
                    x1: this.modelClient.width - this.$vwToPx(0.6),
                    x2: this.modelClient.width - this.$vwToPx(0.25),
                    y2: this.modelClient.height - this.$vwToPx(0.2),
                }

                // return this.data=
            },
            rightSideLine3Setting() {
                return {
                    x2: this.modelClient.width - this.$vwToPx(2.95),
                    //
                }
            },
        },
        methods: {
            ...mapMutations('edit',{
                toggleModelTabActiveState:'toggleModelTabActiveState'
            }),
            toggleActiveButton(index) {
                this.leftSideTabActiveIndex = index
            },

        },
        mounted() {
            this.modelClient.width = this.$refs.parameterContainer.clientWidth;
            this.modelClient.height = this.$refs.parameterContainer.clientHeight
        }
    }
</script>

<style lang="scss"
  scoped>
    .gradientBorder {

        &::before {
            left: 0;
            top: 50%;
            display: block;
            content: '';
            width: 0.0625vw;
            height: 50%;
            position: absolute;
            background-image: linear-gradient(to top,
              #9a9a9a,
              rgba(154, 154, 154, 0));
        }

        &::after {
            right: 0;
            bottom: 0.2vw;
            display: block;
            content: '';
            width: 0.0625vw;
            height: 50%;
            position: absolute;
            background-image: linear-gradient(to top,
              #9a9a9a,
              rgba(154, 154, 154, 0));
        }
    }

    .editContainer {
        padding-right: 1.4vw;
        margin-top: 2.3vh;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-content: stretch;
        flex-wrap: wrap;
        .topBar {
            width: 100%;
            height: 2vw;
            background-color: #2f2f2f;
        }

        .leftSideBar {
            position: relative;
            padding-top: 2.3vh;
            width: 2.08vw;
            background-color: #2f2f2f;

            button {
                background-color: rgba(255, 172, 41, 0.11);
                color: #fff;
                display: block;
                width: 1.6vw;
                height: 1.6vw;
                margin: 0 auto 1.2vw;
                border-width: 0.0625vw;
                border-style: solid;
                border-color: transparent;

                &.active {
                    border-color: #ffac29
                }
            }

            .content {
                width: 15.7vw;

                .item {
                    width: 15.7vw;
                    left: 2.08vw;
                    position: absolute;

                    header {
                        padding-left: 0.6vw;
                        padding-right: 0.6vw;
                        background-color: rgba(47, 47, 47, 0.6);
                        width: 100%;
                        height: 1.5vw;
                        line-height: 1.5vw;
                        border: solid 0.0625vw #9a9a9a;

                    }

                    .name {
                        /*float: left;*/
                        user-select: none;
                    }

                    .arrow {
                        color: #9a9a9a;
                        cursor: pointer;
                        font-size: 0.7vw;
                        transform: rotateZ(90deg);
                        float: right;
                    }

                    .itemContainer {
                        position: relative;
                        width: 100%;
                        height: 22.4vw;
                        border-bottom-right-radius: 0.3vw;
                        box-shadow: rgba(154, 154, 154, 0.3) 0 0 1vw inset;

                        .borderLine {
                            width: 0.0625vw;
                            height: 50%;
                            position: absolute;
                            background-image: linear-gradient(to top,
                              #9a9a9a,
                              rgba(154, 154, 154, 0));

                            /*&:first-child {*/
                            /*    left: 0;*/
                            /*    top: 50%;*/
                            /*}*/

                            /*&:nth-child(2) {*/
                            /*    right: 0;*/
                            /*    bottom: 0.2vw;*/
                            /*}*/
                            &:nth-child(1) {
                                width: 0.05vw;
                                height: 1.35vw;
                                right: 0.2vw;
                                bottom: 0.3vw;
                            }

                            &:nth-child(2) {
                                width: calc(100% - 0.35vw);
                                height: 0.0625vw;
                                left: 0.2vw;
                                bottom: 0vw;
                            }
                        }

                        .svgBox {
                            pointer-events: none;
                            width: 100%;
                            height: 100%;
                            position: absolute;

                            ::v-deep svg {
                                width: 100%;
                                height: 100%;
                            }
                        }

                        .bottomLeftLine {
                            border-style: solid;
                            border-color: #9a9a9a;
                            border-width: 0 0 0.1vw 0.0625vw;
                            bottom: 0;
                            left: 0.0625vw;
                            position: absolute;
                            width: 0.8vw;
                            height: 0.5vw;
                        }

                        .body {
                            width: 100%;
                            height: 100%;
                            padding: 1vw 0.8vw;
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            align-content: flex-start;
                            flex-wrap: wrap;

                            li {
                                /*padding-right: 0.1vw;*/
                                margin-bottom: 0.5vw;
                                width: 3.3vw;
                                height: 3.3vw;
                                border: solid 0.0625vw #ffac29;

                                &.active {
                                    background-color: rgba(255, 172, 41, 0.2);
                                }
                            }
                        }
                    }


                }
            }
        }

        .rightSection{
            height: calc(100% - 2vw);
            padding-bottom: 1vw;
            padding-top: 2.3vh;
            /*height: calc(100% - 2vw);*/
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            margin-right: 0.8vw;
            /*padding-top: 2.3vh;*/
            width: 15.6vw;
            /*padding-bottom: 1vw;*/

            .model {
                align-items: flex-end;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                flex: 1;
                width: 100%;
                > header {
                    padding-left: 0.6vw;
                    background-color: rgba(47, 47, 47, 0.6);
                    width: 100%;
                    height: 1.5vw;
                    line-height: 1.5vw;

                    .search {
                        margin-right: 0.5vw;
                        float: left;
                    }


                    .name {
                        float: left;
                    }

                }

                .itemContainer {
                    flex-grow: 1;
                    .name{
                        user-select: none;
                    }
                    overflow: hidden;

                    position: relative;
                    width: 100%;
                    border-bottom-right-radius: 0.3vw;
                    box-shadow: rgba(154, 154, 154, 0.3) 0 0 1vw inset;

                    .borderLine {
                        width: 0.0625vw;
                        height: 50%;
                        position: absolute;
                        background-image: linear-gradient(to top,
                          #9a9a9a,
                          rgba(154, 154, 154, 0));

                        /*&:first-child {*/
                        /*    left: 0;*/
                        /*    top: 50%;*/
                        /*}*/

                        /*&:nth-child(2) {*/
                        /*    right: 0;*/
                        /*    bottom: 0.2vw;*/
                        /*}*/
                        &:nth-child(1) {
                            width: 0.05vw;
                            height: 1.35vw;
                            right: 0.2vw;
                            bottom: 0.3vw;
                        }

                        &:nth-child(2) {
                            width: calc(100% - 0.35vw);
                            height: 0.0625vw;
                            left: 0.2vw;
                            bottom: 0vw;
                        }
                    }

                    .svgBox {
                        pointer-events: none;
                        width: 100%;
                        height: 100%;
                        position: absolute;

                        ::v-deep svg {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .bottomLeftLine {
                        border-style: solid;
                        border-color: #9a9a9a;
                        border-width: 0 0 0.1vw 0.0625vw;
                        bottom: 0;
                        left: 0.0625vw;
                        position: absolute;
                        width: 0.8vw;
                        height: 0.5vw;
                    }

                    .body {
                        padding: 1.2vh 0.4vw 0;
                        overflow: hidden;
                        width: 100%;
                        height: calc(100% - 2.5vh);

                        > li {
                            &.active {
                                .arrow {
                                    transform: rotateZ(0);
                                }
                            }
                            > header {
                                line-height: 1.5vw;
                                height: 1.5vw;
                                background-color: rgba(183, 183, 183, 0.2);

                                > .name {
                                    margin-left: 0.4vw;
                                }

                                .arrow {
                                    cursor: pointer;
                                    transform: rotateZ(90deg);
                                    font-size: 0.7vw;
                                    color: #9a9a9a;
                                    margin-right: 0.5vw;
                                    float: right;
                                }
                            }


                            .listBody {
                                li {
                                    height: 1.5vw;
                                    line-height: 1.5vw;
                                    margin-top: 0.3vw;

                                    &:hover {
                                        background-color: rgba(183, 183, 183, 0.2);

                                        button {
                                            opacity: 1;
                                        }
                                    }

                                    .name {
                                        margin-left: 0.6vw;
                                    }

                                    button {
                                        opacity: 0;
                                        line-height: 1vw;
                                        float: right;
                                        color: #fff;

                                        &.delete {
                                            margin-right: 0.4vw;
                                        }

                                        &.edit {
                                            margin-right: 0.4vw;
                                            font-size: 0.6vw;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                margin-bottom: 1.2vh;
            }

            .parameter {
                flex: 1;
                flex-direction: column;
                display: flex;
                width: 100%;

                header {
                    padding-left: 0.6vw;
                    padding-right: 0.6vw;
                    background-color: rgba(47, 47, 47, 0.6);
                    width: 100%;
                    height: 1.5vw;
                    line-height: 1.5vw;
                    border: solid 0.0625vw #9a9a9a;

                    .search {
                        margin-right: 0.5vw;
                        float: left;
                    }

                    .name {
                        float: left;
                    }

                }

                .itemContainer {
                    flex-grow: 1;
                    position: relative;
                    width: 100%;
                    /*height: 22.4vw;*/
                    border-bottom-right-radius: 0.3vw;
                    box-shadow: rgba(154, 154, 154, 0.3) 0 0 1vw inset;

                    .borderLine {
                        width: 0.0625vw;
                        height: 50%;
                        position: absolute;
                        background-image: linear-gradient(to top,
                          #9a9a9a,
                          rgba(154, 154, 154, 0));

                        /*&:first-child {*/
                        /*    left: 0;*/
                        /*    top: 50%;*/
                        /*}*/

                        /*&:nth-child(2) {*/
                        /*    right: 0;*/
                        /*    bottom: 0.2vw;*/
                        /*}*/
                        &:nth-child(1) {
                            width: 0.05vw;
                            height: 1.35vw;
                            right: 0.2vw;
                            bottom: 0.3vw;
                        }

                        &:nth-child(2) {
                            width: calc(100% - 0.35vw);
                            height: 0.0625vw;
                            left: 0.2vw;
                            bottom: 0vw;
                        }
                    }

                    .svgBox {
                        pointer-events: none;
                        width: 100%;
                        height: 100%;
                        position: absolute;

                        ::v-deep svg {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .bottomLeftLine {
                        border-style: solid;
                        border-color: #9a9a9a;
                        border-width: 0 0 0.1vw 0.0625vw;
                        bottom: 0;
                        left: 0.0625vw;
                        position: absolute;
                        width: 0.8vw;
                        height: 0.5vw;
                    }

                    .body {
                        width: 100%;
                        height: 100%;
                        padding: 1vw 0.8vw;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-content: flex-start;
                        flex-wrap: wrap;

                        li {
                            /*padding-right: 0.1vw;*/
                            margin-bottom: 0.5vw;
                            width: 3.3vw;
                            height: 3.3vw;
                            border: solid 0.0625vw #ffac29;

                            &.active {
                                background-color: rgba(255, 172, 41, 0.2);
                            }
                        }
                    }
                }
            }
        }
        .rightLine {
            position: fixed;
            right: 1vw;
            top: 1vw;
            img {
                height: 47vw;
                background-size: 100% 100%;
            }
        }
    }

</style>
