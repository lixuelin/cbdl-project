<template>
    <div class="cash-out">
        <div class="cash-out-bank" :style="bankBg(bank)">
            <div class="bank-list-cont">
                <div class="bank-list-cont-name">
                    <h3>{{ bank.bank_name }}</h3>
                </div>
                <div class="bank-list-cont-type">
                    <p>{{ bank.card_type }}</p>
                </div>
                <div class="bank-list-cont-card">
                    <p>{{ bank.card }}</p>
                </div>
            </div>
            <div class="bank-list-logo">
                <span :class="bankIcon(bank)"></span>
            </div>
        </div>
        <div class="cash-out-content">
            <div class="cash-out-content-box">
                <p class="cash-out-content-tip">提现金额</p>
                <!-- <p class="cash-out-content-all"><span>全部提现</span></p> -->
            </div>
            <div class="cash-out-content-text">
                <span>¥</span>
                <input
                    type="text"
                    v-model="cash_num"
                    @focus="textNum"
                    placeholder="请输入提现金额"
                />
            </div>
        </div>
        <p class="cash-out-money">可用余额：{{ balance_num }}</p>
        <div class="cash-out-account">
            <p>提现方式</p>
            <div class="cash-out-account-way">
                <p>普通到账</p>
                <p class="cash-out-account-tip">
                    资金将在24小时内到账，如有疑问请咨询客服
                </p>
            </div>
        </div>
        <div class="cash-out-commit">
            <Button type="success" long @click="sureCash">确认提现</Button>
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
import foot from "./../../components/foot";
import Clipboard from "clipboard";
import { checkBackInfo } from "./../../utils/bank";

export default {
    name: "cash-out",
    data() {
        return {
            bank: {
                bank_name: "中国银行",
                card_type: "储蓄卡",
                bank_code: "boc",
                card: "6226 **** **** 3423"
            },
            balance_num: 0,
            cash_num: "",
            isTextSure: true,
            deposit_show_modal: false,
            company: "深圳市鑫鼎翔电子商务有限公司",
            bank_code: "41005000040046406",
            bank_add: "中国农业银行深圳中心区支行",
            show_text_trade: false,
            cash_pwd: "",
            is_sure: true
        };
    },
    components: {
        foot
    },
    created() {
        this.balance_num = this.$route.query.num;
        this.getBankInfo();
        this.queryTotal();
    },
    methods: {
        bankBg(bank) {
            let bankInfo = checkBackInfo(bank);
            return { background: bankInfo.color };
        },
        bankIcon(bank) {
            let bankInfo = checkBackInfo(bank);
            let className = ["iconfont"];
            className.push(bankInfo.icon);
            return className;
        },
        valativeNum() {
            let num = this.cash_num;
            if (isNaN(num) || num === "") {
                this.$Message.warning("请输入准确的数值");
                return (this.isTextSure = true);
            } else if (Number(num) > Number(this.balance_num)) {
                this.$Message.warning("提现金额大于当前可用余额！");
                return (this.isTextSure = true);
            } else {
                return (this.isTextSure = false);
            }
        },
        textNum() {
            this.isTextSure = true;
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
        async getBankInfo() {
            let data = {
                id: localStorage.getItem("user_id")
            };
            let res = null;
            try {
                res = await this.$Http.queryUser(data);
                if (res.status !== 200 || !res.data.id) {
                    this.loading = false;
                    return this.$Message.error(`没有找到用户`);
                }
                this.bank = res.data;
                this.bank.card =
                    res.data.card.substr(0, 4) +
                    " **** **** " +
                    res.data.card.substr(
                        res.data.card.length - 4,
                        res.data.card.length
                    );
            } catch (error) {
                if (res.msg) {
                    return this.$Message.error(`请求银行卡信息失败:${res.msg}`);
                }
                this.$Message.error(`请求银行卡信息失败:${error}`);
            }
        },
        async isSureInvest() {
            let data = {
                user_id: localStorage.getItem("user_id"),
                balance_type: 3
            };
            let res = null;
            try {
                res = await this.$Http.queryBalanceLastCash(data);
                this.is_sure = res.data;
            } catch (error) {
                if (res.msg) {
                    return this.$Message.error(`请求失败:${res.msg}`);
                }
                this.$Message.error(`请求失败:${error}`);
            }
        },
        async queryTotal() {
            let data = {
                user_id: localStorage.getItem("user_id"),
                is_cash: 0,
                is_invest: 1
            };
            if (
                localStorage.getItem("user_id") === "" ||
                localStorage.getItem("user_id") === null
            ) {
                return;
            }
            let res = null;
            try {
                res = await this.$Http.queryBalanceTotal(data);
                this.balance_num = res.data.count.toFixed(1);
            } catch (error) {
                if (res.msg) {
                    return this.$Message.error(`请求失败:${res.msg}`);
                }
                this.$Message.error(`请求失败:${error}`);
            }
        },
        sureCash() {
            this.isSureInvest();
            let num = this.cash_num;
            if (isNaN(num) || num === "" || Number(num) === 0) {
                this.$Message.warning("请输入准确的数值");
                return (this.isTextSure = true);
            } else if (Number(num) > Number(this.balance_num)) {
                this.$Message.warning("提现金额大于当前可用余额！");
                return (this.isTextSure = true);
            }

            if (this.is_sure.length > 0) {
                this.$Message.warning(
                    "当前有提现申请正在等待审核，请稍后再试！"
                );
                return;
            }
            this.show_text_trade = true;
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
            let res = null;
            try {
                res = await this.$Http.queryUser(data);
                if (res.status !== 200 || !res.data.id) {
                    this.loading = false;
                    return this.$Message.error(`交易密码错误`);
                }
                this.cashPost();
            } catch (error) {
                this.loading = false;
                if (res.msg) {
                    return this.$Message.error(`交易密码错误:${res.msg}`);
                }
                this.$Message.error(`交易密码错误:${error}`);
            }
        },
        async cashPost() {
            this.isSureInvest();
            if (this.is_sure.length > 0) {
                this.loading = false;
                this.deposit_show_modal = false;
                this.show_text_trade = false;
                return this.$Message.warning(
                    "当前有提现申请正在等待审核，请稍后再试！"
                );
            }
            let data = {
                user_id: localStorage.getItem("user_id"),
                balance_num: Number(this.cash_num),
                balance_type: 3
            };
            if (
                localStorage.getItem("user_id") === "" ||
                localStorage.getItem("user_id") === null
            ) {
                this.$Message.warning("请先登录后操作！");
                return;
            }
            this.loading = true;
            let res = null;
            try {
                res = await this.$Http.createBalance(data);
                if (Number(this.cash_num) > 1000) {
                    this.$Message.success("提现成功！2小时内未到账请联系客服!");
                } else {
                    this.$Message.success(
                        "提现成功！24小时内未到账请联系客服!"
                    );
                }
                this.loading = false;
                this.deposit_show_modal = false;
                this.cash_num = "";
                this.isTextSure = true;
                this.show_text_trade = false;
                this.queryTotal();
            } catch (error) {
                this.loading = false;
                this.deposit_show_modal = false;
                this.show_text_trade = false;
                if (res.msg) {
                    return this.$Message.error(`提现失败:${res.msg}`);
                }
                this.$Message.error(`提现失败:${error}`);
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "./../../assets/css/bank";
@import url("./../../assets/css/cash_out");
</style>
