<template>
  <div
    class="toolBZQ borderBox"
    ref="toolBZQ"
    :style="{
      left: left + 'px',
      top: top + 'px',
      background: `url(${bgImg})`,
      zIndex: zIndex,
      // backgroundSize: '100% 100%',
    }"
    :data-name="generateModelName"
    @mousedown.stop="mousedown"
    @mouseup.stop="mouseup"
  >
    <div v-if="true" class="toolBZQFragment">
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
      zIndex: 0,
    }
  },
  created() {
    this.zIndex = this.getZIndex + 1
  },
  methods: {
    mousedown(event) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        this.domOffsetLeft = 0;
        this.domOffsetTop = 0;
        //
        this.dom = this.$refs.toolBZQ
        // 设置 z-index
        this.dom.style.zIndex = this.getZIndex + 1
        this.setZIndex(this.getZIndex + 1)

        // 显示属性框
        this.setParentValue('轨道数量', false, false)

        this.domWidth = this.dom.offsetWidth;
        this.domHeight = this.dom.offsetHeight;
        // event.target.style.cursor = "move";
        // 鼠标按下位置 -> 定位盒子的距离 -> 里面有6个定位的盒子, 所以不能用这个
        // this.offsetX = event.offsetX
        // this.offsetY = event.offsetY

        this.getParentTag(this.dom)
        this.offsetX = event.clientX - this.domOffsetLeft
        this.offsetY = event.clientY - this.domOffsetTop

        window.onmousemove = event => {
            this.moveClac(this.dom)
        };
    }
  },
  mounted() {
    var oDiv = this.$refs.toolBZQ
    this.borderBox(oDiv)
  }
};
</script>

<style lang="scss" scoped>
.toolBZQ {
  width: 2.7vw;
  height: 25.2vw;
  position: absolute;
  .toolBZQFragment {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: move;
    .toolBZQChild {
      height: 4.65vh;
      width: 2.7vw;
      margin-bottom: 2.1vh;
      &:last-child {
        // 40.3vh - 38.4  1.9/2   0.95  2.1vh*5=10.5 + 1.9 = 12.4    (40.3-12.4)/6 = 4.65
        margin-bottom: 0.95vh;
      }
      &:first-child {
        margin-top: 0.95vh;
      }
    }
  }
}
</style>
