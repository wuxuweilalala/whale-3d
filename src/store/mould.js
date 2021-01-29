import GLTFLoader from 'three-gltf-loader';
import FBXLoader from 'three-fbxloader-offical';
import Vue from 'vue';
import * as THREE from 'three';

export default {
	namespaced: true,
	state: {
		stationOptions: [],
		mould: {
			psb: null,
			shelvestrack: null,
			shelves: null, // 货架
			platform: null,
			sowwall: null,
			box: null,
			robot: null,
			car: null,
			pst:null,
			pstTrack:null,
		},
		initState: 0,
		pstTrackOptions:[]
	},
	getters: {
		getStationOptions: (state, getters, rootState,rootGetter) => {
			// let currentProjectData=Vue.prototype._get(rootGetter,"index/getCurrentProjectData['projectDetail']")
			let currentProjectData=rootGetter['index/getCurrentProjectData']&&rootGetter['index/getCurrentProjectData']['projectDetail']
			if(!currentProjectData)return false
			let useArea = parseInt(currentProjectData.areaInfo[1].value.width) * 1000 * 0.05
			let list = currentProjectData.sceneOption;
			let floorNum=list.length
			let num = 0;
			state.stationOptions=[]
			for (let j = 0; j < floorNum; j++) {
                for (let i = 0; i < Number(list[j].stationNum); i++) {
                    let site = creatCoordinate(useArea, i, 0, 0);
                    let station = {  //默认配置-
                        name: `workStation${j}-${i}`,//工作站名称
                        stationSite: {x: site.vertical , y:j*185, z: site.horizontal},//工作站位置
                        shelvesNum:Number(list[j].shelvesUnitNum),
                        stationNum: Number(list[j].stationNum),
                        // currentProjectData.machineInfo[1].value,  //货架数量
                        sku: 294, //库存
                        psbNum: 6  //psb数量
                    };
                    state.stationOptions.push(station);
                }
                // pst轨道位置配置
				let stations=state.stationOptions
				state.pstTrackOptions.push({
					name:stations[num].name.split('-')[0],
					start:stations[num].stationSite,  // j层第一个货架坐标
					end:stations.slice(-1)[0].stationSite  //j层最后一个的坐标
				})
				num+=Number(list[j].stationNum) //每一层的PST轨道最小值位置
				}
			return state.stationOptions;
		},
		getMould: state => {
			return state.mould;
		},
		getInitState: state => {
			return state.initState;
		},
		getPstTrack:state=>state.pstTrackOptions
	},
	mutations: {

	},
	actions: {
		loaderMould({state}) {
			const loader = new GLTFLoader();
			const fbxLoader = new FBXLoader();
			//货架
			loader.load(process.env.BASE_URL + 'mould/shelves.gltf', (obj) => {
                obj.scene.traverse((obj) => {
                    if(obj.isMesh) {
						// let texture = new THREE.TextureLoader().load(process.env.BASE_URL + 'mould/maps/gray.png');
						var material = new THREE.MeshBasicMaterial({
							color: 0x1c1e1d,
							transparent: true,
							opacity: 0.5,
							// map: texture,
						});
						// material.color.setRGB(1, 1, 1);
						obj.material = material
					}
                })
				state.mould.shelves = obj.scene;
				state.initState++;
			});
			//psb
			loader.load(process.env.BASE_URL + 'mould/machine_out/machine.gltf', (up) => {
				up.scene.traverse((obj) => {
					if(obj.isMesh) {
						let texture = new THREE.TextureLoader().load(process.env.BASE_URL + 'mould/maps/gray.jpg');
						let material = new THREE.MeshStandardMaterial({
							color: 0xff7f29,
							// transparent: true,
							// opacity: 1,
							specular: 0xc25858,
							// map: texture,
						});
						obj.material = material
						// obj.material.color.set(0xc25858);
					}
				})
				state.mould.psb = up.scene;
				state.initState++;
			});
			//货车
			loader.load(process.env.BASE_URL + 'mould/car111.gltf', (gltf) => {
				state.mould.car = gltf.scene;
				state.initState++;
			});

			//轨道
			loader.load(process.env.BASE_URL + 'mould/shelvestrack.gltf', (gltf) => {
				state.mould.shelvestrack = gltf.scene;
				state.initState++;
			});
			//货箱
			loader.load(process.env.BASE_URL + 'mould/box.gltf', (obj) => {
                obj.scene.children[4].traverse((obj) => {
                    if(obj.isMesh) {
						let texture = new THREE.TextureLoader().load(process.env.BASE_URL + 'mould/maps/box3.jpg');
						var material = new THREE.MeshLambertMaterial({
							map: texture,
						});
						obj.material = material
					}
                })
				state.mould.box = obj.scene.children[4];
				state.initState++;
			});
			//播种板
			loader.load(process.env.BASE_URL + 'mould/platform1.gltf', (obj) => {
				obj.scene.children[0].geometry.center();
				obj.scene.traverse((obj) => {
					if (obj.isMesh) {
						var material = new THREE.MeshPhongMaterial({
							color: 0x1c1e1d,
							transparent: true,
							opacity: 1,
							// map: texture,
						});
						obj.material = material
					}
				})
				state.mould.platform = obj.scene;
				state.initState++;
			});
			//播种墙
			loader.load(process.env.BASE_URL + 'mould/sowwall.gltf', (obj) => {
				let self = this;
				obj.scene.traverse((obj) => {
					if (obj.isMesh) {
						// let texture = new THREE.TextureLoader().load(process.env.BASE_URL + 'mould/maps/station.jpg');
						// texture.wrapS = texture.wrapT = self.$THREE.RepeatWrapping;
						var material = new THREE.MeshPhongMaterial({
							color: 0x1c1e1d,
							transparent: true,
							opacity: 0.7,
							// map: texture,
						});
						obj.material = material
					}
				})
				state.mould.sowwall = obj.scene;
				state.initState++;
			});
			// pst
			loader.load(process.env.BASE_URL + 'mould/pst.glb', (obj) => {
				obj.scene.traverse((obj) => {
					if (obj.isMesh) {
						var material = new THREE.MeshPhongMaterial({
							color: '#ff6941',
							transparent: true,
						});
						obj.material = material
					}
				})
				state.mould.pst = obj.scene;
				state.initState++;
			});
			// pst轨道
			loader.load(process.env.BASE_URL + 'mould/pstTrack3.glb', (obj) => {
				obj.scene.traverse((obj) => {
					if (obj.isMesh) {
						var material = new THREE.MeshStandardMaterial({
							color: 0x673a10,
							transparent: true,
							opacity: 0.8,
						});
						obj.material = material
					}
				})
				state.mould.pstTrack = obj.scene;
				state.initState++;
			});
		},
	},
	modules: {}
};

//计算工作站个数
function addStation(area, num) {
	// let area3d = area * 1000;
	let shelvesWidth = 263.9136; //货架宽度
	let shelvesLength = 27.1469; //单个货架长度
	let shelvesPadding = 18.75; //货架间距
	let wall = 58.9275;//播种墙间距和长度
	let manrider=100; //人车位置
	let verticalLength = (num - 1) * shelvesPadding + num * shelvesLength + wall;
	let horizontalNumber = parseInt(area / shelvesWidth);
	let verticalNumber = parseInt(area / (verticalLength+manrider));
	return {
		horizontalNumber,
		verticalNumber,
		verticalLength
	};
}

//遍历工作站位置
function creatCoordinate(area, i, j, verticalLength) {
	/*
	i为水平循环
	*j为垂直往后循环
	* */
	let wall = 58.9275;//播种墙间距和长度
	let horizontalPadding=20;
	let verticalPadding=100;
	let horizontal = area / 2 - (263.9136 * i)-horizontalPadding*i; //向右生成遍历
	let vertical = area / 2 - (verticalLength * j)-wall-verticalPadding*(j+1); //向后生成  Y轴原点为第一个货架 往后移一个播种墙单位
	return {
		horizontal,
		vertical
	};
}
