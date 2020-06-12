<template>
    <div
        v-if="item.modelName !== '堆塔'"
        class="toolOther"
        ref="toolOther"
        :style="{ left: left + 'px', top: top + 'px', background: `url(${bgImg})`, zIndex: zIndex, width: width, height: height, backgroundSize: '100% 100%' }"
        :data-name="generateModelName"
        @mousedown.stop="mousedown"
        @mouseup.stop="mouseup"
    ></div>

    <div v-else ref="tools" :style="{ left: left + 'px', top: top + 'px' }" @mousedown.stop="mousedown" :data-name="generateModelName"
         @mouseup.stop="mouseup" class="model-other box">
        <div
            class="toolOther"
            ref="toolOther"
            :style="{ left: item.left, top: item.top, background: `url(${bgImg})`, zIndex: zIndex, width: width, height: height, backgroundSize: '100% 100%' }"
            v-for="(item, index) in getBoxItems"
            :key="index"
        ></div>
    </div>
</template>

<script>
    import mixin from '../mixin.js';
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        mixins: [mixin],
        data() {
            return {
                zIndex: 0,
                // isBox: false, // 是否是堆塔
            };
        },
        computed: {
            ...mapGetters('edit', {
                getBoxItems: 'getBoxItems',
                getBoxValue: 'getBoxValue',
            }),
            width() {
                return this.item.width;
            },
            height() {
                return this.item.height;
            }
        },
        created() {
            this.zIndex = this.getZIndex + 1;
            this.generateBox(this.item.modelName);
            this.setLeftAndTop()
            console.log('组件更新')
        },
        methods: {
            ...mapMutations('edit', {
                setPsbPos: 'setPsbPos',
                setBoxItems: 'setBoxItems',
            }),
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
                // 显示属性框
                this.$parent.posContent.none = false
                this.$parent.selectedElement = this.dom
                this.$parent.setAllValue()
                this.log('this.', this.item)
                if(this.item.modelName !== '堆塔') {
                    this.$parent.numShow = false
                } else {
                    this.$parent.elementName = '堆塔数量'
                    this.$parent.numShow = true
                }

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
            generateBox(name) {
                if (name === '堆塔') {
                    let result = []
                    // this.isBox = true;
                    let topY = -this.getBoxValue.ySpace;
                    let leftX = -this.getBoxValue.xSpace;
                    for (let i = 0; i < this.getBoxValue.boxColumns; i++) {
                        leftX = leftX + this.getBoxValue.xSpace;
                        topY = -this.getBoxValue.ySpace;
                        for (let j = 0; j < this.getBoxValue.boxRows; j++) {
                            topY = topY + this.getBoxValue.ySpace;
                            result.push({
                                left: leftX + 'px',
                                top: topY + 'px'
                            });
                        }
                    }
                    this.setBoxItems(result)
                }
            }
        },
        watch: {
            getBoxItems: {
                handler(val, old) {
                    if(val.length !== old.length) {
                        this.generateBox('堆塔')
                    }
                }
            },
            getBoxValue: {
                deep: true,
                handler(val, old) {
                    this.generateBox('堆塔')

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
    }

    .toolOther {
        cursor: move;
        position: absolute;
    }
</style>
