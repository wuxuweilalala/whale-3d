<template>
<div class="parameters"  v-loading="loading">
    <div class="parametersContent">
        <dropList :selected="currentIndex" v-for="(item,index) in dataList"  :key="index"  :list="pstList(item)" :type="item"  />
    </div>
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
        导入
    </el-upload>
</div>
</template>

<script>
    import dropList from "./dropList";
    import XLSX from 'xlsx'
    import { mapGetters, mapMutations, mapActions } from 'vuex';

    export default {
        name: "parameters",
        components:{
            dropList
        },
        computed:{
            ...mapGetters('index', {
                machineList: 'getMachineList',
            }),
            pstList() {
                return (type)=>{
                    return this.machineList.filter(e=>e.type===type)
                }
            },
        },
        data(){
            return {
                dataList:['pst', 'psb', 'pick'],
                currentIndex:'pst',
                loading: false,
                projectId: '',
            }
        },
        created() {
            this.getData()
            this.projectId = sessionStorage.getItem('projectId')
        },
        methods:{
            ...mapMutations('index', {
                setMachineList: 'setMachineList',
            }),
            handleUploadChange(item, file) {
                this.loading = true;
            },
            getData() {
                this.$get('sorterDataReadOrWrite').then(res => {
                    if(res.code == 200) {
                        let data = res.data
                        for (let i = 0, len = data.length; i < len; i++) {
                            let d = data[i]
                            if(d.projectId == this.projectId) {
                                this.setMachineList(d.list)
                            }
                        }
                    }
                }).catch(err => {
                    console.error(err)
                })
            },
            readExcel(file) {
                return new Promise((resolve, reject) => {
                    let reader = new FileReader()
                    reader.onload = function (event) {
                        let data = event.target.result
                        let workbook = XLSX.read(data, {type:'binary'})
                        resolve(workbook)
                    }
                    reader.onerror = function (e) {
                        reject(e)
                    }
                    reader.readAsBinaryString(file)
                })
            },
            readWorkbook(workbook) {
                let sheetNames = workbook.SheetNames; // 工作表名称集合
                let worksheet = workbook.Sheets[sheetNames[0]]; // 这里我们只读取第一张sheet
                let csv = XLSX.utils.sheet_to_csv(worksheet);
                let csvs = csv.split('\n')
                // 最后一行没用
                csvs.pop()
                csvs[0] = csvs[0].split(',')
                for (let i = 1, len = csvs.length; i < len; i++) {
                    csvs[i] = csvs[i].split(',')
                }
                return csvs
            },
            async putData() {
                let res = await this.$get('sorterDataReadOrWrite')
                let data = res.data
                data.push({
                    projectId: this.projectId,
                    list: this.machineList
                })
                this.$put('sorterDataReadOrWrite', data).then(res => {
                    // console.log('res', res)
                }).catch(err => {
                    console.error(err)
                })
            },
            importExcel(response) {
                this.readExcel(response.file).then(res => {
                    var csvs = this.readWorkbook(res)
                    let result = []
                    for (let i = 1, len = csvs.length; i < len; i++) {
                        let rows = csvs[i]
                        let obj = {}
                        for (let j = 0, n = rows.length; j < n; j++) {
                            let row = rows[j]
                            obj[csvs[0][j]] = row
                        }
                        result.push(obj)
                    }
                    this.setMachineList(result)
                    this.putData()
                    this.loading = false
                })
            },
        },
    }
</script>

<style lang="scss">
     .el-upload-list {
         display: none;
     }

    .el-loading-mask {
        background-color: rgba(0, 0, 0, 0.9);
    }
</style>

<style lang="scss" scoped>
.parameters {
    display: flex;
    width: 100%;
    position: relative;
    padding:2.78vh 0 2vh 1.2vw !important;
 .btn{
     position: absolute;
     right: 3.04vw;
     width: 4.69vw;
     height: 1.67vw;
     display: flex;
    align-items: center;
     color: rgba(255,255,255,0.7);
     justify-content: center;
     font-size: 0.73vw;
     background: url("../../assets/scene/importicon.png") no-repeat;
     background-size: 100% 100%;
     img{
         width: 0.68vw;
         height: 0.68vw;
         margin-right: 0.2vw;
     }
 }
    .parametersContent {
        width: 99%;
        height: 100%;
        overflow-y: scroll;
        &::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 0.63vw;   /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
        }
        &::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            width: 0.63vw;
            height: 3.54vw;
            background-color: rgba(83, 87, 89, 1);
            box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
        }
        &   ::-webkit-scrollbar-track {
            /*滚动条里面轨道*/
            box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
        }
        /*&::-webkit-scrollbar {display:none}*/

    }
}
</style>
