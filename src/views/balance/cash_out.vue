<template>
    <div class="cash-out">
        <div class="cash-out-bank" :style="bankBg(bank)">
            <div class="bank-list-cont">
                <div class="bank-list-cont-name">
                    <h3>{{bank.bank_name}}</h3>
                </div>
                <div class="bank-list-cont-type">
                    <p>{{bank.card_type}}</p>
                </div>
                <div class="bank-list-cont-card">
                    <p>{{bank.card}}</p>
                </div>
            </div>
            <div class="bank-list-logo">
                <span :class="bankIcon(bank)"></span>
            </div>
        </div>
        <div class="cash-out-content">
            <div class="cash-out-content-box">
                <p class="cash-out-content-tip">提现金额</p>
                <p class="cash-out-content-all"><span>全部提现</span></p>
            </div>
            <div class="cash-out-content-text">
                <span>¥</span>
                <input type="text" v-model="cash_num" @focus="textNum" @blur="valativeNum" placeholder="请输入提现金额">
            </div>
        </div>
        <p class="cash-out-money">可用余额：{{balance_num}}</p>
        <div class="cash-out-account">
            <p>提现方式</p>
            <div class="cash-out-account-way">
                <p>普通到账</p>
                <p class="cash-out-account-tip">资金将在24小时内到账，如有疑问请咨询客服</p>
            </div>
        </div>
        <div class="cash-out-commit">
            <Button type="success" long @click="sureCash" :disabled="isTextSure">确认提现</Button>
        </div>
        <foot></foot>
    </div>
</template>

<script>
import foot from "./../../components/foot";
import Clipboard from "clipboard";
import { checkBackInfo } from "./../../utils/bank";
import {mylocalStorage} from "./../../utils/request_api";

export default {
    name: "cash-out",
    data () {
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
        }
    },
    components: {
        foot
    },
    created () {
        this.balance_num = this.$route.query.num;
        this.getBankInfo();
    },
    methods: {
        bankBg(bank) {
            let bankInfo = checkBackInfo(bank);
            return { "background": bankInfo.color };
        },
        bankIcon(bank) {
            let bankInfo = checkBackInfo(bank);
            let className = ["iconfont"];
            className.push(bankInfo.icon);
            return className;
        },        
        valativeNum(){
            let num = this.cash_num;
            if (isNaN(num) || num === ""){
                this.$Message.warning("请输入准确的数值");
            } else if(Number(num) > Number(this.balance_num)){
                this.$Message.warning("提现金额大于当前可用余额！");
            } else {
                this.isTextSure = false;
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
        async getBankInfo () {
            let data = {
                user_id: mylocalStorage.getItem("user_id")
            }

            let res = await this.$Http.queryBankInfo(data);

            if (res.status === 200) {
                this.bank = res.data[0];
            } else {
                this.$Message.error("请求银行卡信息失败！");
            }
        },
        async sureCash () {
            let data = {
                user_id: mylocalStorage.getItem("user_id"),
                balance_num: Number(this.cash_num),
                balance_type: 2
            };
            if (mylocalStorage.getItem("user_id") === "" || mylocalStorage.getItem("user_id") === null) {
                this.$Message.warning("请先登录后操作！");
                return;
            }
            this.loading = true;
            let res = await this.$Http.createBalance(data);
            if (res.status === 200) {
                this.$Message.success("提现成功！");
                this.loading = false;
                this.deposit_show_modal = false;
                this.cash_num = "";
                this.isTextSure = true;
            } else {
                this.$Message.error("提现失败！");
                this.loading = false;
                this.deposit_show_modal = false;
            }
        }
    }
}
</script>

<style lang="less" scoped>
    @import "./../../assets/css/bank";
    @import url("./../../assets/css/cash_out");
</style>