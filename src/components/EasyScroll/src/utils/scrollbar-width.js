import Vue from 'vue';
/*
* 用于判断当前浏览器的滚动条默认宽度，决定wrap的位置
* */
let scrollBarWidth;

export default function() {
	if (Vue.prototype.$isServer) return 0;
	if (scrollBarWidth !== undefined) return scrollBarWidth;

	const outer = document.createElement('div');
	outer.style.overflow = 'scroll';
	outer.style.visibility = 'hidden';
	outer.style.width = '100px';
	outer.style.position = 'absolute';
	outer.style.top = '-9999px';
	document.body.appendChild(outer);

	const widthNoScroll = outer.offsetWidth;

	const inner = document.createElement('div');
	inner.style.width = '100%';
	outer.appendChild(inner);

	const widthWithScroll = inner.offsetWidth;
	scrollBarWidth = widthNoScroll - widthWithScroll;
	outer.parentNode.removeChild(outer);
	return scrollBarWidth;
}
