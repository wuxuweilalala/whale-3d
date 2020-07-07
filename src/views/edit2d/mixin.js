import {mapGetters, mapMutations, mapState} from 'vuex';
export default {
    data() {
        return {
            mouseX: 0,
            mouseY: 0,
            domOffsetLeft: 0,
            domOffsetTop: 0,
            dom: null, // 绑定元素
            domWidth: 0, // 绑定元素的宽度
            domHeight: 0, // 绑定元素的高度
            offsetX: 0, // 鼠标按下的位置到盒子左边的距离
            offsetY: 0, // 鼠标按下的位置到盒子上边的距离
            moveLeft: 0, // 移动鼠标到body的左边距离
            moveTop: 0, // 移动鼠标到body的上边距离
            thisDom: null,
            componentId: '',
        }
    },
    props: {
        item: {
            type: Object,
            default: () => {
                return {};
            }
        },
        index: Number,
    },
    methods: {
        ...mapMutations('edit', {
            setZIndex: 'setZIndex',
            setTrackPos: 'setTrackPos',
        }),
        // 设置 borderStyle
        setBorderStyle(width, height, left, top) {
            this.$parent.borderStyle = {
                width: width,
                height: height,
                top: top + 'px',
                left: left + 'px',
            }
        },
        // 设置父组件的值
        setParentValue(name, dom, spaceShow = true, numShow = true) {
            // 显示属性框
            this.$parent.posContent.none = false
            this.$parent.selectedIndex = this.index
            this.$parent.selectedId = this.componentId
            console.log('this.$parent.selectedId', this.$parent.selectedId, this.componentId, this.$parent.clickIndex, this.index)
            this.$parent.elementName = name
            this.$parent.selectedElement = dom
            this.$parent.numShow = numShow
            this.$parent.spaceShow = spaceShow
            this.$parent.setAllValue()
        },
        mouseup(event) {
            window.onmousemove = ''
            this.mouseX = 0
            this.mouseY = 0
            this.$parent.updated()
                // event.target.style.cursor = 'default';

            // this.setTrackPos({
            //     left: this.item.left - this.item.offset.x,
            //     top: this.item.top - this.item.offset.y,
            // })
            // this.log('mouse up ', this.dom.style.left, this.dom.style.top, {
            //         left: this.item.left - this.item.offset.x,
            //         top: this.item.top - this.item.offset.y,
            //     })
            // this.$parent.selectedElement = null
        },
        // 拖拽工作事件
        getParentTag(dom) {
            // 传入标签是否是DOM对象
            if (!(dom instanceof HTMLElement))
                return console.error("receive only HTMLElement");
            // 父级标签是否是body,是着停止返回集合,反之继续
            if (dom.offsetParent != null) {
                this.domOffsetTop += dom.offsetTop * 1;
                this.domOffsetLeft += dom.offsetLeft * 1;
                // 再上一层寻找
                return this.getParentTag(dom.offsetParent);
            }
        },
        moveClac(thisDom, width, height) {
            this.moveLeft = event.clientX;
            this.moveTop = event.clientY;
            // console.log('event.clientX', event.clientX, event.clientY)
            // 左边限制
            if (this.moveLeft - this.offsetX <= this.offsetParentLeft + this.$parent.ruleWidth) {
                this.moveLeft = this.offsetParentLeft + this.offsetX + this.$parent.ruleWidth;
            }
            if (this.moveLeft < 300) {
                window.onmousemove = ''
            }
            if (this.moveTop < 145) {
                window.onmousemove = ''
            }
            // 上边限制
            if (this.moveTop - this.offsetY <= this.offsetParentTop + this.$parent.ruleWidth) {
                this.moveTop = this.offsetParentTop + this.offsetY + this.$parent.ruleWidth;
            }
            // // 右边限制
            // if(this.offsetParentLeft+this.dom.offsetParent.offsetWidth <= this.moveLeft+(this.domWidth-this.offsetX)) {
            //     this.moveLeft = this.offsetParentLeft+this.dom.offsetParent.offsetWidth-(this.domWidth-this.offsetX)
            // }
            // // 下边限制
            // if(this.offsetParentTop+this.dom.offsetParent.offsetHeight <= this.moveTop+(this.domHeight-this.offsetY)) {
            //     this.moveTop = this.offsetParentTop+this.dom.offsetParent.offsetHeight-(this.domHeight-this.offsetY)
            // }
            // 设置left和top

            thisDom.style.left = this.moveLeft - this.offsetParentLeft - this.offsetX + "px";
            thisDom.style.top = this.moveTop - this.offsetParentTop - this.offsetY + "px";
            // this.setBorderStyle(width, height, this.moveLeft - this.offsetParentLeft - this.offsetX - 2, this.moveTop - this.offsetParentTop - this.offsetY)

        },
        borderBox(oDiv) {
            var aSpan = oDiv.getElementsByTagName("span");
            for (var i = 0; i < aSpan.length; i++) {
                dragFn(aSpan[i]);
            }

            function dragFn(obj) {
                obj.onmousedown = function(ev) {
                    var oEv = ev || event;
                    oEv.stopPropagation();
                    var oldWidth = oDiv.offsetWidth;
                    var oldHeight = oDiv.offsetHeight;
                    var oldX = oEv.clientX;
                    var oldY = oEv.clientY;
                    var oldLeft = oDiv.offsetLeft;
                    var oldTop = oDiv.offsetTop;

                    document.onmousemove = function(ev) {
                        var oEv = ev || event;
                        let disY = oldTop + (oEv.clientY - oldY),
                            disX = oldLeft + (oEv.clientX - oldLeft);
                        if (disX > oldLeft + oldWidth) {
                            disX = oldLeft + oldWidth;
                        }
                        if (disY > oldTop + oldHeight) {
                            disY = oldTop + oldHeight;
                        }
                        if (obj.className == "tl") {
                            oDiv.style.width = oldWidth - (oEv.clientX - oldX) + "px";
                            oDiv.style.height = oldHeight - (oEv.clientY - oldY) + "px";
                            oDiv.style.left = disX + "px";
                            oDiv.style.top = disY + "px";
                        } else if (obj.className == "bl") {
                            oDiv.style.width = oldWidth - (oEv.clientX - oldX) + "px";
                            oDiv.style.height = oldHeight + (oEv.clientY - oldY) + "px";
                            oDiv.style.left = disX + "px";
                            oDiv.style.bottom = oldTop + (oEv.clientY + oldY) + "px";
                        } else if (obj.className == "tr") {
                            oDiv.style.width = oldWidth + (oEv.clientX - oldX) + "px";
                            oDiv.style.height = oldHeight - (oEv.clientY - oldY) + "px";
                            oDiv.style.right = oldLeft - (oEv.clientX - oldX) + "px";
                            oDiv.style.top = disY + "px";
                        } else if (obj.className == "br") {
                            oDiv.style.width = oldWidth + (oEv.clientX - oldX) + "px";
                            oDiv.style.height = oldHeight + (oEv.clientY - oldY) + "px";
                            oDiv.style.right = oldLeft - (oEv.clientX - oldX) + "px";
                            oDiv.style.bottom = oldTop + (oEv.clientY + oldY) + "px";
                        } else if (obj.className == "t") {
                            oDiv.style.height = oldHeight - (oEv.clientY - oldY) + "px";
                            oDiv.style.top = disY + "px";
                        } else if (obj.className == "b") {
                            oDiv.style.height = oldHeight + (oEv.clientY - oldY) + "px";
                            oDiv.style.bottom = disY + "px";
                        } else if (obj.className == "l") {
                            oDiv.style.height = oldHeight + "px";
                            oDiv.style.width = oldWidth - (oEv.clientX - oldX) + "px";
                            oDiv.style.left = disX + "px";
                        } else if (obj.className == "r") {
                            oDiv.style.height = oldHeight + "px";
                            oDiv.style.width = oldWidth + (oEv.clientX - oldX) + "px";
                            oDiv.style.right = disX + "px";
                        }
                    };

                    obj.onmouseup = function() {
                        document.onmousemove = null;
                    };
                    return false;
                };
            }
        }
    },
    created() {
        this.componentId = this.item.id
        // console.log('item mmmmmmmm', this.item.id)
        // console.log('Model名称为: item', this.generateModelName)
        // console.log('（（（（（（（（', this.item)
    },
    mounted() {

    },
    computed: {
        ...mapState('edit', {
            modelOptions: 'modelOptions',
        }),
        ...mapGetters('edit', {
            getZIndex: 'getZIndex',
            getModelOption: 'getModelOption',

        }),
        // zIndex() {
        //     return this.getZIndex
        // },
        left() {
            return this.item.left
        },
        top() {
            // return this.item.top - this.item.offset.y
            // 在index。vue处理， 解决删除布局错了bug
            return this.item.top
        },
        bgImg() {
            return this.item.bgImg
        },
        generateModelName() {
            return this.item.generateModelName
        },
        offsetParentLeft() {
            return this.item.offsetParentLeft
        },
        offsetParentTop() {
            return this.item.offsetParentTop
        }
    }
};
