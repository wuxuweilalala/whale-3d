<template>
	<div class="track-list borderBox"
	ref="tracks"
	@mousedown.stop="mousedown"
	@mouseup.stop="mouseup"
	:style="{ left: left + 'px', top: top + 'px', width: trackWidth, border: border,}"
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
			trackName: '轨道数量',
			trackWidth: '53px',
			background: 'cover',
			show: true,
			height: '480px',
			border: '',
			widthStyle: '',
		};
	},
	created() {
        if(!this.item.isDeleted) {
			this.widthStyle = Number(this.trackWidth.replace('px', '')) + 4 + 'px'
			this.$nextTick(() => {
				this.setBorderStyle(this.widthStyle, this.height, this.item.left - 2, this.item.top - 2)
			})
			let len = this.$parent.floorList[0].componentList[0].itemList.length - 1
			// if(this.index === len) {
			// 	this.findIsSelected()
			// }
			this.$parent.key = this.$parent.uuid()

			this.setTracksPosition();

			this.zIndex = this.getZIndex - 1;
			// this.border = this.item.border;
			// 获取轨道的 left top
			this.border = this.item.border
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
                let width = this.item.trackWidth.replace('vw', '')
                this.background = '100% 100%'

                // if(width / 2.8 > 4) {
                //     this.background = '100% 100%'
                // } else {
                //     this.background = 'cover'
                // }
            }
            this.setTracksPosition(this.trackRows, this.trackWidth)
        },
		mousedown(event) {
			this.mouseX = event.clientX;
			this.mouseY = event.clientY;
            console.log('event', event.clientX, event.clientY, )
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
			this.$parent.posNum = parseInt(Number(this.trackWidth.replace('px', '')) / 53)
			this.$parent.posLeft = this.left
			this.$parent.posTop = this.top
			this.$parent.posSpace = this.space
			this.$parent.border = '0.05vw solid rgba(255, 172, 41, 1)';

			this.dom.style.zIndex = this.getZIndex - 1;
			this.setZIndex(this.getZIndex - 1);
			this.domWidth = this.dom.offsetWidth;
			this.domHeight = this.dom.offsetHeight;
			event.target.style.cursor = 'move';

			// 鼠标按下位置 -> 定位盒子的距离
			// this.offsetX = event.offsetX
			// this.offsetY = event.offsetY

			this.getParentTag(this.dom);
			this.offsetX = event.clientX - this.domOffsetLeft;
			this.offsetY = event.clientY - this.domOffsetTop;
			this.widthStyle = Number(this.trackWidth.replace('px', '')) + 4 + 'px'
            this.heightStyle = Number(this.height.replace('px', '')) + 'px'

            this.$parent.key = this.$parent.uuid()
			this.setBorderStyle(this.widthStyle, this.heightStyle, this.item.left - 2, this.item.top - 2)
			this.setIsSelected(this.item.id)
			localStorage.setItem('floorList', JSON.stringify(this.$parent.floorList))
			window.onmousemove = event => {
				this.moveClac(event, this.dom, this.widthStyle, this.heightStyle);
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
					if (val[this.index].num > 3) {
						this.background = '100% 100%'
					}
					this.trackRows = val[this.index].trackNum;
					this.trackWidth = val[this.index].trackWidth;
					this.border = val[this.index].border
					this.setBorderStyle(this.trackWidth, this.height, this.left, this.top)
				}
            }
        }

    },
};
</script>

<style lang="scss" scoped>
.track-list {
	width: 53px;
	/*height: 46.4vh;*/
	z-index: 1;
	height: 480px;
	pointer-events: auto;
	/*padding: 10px;*/
	position: absolute;
	/*border: 0.1vh solid rgba(255, 172, 41, 1);*/

    .toolGD {
		width: 53px;
		height: 19px;
		position: absolute;

		.toolGDFragment {
			display: flex;

			.toolGDChild {
				/*width: calc(2.5vw / 12);*/
				height: 19px;
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
}
</style>
