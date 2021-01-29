<template>
    <div id="app">

        <clickOutside>
        </clickOutside>
        <Header/>
        <router-view  v-if="isRouterAlive" class="routerView"/>
    </div>
</template>

<script>
    import "@/assets/common/css/reset.css"; //初始化样式
    import "@/assets/common/iconfont/icontfont.css"; //初始化样式
    import "@/assets/common/css/font.css"
    import Header from "./components/Header";
    import clickOutside from '@/components/clickOutside/index.vue'
    import { mapActions} from 'vuex';

    export default {
        name: "App",
        components: {Header, clickOutside},
        provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
            return {
                reload: this.reload
            }
        },
        data() {
            return{
                isRouterAlive: true                    //控制视图是否显示的变量
            }
        },
        methods: {
            ...mapActions('index', {
                getProjectData: 'getProjectData',
            }),
            ...mapActions('mould', {
                loaderMould:'loaderMould',
            }),
            reload () {
                this.isRouterAlive = false;            //先关闭，
                this.$nextTick(function () {
                    this.isRouterAlive = true;         //再打开
                })
            },

        },
        created(){
            this.getProjectData();
            this.loaderMould();
        },
    }
</script>

<style lang="scss">
    #app {
        position: relative;
        // padding-top: 1.3vh;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        & > .routerView {
            flex-grow: 1;
        }

        user-select: none;
    }
    input{
        width: 50%;
    }
    body {
        background: url("~@/assets/scene/bigBg.png");
        color: #fff;
        background-size: cover;
    }
</style>
