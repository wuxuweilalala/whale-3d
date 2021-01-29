<template>
    <div class="sceneWrapper">
        <div class="scene"
          v-if="projectList.length !== 0&&activeProjectIndex>-1">
            <img @click="toPreview"
              class="preview"
              src="@/assets/scene/scenePreview.png">
            <div class="edit">
                <div class="nowScene">
                    <span>当前场景</span>
                    <svg aria-hidden="true"
                      class="icon">
                        <use xlink:href="#icon-xiala"/>
                    </svg>
                </div>
                <div class="contentWrapper">
                    <div class="content1">
                        <div :key="index"
                          class="list"
                          v-for="(list,index) in areaInfo">
                            <span class="listName">{{areaBasicInfo[index].name}}</span>
                            <span class="listNum">{{list.value.width * list.value.height}} </span>
                        </div>
                        <div class="list">
                            <span class="listName">使用率</span>
                            <span class="listNum">{{currentProjectUsedPercent||0}}%</span>
                        </div>
                    </div>
                    <div class="nowSceneLine">
                        <img alt=""
                          src="@/assets/scene/nowSceneLine.png">
                    </div>
                    <div class="content2">
                        <div :key="index"
                          class="item"
                          v-for="(item,index) in machineInfo">
                        <span class="itemNum"
                          type="text">{{item.value}}</span>
                            <div class="itemBottom">

                                <span>{{machineBasicInfo[index].name}}</span>
                            </div>
                        </div>
                    </div>
                    <div @click='editbaleInput'
                      class="editBtn">编辑
                    </div>
                </div>
            </div>
        </div>
        <div class="noneData"
          v-if="projectList.length === 0">
            <p>当前暂无项目</p>
            <global-button @click.native.stop="createProject"
              icon="add"
              name="创建项目"/>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapState, mapMutations} from 'vuex';

    export default {
        name: "scene",

        computed: {
            ...mapState('index', ['activeProjectIndex']),

            ...mapGetters('index', {
                currentProjectData: 'getCurrentProjectData',
                isCreateWrapperShow: 'getIsCreateWrapperShow',
                projectList: 'getProjectList',
            }),
            // currentProjectAreaNum(){

            //     return this.currentProjectData.projectDetail.areaNum
            // },
            // currentProjectUsedAreaNum(){
            //     return this.currentProjectData.projectDetail.usedAreaNum
            // },
            // currentProjectUsedPercent(){
            //     let percent=(this.areaInfo[1].value/this.areaInfo[0].value*100).toFixed(2)

            //     return percent==='NaN'?0:percent
            // },
            // projectValues(){
            //     return [this.currentProjectAreaNum,this.currentProjectUsedAreaNum,this.currentProjectUsedPercent]
            // }

        },
        watch: {
            currentProjectData: {
                immediate:true,
                deep:true,
                handler(val) {
                    this.areaInfo = this._get(val, 'projectDetail.areaInfo', []);
                    this.machineInfo = this._get(val, 'projectDetail.machineInfo', []);
                },
            },
            areaInfo: {
                // immediate:,
                handler(val) {
                    if (val.length) {
                        let val1 = val[1].value
                        let val0 = val[0].value
                        let percent = ((val1.width * val1.height) / (val0.width * val0.height) * 100).toFixed(2)
                        this.currentProjectUsedPercent = percent === 'NaN' ? 0 : percent
                    }
                }
            }
        },
        data() {
            return {
                areaBasicInfo: [
                    {name: '场地面积', unit: '㎡'},
                    {name: '作业面积', unit: '㎡'},
                    {name: '面积利用率', unit: '%'},
                ],
                machineBasicInfo: [
                    {name: '工作站', icon: 'huojia'},
                    {name: '货架', icon: 'bozhongqiang'},
                    {name: '轨道', icon: 'guidao'},
                    {name: '最大吞吐量', icon: 'zuidatuntuliang'},
                ],
                areaInfo: [],
                machineInfo: [],
                currentProjectUsedPercent: 0
            }
        },
        methods: {
            ...mapMutations('index', {
                handleIsCreateWrapperShow: 'changeIsCreateWrapperShow',
                setSceneOptionShow: 'setSceneOptionShow',
                setAgainEdit: 'setAgainEdit',
            }),
            toPreview() {
                this.$router.push({path: '/preview'})
            },
            createProject() {
                this.$store.commit('index/changeIsCreateWrapperShow', true)
            },
            editbaleInput() {
                // let proData = this.currentProjectData
                // let stationNumF2 = 0
                // if (proData.projectDetail.sceneOption.length == 2) {
                //     stationNumF2 = proData.projectDetail.sceneOption[1].stationNum
                // }
                // let projectData = {
                //     projectName: proData.pro_name,
                //     areaInfo: proData.projectDetail.areaInfo,
                //     machineInfo: proData.projectDetail.machineInfo,
                //     whalehouseID: proData.projectDetail.whalehouseID,
                //     requestUrl: proData.projectDetail.requestUrl,
                //     sceneOption: proData.projectDetail.sceneOption,
                //     floorNum: proData.projectDetail.sceneOption.length,
                //     stationNumF1: proData.projectDetail.sceneOption[0].stationNum,
                //     stationNumF2: stationNumF2,
                //     floorTabActiveIndex: 0,
                //     type: {
                //         basicType: false,
                //         editType: true,
                //         basicF2Type: proData.projectDetail.sceneOption == 1,
                //         hasType: false,
                //         editF2Type: proData.projectDetail.sceneOption.length == 2,
                //     }
                // }
                // sessionStorage.setItem('currentProject', JSON.stringify(projectData))
                this.handleIsCreateWrapperShow(true)
                // this.setSceneOptionShow(true)
                this.setAgainEdit(true)
                sessionStorage.setItem('againEdit', true)
                this.$store.commit('edit/setBtnName', '保存')
            },

        }
    }
</script>

<style lang="scss"
  scoped>
    .sceneWrapper {
        position: relative;
        height: 44.2vw;
        background: url('~@/assets/scene/sceneContent.png');
        background-size: 100% 100%;
        .noneData {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);

            p {
                font-size: 1.1vw;
                color: rgba(255, 252, 252, .8);
                margin-bottom: 1.7vw;
            }
        }

        .scene {
            .preview {
                user-select: none;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 16.2vw;
                height: 17.9vw;
                cursor: pointer;
            }

            .edit {
                position: absolute;
                right: 0;
                top: 0;
                width: 17vw;

                .nowScene {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0.4vw 1.2vw;
                    background: url('~@/assets/scene/nowSceneHeader.png');
                    background-size: 100% 100%;
                }

                .contentWrapper {
                    background: url('~@/assets/scene/nowSceneContent.png');
                    background-size: 100% 100%;
                    padding-bottom: 1vw;

                    .content1 {
                        display: flex;
                        justify-content: space-between;
                        padding: 1.6vw 1.2vw;

                        .list {
                            display: flex;
                            flex-direction: column;

                            .listName {
                                color: #9a9a9a;
                                font-size: 0.7vw;
                                margin-bottom: 0.5vw;
                            }

                            .listNum {
                                font-size: 1.6vw;
                                font-family: DM;
                            }
                        }
                    }

                    .nowSceneLine {
                        text-align: center;
                    }

                    .content2 {
                        padding-top: 1vw;
                        display: flex;
                        flex-wrap: wrap;

                        .item {
                            width: 50%;
                            max-width: 8vw;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            margin-bottom: 1vw;
                            /*margin: 1.1vw 3vw ;*/
                            .itemNum {
                                max-width: 5vw;
                                flex: 1;
                                /*width: 100%*/
                                background-color: transparent;
                                display: block;
                                margin-bottom: 0.5vw;
                                color: #ffac29;
                                font-size: 1.5vw;
                            }

                            .itemBottom {
                                .icon {
                                    margin-right: 0.4vw;
                                }
                            }

                            &:nth-child(2) {
                                margin-left: 0;
                                margin-right: 0;
                            }

                            &:nth-child(4) {
                                /*margin-left: 0;*/
                                /*margin-right: 0;*/
                            }
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
    }
    .btn {
        color: #feab29;
    }
</style>
