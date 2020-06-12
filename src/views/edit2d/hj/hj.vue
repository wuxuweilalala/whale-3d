<template>
  <div @mousedown.stop="mousedown"
       @mouseup.stop="mouseup"
       class="shelves"
       :data-name="generateModelName"
       ref="shelves"
       :style="{left: left + 'px', top: top + 'px',}"
  >
    <div
      class="toolHG"
      ref="toolHG"
      :style="{left: item.left, top: item.top, background: `url(${bgImg})`,
      zIndex: zIndex, backgroundSize: '100% 100%',}"

      v-for="(item, index) in getShelvesArray"
      :key="index"
    >
      <!--    <div v-if="true" class="toolHGFragment">-->
      <!--      <div class="toolHGChild" v-for="(item, index) in 6" :key="index"></div>-->
      <!--    </div>-->
    </div>
  </div>
</template>

<script>
import mixin from "../mixin.js";
import { mapGetters, mapMutations } from 'vuex';
export default {
  mixins: [mixin],
  data() {
      return {
          zIndex: 0,
      }
  },
  computed: {
      ...mapGetters('edit', {
          getZIndex: 'getZIndex',
          getShelve: 'getShelve',
          getShelvesArray: 'getShelvesArray',
      })
  },
  created() {
      this.zIndex = this.getZIndex + 1
      this.setShelvesPosition(this.getShelve.shelvesNum, this.getShelve.space)
      // this.$parent.posContent.none = false
  },
  mounted() {
      this.registerEvent()
  },
  methods: {
      ...mapMutations('edit', {
          setZIndex: 'setZIndex',
          setShelvesArray: 'setShelvesArray',
          setShelve: 'setShelve',
      }),
      registerEvent() {
          this.$on('setNum', (res) => {
              console.log('方法1:触发监听事件监听成功')
              console.log(res)
          })
      },
      mousedown(event) {
          this.mouseX = event.clientX;
          this.mouseY = event.clientY;
          this.domOffsetLeft = 0;
          this.domOffsetTop = 0;
          // 显示属性框
          this.$parent.posContent.none = false
          this.$parent.elementName = '货架数量'
          this.$parent.setAllValue()
          //
          this.dom = this.$refs.shelves
          // 保存选中的元素
          this.$parent.selectedElement = this.dom
          this.$parent.numShow = true

          this.dom.style.zIndex = this.getZIndex + 1
          console.log('dom 货架', this.dom, this.dom.style, this.getZIndex + 1)
          this.setZIndex(this.getZIndex + 1)
          this.domWidth = this.dom.offsetWidth;
          this.domHeight = this.dom.offsetHeight;
          event.target.style.cursor = "move";
          // 鼠标按下位置 -> 定位盒子的距离
          // this.offsetX = event.offsetX
          // this.offsetY = event.offsetY

          this.getParentTag(this.dom)
          this.offsetX = event.clientX - this.domOffsetLeft
          this.offsetY = event.clientY - this.domOffsetTop

          window.onmousemove = event => {
            this.moveClac(this.dom)
          };
      },
      setShelvesPosition(num, space) {
          let spaces = -space
          let result = []
          for (let i = 0; i < num; i++) {
              spaces = spaces + space
              result.push({
                  left: spaces + 'px',
              })
          }
          this.setShelvesArray(result)
      },

  },
  watch: {
      getShelvesArray: {
          handler(val, old) {
              if(val.length !== old.length) {
                  this.setShelvesPosition(this.getShelve.shelvesNum, this.getShelve.space)
              }
          }
      },
      getShelve: {
          deep: true,
          handler(val, old) {
              this.setShelvesPosition(this.getShelve.shelvesNum, this.getShelve.space)
          }
      }

  }
};
</script>

<style lang="scss" scoped>
    .shelves {
        position: absolute;
        .toolHG {
            width: 2.4vw;
            height: 25.2vw;
            z-index: 1;
            position: absolute;
            cursor: move;
            .toolHGFragment {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .toolHGChild {
                    width: 2.4vw;
                    height: calc(40.3vh / 6);
                }
            }
        }
    }
</style>