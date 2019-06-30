<template>
	<div class="income">
		<div class="income-count">
			<div class="income-count-cont">
				<p>总本金 + 总收益</p>
				<!--<p >{{count}}</p>-->
				<div class="income-count-cont-num">
					<countTo :startVal='total.startVal' :endVal='total.endVal' :duration='total.speed'
					         :decimals="total.float"></countTo>
				</div>
			</div>
			<div class="income-count-btn">
				<template v-if="total.endVal === 0">
					<i-button type="primary" disabled>全部提现</i-button>
				</template>
				<template v-else>
					<i-button type="primary" @click="cashAll">全部提现</i-button>
				</template>
				
				<i-button type="primary" @click="goToInvest">我要投资</i-button>
			</div>
		</div>
		<div class="income-invest">
			<div class="income-title">
				<h3>投资笔数</h3>
			</div>
			<card-view :investList="invest_list" @changeInvestList="isUpdateInvest"></card-view>
		</div>
		<foot></foot>
		<Modal v-model="cash_modal" width="220">
			<p slot="header">
				<span>提现</span>
			</p>
			<div>
				<div class="card-body-handler-draw">
					<p>本金 + 收益：</p>
					<p>{{cash_info.total}}</p>
				</div>
				<hr-view></hr-view>
				<div class="card-body-handler-draw">
					<p>手续费：</p>
					<p>{{cash_info.brokerage}}</p>
				</div>
				<p class="card-body-handler-tips">注：投资时间未超过72小时，按1%收取手续费</p>
				<hr-view></hr-view>
				<div class="card-body-handler-draw">
					<p>实际到账：</p>
					<p>{{cash_info.cash}}</p>
				</div>
				<p class="card-body-handler-tips">资金返回至注册时填写的银行卡内</p>
			</div>
			<div slot="footer">
				<Button type="primary" size="default" long @click="cash_modal_sure = true">确定</Button>
			</div>
		</Modal>
		<Modal v-model="cash_modal_sure" width="220">
			<p slot="header">
				<span>提现</span>
			</p>
			<div>
				<p>请输入提现密码：</p>
				<div class="card-body-handler-password">
					<i-input v-model="cash_pwd" type="password" placeholder="请输入提现密码" style="width: 220px"></i-input>
				</div>
			</div>
			<div slot="footer">
				<i-button type="primary" long @click="cashAllSure">
					<span>确定</span>
				</i-button>
			</div>
		</Modal>
		<Modal v-model="cash_all_success" width="220">
			<p slot="header">
				<span>提现</span>
			</p>
			<div class="">
				<p>提现成功</p>
				<p>资金将在2个小时内到账，如有疑问请咨询客服</p>
			</div>
			<div slot="footer">
				<Button type="success" size="default" long @click="cash_all_success=false">确定</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
    import cut from "./../components/cut";
    import countTo from "vue-count-to";
    import card from "./../components/card_list";
    import foot from "./../components/foot";
    import { sumBy } from "lodash";
    import {
        mylocalStorage,
        queryIncomeTotal,
        queryInvestList,
        checkCashPwd,
        IncomeCashAll
    } from "./../utils/request_api";
    
    export default {
        name: "income",
        data() {
            return {
                total: {
                    startVal: 0,
                    endVal: 0,
                    duration: 0,
                    float: 2
                },
                cash_info: {
                    total: 0,
                    brokerage: 0,
                    cash: 0,
                    invest_num: 0
                },
                cash_all_success: false,
                cash_modal: false,
                cash_modal_sure: false,
                invest_list: [],
                cash_pwd: "",
                income_total: 0,
                invest_num: 0,
                loading: false
            };
        },
        components: {
            "hr-view": cut,
            "card-view": card,
            foot,
            countTo
        },
        mounted() {
            this.queryTotal();
            this.queryList();
        },
        methods: {
            goToInvest() {
                this.$router.push({ "name": "invest" });
            },
            queryTotal() {
                let data = {
                    user_id: mylocalStorage.getItem("user_id")
                };
                if (mylocalStorage.getItem("user_id") === "" || mylocalStorage.getItem("user_id") === null) {
                    return;
                }
                queryIncomeTotal(data).then(response => {
                    if (response.data.status === 200) {
                        let data = response.data.data;
                        this.income_total = data[1].total;
                        let total = 0;
                        data.forEach(num => {
                            total += num.total;
                        });
                        this.total.endVal = total;
                    } else {
                        this.$Message.error("操作失败");
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            isUpdateInvest(data) {
                if (data.is_update) {
                    this.queryList();
                    this.queryTotal();
                }
            },
            queryList() {
                let data = {
                    user_id: mylocalStorage.getItem("user_id")
                };
                if (mylocalStorage.getItem("user_id") === "" || mylocalStorage.getItem("user_id") === null) {
                    return;
                }
                queryInvestList(data).then(response => {
                    this.invest_list = response.data.data;
                }).catch(error => {
                    console.log(error);
                    this.$Message.error("投资数据获取失败");
                });
            },
            countCash(invest) {
                let data = {};
                if (invest.income_status === 0) {
                    this.invest_num = invest.invest_num;
                    data.total = Number(invest.invest_num) + Number(invest.income_num);
                    data.brokerage = Number(invest.invest_num) * 0.01;
                    data.cash = Number(invest.invest_num) - (Number(invest.invest_num) * 0.01);
                } else if (invest.income_status === 1) {
                    data.total = invest.invest_num + Number(invest.income_num);
                    data.brokerage = 0;
                    data.cash = invest.invest_num;
                }
                return data;
            },
            cashAll() {
                this.cash_modal = true;
                let count = this.invest_list.map(invest => {
                    return this.countCash(invest);
                });
                let invest_total = sumBy(count, invest => {
                    if (invest) {
                        return invest.cash;
                    }
                });
                
                let invest_brokerage = sumBy(count, invest => {
                    if (invest) {
                        return invest.brokerage;
                    }
                });
                
                this.cash_info = {
                    total: this.total.endVal,
                    brokerage: Number(invest_brokerage).toFixed(2),
                    cash: (Number(invest_total) + this.income_total).toFixed(2),
                    invest_num: invest_total.toFixed(2)
                };
            },
            cashAllSure() {
                this.loading = true;
                let user_id = mylocalStorage.getItem("user_id");
                if (this.cash_pwd === "") {
                    return this.$Message.error("密码不能为空！");
                }
                let data = {
                    user_id,
                    cash_pwd: this.cash_pwd
                };
                checkCashPwd(data).then(response => {
                    let is_exist = response.data.data.is_exist;
                    if (is_exist) {
                        this.cashAllInvest(user_id);
                    } else {
                        this.$Message.error("密码错误！");
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            cashAllInvest(user_id) {
                let data = {
                    user_id: Number(user_id),
                    cash_num: Number(this.cash_info.cash).toFixed(1),
                    brokerage: Number(this.cash_info.brokerage).toFixed(1),
                    income_num: Number(this.income_total).toFixed(1),
                    invest_num: Number(this.cash_info.invest_num).toFixed(1)
                };
                IncomeCashAll(data).then(response => {
                    let cash_status = response.data.data.success;
                    if (cash_status) {
                        this.cash_modal = false;
                        this.cash_modal_sure = false;
                        this.loading = false;
                        this.cash_all_success = true;
                        this.cash_pwd = "";
                        setTimeout(() => {
                            this.cash_all_success = false;
                        }, 2000);
                        let msg = {
                            is_update: true
                        };
                        this.$Message.success("提现成功，2小时内未到账请联系客服!");
                        this.queryList();
                        this.queryTotal();
                    }
                }).catch(error => {
                    this.$Message.error("提现失败！");
                    console.log(error);
                });
            }
        }
        
    };
</script>

<style lang="less" scoped>
	@import "./../assets/css/income";
	@import "./../assets/css/components";
</style>
