<template>
	<div class="track-list borderBox" ref="tracks" @mousedown.stop="mousedown" @mouseup.stop="mouseup" :style="{ left: left + 'px', top: top + 'px' }" :data-name="generateModelName">
		<div
			class="toolGD"
			ref="toolBGD"
			:style="{ left: '0px', top: item.top, background: `url(${bgImg})`, width: getTrackWidth.width, zIndex: zIndex, backgroundSize: '100% 100%' }"
			v-for="(item, index) in tracks"
			:key="index"
		>
			<div v-if="true" class="toolGDFragment"><div class="toolGDChild" ref="trackRow" v-for="(item, index) in trackRows" :key="index"></div></div>
		</div>
		<!--      <span class='rect' :class="getClassName(index)" v-for="(item, index) in rects" :key="getClassName(index)" ></span>-->
	</div>
</template>

<script>
import mixin from '../mixin.js';
import { mapGetters, mapMutations } from 'vuex';
export default {
	mixins: [mixin],
	data() {
		return {
			tracks: [],
			trackRows: 10, // 一个轨道多少个
			trackColumns: 12, // 轨道数量
			space: 60, // 轨道间距
			zIndex: 0,
			// trackWidth: '57.6vw',
			rects: ['rect1', 'rect2', 'rect3', 'rect4', 'rect5', 'rect6', 'rect7', 'rect8'], // 小方块数组
            trackName: '轨道数量',
		};
	},
	created() {
		this.trackRows = this.getTrackWidth.num;
		this.setTracksPosition();
		this.zIndex = this.getZIndex + 1;
		// 获取轨道的 left top
        this.setTrackPos({
            left: this.item.left - this.item.offset.x,
            top: this.item.top - this.item.offset.y,
        })
        this.log('轨道 test', {
            left: this.item.left - this.item.offset.x,
            top: this.item.top - this.item.offset.y,
        })
	},
	computed: {
		...mapGetters('edit', {
			getTrackWidth: 'getTrackWidth'
		})
	},
	methods: {
		...mapMutations('edit', {
			setPosition: 'setPosition',
			setTrackWidth: 'setTrackWidth',
			setTrackPos: 'setTrackPos'
		}),
		mousedown(event) {
			this.mouseX = event.clientX;
			this.mouseY = event.clientY;
			this.domOffsetLeft = 0;
			this.domOffsetTop = 0;
			// 显示属性框
			this.$parent.posContent.none = false
            console.log('*******', this.$parent.posContent)
            this.$parent.elementName = this.trackName
			//
			this.dom = this.$refs.tracks;
            this.$parent.selectedElement = this.dom
            this.$parent.numShow = true
            this.$parent.setAllValue()

            this.log('this dom', this.dom, this.$refs.tracks)
			this.dom.style.zIndex = this.getZIndex + 1;
			this.setZIndex(this.getZIndex + 1);
			this.domWidth = this.dom.offsetWidth;
			this.domHeight = this.dom.offsetHeight;
			event.target.style.cursor = 'move';

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
		setTracksPosition() {
			let top = -this.space / 3;
			let result = [];
			for (let i = 0; i < this.trackColumns; i++) {
				if (i % 2 == 0) {
					top = top + this.space / 3;
				} else {
					top = top + this.space;
				}
				this.tracks.push({
					top: top + 'px'
				});
				result.push({
					left: 0,
					top: top
				});
			}
			this.setTrackPos({
				left: this.item.left,
				top: this.item.top
			});
			this.setPosition(result);
		},
		setTracksValue(width, trackNum) {
			this.setTrackWidth(`${width}vw`);
			this.trackRows = trackNum;
		},
		getClassName(index) {
			return 'rect-' + index;
		}
	}
};
</script>

<style lang="scss" scoped>
.track-list {
	width: 37.6vw;
	z-index: 1;
	/*height: 25.2vw;*/
	position: absolute;
	/*border: 0.1vh solid rgba(255, 172, 41, 1);*/
	.toolGD {
		width: 37.6vw;
		height: 2.1vh;
		position: absolute;
		.toolGDFragment {
			display: flex;
			.toolGDChild {
				width: calc(37.6vw / 12);
				height: 2.1vh;
				cursor: move;
			}
		}
	}
	.rect {
		width: 0.7vw;
		height: 0.7vw;
		background-color: rgba(255, 255, 255, 1);
		border: solid 0.1vh rgba(255, 172, 41, 1);
		display: inline-block;
	}
	.rect-0 {
		position: absolute;
		left: -0.35vw;
		top: -0.35vw;
	}
	.rect-1 {
		position: absolute;
		left: -0.35vw;
		top: 12.6vw;
	}
	.rect-2 {
		position: absolute;
		left: -0.35vw;
		top: 24.85vw;
	}
	.rect-3 {
		position: absolute;
		left: 18.8vw;
		top: -0.35vw;
	}
	.rect-4 {
		position: absolute;
		left: 18.8vw;
		top: 24.85vw;
	}
	.rect-5 {
		position: absolute;
		right: -0.35vw;
		top: -0.35vw;
	}
	.rect-6 {
		position: absolute;
		right: -0.35vw;
		top: 12.6vw;
	}
	.rect-7 {
		position: absolute;
		right: -0.35vw;
		top: 24.85vw;
	}
}
</style>
