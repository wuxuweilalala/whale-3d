<script>
    import GLTFLoader from 'three-gltf-loader';
    import {mapGetters} from 'vuex';
    import * as THREE from "three";

    let TWEEN = require('tween.js');
    export default {
        render() {
            return '';
        },
        name: 'station',
        props: {
            options: {
                type: Object,
                required: true
            },
            box: {
                type: Array,
                required: true
            },
            animateData: {},
            pickFinish: {},
            index: Number,

        },
        computed: {
            ...mapGetters('mould', {
                getMould: 'getMould',
                initState: 'getInitState',
            }),
            ...mapGetters('index', {
                speedTimes: 'getSpeedTimes',
                playState: 'getplayState',
                progressTime: 'getProgressTime',//运动总时长
                getHasSku: 'getHasSku',
            }),

        },
        data() {
            return {
                mesh: null,
                station: null, //工作区
                mixer: '',//动画
                shelves: null,//货架最大小值区间
                wallgroup: null,//播种墙板
                robotTeam: null,//货车与机器人组
                psbRobot: null,//抓箱机器人组
                PSBaction: [], //机器人动画
                seedBoard: null,//播种板值
                tweenGroup: null,//动画组
                waitData: [],
                nowRun: [], //正在运动
                stopList: [],//停止运动
                runPoint: [],//停止运动位置标识
                obstructBox: [],//障碍箱
                psbTimer: {},//存放psb定时器
            };
        },

        methods: {

            initStation() {
                this.station = new this.$THREE.Object3D();//一个工作区
                this.station.name = this.options.name;
                this.station.position = this.options.stationSite;
                this.wallgroup = new this.$THREE.Group();//播种墙、播种板
                this.robotTeam = new this.$THREE.Group();//货车与机器人组
                this.psbRobot = new this.$THREE.Group();
                this.station.add(this.wallgroup);
                this.station.add(this.robotTeam);
                this.station.add(this.psbRobot);
                this.$parent.scene.add(this.station);

            },
            // 加载模型
            loadShelves(shelvesPadding = 18.75) {
                let self = this;
                const loader = new GLTFLoader();
                let length = self.options.shelvesNum;
                let obj = this.getMould.shelves;
                let psb = this.getMould.psb;
                let geometry = new self.$THREE.BufferGeometry();
                let positions = new Float32Array(2 * 3);
                geometry.setDrawRange(0, 2);
                geometry.addAttribute('position', new self.$THREE.BufferAttribute(positions, 3));
                //加载货架
                self.shelves = new self.$THREE.Box3();
                obj.scale.set(0.05, 0.05, 0.05);
                self.shelves.expandByObject(obj);
                let shelves_width = self.shelves.max.x - self.shelves.min.x;
                let x_space = 0;
                for (let i = 0; i < length + 1; i++) {
                    let gltf = obj.clone();
                    gltf.name = `shelves${this.index}-${i}`;
                    gltf.position.x = x_space - shelves_width * i;
                    // gltf.children[0].traverse((obj) => {
                    //     if (obj.isMesh) {
                    //         // this.$parent.clickRobots.push(obj)
                    //     }
                    // });
                    let children = gltf.children;
                    // console.log('children', children)
                    // for (let j = 0; j < children.length; j++) {
                    //     self.$parent.clickRobots.push(children[i])
                    // }
                    // console.log('self.$parent.clickRobots *****', self.$parent.clickRobots)
                    self.station.add(gltf);
                    x_space -= shelvesPadding;  //货架之间的默认间距为375mm*0.05=18.75
                    self.shelves.expandByObject(gltf);

                }

                self.initModules(); //获取货架宽度后加载其他模型
                //加载货架中机器人
                /*
                * */
                // loader.load(process.env.BASE_URL +'mould/psb/psb.gltf', (up) => {
                let site = new self.$THREE.Box3();
                psb.scale.set(0.05, 0.05, 0.05);
                site.expandByObject(psb);
                let psbWidth = site.max.z - site.min.z;
                let initZSpace = (self.shelves.max.z - self.shelves.min.z - 20 - psbWidth * 6) / 7;
                let padding = (31.96 - psbWidth) / 2; //轨道宽度31.96求机器人边距
                let addZSpace = 0;
                for (let i = 0; i < 6; i++) {
                    let robot = psb.clone();
                    let group = new self.$THREE.Group();
                    // robot.scale.set(0.05, 0.05, 0.05);
                    robot.name = `PSB${i}`;
                    robot.state = true;
                    robot.position.z = -(psbWidth * i + addZSpace);
                    addZSpace += initZSpace;
                    addZSpace += padding;
                    // self.$parent.clickRobots = robot.children[0].children[0].children
                    self.psbRobot.add(robot);
                    // self.$parent.clickRobots.push(robot.children[1]);
                    robot.children[0].children[0].parent = robot;
                    group.parent = robot;
                    group.name = `claw${i}`;
                    let low = robot.children[0].children[1];
                    group.add(low);
                    let child = [robot.children[0].children[0], group]; //重新定义子集
                    // robot.children[0].children[1]=group//赋值
                    robot.children = child;
                    //创建连接线
                    let psbSite = robot.children[0].position;

                    let material = new self.$THREE.LineBasicMaterial({
                        color: 0xff7f29,
                    });
                    let lineArray = [
                        [psbSite.x - 200, psbSite.y, psbSite.z + 200],
                        [psbSite.x - 200, psbSite.y, psbSite.z - 200],
                        [psbSite.x + 200, psbSite.y, psbSite.z + 200],
                        [psbSite.x + 200, psbSite.y, psbSite.z - 200],
                    ];//链接线的位置
                    for (let j in lineArray) {
                        let points = [];
                        // let linesCopy = lineMesh.clone();
                        points.push(new self.$THREE.Vector3(lineArray[j][0], lineArray[j][1], lineArray[j][2]));
                        points.push(new self.$THREE.Vector3(lineArray[j][0], lineArray[j][1], lineArray[j][2]));
                        let lines = geometry.clone().setFromPoints(points);
                        let lineMesh = new self.$THREE.Line(lines, material);
                        robot.add(lineMesh);
                    }
                    self.psbRobot.position.x -= 0.5;
                    let cs = robot.children[1].children[0].children
                    self.$parent.clickRobots.push(cs[16])
                }

                self.$parent.addRobot();
            },
            //添加货箱
            addBox() {
                let self = this;
                let box = self.getMould.box;
                // 加载货箱
                /*
                高度: 150mm*0.05=7.5
                宽度: 639mm*0.05=31.95
                长度: 5370mm*0.05=268.5
                 * */
                box.scale.set(0.05, 0.05, 0.05);
                let trackBox = new self.$THREE.Box3();
                trackBox.expandByObject(box);
                // console.log('box size',trackBox.max.z-trackBox.min.z,trackBox.max.x-trackBox.min.x,trackBox.max.y-trackBox.min.y);
                /*
                    X:380.82mm*0.05   19
                    Y:634.701mm   31.7
                    Z:380.821mm  19
                    间距 150mm    7.5
                    * */
                // let x = this.options.shelvesNum, y = 7, z = 6;
                /*
                    x_space:9.5+4 货箱宽度的一半+padding --X方向间距
                    z_space:每行货箱的间距为150mm*0.05=7.5
                    * */
                let x_space = 13.5, z_space = 7.5;

                // shelves_site.max.z -= 10;//z方向减去货架自身宽度
                let list = this.box;

                for (let i in list) {
                    if (self.station.children.find(ele => ele.name == list[i][3])) continue;
                    let gltf = box.clone();
                    gltf.material = box.material.clone();
                    gltf.material.transparent = true;//是否透明
                    gltf.geometry.center();//模型中心点居中
                    // console.log('gltf, gltf.geometry', gltf, gltf.geometry)
                    // gltf.material.opacity = 0.7;
                    gltf.material.transparent = true;//是否透明
                    gltf.siteZ = list[i][2];
                    gltf.name = list[i][3]; //行列层
                    let site = self.addCargos(list[i], x_space, z_space, self.shelves);
                    gltf.position.set(site[0], site[1], site[2]);
                    self.station.add(gltf);
                }
            },
            addCargos(site, x_space, z_space, shelves_site) {
                let x, y, z;
                if (site[0] == 2) {
                    // debugger
                    let length = this.options.shelvesNum;
                    let shevlesFirstBox = this.getBox(`shelves0-${length}`)
                    this.$parent.shelvesHeight = shevlesFirstBox.max.y - shevlesFirstBox.min.y
                    let stationFirstBox = this.getBox('wallGroup0-0')
                    x = shevlesFirstBox.max.x - stationFirstBox.max.x + 19.041 + 26.8559
                } else {
                    x = shelves_site.max.x - (19.041 + 26.8559) * (site[0] - 27) - x_space;  //19.0419为货箱的宽度  26.8559:货架间距18.75+padding 8.1059
                }
                y = 15 + 19 * site[1] - 1;
                z = shelves_site.max.z - 10 - 31.7 * (site[2] - 1) - z_space * site[2] - 31.7 / 2;   //31.7为货箱Z方向的长度
                // z = shelves_site.max.z
                return [x, y, z];
            },
            //初始化加载模型
            initModules() {
                //机器人轨道
                const loader = new GLTFLoader();
                let self = this;
                let shelves_site = self.shelves;
                let shelvestrack = self.getMould.shelvestrack;
                // let car = this.getMould.car.clone();
                let platform = self.getMould.platform;
                let sowwall = self.getMould.sowwall;
                let length = parseInt(this.options.shelvesNum);
                for (let i in shelvestrack.children) {
                    shelvestrack.children[i].material.transparent = true;//是否透明
                    shelvestrack.children[i].material.opacity = 0.5;
                }
                let trackBox = new self.$THREE.Box3();
                trackBox.expandByObject(shelvestrack);
                let trackLength = (trackBox.max.x - trackBox.min.x) * 0.05;
                let trackWidth = (trackBox.max.z - trackBox.min.z) * 0.05;
                let shelvesWidth = shelves_site.max.z - shelves_site.min.z;
                let initZSpace = (shelvesWidth - 20 - trackWidth * 6) / 7; //20位货架两边大小
                let addinitZSpace = 0;

                //播种板
                //播种墙
                for (let i in sowwall.children) {
                    // sowwall.children[i].material.transparent = true;//是否透明
                    // sowwall.children[i].material.opacity = 0.5;
                }
                self.wallgroup.name = 'allWallGroup';
                let x = 0;
                let stationLength = 4
                for (let j = 0; j < stationLength; j++) {
                    var wallgroup = new this.$THREE.Group();//播种墙、播种板
                    self.wallgroup.add(wallgroup);
                    wallgroup.name = `wallGroup${this.index}-${j}`;
                    let platwall = sowwall.clone();
                    platwall.scale.set(0.05, 0.05, 0.05);
                    let wall = new self.$THREE.Box3();
                    wall.expandByObject(platwall);
                    let sowwallWidth = wall.max.x - wall.min.x;
                    let sowwallSpace = 32.7;//站台间距
                    platwall.name = 'sowWall';
                    wallgroup.add(platwall); //把站台架加入组中
                    // wallgroup.position.x = (sowwallWidth + 32.7) * j;
                    for (let i in platform.children) {
                        // platform.children[i].material.transparent = true;//是否透明
                        // platform.children[i].material.opacity = 0.5;
                    }
                    let plat_group = new self.$THREE.Group();//播种板
                    plat_group.name = 'boardteam';
                    platform.scale.set(0.05, 0.05, 0.05);
                    let seedBoard = new self.$THREE.Box3();
                    seedBoard.expandByObject(platform);
                    let width = seedBoard.max.x - seedBoard.min.x;//单个播种板的宽度
                    let wallWidth = (shelves_site.max.z - shelves_site.min.z - 20 - width * 6) / 7; //播种板间距
                    let platformz_space = width / 2 + wallWidth;
                    for (let i = 0; i < 6; i++) {
                        let platCopy = platform.clone();
                        plat_group.add(platCopy);
                        platCopy.name = `board${i}`;
                        // let a=new self.$THREE.AxesHelper(8000);
                        // platCopy.add(a)
                        platCopy.position.x = wall.max.x - width / 2;  //播种板X位置等于播种墙位置-播种板宽度一半
                        platCopy.position.y = 67;
                        platCopy.position.z = shelves_site.max.z - 10 - width * i - platformz_space;
                        platformz_space += wallWidth;
                        self.seedBoard = new self.$THREE.Box3();
                        self.seedBoard.expandByObject(platCopy); //存储站台板的位置
                    }
                    wallgroup.add(plat_group); //播种板、播种墙同一组
                    wallgroup.position.x = x;
                    if (j % 2 == 1) {
                        x = x + 50
                    } else {
                        x = x + 200
                    }
                }
                let len = self.options.shelvesNum;
                let scenes = self.$parent.scene
                // 获取 wallGroup3 最后一个shelves 第一个shelves
                let shelvesPosition = scenes.getObjectByName(`shelves${this.index}-${len}`)
                let wallPosition = scenes.getObjectByName(`wallGroup0-3`)
                let wallBox = new self.$THREE.Box3();
                wallBox.expandByObject(wallPosition);
                let shelvesBox = new self.$THREE.Box3();
                shelvesBox.expandByObject(shelvesPosition);
                let shelvesOneWidth = shelvesBox.max.x - shelvesBox.min.x + 18.75
                shelvesPosition.position.x = wallBox.max.x + shelvesOneWidth
                loader.load(process.env.BASE_URL + 'mould/cargd.gltf', (obj) => {
                    let gltf = obj.scene;
                    gltf.traverse((obj) => {
                        if (obj.isMesh) {
                            let texture = new THREE.TextureLoader().load(process.env.BASE_URL + 'mould/maps/gray.jpg');
                            var material = new THREE.MeshStandardMaterial({
                                color: 0x673a10,
                                transparent: true,
                                opacity: 0.8,
                                // specular: 0xc25858,
                                // map: texture,
                            });
                            obj.material = material
                            // obj.material.color.set(0xc25858);
                        }
                    })
                    let WalltrackBox = new self.$THREE.Box3();
                    WalltrackBox.expandByObject(gltf);
                    let trackGroup = new self.$THREE.Group();
                    let trackBox = new self.$THREE.Box3();
                    trackBox.expandByObject(gltf);
                    let trackWidth = (trackBox.max.z - trackBox.min.z) * 0.05;
                    let trackHeight = trackBox.max.y - trackBox.min.y
                    gltf.rotateY(Math.PI)
                    for (let j = 0; j < 6; j++) {
                        let sowwallSpace = 0;

                        let walltrack = gltf.clone();

                        for (let i in walltrack.children) {
                            // walltrack.children[i].material.transparent = true;//是否透明
                            // walltrack.children[i].material.opacity = 0.5;
                        }
                        // 获取 场景 scene
                        let scenes = self.$parent.scene
                        // 获取 wallGroup3 最后一个shelves 第一个shelves
                        let wallPosition = scenes.getObjectByName(`wallGroup0-3`)
                        let shelvesPosition = scenes.getObjectByName('shelves0-' + (self.options.shelvesNum - 1))
                        let shelvesFirst = scenes.getObjectByName('shelves0-0')
                        // 获取 wallGroup3 最后一个shelves 第一个shelves 的盒子大小
                        let wallBox = new self.$THREE.Box3();
                        wallBox.expandByObject(wallPosition);
                        let shelvewBox = new self.$THREE.Box3();
                        shelvewBox.expandByObject(shelvesPosition);
                        let shelvesFirstBox = new self.$THREE.Box3();
                        shelvesFirstBox.expandByObject(shelvesFirst);
                        //  获取 播种墙到货架的长度（x的值）
                        let width = wallBox.max.x - shelvewBox.min.x + shelvesOneWidth
                        // 获取 轨道的长度（x的值）
                        let boxWidth = WalltrackBox.max.x - WalltrackBox.min.x
                        var axesHelper = new self.$THREE.AxesHelper(1500);
                        walltrack.scale.set(width / boxWidth, 0.05, 0.05);

                        trackGroup.position.x = wallBox.max.x - shelvesFirstBox.max.x + shelvesOneWidth;
                        walltrack.position.z = -(trackWidth * j + addinitZSpace);
                        trackGroup.position.z = -3.5 * j;
                        trackGroup.position.y = wallBox.max.y - 10
                        trackGroup.add(walltrack);
                        self.station.add(trackGroup);
                        addinitZSpace += initZSpace;
                    }
                });
            },
            // 初始化
            init() {
                let self = this;
                self.initStation();
                self.loadShelves();
                self.addLines(20);
                this.$parent.addWall = true;
                self.animate();
            },
            // 窗口变动触发的方法
            onWindowResize() {
                let self = this;
                self.camera.aspect = window.innerWidth / window.innerHeight;
                self.camera.updateProjectionMatrix();
                self.renderer.setSize(window.innerWidth, window.innerHeight);
            },
            // psbAnimateX(group, params, duration){
            // 	var position_x = [params[0], 0, 0, params[1], 0, 0];
            // 	var pos1_Keyframe = new this.$THREE .KeyframeTrack('group.position', [0,duration], position_x);
            // 	var clip = new this.$THREE.AnimationClip('boxAnimation', duration, [
            // 		pos1_Keyframe,
            // 	]);
            // 	this.mixer = new this.$THREE.AnimationMixer(group);
            // 	var action = this.mixer.clipAction(clip);
            // 	return action
            // },
            // 抓箱机器人动画(X方向)
            psbAnimateX(group, params, duration) {
                let rota = ({
                    x: params[0]
                });
                let xMotion = new TWEEN.Tween(rota);
                xMotion.to({
                    // x:!params[1] ? 0 : params[0] + params[1]
                    x: params[1]
                }, duration, TWEEN.Easing.Sinusoidal.InOut);
                xMotion.onUpdate(function () {
                    group.position.x = this.x;
                });
                return xMotion;
            },
            // 抓箱机器人爪子动画(Y方向)
            psbAnimateY(group, params, duration) {
                let self = this;
                let psbSite = group.children[0].position;
                let points = [];
                let rota = ({
                    y: params[0]
                });
                let yMotion = new TWEEN.Tween(rota);
                //下降与上升
                points[0] = (new self.$THREE.Vector3(psbSite.x, psbSite.y, psbSite.z));
                yMotion.to({
                    y: params[1] / 0.05 //children的坐标系未进行缩放，故移动的是初始坐标
                }, duration, TWEEN.Easing.Sinusoidal.InOut);
                yMotion.onUpdate(function () {
                    group.children[1].position.y = this.y;
                    for (let i = 2; i < group.children.length; i++) {  //连接绳子伸缩
                        let position = group.children[i].geometry.attributes.position;
                        position.array[4] = psbSite.y - 70 + this.y;
                        position.needsUpdate = true;
                    }
                });
                return yMotion;
            },
            //添加记忆动画
            reckonDistance(time, box, flag) {
                return {
                    time,
                    box,
                    flag
                };
            },
            setProgress(psb) {
                let self = this;
                if (this.progressTime < 100 && self.playState) {
                    self.$store.commit('index/setProgress', {attribute: 'moveTime', value: 1 * self.speedTimes})
                    self.psbTimer[psb.name] = setTimeout(() => {
                        self.setProgress(psb)
                    }, 1000);
                } else {
                    clearTimeout(self.psbTimer[psb.name]);
                }
            },
            // 获取模型盒子的方法
            getBox(name) {
                // debugger
                let scenes = this.$parent.scene;
                let obj = scenes.getObjectByName(name);
                let objBox = new this.$THREE.Box3();

                objBox.expandByObject(obj);
                return {
                    max: objBox.max,
                    min: objBox.min,
                }
            },
            // 计算工作站的 x 坐标
            // index 表示哪个站台
            calculateStation(index) {
                console.log('计算 station 位置', index)
                // 获取 场景 scene
                // let scenes = this.$parent.scene;
                // 第一个工作站 的 box 盒子
                // let stationFirst = scenes.getObjectByName('wallGroup0-0');
                // let stationFirstBox = new this.$THREE.Box3();
                // stationFirstBox.expandByObject(stationFirst);
                let stationBox = this.getBox('wallGroup0-0')

                if (index == -5) {
                    // debugger
                    let length = this.options.shelvesNum;
                    let shevlesFirstBox = this.getBox(`shelves0-${length}`)
                    // 箱子居中货架的paading(8.1059)
                    let width = shevlesFirstBox.max.x - stationBox.max.x + 8.1059
                    return width;
                } else {
                    let i = Math.abs(index) - 1

                    let stationIndexBox = this.getBox(`wallGroup0-${i}`);
                    let width = stationIndexBox.max.x - stationBox.max.x
                    return width;
                }

            },
            calculatePlace(boxSite, shevlesSpace, wallSpace, direction) { //计算抓箱的位置
                let targetSite;
                console.log('boxsite ******', boxSite.x)
                // debugger
                if (direction == 'x') {
                    //26.8559为货架间距、箱子居中货架的paading(8.1059)、19为箱子的宽度
                    return targetSite = wallSpace + 19.041 * boxSite.x + (shevlesSpace + 8.1059) * (boxSite.x - 1);
                    // } else if (direction == 'xEnd') {
                    // return targetSite = wallSpace + 19.041 * boxSite.x + (shevlesSpace + 8.1059) * (boxSite.x - 1);
                    // return targetSite = (19.041 + shevlesSpace + 8.1059) * boxSite.x+4.05;  //26.8559为货架间距、箱子居中货架的paading、19为箱子的宽度
                } else {
                    return targetSite = 19 * (boxSite.y + 1) + 24.09;//机器人上半部分为9.09箱子Y轴初始位置为15
                }
            },
            clawBox(name, start, end, time, index, flag, mark) {
                let self = this;
                let order = parseInt(start.z - 1);
                let psb = self.psbRobot.children[order];//运动机器人
                let boardTime = null;
                psb.state = false;//设置正在运动
                self.setProgress(psb);
                // if(self.psbTimer.)
                let params = {//计算运动时间对象
                    yEnd: end.y,
                    yStart: start.y,
                    xEnd: end.x,
                    xStart: start.x,
                    order: start.z - 1
                };
                let box3 = new THREE.TextureLoader().load(process.env.BASE_URL + 'mould/maps/box3.jpg');

                // console.log('start', start, end)
                let duration = self.calculateTime(params);
                // console.log('duration', duration)
                let durationCopy = JSON.parse(JSON.stringify(duration));

                let box = self.station.children.find(ele => ele.name == name.containerCode) || self.$parent.scene.children.find(ele => ele.name == name.containerCode) || psb.children[1].children.find(ele => ele.name == name.containerCode);
                console.log('box', box)
                // debugger
                if (box.status == 'scene') {
                    boardTime = durationCopy.grab
                } else {
                    boardTime = durationCopy.set
                }
                for (let i in self.psbRobot.children) {
                    let boardy = [self.psbRobot.children[i].position.y, -(self.seedBoard.max.y + 8)]; //放箱到播种板动画
                    self.psbRobot.children[i].actions = {
                        board: self.psbAnimateY(self.psbRobot.children[i], boardy, boardTime * 1000 / 2 / self.speedTimes)
                    };
                }
                // box.material.color.setRGB(1, 0, 0); //ff0000红色
                let texture = new THREE.TextureLoader().load(process.env.BASE_URL + 'mould/maps/boxRed1.jpg');
                var material = new THREE.MeshLambertMaterial({
                    map: texture,
                });
                box.material = material
                let edges = new self.$THREE.EdgesGeometry(box.geometry);
                // 立方体线框，不显示中间的斜线
                let edgesMaterial = new self.$THREE.LineBasicMaterial({
                    color: 0xff7f29,
                    linewidth: 5,
                });
                let lines = new self.$THREE.LineSegments(edges, edgesMaterial);//选中箱子辅助线
                // box.add(lines);

                // 网格模型和网格模型对应的轮廓线框插入到场景中
                // let outlineMaterial1 = new self.$THREE.MeshBasicMaterial( { color: 0xff0000,wireframe   : true } );
                // box.material=outlineMaterial1
                // let boxHelper = new self.$THREE.OutlinePass(box);
                // self.station.add( boxHelper );
                // console.log('box.material.color', box.material.color);
                let action = psb.actions;
                //11
                // x的值 4 14 16 26 为站台
                let xSpace = start.x < 0 ? self.calculateStation(start.x) : self.calculatePlace(start, 18.75, 32.7, 'x');//0--4为站台
                console.log('Xspace ******', start.x, xSpace)

                let initial = psb.position.x < xSpace ? -1 : 1;//判断初始抓箱和机器人位置 确定移动方向
                if (start.x == -5 || start.x == -4 || start.x == -3 || start.x == -1) {
                    initial = 1
                } else {
                    initial = -1
                }
                // debugger
                let direction = start.x < end.x ? -1 : 1; //判断初始位置和终点位置 确定方向
                let ySpace = self.calculatePlace(start, 18.75, 32.7, 'y') - self.shelves.max.y;
                console.log('ySpace ******', start.x, ySpace)
                let xStart = [psb.position.x, xSpace * initial]; //初始为0 ||self.psbRobot.children[order].position.x
                console.log('[psb.position.x, xSpace * initial] ******', start.x, ySpace, initial)
                // debugger
                let yStart;

                if (mark == 'start' || !mark) {
                    // 判断目标箱上方的障碍箱
                    self.obstructBox[order] = self.station.children.filter((obj) => {
                        return obj.isMesh && box.position.z === obj.position.z && box.position.x === obj.position.x && box.position.y < obj.position.y;
                    });
                    self.obstructBox[order].forEach(e => {
                        let material = new THREE.MeshLambertMaterial({
                            transparent: true,
                            opacity: 0.2,
                            map: box3,
                        });
                        e.material = material;
                        // e.material.color.setRGB(0.1, 0.1, 0.1); //#999999灰色
                    });
                    // amend flag 暂停标识
                    if (flag == 'amend') {
                        let precent = Math.abs(psb.children[1].position.y * 0.05) / Math.abs(ySpace);
                        duration.grab = durationCopy.grab * (1 - precent);
                        yStart = [psb.children[1].position.y, ySpace];
                        let distance = Math.abs(durationCopy.psbInitial - xSpace); //psb移动到start.x位置距离
                        let xprecent = Math.abs(1 - Math.abs(psb.position.x / distance)); //psb目前位置除以固定总路程
                        duration.psbTime = durationCopy.psbTime * xprecent;
                    } else {
                        yStart = [psb.position.y, ySpace];
                        // debugger
                    }
                    if (start.x < 0 && start.x !== -5) {  //初始是否为站台
                        if (flag == 'amend') {  //是否点击暂停 暂停后取最新机器人位置
                            let boardy = [psb.children[1].position.y, -(self.seedBoard.max.y + 8)];
                            action.fall_rise = self.psbAnimateY(psb, boardy, boardTime * 1000 / 2 / self.speedTimes);
                        } else {
                            action.fall_rise = action.board;
                        }
                    } else {
                        action.fall_rise = self.psbAnimateY(psb, yStart, duration.grab * 1000 / 2 / self.speedTimes);
                    }
                    if (xStart[0] != xStart[1]) {  //判断机器人位置是否和开始抓箱位置是否一致

                        action.ahead = self.psbAnimateX(psb, xStart, duration.psbTime / self.speedTimes);
                        action.ahead.chain(action.fall_rise);
                        action.ahead.start();
                        action.ahead.flag = 'start';
                        action.ahead.time = time;
                        action.ahead.box = box;
                    } else {
                        action.fall_rise.start();
                    }
                    action.fall_rise.flag = 'start';
                    action.fall_rise.box = box;
                    action.fall_rise.time = time;
                    action.fall_rise.onComplete(() => {
                        box.position.copy(psb.children[1].children[0].position);
                        box.scale.set(1, 1, 1);
                        box.status = 'psbGroup';//设置一个状态值
                        psb.children[1].add(box);
                        let y = [psb.children[1].position.y, 0];
                        let fall_rise = self.psbAnimateY(psb, y, durationCopy.grab * 1000 / 2 / self.speedTimes); //抓箱上升
                        fall_rise.start();
                        fall_rise.flag = 'end';
                        fall_rise.box = box;
                        fall_rise.time = time;
                        fall_rise.onComplete(() => {
                            let rise, xEnd;
                            //11
                            console.log('end', end.x)
                            if (end.x <= 0) {
                                xEnd = [psb.position.x, self.calculateStation(end.x)];
                                rise = action.board;
                            } else {
                                let yEndSpace = self.calculatePlace(end, 18.75, 32.7, 'y') - self.shelves.max.y;
                                let xEndSpace = self.calculatePlace(end, 18.75, 32.7, 'x');
                                xEnd = [psb.position.x, -xEndSpace];
                                let yEnd = [psb.position.y, yEndSpace];
                                rise = self.psbAnimateY(psb, yEnd, duration.set * 1000 / 2 / self.speedTimes);
                            }
                            let ahead = self.psbAnimateX(psb, xEnd, duration.move * 1000 / self.speedTimes);
                            ahead.flag = 'endx';
                            ahead.box = box;
                            ahead.time = time;
                            rise.flag = 'upBoard';
                            rise.box = box;
                            rise.time = time;
                            ahead.chain(rise);
                            ahead.start();
                            rise.onComplete(() => {
                                box.position.copy(box.getWorldPosition());
                                box.scale.set(0.05, 0.05, 0.05);
                                box.status = 'scene'
                                self.$parent.scene.add(box);
                                let yUp = [psb.children[1].position.y, 0]; //回升初始机器人位置
                                let up = self.psbAnimateY(psb, yUp, duration.set * 1000 / 2 / self.speedTimes);
                                up.start();
                                // up = self.addIdentity(up, time, box, 'endBoard');
                                up.flag = 'endBoard';
                                up.box = box;
                                up.time = time;
                                console.log('self.speedTimes', self.speedTimes, duration.set * 1000 / 2 / self.speedTimes);
                                up.onComplete(() => {
                                    psb.state = true;//完成运动
                                    let material = new THREE.MeshLambertMaterial({
                                        map: box3,
                                    });
                                    box.material = material;
                                    // box.material.color.setRGB(1, 1, 1); //箱子恢复颜色
                                    box.remove(lines);
                                    self.toRun(end, box, index, order, psb.name)
                                });
                            });
                        });
                    });
                } else if (mark == 'end') {
                    let y = [psb.children[1].position.y, 0]; //抓取箱子上升
                    let precent = Math.abs(psb.children[1].position.y * 0.05) / Math.abs(ySpace);
                    duration.grab = durationCopy.grab * (precent); //计算点击暂停后开始的剩余时间
                    let fall_rise = self.psbAnimateY(psb, y, duration.grab * 1000 / 2 / self.speedTimes); //抓箱上升
                    fall_rise.start();
                    // fall_rise = self.addIdentity(fall_rise, time, box, 'end');
                    fall_rise.flag = 'end';
                    fall_rise.box = box;
                    fall_rise.time = time;
                    fall_rise.onComplete(() => {
                        let rise, xEnd;
                        if (end.x <= 0) {
                            xEnd = [psb.position.x, self.calculateStation(end.x)];
                            rise = action.board;
                        } else {
                            let yEndSpace = self.calculatePlace(end, 18.75, 32.7, 'y') - self.shelves.max.y;
                            let xEndSpace = self.calculatePlace(end, 18.75, 32.7, 'x');
                            xEnd = [psb.position.x, -xEndSpace];
                            let yEnd = [psb.position.y, yEndSpace];
                            rise = self.psbAnimateY(psb, yEnd, duration.set * 1000 / 2 / self.speedTimes);
                        }
                        let ahead = self.psbAnimateX(psb, xEnd, duration.move * 1000 / self.speedTimes);
                        // ahead = self.addIdentity(ahead, time, box, 'endx');
                        // rise = self.addIdentity(rise, time, box, 'upBoard');
                        ahead.flag = 'endx';
                        ahead.box = box;
                        ahead.time = time;
                        rise.flag = 'upBoard';
                        rise.box = box;
                        rise.time = time;
                        ahead.chain(rise);
                        ahead.start();
                        rise.onComplete(() => {
                            box.position.copy(box.getWorldPosition());
                            box.scale.set(0.05, 0.05, 0.05);
                            box.status = 'scene'
                            self.$parent.scene.add(box);
                            let yUp = [psb.children[1].position.y, 0]; //回升初始机器人位置
                            let up = self.psbAnimateY(psb, yUp, duration.set * 1000 / 2 / self.speedTimes);
                            up.start();
                            // up = self.addIdentity(up, time, box, 'endBoard');
                            up.flag = 'endBoard';
                            up.box = box;
                            up.time = time;
                            up.onComplete(() => {
                                psb.state = true;//完成运动
                                let material = new THREE.MeshLambertMaterial({
                                    map: box3,
                                });
                                box.material = material;
                                // box.material.color.setRGB(1, 1, 1); //箱子恢复颜色
                                box.remove(lines);
                                self.toRun(end, box, index, order, psb.name)
                            });
                        });
                    });
                } else if (mark === 'endx') {
                    let rise, xEnd;
                    if (end.x <= 0) {
                        xEnd = [psb.position.x, self.calculateStation(end.x)];
                        rise = action.board;
                        let precent = Math.abs(psb.position.x) / Math.abs(xSpace);
                        duration.move = durationCopy.move * precent;
                    } else {
                        let yEndSpace = self.calculatePlace(end, 18.75, 32.7, 'y') - self.shelves.max.y;
                        let xEndSpace = self.calculatePlace(end, 18.75, 32.7, 'x');
                        xEnd = [psb.position.x, -xEndSpace];
                        let yEnd = [psb.position.y, yEndSpace];
                        rise = self.psbAnimateY(psb, yEnd, duration.set * 1000 / 2 / self.speedTimes);
                        let precent = Math.abs(psb.position.x) / Math.abs(xEndSpace);
                        duration.move = durationCopy.move * (1 - precent);
                    }
                    let ahead = self.psbAnimateX(psb, xEnd, duration.move * 1000 / self.speedTimes);
                    // ahead = self.addIdentity(ahead, time, box, 'endx');
                    // rise = self.addIdentity(rise, time, box, 'upBoard');
                    ahead.flag = 'endx';
                    ahead.box = box;
                    ahead.time = time;
                    rise.flag = 'upBoard';
                    rise.box = box;
                    rise.time = time;
                    ahead.chain(rise);
                    ahead.start();
                    rise.onComplete(() => {
                        box.position.copy(box.getWorldPosition());
                        box.scale.set(0.05, 0.05, 0.05);
                        box.status = 'scene'
                        self.$parent.scene.add(box);
                        let yUp = [psb.children[1].position.y, 0]; //回升初始机器人位置
                        let up = self.psbAnimateY(psb, yUp, duration.set * 1000 / 2 / self.speedTimes);
                        up.start();
                        // up = self.addIdentity(up, time, box, 'endBoard');
                        up.flag = 'endBoard';
                        up.box = box;
                        up.time = time;
                        up.onComplete(() => {
                            psb.state = true;//完成运动
                            let material = new THREE.MeshLambertMaterial({
                                map: box3,
                            });
                            box.material = material;

                            // box.material.color.setRGB(1, 1, 1); //箱子恢复颜色
                            box.remove(lines);
                            self.toRun(end, box, index, order, psb.name);
                        });
                    });
                } else if (mark === 'upBoard') {
                    let rise;
                    if (end.x <= 0) {
                        let boardy = [psb.children[1].position.y, -(self.seedBoard.max.y + 8)];
                        rise = self.psbAnimateY(psb, boardy, boardTime * 1000 / 2 / self.speedTimes);
                    } else {
                        let ySpace = self.calculatePlace(end, 18.75, 32.7, 'y') - self.shelves.max.y;
                        let yEnd = [psb.children[1].position.y, ySpace];
                        rise = self.psbAnimateY(psb, yEnd, duration.set * 1000 / 2 / self.speedTimes);
                    }
                    // rise = self.addIdentity(rise, time, box, 'upBoard');
                    rise.flag = 'upBoard';
                    rise.box = box;
                    rise.time = time;
                    rise.start();
                    rise.onComplete(() => {
                        box.position.copy(box.getWorldPosition());
                        box.scale.set(0.05, 0.05, 0.05);
                        box.status = 'scene';
                        self.$parent.scene.add(box);
                        let yUp = [psb.children[1].position.y, 0]; //回升初始机器人位置
                        let up = self.psbAnimateY(psb, yUp, duration.set * 1000 / 2 / self.speedTimes);
                        up.start();
                        // up = self.addIdentity(up, time, box, 'endBoard');
                        up.flag = 'endBoard';
                        up.box = box;
                        up.time = time;
                        up.onComplete(() => {
                            psb.state = true;//完成运动
                            let material = new THREE.MeshLambertMaterial({
                                map: box3,
                            });
                            box.material = material;
                            // box.material.color.setRGB(1, 1, 1); //箱子恢复颜色
                            box.remove(lines);
                            self.toRun(end, box, index, order, psb.name);
                        });
                    });
                } else if (mark === 'endBoard') {
                    let yUp = [psb.children[1].position.y, 0]; //回升初始机器人位置
                    let up = self.psbAnimateY(psb, yUp, duration.set * 1000 / 2 / self.speedTimes);
                    up.start();
                    // up = self.addIdentity(up, time, box, 'endBoard');
                    up.flag = 'endBoard';
                    up.box = box;
                    up.time = time;
                    up.onComplete(() => {
                        psb.state = true;//完成运动
                        let material = new THREE.MeshLambertMaterial({
                            map: box3,
                        });
                        box.material = material;
                        // box.material.color.setRGB(1, 1, 1); //箱子恢复颜色
                        box.remove(lines);
                        self.toRun(end, box, index, order, psb.name)
                    });
                }
            },
            //待执行运动列表运动
            toRun(end, box, index, order, name) {
                let self = this;
                clearTimeout(self.psbTimer[name])
                if (end.x <= 0) { //0-4为站台
                    let stationIndex = end.x
                    console.log('stationIndex stationIndex', stationIndex)
                    self.$emit('actionAnimate', {box, index, stationIndex});
                    self.obstructBox[order].forEach(e => {
                        let texture = new THREE.TextureLoader().load(process.env.BASE_URL + 'mould/maps/box3.jpg');
                        var material = new THREE.MeshLambertMaterial({
                            map: texture,
                        });
                        e.material = material
                        // e.material.color.setRGB(1, 1, 1);
                    });
                } else if (self.waitData.length) {
                    for (let i in self.waitData) {
                        let news = self.waitData;
                        // console.log('news', news)
                        let index = parseInt(news[i].startPoint.z - 1);
                        let robot = self.psbRobot.children[index];//运动机器人
                        if (robot.state) {
                            self.clawBox(news[i], news[i].startPoint, news[i].endPoint, news[i].startTime, news[i].index);
                            self.nowRun.push(news[i]);
                            self.waitData.splice(i, 1);
                        }
                    }
                }
            },
            // 计算运动时间
            /*
            *标识为 grab 、set 、 move
            * */
            calculateTime(params) {
                let grab = 21 - params.yStart;  //抓箱时间 //第一层为21(y为0)，逐层减一
                let set = 24 - params.yEnd;  //放箱时间
                // let move= Math.round((params.xEnd-params.xStart)*0.245+7 ) //移动时间
                let move = params.xEnd - params.xStart;  //计算psb移动时间
                move = ~~(Math.abs(move) * 0.245 + 7 + 0.5);
                let psbInitial = this.psbRobot.children[params.order].position.x;
                let psbStart = (psbInitial - 32.7) / (18.75 + 27.147); //货架间距18.75+货架宽度27.14
                // let psbTime = ~~((Math.abs(psbStart) - start.x) * 0.245 + 7 + 0.5) * 1000;  //计算psb移动到初始抓箱位置需要的时间
                let psbTime = psbStart + params.xStart;  //计算psb移动到初始抓箱位置需要的时间
                psbTime = ~~(Math.abs(psbTime) * 0.245 + 7 + 0.5) * 1000;
                return {
                    grab,
                    set,
                    move,
                    psbTime,
                    psbInitial //初始psb位置
                };
            },
            //世界位置转坐标
            // distanceToVector(psb) {
            //     let x, y, xDistance;
            //     xDistance = (psb.position.x - 32.7) / (18.75 + 27.147);//货架间距18.75+货架宽度27.14
            //     xDistance > 0 ? x = xDistance : x = xDistance * -1;
            //     y = (psb.children[1].position.y * -0.05) / 19;//机器人上半部分为9.09箱子Y轴初始位置为15
            //     console.log('x,y', psb.children[1].position.y, x, y);
            //     return {
            //         x, y
            //     };
            // },


            addLines(size) {
                var textureTree = new THREE.TextureLoader().load(process.env.BASE_URL + "mould/maps/line.png");
                var num = 150000;
                let group = new this.$THREE.Group();
                group.name = 'lines'
                if (this.index === 0) {
                    for (let i = 0; i < size; i++) {
                        var spriteMaterial = new THREE.SpriteMaterial({
                            map: textureTree,//设置精灵纹理贴图
                        });
                        // 创建精灵模型对象
                        var sprite = new THREE.Sprite(spriteMaterial);
                        // 控制精灵大小,
                        sprite.rotateX(Math.PI)
                        sprite.scale.set(120, 10000, 1); //// 只需要设置x、y两个分量就可以
                        var k1 = Math.random() - 0.5;
                        var k2 = Math.random() - 0.5;
                        var k3 = Math.random();
                        // 设置精灵模型位置，在整个空间上上随机分布
                        // sprite.position.set(num * k1, num * k3, num * k2);
                        if (Math.abs(num * k1) > 6000 && Math.abs(num * k2) > 6000) {
                            sprite.position.set(num * k1, num * k3, num * k2);
                            // console.log(sprite.position)
                            sprite.name = 'line' + i;
                            group.add(sprite);
                        }
                    }
                    this.$parent.scene.add(group);
                    this.$parent.addLines = true;
                }
            },
            animate() {
                let self = this;
                TWEEN.update();
                if (self.mixer) self.mixer.update(200);
                requestAnimationFrame(self.animate);
            },
        },
        mounted() {
        },
        watch: {
            initState: {
                handler(news, old) {
                    if (news === 7 || old === 7) {
                        this.init();
                    }
                },
                immediate: true,
            },
            waitData: {
                handler(news) {
                    // console.log('news', news)
                }
            },
            animateData: {
                handler(news, old) {
                    let self = this;
                    if (JSON.stringify(news) !== '{}') {
                        this.$parent.loading = false
                        for (let i in news) {
                            let order = parseInt(news[i].startPoint.z - 1);
                            let psb = self.psbRobot.children[order];//运动机器人
                            // console.log('psb', psb)
                            if (psb.state) {
                                self.clawBox(news[i], news[i].startPoint, news[i].endPoint, news[i].startTime, news[i].index);
                                self.nowRun.push(news[i]);
                            } else {
                                self.waitData.push(news[i]);
                            }
                        }
                    }
                },
            },
            box: {
                handler(news, old) {
                    if (news.length && this.shelves) {
                        this.addBox();
                        this.$parent.createGroundAndFloor();
                        this.$set(this.$parent.loadState, 'addBox', true)
                    }
                },
                deep: true
            },
            pickFinish: {
                handler(val, old) {
                    let self = this;
                    let box = self.pickFinish.box;
                    // console.log('news', news, self.pickFinish);
                    for (let i in self.waitData) {
                        let news = self.waitData;
                        let order = parseInt(news[i].startPoint.z - 1);
                        let psb = self.psbRobot.children[order];//运动机器人
                        console.log('psb', psb)
                        if (psb.state) {
                            self.clawBox(news[i], news[i].startPoint, news[i].endPoint, news[i].startTime, news[i].index);
                            self.nowRun.push(news[i]);
                            self.waitData.splice(i, 1);
                        } else {
                            // self.waitData.push(news[i]);
                        }
                        // let index = parseInt(box.siteZ - 1);
                        // let robot = self.psbRobot.children[index];//运动机器人
                        // if (box.name == list[i].containerCode && list[i].taskType == '回箱') {
                        //     self.clawBox(list[i], list[i].startPoint, list[i].endPoint, list[i].startTime, list[i].index);
                        //     self.nowRun.push(list[i]);
                        //     self.waitData.splice(i, 1);
                        //     break;
                        // }
                    }
                },
            },

            playState() {
                let self = this;
                if (!self.playState) {  //暂停播放
                    self.runPoint = [];
                    let animate = TWEEN.getAll();
                    let animateClone = JSON.parse(JSON.stringify(animate));
                    for (let i = animateClone.length - 1; i >= 0; i--) {
                        let list = {
                            flag: animate[i].flag,
                            box: animate[i].box,
                            time: animate[i].time || ''
                        };
                        self.runPoint.push(list);
                        animate[i].stop();
                    }
                } else {
                    let nowRun = self.nowRun.filter((obj, index) => {
                        return !(self.psbRobot.children[parseInt(obj.startPoint.z - 1)].state);
                    });
                    if (nowRun.length) {
                        console.log('e', self.runPoint);
                        nowRun.forEach((e, index) => {
                            self.runPoint.forEach(data => {
                                if (e.containerCode && data.box.name == e.containerCode && data.time == e.startTime) {
                                    this.clawBox(e, e.startPoint, e.endPoint, e.startTime, e.index, 'amend', data.flag);
                                }
                            });
                        });
                    } else {
                        self.runPoint.forEach((e, index) => {
                            if (e.flag == 'pick') {
                                this.$emit('actionAnimate', e.box);
                            }
                        });
                    }
                }
            }
        }
    };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .container {
        height: 100%;
        width: 100%;
    }
</style>
       
