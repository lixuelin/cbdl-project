<template>
    <div class="financial">
        <div class="financial-banner">
            <img src="../assets/image/st.png" alt="">
        </div>
        <h3 class="financial-title">推荐理财</h3>
        <div class="financial-card">
            <ul>
                <li v-for="item in financial_list" :key="item.title">
                    <div>
                        <p class="financial-card-rate">{{item.rate}}</p>
                        <p class="financial-card-tip">{{item.tip}}</p>
                    </div>
                    <div>
                        <p class="financial-card-title">{{item.title}}</p>
                        <p class="financial-card-tip">{{item.sub_title}}</p>
                    </div>
                </li>
            </ul>            
        </div>
    </div>
</template>

<script>
export default {
    name: "financial",
    data () {
        return {
            financial_list: [{
                rate: "3.95 ~ 4.1%",
                tip: "月收益",
                title: "生态1号",
                sub_title: "随时提现，到账速度快"
            },
            {
                rate: "3.95 ~ 4.1%",
                tip: "近7日年化率",
                title: "生态2号",
                sub_title: "到期需提现"
            }]
        }
    },
}
</script>

<style lang="less" scoped>
	@import "./../assets/css/financial";
</style>