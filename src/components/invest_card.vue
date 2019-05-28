<template>
    <div class="invest-card">
        <div>
            <ul>
                <template v-for="item in invest">
                    <li>
                        <div class="invest-card-title">
                            <h4>{{item.title}}</h4>
                            <div class="invest-card-title-btn">
                                <i-button type="error" size="small">{{item.risk}}</i-button>
                            </div>
                        </div>
                        <div class="invest-card-body">
                            <div class="invest-card-body-box">
                                <div class="invest-card-body-rate">
                                    <p class="invest-card-body-rate-cont">{{item.rate.num}}</p>
                                    <p class="invest-card-body-tip">{{item.rate.tip}}</p>
                                </div>
                            </div>
                            <div class="invest-card-body-box">
                                <div class="invest-card-body-time">
                                    <p class="invest-card-body-time-cont">{{item.expired.num}}</p>
                                    <p class="invest-card-body-tip">{{item.expired.tip}}</p>
                                </div>
                            </div>
                            <div class="invest-card-body-box">
                                <div class="invest-card-body-btn">
                                    <i-button type="primary" size="small" @click="goToInvest">投资</i-button>
                                    <p class="invest-card-body-tip">{{item.btn.tip}}</p>
                                </div>
                            </div>
                        </div>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>

<script>
	export default {
		name: "invest_card",
        data () {
			return {
				invest: [
					{
						title: "创博动力 - 005857",
                        risk: "低风险",
                        rate: {
	                        num: "4%",
	                        tip: "预计年化收益"
                        },
						expired: {
							tip: "投资期限",
							num: 30
                        },
                        btn: {
							tip: "3000起投"
                        }
					},
					{
						title: "创博动力 - 005857",
						risk: "低风险",
						rate: {
							num: "4%",
							tip: "预计年化收益"
						},
						expired: {
							tip: "投资期限",
							num: 30
						},
						btn: {
							tip: "3000起投"
						}
					},
					{
						title: "创博动力 - 005857",
						risk: "低风险",
						rate: {
							num: "4%",
							tip: "预计年化收益"
						},
						expired: {
							tip: "投资期限",
							num: 30
						},
						btn: {
							tip: "3000起投"
						}
					},
					{
						title: "创博动力 - 005857",
						risk: "低风险",
						rate: {
							num: "4%",
							tip: "预计年化收益"
						},
						expired: {
							tip: "投资期限",
							num: 30
						},
						btn: {
							tip: "3000起投"
						}
					},
					{
						title: "创博动力 - 005857",
						risk: "低风险",
						rate: {
							num: "4%",
							tip: "预计年化收益"
						},
						expired: {
							tip: "投资期限",
							num: 30
						},
						btn: {
							tip: "3000起投"
						}
					},
					{
						title: "创博动力 - 005857",
						risk: "低风险",
						rate: {
							num: "4%",
							tip: "预计年化收益"
						},
						expired: {
							tip: "投资期限",
							num: 30
						},
						btn: {
							tip: "3000起投"
						}
					},
					{
						title: "创博动力 - 005857",
						risk: "低风险",
						rate: {
							num: "4%",
							tip: "预计年化收益"
						},
						expired: {
							tip: "投资期限",
							num: 30
						},
						btn: {
							tip: "3000起投"
						}
					},
					{
						title: "创博动力 - 005857",
						risk: "低风险",
						rate: {
							num: "4%",
							tip: "预计年化收益"
						},
						expired: {
							tip: "投资期限",
							num: 30
						},
						btn: {
							tip: "3000起投"
						}
					},
                ]
            }
        },
        methods: {
	        goToInvest () {
		        this.$router.push({"name": "invest"});
            }
        }
	}
</script>

<style lang="less" scoped>
    @import "./../assets/css/components";
</style>