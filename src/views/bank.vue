<template>
    <div class="bank">
        <div class="bank-list">
            <ul>
                <template v-for="bank in bankList">
                    <li :style="bankBg(bank)" :key="bank">
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
                    </li>
                </template>
                <li class="bank-list-add">
                    <span class="iconfont icon-icon_plus"></span>添加银行卡
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mylocalStorage, queryBank } from "./../utils/request_api";
import { checkBackInfo } from "./../utils/bank";

export default {
    name: "bank",
    data() {
        return {
            bankList: [
                {
                    bank_name: "中国银行",
                    card_type: "储蓄卡",
                    bank_code: "boc",
                    card: "6226 **** **** 3423"
                }
            ]
        };
    },
    mounted() {
        this.queryBankInfo();
    },
    methods: {
        async queryBankInfo() {
            let data = {
                id: localStorage.getItem("user_id")
            };
            try {
                let res = await this.$Http.queryUser(data);
                this.bankList[0].bank_name = res.data.bank_name;
                this.bankList[0].card_type = res.data.card_type;
                this.bankList[0].bank_code = res.data.bank_code;
                let card =
                    res.data.card.substr(0, 4) +
                    " **** **** " +
                    res.data.card.substr(
                        res.data.card.length - 4,
                        res.data.card.length
                    );
                this.bankList[0].card = card;
            } catch (error) {
                return this.$Message.error("请求失败！");
            }
        },
        bankBg(bank) {
            let bankInfo = checkBackInfo(bank);
            return { background: bankInfo.color };
        },
        bankIcon(bank) {
            let bankInfo = checkBackInfo(bank);
            let className = ["iconfont"];
            className.push(bankInfo.icon);
            return className;
        }
    }
};
</script>

<style lang="less" scoped>
@import "./../assets/css/bank";
</style>
