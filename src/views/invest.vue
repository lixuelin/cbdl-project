<template>
    <div class="invest">
        <div class="invest-module">
            <h3>选择投资金额</h3>
            <div class="invest-module-bank">
                <ul>
                    <template v-for="(item, index) in invest_check_money">
                        <li @click="checkInvestMoney(index)" :key="item">
                            <div
                                :class="{
                                    'invest-module-bank-num': true,
                                    'invest-module-bank-checked':
                                        index === checked_money.index
                                }"
                            >
                                <span>{{ item }}</span>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
        <div class="invest-module invest-module-abeam">
            <h3>支付方式</h3>
            <div class="invest-module-way">
                <ul>
                    <template v-for="(item, index) in invest_check_pay">
                        <li @click="checkInvestPay(index)" :key="item">
                            <div
                                :class="{
                                    'invest-module-pay': true,
                                    'invest-module-wx': index === 0,
                                    'invest-module-ali': index === 1,
                                    'invest-module-pay-checked':
                                        index === checked_pay.index
                                }"
                            >
                                <template v-if="index === 0">
                                    <span
                                        class="iconfont icon-weixinzhifu"
                                    ></span>
                                </template>
                                <template v-else>
                                    <span class="iconfont icon-alipay"></span>
                                </template>
                                <span>{{ item }}</span>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
        <div class="invest-sure">
            <div class="invest-sure-btn"></div>
        </div>
        <div class="invest-module">
            <h3>投资总额</h3>
            <div class="invest-module-count">
                <div class="invest-module-count-invest">
                    <p>{{ total.invest }}</p>
                    <span>投资金额</span>
                </div>
                <div class="invest-module-count-income">
                    <p>{{ total.income }}</p>
                    <span>投资收益</span>
                </div>
            </div>
        </div>
        <div class="invest-module">
            <h3>投资笔数</h3>
            <card-view
                :investList="invest_list"
                :financial="financial_id"
                @changeInvestList="isUpdateInvest"
            ></card-view>
        </div>
        <foot></foot>
        <Modal v-model="show_text_trade" width="220">
            <p slot="header">
                <span>投资</span>
            </p>
            <div>
                <p>请输入交易密码：</p>
                <div class="card-body-handler-password">
                    <i-input
                        v-model="cash_pwd"
                        type="password"
                        placeholder="请输入交易密码"
                        style="width: 220px"
                    ></i-input>
                </div>
            </div>
            <div slot="footer">
                <i-button
                    type="primary"
                    long
                    :loading="loading"
                    @click="trade_Sure"
                >
                    <span>确定</span>
                </i-button>
            </div>
        </Modal>
    </div>
</template>

<script>
import Clipboard from "clipboard";
import card from "./../components/card_list";
import foot from "./../components/foot";
import { mylocalStorage, userInvest } from "./../utils/request_api";

export default {
    name: "invest",
    data() {
        return {
            financial_id: 1,
            invest_show_way: false,
            modal2: false,
            modal_loading: false,
            invest_msg: "",
            banner: {
                speed: 1500
            },
            balance_count: 0,
            total: {
                invest: 0,
                income: 0
            },
            company: "深圳市鑫鼎翔电子商务有限公司",
            bank_code: "41005000040046406",
            bank_add: "中国农业银行深圳中心区支行",
            show_text_trade: false,
            cash_pwd: "",
            checked_money: {
                index: null,
                money: null
            },
            invest_check_money: [1000, 5000, 10000, 30000],
            checked_pay: {
                index: null,
                pay: "转账"
            },
            invest_check_pay: ["余额转账"],
            invest_list: [],
            is_sure: true
        };
    },
    created() {
        this.financial_id = this.$route.params.financial_id;
        if (this.financial_id && this.financial_id === 2) {
            this.invest_check_money.pop();
        }
        this.getBalance();
        this.getInvestList();
        this.getInvestCount();
        this.isSureInvest();
    },
    components: {
        "card-view": card,
        foot
    },
    methods: {
        checkInvestMoney(index) {
            this.checked_money.index = index;
            this.checked_money.money = this.invest_check_money[index];
        },
        checkInvestPay(index) {
            this.isSureInvest();
            this.checked_pay.index = index;
            this.checked_pay.pay = this.invest_check_pay[index];
            if (index === 0) {
                this.checked_pay.index = 0;
                this.checked_pay.pay = this.invest_check_pay[0];
                if (this.checked_money.index === null) {
                    this.$Message.warning("请先选择投资金额！");
                    return;
                }

                if (!this.is_sure) {
                    this.$Message.warning(
                        "当前有投资申请正在等待审核，请稍后再试！"
                    );
                    return;
                }

                if (
                    Number(this.checked_money.money) <=
                    this.balance_count.toFixed(1)
                ) {
                    this.show_text_trade = true;
                } else {
                    this.$Message.warning("你的余额不足，请充值！");
                }
            }
            if (index === 1) {
                this.$Message.warning("支付宝功能正在维护中！");
                this.checked_pay.index = 0;
                this.checked_pay.pay = this.invest_check_pay[0];
            }
        },
        ctrlCBtn() {
            let clipboard = new Clipboard(".ctrlBtn");
            clipboard.on("success", e => {
                this.$Message.warning("已复制至剪贴板");
                setTimeout(() => {
                    //  self.$emit("closeshare")
                }, 2000);
                e.clearSelection();
                // 释放内存
                clipboard.destroy();
            });
            //失败回调
            clipboard.on("error", e => {
                this.$Message.warning("该浏览器不支持一键复制,请手动复制");
                setTimeout(() => {
                    this.$emit("closeshare");
                }, 2000);
                // 释放内存
                clipboard.destroy();
            });
        },
        async isSureInvest() {
            let data = {
                user_id: mylocalStorage.getItem("user_id")
            };
            let res = await this.$Http.queryBalanceLastInvest(data);
            if (res.status !== 200) {
                return this.$Message.error("请求失败！");
            }
            this.is_sure = res.data.is_sure;
        },
        async getBalance() {
            let data = {
                user_id: localStorage.getItem("user_id")
            };
            let res = await this.$Http.queryBalanceTotal(data);
            if (res.status !== 200) {
                return this.$Message.error("请求失败！");
            }
            this.balance_count = res.data.count;
        },
        async getInvestList() {
            let data = {
                user_id: localStorage.getItem("user_id"),
                financial_id: this.financial_id
            };
            let res = await this.$Http.queryInvestList(data);
            if (res.status !== 200) {
                return this.$Message.error("请求失败！");
            }
            this.invest_list = res.data;
        },
        async getInvestCount() {
            let data = {
                user_id: localStorage.getItem("user_id"),
                financial_id: this.financial_id
            };
            let arr = [
                this.$Http.queryIncomeCount(data),
                this.$Http.queryInvestTotal(data)
            ];
            let res = await Promise.all(arr);
            res.forEach(data => {
                if (data.status !== 200) {
                    return this.$Message.error("请求失败！");
                }
            });
            this.total.income = res[0].data.total;
            this.total.invest = res[1].data.total;
        },
        isUpdateInvest(data) {
            if (data.is_update) {
                this.getInvestList();
                this.getInvestCount();
                this.getBalance();
            }
        },
        async trade_Sure() {
            if (this.cash_pwd === "") {
                return this.$Message.error("密码不能为空！");
            }
            let data = {
                id: localStorage.getItem("user_id"),
                cash_pwd: this.cash_pwd
            };
            this.loading = true;
            let res = await this.$Http.queryUser(data);
            if (res.data) {
                this.postInvest();
            } else {
                this.loading = false;
                this.$Message.error("交易密码错误！");
            }
        },
        async postInvest() {
            let data = {
                user_id: localStorage.getItem("user_id"),
                invest_num: this.checked_money.money,
                invest_pay: this.checked_pay.pay,
                financial_id: this.financial_id
            };
            if (
                localStorage.getItem("user_id") === "" ||
                localStorage.getItem("user_id") === null
            ) {
                this.$Message.warning("请先登录后操作！");
                return;
            }
            let res = await this.$Http.createInvest(data);
            if (res.status === 200) {
                this.$Message.success("投资成功，10分钟内未到账请联系客服!");
                this.show_text_trade = false;
                this.loading = false;
                this.cash_pwd = "";
                this.getBalance();
            } else {
                this.$Message.error("抱歉投资失败！");
                this.loading = false;
                this.show_text_trade = false;
            }
        },
        modal_common(msg) {
            this.modal2 = true;
            this.modal_loading = true;
            this.invest_msg = msg;
        },
        del() {
            setTimeout(() => {
                this.modal2 = false;
            }, 500);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./../assets/css/invest";
</style>
