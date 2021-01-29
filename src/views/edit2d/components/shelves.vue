<template>
  <div @mousedown.stop="mousedown"
       @mouseup.stop="mouseup"
       :class="className"
       :data-name="generateModelName"
       :data-id="componentId"
       ref="shelves"
    :style="{left: left + 'px', top: top + 'px', width: width, border: border,}"
    :data-num="num"
       :data-space="space"
       :data-index="index"
       v-if="show" :data-deleted="!show"
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
        zIndex: 9999,
        shevles: [],
          dict: {},
          num: 1,
          space: 53.76,
          className: {
              shelves: true,
              shelve: false,
              pst: false,
              way: false,
          },
          show: true,
          height: '480px',
          border: '',
          widthStyle: '',
      }
  },
  computed: {
      ...mapState('edit', {
          modelOptions: 'modelOptions',
      }),
      ...mapGetters('edit', {
          getZIndex: 'getZIndex',
          getModelOption: 'getModelOption',
      }),
      width() {
          if(this.num > 1) {
              return parseInt(this.num * this.space - (this.space - 46)) + 2 + 'px'
          } else {
              return parseInt(this.num * 46) + 2 + 'px'
          }
      }
  },
  created() {
      if(!this.item.isDeleted) {
          this.widthStyle = Number(this.width.replace('px', '')) + 2 + 'px'
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
          this.initModel()
      } else {
          this.show = !this.item.isDeleted
      }
  },
  methods: {
      ...mapMutations('edit', {
          setZIndex: 'setZIndex',
      }),
      initModel() {
          this.border = this.item.border
          if(this.item.shelvesNum !== undefined) {
              this.num = this.item.shelvesNum
          }
          if(this.item.shevlesSpace !== undefined) {
              this.space = this.item.shevlesSpace
          }
          this.setShelvesPosition(this.num, this.space)
          if(this.item.modelName == '货架') {
              this.className.shelve = true
          } else if(this.item.modelName == 'PST通道') {
              this.className.pst = true
          } else if(this.item.modelName == '拣货通道') {
              this.className.way = true
          }
      },
      mousedown(event) {
          this.mouseX = event.clientX;
          this.mouseY = event.clientY;
          this.domOffsetLeft = 0;
          this.domOffsetTop = 0;
          //
        this.dom = this.$refs.shelves
        // 保存选中的元素

        if (this.item.modelName == '货架') {
          this.setParentValue('货架数量', this.dom)
        } else if (this.item.modelName == 'PST通道') {
          this.setParentValue('通道数量', this.dom)
        } else if (this.item.modelName == '拣货通道') {
          this.setParentValue('通道数量', this.dom)
        }
        this.$parent.showBorder(this.index)
        // this.setBorderStyle(this.width, this.height, this.left, this.top)
        let shelves = this.$refs.shelves
        this.$parent.posNum = parseInt(this.num)
        this.$parent.posLeft = this.left
        this.$parent.posTop = this.top
        this.$parent.posSpace = this.space

          this.dom.style.zIndex = this.getZIndex - 1
        // console.log('dom 货架', this.dom, this.dom.style, this.getZIndex + 1)
          this.setZIndex(this.getZIndex - 1)
          this.domWidth = this.dom.offsetWidth;
          this.domHeight = this.dom.offsetHeight;
          event.target.style.cursor = "move";
          // 鼠标按下位置 -> 定位盒子的距离
          // this.offsetX = event.offsetX
          // this.offsetY = event.offsetY

          this.getParentTag(this.dom)
          this.offsetX = event.clientX - this.domOffsetLeft
          this.offsetY = event.clientY - this.domOffsetTop

          this.widthStyle = Number(this.width.replace('px', '')) + 2 + 'px'
          this.heightStyle = Number(this.height.replace('px', '')) + 4 + 'px'

          this.$parent.key = this.$parent.uuid()
          this.setBorderStyle(this.widthStyle, this.heightStyle, this.item.left - 2, this.item.top - 2)
          this.setIsSelected(this.item.id)
          localStorage.setItem('floorList', JSON.stringify(this.$parent.floorList))
          this.$parent.updated()
          window.onmousemove = event => {
              this.moveClac(event, this.dom, this.widthStyle, this.heightStyle)
          };
      },
      /**
       * @author hfm
       * @param event
       */
      setShelvesPosition(num, space) {
          // this.shevles = []
          let result = []
          let spaces = -space
          for (let i = 0; i < num; i++) {
              spaces = spaces + space

              result.push({
                  left: spaces + 'px',
              })
          }
          this.shevles = result
      },
  },
  watch: {
      getModelOption: {
          deep: true,
          handler(val, old) {
            // let option = this.$parent.getArrayFromUUID(val, this.componentId)
            //
            let option = val[this.index]
            this.show = !option.isDeleted
            let selectedId = this.$parent.selectedId
            if (option.id === selectedId && !option.isDeleted) {
                this.setShelvesPosition(option.shelvesNum, option.shevlesSpace)
                this.num = option.shelvesNum
                this.space = option.shevlesSpace
                this.border = option.border
                this.setBorderStyle(Number(this.width.replace('px', '')) + 2 + 'px', this.height, this.left - 2, this.top)
            }
          }
      },
  }
};
</script>

<style lang="scss" scoped>
    .shelves {
        position: absolute;
        width: 100%;
        height: 480px;


        .toolHG {
            width: 46px;
            height: 480px;
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
