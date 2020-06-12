<template>
    <div class="leftSide">
        <div class="myProject">
            <span>{{getProjectHeaderTitle}}</span>
            <img @click.stop="createWrapperShow"
              alt=""
              class="addProject"
              src="@/assets/scene/addProject.png">
        </div>
        <div @click.stop
          class="projectWrapper">
            <div class="projectListWrapper"
              v-if="projectList.length !== 0">
                <div :key="index"
                  :style="{
						backgroundImage:`url(${list.screenshot})`
					}"
                  class="projectItem"
                  v-for="(list,index) in projectListFilter">
                    <div
                      :class="{projectSelected:activeProjectIndex == index+(currentPage-1)*4}"
                      @click="projectListClick(index)"
                      @mouseenter="projectFocus(index)"
                      @mouseleave="iconShow=false"
                      class="projectList"
                      ref="projectList"
                    >
                        <div class="svgBox">
                            <svg version="1.1"
                              xmlns="http://www.w3.org/2000/svg">
                                <polyline
                                  :points="svgBorderPoints"
                                  :style="{
                                        'stroke-width':$getVw(2),
                                         stroke:activeProjectIndex == index+(currentPage-1)*4?'#ffac29':'rgba(154,154,154,0.5)'
                                      }"
                                  style="fill:none"
                                />
                                <polygon
                                  :points="polygonPotions"
                                  :style="{
                                         fill:activeProjectIndex == index+(currentPage-1)*4?'#ffac29':'rgba(154,154,154,0.5)'
                                      }"
                                  :transform="'translate('+`${projectBoxWidth/2-$vwToPx(1.3)}`+')'"
                                />

                            </svg>
                            <!--                            <svg version="1.1"-->
                            <!--                              transform="rotate(180)"-->
                            <!--                              style="transform: rotateZ(180deg);transform-origin: 50% 50%"-->
                            <!--                              xmlns="http://www.w3.org/2000/svg">-->
                            <!--
                                                       </svg>-->
                        </div>
                        <div class="projectInner">
                            <!--                      v-if="projectInnerShow "-->
                            <!--                      && projectCurrentIndex === index"-->
                            <div class="projectCenter"
                              v-show="iconShow">
                                <img :src="viewImgSrc"
                                  @click="enterPreview"
                                  @mouseenter="viewMouseEnter"
                                  alt="">
                                <img :src="shareImgSrc"
                                  @click="isShareDialogShow = true"
                                  @mouseenter="shareMouseEnter"
                                  alt=""
                                  class="share">
                            </div>
                            <div @click="settingShowIndex = index"
                              class="setting">
                                <svg aria-hidden="true"
                                  class="icon">
                                    <use xlink:href="#icon-shezhi"/>
                                </svg>
                                <div @mousedown.stop
                                  class="settingDialog"
                                  v-click-outside="{fn:()=>{settingShowIndex = -1}}"
                                  v-if="settingShowIndex===index">
                                    <div class="list">
                                        <svg aria-hidden="true"
                                          class="icon">
                                            <use xlink:href="#icon-copy"/>
                                        </svg>
                                        <span>复制</span>
                                    </div>
                                    <div @mousedown="()=>{
                                    settingShowIndex=-1
                                    deleteProject({list,index:index+(currentPage-1)*4})
                                }
                               "
                                      class="list">
                                        <svg aria-hidden="true"
                                          class="icon">
                                            <use xlink:href="#icon-shanchu"/>
                                        </svg>
                                        <span>删除</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="projectTitle">
                            <p>{{ list.name || list.pro_name }}</p>
                            <p>{{ list.nowTime || list.projectDetail.nowTime }}</p>
                        </div>
                    </div>
                </div>

            </div>
            <div @click.stop="createWrapperShow"
              class="createProject"
              v-if="projectList.length === 0">
                <div class="createBtn">
                    <img alt=""
                      src="@/assets/scene/createProjectBg.png">
                    <span>创建项目</span>
                </div>
            </div>
            <Pagination :currentPage="currentPage"
              :pageCount="4"
              :pageSize="pageSize"
              :small="true"
              :total="projectList.length"
              @current-change="handleCurrentChange"
              v-if="projectList.length !== 0"/>
        </div>
        <div class="dialogWrapper scene"
          v-show="sceneOptionShow">
            <div @mousedown.stop
              class="dialog"
              v-click-outside="{fn:()=>{
                          handleIsCreateWrapperShow(false);
                          resetProjectInfo();
                          setAreaNull();
              }}">
                <header>
                    <span>新建项目</span>
                    <svg @click="()=>{
                         handleIsCreateWrapperShow(false);
                         resetProjectInfo();
                         setAreaNull();
                    }"
                      aria-hidden="true"
                      class="icon">
                        <use xlink:href="#icon-Shutdown"/>
                    </svg>
                </header>
                <div class="tabWrapper">
                    <div :class="{active:floorTabActiveIndex===0}"
                      @click="toggleFloorTabActiveIndex(0)"
                      class="tab first">
                        <input v-model='sceneOption[0].id'/>
                    </div>
                    <div :class="{active:floorTabActiveIndex===1}"
                      @click="toggleFloorTabActiveIndex(1)"
                      class="tab second"
                      v-if="sceneOption.length>1">
                        <input v-model='sceneOption[1].id'/>
                        <span @click.stop="deleteFloor"
                          class="closeBtn iconfont icon-Shutdown"></span>
                    </div>
                    <div @click="addFloor"
                      class="add"
                      v-if="sceneOption.length===1">
                        <span class="iconfont icon-Aplussign"></span>
                    </div>
                </div>
                <div class="areaInfo">
                    <div class="item actual">
                        <span class="text">实际面积:</span>
                        <span>{{ areaWidth * areaHeight }}</span><span class="unit">m²</span>
                    </div>
                    <div class="item used">
                        <span class="text">使用面积:</span>
                        <span>{{ usedAreaWidth * usedAreaHeight }}</span><span class="unit">m²</span>
                    </div>
                </div>
                <div class="inputBox"
                  v-if="floorTabActiveIndex===0">
                    <div class="item station">
                        <span class="text">单元数</span>
                        <input @blur="stationBlurEvent"
                          class="itemInput"
                          placeholder="4"
                          type="text"
                          v-model="sceneOption[0].stationNum">
                        <span class="unit">个</span>
                    </div>
<!--                    <div class="item shelves">-->
<!--                        <span class="text">货架数量</span>-->
<!--                        <input @blur="stationBlurEvent"-->
<!--                          class="itemInput"-->
<!--                          placeholder="20"-->
<!--                          type="text"-->
<!--                          v-model="sceneOption[0].shelvesUnitNum">-->
<!--                        <span class="unit">个</span>-->
<!--                    </div>-->
                    <div class="item shelves">
                        <span class="text">样式</span>
                        <span :class="basicType" @click="basicClickEvent">默认样式</span><br>
                        <span :class="editType" @click="editClickEvent">自定义样式</span>
                        <span class="enter2d" v-show="enterShow" @click="enterEdit2d">进入页面</span>
                    </div>
                    <div class="item stationTip"
                      v-show="stationTipShow">
                        <span class="tipIcon"></span>
                        <span class="tipText">当前场景最大可容纳{{ stationNumMax }}个单元和{{ shelvesUnitNumMax }}货架数</span>
                    </div>
                </div>
                <div class="inputBox"
                  v-else>
                    <div class="item station">
                        <span class="text">单元数</span>
                        <input @blur="stationBlurEvent"
                          class="itemInput"
                          placeholder="4"
                          type="text"
                          v-model="sceneOption[1].stationNum">
                        <span class="unit">个</span>
                    </div>
                    <div class="item shelves">
                        <span class="text">货架数量</span>
                        <input @blur="stationBlurEvent"
                          class="itemInput"
                          placeholder="20"
                          type="text"
                          v-model="sceneOption[1].shelvesUnitNum">
                        <span class="unit">个</span>
                    </div>
                    <div class="item stationTip"
                      v-show="stationTipShow">
                        <span class="tipIcon"></span>
                        <span class="tipText">当前场景最大可容纳{{ stationNumMax }}个单元和{{ shelvesUnitNumMax }}货架数</span>
                    </div>
                </div>
                <div class="projectBtn">
                    <global-button @click.native="previousStep"
                      name="上一步"/>
                    <global-button @click.native="createProject"
                      class="createBtn"
                      name="创建"/>
                </div>
            </div>
        </div>
        <div class="dialogWrapper"
          v-show="isCreateWrapperShow">
            <div @mousedown.stop
              class="dialog"
              v-click-outside="{fn:()=>{
                          handleIsCreateWrapperShow(false);
                           resetProjectInfo();
                           setAllOption();
              }}">
                <header>
                    <span>新建项目</span>
                    <svg @click="()=>{
                         handleIsCreateWrapperShow(false);
                         resetProjectInfo();
                         setAllOption();
                    }"
                      aria-hidden="true"
                      class="icon">
                        <use xlink:href="#icon-Shutdown"/>
                    </svg>
                </header>
                <div class="projectName">项目名称</div>
                <input class="projectInput"
                  placeholder="新建项目"
                  type="text"
                  v-model="projectName">

                <div class="inputBox">
                    <div class="item">
                        <span class="area">实际面积</span>
                        <div class="area">
                            <input class="area"
                              placeholder="80"
                              type="text"
                              v-model="areaWidth">
                            <span class="plusIcon"><img alt=""
                              src="@/assets/scene/plus.png"></span>
                            <input class="area"
                              placeholder="80"
                              type="text"
                              v-model="areaHeight">
                            <span class="unit">m</span>
                        </div>
                    </div>
                    <div class="item">
                        <span class="usedArea usedArea-right">使用面积</span>
                        <div class="usedArea">
                            <input class="usedArea"
                              placeholder="60"
                              type="text"
                              v-model="usedAreaWidth">
                            <span class="plusIcon"><img alt=""
                              src="@/assets/scene/plus.png"></span>
                            <input class="usedArea"
                              placeholder="60"
                              type="text"
                              v-model="usedAreaHeight">
                            <span class="unit">m</span>
                        </div>
                    </div>

                </div>
                <div class="inputBox infoBox">
                    <div class="item">
                        <span class="">whalehouseID</span>
                        <div class="whalehouseID">
                            <input class="info"
                              placeholder="请输入whalehouseID"
                              type="text"
                              v-model="whalehouseID">
                        </div>
                    </div>
                    <div class="item">
                        <span class="">URL</span>
                        <div class="url">
                            <input class="info"
                              placeholder="请输入URL"
                              type="text"
                              v-model="requestUrl">
                        </div>
                    </div>
                </div>
                <div class="stationTip"
                  v-show="areaTipShow">
                    <span class="tipIcon"></span>
                    <span class="tipText">{{ stationTipMessage }}</span>
                </div>

                <div class="projectBtn">
                    <global-button @click.native="()=>{
                            handleIsCreateWrapperShow(false)
                             resetProjectInfo()
                    }"
                      name="取消"/>
                    <global-button @click.native="nextStep"
                      class="createBtn"
                      name="下一步"/>
                </div>
            </div>
        </div>
        <el-dialog :visible="isShareDialogShow"
          class="el-dialog">
            <div @mousedown.stop
              class="dialog"
              v-click-outside="{fn:()=>{
                        isShareDialogShow = false;
              }}">
                <header>
                    <span>分享</span>
                    <svg @click="isShareDialogShow = false"
                      aria-hidden="true"
                      class="icon">
                        <use xlink:href="#icon-Shutdown"/>
                    </svg>
                </header>
                <div class="shareSetting"
                  v-if="!shareLinkShow">
                    <p>有效期</p>
                    <el-radio-group v-model="radio">
                        <el-radio :label="3"> 永久有效</el-radio>
                        <el-radio :label="6">7天有效</el-radio>
                        <el-radio :label="9">1天有效</el-radio>
                    </el-radio-group>
                    <div class="projectBtn">
                        <global-button @click.native="isShareDialogShow = false"
                          name="取消"/>
                        <global-button @click.native="shareLinkShow = true"
                          class="createBtn"
                          name="发布"/>
                    </div>
                </div>
                <div class="shareLink"
                  v-if="shareLinkShow">
                    <p>预览链接</p>
                    <input type="text">
                    <div class="projectBtn">
                        <global-button @click.native="isShareDialogShow = false"
                          name="取消"/>
                        <global-button @click.native="createProject"
                          class="createBtn"
                          name="复制链接"/>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 警告框 -->
        <div @click="wrapperDialog(false)"
          class="wrapperDialog"
          v-if="closeDialog">
            <div class="wrapperDialogBox">
                <div class="wrapperTitle">
                    <div style="float:left;font-size: 1vw;margin-left: 1.4vw;">提示</div>
                    <div style="float: right;margin-right: 0.7vw;margin-top: 0.5vw;width: 0.9vw;height: 0.9vw;">
                        <svg @click="wrapperDialog(false)"
                          class="icon"
                          style="width: 1.4vw;height: 1.4vw;">
                            <use xlink:href="#icon-Shutdown"/>
                        </svg>
                    </div>
                </div>
                <div class="wrapperContent">
                    <div class="content">
                        <i class="el-icon-warning-outline"
                          style="color: #fdac29;width: 1.4vw;
	height: 1.4vw;"></i>
                        当前最多可创建20个项目
                    </div>
                    <div @click="wrapperDialog(false)"
                      class="wrappeConfirm">
                        我知道了
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import {
        mapGetters,
        mapMutations,
        mapActions,
        mapState
    } from 'vuex';
    import Pagination from '@/components/Pagination';
    import viewImgSrc from '../../../assets/scene/previewChosed.png';
    import shareImgSrc from '../../../assets/scene/share.png';
    import viewImgSrcNo from '../../../assets/scene/previewNoSelected.png';
    import shareImgSrcNo from '../../../assets/scene/shareSelected.png';
    import {Slider, Upload, Loading, Radio, RadioGroup, Message, Dialog} from 'element-ui';

    export default {
        name: 'LeftSide',
        components: {
            Pagination,
        },
        data() {
            return {
                projectBoxWidth: 0,
                projectBoxHeight: 0,
                projectInnerShow: true,
                sceneOptionShow: false,
                isShareDialogShow: false,
                shareLinkShow: false,
                radio: 0,
                projectCurrentIndex: 0,
                currentPage: 1,
                pageSize: 4,
                settingShowIndex: -1,
                isSettingShow: false,
                projectName: '',
                sceneOption: [{
                    stationNum: '',
                    shelvesUnitNum: '',
                    id: 'P-PMS01'
                },
                    {
                        stationNum: '',
                        shelvesUnitNum: '',
                        id: 'P-PMS02'
                    },
                ],
                floorTabActiveIndex: 0,
                // areaNum: 0,
                // usedAreaNum: 0,
                areaWidth: '', // 实际面积长
                areaHeight: '', // 实际面积宽
                usedAreaWidth: '', // 使用面积长
                usedAreaHeight: '', // 使用面积宽
                stationTipShow: false, // 新建项目弹窗 填写单元和货架的弹窗是否显示
                stationNumMax: 0, // 新建项目弹窗提示 最大的单元数
                shelvesUnitNumMax: 0, // 新建项目弹窗提示 最大的货架数
                areaTipShow: false, // 新建项目填写面积的提示框
                stationTipMessage: '', // 新建项目填写面积的提示框文字，
                closeDialog: false,
                stationNumF1: 4,
                shelvesUnitNumF1: 20,
                stationNumF2: 4,
                shelvesUnitNumF2: 20,
                iconShow: false,    // 查看和分享图表的显示
                viewImgSrc: viewImgSrc,
                shareImgSrc: shareImgSrc,
                whalehouseID: '',   // 输入项目的 id
                requestUrl: '',     // 传给后端的 url
                // 样式
                basicType: {
                    type: true,
                    typeActive: true,
                },
                editType: {
                    type: true,
                    typeActive: false,
                },
                // 是否显示进入页面
                enterShow: false,
            };
        },
        props: {
            loading: Boolean,
        },
        computed: {
            ...mapState('index', ['activeProjectIndex']),
            ...mapGetters('index', {
                currentProjectData: 'getCurrentProjectData',
                isCreateWrapperShow: 'getIsCreateWrapperShow',
                projectList: 'getProjectList',
                getCurrentProject: 'getCurrentProject',
            }),
            projectListFilter() {
                return this.projectList.slice((this.currentPage - 1) * 4, (this.currentPage - 1) * 4 + 4)
            },
            getProjectHeaderTitle() {
                let projectNum = this.projectList.length ? `(${this.projectList.length}个)` : '';
                return `我的项目${projectNum}`;
            },
            currentProjectAreaNum() {

                return this.currentProjectData.projectDetail.areaNum;
            },
            currentProjectUsedAreaNum() {
                return this.currentProjectData.projectDetail.usedAreaNum;
            },
            currentProjectUsedPercent() {
                return (this.currentProjectAreaNum / this.currentProjectUsedAreaNum * 100).toFixed(2);
            },
            projectValues() {
                return [this.currentProjectAreaNum, this.currentProjectUsedAreaNum, this.currentProjectUsedPercent];
            },
            svgBorderPoints() {
                if (this.projectBoxWidth) {
                    return `
                    ${this.$getVw(10)},0,
                    ${this.projectBoxWidth / 2 - this.$vwToPx(1.4)},0,
                    ${this.projectBoxWidth / 2 - this.$vwToPx(1.2)},${this.$vwToPx(0.3)},
                    ${this.projectBoxWidth / 2 + this.$vwToPx(1.2)},${this.$vwToPx(0.3)},
                    ${this.projectBoxWidth / 2 + this.$vwToPx(1.4)},0,
                    ${this.projectBoxWidth - this.$getVw(10)},0,
                    ${this.projectBoxWidth},${this.$getVw(10)},
                    ${this.projectBoxWidth},${this.projectBoxHeight - this.$getVw(10)},
                    ${this.projectBoxWidth - this.$getVw(10)},${this.projectBoxHeight},
                    ${this.$getVw(10)},${this.projectBoxHeight},

                    0,${this.projectBoxHeight - this.$getVw(10)},
                    0,${this.$getVw(10)},
                     ${this.$getVw(10)},0,${this.projectBoxWidth / 2 - this.$vwToPx(1.4)},0,
                    `
                    // ${this.projectBoxWidth/2+this.$vwToPx(1.4)},${this.projectBoxHeight},
                    // ${this.projectBoxWidth/2+this.$vwToPx(1.2)},${this.projectBoxHeight-this.$vwToPx(0.3)},
                    // ${this.projectBoxWidth/2-this.$vwToPx(1.2)},${this.projectBoxHeight-this.$vwToPx(0.3)},
                    // ${this.projectBoxWidth/2-this.$vwToPx(1.4)},${this.projectBoxHeight},
                }
                return '0,0'
            },
            polygonPotions() {

                return `
                        0,0,
                        ${this.$vwToPx(2.6)},0
                        ${this.$vwToPx(2.4)},${this.$vwToPx(0.18)}
                        ${this.$vwToPx(0.2)},${this.$vwToPx(0.18)}
                `
            },
        },
        mounted() {
            // 添加全局事件 点击弹出框外部时 弹出框隐藏
            // document.body.addEventListener('click', () => {
            // 	this.handleIsCreateWrapperShow(false);
            // 	this.resetProjectInfo();
            // 	this.isShareDialogShow = false;
            // }, false);
            // console.log(document.querySelector('.projectList'), this.$refs.projectList, document);
            // this.projectBoxWidth = document.querySelector('.projectList').clientWidth
            // this.projectBoxHeight = document.querySelector('.projectList').clientHeight
            this.$nextTick(function () {
                if (this.$refs.projectList) {
                    this.projectBoxWidth = this.$refs.projectList[0].clientWidth;
                    this.projectBoxHeight = this.$refs.projectList[0].clientHeight;
                    this.$emit('load', false)
                }
            })
        },
        methods: {
            // 调用 vuex 公用方法
            ...mapMutations('index', {
                changeActiveProjectIndex: 'changeActiveProjectIndex',
                handleIsCreateWrapperShow: 'changeIsCreateWrapperShow',
                deleteProjectList: 'deleteProjectList',
                setProjectName: 'setProjectName',
                setCurrentProjectId: 'setCurrentProjectId',
                setProjectIdAndUrl: 'setProjectIdAndUrl',
                setCurrentProjectData: 'setCurrentProjectData',
                setIsCreate: 'setIsCreate',
            }),
            ...mapActions('index', {
                creatProjectData: 'creatProjectData',
                getProjectData: 'getProjectData',
                deleteProject: 'deleteProject'
            }),
            resetProjectInfo() {
                this.sceneOptionShow = false
                this.projectName = '';
                this.toggleFloorTabActiveIndex(0)
                this.sceneOption.splice(0, this.sceneOption.length, {
                    stationNum: '',
                    shelvesUnitNum: '',
                    id: 'P-PMS01'
                })

                // let valueKeys = ['areaWidth', 'areaHeight', 'usedAreaWidth', 'usedAreaHeight'];
                // valueKeys.map((ele, i) => {
                // 	if (i == 0 || i == 1) {
                // 		this[ele] = 80
                // 	} else {
                // 		this[ele] = 60
                // 	}
                // });
            },
            setAreaValue(areaValue, usedAreaValue) {
                if (this.areaWidth == '') {
                    this.areaWidth = areaValue;
                }
                if (this.areaHeight == '') {
                    this.areaHeight = areaValue;
                }
                if (this.usedAreaWidth == '') {
                    this.usedAreaWidth = usedAreaValue;
                }
                if (this.usedAreaHeight == '') {
                    this.usedAreaHeight = usedAreaValue;
                }
                if (this.projectName == '') {
                    this.projectName = '新建项目';
                }
            },
            nextStep() {
                let shelvesWidth = 263.9136; //货架宽度
                let shelvesLength = 27.1469; //单个货架长度
                let shelvesPadding = 18.75; //货架间距
                let unitMax = parseInt(this.usedAreaWidth * 100 / shelvesWidth);
                let shelvesMax = parseInt(this.usedAreaHeight * 100 / (shelvesLength + shelvesPadding));
                // 判断单元数和货架数是否大于使用面积的长宽
                if ((this.sceneOption[0].stationNum > unitMax) || (this.sceneOption[0].shelvesUnitNum > shelvesMax)) {
                    this.stationNumMax = unitMax;
                    this.shelvesUnitNumMax = shelvesMax;
                }

                // 判断使用面积的长宽是否小于实际面积的长宽
                let widthBool = parseInt(this.areaWidth) < parseInt(this.usedAreaWidth);
                let heightBool = parseInt(this.areaHeight) < parseInt(this.usedAreaHeight);
                if (widthBool || heightBool) {
                    this.stationTipMessage = '使用面积不能超过实际面积';
                    this.areaTipShow = true;
                } else if (parseInt(this.areaWidth) * parseInt(this.areaHeight) > 10000) {
                    this.stationTipMessage = '实际面积不能超过10000m²';
                    this.areaTipShow = true;
                } else if (this.whalehouseID === '') {
                    this.stationTipMessage = 'whalehouseID不能为空';
                    this.areaTipShow = true;
                } else if (this.requestUrl === '') {
                    this.stationTipMessage = '请求url不能为空';
                    this.areaTipShow = true;
                } else {
                    this.handleIsCreateWrapperShow(false);
                    this.sceneOptionShow = true;
                    this.setAreaValue(80, 60);
                }

            },
            createWrapperShow() {
                // 判断如果 >= 20 个就提示不能再添加项目
                if (this.projectList.length >= 20) {
                    // 打来弹框
                    this.wrapperDialog(true);
                } else {
                    // 打来弹框
                    this.handleIsCreateWrapperShow(true)
                }

            },
            addFloor() {
                this.sceneOption.push({
                    stationNum: '',
                    shelvesUnitNum: '',
                    id: 'P-PMS02'
                })
            },
            deleteFloor() {
                this.toggleFloorTabActiveIndex(0)
                this.sceneOption.pop();
            },
            toggleFloorTabActiveIndex(index) {
                this.floorTabActiveIndex = index
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
            setSceneOptionValue() {
                if (this.sceneOption.length >= 1) {
                    if (this.sceneOption[0].stationNum !== '') {
                        this.stationNumF1 = this.sceneOption[0].stationNum
                    }
                    if (this.sceneOption[0].shelvesUnitNum !== '') {
                        this.shelvesUnitNumF1 = this.sceneOption[0].shelvesUnitNum
                    }
                    this.sceneOption.splice(0, 1, {
                        stationNum: this.stationNumF1,
                        shelvesUnitNum: this.shelvesUnitNumF1,
                        id: 'P-PMS01'
                    })
                }
                if (this.sceneOption.length == 2) {
                    if (this.sceneOption[1].stationNum !== '') {
                        this.stationNumF2 = this.sceneOption[1].stationNum
                    }
                    if (this.sceneOption[1].shelvesUnitNum !== '') {
                        this.shelvesUnitNumF2 = this.sceneOption[1].shelvesUnitNum
                    }
                    this.sceneOption.splice(1, 2, {
                        stationNum: this.stationNumF2,
                        shelvesUnitNum: this.shelvesUnitNumF2,
                        id: 'P-PMS02'
                    })
                }
            },
            setAllOption() {
                this.sceneOptionShow = false
                this.projectName = '';
                this.whalehouseID = '';
                this.requestUrl = '';
                this.areaTipShow = false;
            },
            createProject() {
                if (!this.stationTipShow) {
                    this.sceneOptionShow = false;
                    this.setSceneOptionValue();
                    let sceneOption = JSON.parse(JSON.stringify(this.sceneOption));
                    const {
                        areaWidth,
                        areaHeight,
                        usedAreaWidth,
                        usedAreaHeight,
                        whalehouseID,
                        requestUrl,
                    } = this;
                    const {
                        stationNum,
                        shelvesUnitNum
                    } = sceneOption[0];
                    let d = new Date();
                    let time = this.getDate(d);
                    let projectName = '新建项目'
                    if (this.projectName !== '') {
                        projectName = this.projectName
                    }
                    this.setIsCreate(true)
                    this.creatProjectData({
                        projectName,
                        areaInfo: [{
                            // 总面积的长宽
                            value: {
                                width: parseInt(areaWidth),
                                height: parseInt(areaHeight),
                            }
                        }, {
                            // 使用面积的长宽
                            value: {
                                width: parseInt(usedAreaWidth),
                                height: parseInt(usedAreaHeight),
                            }
                        },],
                        nowTime: time,
                        sceneOption: sceneOption,
                        whalehouseID: whalehouseID,
                        requestUrl: requestUrl,
                        machineInfo: [{
                            value: stationNum
                        },
                            {
                                value: shelvesUnitNum
                            },
                            {
                                value: stationNum * shelvesUnitNum
                            },
                            {
                                value: areaWidth * areaHeight
                            },
                        ],
                    });
                    this.setProjectName(projectName)
                    this.setAllOption()
                    this.toggleFloorTabActiveIndex(0)
                    // this.resetProjectInfo();
                }
            },
            // deleteProject(index){
            //     this.$store.dispatch('index/deleteProject', index);
            //
            //     if(this.projectListFilter.length===0)debugger
            // },
            // deleteProject({list,index}) {
            // 	this.$get('dProject', {id:list.id}).then(res => {
            // 		console.log('res',res);
            // 		if(res.code=="200"){
            // 			this.$store.commit('index/deleteProjectList', index);
            //
            // 		}
            // 	});
            // },
            toPreview(list) {

            },
            handleCurrentChange(val) {
                this.currentPage = val
            },
            setAreaNull() {
                this.areaWidth = '';
                this.areaHeight = '';
                this.usedAreaWidth = '';
                this.usedAreaHeight = '';
            },
            // 上一步操作的点击事件
            previousStep() {
                this.handleIsCreateWrapperShow(true);
                this.sceneOptionShow = false;
                this.resetProjectInfo();
                this.projectName = '新建项目';
                this.areaTipShow = false;
                // this.setAreaNull();
            },
            projectFocus(index) {
                let activeIndex = (this.activeProjectIndex % 4)
                if (activeIndex == index) {
                    this.iconShow = true;
                    this.changeActiveProjectIndex(index + (this.currentPage - 1) * 4)
                }
            },
            // 单元 input 失去焦点事件
            stationBlurEvent() {
                let shelvesWidth = 263.9136; //货架宽度
                let shelvesLength = 27.1469; //单个货架长度
                let shelvesPadding = 18.75; //货架间距
                let unitMax = parseInt(this.usedAreaWidth * 100 / shelvesWidth);
                let shelvesMax = parseInt(this.usedAreaHeight * 100 / (shelvesLength + shelvesPadding));
                if ((this.sceneOption[0].stationNum > unitMax) || (this.sceneOption[0].shelvesUnitNum > shelvesMax)) {
                    this.stationTipShow = true;
                    this.stationNumMax = unitMax;
                    this.shelvesUnitNumMax = shelvesMax;
                } else {
                    this.stationTipShow = false;
                }
            },
            // 关闭警告弹框
            wrapperDialog(status) {
                this.closeDialog = status
            },
            enterPreview() {
                this.$router.push({
                    path: '/preview',
                })
            },
            viewMouseEnter() {
                this.viewImgSrc = viewImgSrc;
                this.shareImgSrc = shareImgSrc;
            },
            shareMouseEnter() {
                this.viewImgSrc = viewImgSrcNo;
                this.shareImgSrc = shareImgSrcNo;
            },
            projectListClick(index) {
                this.changeActiveProjectIndex(index + (this.currentPage - 1) * 4)
                this.iconShow = true
                let projectId = this.getCurrentProject.id;
                this.setCurrentProjectId(projectId);
                sessionStorage.setItem('projectId', projectId)
                // localStorage.setItem('projectId', projectId)
                this.setProjectIdAndUrl({
                    id: this.getCurrentProject.projectDetail.whalehouseID,
                    url: this.getCurrentProject.projectDetail.requestUrl,
                })
            },
            basicClickEvent() {
                this.basicType.typeActive = true
                this.editType.typeActive = false
                this.enterShow = false
            },
            editClickEvent() {
                this.basicType.typeActive = false
                this.editType.typeActive = true
                this.enterShow = true
            },
            // 进入 2d 编辑器页面的点击事件
            enterEdit2d() {
                this.$router.push({
                    path: '/edit2d',
                })
            },
        },
        watch: {
            'projectListFilter.length'(length) {
                if (length === 0 && this.currentPage > 1) {
                    this.currentPage -= 1
                }
                this.$nextTick(function () {
                    this.projectBoxWidth = this.$refs.projectList[0].clientWidth;
                    this.projectBoxHeight = this.$refs.projectList[0].clientHeight;
                    this.$emit('load', false)
                })
            },
        },
        created() {
            // this.getProjectData();
        },

    };
</script>

<style>
    .el-radio-group {
        margin-bottom: 3.9vw;
    }

    .el-radio__input.is-checked + .el-radio__label {
        color: #ffac29;
    }

    .el-radio__input.is-checked .el-radio__inner {
        border-color: #ffac29;
        background: rgba(255, 172, 41, 0.5);
    }

    .el-radio__input.is-checked .el-radio__inner::after {
        display: none;
    }

    .el-radio {
        color: #fff;
    }

    .el-radio__inner {
        background: unset;
    }
</style>

<style lang="scss"
  scoped>
    .leftSide {
        margin-left: 1.4vw;
        width: 15vw;
        margin-right: 2vw;

        .myProject {
            display: flex;
            width: 100%;
            justify-content: space-between;
            height: 2vw;
            padding: 0.4vw;
            background: url('~@/assets/scene/myProject.png');

            .addProject {
                cursor: pointer;
            }
        }

        .projectListWrapper {
            height: 40vw;
            overflow: hidden;
            margin-top: 1.1vw;

            .projectItem {
                height: 9vw;
                margin-bottom: 1.1vw;
                background-size: 100% 100%;

                .projectList {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    /*height: 9vw;*/
                    /*margin-bottom: 1.1vw;*/
                    /*background: url('~@/assets/scene/projectNotSeleted.png');*/
                    background-size: 100% 100%;
                    cursor: pointer;

                    .svgBox {
                        pointer-events: none;
                        width: 100%;
                        height: 100%;
                        position: relative;

                        ::v-deep svg {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .projectTitle {
                        position: absolute;
                        /*top: 13.3vh;*/
                        bottom: 0.8vh;
                        left: 0.9vw;
                        width: 12.5vw;
                        height: 3.5vh;
                        font-family: SourceHanSansCN-Regular;

                        p {
                            width: 5.8vw;
                            height: 1.3vh;

                            &:nth-child(1) {
                                color: #ffffff;
                                font-size: 1.3vh;
                                margin-top: 0.2vh;
                            }

                            &:nth-child(2) {
                                font-size: 1.1vh;
                                margin-top: 0.7vh;
                                color: #ffffff;
                                opacity: 0.5;
                            }
                        }
                    }

                    .projectInner {
                        pointer-events: none;
                        visibility: hidden;
                    }

                    &:hover {
                        /*background: url('~@/assets/scene/projectSelected.png');*/
                        background-size: 100% 100%;

                        /*.projectInner {*/
                        /*    visibility: visible;*/
                        /*    pointer-events: visible;*/
                        /*}*/
                    }

                    &.projectSelected {
                        /*background: url('~@/assets/scene/projectSelected.png');*/
                        background-size: 100% 100%;

                        .projectInner {
                            visibility: visible;
                            pointer-events: visible;
                        }
                    }

                    .projectCenter {
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);

                        .share {
                            margin-left: 2vw;
                        }
                    }

                    .setting {
                        position: absolute;
                        top: 0.5vw;
                        right: 0.8vw;

                        .settingDialog {
                            position: absolute;
                            width: 2.3vw;
                            height: 2.3vw;
                            top: 1vw;
                            right: 0vw;
                            border: 1px solid #ffac29;

                            .icon {
                                margin-left: 0.1vw;
                            }

                            .list {
                                display: flex;
                                align-items: center;
                                font-size: 0.6vw;
                                height: 50%;

                                &:hover {
                                    background-color: rgba(0, 0, 0, 0.8);
                                }
                            }
                        }
                    }
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

                .projectName {
                    font-size: 0.8vw;
                    color: rgba(255, 255, 255, 0.5);
                    margin-top: 1vw;
                    margin-bottom: 1vw;
                }

                .projectInput {
                    padding-bottom: 0.7vh;
                }

                input {
                    background: transparent;
                    border-bottom: 1px solid #9a9a9a;
                    width: 20.5vw;
                    color: #fff;
                    // padding-bottom: 0.5vw;
                    font-size: 1.1vw;
                    // margin-bottom: 1vw;


                    &.area {
                        // margin-top: 0.5vw;
                        float: left;
                        width: 8.5vw;
                        margin-bottom: 0
                    }

                    &.usedArea {
                        // margin-top: 0.5vw;
                        float: right;
                        width: 8.5vw;
                        margin-bottom: 0
                    }

                }

                .projectBtn {
                    margin-left: -1.3vw;
                    width: 100%;
                    bottom: 1vw;
                    position: absolute;
                    display: flex;
                    justify-content: center;

                    .createBtn {
                        color: #ffac29;
                        margin-left: 2.2vw;
                    }
                }
                .infoBox {
                    margin-top: 0.6vw;
                }
                .stationTip {
                    display: flex;

                    span {
                        margin-top: 0.9vh;
                    }

                    .tipIcon {
                        background: url('~@/assets/scene/tip.png');
                        background-size: cover;
                        width: 1vw;
                        height: 1vw;
                    }

                    .tipText {
                        font-size: 0.8vw;
                        padding-left: 0.5vw;
                        color: #ff7123;
                    }
                    .tipIcon {
                        padding-bottom: 0vw;
                        padding-left: 0.5vw;
                    }

                    &:nth-child(1) {
                        background: url('~@/assets/scene/tip.png')
                    }
                }
                .inputBox {
                    /*margin-bottom: 0.6vw;*/
                    padding-right: 1.2vw;
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    .whalehouseID, .url {
                        width: 9.2vw;
                    }

                    .info {
                        margin-top: 0.4vw;
                        width: 9.2vw;
                        font-size: 0.8vw;
                        height: 1.4vw;
                        padding-bottom: 0.2vw;
                    }
                    span {
                        font-size: 0.8vw;
                        color: rgba(255, 255, 255, 0.5)
                    }

                    .stationTip {
                        display: flex;

                        span {
                            margin-top: 0.9vh;
                        }

                        .tipIcon {
                            background: url('~@/assets/scene/tip.png');
                            background-size: cover;
                            width: 1vw;
                            height: 1vw;
                        }

                        .tipText,
                        .tipIcon {
                            padding-bottom: 0vw;
                            padding-left: 0.5vw;
                        }

                        &:nth-child(1) {
                            background: url('~@/assets/scene/tip.png')
                        }
                    }

                    .item {
                        width: 9.2vw;
                    }

                    .area {
                        // float: left;
                        width: 3.6vw;
                        display: flex;
                    }

                    span {
                        margin-top: 0.4vw;

                        /*padding-bottom: 0.5vw;*/
                        img {
                            width: 0.7vw;
                            height: 0.7vw;
                        }

                        .text {
                            margin-top: 0.5vw;
                        }
                    }

                    .plusIcon {
                        display: flex;
                        align-items: center;
                        margin-top: 0vw;
                    }

                    .unit {
                        color: #ffffff;
                        font-size: 0.9vw;
                        /*margin-top: 0vw;*/
                    }

                    input {
                        padding-left: 0.1vw;
                    }

                    .stationTip {
                        width: 100%;
                        color: #ff7123;

                        span {
                            color: #ff7123;
                        }
                    }

                    .usedArea {
                        white-space: nowrap;
                        display: flex;
                        width: 3.6vw;

                        .usedArea-right {
                            float: left;
                        }
                    }
                }

                /*.area{*/
                /*    width: 6vw;*/
                /*}*/
                /*.usedArea{*/
                /*    white-space: nowrap;*/
                /*    width: 6vw;*/
                /*}*/
            }
        }

        .dialogWrapper.scene {
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            position: fixed;
            z-index: 999;
            background: rgba(0, 0, 0, .5);

            .dialog {
                width: 24.1vw;
                height: 15.9vw;
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

                .projectName {
                    font-size: 0.8vw;
                    color: rgba(255, 255, 255, 0.5);
                    margin-top: 0.6vw;
                    margin-bottom: 0.6vw;
                }

                input {
                    background: transparent;
                    border-bottom: 1px solid #9a9a9a;
                    width: 20.5vw;
                    color: #fff;
                    padding-bottom: 0.5vw;
                    font-size: 1.1vw;
                    margin-bottom: 1vw;

                    &.area {
                        margin-top: 0.5vw;
                        float: left;
                        width: 8.5vw;
                        margin-bottom: 0
                    }

                    &.usedArea {
                        // margin-top: 0.5vw;
                        float: right;
                        width: 8.5vw;
                        margin-bottom: 0
                    }

                }

                .projectBtn {
                    width: 100%;
                    bottom: 1vw;
                    position: absolute;
                    display: flex;
                    justify-content: center;

                    .createBtn {
                        color: #ffac29;
                        margin-left: 2.2vw;
                    }
                }
            }

            .tabWrapper {
                transform: translate(-0.8vw, -0.1vw);
                height: 1.5vw;
                line-height: 1.5vw;

                input {
                    font-size: 0.8vw;
                    width: 73%;
                    border-bottom: 0;
                }

                div.tab,
                span {
                    cursor: pointer;
                    font-size: 0.8vw;
                    /*text-align: center;*/
                }

                .first {
                    padding-left: 1.2vw;
                    float: left;
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    width: 5.8vw;
                    height: 1.5vw;
                    background-image: url("~@/assets/scene/floor1Tab.png");

                    &.active {
                        background-image: url("~@/assets/scene/floor1TabActive.png");
                    }

                    .closeBtn {
                        float: right;
                        margin-right: 1vw;
                    }
                }

                .second {
                    transform: translateX(-0.8vw);
                    float: left;
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    background-image: url("~@/assets/scene/floor2Tab.png");
                    width: 6.8vw;
                    height: 1.5vw;

                    input {
                        padding-left: 1.3vw;
                    }

                    &.active {
                        background-image: url("~@/assets/scene/floor2TabActive.png");
                    }

                    .closeBtn {
                        float: right;
                        margin-right: 1vw;
                    }
                }

                .add {
                    padding-left: 1.2vw;
                    /*text-align: center;*/
                    transform: translateX(-0.8vw);;
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    background-image: url("~@/assets/scene/addFloorBtn.png");
                    float: left;
                    width: 2.7vw;
                    height: 1.5vw;
                }
            }

            .areaInfo {
                padding-left: 1.2vw;
                height: 3vw;
                line-height: 3vw;

                .item {
                    &.actual {
                        margin-right: 1.6vw;
                    }

                    float: left;

                    span {
                        font-size: 0.8vw;
                    }

                    .text {
                        margin-right: 0.8vw;
                    }
                }
            }

            .inputBox {
                padding-left: 1.2vw;
                padding-right: 1.2vw;
                width: 100%;
                display: flex;
                justify-content: space-between;

                .stationTip {
                    display: flex;

                    span {
                        margin-top: 0.9vh;
                    }

                    .tipIcon {
                        background: url('~@/assets/scene/tip.png');
                        background-size: cover;
                        width: 1vw;
                        height: 1vw;
                    }

                    .tipText,
                    .tipIcon {
                        padding-bottom: 0vw;
                        padding-left: 0.5vw;
                    }
                }

                span {
                    font-size: 0.8vw;
                    color: rgba(255, 255, 255, 0.5)
                }

                .text {
                    margin-top: 0vw;
                }

                .item {
                    .itemInput {
                        margin-bottom: 0vw;
                    }
                }

                .item.station {

                    /*flex-direction: column;*/
                    /*display: flex;*/
                    /*float: left;*/
                    width: 8vw;

                    /*input{*/
                    /*    width: 6.2vw;*/
                    /*}*/
                    .text {
                        // margin-bottom: 1vw;
                        float: left;
                        width: 100%;
                    }

                    input {
                        float: left;
                        width: 6.2vw;
                    }

                    .unit {
                        float: left;
                        align-self: flex-end;
                        margin-top: 0vw;
                    }
                }


                .item.shelves {
                    /*!*flex-direction: column;*!*/
                    /*justify-content: space-between;*/
                    /*display: flex;*/
                    /*white-space: nowrap;*/
                    width: 8vw;
                    .type {
                        font-size: 0.8vw;
                        cursor: pointer;
                    }
                    .typeActive {
                        border-bottom: 0.1vw solid #ab741c;
                        color: white;
                    }
                    .enter2d {
                        color: #ffac29;
                        padding-left: 0.7vw;
                    }
                    /*flex-wrap: nowrap;*/
                    .text {
                        // margin-bottom: 1vw;
                        float: left;
                        width: 100%;
                    }

                    input {
                        float: left;
                        width: 6.2vw;
                    }

                    .unit {
                        float: left;
                        align-self: flex-end;
                        margin-top: 0vw;
                    }
                }
            }


        }

        .el-dialog, .dialogWrapper {
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            position: fixed;
            z-index: 999;
            background: rgba(0, 0, 0, .5);

            .dialog {
                width: 24.1vw;
                height: 18vw;
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
                    font-size: 0.8vw;
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

                .projectName {
                    font-size: 0.8vw;
                    color: rgba(255, 255, 255, 0.5);
                    margin-top: 0.6vw;
                    margin-bottom: 0.6vw;
                }

                .projectInput {
                    padding-bottom: 0.7vh;
                }

                input {
                    background: transparent;
                    border-bottom: 1px solid #9a9a9a;
                    width: 20.5vw;
                    color: #fff;
                    // padding-bottom: 0.5vw;
                    font-size: 1.1vw;
                    // margin-bottom: 1vw;


                    &.area {
                        // margin-top: 0.5vw;
                        float: left;
                        width: 8.5vw;
                        margin-bottom: 0
                    }

                    &.usedArea {
                        // margin-top: 0.5vw;
                        float: right;
                        width: 8.5vw;
                        margin-bottom: 0
                    }

                }

                .projectBtn {
                    margin-left: -1.3vw;
                    width: 100%;
                    bottom: 1vw;
                    position: absolute;
                    display: flex;
                    justify-content: center;

                    .createBtn {
                        color: #ffac29;
                        margin-left: 2.2vw;
                    }
                }

                .inputBox {
                    /*margin-bottom: 0.8vw;*/
                    padding-right: 1.2vw;
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;

                    span {
                        font-size: 0.8vw;
                        color: rgba(255, 255, 255, 0.5)
                    }

                    .stationTip {
                        display: flex;

                        span {
                            margin-top: 0.9vh;
                        }

                        .tipIcon {
                            background: url('~@/assets/scene/tip.png');
                            background-size: cover;
                            width: 1vw;
                            height: 1vw;
                        }

                        .tipText,
                        .tipIcon {
                            padding-bottom: 0vw;
                            padding-left: 0.5vw;
                        }

                        &:nth-child(1) {
                            background: url('~@/assets/scene/tip.png')
                        }
                    }

                    .item {
                        width: 9.2vw;
                    }

                    .area {
                        // float: left;
                        width: 3.6vw;
                        display: flex;
                    }

                    span {
                        margin-top: 0.4vw;

                        /*padding-bottom: 0.5vw;*/
                        img {
                            width: 0.7vw;
                            height: 0.7vw;
                        }

                        .text {
                            margin-top: 0.5vw;
                        }
                    }

                    .plusIcon {
                        display: flex;
                        align-items: center;
                        margin-top: 0vw;
                    }

                    .unit {
                        color: #ffffff;
                        font-size: 0.9vw;
                    }

                    input {
                        padding-left: 0.1vw;
                    }

                    .stationTip {
                        width: 100%;
                        color: #ff7123;

                        span {
                            color: #ff7123;
                        }
                    }

                    .usedArea {
                        white-space: nowrap;
                        display: flex;
                        width: 3.6vw;

                        .usedArea-right {
                            float: left;
                        }
                    }
                }

                /*.area{*/
                /*    width: 6vw;*/
                /*}*/
                /*.usedArea{*/
                /*    white-space: nowrap;*/
                /*    width: 6vw;*/
                /*}*/
            }
        }

        .el-dialog {

            ::v-deep .el-dialog__header {
                display: none;
            }

            ::v-deep .el-dialog__body {
                position: fixed;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                padding: 0;
            }
        }
    }
</style>


<style>
    .wrapperDialog {
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 999;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1111;
    }

    .wrapperDialogBox {
        width: 24.9vw;
        height: 16.6vw;
        background: url('../../../assets/scene/addProjectBg.png') no-repeat;
        background-size: 100%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
    }

    .wrapperTitle {
        width: 24vw;
        height: 2.5vw;
        overflow: hidden;
        line-height: 2.5vw;
        color: rgba(255, 255, 255, 0.5);

    .tip {
    }

    }
    .wrapperTitle .icon:hover {
        cursor: pointer;
    }

    .wrapperContent {
        width: 24vw;
        height: 13.4vw;
        text-align: center;
        position: relative;
    }

    .content {
        /* 绝对定位变为行内块， 必须设置宽度 */
        width: 100%;
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.8vw;
    }

    .wrappeConfirm {
        width: 8vw;
        height: 2.5vw;
        background: url('../../../assets/scene/barIcon.png') no-repeat;
        background-size: 100%;
        margin: 0 auto;
        line-height: 2.5vw;
        color: #ffac29;
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);

    }

    .wrappeConfirm:hover {
        cursor: pointer;
    }
</style>

