<template>
    <div class="inventory"
      v-loading="loading">
        <section v-show="historyShow">
            <span class="title">模板</span>
            <div class="line">
                <span></span>
            </div>
            <ul>
                <li :key="index"
                  v-for="(f, index) in files">
                    <img class="excel"
                      src="../../assets/scene/form.png"
                      alt="">
                    <img @click="closeClickEvent(f.file_url, index)"
                      class="close"
                      src="../../assets/scene/closefile.png"
                      alt="">
                    <span class="span-btn use"
                      @click="useClickEvent(f.file_url, f.file_name)">使用</span>
                    <span class="span-btn download"><a :href="f.file_url">下载</a></span>
                    <span class="name">{{ f.file_name }}</span>
                </li>
                <li v-if="files.length < 5">
                    <input @input="inputChangeEvent"
                      type="file"
                      ref="file"
                      class="file">
                    <img @click="addClickEvent"
                      class="add-icon"
                      src="../../assets/scene/addFile.png"
                      alt="">
                </li>
            </ul>
        </section>
        <div class="inventoryWrapper"
          v-if="tableData.length">
            <header>
                <span class="excelTitle">{{excelTitle}}</span>
                <div class="centerLine"/>
                <div class="rightBtn">
                    <div class="btn"
                      @click='clearStock'>
                        <svg class="icon"
                          aria-hidden="true">
                            <use xlink:href="#icon-shanchu"/>
                        </svg>
                        <span>清空库存</span>
                    </div>
                    <el-upload
                      class="btn"
                      action
                      :http-request="importExcel"
                    >
                        <svg class="icon"
                          aria-hidden="true">
                            <use xlink:href="#icon-Aplussign"/>
                        </svg>
                        重新导入
                    </el-upload>
                </div>
            </header>
            <div class="excelWrapper">
                <header>
                    <span v-for="(item,index) in excelTitleData"
                      :key="index">{{item}}</span>
                </header>
                <div class="excelContent">
                    <div class="excelList"
                      v-for="(list,listIndex) in tableData"
                      :key="listIndex">
                        <span v-for="(sonList,sonIndex) in list"
                          :key="sonIndex">{{sonList}}</span>
                    </div>
                </div>
                <Pagination :currentPage="currentPage"
                  @current-change="handleCurrentChange"
                  :pageSize="size"
                  :total="totalSize"/>
            </div>
        </div>
        <div class="noneData"
          v-else>
            <p>当前没有任何库存,请导入表格,模拟运行</p>
            <el-upload
              class="btn"
              action
              :on-change="handleUploadChange"
              :http-request="importExcel"
            >
                <svg class="icon"
                  aria-hidden="true">
                    <use xlink:href="#icon-Aplussign"/>
                </svg>
                导入库存
            </el-upload>
        </div>
    </div>
</template>

<script>
import XLSX from 'xlsx';
import Pagination from '@/components/Pagination';
import {mapGetters} from 'vuex';

export default {
	name: 'inventory',
	components: {
		Pagination
	},
	computed: {
		...mapGetters('index', {
			currentProjectData: 'getCurrentProjectData',
		}),
	},
	data() {
		return {
            currentPage: 1,
            excelTitle: '',
            tableData: [],
            stockList: {},
            loading: false,
            tab: [],
            excelTitleData: [],
            size: 22,
            totalSize: 100,
            files: [{
                file_name: "PS子仓库存报表1.xls",
                file_url: "http://whalehouse_p.24e.co/history_file/excel/PS子仓库存报表1.xls",
            }],
            historyShow: true,
            file: null,
        };
	},
	methods: {
        handleUploadChange(item, file) {
            this.loading = true;
        },
        save(obj) {
            let excelTitles = this.load()
            excelTitles.push(obj)
            localStorage.setItem('excelTitle', JSON.stringify(excelTitles))
        },
        load() {
            let excelTitles = []
            if (localStorage.getItem('excelTitle') !== null) {
                excelTitles = JSON.parse(localStorage.getItem('excelTitle'))
            }
            return excelTitles
        },
        importExcel(response) {
            let self = this;
            const types = response.file.name.split('.')[1];
            const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv'].some(
                item => item === types
            );
            if (!fileType) {
                self.$message({
                    showClose: true,
                    message: '文件格式有误！请重新选择',
					type: 'error'
				});
				this.loading = false;
				return;
			}
			let formData = new FormData();
			formData.append('project_id', this.currentProjectData.id);
			formData.append('file', response.file);
			self.$post('sUpload', formData).then(res => {
				if (res.code == '200') {
                    self.stockList = {};
                    self.$store.commit('stock/setStock', res.data);
                    let stockOptions = {
                        projectId: Number(this.currentProjectData.id),
                        options: res.data,
                        fileName: response.file.name
                    };
                    this.$dexieDB.stock.put(stockOptions);
                    self.excelTitle = response.file.name;
                    this.save({
                        id: self.currentProjectData.id,
                        name: self.excelTitle,
                    })
                    self.handleCurrentChange(1);
                    self.loading = false;
                } else
                    self.$message({
                        showClose: true,
                        message: '库存格式有误',
                        type: 'error'
                    });
                    this.loading = false;
                }
            )
        },
        setExcelTitle() {
            this.excelTitleData = []
            let keys = {
                'serial': '序号',
                'box_num': '箱号',
                'regionID': 'regionID',
                'skuid': 'skuid',
                'x_axis': 'x',
                'y_axis': 'y',
                'z_axis': 'z',
                'region_id': 'regionID',
            }
            for (let key in this.tableData[0]) {
                if (keys[key] == undefined) {
                    this.excelTitleData.push(key)
                } else {
                    this.excelTitleData.push(keys[key])
                }
            }
        },
        // 切换页数
        handleCurrentChange(val) {
            let self = this;
            let params = {
                project_id: this.currentProjectData.id,
                size: 22,
                page: val
            };
            if (Object.prototype.hasOwnProperty.call(self.stockList, val.toString())) {
                self.tableData = self.stockList[val];
                self.setExcelTitle()
			} else {
				self.$get('gStock', params).then(res => {
                    if (res.code == '200') {
                        self.totalSize = res.data.count;
                        self.stockList[val] = res.data.lists;
                        self.tableData = res.data.lists;
                        self.setExcelTitle()
                        if (res.data.lists.length > 0) {
                            this.historyShow = false;
                        } else {
                            this.historyShow = true;
                        }
                    }
                });
            }
            // this.$dexieDB.stock.get(params.project_id).then(res => {
            //     if (res) {
            //         //
            //         self.tableData = res.options;
            //     } else {
            //         self.$get('gStock', params).then(res => {
            //             if (res.code == '200') {
            //                 let stockOptions = {
            //                     projectId: params.project_id,
            //                     options: res.data.lists
            //                 }
            //                 this.$dexieDB.stock.put(stockOptions)
            //                 self.totalSize = res.data.count;
			//                 self.stockList[val] = res.data.lists;
			//                 self.tableData = res.data.lists;
			//             }
			//
			//         });
			//     }
			// })
		},
		clearStock() {
            let self = this;
            this.historyShow = true
            self.$get('clearStock', {project_id: this.currentProjectData.id}).then(res => {
                if (res.code == '200') {
                    self.tableData = [];
                    self.tab = [];
                    self.$message({
                        showClose: true,
                        message: '清除成功',
                        type: 'success'
                    });
                }

            });
        },
        // 获取历史记录
        getHistoryFile() {
            let self = this
            this.$get('/backupsFiles', {}).then(res => {
                if (res.code == 200) {
                    self.files = res.data
                }
            })
        },
        // 添加按钮点击事件
        addClickEvent() {
            this.file = this.$refs.file
            this.file.click()
        },
        inputChangeEvent(event) {
            let files = this.file.files
            const types = files[0].name.split('.')[1];
            const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv'].some(
                item => item === types
            );
            if (!fileType) {
                this.$message({
                    showClose: true,
                    message: '文件格式有误！请重新选择',
                    type: 'error'
                });
                this.loading = false;
                return;
            }
            let formData = new FormData();
            formData.append('files', files[0]);
            this.$post('/backupsFiles', formData).then(res => {
                if (res.code == 200) {
                    this.files.push({
                        file_name: res.data.file_name,
                        file_url: res.data.file_path,
                    })
                } else {
                    this.$message({
                        showClose: true,
                        message: res.err_msg,
                        type: 'error'
                    });
                }
            })
        },
        // 删除文件
        closeClickEvent(url, index) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$del('/backupsFiles', {files: url}).then(res => {
                    if (res.code == 200) {
                        this.files.splice(index, 1)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        useClickEvent(url, name) {
            this.loading = true
            this.$post('/backupsUpload', {
                files: url,
                project_id: this.currentProjectData.id,
            }).then(res => {
                if (res.code == 200) {
                    this.excelTitle = name
                    this.save({
                        id: this.currentProjectData.id,
                        name: this.excelTitle,
                    })
                    this.totalSize = res.data.length;
                    this.stockList[1] = res.data;
                    this.tableData = res.data;
                    this.setExcelTitle()
                    if (res.data.length > 0) {
                        this.historyShow = false;
                    } else {
                        this.historyShow = true;
                    }
                    this.loading = false
                } else {
                    this.$message({
                        showClose: true,
                        message: res.err_msg,
                        type: 'error'
                    });
                }
            })
        },
    },
	watch: {
		'currentProjectData.id': {
			handler(news, old) {
				this.tableData = [];
				this.stockList = {};
                this.currentPage = 1;
                if (news) {
                    this.handleCurrentChange(1);
                }
            },
            immediate: true,
            deep: true
        }
    },
    mounted() {
    },
    created() {
        this.getHistoryFile()
        let result = this.load()
        for (let i = 0; i < result.length; i++) {
            let r = result[i]
            if (r.id == this.currentProjectData.id) {
                this.excelTitle = r.name
            }
        }
    },
};
</script>

<style>
    .el-upload-list {
        display: none;
    }

    .el-loading-mask {
        background-color: rgba(0, 0, 0, 0.9);
    }
</style>

<style lang="scss"
  scoped>
    .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        width: 5.4vw;
        height: 1.7vw;
        background: url('~@/assets/order/btnBorder.png');
        background-size: 100% 100%;
    }

    .inventory {
        width: 100%;
        position: relative;

        section {
            width: 78vw;
            height: calc(9.01vw + 0.46vw);
            border-bottom: 0.05vw solid rgba(255, 255, 255, 0.2);

            .line {
                background-image: linear-gradient(10deg,
                  rgba(154, 154, 154, 0) 0%,
                  rgba(154, 154, 154, 1) 100%);
                width: 75vw;
                height: 0.05vw;
                float: right;
                position: relative;

                span {
                    width: 0.36vw;
                    height: 0.36vw;
                    background-color: rgba(255, 172, 41, 1);
                    position: absolute;
                    right: 0;
                    top: -0.18vw;
                    border-radius: 50%;
                }
            }

            .title {
                width: 1.51vw;
                /*height: 0.68vw;*/
                transform: translateY(-50%);
                position: absolute;
                font-size: 0.73vw;
            }

            ul {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 1.35vw;

                li {
                    position: relative;
                    width: 6.56vw;
                    height: 4.53vw;
                    display: inline-block;
                    background-color: rgba(23, 15, 4, 1);
                    border: 0.05vw solid rgba(89, 60, 14, 1);
                    margin-right: 1.82vw;

                    .span-btn {
                        width: 2.18vw;
                        height: 1.1vw;
                        font-size: 0.63vw;
                        padding: 0.12vw 0.36vw 0.12vw 0.36vw;
                        border: 0.05vw solid rgba(255, 172, 41, 1);
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        display: none;
                        cursor: pointer;
                    }

                    .use {
                        top: 18%;
                    }

                    .download {
                        bottom: 18%;
                    }

                    &:hover {
                        .close {
                            display: inline-block;
                        }

                        .excel {
                            opacity: 0.5;
                        }

                        .span-btn {
                            display: inline-block;
                        }
                    }

                    .file {
                        display: none;
                    }

                    .excel {
                        width: 1.56vw;
                        height: 1.82vw;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }

                    .close {
                        width: 0.52vw;
                        height: 0.52vw;
                        position: absolute;
                        top: 0.52vw;
                        right: 0.52vw;
                        cursor: pointer;
                        display: none;
                    }

                    .name {
                        position: absolute;
                        width: calc(6.56vw + 1.82vw);
                        bottom: calc(-0.52vw - 0.63vw);
                        left: 0;
                        font-size: 0.63vw;
                        color: rgba(255, 252, 252, 1);
                        pointer-events: none;
                    }

                    .add-icon {
                        width: 1.15vw;
                        height: 1.15vw;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        cursor: pointer;
                        transform: translate(-50%, -50%);
                    }
                }
            }
        }

        .inventoryWrapper {
            width: 100%;

            header {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .centerLine {
                    width: 57.3vw;
                    height: 0.1vw;
                    background: linear-gradient(to top right, rgba(154, 154, 154, 0.1), #9a9a9a);
                    position: relative;

                    &:after {
                        content: '';
                        position: absolute;
                        top: -0.2vw;
                        right: 0;
                        width: 0.4vw;
                        height: 0.4vw;
                        border-radius: 50%;
                        background: #ffac29;
                    }
                }

                .rightBtn {
                    display: flex;
                    align-items: center;

                    .btn {
                        margin-left: 0.4vw;

                        .icon {
                            margin-right: 0.3vw;
                        }

                        &:first-child {
                            margin: 0
                        }

                        &:last-child {
                            .icon {
                                margin: 0;
                            }
                        }
                    }
                }
            }

            .excelWrapper {
                margin-top: 1.5vw;
                header {
                    background: #242525;
                    height: 1.6vw;

                    span {
                        text-align: center;
                        width: 10.92vw;
                        color: #ffac29;
                    }
                }

                .excelContent {
                    height: 36vw;
                    overflow: hidden;

                    .excelList {
                        display: flex;
                        height: 1.6vw;
                        justify-content: space-between;
                        align-items: center;

                        &:nth-child(even) {
                            background-color: rgba(154, 154, 154, 0.06);
                        }

                        span {
                            font-size: 0.7vw;
                            text-align: center;
                            width: 10.92vw;
                        }
                    }
                }
            }
        }

        .noneData {
            width: 100%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            text-align: center;

            p {
                margin-bottom: 1vw;
                letter-spacing: 0.9px;
                color: rgba(255, 255, 2550, 0.8)
            }

            .btn {
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                width: 8.1vw;
                height: 2.4vw;
                margin: 0 auto;
                color: #feab29;
                background: url('~@/assets/order/btnBorder.png');
                background-size: 100% 100%;
            }
        }
    }
</style>
