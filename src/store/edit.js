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
                    { name: '工作人员1号' },
                    { name: '工作人员1号' },
                    { name: '工作人员1号' },
                    { name: '工作人员1号' },
                    { name: '工作人员1号' },
                ]
            },
        ],
        modelTabActiveState: [true, true, true],
        zIndex: 1, // 存储当前最大的 z-index
        positions: [], // 轨道的位置信息
        trackWidth: {
            width: '37.6vw',
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
        box: {
            xSpace: 60, // x 的间距
            ySpace: 80, // y 的间距
            boxColumns: 1, // 堆塔一列的数量
            boxRows: 6, // 堆塔一行的数量
        },
        boxItems: [], // 堆塔数组

    },
    getters: {
        getModelList: (state) => state.modelList,
        getModelTabActiveState: (state) => state.modelTabActiveState,
        getZIndex: state => state.zIndex,
        getTrackWidth: state => state.trackWidth,
        getPositions: state => state.positions,
        getTrackPos: state => state.trackPos,
        getPsbPos: state => state.psbPos,
        getShelve: state => state.shelve,
        getShelvesArray: state => state.shelves,
        getBoxItems: state => state.boxItems,
        getBoxValue: state => state.box,
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
        setBoxValue(state, data) {
            for (let i in data) {
                state.box[i] = data[i]
            }
        },
        changeBox(state, box) {
            state.box = box
        }
    },
    actions: {},
    modules: {}
}