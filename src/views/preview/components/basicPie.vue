<template>
    <v-chart :options="charOptions" autoresize/>
</template>
<script>
import ECharts  from 'vue-echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
export default {
	name: 'basicPie',
    props:{
		inventory:Object,
        },
	components: {
		'v-chart': ECharts
	},
	computed:{
		charOptions(){
			let surplus=this.inventory.all-this.inventory.used
			let option = {
				tooltip: {
					show: true,
				},
				series: [
					{
						type: 'pie',
						radius: ['75%', '85%'],
						center: ['50%', '50%'],
						hoverAnimation: false,
						z: 10,
						label: {
							position: 'center',
							formatter: () => {
								return this.inventory.title + "\r\n{total|" + surplus + '}' + this.inventory.unit;
							},
							rich: {
								total: {
									color: '#fff',

								},
							},
							color: '#fff',
							lineHeight: 20,
						},
						data: [
							{
								value: this.inventory.used,
								name: '使用量',
								itemStyle: {
									color: '#ffac29',
									shadowBlur: 15,
									borderColor:'#ffac29',
									shadowColor: '#ffac29'
								},
							},
							{
								value: this.inventory.all,
								name: '库存总数',
								itemStyle: {
									color: '#9a9a9a',

								},
							},

						],
						labelLine: {
							show: false,
						},
					},
					{
						type: 'pie',
						radius: ['60%', '70%'],
						center: ['50%', '50%'],
						hoverAnimation: false,
						label: {
							show: false,
						},
						data: [
							{
								value:this.inventory.used,
								name: '使用量',
								itemStyle: {
									color: '#ffac29',
									opacity: 0.3,
								},
							},
							{
								value: this.inventory.all,
								name: '库存总数',
								itemStyle: {
									color: '#9a9a9a',
									opacity: 0.3,
								},
							},

						],
						labelLine: {
							show: false,
						},
					},

				],
			}
			return option;
		}
	},
	methods:{

	},
	mounted() {
	},
};
</script>
<style scoped>
    .echarts {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
    }
</style>
