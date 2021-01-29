<template>
    <div class="parametersList"
      v-if="list.length>0">

        <div :class="[{active:type=== selected},'parametersTitle']"
          @click="toDrop">
            <div class="text">
                <svg class="icon"
                  aria-hidden="true">
                    <use :xlink:href="`#icon-${iconList[type]['icon']}`"/>
                </svg>
                <span>{{iconList[type].name}}</span>
            </div>
            <div :class="[{bottomIcon:dropShow },'arrow']">
                <svg class="icon"
                  aria-hidden="true">
                    <use xlink:href="#icon-xiabiao"/>
                </svg>
            </div>
        </div>
        <ul :class="{machineList:!dropShow }">
            <li v-for="(item,index) in list"
              :key="index">
             <img :class="type" :src="require(`../../assets/scene/${type}.png`)" />
                <p><span>编号：</span>{{item.code}}</p>
                <p><span>X：</span>{{item.x}}<span>Y:</span>{{item.y}}<span>Z:</span>{{item.z}}</p>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "dropList",
        props: ['list', "type",'selected'],
        data() {
            return {
                dropShow: false,
                detailShow: false,
                currentIndex: 0,
                iconList: {
                    pst: {icon: 'guidao ', name: '机器人PST',index:0},
                    psb: {icon: 'PSB', name: '机器人PSB',index:1},
                    pick: {icon: 'Sortingmember', name: "分拣员",index:2}
                },
            }
        },
        methods: {
            toDrop() {
                this.dropShow = !this.dropShow;
                this.$parent.currentIndex=this.type

            },

        },
    }
</script>

<style lang="scss"
  scoped>

    .parametersList {
        width: 67.71vw;

        .parametersTitle {
            width: 67.71vw;
            height: 1.56vw;
            padding: 0 0.78vw;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: url("../../assets/scene/titleSelect.png") no-repeat;
            background-size: 100% 100%;

        }

        .active {
            background: url("../../assets/scene/titleSelecting.png") no-repeat;
            background-size: 100% 100%;
        }

        .text {
            font-size: 0.73vw;
            .icon {
                margin-right: 0.3vw;
                width: 0.78vw;
                height: 0.73vw;

            }
        }

        .arrow {
            transform: unset;
        }

        .bottomIcon {
            transform: rotate(-180deg);

        }

        ul {
            height: 0;
            overflow: hidden;
        }

        .machineList {
            height: auto;
            display: flex;
            flex-wrap: wrap;
            padding: 1.85vh 0 1.8vh;

            li {
                width: 8.02vw;
                height: 9.01vw;
                background: url("../../assets/scene/liBox.png") no-repeat;
                background-size: 100% 100%;
                /*flex: 0 0 8.02vw;*/
                margin-right: 1.92vw;
                margin-bottom: 2vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                &:nth-child(7n) {
                    margin-right: 0;

                }
                img{
                    margin-bottom: 1.2vw;
                }
                p{
                    width: 100%;
                    font-size: 0.63vw;
                    padding: 0 0.52vw;
                    color: rgba(255, 252, 252, 1);
                    span{
                        color: rgba(204, 204, 204, 1);
                    }

                }
                p:nth-child(3){
                    display: flex;
                    justify-content: space-between;
                    margin-top: .83vw;

                }
            }
            .pst{
                width: 10.19vh;
                height: 3.98vh;
            }
            .psb{
                width: 8.98vh;
                height: 5.65vh;
            }
            .pick{
                width: 5.65vh;
                height: 6.48vh;}
        }

        .dropContent {
            width: 14.3vw;
            height: 10.5vw;
            padding: 0.5vw 0 1vw 0.5vw;
            background-color: rgb(15, 18, 18);
            border: solid 0.1vw #989898;
            margin-top: -0.5vw;
            margin-bottom: 0.5vw;
            overflow: scroll;

            &::-webkit-scrollbar {
                display: none
            }

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
</style>