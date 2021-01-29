<template>
    <div class='preview'
      v-loading="loading">
        <ProjectBar :title='getTitle()'/>
        <div class="container"
          @mousedown="robotClick"
          ref='station'>
            <ScenePreview :animateData='animateData[index]'
              :box='getBoxList(index)'
              :key='index'
              :options='item'
              :pickFinish='pickFinish[index]'
              :index="index"
              :machineData='machineList[index]'
              @actionAnimate='actionAnimate'
              :hasProjectData="hasProjectData"
              ref="scene"
              @animateFinish="animateFinish"
              v-for='(item,index) in stationOptions'/>
        </div>
        <transition-group name="slide-fade">
            <LeftSider
              :key="1"
              v-show="allShow"></LeftSider>
        </transition-group>
        <Center
          @play="play"
          :key="2"></Center>
        <div @click="changeDirection"
          :key="3"
          class="cameraIcon"
          :class="{'left': animationShow, 'right': animationNoShow}"
        >
            <div class="circle">
                <div class="rect">
                    <span>{{ directions[directionIndex] }}</span>
                </div>
            </div>
        </div>


        <div ref="animation"
          class="centerShare">
            <div @click="flodClick"
              class="flod">
                <span class="iconImg"><span :class="{'imgShow': imgShow}"></span></span>
                <span class="iconName">{{ itemText }}</span>
            </div>
            <span class="splitImg"><img alt=""
              src="~@/assets/scene/split.png"></span>
            <div @click="shareClick"
              class="share">
                    <span class="iconImg"><img alt=""
                      src="~@/assets/scene/shareBtn.png"></span>
                <span class="iconName">分享项目</span>
            </div>

        </div>
        <transition-group name="slide-fade">
            <RightSider :key="4"
              v-show="allShow"></RightSider>
        </transition-group>

        <div class="rightLine">
            <img alt=""
              src="@/assets/scene/rightDeoc.png">
        </div>
        <!--        <div class="main">-->
        <!--            <div class="flex">-->
        <!--                <img src="../../assets/scene/loading.gif"-->
        <!--                  alt="">-->
        <!--            </div>-->
        <!--        </div>-->
    </div>
</template>

<script>

    import OrbitControls from 'three-orbitcontrols';
    import Stats from 'stats-js';
    import ScenePreview from './components/ScenePreview';
    import ProjectBar from '@/components/ProjectTopBar';

    import {mapGetters, mapMutations} from 'vuex';
    import GLTFLoader from 'three-gltf-loader';
    import domtoimage from 'dom-to-image';//截图
    import RightSider from './components/rightSider';
    import LeftSider from './components/leftSider';
    import Center from './components/center';
    import {PointerLockControls} from '../../utils/PointerLockControls.js'

    let TWEEN = require('tween.js');

    export default {
        name: 'index',
        inject:['reload'],
        components: {ScenePreview, ProjectBar, LeftSider, Center, RightSider},
        computed: {
            ...mapGetters('index', {
                currentProjectData: 'getCurrentProjectData',
                isCreateWrapperShow: 'getIsCreateWrapperShow',
                projectList: 'getProjectList',
                sceneDetail: 'getSceneDetail',
                deployList: 'getDeployList',
                getProjectName: 'getProjectName',
                playState: 'getplayState',
                playedAnimateData: 'getPlayedAnimateData',
                getFirstPlay: 'getFirstPlay',
                getEnteredIndex: 'getEnteredIndex',
                getReqTimes: 'getReqTimes',
                currentStationNum: "getStationObj",
                firstPlay: 'getFirstPlay',//获取初始请求

            }),
            ...mapGetters('mould', {
                getMould: 'getMould',
                stationOptions: 'getStationOptions',
                pstTrack: 'getPstTrack'
            }),
            //获取指定单元的库存
            getBoxList() {
                return (num) => {
                    return this.endBox[num] || [];
                };
            },
        },
        data() {
            return {
                areaInfo: [],
                machineInfo: [],
                currentProjectUsedPercent: 0,
                areaBasicInfo: [
                    {name: '场地面积', unit: '㎡'},
                    {name: '作业面积', unit: '㎡'},
                    {name: '面积利用率', unit: '%'},
                ],
                machineBasicInfo: [
                    {name: '工作站', icon: 'huojia'},
                    {name: '货架', icon: 'bozhongqiang'},
                    {name: '轨道', icon: 'guidao'},
                    {name: '最大吞吐量', icon: 'zuidatuntuliang'},
                ],
                animateTimer: null,
                camera: null,
                scene: null,
                renderer: null,
                controls: null,
                lockControls: null,
                light: '',
                title: '',
                detailList: [{title: '移动速度', value: 2}, {title: '加速度', value: 1.5}, {
                    title: '减速度',
                    value: 1
                }, {title: '升降速度', value: 2}, {title: '抓放箱速度', value: 1.5}, {title: '衔接时间', value: 2}, {
                    title: '抓箱时间',
                    value: 1.5
                }, {title: '放箱时间', value: 2}],
                isIndex: 0,
                inventory: {used: 30, all: 100},
                stats: null,
                endBox: [], //转换后的箱子坐标
                animateData: [],
                clock: null,//计时器
                flag: true,
                sceneOption: [],
                floorNum: 1,
                directions: ['侧', '前', '左', '上'],
                directionIndex: 0, // 视角的方向
                allShow: true,      // 是否全部显示
                startStyle: {},     // 进度度样式
                animationShow: false,   // 栏目收起 左动画是否显示
                animationNoShow: false, // 栏目收起 右动画是否显示
                imgShow: false,     // 栏目收起 icon 是否切换
                mixer: [],//拣货机器人动画
                mixerIndex: [],//执行机器人下标
                mixerAction: [],//拣货动画实例调用
                pickFinish: [],//拣货完成
                pickActionList: [],//待执行拣货列表
                pickActionExecuteIndex: 0,
                loading: true,
                startAction: false,
                clickRobots: [],    // 机器人列表
                itemText: '栏目收起',
                clickState: false,  // 是否点击 psb
                nodeId: 0,     // psb 的 mesh 节点 id
                clickPosition: null,    // 点击的 psb 的世界坐标
                lastWorldPosition: null,    // 上一次的世界坐标
                boxWidth: 0,        // psb 盒子的 宽度
                directionState: false,  // psb 运行中的方向
                width: 0,
                addSucess: true,    // 地板、场景是否添加成功
                addLines: false,    // 线条是否添加成功
                whalehouseID: '',    // whalehouseID
                requestUrl: '',     // 请求url
                isRotate1: false,    // 分拣员是否旋转
                isRotate2: false,
                addRobotState: false,   // 是否可以加载机器人
                shelvesHeight: 0,   // 货架的高度
                material: null,
                loadState: {
                    addRobot: false,
                    addBox: false,
                },
                responses: [],  // 响应存放的数组
                resNum: 0,
                getResData: null,
                modelData: [],
                stations: [],
                hasProjectData: false,
                psbSite: -40.55243664515625,//psb相对坐标（pst移动需用）
                machineList: [],
                pstList: [],
                pickList: [],
                timer: null,
                animateFinishNum:0,

            };
        },
        beforeRouteEnter(to, form, next) {
            next(vm => {
                if (!sessionStorage.getItem('enteredIndex')) {
                    next('/index/scene')
                }
            })
        },
        methods: {
            ...mapMutations('index', {
                setCurrentProjectData: 'setCurrentProjectData',
                setProjectIDAndUrl: 'setProjectIDAndUrl',
                    setMoveTime: 'setMoveTime',
                    setTotalTime: 'setTotalTime',
            }),
            // 初始化场景
            initScene() {
                this.scene = new this.$THREE.Scene();
                // 0xcce0ff
                var textureLoader = new this.$THREE.TextureLoader();
                var texture = textureLoader.load(process.env.BASE_URL + 'mould/maps/bg.png');
                this.scene.background = texture;
                this.stats = new Stats();
                // this.stats.showPanel(0);
                this.clock = new this.$THREE.Clock();
            },
            // 初始化灯光
            initLight() {
                let light = new this.$THREE.PointLight(0x888888);
                light.position.set(0, 1200, 0);
                //告诉平行光需要开启阴影投射
                light.castShadow = false;
                var ambient = new this.$THREE.AmbientLight(0xffffff, 1); //AmbientLight,影响整个场景的光源
                ambient.position.set(0, 0, 0);
                this.scene.add(ambient);
                let directionalLight = new this.$THREE.DirectionalLight(0xffffff, 0.7);
                directionalLight.position.set(1000, 1000, 0);
                directionalLight.castShadow = true;
                let d = 300;
                directionalLight.shadow.camera = new this.$THREE.OrthographicCamera(
                    -d,
                    d,
                    d,
                    -d,
                    500,
                    1600
                );
                directionalLight.shadow.bias = 0.1;
                directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 1024;
                this.scene.add(directionalLight);
            },
            // 初始化渲染器
            initRenderer() {
                let scene = this.$refs.station;
                this.camera = new this.$THREE.PerspectiveCamera(75, scene.clientWidth / scene.clientHeight, 0.1, 1000000);
                let width = 8000;
                let height = 6000;
                if (this.areaInfo.length > 0) {
                    width = this.areaInfo[0].value.width * 100
                    height = this.areaInfo[0].value.heigth * 50
                }
                this.camera.position.set(width / 4 + 1800, 700, width / 2 + 1400);

                // 鸟瞰方向set(500, value/2, 0);
                // 正前方position.set(value/2, 300, 0);
                //左侧面position.set(0, 300, value/2);
                //有侧面position.set(0, 300, -value/2);
                this.renderer = new this.$THREE.WebGLRenderer({
                    antialias: false,
                    alpha: true,
                    logarithmicDepthBuffer: true
                });
                this.renderer.setPixelRatio(2);
                this.renderer.sortObjects = false
                this.renderer.setSize(scene.clientWidth, scene.clientHeight);
                this.renderer.setClearColor(0xeeeeee);
                this.renderer.shadowMap.enabled = true;
                this.renderer.domElement.id = 'scene'
                scene.appendChild(this.renderer.domElement);
            },
            // 添加机器人和推车
            addRobot(picklist) {
                // currentX, station, num, name
                const loader = new GLTFLoader();
                let self = this;
                for (let num in picklist) {
                    let floor = parseInt(picklist[num].y / (this.sceneOption[0].stationNum * 6)) //判断是第几层
                    let site = this.zConvertnum(picklist[num].y)
                    let station = this.scene.getObjectByName(`workStation${floor}-${site.num}`)
                    let currentX = this.scene.getObjectByName(`station${site.num}-${picklist[num].x}`)
                    loader.load(process.env.BASE_URL + 'mould/Robotaction/Robotaction.gltf', gltf => {
                        let mesh = gltf.scene;
                        let group = new self.$THREE.Group();
                        let x = 80
                        group.name = picklist[num].code;
                        station.add(group);
                        mesh.scale.set(0.05, 0.05, 0.05);
                        let robotSize = new self.$THREE.Box3();
                        robotSize.expandByObject(mesh);
                        //添加货车
                        var car1 = this.getMould.car;
                        let car = car1.clone();
                        car.scale.set(0.03, 0.05, 0.03);
                        car.name = `car`;
                        car.position.copy(mesh.getWorldPosition());
                        let height = robotSize.max.y - robotSize.min.y;//机器人高度
                        let order = parseInt(picklist[num].y / 6)
                        group.position.x = currentX.position.x + 70
                        group.position.y = self.stationOptions[order].stationSite.y+10; //中心点为机器人中间
                        group.position.z = -50
                        mesh.position.y += height / 2; //中心点为机器人中间
                        let size = robotSize.getSize();
                        var geometry = new self.$THREE.BoxGeometry(size.z / 4 - 50, height - 15, size.x);
                        var material = new self.$THREE.MeshBasicMaterial({
                            // color: 0x00ff00,
                            transparent: true,
                            opacity: 0,
                        });
                        var robotBox = new self.$THREE.Mesh(geometry, material);
                        robotBox.name = 'box';
                        robotBox.position.set(0, mesh.position.y, 0);
                        group.add(robotBox);
                        self.clickRobots.push(robotBox);
                        car.position.x -= 115;
                        car.position.z +=30 ;
                        group.add(mesh);
                        group.add(car);
                        group.rotateState = false
                        let mixer = new self.$THREE.AnimationMixer(gltf);
                        self.mixer[num] = new self.$THREE.AnimationMixer(mesh);
                        self.mixer[num].name = group.name
                        self.mixerAction[num] = self.mixer[num].clipAction(gltf.animations[0]);
                        self.mixerAction[num].name = group.name
                    });
                }
            },
            // 初始化轨迹球控件
            initControls() {
                let self = this;
                self.controls = new OrbitControls(self.camera, self.renderer.domElement);
                self.controls.enableDamping = true;
                // 动态阻尼系数
                self.controls.dampingFactor = 0.8;
                // 视角最小距离
                self.controls.minDistance = 100;
                // 视角最远距离
                let far = 4800;
                let value = self.currentProjectData.projectDetail.areaInfo[0].value;
                let unit = parseInt(self.machineInfo[0].value)
                let shelves = parseInt(self.machineInfo[1].value)
                if ((unit < 6) || (shelves < 6)) {
                    far = 2000
                } else if ((6 < unit && unit < 10) || (6 < shelves && shelves < 10)) {
                    far = 3000
                } else if ((10 <= unit) || (10 <= shelves)) {
                    far = 4800
                }
                if (far == 4800 && value >= 4800) {
                    far = value
                }
                self.controls.maxDistance = 8000;
                // 最大角度
                self.controls.maxPolarAngle = Math.PI / 2;
                self.controls.target = new this.$THREE.Vector3(50, 50, 0);

            },
            toChange(index) {
                this.isIndex = index;
            },
            toStock(index) {
                this.currentIndex = index;
            },
            actionAnimate(event) {
                let self = this;
                self.pickActionList.push(event);
            },
            animateFinish(num){
                this.animateFinishNum++
                if( this.animateFinishNum==this.animateData.length){
                    setTimeout( ()=> {
                        this.$store.commit('index/setplayState', false);
                        this.reload();
                    }, 1000)
                    this.$store.commit('index/setFirstPlay', true);
                    this.setMoveTime(0);
                    this.setTotalTime(0);
                }
            },
            findMixerAction(name) {
                for (let i = 0; i < this.mixerAction.length; i++) {
                    let m = this.mixerAction[i]
                    if (m.name == name) {
                        return i
                    }
                }
            },
            calculateIndex(index) {
                let wallIndex = 0;
                if (index == -4 || index == -3) {
                    wallIndex = 1;
                } else if (index == -2 || index == -1) {
                    wallIndex = 0;
                }
                return wallIndex
            },
            robotRotateAnimate(stationIndex, people, x, y, bool) {
                if (stationIndex == x) {
                    if (bool === false) {

                        let rotate = {
                            x: people.position.x,
                        }
                        let duration = 500;
                        let rotateAction = new TWEEN.Tween(rotate)
                        rotateAction.to({
                            x: people.position.x + 120,
                        }, duration, TWEEN.Easing.Sinusoidal.InOut);
                        rotateAction.onUpdate(function () {
                            people.position.x = this.x;
                        });
                        setTimeout(function () {
                            people.rotateY(Math.PI);
                        }, 250)
                        rotateAction.start()
                        bool = true;
                    }
                } else if (stationIndex == y) {
                    if (bool === true) {
                        let rotate = {
                            x: people.position.x,
                        }
                        let duration = 500;
                        let rotateAction = new TWEEN.Tween(rotate)
                        rotateAction.to({
                            x: people.position.x - 120,
                        }, duration, TWEEN.Easing.Sinusoidal.InOut);
                        rotateAction.onUpdate(function () {
                            people.position.x = this.x;
                        });
                        setTimeout(function () {
                            people.rotateY(-Math.PI);
                        }, 250)
                        rotateAction.start()
                        bool = false;
                    }
                }
            },
            getPeopleIndex(stationIndex) {
                let result = []
                let index = -1
                for (let i = 0; i < this.modelData[0].shelve.length; i++) {
                    let model = this.modelData[0].shelve[i]
                    if (model.name === 'station') {
                        result.push(model)
                    }
                }
                for (let i = 0; i < result.length; i++) {
                    let re = result[i]
                    if (re.x == -stationIndex) {
                        index = i
                        break
                    }
                }
                return index
            },
            pickAnimate(event) {
                let self = this;
                let stationIndex = event.stationIndex
                let people = this.scene.getObjectByName(event.people.code)
                if (stationIndex < event.people.x) {
                    people.rotateY(Math.PI)
                    people.rotateState = true
                } else {
                    if (people.rotateState) {
                        people.rotateY(Math.PI)
                        people.rotateState = false
                    }
                }
                let zWidth = event.box.getWorldPosition().z - people.getWorldPosition().z
                let index = self.findMixerAction(event.people.code)
                self.mixerIndex.push(index);
                if (!zWidth) {
                    runPick()
                    return
                }
                let zStart = [people.position.z, people.position.z + zWidth];
                let ahead = self.psbAnimateX(people, zStart, 2000);
                ahead.start();
                ahead.onComplete(() => {
                    runPick()
                });

                function runPick() {
                    self.mixerAction[index].play();
                    self.mixer[index].addEventListener('loop', e => {
                        self.mixerAction[index].stop();
                        self.$set(self.pickFinish, event.index, event);
                        self.pickActionList.shift();
                        self.mixerIndex.splice(index, 1);
                    });
                }
            },
            // 拣货机器人动画(X方向)
            psbAnimateX(group, params, duration) {
                let rota = ({
                    z: params[0]
                });
                let xMotion = new TWEEN.Tween(rota);
                xMotion.to({
                    z: params[1]
                }, duration, TWEEN.Easing.Sinusoidal.InOut);
                xMotion.onUpdate(function () {
                    group.position.z = this.z;
                });
                return xMotion;
            },
            // 初始化
            init() {
                let self = this;
                self.initScene();
                self.initLight();
            },
            // 设置 模型 透明度
            setMeshOpacity(opacity) {
                var material = new this.$THREE.MeshBasicMaterial({
                    transparent: true,
                    opacity: opacity,
                    color: 0x1c1e1d,
                });
                for (let i = 0; i < parseInt(this.sceneOption[0].stationNum); i++) {
                    for (let j = 0; j < parseInt(this.sceneOption[0].shelvesUnitNum) - 1; j++) {
                        let shelve = this.scene.getObjectByName(`shelves${i}-${j}`)
                        if (shelve !== undefined) {
                            shelve.traverse((obj) => {
                                if (obj.isMesh) {
                                    obj.material = material
                                }
                            })
                        }
                    }

                }
            },
            animate() {
                let self = this;
                let time = self.clock.getDelta();
                self.mixerIndex.map((e, index) => {
                    self.mixer[e] && self.mixer[e].update(time);
                });
                // 线条移动
                this.linesMove()
                // psb 机器人的第一视角(跟随 psb 移动)
                this.psbMove();
                self.renderer.render(self.scene, self.camera);
                this.animateTimer = requestAnimationFrame(self.animate);
            },
            // 线条移动
            linesMove() {
                if (this.addLines) {
                    let lines = this.scene.getObjectByName('lines')
                    // console.log('lines', lines, lines.children)
                    lines.children.forEach((obj, i) => {
                        obj.position.y += 500;
                        if (obj.position.y > 50000) {
                            obj.position.y = -1000 * Math.random();
                        }
                    });
                }
            },
            // psb 机器人的第一视角(跟随 psb 移动)
            psbMove() {
                if (this.playState && this.clickState) {
                    let node = this.scene.getObjectById(this.nodeId)
                    let worldPosition = new this.$THREE.Vector3();
                    node.getWorldPosition(worldPosition);
                    if (worldPosition.x != this.clickPosition.x) {
                        if (worldPosition.x > this.lastWorldPosition.x) {
                            this.camera.position.set(worldPosition.x + 95, worldPosition.y, worldPosition.z);
                            this.camera.lookAt(worldPosition.x + 4000, worldPosition.y, worldPosition.z);
                            this.directionState = true;
                        } else if (worldPosition.x < this.lastWorldPosition.x) {
                            this.camera.position.set(worldPosition.x + 60, worldPosition.y, worldPosition.z);
                            this.camera.lookAt(worldPosition.x - 4000, worldPosition.y, worldPosition.z);
                            this.directionState = false;
                        } else if (worldPosition.x === this.lastWorldPosition.x) {
                            if (this.directionState) {
                                this.camera.position.set(worldPosition.x + 95, worldPosition.y, worldPosition.z);
                                this.camera.lookAt(worldPosition.x + 4000, worldPosition.y, worldPosition.z);
                            } else {
                                this.camera.position.set(worldPosition.x + 60, worldPosition.y, worldPosition.z);
                                this.camera.lookAt(worldPosition.x - 4000, worldPosition.y, worldPosition.z);
                            }
                        }
                        this.lastWorldPosition = worldPosition;
                    }
                }
            },
            handleData(animateDatas) {
                if (this.getFirstPlay) {
                    let data = animateDatas.flat();
                    for (let i in data) {
                        if (data[i].robotType == 'PST') continue;
                        let end = data[i].endPoint;
                        let start = data[i].startPoint;
                        let params = {//计算运动时间对象
                            yEnd: end.y,
                            yStart: start.y,
                            xEnd: end.x,
                            xStart: start.x,
                            containerCode: data[i].containerCode,
                            index:data[i].index   //动画数据index
                        };
                        let value = this.calculateTime(params);
                        this.$store.commit('index/setProgress', {attribute: 'totalTime', value})
                    }
                }
            },
            // 处理动画数据
            handleAnimateData(data) {
                let result = data;
                result.forEach((item) => {
                    item.forEach(list => {
                        list.uuNm=this.uuid()
                    })

                })
                return result
            },
            getStockData(date) {
                if (this.getResData === null) {
                    this.$get('dCoreData', {project_id: sessionStorage.getItem('projectId')}).then(res => {
                        if (res.code == '200') {
                            let list = this.currentProjectData.projectDetail.sceneOption;
                            let firstStationNum = parseInt(list[0].stationNum);
                            let params = {
                                warehouseID: this.whalehouseID,
                                startTime: date.s1,
                                endTime: date.s2,
                                firstStationNum,
                                id: sessionStorage.getItem('projectId'),
                                url_param: this.requestUrl,
                                sort: 1,
                            };
                            this.$get('gRobotData', params).then(res => {
                                if (res.code == '200' && res.data.length) {
                                    this.getResData = res.data
                                    this.handleData(res.data);
                                    this.animateData = this.handleAnimateData(res.data);
                                    // this.$set(this,'animateData',res.data)
                                    // this.animateData =res.data;

                                    this.$store.commit('index/setFirstPlay', false);
                                } else {
                                    this.debounce(5000)()
                                }
                            })

                        } else {
                            this.debounce(5000)()
                        }
                    })
                } else {
                    this.handleData(this.getResData);
                    this.animateData=this.handleAnimateData(this.getResData)
                }
            },
            // 运动坐标转换 animateConvert(name, list) { play(name, list) {
            play(date, hasData) {
                let name = this.currentProjectData.pro_name;
                console.log('name *******', name, hasData);
                let self = this;
                let list = this.currentProjectData.projectDetail.sceneOption;
                this.log('list', list)
                let projectId = list[1] && list[1].id || '';
                let mockData = [[
                        {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "PS鲸仓拣选",
                        "containerCode": "",
                        "startPoint": {"x": 7, "y": 1, "z": 1},
                        "endPoint": {"x": 5, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:38:39",
                        "endTime": "2021-01-11 16:38:41",
                        "outOrderID": [],
                        "moveActionID": "394",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "PS鲸仓拣选",
                        "containerCode": "CD0901",
                        "startPoint": {"x": 5, "y": 1, "z": 1},
                        "endPoint": {"x": 2, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:38:43",
                        "endTime": "2021-01-11 16:38:45",
                        "outOrderID": [{"orderNo": "CK20210111000020", "item": [{"skuId": "110220046", "qty": 4}]}],
                        "moveActionID": "396",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": null,
                        "index": 0
                    }
                    , {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "to_position",
                        "containerCode": "",
                        "startPoint": {"x": 2, "y": 1, "z": 1},
                        "endPoint": {"x": 2, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:39:25",
                        "endTime": "2021-01-11 16:39:27",
                        "outOrderID": null,
                        "moveActionID": "398",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "to_position",
                        "containerCode": "CD0901",
                        "startPoint": {"x": 2, "y": 1, "z": 1},
                        "endPoint": {"x": 5, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:39:29",
                        "endTime": "2021-01-11 16:39:32",
                        "outOrderID": null,
                        "moveActionID": "400",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "PS鲸仓拣选",
                        "containerCode": "",
                        "startPoint": {"x": 5, "y": 1, "z": 1},
                        "endPoint": {"x": 7, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:39:35",
                        "endTime": "2021-01-11 16:39:37",
                        "outOrderID": [],
                        "moveActionID": "402",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "PS鲸仓拣选",
                        "containerCode": "CD0903",
                        "startPoint": {"x": 7, "y": 1, "z": 1},
                        "endPoint": {"x": 2, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:39:40",
                        "endTime": "2021-01-11 16:39:42",
                        "outOrderID": [{"orderNo": "CK20210111000020", "item": [{"skuId": "110220051", "qty": 4}]}],
                        "moveActionID": "404",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "to_position",
                        "containerCode": "",
                        "startPoint": {"x": 2, "y": 1, "z": 1},
                        "endPoint": {"x": 2, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:40:18",
                        "endTime": "2021-01-11 16:40:20",
                        "outOrderID": null,
                        "moveActionID": "406",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "to_position",
                        "containerCode": "CD0903",
                        "startPoint": {"x": 2, "y": 1, "z": 1},
                        "endPoint": {"x": 7, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:40:22",
                        "endTime": "2021-01-11 16:40:24",
                        "outOrderID": null,
                        "moveActionID": "408",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": null,
                        "index": 0
                    },
                    {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "PS鲸仓拣选",
                        "containerCode": "",
                        "startPoint": {"x": 7, "y": 1, "z": 1},
                        "endPoint": {"x": 18, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:49:54",
                        "endTime": "2021-01-11 16:49:56",
                        "outOrderID": [],
                        "moveActionID": "410",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "2jc0083",
                        "robotType": "PST",
                        "taskType": "to_position",
                        "containerCode": "",
                        "startPoint": {"x": 20, "y": 1, "z": 1},
                        "endPoint": {"x": 20, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:49:56",
                        "endTime": "2021-01-11 16:49:59",
                        "outOrderID": null,
                        "moveActionID": "411",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": "3jc0002",
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "PS鲸仓拣选",
                        "containerCode": "",
                        "startPoint": {"x": 18, "y": 1, "z": 1},
                        "endPoint": {"x": 20, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:49:59",
                        "endTime": "2021-01-11 16:50:01",
                        "outOrderID": [],
                        "moveActionID": "412",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": null,
                        "index": 0
                    }
                    , {
                        "robotCode": "2jc0083",
                        "robotType": "PST",
                        "taskType": "to_position",
                        "containerCode": "",
                        "startPoint": {"x": 20, "y": 1, "z": 1},
                        "endPoint": {"x": 20, "y": 1, "z": 2},
                        "startTime": "2021-01-11 16:50:03",
                        "endTime": "2021-01-11 16:50:05",
                        "outOrderID": null,
                        "moveActionID": "414",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": "3jc0002",
                        "index": 0
                    }
                    ,
                    {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "PS鲸仓拣选",
                        "containerCode": "",
                        "startPoint": {"x": 20, "y": 1, "z": 2},
                        "endPoint": {"x": 2, "y": 1, "z": 2},
                        "startTime": "2021-01-11 16:50:07",
                        "endTime": "2021-01-11 16:50:09",
                        "outOrderID": [],
                        "moveActionID": "416",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "PS鲸仓拣选",
                        "containerCode": "CD0902",
                        "startPoint": {"x": 2, "y": 1, "z": 2},
                        "endPoint": {"x": 1, "y": 1, "z": 2},
                        "startTime": "2021-01-11 16:50:11",
                        "endTime": "2021-01-11 16:50:13",
                        "outOrderID": [{"orderNo": "CK20210111000020", "item": [{"skuId": "110220047", "qty": 4}]}],
                        "moveActionID": "418",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "to_position",
                        "containerCode": "",
                        "startPoint": {"x": 1, "y": 1, "z": 2},
                        "endPoint": {"x": 1, "y": 1, "z": 2},
                        "startTime": "2021-01-11 16:51:11",
                        "endTime": "2021-01-11 16:51:13",
                        "outOrderID": null,
                        "moveActionID": "420",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "to_position",
                        "containerCode": "CD0902",
                        "startPoint": {"x": 1, "y": 1, "z": 2},
                        "endPoint": {"x": 18, "y": 1, "z": 2},
                        "startTime": "2021-01-11 16:51:15",
                        "endTime": "2021-01-11 16:51:17",
                        "outOrderID": null,
                        "moveActionID": "422",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "2jc0083",
                        "robotType": "PST",
                        "taskType": "to_position",
                        "containerCode": "",
                        "startPoint": {"x": 20, "y": 1, "z": 2},
                        "endPoint": {"x": 20, "y": 1, "z": 2},
                        "startTime": "2021-01-11 16:51:17",
                        "endTime": "2021-01-11 16:51:20",
                        "outOrderID": null,
                        "moveActionID": "423",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": "",
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "to_position",
                        "containerCode": "CD0902",
                        "startPoint": {"x": 18, "y": 1, "z": 2},
                        "endPoint": {"x": 20, "y": 1, "z": 2},
                        "startTime": "2021-01-11 16:51:20",
                        "endTime": "2021-01-11 16:51:22",
                        "outOrderID": null,
                        "moveActionID": "424",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "2jc0083",
                        "robotType": "PST",
                        "taskType": "to_position",
                        "containerCode": "CD0902",
                        "startPoint": {"x": 20, "y": 1, "z": 2},
                        "endPoint": {"x": 20, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:51:24",
                        "endTime": "2021-01-11 16:51:26",
                        "outOrderID": null,
                        "moveActionID": "426",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": "3jc0002",
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "to_position",
                        "containerCode": "CD0902",
                        "startPoint": {"x": 20, "y": 1, "z": 1},
                        "endPoint": {"x": 8, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:51:28",
                        "endTime": "2021-01-11 16:51:30",
                        "outOrderID": null,
                        "moveActionID": "428",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS02",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "PS鲸仓拣选",
                        "containerCode": "",
                        "startPoint": {"x": 7, "y": 1, "z": 1},
                        "endPoint": {"x": 5, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:38:39",
                        "endTime": "2021-01-11 16:38:41",
                        "outOrderID": [],
                        "moveActionID": "394",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "PS鲸仓拣选",
                        "containerCode": "CD0901",
                        "startPoint": {"x": 5, "y": 1, "z": 1},
                        "endPoint": {"x": 2, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:38:43",
                        "endTime": "2021-01-11 16:38:45",
                        "outOrderID": [{"orderNo": "CK20210111000020", "item": [{"skuId": "110220046", "qty": 4}]}],
                        "moveActionID": "396",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "to_position",
                        "containerCode": "",
                        "startPoint": {"x": 2, "y": 1, "z": 1},
                        "endPoint": {"x": 2, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:39:25",
                        "endTime": "2021-01-11 16:39:27",
                        "outOrderID": null,
                        "moveActionID": "398",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "to_position",
                        "containerCode": "CD0901",
                        "startPoint": {"x": 2, "y": 1, "z": 1},
                        "endPoint": {"x": 5, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:39:29",
                        "endTime": "2021-01-11 16:39:32",
                        "outOrderID": null,
                        "moveActionID": "400",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "PS鲸仓拣选",
                        "containerCode": "",
                        "startPoint": {"x": 5, "y": 1, "z": 1},
                        "endPoint": {"x": 7, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:39:35",
                        "endTime": "2021-01-11 16:39:37",
                        "outOrderID": [],
                        "moveActionID": "402",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "PS鲸仓拣选",
                        "containerCode": "CD0903",
                        "startPoint": {"x": 7, "y": 1, "z": 1},
                        "endPoint": {"x": 2, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:39:40",
                        "endTime": "2021-01-11 16:39:42",
                        "outOrderID": [{"orderNo": "CK20210111000020", "item": [{"skuId": "110220051", "qty": 4}]}],
                        "moveActionID": "404",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "to_position",
                        "containerCode": "",
                        "startPoint": {"x": 2, "y": 1, "z": 1},
                        "endPoint": {"x": 2, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:40:18",
                        "endTime": "2021-01-11 16:40:20",
                        "outOrderID": null,
                        "moveActionID": "406",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "to_position",
                        "containerCode": "CD0903",
                        "startPoint": {"x": 2, "y": 1, "z": 1},
                        "endPoint": {"x": 7, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:40:22",
                        "endTime": "2021-01-11 16:40:24",
                        "outOrderID": null,
                        "moveActionID": "408",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "PS鲸仓拣选",
                        "containerCode": "",
                        "startPoint": {"x": 7, "y": 1, "z": 1},
                        "endPoint": {"x": 18, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:49:54",
                        "endTime": "2021-01-11 16:49:56",
                        "outOrderID": [],
                        "moveActionID": "410",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "2jc0083",
                        "robotType": "PST",
                        "taskType": "to_position",
                        "containerCode": "",
                        "startPoint": {"x": 20, "y": 1, "z": 1},
                        "endPoint": {"x": 20, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:49:56",
                        "endTime": "2021-01-11 16:49:59",
                        "outOrderID": null,
                        "moveActionID": "411",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": "3jc0002",
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "PS鲸仓拣选",
                        "containerCode": "",
                        "startPoint": {"x": 18, "y": 1, "z": 1},
                        "endPoint": {"x": 20, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:49:59",
                        "endTime": "2021-01-11 16:50:01",
                        "outOrderID": [],
                        "moveActionID": "412",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": null,
                        "index": 0
                    }
                    , {
                        "robotCode": "2jc0083",
                        "robotType": "PST",
                        "taskType": "to_position",
                        "containerCode": "",
                        "startPoint": {"x": 20, "y": 1, "z": 1},
                        "endPoint": {"x": 20, "y": 1, "z": 2},
                        "startTime": "2021-01-11 16:50:03",
                        "endTime": "2021-01-11 16:50:05",
                        "outOrderID": null,
                        "moveActionID": "414",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": "3jc0002",
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "PS鲸仓拣选",
                        "containerCode": "",
                        "startPoint": {"x": 20, "y": 1, "z": 2},
                        "endPoint": {"x": 2, "y": 1, "z": 2},
                        "startTime": "2021-01-11 16:50:07",
                        "endTime": "2021-01-11 16:50:09",
                        "outOrderID": [],
                        "moveActionID": "416",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "PS鲸仓拣选",
                        "containerCode": "CD0902",
                        "startPoint": {"x": 2, "y": 1, "z": 2},
                        "endPoint": {"x": 1, "y": 1, "z": 2},
                        "startTime": "2021-01-11 16:50:11",
                        "endTime": "2021-01-11 16:50:13",
                        "outOrderID": [{"orderNo": "CK20210111000020", "item": [{"skuId": "110220047", "qty": 4}]}],
                        "moveActionID": "418",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "to_position",
                        "containerCode": "",
                        "startPoint": {"x": 1, "y": 1, "z": 2},
                        "endPoint": {"x": 1, "y": 1, "z": 2},
                        "startTime": "2021-01-11 16:51:11",
                        "endTime": "2021-01-11 16:51:13",
                        "outOrderID": null,
                        "moveActionID": "420",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "to_position",
                        "containerCode": "CD0902",
                        "startPoint": {"x": 1, "y": 1, "z": 2},
                        "endPoint": {"x": 18, "y": 1, "z": 2},
                        "startTime": "2021-01-11 16:51:15",
                        "endTime": "2021-01-11 16:51:17",
                        "outOrderID": null,
                        "moveActionID": "422",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "2jc0083",
                        "robotType": "PST",
                        "taskType": "to_position",
                        "containerCode": "",
                        "startPoint": {"x": 20, "y": 1, "z": 2},
                        "endPoint": {"x": 20, "y": 1, "z": 2},
                        "startTime": "2021-01-11 16:51:17",
                        "endTime": "2021-01-11 16:51:20",
                        "outOrderID": null,
                        "moveActionID": "423",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": "",
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "to_position",
                        "containerCode": "CD0902",
                        "startPoint": {"x": 18, "y": 1, "z": 2},
                        "endPoint": {"x": 20, "y": 1, "z": 2},
                        "startTime": "2021-01-11 16:51:20",
                        "endTime": "2021-01-11 16:51:22",
                        "outOrderID": null,
                        "moveActionID": "424",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": null,
                        "index": 0
                    }, {
                        "robotCode": "2jc0083",
                        "robotType": "PST",
                        "taskType": "to_position",
                        "containerCode": "CD0902",
                        "startPoint": {"x": 20, "y": 1, "z": 2},
                        "endPoint": {"x": 20, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:51:24",
                        "endTime": "2021-01-11 16:51:26",
                        "outOrderID": null,
                        "moveActionID": "426",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": "3jc0002",
                        "index": 0
                    }, {
                        "robotCode": "3jc0002",
                        "robotType": "PSB",
                        "taskType": "to_position",
                        "containerCode": "CD0902",
                        "startPoint": {"x": 20, "y": 1, "z": 1},
                        "endPoint": {"x": 8, "y": 1, "z": 1},
                        "startTime": "2021-01-11 16:51:28",
                        "endTime": "2021-01-11 16:51:30",
                        "outOrderID": null,
                        "moveActionID": "428",
                        "letChangeTrack": "0.0",
                        "letDownFlag": "1.0",
                        "regionID": "P-PMS01",
                        "psbCode": null,
                        "index": 0
                    }
                ]]
                // self.animateData = mockData //模拟数据
                // if(  self.animateData.length>0) return
                // self.handleData(mockData);
                // self.animateData = mockData //模拟数据
                // self.$store.commit('index/setFirstPlay', false);
                if (hasData) {
                    self.handleData(this.playedAnimateData);
                    self.animateData = this.handleAnimateData(this.playedAnimateData);  //真实数据
                    // this.$set(this,'animateData',this.playedAnimateData)

                    // self.handleData(mockData);
                    // self.animateData = mockData //模拟数据
                    self.$store.commit('index/setFirstPlay', false);

                } else {
                    this.loading =self.firstPlay
                    this.animateData = []
                    this.getStockData(date)
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
                if(this.scene.getObjectByName(`shelve${params.index}-${params.xEnd}`)?.modelType){
                    set=0
                }
                // let move= Math.round((params.xEnd-params.xStart)*0.245+7 ) //移动时间
                let move = params.xEnd - params.xStart;  //计算psb移动时间
                move = params.xEnd - params.xStart==0?0:~~(Math.abs(move) * 0.245 + 7 + 0.5);
                console.log('params.xEnd',params.xStart,params.xEnd, 'grab',grab , 'move',move , 'set',set)
                //
                return grab + move + set
            },
            coordinateConvert(list) {
                // let length = parseInt(len);
                let self = this;
                let firstStationNum = parseInt(list[0].stationNum);
                let id = list[1] && list[1].id || '';
                /*	真实坐标-->右手坐标系
                * X-->Z  //向右
                * Y-->X //往后
                * Z-->Y //往上
                * */
                let boxList;
                let params = {
                    project_id: Number(this.currentProjectData.id),
                    id,
                    firstStationNum
                };
                self.$get('gConvertStock', params).then(res => {
                    if (res.code == '200' && res.data) {
                        self.endBox = res.data;
                    }
                });
            },
            // 创建第二层地板 self 是 this  floorMaterial 是材质信息
            createFloorF2(self, floorMaterial, width, height, position) {
                let unitF1 = parseInt(self.sceneOption[0].stationNum);
                let unitF2 = parseInt(self.sceneOption[1].stationNum);
                let shelvesF2 = self.sceneOption[1].shelvesUnitNum;
                let widthF2 = unitF2 * 305 + 1000;
                if (unitF1 > unitF2) {
                    widthF2 = unitF1 * 305 + 1000;
                }
                let heightF2 = shelvesF2 * 70 + 1000;
                let floorGeometry1 = new self.$THREE.BoxBufferGeometry(heightF2 - 150, widthF2, 1);
                let floor1 = new self.$THREE.Mesh(floorGeometry1, floorMaterial);
                floor1.rotateX(Math.PI / 2);
                floor1.position.y = 185;
                floor1.position.x = position.x - (heightF2 - 150) / 2;
                floor1.position.z = position.z - widthF2 / 2;
                self.scene.add(floor1);
            },

            createGround() {
                let loader = new this.$THREE.TextureLoader();
                let self = this;
                // 单位 m 转换 mm 乘以缩放倍数
                // 加载贴图
                let groundGeo = new this.$THREE.PlaneBufferGeometry(100000, 100000);
                let groundMat = new this.$THREE.MeshLambertMaterial({
                    color: 0x000000,
                    // opacity: 0.5,
                    // transparent: true,
                });
                groundMat.color.setHSL(0.55, 0.5, 0.03);
                let ground = new this.$THREE.Mesh(groundGeo, groundMat);
                ground.position.y = -33;
                ground.rotation.x = -Math.PI / 2;
                ground.receiveShadow = true;
                self.scene.add(ground);
                var gridHelper = new this.$THREE.GridHelper(100000, 100, 0x13131c, 0x414145);
                self.scene.add(gridHelper);

            },
            //地板
            createFloor(width, height) {
                let loader = new this.$THREE.TextureLoader();
                let self = this;
                // 单位 m 转换 mm 乘以缩放倍数
                if (width < 20) {
                    width = 30
                }
                if (height < 20) {
                    height = 30
                }
                width = width * 2000 * 0.05;
                height = height * 1800 * 0.05;
                // 加载贴图
                loader.load(process.env.BASE_URL + 'mould/maps/floor.jpg', function (texture) {
                    texture.wrapS = texture.wrapT = self.$THREE.RepeatWrapping;
                    texture.repeat.set(10, 10);
                    let floorGeometry = new self.$THREE.BoxBufferGeometry(height, width, 1);
                    let floorMaterial = new self.$THREE.MeshBasicMaterial({
                        map: texture,
                    });
                    let floor = new self.$THREE.Mesh(floorGeometry, floorMaterial);
                    floor.rotateX(Math.PI / 2);
                    floor.name = 'ground';
                    // let stationNum = self.sceneOption[0].stationNum - 1
                    // let shelvesNum = self.sceneOption[0].shelvesUnitNum
                    let model = self.$refs.scene[0].getModelObj(0)
                    let firstName = model.firstObj.name == 'pickWay' ? 'shelve' : model.firstObj.name
                    let lastName = model.lastObj.name
                    let firstX = model.firstObj.x
                    let lastX = model.lastObj.x + model.lastObj.num - 1
                    let first = self.$refs.scene[0].getBox(`${firstName}0-${firstX}`)
                    let last = self.$refs.scene[0].getBox(`${lastName}0-${lastX}`)
                    let stationX = first.max.x - last.min.x
                    // 500 是距离地板边缘的宽度
                    floor.position.x = first.max.x - height / 2 + 500

                    floor.position.z = first.max.z - width / 2 + 500
                    // var axesHelper = new self.$THREE.AxesHelper( 5000 );
                    // floor.add( axesHelper );
                    self.scene.add(floor);
                    // 第二层的地板
                    if (self.floorNum == 2) {
                        self.createFloorF2(self, floorMaterial, width, height, first.max);
                    }
                });
            },
            // 底部工作时间和发货量切换的事件绑定
            changeStyle(index) {
                if (index == 1) {
                    if (this.processTitles[0] == '发货量') {
                        this.processTitles = ['作业时间', '发货量'];
                    } else {
                        this.processTitles = ['发货量', '作业时间'];
                    }
                }
                if (this.processTitles[0] == '发货量') {
                    this.processNames = [{
                        title: '已发货量',
                        num: '10000件',
                    }, {
                        title: '未完成',
                        num: '10000件',
                    },];
                    this.playTimesShow = false;
                } else {
                    this.processNames = [{
                        title: '作业所需时长',
                        num: '00:01:00',
                    }, {
                        title: '剩余时长',
                        num: '00:08:23',
                    },];
                    this.playTimesShow = true;
                }
            },
            // 视角转换的点击事件
            changeDirection() {
                this.directionIndex = (this.directionIndex + 1) % this.directions.length;
                // 鸟瞰方向set(500, value/2, 0);
                // 正前方position.set(value/2, 300, 0);
                //左侧面position.set(0, 300, value/2);
                //有侧面position.set(0, 300, -value/2);
                let i = this.directionIndex;
                let width = this.areaInfo[0].value.width * 100 || 4000;
                let height = this.areaInfo[0].value.height * 50 || 4000;
                if (i == 0) {
                    this.camera.position.set(width / 4 + 1800, 700, width / 2 + 1400);
                } else if (i == 1) {
                    this.camera.position.set(width / 2 + 2500, 600, 0);
                } else if (i == 2) {
                    this.camera.position.set(100, 1000, width / 2 + 1800);
                } else if (i == 3) {
                    this.camera.position.set(width / 2 + 300, width / 2 + 300, 0);
                }
                this.camera.lookAt(0, 0, 0);
            }
            ,
            // 播放速度切换的点击事件
            changePlayTimes(index) {
                this.currentPlayIndex = index;
            }
            ,
            // 栏目收起点击事件
            flodClick() {
                this.allShow = !this.allShow;
                if (this.allShow) {
                    this.animationNoShow = true;
                    this.animationShow = false;
                    this.imgShow = true;
                } else {
                    this.animationShow = true;
                    this.animationNoShow = false;
                    this.imgShow = false;
                }
            },
            // 分享项目点击事件
            shareClick() {
                // console.log('分享项目');
            },
            transformEvent(event) {

            },
            // 日期选择器点击事件
            showDateSelected(event) {
                let date = document.querySelector('.dateSelected');
                date.click();
            },
            // 获取标题
            getTitle() {
                if (sessionStorage.getItem('fromEdit')) {
                    return this.currentProjectData.pro_name || this.currentProjectData.name
                } else {
                    return this.currentProjectData && this.currentProjectData.pro_name || this.getProjectName;
                }
            },

            // 机器人、psb点击事件(点击切换第一人称视角)
            robotClick(event) {
                event.preventDefault();
                let station = this.$refs.station
                let getBoundingClientRect = station.getBoundingClientRect();
                // 屏幕坐标转标准设备坐标
                let x = ((event.clientX - getBoundingClientRect.left) / station.offsetWidth) * 2 - 1;// 标准设备横坐标
                let y = -((event.clientY - getBoundingClientRect.top) / station.offsetHeight) * 2 + 1;// 标准设备纵坐标
                let standardVector = new this.$THREE.Vector3(x, y, 1);// 标准设备坐标
                // 标准设备坐标转世界坐标
                let worldVector = standardVector.unproject(this.camera);
                // 射线投射方向单位向量(worldVector坐标减相机位置坐标)
                let ray = worldVector.sub(this.camera.position).normalize();
                // 创建射线投射器对象
                let rayCaster = new this.$THREE.Raycaster(this.camera.position, ray);
                // 返回射线选中的对象 第二个参数如果不填 默认是false
                let intersects = rayCaster.intersectObjects(this.clickRobots, true);
                if (intersects.length > 0) {
                    this.lockControls.lock();
                    let obj = intersects[0].object;
                    // 声明一个三维向量用来保存世界坐标
                    let worldPosition = new this.$THREE.Vector3();
                    // 执行getWorldPosition方法把模型的世界坐标保存到参数worldPosition中
                    obj.getWorldPosition(worldPosition);
                    if (obj.name.indexOf('box') !== -1) {
                        this.camera.position.set(worldPosition.x, worldPosition.y + 50, worldPosition.z);
                        this.camera.lookAt(worldPosition.x - 3000, worldPosition.y, worldPosition.z);
                    } else if (obj.name.indexOf('Box') !== -1) {
                        let box = new this.$THREE.Box3();
                        box.expandByObject(obj);
                        this.boxWidth = box.max.x - box.min.x
                        let point = intersects[0].point
                        let pointBoxWidth = point.x - worldPosition.x
                        this.width = pointBoxWidth - this.boxWidth;
                        this.clickState = true;
                        this.nodeId = obj.id;
                        this.clickPosition = worldPosition;
                        this.lastWorldPosition = worldPosition;
                        this.camera.position.set(worldPosition.x + this.width, worldPosition.y + 5, worldPosition.z);
                        this.camera.lookAt(worldPosition.x - 3000, worldPosition.y, worldPosition.z);
                    }
                }
            },
            isRangeIn(str, maxnum, minnum) {
                var num = parseFloat(str);
                if (num <= maxnum && num >= minnum) {
                    return true;
                }
                return false;
            },
            initLockControl() {
                this.lockControls = new PointerLockControls(this.camera, document.body);
                let self = this;
                this.lockControls.addEventListener('lock', function () {
                    self.controls.enableZoom = false;
                });
                this.lockControls.addEventListener('unlock', function () {
                    self.controls.enableZoom = true;
                    self.clickState = false;
                });
            },
            // 创建场景和地板
            createGroundAndFloor() {
                let width = this.areaInfo[0].value.width;
                let height = this.areaInfo[0].value.height;
                this.createFloor(width, height);
                this.createGround();
                let self = this
                this.$nextTick(() => {
                    self.renderer.render(self.scene, self.camera);
                    // document.querySelector('#scene').toPng()
                    domtoimage.toPng(document.querySelector('#scene')).then(res => {
                        self.$post('aProjScreen', {
                            id: sessionStorage.getItem('projectId'),
                            screenshot: res
                        })
                    })
                })
                // var axesHelper = new this.$THREE.AxesHelper( 1000 );
                // this.scene.add(axesHelper)
            },
            getStationIndex() {
                for (let i = 0; i < this.modelData[0].shelve.length; i++) {
                    let model = this.modelData[0].shelve[i]
                    let name = model.name
                    if (name === 'station') {
                        this.stations.push(model)
                    }
                }
            },
            debounce(delay) {
                let self = this
                return function () {
                    if (self.timer !== null) {
                        clearTimeout(self.timer)
                    }
                    self.timer = setTimeout(() => {
                        self.$message({
                            showClose: true,
                            message: '该时间段无任务',
                            type: 'warning'
                        });
                        self.loading = false
                        self.$store.commit('index/setplayState', false);
                        self.$store.commit('index/setFirstPlay', true);
                    }, delay)
                }
            },
            //添加PST、PST轨道
            addpstAndTrack(x, y, posX, floor) {
                let self = this
                let group = new this.$THREE.Group()
                group.name = "pstGroup"
                let mesh = this.getMould.pstTrack.clone()

                mesh.scale.set(0.05, 0.05, 0.05)
                this.scene.add(group)
                let trackSize = new this.$THREE.Box3()
                let shelvesWidth = 263.9136; //货架宽度
                let size = trackSize.expandByObject(mesh).getSize();  //pst轨道大小
                for (let i in this.pstTrack) {
                    let self = this
                    let track = mesh.clone()
                    let z = this.pstTrack[i].start.z - this.pstTrack[i].end.z + shelvesWidth //每一层货架的整体大小
                    track.scale.z = z / size.z * 0.05
                    group.position.set(x - size.x / 2, y, this.pstTrack[i].start.z - trackSize.expandByObject(track).getSize().z / 2) //PST轨道位置
                    group.add(track)
                    let num = 0
                    for (let i = 0; i <= floor; i++) {
                        num += this.sceneOption[floor].stationNum * 6
                    }
                    this.pstList.filter(e => e.x == posX).forEach((item, index) => {
                        if (item.y <= num) {
                            let gltf = this.getMould.pst.clone()
                            gltf.scale.set(0.05, 0.05, 0.05)
                            gltf.name = item.code
                            gltf.state = true
                            group.add(gltf)
                            self.scene.updateMatrixWorld()
                            let list = self.zConvertnum(item.y)
                            let psbTrackWorldPosition = self.toWorldPosition(self.scene.getObjectByName(`psbTrack-${list.num}-${list.order}`))
                            gltf.position.set(20, 87, psbTrackWorldPosition.z - gltf.getWorldPosition().z) //PST位置(固定在pst轨道里)
                            self.pstList.splice(index, 1)

                        }
                    })
                    // gltf.name = `pst${floor}${num}`
                    // pst、pst轨道组位置
                }
            },
            //获取世界坐标
            toWorldPosition(machine) {
                let worldPosition = new this.$THREE.Vector3();
                machine.getWorldPosition(worldPosition)
                return worldPosition
            },
            // pst运动调用函数
            pstTween(psb, news) {
                // 模拟
                // pst到psbTrack-0-0工作站 第一条轨道至PSB-0-0机器人
                let pst = this.scene.getObjectByName(news.robotCode)
                pst.state = false
                let psbWorld, psbName;
                if (psb) {  //pst带psb移动
                    psb.state = false;//设置正在运动
                    psbWorld = this.toWorldPosition(psb)
                    let pstTrack = this.scene.getObjectByName(`shelve${news.index}-${news.endPoint.x}`).position.x  //判断psb是否在PST上
                    psbName = psb.name
                    psb = this.isRangeIn(psb.position.x,pstTrack + 10,pstTrack - 10)? psb : null
                    console.log('psb', news, psb)
                }
                let pstWorld = this.toWorldPosition(pst)
                this.pstAllTween(psb, pstWorld, psbWorld, pst, news.endPoint, news.startTime, news.endTime, psbName)
                // psbWorld.z = psbWorld.z - 18  //PST移动世界坐标以货架中心点为中心 pst的Z方向减18为货架中心点
                // if (psbWorld.z != pstWorld.z) {  //PST位置和PSB的位置不一致时
                //     // 运动至psb位置
                //     let pstAction = this.pstToDestination(pst, psbWorld)
                //     pstAction.time = news.startTime;
                //     pstAction.start().onComplete(() => {
                //         this.pstAllTween(psb, pstWorld, psbWorld, pst, news.endPoint, news.startTime)
                //     })
                // } else {
                //     this.pstAllTween(psb, pstWorld, psbWorld, pst, news.endPoint, news.startTime)
                // }
            },
            // 运动数据Z方向转换第几个工作站第几个货道
            zConvertnum(z) {
                // 传入的值均从1叠加
                let num = parseInt((z - 1) / 6) //第几个工作站(从0开始)
                let order = z % 6 ? (z % 6 - 1) : 5// 第几个货道(从0开始)
                return {
                    order,
                    num
                }
            },
            // psb移动到PST位置且到达目的工作站指定轨道 psb换轨
            pstAllTween(psb, pstWorld, psbWorld, pst, end, time, endTime, psbName) {

                // let finish = this.psbTopst(psb, pstWorld, psbWorld)
                // pst、psb运动到指定的工作站轨道
                // finish.time = time
                // finish.start().onComplete(() => {
                // 模拟pst和psb组
                // 换轨到psbTrack-3-0工作站 第一条轨道
                let list = this.zConvertnum(end.z)
                let psbTrackWorldPosition = this.toWorldPosition(this.scene.getObjectByName(`psbTrack-${list.num}-${list.order}`))
                var oneDate = new Date(time);
                var twoDate = new Date(endTime);
                let duration = twoDate.getTime() - oneDate.getTime();
                let pstAction = this.pstToDestination(pst, psbTrackWorldPosition, psb, duration)  //pst、psb一同换轨道时 传参psb执行psb动画
                pstAction.time = time
                pstAction.start().onComplete(() => {
                    if (!psb) {  //pst单独移动
                        pst.state = true
                        if (psbName) this.scene.getObjectByName(psbName).state = true
                        this.$set(this.pickFinish, list.num, this.uuid());
                        return
                    }
                    let psbGroup = this.scene.getObjectByName(`psb-group-${list.num}`)  //目标工作站的机器人组  命名"psb-group-index" index为下标 和工作站下标一致
                    this.psbToStation(psb, psbGroup, list, pst, time)  //第三个参数为终点  数据 Y的值（转换成3d 的Z方向并相除取余）
                })
                // })
            },
            diffTime(date) {
                return (this.getTime() - date.getTime()) / (24 * 60 * 60 * 1000);
            },
            // pst移动到指定的工作站的指定PSB位置
            pstToDestination(pst, psbSite, psb, duration) {
                let rotate = {
                    z: pst.position.z,
                    psbZ: psb ? psb.position.z : 0
                }
                let pstAction = new TWEEN.Tween(rotate)
                pstAction.to({
                    //psb轨道世界坐标减pst世界坐标加上pst目前为止（加上pst目前本地坐标是为了防止pst初始位置不是在原点 0）等于运动距离
                    z: psbSite.z - pst.getWorldPosition().z + pst.position.z,
                    psbZ: psb ? psbSite.z - pst.getWorldPosition().z + psb.position.z : 0,

                }, duration, TWEEN.Easing.Sinusoidal.InOut);
                const actions = new Map([
                    ['group', () => {  //pst、psb一起移动添加psb动画参数
                        pstAction.onUpdate(function () {
                            pst.position.z = this.z;
                            psb.position.z = this.psbZ;
                        })
                    }],
                    ['pst', () => { //pst移动
                        pstAction.onUpdate(function () {
                            pst.position.z = this.z;
                        })
                    }],
                ])
                let key = psb ? 'group' : 'pst'
                let action = actions.get(key)
                action.call(this)
                return pstAction

            },
            // psb移动到pst
            // pstSite:pst世界坐标
            // psbSite:psb世界坐标
            // psbTopst(psb, pstSite, psbSite) {
            //     let trackBox = new this.$THREE.Box3();
            //     let size = trackBox.expandByObject(psb).getSize();
            //     let rotate = {
            //         x: psb.position.x,
            //     }
            //     let duration = 2500;
            //     let psbAction = new TWEEN.Tween(rotate)
            //     psbAction.to({
            //         x: pstSite.x - psbSite.x + psb.position.x - size.x - 30,  //减去psb的大小（中心点在旁边的问题）和 pst轨道大小的一半（进入pst中间）
            //     }, duration, TWEEN.Easing.Sinusoidal.InOut);
            //     psbAction.onUpdate(function () {
            //         psb.position.x = this.x;
            //     });
            //     return psbAction
            // },
            // psb换轨成功至添加到目的工作站
            psbToStation(psb, psbGroup, list, pst, time) {
                let z = this.psbSite * list.order
                // let rotate = {
                //     x: psb.position.x,
                // }
                // let duration = 2500;
                // let psbAction = new TWEEN.Tween(rotate)
                // psbAction.to({
                //     x: 0,  //pst在前面的情况下 psb入工作站的位置为0  若pst在后面  psb入站位置需要计算工作站最小值的x
                // }, duration, TWEEN.Easing.Sinusoidal.InOut);
                // psbAction.onUpdate(function () {
                //     psb.position.x = this.x;
                // });
                // psbAction.time = time
                psb.position.z = z
                psbGroup.add(psb)
                psb.state = true
                pst.state = true
                this.$set(this.pickFinish, list.num, this.uuid());
                // psbAction.start().onComplete(() => {
                //     psb.position.set(0, 0, z)
                //     psbGroup.add(psb)
                //     console.log('psbGroup', psbGroup)
                //
                //     psb.state = true
                //     pst.state = true
                //     this.$set(this.pickFinish, list.num, this.uuid());
                // })
            },
            // 生成 uuid
            uuid() {
                var s = [];
                var hexDigits = "0123456789abcdef";
                for (var i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";

                var uuid = s.join("");
                return uuid;
            },
            addMachine() {
                let self = this
                this.$get('sorterDataReadOrWrite').then(res => {
                    if (res.code == 200) {
                        let data = res.data
                        for (let i = 0, len = data.length; i < len; i++) {
                            let d = data[i]
                            if (d.projectId == sessionStorage.getItem('projectId')) {
                                this.pstList = d.list.filter(e => e.type == 'pst')
                                this.psbList = d.list.filter(e => e.type == 'psb')
                                this.pickList = d.list.filter(e => e.type == 'pick')
                                let psb = []
                                for (let j in this.psbList) {
                                    let num = parseInt((this.psbList[j].y - 1) / 6) //第几个工作站
                                    if (!psb[num]) {
                                        psb[num] = []
                                    }
                                    psb[num].push(this.psbList[j])
                                    // this.machine[list.num]=
                                }
                                self.$set(self, 'machineList', psb)
                            }
                        }
                        this.addPST()
                        this.addRobot(this.pickList)

                    }
                })

            },
            addPST() {
                let psts1 = this.modelData[0].psts || []
                // 第一层的 pstTrack
                // psts1 是工作站中有几个 pstTrack
                for (let j = 0, len = psts1.length; j < len; j++) {
                    let pst = psts1[j]
                    let x = pst.x
                    let pos = new this.$THREE.Vector3(0, 0, 0)
                    let name = `shelve0-${x}`
                    let mesh = this.scene.getObjectByName(name)
                    let box = new this.$THREE.Box3()
                    mesh.getWorldPosition(pos)
                    mesh.modelType = 'pstTrack'
                    box.expandByObject(mesh)
                    let height = box.max.y - box.min.y
                    // -90 因为建模的中心位置没有设置好
                    let y = pos.y + height - 90
                    this.addpstAndTrack(pos.x, y, x, 0)  //第一层
                }
                // 第一层的 pstTrack
                // psts2 是工作站中有几个 pstTrack
                if (this.floorNum > 1) {
                    let psts2 = this.modelData[1]?.psts || []
                    for (let j = 0, len = psts2.length; j < len; j++) {
                        let pst = psts2[j]
                        let x = pst.x
                        let pos = new this.$THREE.Vector3(0, 0, 0)
                        let name = `shelve1-${x}`
                        let mesh = this.scene.getObjectByName(name)
                        let box = new this.$THREE.Box3()
                        mesh.getWorldPosition(pos)
                        mesh.modelType = 'pstTrack'
                        box.expandByObject(mesh)
                        let height = box.max.y - box.min.y
                        // -90 因为建模的中心位置没有设置好
                        let y = pos.y + height - 90 + height
                        this.addpstAndTrack(pos.x, y, x, 1)  //第一层
                    }
                }
            }
        },
        watch: {
            currentStationNum(val) {
                if (!val || val < this.stationOptions.length) return
                this.addMachine()


            },
            currentProjectData: {
                immediate: true,
                deep: true,
                handler(val) {
                    this.machineInfo = this._get(val, 'projectDetail.machineInfo', []);
                    this.floorNum = this._get(val, 'projectDetail.sceneOption', []).length;
                    this.sceneOption = this._get(val, 'projectDetail.sceneOption', []);
                    this.whalehouseID = this._get(val, 'projectDetail.whalehouseID', '');
                    this.requestUrl = this._get(val, 'projectDetail.requestUrl', '');
                    this.areaInfo = this._get(val, 'projectDetail.areaInfo', []);
                    this.modelData = this._get(val, 'projectDetail.modelData', {})
                    // console.log('val', val)
                    this.hasProjectData = true
                    this.$store.commit('index/setHasData', true)
                    if (JSON.stringify(this.modelData) !== '{}') {
                        this.getStationIndex()
                    }
                    if (val && val.id == sessionStorage.getItem('projectId')) {
                        let vm = this;
                        let list = val.projectDetail.sceneOption;
                        this.coordinateConvert(list);
                        this.$nextTick(() => {
                            this.initControls();
                        });
                    }
                },
            },
            areaInfo: {
                // immediate:,
                handler(val, old) {
                    if (val.length) {
                        let val1 = val[1].value;     // 使用面积的长宽
                        let val0 = val[0].value;     // 总面积的长宽
                        let percent = ((val1.width * val1.height) / (val0.width * val0.height) * 100).toFixed(2);
                        this.currentProjectUsedPercent = percent === 'NaN' ? 0 : percent;
                    }
                }
            },
            'pickActionList.length': {
                handler(val, old) {
                    if (old === 0 || old > val) {
                        this.pickActionList[0] && this.pickAnimate(this.pickActionList[0]);
                    }
                },
                deep: true
            },

            endBox: {
                handler(val, old) {
                    this.loadState.addBox = true;
                }
            },
            loadState: {
                deep: true,
                handler(val, old) {
                    if (val.addBox) {
                        this.loading = false

                    }
                }
            },
            responses: {
                handler(val) {
                    if (val.length === this.getReqTimes.length) {
                        for (let i = 0; i < val.length; i++) {
                            let res = val[i]
                            if (res.code == '200') {
                                this.resNum = this.resNum + 1
                            } else {
                                this.debounce(5000)()
                            }
                        }
                    }
                }
            },
            resNum: {
                handler(val) {
                    if (this.getReqTimes.length === val && this.playState) {
                        let self = this

                    } else {
                        this.debounce(5000)()
                    }
                }
            },
        },
        beforeMount() {
            this.init();

        },

        beforeDestroy() {
            this.renderer = null;
            this.scene = null;
            this.camera = null;
            cancelAnimationFrame(this.animateTimer);
        },

        mounted() {
            this.initRenderer();
            this.animate();
            this.initLockControl();
            // var geometry = new this.$THREE.PlaneBufferGeometry( 500, 200, 32 );
            // var material = new this.$THREE.MeshBasicMaterial( {color: 0xffff00, side: this.$THREE.DoubleSide} );
            // var plane = new this.$THREE.Mesh( geometry, material );
            // this.scene.add( plane );
            // setTimeout(() => {
            // 	this.animateConvert();
            // }, 2000);
        },
    };
</script>
<style lang="scss"
  scoped>

    .preview {

        padding: 0 2.4vw 0 1.56vw;
        position: relative;

        ::v-deep canvas:focus {
            outline: 0;
        }

        ::v-deep .el-upload-list {
            display: none;
        }

        ::v-deep .el-loading-mask {
            background-color: rgba(0, 0, 0, 0.7);
        }

        .container {
            height: 100%;
            width: 100%;
        }

        .leftSider {
            position: absolute;
            top: 5.5vh;

        }

        .el-picker-panel {
            position: fixed;
            right: 2.1vw;
            top: 11.1vh;
        }

        .left {
            position: absolute;
            bottom: 4vh;
            transition: all 2s;
            transform: translateX(18.6vw);
        }

        .right {
            position: absolute;
            bottom: 4vh;
            right: 1.5vw;
            transition: all 0.8s;
        }

        .centerShare {
            position: absolute;
            right: 20.1vw;
            bottom: 4vh;
            width: 3vw;
            height: 10.4vh;
            display: flex;
            flex-wrap: wrap;
            background-size: 100% 100%;
            background: url('~@/assets/scene/rightContent.png');
            align-items: center;
            justify-content: center;

            .flod, .share {
                cursor: pointer;
                width: 3vw;
            }

            .flod {
                margin-top: 0.6vh;
            }

            .iconImg {
                width: 3vw;
                height: 0.9vw;
                display: flex;
                justify-content: center;

                span {
                    background: url("~@/assets/scene/column.png");
                    width: 1.7vh;
                    height: 1.7vh;
                    background-size: 100% 100%;
                }

                .imgShow {
                    background: url("~@/assets/scene/columnRight.png");
                    width: 1.7vh;
                    height: 1.7vh;
                    background-size: 100% 100%;
                }
            }

            .iconImg img {
                width: 1.7vh;
                height: 1.7vh;
            }

            .splitImg {
                width: 2.9vw;
                height: 0.1vw;
                display: flex;
            }

            .splitImg img {
                width: 2.9vw;
                height: 0.1vw;
            }

            .iconName {
                margin-top: 0.5vh;
                width: 3vw;
                text-align: center;
                font-size: 0.8vh;
                color: #cccccc;
                display: flex;
                justify-content: center;
            }
        }

        .cameraIcon {
            position: absolute;
            top: 4.4vh;
            right: 20.5vw;
            width: 3.8vw;
            height: 3.8vw;
            border: 0.2vw solid #4c4c4c;
            border-radius: 50%;
            cursor: pointer;

            .circle {
                width: 2.9vw;
                height: 2.9vw;
                border: 0.1vw dotted #4c4c4c;
                opacity: 0.6;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);

                .rect {
                    background-color: #808080;
                    width: 1.6vw;
                    height: 1.6vw;
                    line-height: 1.6vw;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    text-align: center;
                    color: #ffffff;
                    font-size: 0.7vw;
                    transform: translate(-50%, -50%);
                }
            }
        }

    }

    .slide-fade-enter-active {
        transition: all 0.5s ease;
    }

    .slide-fade-leave-active {
        transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter, .slide-fade-leave-active {
        opacity: 0;
    }

    .rightLine {
        position: absolute;
        right: 1vw;
        top: 1vw;

        img {
            height: 47vw;
            background-size: 100% 100%;
        }
    }
</style>
<style lang="scss">
    .preview {
        .el-slider__bar {
            background: linear-gradient(to top right, rgba(31, 31, 31, 0), rgba(106, 106, 106, 0.8));
            height: 0.2vh;
        }

        .el-slider__runway {
            background-color: #1f1f1f;
            height: 0.2vh;
            margin: 0.8vh 0;
        }

        .el-slider__button {
            border: 2px solid #595959;
            background-color: unset;
            position: relative;
            top: 0.5vh;

            &::after {
                content: '';
                width: 0.2vw;
                height: 0.2vw;
                background-color: #ffac29;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }

        .el-slider__button-wrapper {
            width: 0.8vw;
            height: 1.5vh;
            top: -13px;
        }
    }
</style>
