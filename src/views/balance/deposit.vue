<template>
    <div class="deposit">
        <div class="deposit-content">
            <p class="deposit-content-tip">转账金额</p>
            <div class="deposit-content-text">
                <span>¥</span>
                <input
                    type="text"
                    v-model="deposit_num"
                    @blur="valativeNum"
                    @focus="textNum"
                    placeholder="请输入转账金额"
                />
            </div>
            <p class="deposit-content-tip">转账金额为100的倍数</p>
        </div>
        <div class="deposit-pay">
            <div class="deposit-pay-way">
                <p>付款方式</p>
                <div class="deposit-pay-way-choose">
                    {{ bank.bank_name }}（尾号{{ bank.card }}）
                </div>
            </div>
        </div>
        <div class="deposit-commit">
            <Button type="success" long @click="deposit">立即转账</Button>
        </div>
        <foot></foot>
        <Modal v-model="deposit_show_modal" width="220">
            <p slot="header">
                <span>投资</span>
            </p>
            <div>
                <p>请您将投资款转账到公司账户，收到后将计算收益：</p>
                <div class="invest-sure-count">
                    <p
                        class="ctrlBtn"
                        @click="ctrlCBtn"
                        :data-clipboard-text="company"
                    >
                        <span>账户：</span>
                        <span>深圳市鑫鼎翔电子商务有限公司</span>
                        <Button
                            type="primary"
                            size="small"
                            data-clipboard-text="深圳市鑫鼎翔电子商务有限公司"
                            >复制</Button
                        >
                    </p>
                    <p
                        class="ctrlBtn"
                        @click="ctrlCBtn"
                        :data-clipboard-text="bank_add"
                    >
                        <span>开户行：</span>
                        <span>中国农业银行深圳中心区支行</span>
                        <Button
                            type="primary"
                            size="small"
                            data-clipboard-text="中国农业银行深圳中心区支行"
                            >复制</Button
                        >
                    </p>
                    <p
                        class="ctrlBtn"
                        @click="ctrlCBtn"
                        :data-clipboard-text="bank_code"
                    >
                        <span>银行账号：</span>
                        <span>41005000040046406</span>
                        <Button
                            type="primary"
                            size="small"
                            data-clipboard-text="41005000040046406"
                            >复制</Button
                        >
                    </p>
                </div>
            </div>
            <div slot="footer">
                <i-button
                    type="primary"
                    long
                    :loading="loading"
                    @click="sureDeposit"
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
import { mylocalStorage } from "./../../utils/request_api";

export default {
    name: "deposit",
    data() {
        return {
            deposit_num: "",
            isTextSure: true,
            deposit_show_modal: false,
            company: "深圳市鑫鼎翔电子商务有限公司",
            bank_code: "41005000040046406",
            bank_add: "中国农业银行深圳中心区支行",
            loading: false,
            bank: {}
        };
    },
    components: {
        foot
    },
    created() {
        this.getBankInfo();
    },
    methods: {
        valativeNum() {
            let num = this.deposit_num;
            if (isNaN(num) || num === "" || Number(num) <= 0) {
                this.$Message.error("请输入准确的数值！");
                this.isTextSure = true;
            } else if (this.isFloat(Number(num) / 100)) {
                this.$Message.error("请转账金额为100的倍数！");
                this.isTextSure = true;
            } else {
                this.isTextSure = false;
            }
        },
        textNum() {
            this.isTextSure = true;
        },
        isFloat(n) {
            return n + ".0" != n;
        },
        deposit() {
            if (this.isTextSure) {
                this.$Message.error("请输入准确的数值");
                return;
            }
            this.deposit_show_modal = true;
        },
        async getBankInfo() {
            let data = {
                id: localStorage.getItem("user_id")
            };

            let res = await this.$Http.queryUser(data);

            if (res.data) {
                this.bank = res.data;
                this.bank.card = this.bank.card.substring(
                    this.bank.card.length - 4
                );
            } else {
                this.$Message.error("请求银行卡信息失败！");
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
        async sureDeposit() {
            let data = {
                user_id: localStorage.getItem("user_id"),
                balance_num: this.deposit_num,
                balance_type: 0
            };
            if (
                localStorage.getItem("user_id") === "" ||
                localStorage.getItem("user_id") === null
            ) {
                this.$Message.warning("请先登录后操作！");
                return;
            }
            this.loading = true;
            let res = await this.$Http.createBalance(data);
            if (res.status === 200) {
                this.$Message.success("转账成功！");
                this.loading = false;
                this.deposit_show_modal = false;
                this.deposit_num = "";
                this.isTextSure = true;
            } else {
                this.$Message.error("转账失败！");
                this.loading = false;
                this.deposit_show_modal = false;
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import url("./../../assets/css/deposit");
</style>
