import {set as _set } from 'lodash'
import Vue from 'vue'
export default {
    namespaced: true,
    state: {
        robotList: [{

        }],
        modelList: [{
                name: '货架',
                childList: [
                    { name: '货架1号' },
                    { name: '货架1号' },
                    { name: '货架1号' },
                    { name: '货架1号' },
                    { name: '货架1号' },
                ]
            },
            {
                name: '播种墙',
                childList: [
                    { name: '播种墙1号' },
                    { name: '播种墙1号' },
                    { name: '播种墙1号' },
                    { name: '播种墙1号' },
                ]
            },
            {
                name: '工作人员',
                childList: [
                    {name: '工作人员1号'},
                    {name: '工作人员1号'},
                    {name: '工作人员1号'},
                    {name: '工作人员1号'},
                    {name: '工作人员1号'},
                ]
            },
        ],
        modelTabActiveState: [true, true, true],
        zIndex: 1, // 存储当前最大的 z-index
        positions: [], // 轨道的位置信息
        trackWidth: {
            width: '2.8vw',
            num: 12,
        }, // 轨道的长度
        trackPos: {}, // 轨道整体的 位置信息
        psbPos: {}, // psb 位置信息
        // 货架的数量和 space
        shelve: {
            shelvesNum: 1,
            space: 60,
        },
        shelves: [],
        boxItems: [], // 堆塔数组
        modelOptions: [],   // 模型配置数组
    },
    getters: {
        getModelList: (state) => state.modelList,
        getModelTabActiveState: (state) => state.modelTabActiveState,
        getZIndex: state => state.zIndex,
        getTrackWidth: state => state.trackWidth,
        getPositions: state => state.positions,
        getTrackPos: state => state.trackPos,
        getPsbPos: state => state.psbPos,
        getBoxItems: state => state.boxItems,
        getModelOption: state => {
            let option = localStorage.getItem('modelOptions')
            if(option !== null) {
                state.modelOptions = JSON.parse(option)
            } else {
                state.modelOptions = []
            }
            return state.modelOptions
        },
    },
    mutations: {
        setStateByKey(state, { key, value }) {
            _set(state, key, value)
        },
        setStateByKeys(state, { target, key, value }) {
            _set(target, key, value)
        },
        toggleModelTabActiveState(state, index) {
            Vue.set(state.modelTabActiveState, index, !state.modelTabActiveState[index])
        },
        setZIndex(state, index) {
            state.zIndex = index
        },
        setPosition(state, array) {
            state.positions.push(...array)
        },
        setTrackWidth(state, width) {
            for (let i in width) {
                state.trackWidth[i] = width[i]
            }
        },
        setTrackPos(state, pos) {
            state.trackPos = pos
        },
        setPsbPos(state, pos) {
            state.psbPos = pos
        },
        setShelve(state, data) {
            for (let i in data) {
                state.shelve[i] = data[i]
            }
        },
        setShelvesArray(state, data) {
            state.shelves = data
        },
        setBoxItems(state, data) {
            state.boxItems = data
        },
        setModelOptions(state, data) {
            let option = localStorage.getItem('modelOptions')
            if(option !== null) {
                state.modelOptions = JSON.parse(option)
            } else {
                state.modelOptions = []
            }
            if(data.index !== undefined) {
                state.modelOptions[data.index] = data
            } else {
                state.modelOptions.push(data)
            }
            if(state.modelOptions.length > 0) {
                localStorage.setItem('modelOptions', JSON.stringify(state.modelOptions))
            }
        },
        initModelOption(state) {
            let option = localStorage.getItem('modelOptions')
            if(option !== null) {
                state.modelOptions = JSON.parse(option)
            } else {
                state.modelOptions = []
            }
        },
        setOptions(state, data) {
            state.modelOptions = data
            if(state.modelOptions.length > 0) {
                localStorage.setItem('modelOptions', JSON.stringify(state.modelOptions))
            }
        },
        changeBox(state, box) {
            state.box = box
        }
    },
    actions: {},
    modules: {}
}
