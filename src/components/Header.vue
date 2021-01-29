<template>
    <header>
        <div class="logoWrapper"
          @click="$router.push({path:'/index'})">
            <img class="logo"
              src="@/assets/scene/logo.png"
              alt="">
            <span>仿真模拟系统</span>
        </div>
        <div class="scale">
            <img src="@/assets/scene/scale.png"
              alt="">
        </div>
        <div class="nowTime">
            <svg class="icon"
              aria-hidden="true">
                <use xlink:href="#icon-duoyun"/>
            </svg>
            <span>17℃</span>
            <img class="line"
              src="@/assets/scene/weatherLine.png"
              alt="">
            <span>{{nowDate}}</span>
            <span>{{nowTime}}</span>
        </div>
        <!--        <div class="rightDec">-->
        <!--            <img src="@/assets/scene/rightDecrotion.png"-->
        <!--              alt="">-->
        <!--        </div>-->
    </header>
</template>

<script>
export default {
	name: 'Header',
	data() {
		return {
			nowDate: '',
			nowTime: '',
            timer:'',
		};
	},

	methods: {
		showTime() {
			let nowtime = new Date();
			let year = nowtime.getFullYear();//年
			let month = ('0'+(nowtime.getMonth() + 1)).slice(-2);//月
			let day =  ('0'+nowtime.getDate()).slice(-2);//日
			let hour =('0'+nowtime.getHours()).slice(-2);//时
			let minutes = ('0'+nowtime.getMinutes()).slice(-2); //分
			let seconds = ('0'+nowtime.getSeconds()).slice(-2); //秒
            this.nowDate=`${year}-${month}-${day}`;
            this.nowTime=`${hour}:${minutes}:${seconds}`
		},
	},
	mounted(){
		this.timer=setInterval(()=>{this.showTime()}, 1000);
    },
    beforeDestroy(){
		clearInterval(this.timer)
    },
};

</script>

<style lang="scss"
  scoped>
    header {
        display: flex;
        align-items: center;
        // padding: 0 2.3vw 0 1.5vw;
        height: 6.9vh;
        /*margin-top: 0.5vw;*/
        .logoWrapper {
            display: flex;
            align-items: flex-end;
            cursor: pointer;

            .logo {
                width: 6.9vw;
                height: 1.7vw;
            }

            span {
                font-size: 0.8vw;
                font-weight: bold;
                padding-left: 0.3vw;
            }
        }

        .scale {
            width: 71.8vw;

            img {
                width: 71.8vw;
            }
        }

        .nowTime {
            width: 13.5vw;
            font-size: 0.8vw;
            height: 1.9vw;
            margin-left: 0.9vw;
            margin-right: 0.5vw;
            display: flex;
            padding: 0.5vw 0.5vw;
            align-items: center;
            background: url('~@/assets/scene/weather.png');
            background-size: 100% 100%;

            .icon {
                width: 1.6vw;
                height: 1.7vw;
            }

            span {
                margin-right: 0.3vw;
                white-space: nowrap;

                &:last-child {
                    margin: 0;
                }
            }

            .line {
                margin-right: 0.5vw;
            }
        }

    }
</style>
