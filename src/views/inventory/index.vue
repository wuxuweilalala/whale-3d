<template>
    <div class="inventory"
      v-loading="loading">
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
			excelTitleData: ['序号', '箱号', 'X', 'Y', 'Z', 'SKUID','regionID'],
			size: 22,
			totalSize: 100,
		};
	},
	methods: {
		handleUploadChange(item, file) {
			this.loading = true;
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
			} else {
				self.$get('gStock', params).then(res => {
					if (res.code == '200') {
						self.totalSize = res.data.count;
						self.stockList[val] = res.data.lists;
						self.tableData = res.data.lists;
					}

				});
			}
			// this.$dexieDB.stock.get(params.project_id).then(res => {
			//     if (res) {
			//         // debugger
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
	}
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
