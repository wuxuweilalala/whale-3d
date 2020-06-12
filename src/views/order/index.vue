<template>
    <div>
        <!--        <div class="orderContent"-->
        <!--          v-if="!detailShow">-->
        <!--            <header v-if="excelList.length !== 0">-->
        <!--                <div class="inquireWrapper">-->
        <!--                    <div class="inquireInput">-->
        <!--                        <span></span>-->
        <!--                        <input type="text"-->
        <!--                          placeholder="输入需要搜索的订单号">-->
        <!--                    </div>-->
        <!--                    <div class="inquire">查询</div>-->
        <!--                </div>-->
        <!--                &lt;!&ndash;                     action="https://jsonplaceholder.typicode.com/posts/"&ndash;&gt;-->
        <!--                <el-upload-->
        <!--                  action-->
        <!--                  class="btn"-->
        <!--                  :on-success="importExcel"-->
        <!--                >-->
        <!--                    <svg class="icon"-->
        <!--                      aria-hidden="true">-->
        <!--                        <use xlink:href="#icon-Aplussign"/>-->
        <!--                    </svg>-->
        <!--                    导入订单-->
        <!--                </el-upload>-->
        <!--            </header>-->
        <!--            <div class="excelWrapper"-->
        <!--              v-if="excelList.length !== 0">-->
        <!--                <header>-->
        <!--                    <span>序号</span>-->
        <!--                    <span>订单批次</span>-->
        <!--                    <span>订单量</span>-->
        <!--                    <span>状态</span>-->
        <!--                    <span>订单完成度</span>-->
        <!--                    <span>订单完成量</span>-->
        <!--                    <span>操作</span>-->
        <!--                </header>-->
        <!--                <div class="excelContent">-->
        <!--                    <div class="contentList"-->
        <!--                      v-for="(list,index) in excelList"-->
        <!--                      :key="index">-->
        <!--                        <span class="itemList"-->
        <!--                          v-for="(item,itemList) in list"-->
        <!--                          :key="itemList">{{item}}</span>-->
        <!--                        <div class="itemList">-->
        <!--                            <span @click="detailShow = true">详情</span>-->
        <!--                            <span class="delete"-->
        <!--                              @click="deleteOrder(index)">删除</span>-->
        <!--                        </div>-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--            </div>-->
        <!--            <div class="noneData"-->
        <!--              v-if="excelList.length === 0">-->
        <!--                <p>当前没有任何订单, 请导入表格, 模拟运行</p>-->
        <!--                &lt;!&ndash;                    action="https://jsonplaceholder.typicode.com/posts/"&ndash;&gt;-->
        <!--                &lt;!&ndash;            :on-change="handleUploadChange"&ndash;&gt;-->
        <!--                <el-upload-->
        <!--                  action-->
        <!--                  class="btn"-->

        <!--                  :on-success="importExcel"-->
        <!--                >-->
        <!--                    <svg class="icon"-->
        <!--                      aria-hidden="true">-->
        <!--                        <use xlink:href="#icon-Aplussign"/>-->
        <!--                    </svg>-->
        <!--                    导入订单批次-->
        <!--                </el-upload>-->
        <!--            </div>-->
        <!--        </div>-->
        <div class="detail"
          v-if="detailShow">
            <header>
                <!--                <div class="btn return"-->
                <!--                  @click="detailShow = false">-->
                <!--                    <svg class="icon"-->
                <!--                      aria-hidden="true">-->
                <!--                        <use xlink:href="#icon-zuojiant"/>-->
                <!--                    </svg>-->
                <!--                    返回-->
                <!--                </div>-->
                <div class="selectDate">
                    <el-date-picker
                      @change="dateChangeEvent"
                      class="dateSelected"
                      v-model="timeValue"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                    <div class=""
                      @click="showDateSelected">
                        <span><img src="@/assets/scene/date.png"
                          alt=""> </span>
                        <span>{{ formatTimeValue }}</span>
                        <span><img src="@/assets/scene/xiala.png"
                          alt=""> </span>
                    </div>

                </div>
                <span>{{ 123 }}</span>
                <div class="inquireWrapper">
                    <div class="inquireInput">
                        <span></span>
                        <input type="text"
                          placeholder="输入需要搜索的订单号">
                    </div>
                    <div class="inquire">查询</div>
                </div>
            </header>
            <div class="excelWrapper"
              v-if="currentList.length > 0">
                <header>
                    <span>序号</span>
                    <span v-for="(item,index) in currentList[0].item[0]"
                      :key="index">{{index}}</span>
                </header>
                <div class="excelContent">
                    <div class="excelList"
                      v-for="(list,listIndex) in currentList"
                      :key="listIndex">
                        <span>{{ list.index }}</span>
                        <span v-for="(sonList,sonIndex) in list.item[0]"
                          :key="sonIndex">{{sonList}}</span>
                    </div>
                </div>
                <Pagination :currentPage="currentPage"
                  @current-change="handleCurrentChange"
                  :pageSize="size"
                  :total="totalSize"/>
            </div>
            <!--            <div class="excelWrapper">-->
            <!--                <div class="table-list">-->
            <!--                    <header>-->
            <!--                        <span class="first"></span>-->
            <!--                        <span>序号</span>-->
            <!--                        <span :key="index" v-for="(list, index) in orderList[0].item[0]">{{ index }}</span>-->
            <!--                        <span class="last"></span>-->
            <!--                    </header>-->
            <!--                    <div class="table-cell" :key="index"-->
            <!--                      v-for="(lists,index) in orderList">-->
            <!--                        <span></span>-->
            <!--                        <span>{{ index }}</span>-->
            <!--                        <span :class="{space: index > 1}" :key="index" v-for="(list, index) in lists.item[0]">{{ list }}</span>-->
            <!--                        <span></span>-->
            <!--                    </div>-->
            <!--                </div>-->
            <!--            </div>-->
        </div>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination';
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        name: "order",
        components: {
            Pagination
        },
        data() {
            return {
                detailShow: true,
                excelList: [],
                detailList: [
                    // {“skuId”:”sku001”,qty:10}
                    ['01', 'ABC123456789', 'tapy1', 'XL', '10000', '100%', '100%', '100%', '完成'],
                    ['01', 'ABC123456789', 'tapy1', 'XL', '10000', '100%', '100%', '100%', '完成'],
                    ['01', 'ABC123456789', 'tapy1', 'XL', '10000', '100%', '100%', '100%', '完成'],
                    ['01', 'ABC123456789', 'tapy1', 'XL', '10000', '100%', '100%', '100%', '完成'],
                    ['01', 'ABC123456789', 'tapy1', 'XL', '10000', '100%', '100%', '100%', '完成'],
                ],
                currentList: [],
                orderList: [
                    {
                        "orderNo": "CK20200518000073",
                        "item": [
                            {
                                "skuId": "110180212",
                                "qty": 2
                            }
                        ]
                    },
                ],
                currentPage: 1,
                size: 20,
                totalSize: 0,
                timeValue: [new Date(2020, 4, 10, 10, 10), new Date(2020, 4, 11, 10, 10)],
                // formatTimeValue: '2020-04-08 17:15~2020-04-09 17:15',   // 格式化时间
                formatTimeValue: '请选择任务时间段',
                currentIndex: 0,
            }
        },
        computed: {
            ...mapGetters('index', {
                getSelectedDate: 'getSelectedDate',
                currentProjectData: 'getCurrentProjectData',
                getProjectIdAndUrl: 'getProjectIdAndUrl',
            }),
        },
        methods: {
            ...mapMutations('index', {
                setSelectDate: 'setSelectDate',
            }),
            deleteOrder(index) {
                // console.log(index);
                this.excelList.splice(index, 1)
            },
            importExcel() {

            },
            // 切换页数
            handleCurrentChange(val) {
                this.currentList = this.orderList.slice((val - 1) * this.size, val * this.size)
                this.currentIndex = (this.currentPage - 1) * 20
            },
            formatTime(str) {
                let s = String(str);
                if (s.length == 1) {
                    s = '0' + s;
                }
                return s;
            },
            getDate(date) {
                let year = date.getFullYear();
                let mon = date.getMonth() + 1;
                let day = date.getDate();
                let hour = date.getHours();
                let min = date.getMinutes();
                let sec = date.getSeconds();
                return `${year}-${this.formatTime(mon)}-${this.formatTime(day)} ${this.formatTime(hour)}:${this.formatTime(min)}:${this.formatTime(sec)}`;
            },
            getStockData() {
                let firstStationNum = 3;
                console.log('currentProjectData', this.currentProjectData)
                let params = {
                    warehouseID: this.currentProjectData.projectDetail.whalehouseID,
                    startTime: this.getSelectedDate.s1,
                    endTime: this.getSelectedDate.s2,
                    firstStationNum,
                    project_id: sessionStorage.getItem('projectId'),
                    url_param: this.currentProjectData.projectDetail.requestUrl,
                };
                this.$get('gStockData', params).then(res => {
                    if (res.code == '200' && res.data) {
                        let arr = res.data[0]
                        console.log(res.data, arr)
                        for (let i = 0; i < arr.length; i++) {
                            let a = arr[i]
                            this.orderList.splice(this.orderList.length, 0, ...a.outOrderID)
                            this.orderList.forEach((item, index) => {
                                item.index = index + 1
                            })
                            this.currentList = this.orderList.slice(0, 20)
                        }
                    }
                })
            },
            // 日期选择器 change 事件
            dateChangeEvent(event) {
                let d1 = this.timeValue[0];
                let d2 = this.timeValue[1];
                let s1 = this.getDate(d1);
                let s2 = this.getDate(d2);
                this.formatTimeValue = s1 + '~' + s2;
                this.setSelectDate({
                    s1,
                    s2,
                })
                this.getStockData()
            },
            // 日期选择器 click 事件
            showDateSelected(event) {
                let date = document.querySelector('.dateSelected');
                date.click();
            },
        },
        created() {
            this.totalSize = this.orderList.length

            // 请求订单数据
            this.getStockData()
            // this.orderList.forEach((item, index) => {
            //     item.index = index + 1
            // })
            if (JSON.stringify(this.getSelectedDate) !== '{}') {
                this.timeValue = [new Date(this.getSelectedDate.s1), new Date(this.getSelectedDate.s2)]
                this.formatTimeValue = this.getSelectedDate.s1 + '~' + this.getSelectedDate.s2
            }
        },
        mounted() {
        }
    }
</script>

<style lang="scss"
  scoped>
    .inquireWrapper {
        display: flex;

        .inquireInput {
            input {
                width: 23.8vw;
                height: 1.9vw;
                background-color: rgba(154, 154, 154, 0.5);
                border: solid 0.1vw #9a9a9a;
                color: #fffcfc;
                padding-left: 0.6vw;
            }
        }

        .inquire {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 3.5vw;
            height: 1.9vw;
            background-color: rgba(255, 172, 41, 0.5);
            border: solid 0.1vw #ffac29;
            color: rgba(255, 252, 252, 1);
            margin-left: 0.7vw;
            cursor: pointer;
        }
    }

    .selectDate {
        background: url('~@/assets/scene/selectDate.png');
        width: 17vw;
        height: 3.5vh;
        background-size: 100% 100%;
        text-align: center;
        position: relative;
        cursor: pointer;

        div {
            padding-top: 0.8vh;
            position: absolute;
            top: 0;
            padding-left: 0.8vw;
        }

        span {
            width: 0.8vw;
            height: 0.8vw;
            font-size: 1.3vh;
            color: #999999;
            vertical-align: top;

            img {
                width: 0.8vw;
                height: 0.8vw;
            }

            &:nth-child(3) {
                opacity: 0.2;
            }

            &:nth-child(2) {
                padding: 0 0.5vw;
            }
        }

        .dateSelected {
            width: 16.8vw;
            height: 3.5vh;
            opacity: 0;
        }
    }

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

    .orderContent {
        width: 100%;
        position: relative;

        header {
            display: flex;
            justify-content: space-between;
        }

        .excelWrapper {
            margin-top: 1.5vw;

            header {
                height: 1.6vw;
                padding: 0 2.3vw;
                background: rgb(36, 37, 37);

                span {
                    width: 10.92vw;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ffac29;
                }
            }

            .excelContent {
                .contentList {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(154, 154, 154, 0.06);
                    margin-bottom: 0.5vw;
                    padding: 0 2.3vw;
                    height: 1.6vw;
                    cursor: pointer;

                    .itemList {
                        text-align: center;
                        width: 10.92vw;
                        font-size: 0.7vw;

                        .delete {
                            color: rgba(255, 255, 255, 0.5);
                            margin-left: 0.5vw;
                        }
                    }
                }
            }
        }

        .noneData {
            width: 79.4vw;
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
                width: 8.1vw;
                height: 2.4vw;
                margin: 0 auto;
                color: #feab29;
            }
        }
    }

    .detail {
        width: 100%;

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .return {
                .icon {
                    /*width: 0.3vw;*/
                    /*height: 0.9vw;*/
                    margin-right: 0.4vw;
                }

                span {
                    font-size: 0.6vw;
                }
            }

            input {
                width: 15.2vw !important;
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

        /*.excelWrapper {*/

        /*    .table-list {*/
        /*        margin-top: 1.4vw;*/
        /*        header {*/
        /*            color: #ffac29;*/
        /*            height: 1.6vw;*/
        /*            background: gray;*/
        /*            font-size: 0.7vw;*/
        /*            .first, .last {*/
        /*                width: 10px;*/
        /*                height: 1.6vw;*/
        /*                border: 1px solid #ffac29;*/
        /*            }*/
        /*            .first {*/
        /*                border-right: 0px solid #ffac29;*/
        /*            }*/
        /*            .last {*/
        /*                border-left: 0px solid #ffac29;*/
        /*            }*/
        /*        }*/
        /*        .table-cell {*/
        /*            height: 1.6vw;*/
        /*            display: flex;*/
        /*            justify-content: space-between;*/
        /*            align-items: center;*/
        /*            background: #9a9a9a;*/
        /*            .space {*/
        /*                margin-top: 0.5vw;*/
        /*            }*/
        /*        }*/
        /*    }*/

        /*    .excelContent {*/
        /*        .contentList {*/
        /*            .itemList {*/
        /*                width: 8.5vw;*/
        /*            }*/
        /*        }*/
        /*    }*/
        /*}*/
    }
</style>
