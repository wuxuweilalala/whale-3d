<template>
  <div
    class="toolBZQ borderBox"
    ref="toolBZQ" :style="{
      left: left + 'px',
      top: top + 'px',
      background: `url(${bgImg}) no-repeat`,
      zIndex: zIndex,
      width: width,
      border: border,
      // backgroundSize: '100% 100%',
    }"
    :data-num="num" :data-space="space" :data-name="generateModelName" :data-id="componentId"
    :data-index="index" @mousedown.stop="mousedown" @mouseup.stop="mouseup"
    v-if="show" :data-deleted="!show"
  >
    <div class="toolBZQFragment">
      <div class="toolBZQChild" v-for="(item, index) in 6" :key="index"></div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import mixin from "../mixin.js";
export default {
  mixins: [mixin],
    data() {
        return {
            zIndex: 9999,
            num: 1,
            space: 60,
            // componentId: '',
            show: true,
            height: '480px',
            border: '',
            widthStyle: '',
        }
    },
    created() {
      if(!this.item.isDeleted) {
          this.widthStyle = Number(this.width.replace('px', '')) + 4 + 'px'
          this.$nextTick(() => {
              this.setBorderStyle(this.widthStyle, this.height, this.item.left - 2, this.item.top - 2)
          })
          // let len = this.$parent.floorList[0].componentList[0].itemList.length - 1
          // let isDrag = Boolean(sessionStorage.getItem('isDrag'))
          // if (this.index === len && isDrag) {
          //   this.findIsSelected()
          // }
          this.$parent.key = this.$parent.uuid()

          this.zIndex = this.getZIndex - 1
          // this.border = this.item.border
          this.initData()
          this.border = this.item.border
          this.componentId = this.item.id
      } else {
            this.show = !this.item.isDeleted
        }
    },
    computed: {
        width() {
            return '46px'
        }
    },
    methods: {
        initData() {
            if(this.item.stationNum !== undefined) {
                this.num = this.item.stationNum
            }
            if(this.item.stationSpace !== undefined) {
                this.space = this.item.stationSpace
            } else {
                if(this.item.modelName === '工作站') {
                    this.space = 1
                } else if(this.item.modelName === '拣货通道') {
                    this.space = 60
                } else if(this.item.modelName === 'PST通道') {
                    this.space = 60
                }
            }
        },
        mousedown(event) {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
            this.domOffsetLeft = 0;
            this.domOffsetTop = 0;

          this.dom = this.$refs.toolBZQ
            // 设置 z-index
            this.dom.style.zIndex = this.getZIndex - 1
            // this.border = '0.08vw solid rgba(230, 162, 64, 1)'
            this.setZIndex(this.getZIndex - 1)

            // 显示属性框
            if (this.item.modelName == '工作站') {
                this.setParentValue('轨道数量', this.dom, false, false)
            }
            this.$parent.showBorder(this.index)
            // this.setBorderStyle(this.width, this.height, this.left - 2, this.top)
            this.$parent.posNum = this.num
            this.$parent.posLeft = this.left
            this.$parent.posTop = this.top
            this.$parent.posSpace = this.space

            this.$parent.border = '0.05vw solid rgba(255, 172, 41, 1)';
            this.domWidth = this.dom.offsetWidth;
            this.domHeight = this.dom.offsetHeight;
            // event.target.style.cursor = "move";
            // 鼠标按下位置 -> 定位盒子的距离 -> 里面有6个定位的盒子, 所以不能用这个
            // this.offsetX = event.offsetX
            // this.offsetY = event.offsetY

            this.getParentTag(this.dom)
            this.offsetX = event.clientX - this.domOffsetLeft
            this.offsetY = event.clientY - this.domOffsetTop
            this.widthStyle = Number(this.width.replace('px', '')) + 4 + 'px'
            this.heightStyle = Number(this.height.replace('px', '')) + 4 + 'px'
            this.$parent.key = this.$parent.uuid()
            this.setBorderStyle(this.widthStyle, this.heightStyle, this.item.left - 2, this.item.top - 2)
            this.setIsSelected(this.item.id)
            window.onmousemove = event => {
                this.moveClac(event, this.dom, this.widthStyle, this.heightStyle)
            };

        }
    },
    mounted() {
        // var oDiv = this.$refs.toolBZQ
        // this.borderBox(oDiv)
    },
    watch: {
        getModelOption: {
            deep: true,
            handler(val, old) {

              let option = val[this.index]
                let selectedId = this.$parent.selectedId
                if(option.id === selectedId && !option.isDeleted) {
                    this.num = option.stationNum
                    this.space = option.stationSpace
                    this.setBorderStyle(this.width, this.height, this.left, this.top)
                }
                this.show = !option.isDeleted
            }
        },
    }
};
</script>

<style lang="scss" scoped>
.toolBZQ {
    width: 46px;
    height: 480px;
    position: absolute;
    cursor: move;

    .toolBZQFragment {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: move;

    .toolBZQChild {
        height: 43px;
        width: 46px;
        margin-bottom: 19px;

        &:last-child {
            // 40.3vh - 38.4  1.9/2   0.95  2.1vh*5=10.5 + 1.9 = 12.4    (40.3-12.4)/6 = 4.65
            margin-bottom: 9px;
        }

        &:first-child {
            margin-top: 9px;
        }
    }
  }
}
</style>
