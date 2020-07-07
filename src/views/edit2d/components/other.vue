<template>
    <div
        v-if="item.modelName !== '堆塔'"
        :class="className"
        ref="toolOther"
        :style="{ left: left + 'px', top: top + 'px', background: `url(${bgImg})`, zIndex: zIndex, width: width, height: height, backgroundSize: '100% 100%' }"
        :data-name="generateModelName"
        :data-index="index"
        @mousedown.stop="mousedown"
        @mouseup.stop="mouseup"
        :data-id="componentId"
        v-show="show" :data-deleted="!show"
    ></div>

    <div v-else ref="tools" :style="{ left: left + 'px', top: top + 'px' }" @mousedown.stop="mousedown" :data-name="generateModelName"
         @mouseup.stop="mouseup" class="model-other box" :data-id="componentId" :data-num="boxColumns"
         :data-space="xSpace" :data-index="index" v-show="show" :data-deleted="!show"
    >
        <div
            :class="className"
            ref="toolOther"
            :style="{ left: item.left, top: item.top, background: `url(${bgImg})`, zIndex: zIndex, width: width, height: height, backgroundSize: '100% 100%' }"
            v-for="(item, index) in boxs"
            :key="index"
        ></div>
    </div>
</template>

<script>
    import mixin from '../mixin.js';
    import {mapGetters, mapMutations, mapState} from 'vuex';

    export default {
        mixins: [mixin],
        data() {
            return {
                zIndex: 9999,
                boxColumns: 1,
                boxRows: 6,
                ySpace: 80,
                xSpace: 60,
                boxs: [],
                // isBox: false, // 是否是堆塔
                show: true,
            };
        },
        computed: {
            ...mapGetters('edit', {
                getBoxItems: 'getBoxItems',
                getModelOption: 'getModelOption',
            }),
            width() {
                return this.item.width;
            },
            height() {
                return this.item.height;
            },
            className() {
                return `toolOther other-${this.index}`
            },
        },
        created() {
            if(!this.item.isDeleted) {
                this.zIndex = this.getZIndex + 1
                // this.border = this.item.border
                this.setLeftAndTop()
                this.initModel()
            } else {
                this.show = !this.item.isDeleted
            }
        },
        methods: {
            ...mapMutations('edit', {
                setPsbPos: 'setPsbPos',
                changeBox: 'changeBox'
            }),
            initModel() {
                if(this.item.boxColumns !== undefined) {
                    this.boxColumns = this.item.boxColumns
                }
                if(this.item.boxSpace !== undefined) {
                    this.xSpace = this.item.boxSpace
                }
                // debugger
                this.generateBox(this.item.modelName, this.boxColumns, this.xSpace);
            },
            setLeftAndTop() {
                if (this.item.modelName === 'PSB') {
                    this.setPsbPos({
                        left: this.item.left - this.item.offset.x,
                        top: this.item.top - this.item.offset.y,
                    })
                }
            },
            mousedown(event) {
                this.mouseX = event.clientX;
                this.mouseY = event.clientY;
                this.domOffsetLeft = 0;
                this.domOffsetTop = 0;
                // if (this.isBox) {
                if (this.item.modelName == '堆塔') {
                    this.dom = this.$refs.tools;
                } else {
                    this.dom = this.$refs.toolOther;
                }
                if (this.item.modelName !== '堆塔') {
                    this.setParentValue('', this.dom, false, false)
                } else {
                    this.setParentValue('堆塔数量', this.dom, true, true)
                    this.$parent.posSpace = this.xSpace
                    this.$parent.posNum = parseInt(this.boxColumns)
                }
                this.$parent.showBorder(this.index)
                // this.border = '0.08vw solid rgba(230, 162, 64, 1)'
                this.$parent.posLeft = this.left
                this.$parent.posTop = this.top

                this.dom.style.zIndex = this.getZIndex + 1;
                this.setZIndex(this.getZIndex + 1);
                this.domWidth = this.dom.offsetWidth;
                this.domHeight = this.dom.offsetHeight;
                this.dom.style.cursor = 'move';
                // 鼠标按下位置 -> 定位盒子的距离
                // this.offsetX = event.offsetX
                // this.offsetY = event.offsetY

                this.getParentTag(this.dom);
                this.offsetX = event.clientX - this.domOffsetLeft;
                this.offsetY = event.clientY - this.domOffsetTop;

                window.onmousemove = event => {
                    this.moveClac(this.dom);
                };
            },
            generateBox(name, boxColumns, xSpace, boxRows=6) {
                if (name === '堆塔') {
                    // this.isBox = true;
                    let result = []
                    let topY = -this.ySpace;
                    let leftX = -xSpace;
                    for (let i = 0; i < boxColumns; i++) {
                        leftX = leftX + xSpace;
                        topY = -this.ySpace;
                        for (let j = 0; j < boxRows; j++) {
                            topY = topY + this.ySpace;
                            result.push({
                                left: leftX + 'px',
                                top: topY + 'px'
                            });
                        }
                    }
                    this.boxs = result
                }
            }
        },
        watch: {
            getModelOption: {
                deep: true,
                handler(val, old) {
                    // let option = this.$parent.getArrayFromUUID(val, this.componentId)
                    let option = val[this.index]
                    this.show = !option.isDeleted
                    let selectedId = this.$parent.selectedId
                    if(option.id === selectedId && !option.isDeleted) {
                        this.generateBox('堆塔', option.boxColumns, option.boxSpace)
                        this.boxColumns = option.boxColumns
                        this.boxSpace = option.boxSpace
                    }
                }
            }

        },
        updated() {
            // console.log(this.isBox, '拖拽生成的item.modelName',this.item.modelName)// 导致PSB其他组件重复的原因(true)
        }
    };
</script>

<style lang="scss" scoped>
    .model-other {
        position: absolute;
        /*border: 0.05vw solid rgba(255, 172, 41, 1);*/
    }

    .toolOther {
        cursor: move;
        /*border: 0.05vw solid rgba(255, 172, 41, 1);*/
        position: absolute;
    }
</style>
