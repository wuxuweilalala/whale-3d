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
      v-for="(item, index) in shevles"
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
import { mapGetters, mapMutations, mapState } from 'vuex';
export default {
  mixins: [mixin],
  data() {
      return {
          zIndex: 0,
          shevles: [],
          dict: {},
          num: 1,
          space: 60,
      }
  },
  computed: {
      ...mapState('edit', {
          modelOptions: 'modelOptions',
      }),
      ...mapGetters('edit', {
          getZIndex: 'getZIndex',
          getModelOption: 'getModelOption',
      })
  },
  created() {
      this.zIndex = this.getZIndex + 1
      this.initModel()
  },
  methods: {
      ...mapMutations('edit', {
          setZIndex: 'setZIndex',
      }),
      initModel() {
          if(this.item.num !== '') {
              this.num = this.item.num
          }
          if(this.item.space !== '') {
              this.space = this.item.space
          }
          this.setShelvesPosition(this.num, this.space)
      },
      mousedown(event) {
          this.mouseX = event.clientX;
          this.mouseY = event.clientY;
          this.domOffsetLeft = 0;
          this.domOffsetTop = 0;
          //
          this.dom = this.$refs.shelves
          // 保存选中的元素

          if(this.item.modelName == '拣货通道') {
              this.setParentValue('通道数量')
          } else if(this.item.modelName == 'PST通道') {
              this.setParentValue('通道数量')
          } else if(this.item.modelName == '货架') {
              this.setParentValue('货架数量')
          }

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
      /**
       * @author hfm
       * @param event
       */
      setShelvesPosition(num, space) {
          this.shevles = []
          let spaces = -space
          for (let i = 0; i < num; i++) {
              spaces = spaces + space
              this.shevles.push({
                  left: spaces + 'px',
              })
          }
      },

  },
  watch: {
      getModelOption: {
          deep: true,
          handler(val, old) {
              let option = val[this.index]
              this.setShelvesPosition(option.shelvesNum, option.shevlesSpace)
          }
      },
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
