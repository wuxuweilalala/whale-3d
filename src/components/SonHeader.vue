<template>
    <header>
        <div :class="[{'choosed':$route.path === item.path},'sonItem']"
          v-for="(item,index) in routerData" :key="index"
          @click="toRoute(item)">{{item.name}}</div>
    </header>
</template>

<script>
    export default {
        name: "sonHeader",
        data(){
            return {
                routerData:[{
                    name:'场景',
                    path:'/index/scene'
                },
                {
                    name:'配置参数',
                    path:'/index/parameters'
                },{
                    name:'库存',
                    path:'/index/inventory'
                },
                {
                    name:'订单',
                    path:'/index/order'
                }]
            }
        },
        methods:{
            toRoute(item){
                this.$router.push({path:item.path})
            }
        }
    }
</script>

<style lang="scss" scoped>
    header {
        display: flex;
        .sonItem {
            margin-right: 0.7vw;
            cursor: pointer;
            padding: 0.4vw 2.7vw 0.4vw 2vw;
            background: url('~@/assets/scene/scene.png');
            background-size: 100% 100%;
          &.choosed{
              background: url('~@/assets/scene/sceneChosed.png');
              background-size: 100% 100%;
            }
        }
    }
</style>
