<template>
    <div class="card" v-if="is_show_list">
        <template v-for="(item, index) in investList">
            <div class="card-box">
                <header class="card-head">
                    <div class="card-head-time">
                        <span>{{item.create_time}}</span>
                    </div>
                    <div class="card-head-status">
                        <span class="card-head-status-cont">{{income_status[item.income_status]}}</span>
                        <Icon type="ios-help-circle-outline" @click="goToHelp" />
                    </div>
                </header>
                <hr-view></hr-view>
                <article class="card-body">
                    <div class="card-body-invest">
                        <p class="card-body-tip">投资金额</p>
                        <p class="card-body-num">{{item.invest_num}}</p>
                    </div>
                    <div class="card-body-income">
                        <p class="card-body-tip">获得收益</p>
                        <p class="card-body-num">{{item.income_num}}</p>
                    </div>
                    <div class="card-body-handler">
                        <template v-if="item.income_status === 2">
                            <Button type="primary" size="small" disabled="">提现</Button>
                        </template>
                        <template v-else>
                            <Button type="primary" size="small" @click="cashMoney(item)">提现</Button>
                        </template>
                    </div>
                </article>
            </div>
        </template>
        <Modal v-model="cash_list_modal" width="220">
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
                <Button type="success" size="default" long @click="cash_list_modal_sure = true">确定</Button>
            </div>
        </Modal>
        <Modal v-model="cash_list_modal_sure" width="220">
            <p slot="header">
                <span>提现</span>
            </p>
            <div>
                <p>请输入提现密码：</p>
                <div class="card-body-handler-password">
                    <i-input v-model="cash_pwd" type="password" placeholder="请输入提现密码" style="width: 300px"></i-input>
                </div>
            </div>
            <div slot="footer">
                <Button type="success" size="default" long :loading="loading" @click="cashSure">确定</Button>
            </div>
        </Modal>
      <Modal v-model="cash_success" width="220">
        <p slot="header">
          <span>提现</span>
        </p>
        <div class="">
          <p>提现成功</p>
          <p>资金将在2小时日内到账，如有疑问请咨询客服</p>
        </div>
        <div slot="footer">
          <Button type="success" size="default" long @click="cash_success=false">确定</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
    import {mylocalStorage, IncomeCashOne, checkCashPwd} from "../utils/request_api";
    import cut from "./cut"
    export default {
        name: "card_list",
        data () {
            return {
	            is_show_list: false,
	            cash_list_modal: false,
	            cash_list_modal_sure: false,
              cash_success: false,
                modal_loading: false,
                income_status: {
                    0: "未开始收益",
                    1: "收益中",
                    2: "停止收益",
                },
                cash_info: {
                	total: 1000,
                  brokerage: 0,
	                cash: 0
                },
                cash_invest: null,
	            cash_pwd: "",
	            loading: false
            }
        },
        props: ["investList"],
        components: {
            "hr-view": cut
        },
        mounted () {
        	console.log(this.investList)
        },
        methods: {
	        goToHelp() {
		        this.$router.push({"name": "help"});
            },
	        goToInvest () {
		        this.$router.push({"name": "invest"});
	        },
            countCash(invest) {
            	let data = {}
	            if (invest.income_status === 0) {
		            data.total = Number(invest.invest_num) + Number(invest.income_num);
		            data.brokerage = (Number(invest.invest_num) * 0.01).toFixed(2);
		            data.cash =  Number(invest.invest_num) - (Number(invest.invest_num) * 0.01);
	            } else if (invest.income_status === 1) {
		            data.total = invest.invest_num + Number(invest.income_num);
		            data.brokerage = 0;
		            data.cash = invest.invest_num + Number(invest.income_num) ;
              }
	            return data;
            },
	        cashMoney(invest){
	        	this.cash_list_modal = true;
		        // this.modal_loading = true;
		        this.cash_info = this.countCash(invest);
		        this.cash_invest = invest
            },
	        cashSure () {
		        this.loading = true;
		        let user_id = mylocalStorage.getItem("user_id")
                if (this.cash_pwd === "") {
                	return this.$Message.error("密码不能为空！")
                }
		        let data = {
			        user_id,
			        cash_pwd: this.cash_pwd
		        };
		        checkCashPwd(data).then(response => {
                    let is_exist = response.data.data.is_exist;
                    if (is_exist) {
                    	this.cashInvestMoney(user_id);
                    } else {
                        this.loading = false;
                        this.$Message.error("密码错误！")
                    }
                }).catch(error => {
                  this.loading = false
                	console.log(error)
                });
		        
	        },
            cashInvestMoney(user_id) {
	            let data = {
		            user_id: user_id,
		            invest_id: this.cash_invest.id,
                invest_num: this.cash_invest.invest_num,
                brokerage: this.cash_info.brokerage,
                cash_num: this.cash_info.cash,
                income_num: this.cash_invest.income_num
	            };
	            IncomeCashOne(data).then(response => {
	            	let cash_status = response.data.data.success
	            	if (cash_status) {
			            this.cash_list_modal = false;
			            this.cash_list_modal_sure = false;
			            this.cash_success = true
                  this.loading = false
			            this.cash_pwd = "";
			            let msg = {
			            	is_update: true
                        }
			            this.$emit("changeInvestList", msg);
		            }
	                console.log(response)
	            }).catch(error => {
		            this.$Message.error("提现失败！");
	                console.log(error)
	            })
            }
        },
	    watch: {
		    investList: {
			    handler(newValue, oldValue) {
				    this.investList = newValue
                    this.is_show_list = true
			    },
			    deep: true
		    }
	    }
    }
</script>

<style lang="less" scoped>
    @import "./../assets/css/components";
</style>
