<template>
    <div class="financial">
        <div class="financial-banner">
            <img src="../assets/image/st.png" alt="" />
        </div>
        <h3 class="financial-title">推荐理财</h3>
        <div class="financial-card">
            <ul>
                <li
                    v-for="item in financial_list"
                    :key="item.title"
                    @click="gotoInvest(item)"
                >
                    <div>
                        <p class="financial-card-rate">{{ item.rate }}</p>
                        <p class="financial-card-tip">{{ item.tip }}</p>
                    </div>
                    <div>
                        <p class="financial-card-title">{{ item.title }}</p>
                        <p class="financial-card-tip">{{ item.sub_title }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "financial",
    data() {
        return {
            financial_list: []
        };
    },
    created() {
        this.getFinancial();
    },
    methods: {
        async getFinancial() {
            let res = await this.$Http.queryFinancial();
            this.financial_list = res.data;
        },
        gotoInvest(item) {
            this.$router.push({
                name: "invest",
                params: {
                    financial_id: item.id
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
@import "./../assets/css/financial";
</style>
