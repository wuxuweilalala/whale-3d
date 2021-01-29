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
            machineData: {},
            index: Number,  //当前工作站index
            modelData: Object,
            hasProjectData: Boolean,
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
                getHasData: 'getHasData',
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
                geometry: null,
                wallBox: null,
                padding: 18.75,
                shelvesWidth: 0, // 货架的宽度
                scenes: null,   // 场景
                firstBox: null,     // 第一个模型
                currentX: -1,
                shelveArr: [],
                boxsGroup: null,
                lastX: -1,  // 上一个x
                lastName: '',
                psbWidth: 0,
                loadModel: false,
                pstPos: [],
                currentIndex: 0,
                shelvesData: [],
            };
        },

        methods: {

            initStation() {
                this.station = new this.$THREE.Object3D();//一个工作区
                this.station.name = this.options.name;
                this.station.position = this.options.stationSite;

                this.wallgroup = new this.$THREE.Group();//播种墙、播种板
                this.robotTeam = new this.$THREE.Group();//货车与机器人组
                this.station.add(this.wallgroup);
                this.station.add(this.robotTeam);
                this.$parent.scene.add(this.station);
            },
            // 加载 psb 需要货架的盒模型
            addPsb(psbLen) {
                let self = this
                let psb = this.getMould.psb;
                let site = new self.$THREE.Box3();
                psb.scale.set(0.05, 0.05, 0.05);
                site.expandByObject(psb);
                let psbWidth = site.max.z - site.min.z;
                this.psbWidth = psbWidth
                let initZSpace = (self.firstBox.max.z - self.firstBox.min.z - 20 - psbWidth * 6) / 7;
                let padding = (31.96 - psbWidth) / 2; //轨道宽度31.96求机器人边距
                let addZSpace = 0;
                let robotBox = new this.$THREE.Box3()
                this.psbRobot = new this.$THREE.Group();
                this.psbRobot.name = `psb-group-${this.index}`
                this.station.add(this.psbRobot);
                for (let i in psbLen) {
                    let robot = psb.clone();
                    let order = parseInt(psbLen[i].y % 6); // 第几个货道
                    order = order ? order - 1 : 5
                    let group = new self.$THREE.Group();
                    robot.name = psbLen[i].code; //psb名称
                    robot.state = true;
                    robotBox.expandByObject(robot)
                    this.psbRobot.add(robot);
                    let robotWidth = robotBox.max.x - robotBox.min.x
                    robot.position.z = -40.55243664515625 * order;

                    this.psbRobot.position.x = this.firstBox.min.x - robotWidth;
                    let psbWorld = new self.$THREE.Vector3();
                    let targetWorld = new self.$THREE.Vector3();
                    this.scenes.updateMatrixWorld()
                    let firstObj = this.getModelObj(0).firstObj
                    this.scenes.getObjectByName(`${firstObj.name}0-${firstObj.x}`).getWorldPosition(psbWorld)
                    robot.position.x = psbWorld.x;
                    let targetList = self.scenes.getObjectByName(`station${this.index}-${psbLen[i].x}`) || self.scenes.getObjectByName(`shelve${this.index}-${psbLen[i].x}`)
                    if (targetList) { //PSB机器人X轴 往后方向位置判断
                        targetList.getWorldPosition(targetWorld)
                        robot.position.x = targetWorld.x - psbWorld.x
                    }
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
                        let lines = this.geometry.clone().setFromPoints(points);
                        let lineMesh = new self.$THREE.Line(lines, material);
                        robot.add(lineMesh);
                    }
                    this.psbRobot.position.y = 0
                    let cs = robot.children[1].children[0].children
                    self.$parent.clickRobots.push(cs[16])
                }
            },
            /**
             * 获取 第一个和最后一个 的盒模型
             * i 是 modelData动画数据数组下标
             */
            getModelObj(i) {
                let modelData = this.$parent.modelData
                let shelvesData = modelData[i].shelve
                let firstObj = {}
                let lastObj = {}

                for (let i = 0; i < shelvesData.length; i++) {
                    let model = shelvesData[i]
                    let name = model.name
                    if (name === 'shelve' || name === 'pickWay' || name === 'station') {
                        firstObj = model
                        break
                    }
                }
                for (let j = shelvesData.length - 1; j > 0; j--) {
                    let model = shelvesData[j]
                    let name = model.name
                    let num = model.num
                    if (name !== 'pstWay') {
                        lastObj = model
                        break
                    }
                }
                return {
                    firstObj,
                    lastObj,
                }
            },
            /**
             * 添加轨道
             * i 是 modelData动画数据数组下标
             */
            addTrack(i, psts = []) {
                const loader = new GLTFLoader();
                let self = this
                let modelObj = this.getModelObj(i)
                let firstName = modelObj.firstObj.name
                if(firstName == 'pickWay') {
                    firstName = 'shelve'
                }
                let lastName = modelObj.lastObj.name
                let firstX = modelObj.firstObj.x
                let lastX = modelObj.lastObj.x + modelObj.lastObj.num - 1
                let index = 0
                if (i == 1) {
                    index = this.index
                }
                let first = this.getBox(`${firstName}${index}-${firstX}`)
                let last = this.getBox(`${lastName}${index}-${lastX}`)
                this.firstBox = first
                // 14 货架与 pst货架之间的距离   psts.length 是 pst 个数
                let x = 18.75 * psts.length
                // if(psts.length == 2) {
                //     x = x + 14
                // }
                let width =  first.max.x - last.min.x + x
                let deep = first.max.y - first.min.y
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
                        }
                    })
                    let trackBox = new self.$THREE.Box3();
                    trackBox.expandByObject(gltf);
                    let boxWidth = trackBox.max.x - trackBox.min.x
                    let trackGroup = new self.$THREE.Group();
                    gltf.rotateY(Math.PI)
                    for (let j = 0; j < 6; j++) {
                        let walltrack = gltf.clone();
                        walltrack.scale.set(width / boxWidth, 0.05, 0.05);
                        walltrack.name = `psbTrack-${this.index}-${j}`
                        trackGroup.add(walltrack);
                        walltrack.position.z = -41 * j;
                    }
                    let x = first.max.x
                    if(psts.length == 1) {
                        let len = this.shelvesData[this.shelvesData.length - 1].x
                        if(psts[0].x !== len) {
                            x = first.max.x + 14
                        }
                    } else if(psts.length == 2) {
                        x = first.max.x + 14
                    }
                    trackGroup.position.x = x;
                    trackGroup.position.z = -18;
                    trackGroup.position.y = deep - 12
                    self.station.add(trackGroup);
                    self.$store.commit('index/setPstSwitch', true)
                });
            },
            /**
             * 加载一个工作站
             *  name 是工作站的名字
             *  x 是工作站当前的 x 坐标
             */
            addStationGroup(name, x) {
                let self = this
                let platform = self.getMould.platform;
                let sowwall = self.getMould.sowwall;
                let shelves_site = self.shelves;
                self.wallgroup.name = 'allWallGroup';
                var wallgroup = new this.$THREE.Group();//播种墙、播种板
                self.wallgroup.add(wallgroup);
                wallgroup.name = name;
                let platwall = sowwall.clone();
                platwall.scale.set(0.05, 0.05, 0.05);
                let wall = new self.$THREE.Box3();
                wall.expandByObject(platwall);
                platwall.name = 'sowWall';
                wallgroup.add(platwall); //把站台架加入组中
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

                this.wallBox = new self.$THREE.Box3();
                this.wallBox.expandByObject(wallgroup);
                let staWidth = this.wallBox.max.x - this.wallBox.min.x
                wallgroup.position.x = x - staWidth;

                return staWidth
            },
            /**
             *  生成货架
             * shelvesLen 生成货架数量
             * currentX 第一个货架的x 位置
             * xPos 命名需要的参数
             */
            addShelves(shelvesLen, currentX, xPos, transparent = true) {
                let self = this
                let obj = this.getMould.shelves;
                let x_space = 0;
                let shelvesPadding = this.padding

                for (let i = 0; i < shelvesLen; i++) {
                    let gltf = obj.clone();
                    gltf.name = `shelve${this.index}-${xPos + i}`;
                    gltf.visible = transparent

                    gltf.position.x = currentX + x_space - this.shelvesWidth * i;
                    self.station.add(gltf);
                    x_space -= shelvesPadding;  //货架之间的默认间距为375mm*0.05=18.75
                }
            },
            // 添加 一层楼的
            addFloor(shelvesData, peoples) {
                let currentX = 0
                let width = this.shelvesWidth
                let padding = this.padding
                let k = 0
                for (let i = 0; i < shelvesData.length; i++) {
                    let model = shelvesData[i]
                    let name = model.name
                    let num = model.num
                    let x = model.x
                    let space = model.space
                    if (name === 'pstWay') {
                        Object.assign(model, {
                            posX: currentX,
                        })
                        this.addShelves(num, currentX, x, false)
                        this.pstPos.push(model)
                        currentX = currentX - num * (width + padding)
                    } else if (name === 'station') {
                        let name = `station${this.index}-${x}`
                        currentX = currentX - padding
                        let stationWidth = this.addStationGroup(name, currentX)
                        currentX = currentX - stationWidth
                    } else if (name === 'pickWay') {
                        this.addShelves(num, currentX, x, false)
                        currentX = currentX - num * (width + padding)
                    } else if (name === 'shelve') {
                        this.addShelves(num, currentX, x)
                        currentX = currentX - num * (width + padding)
                    }
                    // if (this.index % 2 == 0) {
                    //     for (let j = 0; j < peoples.length; j++) {
                    //         let pe = peoples[j]
                    //         if (pe.x == x) {
                    //
                    //             // this.$parent.addRobot(currentX, this.station, j, name)
                    //             k = k + 1
                    //         }
                    //     }
                    // }
                }
            },
            // modelData 是2d 编辑器生成的数据
            // 根据 modelData 数据生成模型
            addModelFromData() {
                //机器人轨道
                let self = this;
                let shelvestrack = self.getMould.shelvestrack;
                let trackBox = new self.$THREE.Box3();
                trackBox.expandByObject(shelvestrack);
                let trackWidth = (trackBox.max.z - trackBox.min.z) * 0.05;
                // let shelvesWidth = shelves_site.max.z - shelves_site.min.z;
                // let initZSpace = (shelvesWidth - 20 - trackWidth * 6) / 7; //20位货架两边大小
                // 货架盒模型
                let obj = this.getMould.shelves;
                this.shelves = new self.$THREE.Box3();
                obj.scale.set(0.05, 0.05, 0.05);
                this.shelves.expandByObject(obj);
                this.shelvesWidth = this.shelves.max.x - this.shelves.min.x

                // modelData 是 2d 编辑器生成的映射数据
                let modelData = this.$parent.modelData
                let stationNum = this.$parent.sceneOption[0].stationNum
                let shelvesData = modelData[0].shelve
                let peoples = modelData[0].peoples
                let psts = modelData[0].psts
                let psbLen = modelData[0].psb.length
                let index = 0
                if (this.index >= stationNum) {
                    shelvesData = modelData[1].shelve
                    peoples = modelData[1].peoples
                    psbLen = modelData[0].psb.length
                    psts = modelData[1].psts
                    index = 1
                }
                this.shelvesData = shelvesData
                this.addFloor(shelvesData, peoples)
                this.addTrack(index, psts)
            },
            // 加载模型
            loadShelves(shelvesPadding = 18.75) {
                let self = this;
                const loader = new GLTFLoader();
                let length = self.options.shelvesNum;
                // 拿到父组件的场景 scene
                this.scenes = this.$parent.scene

                this.geometry = new self.$THREE.BufferGeometry();
                let positions = new Float32Array(2 * 3);
                this.geometry.setDrawRange(0, 2);
                this.geometry.addAttribute('position', new self.$THREE.BufferAttribute(positions, 3));

                // let shelves_width = self.shelves.max.x - self.shelves.min.x;
                this.addModelFromData()
            },
            getBoxMax(name) {
                let obj = this.scenes.getObjectByName(name);

                if (obj !== undefined) {
                    let objBox = new this.$THREE.Box3();
                    objBox.expandByObject(obj);
                    return [objBox.max.x, objBox.max.z]
                }
                return
            },
            //添加货箱
            addBox() {
                let box = this.getMould.box;
                // 加载货箱
                /*
                高度: 150mm*0.05=7.5
                宽度: 639mm*0.05=31.95
                长度: 5370mm*0.05=268.5
                 * */
                box.scale.set(0.05, 0.05, 0.05);
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
                let x_space = 13.5, z_space = 8.5;
                let boxGroup = new this.$THREE.Group()
                boxGroup.name = 'allBox'
                this.$parent.scene.add(boxGroup)
                let list = this.box;
                for (let i in list) {
                    if (boxGroup.children.find(ele => ele.name == list[i][3])) continue;
                    let gltf = box.clone();
                    gltf.material = box.material.clone();
                    gltf.geometry.center();//模型中心点居中
                    gltf.material.transparent = true;//是否透明
                    gltf.siteZ = list[i][2];
                    gltf.name = list[i][3]; //行列层
                    let site = this.addCargos(list[i], x_space, z_space, this.shelves);
                    if (site.length > 0) {
                        gltf.position.set(site[0], site[1], site[2]);
                        boxGroup.add(gltf);
                    }
                }
            },
            addCargos(site, x_space, z_space, shelves_site) {
                let x, y, z;
                if (site[0] !== this.currentX) {
                    this.shelveArr = this.getBoxMax(`shelve${this.index}-${site[0]}`) || this.getBoxMax(`station${this.index}-${site[0]}`)
                    this.currentX = site[0]
                }
                let xSite = this.checkShevles(site[0]) //计算是货架还是工作站
                if (this.shelveArr.length > 0) {
                    x = xSite ? this.shelveArr[0] - x_space - 5 : this.shelveArr[0] - x_space
                    y = xSite ? 76 : 15 + 19 * site[1] - 1;
                    z = this.shelveArr[1] - 10 - 31.7 * (site[2] - 1) - z_space * site[2] - 31.7 / 2;   //31.7为货箱Z方向的长度
                    return [x, y, z];
                } else {
                    return []
                }
            },
            // 初始化
            init() {
                this.initStation();
                this.loadShelves();
                this.addLines(20);
                this.$parent.createGroundAndFloor()
                this.animate();
            },
            // 窗口变动触发的方法
            onWindowResize() {
                let self = this;
                self.camera.aspect = window.innerWidth / window.innerHeight;
                // self.camera.updateProjectionMatrix();
                self.renderer.setSize(window.innerWidth, window.innerHeight);
            },
            // 抓箱机器人动画(X方向)
            psbAnimateX(group, params, duration) {
                let rota = ({
                    x: params[0]
                });
                let xMotion = new TWEEN.Tween(rota);
                xMotion.to({
                    x: params[1]
                }, Math.abs(duration), TWEEN.Easing.Sinusoidal.InOut);
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
                }, Math.abs(duration), TWEEN.Easing.Sinusoidal.InOut);
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

            setProgress(psb) {
                this.setIntervalFrame(psb.name, 1000)
            },
            //定时器
            setIntervalFrame(name, interval) {
                let timer
                const now = Date.now
                let startTime = now()
                let endTime = startTime
                if(this.psbTimer[name])cancelAnimationFrame(this.psbTimer[name])
                const loop = () => {
                    timer = requestAnimationFrame(loop)
                    this.psbTimer[name] = timer
                    endTime = now()
                    if (endTime - startTime >= interval) {
                        if (this.progressTime < 100 && this.playState) {
                            startTime = endTime = now()
                            this.$store.commit('index/setProgress', {attribute: 'moveTime', value: 1 * this.speedTimes})
                        } else {
                            cancelAnimationFrame(timer)
                        }

                    }
                }
                loop()
            },
            // 获取模型盒子的方法
            getBox(name) {
                let scenes = this.$parent.scene;
                let obj = scenes.getObjectByName(name);
                if (obj !== undefined) {
                    let objBox = new this.$THREE.Box3();
                    objBox.expandByObject(obj);
                    return {
                        max: objBox.max,
                        min: objBox.min,
                    }
                }
                return {}
            },
            // 计算工作站的 x 坐标
            // index 表示哪个站台
            calculateStation(index) {
                let stations = this.$parent.stations
                let model = {}
                for (let i = 0; i < stations.length; i++) {
                    let sta = stations[i]
                    if (sta.x === index) {
                        model = sta
                    }
                }
                let station = this.getBox(`${model.name}0-${model.x}`)
                let lastObj = this.getBox(this.lastName)
                let width = station.max.x - station.min.x
                let firstObj = this.getModelObj(0).firstObj
                let first = this.getBox(`${firstObj.name}0-${firstObj.x}`)
                let firstWidth = first.max.x - station.max.x

                return -firstWidth - width / 4
            },
            calculatePlace(boxSite, shevlesSpace, wallSpace, direction) { //计算抓箱的位置
                let targetSite;
                let x = boxSite.x
                if (direction == 'x') {
                    //26.8559为货架间距、箱子居中货架的paading(8.1059)、19为箱子的宽度
                    let last = this.getBox(`shelve0-${x}`)
                    let firstObj = this.getModelObj(0).firstObj
                    let first = this.getBox(`${firstObj.name}0-${firstObj.x}`)
                    let firstWidth = first.max.x - first.min.x
                    let width = first.max.x - last.max.x
                    return width + 3
                }
                targetSite = 19 * (boxSite.y + 1) + 24.09;//机器人上半部分为9.09箱子Y轴初始位置为15
                return targetSite
            },
            changeValue(group, array) {
                if (group && group.name === '') {
                    array = [0, 0]
                }
                return array
            },
            checkShevles(x) {
                let xSite = this.shelvesData.filter(e => e.x == x)
                return xSite[0] && xSite[0].name == "station"
            },
            // 为运动数据添加属性
            addAtr(obj, flag, time, box) {
                obj.flag = flag;
                obj.time = time;
                obj.box = box;
                obj.index = this.index;
            },
            clawBox(psb, name, start, end, time, index, flag, mark) {
                let self = this;
                let order = parseInt(start.z % 6 - 1);
                let endXSite = this.checkShevles(end.x) //计算是货架还是工作站
                let stationState = false
                if (endXSite) {
                    stationState = true
                }
                // let num = parseInt(start.z / 6)
                // self.psbRobot = this.scenes.getObjectByName(`psb-group-${num}`)
                let boardTime = null;
                psb.state = false;//设置正在运动
                self.setProgress(psb);
                let params = {//计算运动时间对象
                    yEnd: end.y,
                    yStart: start.y,
                    xEnd: end.x,
                    xStart: start.x,
                    order: order,
                    psb
                };
                let box3 = new THREE.TextureLoader().load(process.env.BASE_URL + 'mould/maps/box3.jpg');
                let duration = self.calculateTime(params);
                let durationCopy = JSON.parse(JSON.stringify(duration));

                let allBox = this.scenes.getObjectByName('allBox')
                let box = this.scenes.getObjectByName(name.containerCode)
                if (box.status == 'scene') {
                    boardTime = durationCopy.grab
                } else {
                    boardTime = durationCopy.set

                }
                for (let i in self.psbRobot.children) {
                    let boardy = [self.psbRobot.children[i].position.y, -(self.seedBoard.max.y + 8)]; //放箱到播种板动画
                    boardy = this.changeValue(box, boardy)
                    self.psbRobot.children[i].actions = {
                        board: self.psbAnimateY(self.psbRobot.children[i], boardy, boardTime * 1000 / 2 / self.speedTimes)
                    };
                }
                let texture = new THREE.TextureLoader().load(process.env.BASE_URL + 'mould/maps/boxRed1.jpg');
                var material = new THREE.MeshLambertMaterial({
                    map: texture,
                });
                box.material = material
                //
                let lines = null
                if (box.name !== '') {
                    let edges = new self.$THREE.EdgesGeometry(box.geometry);
                    // 立方体线框，不显示中间的斜线
                    let edgesMaterial = new self.$THREE.LineBasicMaterial({
                        color: 0xff7f29,
                        linewidth: 5,
                    });
                    lines = new self.$THREE.LineSegments(edges, edgesMaterial);//选中箱子辅助线
                }
                let pstTrack = this.scenes.getObjectByName(`shelve${this.index}-${end.x}`)?.modelType
                if (psb.children[1].getObjectByName(name.containerCode) && !mark) {
                    if (name.robotType == 'PST') {
                        let psb = this.scenes.getObjectByName(name.psbCode)
                        this.$parent.pstTween(psb, name)  //pst动画
                    } else {
                        self.endPointTween(stationState, psb, boardTime, duration, end, box, order, box3, index, lines, time)
                    }
                    return
                }

                let startState = this.checkShevles(start.x) //计算是货架还是工作站
                let xSpace = startState ? self.calculateStation(start.x) : self.calculatePlace(start, 18.75, 32.7, 'x');//计算X移动的偏移量
                let initial = psb.position.x < xSpace ? -1 : 1;//判断初始机器人位置 确定移动方向
                if (startState) {
                    initial = 1
                } else {
                    initial = -1
                }
                let ySpace = self.calculatePlace(start, 18.75, 32.7, 'y') - self.shelves.max.y;
                let xStart = [psb.position.x, xSpace * initial]; //初始为0 ||self.psbRobot.children[order].position.


                if (!name.containerCode) {  //psb运动没有箱子的情况下
                    let singlePsb
                    if (stationState) {
                        singlePsb = [psb.position.x, self.calculateStation(end.x)];
                    } else {
                        let xEndSpace = self.calculatePlace(end, 18.75, 32.7, 'x');
                        singlePsb = [psb.position.x, -xEndSpace];
                    }
                    let ahead = self.psbAnimateX(psb, singlePsb, duration.move * 1000 / self.speedTimes);
                    self.addAtr(ahead, 'endx', time, box)
                    ahead.start().onComplete(() => {
                        psb.state = true;//完成运动
                        self.toRun(end, box, index, order, psb.name, true)
                    })
                    return
                }

                let action = psb.actions

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
                    }
                    if (startState) {  //是否为站台
                        if (flag == 'amend') {  //是否点击暂停 暂停后取最新机器人位置
                            let boardy = [psb.children[1].position.y, -(self.seedBoard.max.y + 8)];
                            boardy = this.changeValue(box, boardy)
                            action.fall_rise = self.psbAnimateY(psb, boardy, boardTime * 1000 / 2 / self.speedTimes);
                        } else {
                            action.fall_rise = action.board;
                        }
                    } else {
                        yStart = this.changeValue(box, yStart)
                        action.fall_rise = self.psbAnimateY(psb, yStart, duration.grab * 1000 / 2 / self.speedTimes);
                    }
                    if (xStart[0] != xStart[1]) {  //判断机器人位置是否和开始抓箱位置是否一致
                        action.ahead = self.psbAnimateX(psb, xStart, duration.psbTime / self.speedTimes);
                        this.$store.commit('index/setProgress', {attribute: 'totalTime', value:duration.psbTime/1000})  //把psb移动时间加入进度条
                        action.ahead.chain(action.fall_rise);
                        action.ahead.start();
                        self.addAtr(action.ahead, 'start', time, box)
                    } else {
                        action.fall_rise.start();
                    }
                    self.addAtr(action.fall_rise, 'start', time, box)
                    action.fall_rise.onComplete(() => {
                        box.position.copy(psb.children[1].children[0].position);
                        box.scale.set(1, 1, 1);
                        box.status = 'psbGroup';//设置一个状态值
                        psb.children[1].add(box);
                        let fall_rise = null
                        let y = [psb.children[1].position.y, 0];
                        y = this.changeValue(box, y)
                        fall_rise = self.psbAnimateY(psb, y, durationCopy.grab * 1000 / 2 / self.speedTimes); //抓箱上升
                        fall_rise.start();
                        self.addAtr(fall_rise, 'end', time, box)
                        fall_rise.onComplete(() => {
                            if (name.robotType == 'PST') {
                                let psb = this.scenes.getObjectByName(name.psbCode)
                                this.$parent.pstTween(psb, name)  //pst动画
                                return
                            }
                            self.endPointTween(stationState, psb, boardTime, duration, end, box, order, box3, index, lines, time)
                        });
                    });
                } else if (mark == 'end') {
                    let y = [psb.children[1].position.y, 0]; //抓取箱子上升
                    let precent = Math.abs(psb.children[1].position.y * 0.05) / Math.abs(ySpace);
                    duration.grab = durationCopy.grab * (precent); //计算点击暂停后开始的剩余时间
                    y = this.changeValue(box, y)
                    let fall_rise = self.psbAnimateY(psb, y, duration.grab * 1000 / 2 / self.speedTimes); //抓箱上升
                    fall_rise.start();
                    self.addAtr(fall_rise, 'end', time, box)
                    fall_rise.onComplete(() => {
                        self.endPointTween(stationState, psb, boardTime, duration, end, box, order, box3, index, lines, time)
                    });
                } else if (mark == 'endx') {
                    if (stationState) {
                        // xEnd = [psb.position.x, self.calculateStation(end.x)];
                        // rise = action.board;
                        let precent = Math.abs(psb.position.x) / Math.abs(xSpace);
                        duration.move = durationCopy.move * precent;
                    } else {
                        // let yEndSpace = self.calculatePlace(end, 18.75, 32.7, 'y') - self.shelves.max.y;
                        let xEndSpace = self.calculatePlace(end, 18.75, 32.7, 'x');
                        // xEnd = [psb.position.x, -xEndSpace];
                        // let yEnd = [psb.position.y, yEndSpace];
                        // yEnd = this.changeValue(box, yEnd)
                        // rise = self.psbAnimateY(psb, yEnd, duration.set * 1000 / 2 / self.speedTimes);
                        let precent = Math.abs(psb.position.x) / Math.abs(xEndSpace);
                        duration.move = durationCopy.move * (1 - precent);
                    }
                    self.endPointTween(stationState, psb, boardTime, duration, end, box, order, box3, index, lines, time)

                } else if (mark === 'upBoard') {
                    let rise;
                    if (stationState) {
                        let boardy = [psb.children[1].position.y, -(self.seedBoard.max.y + 8)];
                        boardy = this.changeValue(box, boardy)
                        rise = self.psbAnimateY(psb, boardy, boardTime * 1000 / 2 / self.speedTimes);
                    } else {
                        let ySpace = self.calculatePlace(end, 18.75, 32.7, 'y') - self.shelves.max.y;
                        let yEnd = [psb.children[1].position.y, ySpace];
                        yEnd = this.changeValue(box, yEnd)
                        rise = self.psbAnimateY(psb, yEnd, duration.set * 1000 / 2 / self.speedTimes);
                    }
                    self.addAtr(rise, 'upBoard', time, box)

                    rise.start();
                    rise.onComplete(() => {
                        box.position.copy(box.getWorldPosition());
                        box.scale.set(0.05, 0.05, 0.05);
                        box.status = 'scene';
                        self.$parent.scene.add(box);
                        let yUp = [psb.children[1].position.y, 0]; //回升初始机器人位置
                        yUp = this.changeValue(box, yUp)
                        let up = self.psbAnimateY(psb, yUp, duration.set * 1000 / 2 / self.speedTimes);
                        up.start();
                        // up = self.addIdentity(up, time, box, 'endBoard');
                        // up.flag = 'endBoard';
                        // up.box = box;
                        // up.time = time;
                        // up.index=self.index
                        self.addAtr(up, 'endBoard', time, box)

                        up.onComplete(() => {
                            psb.state = true;//完成运动
                            let material = new THREE.MeshLambertMaterial({
                                map: box3,
                            });
                            box.material = material;
                            // box.material.color.setRGB(1, 1, 1); //箱子恢复颜色
                            box.remove(lines);
                            if (yUp[0] !== yUp[1]) {
                                self.toRun(end, box, index, order, psb.name);
                            }
                        });
                    });
                } else if (mark === 'endBoard') {
                    let yUp = [psb.children[1].position.y, 0]; //回升初始机器人位置
                    yUp = this.changeValue(box, yUp)
                    let up = self.psbAnimateY(psb, yUp, duration.set * 1000 / 2 / self.speedTimes);
                    up.start();
                    self.addAtr(up, 'endBoard', time, box)

                    up.onComplete(() => {
                        psb.state = true;//完成运动
                        let material = new THREE.MeshLambertMaterial({
                            map: box3,
                        });
                        box.material = material;
                        // box.material.color.setRGB(1, 1, 1); //箱子恢复颜色
                        box.remove(lines);
                        if (yUp[0] !== yUp[1]) {
                            self.toRun(end, box, index, order, psb.name)
                        }
                    });
                }
            },
            // 终点运动判断
            endPointTween(stationState, psb, boardTime, duration, end, box, order, box3, index, lines, time) {
                let xEnd, rise;
                if (stationState) {
                    xEnd = [psb.position.x, this.calculateStation(end.x)];
                    let boardy = [psb.position.y, -(this.seedBoard.max.y + 8)]; //放箱到播种板动画
                    boardy = this.changeValue(box, boardy)
                    rise = this.psbAnimateY(psb, boardy, boardTime * 1000 / 2 / this.speedTimes);
                } else {
                    let yEndSpace = this.calculatePlace(end, 18.75, 32.7, 'y') - this.shelves.max.y;
                    let xEndSpace = this.calculatePlace(end, 18.75, 32.7, 'x');
                    xEnd = [psb.position.x, -xEndSpace];
                    let yEnd = [psb.position.y, yEndSpace];
                    yEnd = this.changeValue(box, yEnd)
                    rise = this.psbAnimateY(psb, yEnd, duration.set * 1000 / 2/ this.speedTimes);

                }
                let ahead = this.psbAnimateX(psb, xEnd, duration.move * 1000 / this.speedTimes);
                this.addAtr(ahead, 'endx', time, box)
                this.addAtr(rise, 'upBoard', time, box)
                //
                let pstTrack = this.scenes.getObjectByName(`shelve${this.index}-${end.x}`)?.modelType
                if (pstTrack) {  //endPoint  pst带psb且带箱子移动情况
                    ahead.start().onComplete(() => {
                        psb.state = true;
                        this.toRun(end, box, index, order, psb.name, true)
                    });
                    return;
                }
                ahead.chain(rise);
                ahead.start();
                rise.onComplete(() => {
                    box.position.copy(box.getWorldPosition());
                    box.scale.set(0.05, 0.05, 0.05);
                    box.status = 'scene'
                    this.$parent.scene.add(box);
                    let yUp = [psb.children[1].position.y, 0]; //回升初始机器人位置
                    yUp = this.changeValue(box, yUp)
                    let up = this.psbAnimateY(psb, yUp, duration.set * 1000 / 2 / this.speedTimes);
                    up.start();
                    this.addAtr(up, 'endBoard', time, box)
                    up.onComplete(() => {
                        psb.state = true;//完成运动
                        let material = new THREE.MeshLambertMaterial({
                            map: box3,
                        });
                        box.material = material;
                        // box.material.color.setRGB(1, 1, 1); //箱子恢复颜色
                        box.remove(lines);
                        if (yUp[0] !== yUp[1]) {
                            this.toRun(end, box, index, order, psb.name)
                        }
                    });
                });
            },
            findCloseNum(arr, obj) {
                // 导入机器人的Y相当于运动数据的Z
                let index = 0; // 保存最接近数值在数组中的索引
                let d_value = Number.MAX_VALUE; // 保存差值绝对值，默认为最大数值
                let floor = 0; //防止第二层的Y调用第一层的机器人
                let xArr = []
                let x_value = Number.MAX_VALUE; // 保存差值绝对值，默认为最大数值
                // num
                // this.sceneOption[0].stationNum
                if (obj.y > this.$parent.sceneOption[0].stationNum * 6) {
                    floor = this.$parent.sceneOption[0].stationNum * 6
                }
                for (let i = 0; i < arr.length; i++) {
                    let new_d_value = Math.abs(arr[i].y - obj.y); // 新差值
                    if (new_d_value <= d_value && arr[i].y > floor) { // 如果新差值绝对值小于等于旧差值绝对值，保存新差值绝对值和索引

                        if (new_d_value === d_value) { // 如果数组中两个数值跟目标数值差值一样 ,判断X轴更近的
                            xArr.push(arr[i], arr[index])
                        }
                        index = i;
                        d_value = new_d_value;
                    }
                }
                if (xArr.length) {
                    let xIndex = 0
                    for (let j = 0; j < xArr.length; j++) {
                        let new_x_value = Math.abs(xArr[j].x - obj.x); // 新差值
                        if (new_x_value <= x_value) {
                            xIndex = j;
                            x_value = new_x_value;
                        }
                    }
                    return xArr[xIndex]
                }
                return arr[index] // 返回最接近的数值
            },
            //待执行运动列表运动
            toRun(end, box, index, order, name, flag) {
                let self = this;
                cancelAnimationFrame(self.psbTimer[name])
                let x = this.checkShevles(end.x) //计算是货架还是工作站
                let currentIndex = self.nowRun.findIndex(e => e.robotCode = name)
                self.nowRun.splice(currentIndex, 1)
                if (x && !flag) {
                    let stationIndex = end.x //箱子放置的工作站坐标
                    let people = this.findCloseNum(this.$parent.pickList, {y: end.z, x: end.x})
                    self.$emit('actionAnimate', {box, index, stationIndex, people});
                    self.obstructBox[order].forEach(e => {
                        let texture = new THREE.TextureLoader().load(process.env.BASE_URL + 'mould/maps/box3.jpg');
                        var material = new THREE.MeshLambertMaterial({
                            map: texture,
                        });
                        e.material = material
                        // e.material.color.setRGB(1, 1, 1);
                    });
                } else {
                    this.checkWaitData()
                    let news = self.waitData;
                    for (let i in self.waitData) {
                        let check = this.checkState(news[i])
                        // 思路：通过判断是pst运动还是psb运动，先去检查要运动的pst、psb是否空闲，如果空闲就执行分别的运动函数
                        if (check) {
                            self.classifyAnimate(news[i])
                            self.waitData.splice(i, 1);
                            break
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
                if (params.containerCode === '') {
                    grab = 0;
                    set = 0;
                }
                if(this.scenes.getObjectByName(`shelve${this.index}-${params.xEnd}`)?.modelType){
                    set=0
                }
                let move = params.xEnd - params.xStart;  //计算psb移动时间
                move = ~~(Math.abs(move) * 0.245 + 7 + 0.5);
                let psbInitial = params.psb.position.x;
                let psbStart = (psbInitial - 32.7) / (this.padding + this.shelvesWidth); //货架间距18.75+货架宽度27.14
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
            // 动画分类
            classifyAnimate(news, flag, mark) {
                this.nowRun.push(news);
                if (news.robotType == 'PST' && !news.containerCode) {
                    let psb = news.psbCode ? this.scenes.getObjectByName(news.psbCode) : null
                    this.$parent.pstTween(psb, news)  //pst动画
                    return
                } else {
                    let psb = news.robotType == 'PST' ? this.scenes.getObjectByName(news.psbCode) : this.scenes.getObjectByName(news.robotCode)
                    this.clawBox(psb, news, news.startPoint, news.endPoint, news.startTime, news.index, flag, mark);
                }

            },
            //检测动画数据的pst或PST是否空闲
            checkState(item) {
                if (item.robotType == 'PST') {
                    if (item.psbCode) {
                        return (this.scenes.getObjectByName(item.robotCode).state && this.scenes.getObjectByName(item.psbCode).state)
                    }
                    return this.scenes.getObjectByName(item.robotCode).state
                } else {
                    return (this.scenes.getObjectByName(item.robotCode).state && this.scenes.getObjectByName(item.robotCode).parent.name == this.psbRobot.name)
                }
            },
            checkWaitData(){
                if(!this.waitData.length) {

                    this.$emit('animateFinish',true)}
            },
        },
        mounted() {
        },
        watch: {
            initState: {
                handler(news, old) {
                    if (news === 9 || old === 9) {
                        this.init()
                    }
                },
                immediate: true,
            },
            animateData: {
                handler(news, old) {
                    let self = this;

                    if (JSON.stringify(news) !== '{}') {
                        this.$parent.loading = false
                        for (let i in news) {
                            let check = this.checkState(news[i])
                            // 思路：通过判断是pst运动还是psb运动，先去检查要运动的pst、psb是否空闲，如果空闲就执行分别的运动函数
                            if (check) {
                                if (i && news[i].robotType == 'PST') {
                                    this.waitData.push(news[i]);
                                } else {
                                    self.classifyAnimate(news[i])
                                }

                            } else {
                                this.waitData.push(news[i]);
                            }

                        }
                    }

                    },
            },
            machineData(news, olds) {
                if (news.length) {
                    this.addPsb(news)
                }
            },
            box: {
                handler(news, old) {
                    if (news.length && this.shelves) {
                        this.addBox();
                        this.$set(this.$parent.loadState, 'addBox', true)
                    }
                },
                deep: true
            },
            pickFinish: {
                handler(val, old) {
                    this.checkWaitData()
                    for (let i in this.waitData) {
                        let news = this.waitData;
                        let check = this.checkState(news[i])
                        // 思路：通过判断是pst运动还是psb运动，先去检查要运动的pst、psb是否空闲，如果空闲就执行分别的运动函数
                        if (check) {
                            this.classifyAnimate(news[i])
                            this.waitData.splice(i, 1);
                            break
                        }

                    }
                },
            },

            playState() {
                let self = this;
                if (!self.playState && this.nowRun.length > 0) {  //暂停播放
                    self.runPoint = [];
                    let animate = TWEEN.getAll();
                    let animateClone = JSON.parse(JSON.stringify(animate));
                    for (let i in this.psbTimer) {
                        cancelAnimationFrame(this.psbTimer[i])
                    }
                    for (let i = animateClone.length - 1; i >= 0; i--) {
                        if (self.index == animate[i].index || !animate[i].index) {
                            let list = {
                                flag: animate[i].flag,
                                box: animate[i].box || '',
                                time: animate[i].time || '',
                                index: self.index
                            };
                            self.runPoint.push(list);
                            animate[i].stop();
                        }

                    }

                } else {
                    // self.nowRun 证在运动的动画 机器人
                    let nowRun = self.nowRun.filter((obj, index) => {
                        return !(this.scenes.getObjectByName(obj.robotCode).state);
                    });
                    if (nowRun.length) {
                        nowRun.forEach((e, index) => {
                            self.runPoint.forEach(data => {
                                if (data.time == e.startTime) {
                                    // 思路：通过判断是pst运动还是psb运动，先去检查要运动的pst、psb是否空闲，如果空闲就执行分别的运动函数
                                    self.classifyAnimate(e, 'amend', data.flag)
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
