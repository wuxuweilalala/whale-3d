// reference https://github.com/noeldelgado/gemini-scrollbar/blob/master/index.js
<script>
import { addResizeListener, removeResizeListener } from "./utils/resize-event";
import { on, off } from "./utils/dom";
import scrollbarWidth from "./utils/scrollbar-width";
import Bar from "./bar";

export default {
  name: "EasyScrollbar",
  components: { Bar },
  props: {
    native: Boolean,
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: {
      type: Boolean,
      default: false
    }, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: "div"
    },
    barOption: {}
  },
  created: function() {
    this._data.opt = Object.assign(this._data.opt, this.barOption);
  },
  data() {
    return {
      sizeWidth: "0",
      sizeHeight: "0",
      moveX: 0,
      moveY: 0,
      vBarTop: 0,
      yScrollBarHeight: 0,
      parentNode: {},
      preScrollHeight: 0,
      opt: {
        barColor: "#959595", //滚动条颜色
        barWidth: 5, //滚动条宽度
        railColor: "#eee", //导轨颜色
        barMarginRight: 0, //垂直滚动条距离整个容器右侧距离单位（px）
        barMaginBottom: 0, //水平滚动条距离底部距离单位（px)
        barOpacityMin: 0.3, //滚动条非激活状态下的透明度
        zIndex: "auto", //滚动条z-Index
      }
    };
  },

  computed: {
    wrap() {
      return this.$refs.wrap;
    },
    wrapHeight() {
      return this.$refs.wrap.clientHeight;
    },
    yScrollBarBottom() {
      return this.yScrollBarHeight + (this.moveY / 100) * this.yScrollBarHeight;
    }
  },
  watch: {
  yScrollBarBottom(val) {
      if (this.yScrollBarHeight > 0 && val >= this.wrapHeight) {
	      this.$emit('yScrollToEnd', val);
      }
    }
  },
  render(h) {
    let style;
    let gutter = scrollbarWidth();
    let wrapStyle = this.wrapStyle || {};
    let barStyle = {
      color: this.opt.barColor,
      width: this.opt.barWidth + "px",
      barOpacityMin: this.opt.barOpacityMin
    };
    let railStyle = {
      zIndex: this.opt.zIndex,
      color: this.opt.railColor,
      marginRight: this.opt.barMarginRight + "px",
      marginBottom: this.opt.barMaginBottom + "px"
    };
    if (gutter) {
      const borderWidth = this.opt.borderWidth || 0;
      const gutterWith = "-" + (gutter + borderWidth) + "px";
      const gutterStyle = {
        "margin-right": gutterWith,
        "margin-bottom": this.opt.horizrailenabled ? gutterWith : "unset",
        width: this.opt.horizrailenabled
          ? `calc(100% - ${gutterWith})`
          : "unset",
        height: this.opt.horizrailenabled
          ? `calc(100% - ${gutterWith})`
          : "100%",
        "overflow-x": this.opt.horizrailenabled ? "scroll" : "hidden"
      };
      style = Object.assign(gutterStyle, wrapStyle);
    }
    const view = h(
      this.tag,
      {
        class: ["el-scrollbar__view", this.viewClass],
        style: this.viewStyle,
        ref: "resize"
      },
      this.$slots.default
    );
    const wrap = (
      <div
        ref="wrap"
        style={style}
        onScroll={this.handleScroll}
        class={[
          this.wrapClass,
          "easy-scrollbar__wrap",
          gutter ? "" : "easy-scrollbar__wrap--hidden-default"
        ]}
      >
        {[view]}
      </div>
    );
    let nodes;

    if (!this.native) {
      if (this.opt.horizrailenabled == true) {
        //水平滚动条使能
        nodes = [
          wrap,
          <Bar
            ref="refHBar"
            barStyle={barStyle}
            railStyle={railStyle}
            move={this.moveX}
            size={this.sizeWidth}
          />,
          <Bar
            ref="refVBar"
            vertical
            barStyle={barStyle}
            railStyle={railStyle}
            move={this.moveY}
            size={this.sizeHeight}
          />
        ];
      } else {
        //隐藏水平滚动条
        nodes = [
          wrap,
          <Bar
            ref="refVBar"
            vertical
            barStyle={barStyle}
            railStyle={railStyle}
            move={this.moveY}
            size={this.sizeHeight}
          />
        ];
      }
    } else {
      //原生的滚动条
      nodes = [
        <div
          ref="wrap"
          class={[this.wrapClass, "easy-scrollbar__wrap"]}
          style={style}
        >
          {[view]}
        </div>
      ];
    }
    return h("div", { class: "easy-scrollbar", ref: "scrollbar" }, nodes);
  },

  methods: {
	  scrollTo(position) {
		  if (position.x) this.wrap.scrollLeft = position.x;
		  if (position.y) {
			  this.wrap.scrollTop = position.y;
		  }
		  // this.$emit('scrolling',position.x||this.moveX,position.y||this.moveX)
	  },
    handleScroll() {
      const wrap = this.wrap;
      if (this.preScrollHeight !== wrap.scrollHeight) {
        this.preScrollHeight = wrap.scrollHeight;
        this.update();
      }
      this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight;
      this.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth;
	    this.$emit('scrolling', wrap.scrollTop, wrap.scrollTop);
    },
    handleMouseEnter: function() {
      if (this.$refs.refHBar) {
        this.$refs.refHBar.$el.children[0].style.opacity = 1;
      }
      if (this.$refs.refVBar) {
	      if(this.barOption.autoHideMode) this.$refs.refVBar.$el.style.opacity=1
        this.$refs.refVBar.$el.children[0].style.opacity = 1;
      }
    },
    handleMouseLeave: function() {
      if (this.$refs.refHBar) {
        this.$refs.refHBar.$el.children[0].style.opacity = this.opt.barOpacityMin;
      }
      if (this.$refs.refVBar) {
      	if(this.barOption.autoHideMode) this.$refs.refVBar.$el.style.opacity=0
        this.$refs.refVBar.$el.children[0].style.opacity = this.opt.barOpacityMin;
      }
    },
    update() {
      let heightPercentage, widthPercentage;
      const wrap = this.wrap;
      if (!wrap) return;
      heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight;
      this.yScrollBarHeight =
        heightPercentage < 100
          ? (heightPercentage / 100) * this.wrapHeight
          : "";
      widthPercentage = (wrap.clientWidth * 100) / wrap.scrollWidth;
      this.sizeHeight = heightPercentage < 100 ? heightPercentage + "%" : "";
      this.sizeWidth = widthPercentage < 100 ? widthPercentage + "%" : "";
      if (this.$refs.refVBar) {
        if (this.sizeHeight == 0) {
          this.$refs.refVBar.$el.style.display = "none";
        } else {
          this.$refs.refVBar.$el.style.display = "block";
        }
      }
      if (this.$refs.refHBar) {
        //存在水平滚动条的情况下
        if (this.sizeWidth == 0) {
          this.$refs.refHBar.$el.style.display = "none";
        } else {
          this.$refs.refHBar.$el.style.display = "block";
        }
      }
    }
  },

  mounted() {
    if (this.native) return;
    this.$nextTick(this.update);
    this.parentNode = this.$refs.scrollbar.parentNode;
    on(this.parentNode,'mouseenter',this.handleMouseEnter)
    on(this.parentNode,'mouseleave',this.handleMouseLeave)
    !this.noresize && addResizeListener(this.$refs.resize, this.update);
  },

  beforeDestroy() {
    if (this.native) return;
    !this.noresize && removeResizeListener(this.$refs.resize, this.update);
  }
};
</script>

<style>
.easy-scrollbar__wrap {
  width: 100%;
  height: 100%;
  overflow: scroll;
}
.easy-scrollbar__wrap--hidden-default {
  overflow: scroll;
}
.easy-scrollbar {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.easy-scrollbar__bar {
  position: absolute;
  right: 2px;
  bottom: 2px;
  z-index: 1;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.12s ease-out;
}

.easy-scrollbar__bar.is-horizontal {
  height: 6px;
  left: 0px;
  right: 0px;
}

.easy-scrollbar__bar.is-vertical {
  width: 6px;
  top: 0px;
  bottom: 0px;
  background-color: #eee;
}
.easy-scrollbar__thumb {
  position: relative;
  display: block;
  width: 6px;
  height: 6px;
  cursor: pointer;
  border-radius: inherit;
  background-color: #959595;
  opacity: 1;
  transition: opacity 0.34s ease-out;
  -moz-transition: opacity 0.34s ease-out; /* Firefox 4 */
  -webkit-transition: opacity 0.34s ease-out; /* Safari 和 Chrome */
  -o-transition: opacity 0.34s ease-out; /* Opera */
}

.easy-scrollbar__bar {
  opacity: 1;
  transition: opacity 0.34s ease-out;
}
</style>

