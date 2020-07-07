<template>
	<div class="track-list borderBox"
	ref="tracks"
	@mousedown.stop="mousedown"
	@mouseup.stop="mouseup"
	:style="{ left: left + 'px', top: top + 'px', width: trackWidth, border: border,
	}"
	:data-name="generateModelName"
	:data-id="componentId"
	:data-index="index"
	:data-deleted="!show"
	v-if="show">
		<div class="toolGD"
		ref="toolBGD"
		:style="{ left: '0px', top: item.top, background: `url(${bgImg})`, width: trackWidth, zIndex: zIndex, backgroundSize: background, }"
		v-for="(item, index) in tracks"
		:key="index">
			<div v-if="true"
			class="toolGDFragment">
				<div class="toolGDChild"
				ref="trackRow"
				v-for="(item, index) in trackRows"
				:key="index"></div>
			</div>
		</div>
		<!--      <span class='rect' :class="getClassName(index)" v-for="(item, index) in rects" :key="getClassName(index)" ></span>-->
	</div>
</template>

<script>
import mixin from '../mixin.js';
import { mapGetters, mapMutations, mapState } from 'vuex';
export default {
	mixins: [mixin],
	data() {
		return {
			tracks: [],
			trackRows: 10, // 一个轨道多少个
			trackColumns: 12, // 轨道数量
			space: 60, // 轨道间距
			zIndex: 9999,
			rects: ['rect1', 'rect2', 'rect3', 'rect4', 'rect5', 'rect6', 'rect7', 'rect8'], // 小方块数组
			trackName: '轨道数量',
			trackWidth: '2.8vw',
			background: 'cover',
			show: true,
			height: '46.5vh',
			border: '',
		};
	},
	created() {
        if(!this.item.isDeleted) {
			this.setTracksPosition();
			this.zIndex = this.getZIndex + 1;
			// this.border = this.item.border;
			// 获取轨道的 left top
			this.setTrackPos({
				left: this.item.left - this.item.offset.x,
				top: this.item.top - this.item.offset.y,
			})
			this.initModel()
		} else {
            this.show = !this.item.isDeleted
        }
	},
	computed: {
		...mapGetters('edit', {
			getTrackWidth: 'getTrackWidth',
            getModelOption: 'getModelOption',
		}),
        ...mapState('edit', {
            modelOptions: 'modelOptions',
        }),
	},
	methods: {
		...mapMutations('edit', {
			setPosition: 'setPosition',
			setTrackWidth: 'setTrackWidth',
			setTrackPos: 'setTrackPos',
		}),
        initModel() {
            if(this.item.trackNum !== undefined) {
                this.trackRows = this.item.trackNum
            }
            if(this.item.trackWidth !== undefined) {
                this.trackWidth = this.item.trackWidth
                console.log('this.item.trackWidth', this.item.trackWidth)
                let width = this.item.trackWidth.replace('vw', '')
                if(width / 2.8 > 4) {
                    this.background = '100% 100%'
                } else {
                    this.background = 'cover'
                }
            }
            this.setTracksPosition(this.trackRows, this.trackWidth)
        },
		mousedown(event) {
			this.mouseX = event.clientX;
			this.mouseY = event.clientY;
			this.domOffsetLeft = 0;
			this.domOffsetTop = 0;
			//
			this.dom = this.$refs.tracks;
			// 显示属性框
            this.setParentValue(this.trackName, this.dom, false)
            this.$parent.showBorder(this.index)
            let height = this.$vhToPx(this.height.replace('vh', ''))
            // this.setBorderStyle(this.$vwToPx(this.trackWidth.replace('vw', '')) + 2, height, this.left - 2, this.top)
            // this.$parent.borderStyle = {
            // 	width: this.trackWidth,
            // 	height: this.height,
            // 	top: this.top + 'px',
            // 	left: this.left - 2 + 'px',
            // }
            this.$parent.posNum = parseInt(Number(this.trackWidth.replace('vw', '')) / 2.8)
            this.$parent.posLeft = this.left
            this.$parent.posTop = this.top
            this.$parent.posSpace = this.space
            // this.border = ''
            // this.border = '0.05vw solid rgba(230, 162, 64, 1)'
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
			this.tracks = []
            this.setPosition(result);
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
				top: this.item.top,
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
                    if(val[this.index].num > 3) {
                        this.background = '100% 100%'
                    }
                    this.trackRows = val[this.index].trackNum;
                    this.trackWidth = val[this.index].trackWidth;
                }
            }
        }

    },
};
</script>

<style lang="scss" scoped>
.track-list {
	width: 2.84vw;
	/*height: 46.4vh;*/
	z-index: 1;
	/*height: 25.2vw;*/
	/*padding: 10px;*/
	position: absolute;
	/*border: 0.1vh solid rgba(255, 172, 41, 1);*/
	.toolGD {
		width: 2.8vw;
		height: 2.1vh;
		position: absolute;

		.toolGDFragment {
			display: flex;

			.toolGDChild {
				/*width: calc(2.5vw / 12);*/
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
