<template>
    <div class="indexWrapper"
      v-loading="loading">
        <LeftSide @load="changeLoad"/>
        <div class="rightSide">
            <sonHeader/>
            <keep-alive>
                <router-view class="rightSideContent"/>
            </keep-alive>
        </div>
        <div class="rightLine">
            <img src="@/assets/scene/rightDeoc.png"
              alt="">
        </div>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex';
    import sonHeader from "@/components/SonHeader";
    import LeftSide from "./components/LeftSide";
    import router from '../../router/index'
    export default {
        name: "index",
        components: {LeftSide, sonHeader},
        data() {
            return {
                loading: true,
            }
        },
        beforeRouteLeave(to, from, next) {
            sessionStorage.setItem('enteredIndex', true)
            next();
        },
        created() {
            // if(sessionStorage.getItem('isEdit')) {
            //     this.isEdit = true
            //     console.log(this.isEdit)
            // }
        },
        methods: {
            ...mapMutations('index', {
                setEnteredIndex: 'setEnteredIndex',
            }),
            changeLoad(payload) {
                this.loading = payload;
            }
        },
    }
</script>

<style lang="scss" scoped>
    .indexWrapper {
        display: flex;

        ::v-deep .el-loading-mask {
            background-color: rgba(0, 0, 0, 0.7);
        }
    }
    .rightSide {
        width: 79.4vw;
        .rightSideContent {
            display: flex;
            padding:1vw;
            height: 43.8vw;
            background: url('~@/assets/scene/sceneContent.png');
            background-size: 100% 100%;
        }
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
