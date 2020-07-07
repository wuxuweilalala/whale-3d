import Vue from 'vue';
import { Upload } from 'element-ui';
import {get as _get } from 'lodash'
import fa from 'element-ui/src/locale/lang/fa';
export default {
    namespaced: true,
    state: {
        activeProjectIndex: 0,
        isCreateWrapperShow: false,
        projectList: [],
        sceneDetail: {
            machineInfo: [
                { name: '工作站', value: 10, },
                { name: '货架', value: 10, },
                { name: '轨道', value: 60, },
                { name: '最大吞吐量', value: 20000, },
            ],
            arr: [
                { name: '工作站', icon: 'huojia' },
                { name: '货架', icon: 'bozhongqiang' },
                { name: '轨道', icon: 'guidao' },
                { name: '最大吞吐量', icon: 'zuidatuntuliang' },
            ]
        },
        deployList: {
            '机器人PST': { name: '机器人PST', num: 20, img: '' },
            '机器人PSB': { name: '机器人PSB', num: 30, img: '' },
            '工作人员': { name: '工作人员', num: 40, img: '' },
        },
        currentProjectId: -1,
        speedTimes: 1, //默认是1倍数
        progress_value: null,
        projectName: {}, // 项目名称
        playState: false,
        selectedDate: {},
        playedAnimateState: false, // 之前是否播放过动画
        playedAnimateData: null, // 之前的动画数据
        firstPlay: true, //是否为第一次请求数据
        totalTime: 0, //进度条运动总时长
        moveTime: 0, //已经移动时长
        dataSelected: false, // 是否重新选择日期
        nowProjectData: [], // 当前项目数据
        whalehouseID: '',
        requestUrl: '',
        isCreate: false,
        reqTimes: [], // 划分请求时间段的数组
        hasData: false,
    },
    getters: {
        getCurrentProject: state => {
            let result = []
            let index = state.activeProjectIndex
            if (index >= 0) {
                result = state.projectList[index]
            }
            return result;
        },
        // getCurrentProjectData: state => state.activeProjectIndex >= 0?
        //     state.projectList[state.activeProjectIndex]:[],

        getCurrentProjectData: state => {
            let result = []
            let id = state.currentProjectId
            let projectId = -1
            if (id === -1) {
                projectId = sessionStorage.getItem('projectId');
                // if (projectId === null) {
                //     projectId = localStorage.getItem('projectId')
                // }
            } else {
                projectId = id;
            }
            state.projectList.forEach((list, i) => {
                if (list.id == projectId) {
                    result = list
                }
            })
            if (JSON.stringify(state.nowProjectData) !== '[]') {
                return state.nowProjectData
            } else {
                return result
            }
        },
        // getCurrentProject:state=>{
        //     let projectId=sessionStorage.getItem('projectId');
        //     return state.projectList.find(ele=>ele.id==projectId)
        // },
        getIsCreateWrapperShow: state => {
            return state.isCreateWrapperShow
        },
        getProjectList: state => {
            return state.projectList
        },
        getSceneDetail: state => {
            return state.sceneDetail
        },
        getDeployList: state => {
            return state.deployList
        },
        getSpeedTimes: state => state.speedTimes,
        getProgressValue: state => state.progress_value,
        getplayState: state => state.playState,
        // 获取 项目数据
        getProjectName: state => {
            return state.projectName;
        },
        getSelectedDate: state => state.selectedDate,
        getFirstPlay: state => state.firstPlay,
        getProgressTime: state => state.moveTime / state.totalTime * 100 > 100 ? 100 : state.moveTime / state.totalTime * 100, //获取总时长
        getTotalTime: state => state.totalTime,
        getMoveTime: state => state.moveTime,
        // 获取之前是否播放动画的状态
        getPlayedAnimateState: state => state.playedAnimateState,
        // 获取之前的动画数据
        getPlayedAnimateData: state => state.playedAnimateData,
        getDataSelected: state => state.dataSelected,
        getProjectIdAndUrl: state => {
            return {
                id: state.whalehouseID,
                requestUrl: state.requestUrl,
            }
        },
        getReqTimes: state => state.reqTimes,
        getHasData: state => state.hasData,
    },
    mutations: {
        changeActiveProjectIndex(state, index) {
            let projectId = sessionStorage.getItem('projectId')
            Vue.set(state, 'activeProjectIndex', index)
            sessionStorage.setItem("projectIndex", index);

            let id = _get(state, `projectList[${index}].id`)
                // if(index > -1&&id) {
                //     // sessionStorage.setItem("projectId",  state.projectList[index].id);
                // }
            if (index == 0) {
                sessionStorage.setItem("projectId", state.projectList[0].id);
                let data = {
                    projectId: state.projectList[0].id,
                    bool: true,
                    projectData: [],
                }
                if (state.isCreate) {
                    this.commit('index/setCurrentProjectData', data)
                    state.isCreate = false;
                }
            }
        },
        changeIsCreateWrapperShow(state, status) {
            Vue.set(state, 'isCreateWrapperShow', status)
        },
        addNewProject(state, data) {
            state.projectList.unshift(data)
            this.commit('index/changeActiveProjectIndex', 0)
        },
        addProjectList(state, list) {
            state.projectList = list;
            state.projectList.map((ele, index) => {
                state.projectList[index].name = list[index].name;
                state.projectList[index].id = list[index].id;
                state.projectList[index].projectDetail = JSON.parse(state.projectList[index].pro_param)
            })
            let index = sessionStorage.getItem('projectIndex')
            if (index === null || index === 0) {
                sessionStorage.setItem('projectId', state.projectList[0].id)
            }
            this.commit('index/changeActiveProjectIndex', index || 0)
        },
        deleteProjectList(state, index) {
            state.projectList.splice(index, 1)
                // if(state.projectList.length)            state.activeProjectIndex = 0;
        },
        setSpeedTimes(state, times) { //设置倍数播放
            state.speedTimes = Number(times)
        },
        setplayState(state, flag) { //控制暂停播放
            state.playState = flag
        },
        // 设置项目名称
        setProjectName(state, name) {
            state.projectName = name;
        },
        setSelectDate(state, params) { //添加任务时间段
            state.selectedDate = params
        },
        setFirstPlay(state, value) { //设置第一次点击播放装填
            state.firstPlay = value
        },
        // 设置 playedAnimateState
        setPlayedAnimateState(state, bool) {
            state.playedAnimateState = bool;
        },
        // 设置动画数据
        setPlayedAnimateDate(state, data) {
            state.playedAnimateData = data;
        },
        setCurrentProjectId(state, id) {
            state.currentProjectId = id;
        },
        setProgress(state, params) { //attribute:属性 totalTime:总时长
            state[params.attribute] += params.value;
        },
        setDataSelected(state, selected) {
            state.dataSelected = selected
        },
        setMoveTime(state, num) {
            state.moveTime = num
        },
        setTotalTime(state, num) {
            state.totalTime = num
        },
        setCurrentProjectData(state, data) {
            if (data.bool) {
                state.projectList.forEach((list, i) => {
                    if (list.id == data.projectId) {
                        state.nowProjectData = list
                    }
                })
            } else {
                state.nowProjectData = data.projectData
            }

        },
        setProjectIdAndUrl(state, data) {
            state.whalehouseID = data.id
            state.requestUrl = data.url
        },
        setIsCreate(state, bool) {
            state.isCreate = bool
        },
        setReqTimes(state, array) {
            state.reqTimes = array
        },
        setHasData(state, bool) {
            state.hasData = bool
        },
    },
    actions: {
        getProjectData(context) {
            Vue.prototype.$get('lProject?size=20').then(res => {
                if (res.data) context.commit('addProjectList', res.data.lists)
            })
        },
        creatProjectData(context, data) {
            let { state } = context
            const { projectName, ...reset } = data
            context.commit('changeIsCreateWrapperShow', false);

            Vue.prototype.$post('cProject', {
                pro_name: projectName,
                pro_param: JSON.stringify({...reset })
            }).then(res => {
                // context.commit('setCurrentProjectId', res.data.id)
                context.commit('addNewProject', {
                    id: res.data.id,
                    name: projectName,
                    nowTime: reset.nowTime,
                    projectDetail: {...reset},
                })
                let fromEdit = sessionStorage.getItem('fromEdit')
                if (fromEdit == true) {
                    sessionStorage.setItem('projectId', res.data.id)
                    sessionStorage.setItem('isEdit', false)
                    context.commit('setCurrentProjectData', {
                        bool: false,
                        projectData: {
                            id: res.data.id,
                            name: projectName,
                            pro_name: projectName,
                            nowTime: reset.nowTime,
                            projectDetail: {...reset},
                        }
                    })
                    context.commit('setProjectName', projectName)
                    sessionStorage.setItem('fromEdit', false)
                }
                // context.commit('setProjectData', data.projectInfo)
            })

            // })
        },
        deleteProject(context, { list, index }) {
            const { state } = context
            Vue.prototype.$get('dProject', { id: list.id }).then(res => {
                if (res.code == "200") {
                    context.commit('changeActiveProjectIndex', -1)
                    context.commit('deleteProjectList', index);
                }
            });
        }

    },
    modules: {}
}
