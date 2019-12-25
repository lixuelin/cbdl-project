<template>
    <div class="card" v-if="is_show_list">
        <template v-for="item in investList">
            <div class="card-box" :key="item">
                <header class="card-head">
                    <div class="card-head-time">
                        <span>{{ item.create_time }}</span>
                    </div>
                    <div class="card-head-status">
                        <template v-if="item.income_status === -1">
                            <span class="card-head-status-cont">停止收益</span>
                        </template>
                        <template v-else>
                            <span class="card-head-status-cont">{{
                                income_status[item.income_status]
                            }}</span>
                        </template>
                        <Icon
                            type="ios-help-circle-outline"
                            @click="goToHelp"
                        />
                    </div>
                </header>
                <hr-view></hr-view>
                <article class="card-body">
                    <div class="card-body-invest">
                        <p class="card-body-tip">投资金额</p>
                        <p class="card-body-num">{{ item.invest_num }}</p>
                    </div>
                    <div class="card-body-income">
                        <p class="card-body-tip">获得收益</p>
                        <p class="card-body-num">{{ item.income_num }}</p>
                    </div>
                    <div class="card-body-handler">
                        <template v-if="item.income_status === 2">
                            <Button type="primary" size="small" disabled=""
                                >转入余额</Button
                            >
                        </template>
                        <template v-else-if="item.income_status === -1">
                            <Button
                                type="success"
                                size="small"
                                @click="cashMoney(item)"
                                >转入余额</Button
                            >
                        </template>
                        <template v-else>
                            <Button
                                type="primary"
                                size="small"
                                @click="cashMoney(item)"
                                >转入余额</Button
                            >
                        </template>
                    </div>
                </article>
            </div>
        </template>
        <Modal v-model="cash_list_modal" width="220">
            <p slot="header">
                <span>转入余额</span>
            </p>
            <div>
                <div class="card-body-handler-draw">
                    <p>本金 + 收益：</p>
                    <p>{{ cash_info.total }}</p>
                </div>
                <hr-view></hr-view>
                <div class="card-body-handler-draw">
                    <p>手续费：</p>
                    <p>{{ cash_info.brokerage }}</p>
                </div>
                <p class="card-body-handler-tips">
                    注：投资时间未超过72小时，按1%收取手续费
                </p>
                <hr-view></hr-view>
                <div class="card-body-handler-draw">
                    <p>实际到账：</p>
                    <p>{{ cash_info.cash }}</p>
                </div>
                <p class="card-body-handler-tips">资金返回至余额内</p>
            </div>
            <div slot="footer">
                <Button
                    type="success"
                    size="default"
                    long
                    @click="cash_list_modal_sure = true"
                    >确定</Button
                >
            </div>
        </Modal>
        <Modal v-model="cash_list_modal_sure" width="220">
            <p slot="header">
                <span>提现</span>
            </p>
            <div>
                <p>请输入提现密码：</p>
                <div class="card-body-handler-password">
                    <i-input
                        v-model="cash_pwd"
                        type="password"
                        placeholder="请输入提现密码"
                        style="width: 300px"
                    ></i-input>
                </div>
            </div>
            <div slot="footer">
                <Button
                    type="success"
                    size="default"
                    long
                    :loading="cash_loading"
                    @click="cashSure"
                    >确定</Button
                >
            </div>
        </Modal>
        <Modal v-model="cash_success" width="220">
            <p slot="header">
                <span>提现</span>
            </p>
            <div class="">
                <p>转入余额成功</p>
                <p>资金将在2小时日内到账，如有疑问请咨询客服</p>
            </div>
            <div slot="footer">
                <Button
                    type="success"
                    size="default"
                    long
                    @click="cash_success = false"
                    >确定</Button
                >
            </div>
        </Modal>
    </div>
</template>

<script>
import cut from "./cut";

export default {
    name: "card_list",
    data() {
        return {
            is_show_list: false,
            cash_list_modal: false,
            cash_list_modal_sure: false,
            cash_success: false,
            modal_loading: false,
            income_status: {
                0: "未开始收益",
                1: "收益中",
                2: "停止收益"
            },
            cash_info: {
                total: 1000,
                brokerage: 0,
                cash: 0
            },
            cash_invest: null,
            cash_pwd: "",
            loading: false,
            cash_loading: false
        };
    },
    props: ["investList", "financial"],
    components: {
        "hr-view": cut
    },
    methods: {
        goToHelp() {
            this.$router.push({ name: "help" });
        },
        goToInvest() {
            this.$router.push({ name: "invest" });
        },
        countCash(invest) {
            let data = {};
            if (invest.income_status === 0) {
                data.total =
                    Number(invest.invest_num) + Number(invest.income_num);
                data.brokerage = (Number(invest.invest_num) * 0.01).toFixed(2);
                data.cash =
                    Number(invest.invest_num) -
                    Number(invest.invest_num) * 0.01;
            } else if (
                invest.income_status === 1 ||
                invest.income_status === -1
            ) {
                data.total = invest.invest_num + Number(invest.income_num);
                data.brokerage = 0;
                data.cash = invest.invest_num + Number(invest.income_num);
            } else {
                data.total = 0;
                data.brokerage = 0;
                data.cash = 0;
            }
            return data;
        },
        cashMoney(invest) {
            this.cash_list_modal = true;
            this.cash_info = this.countCash(invest);
            this.cash_invest = invest;
        },
        async cashSure() {
            this.loading = true;
            if (this.cash_pwd === "") {
                return this.$Message.error("密码不能为空！");
            }
            let data = {
                id: localStorage.getItem("user_id"),
                cash_pwd: this.cash_pwd
            };
            this.cash_loading = true;
            let res = await this.$Http.queryUser(data);
            this.cash_loading = false;
            if (!res.data) {
                return this.$Message.error("请求失败！");
            }
            this.cashInvestMoney();
        },
        async cashInvestMoney() {
            let data = {
                user_id: localStorage.getItem("user_id"),
                invest_id: this.cash_invest.id,
                cash_num: this.cash_info.cash,
                invest_time: this.cash_invest.create_time,
                financial_id: this.financial
            };
            let res = await this.$Http.stopInvest(data);
            this.loading = false;
            if (res.status !== 200) {
                return this.$Message.error("提现失败！");
            }
            this.cash_list_modal = false;
            this.cash_list_modal_sure = false;
            this.cash_success = true;
            this.cash_pwd = "";
            this.cash_loading = false;
            let msg = {
                is_update: true
            };
            this.$emit("changeInvestList", msg);
        }
    },
    watch: {
        investList: {
            handler(newValue, oldValue) {
                this.investList = newValue;
                this.is_show_list = true;
            },
            deep: true
        }
    }
};
</script>

<style lang="less" scoped>
@import "./../assets/css/components";
</style>
