<template>
	<div class="admin-index">
		<ul class="admin-index-count">
			<template v-for="item in count_list">
				<li :style="{background: item.bgColor}">
					<h4>{{item.name}}</h4>
					<div class="admin-index-count-num">
						<!--<span>{{item.total}}</span>-->
						<countTo :startVal='count_to.startVal' :endVal='item.total' :duration='count_to.duration'
						         :decimals="count_to.float"></countTo>
					</div>
				</li>
			</template>
		
		</ul>
	</div>
</template>

<script>
    import countTo from "vue-count-to";
    import { queryCount } from "./../../utils/admin_api";
    
    export default {
        name: "admin_index",
        data() {
            return {
                count_to: {
                    startVal: 0,
                    duration: 1200,
                    float: 1
                },
                count_list: [
                    {
                        name: "投资",
                        bgColor: "#ea895f",
                        total: 10000
                    },
                    {
                        name: "收益",
                        bgColor: "#71c5f4",
                        total: 10000
                    },
                    {
                        name: "奖金",
                        bgColor: "#fa6567",
                        total: 10000
                    },
                    {
                        name: "提现",
                        bgColor: "#64d293",
                        total: 10000
                    }
                ]
            };
        },
        components: {
            countTo
        },
        mounted() {
            this.getCount();
        },
        methods: {
            getCount() {
                queryCount().then(response => {
                    let data = response.data.data;
                    this.count_list.forEach((item, i) => {
                        item.total = data[i];
                        console.log(i, "ddd");
                    });
                    console.log(data);
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    };
</script>

<style lang="less" scoped>
	@import "./../../assets/admin/home";
</style>