export default {
	namespaced: true,
	state: {
		screenWidth: window.innerWidth,
		screenHeight: window.innerHeight,
		fileUploadList: [],
		isFileClear: false,
		fileClearTimer: [],
		resizeTimer: null
	},
	getters: {
		vw: (state) => state.screenWidth / 100,
		vh: (state) => state.screenHeight / 100,
		getScreenWidth: (state) => state.screenWidth,
		getScreenHeight: (state) => state.screenHeight,
		getVw: (state) => (n) => state.screenWidth / 1920 * n,
		getVh: (state) => (n) => state.screenHeight / 969 * n,
		vwToPx: (state, getters) => (n) => getters.vw * n,
		vhToPx: (state, getters) => (n) => getters.vh * n,
	},
	mutations: {
		setScreenWidth(state, width) {
			state.screenWidth = width;
		},
		setScreenHeight(state, height) {
			state.screenHeight = height;
		},},
	actions: {
		resizeASync: ({ state, commit }, params) => {
			if (state.resizeTimer) clearTimeout(state.resizeTimer);
			state.resizeTimer = setTimeout(() => {
				commit('setScreenWidth', params.width);
				commit('setScreenHeight', params.height);
			}, 500);
		}
	}
};
