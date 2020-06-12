<template >
    <div class='project_name'>
        <div class='quit'  @click="exit"></div>
        <div class='name'>
            <span>{{title}}</span>
            <!-- <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xiala"/>
            </svg> -->
        </div>
        <!-- <div class='quit'>分享</div> -->
    </div>
</template>

<script>
export default {
	name: "ProjectBar",
    props:['title'],
	methods: {
		exit() {
			let index=this.$store.state.index.activeProjectIndex
			this.$store.commit('index/changeActiveProjectIndex',-1)
			this.$router.push({path:'/index'});
			this.$store.commit('index/changeActiveProjectIndex',index)
            this.$store.commit('index/setplayState', false);
            this.$store.commit('index/setplayState', false);
            this.$store.commit('index/setFirstPlay', true);
            this.$store.commit('index/setMoveTime', 0);
            this.$store.commit('index/setTotalTime', 0);
            this.$store.commit('index/setCurrentProjectData', {
                projectId: -1,
                bool: false,
                projectData: [],
            })
		}
	},
}
</script>

<style lang='scss' scoped>
.project_name{
    position: absolute;
    top: 1vh;
    left: 1.8vh;
    right: 2.4vw;
    // background: #2f2f2f;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    font-size: 0.8vw;
    padding:0.5vh 0.6vw;
    .quit{
        cursor: pointer;
        width: 2.6vw;
        height: 3.6vh;
        background: url("~@/assets/scene/back.png");
        background-size: 100% 100%;
        display: flex;
        font-size: 0.6vw;
        align-items: center;
        justify-content: center;
    }
    .name{
        margin-left: 0.3vw;
        width: 13.9vw;
        height: 4vh;
        background: url("~@/assets/scene/title.png");
        padding: 0.7vh 0 0 1vw;
        background-size: 100% 100%;
    }
    span {
        width: 7.5vw;
        height: 1.7vh;
        font-family: SourceHanSansCN-Regular;
        font-size: 0.9vw;
        font-weight: normal;
        font-stretch: normal;
        line-height: 1.7vh;
        letter-spacing: 0vw;
        color: #ffffff;
    }
}
</style>
