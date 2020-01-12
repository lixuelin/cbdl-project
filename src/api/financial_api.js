/**
 * 奖金接口请求配置
 * queryFinancial: 查询理财
 *
 */

const FinancialApi = {
    queryFinancial: {
        method: "get",
        url: "/financial?type=mobile"
    }
};

module.exports = FinancialApi;
