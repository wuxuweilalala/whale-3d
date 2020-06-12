<template>
    <div id="app">

        <clickOutside>
        </clickOutside>
        <Header/>
        <router-view class="routerView"/>
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
        methods: {
            ...mapActions('index', {
                getProjectData: 'getProjectData',
            }),
			...mapActions('mould', {
				loaderMould:'loaderMould',
			}),
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
    }
</style>
