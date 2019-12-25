/**
 * 投资接口请求配置
 * createInvest: 创建投资
 * queryInvestList: 查询投资列表
 * queryFinancialNum: 查询生态2号限制投资额度和已投资额度
 * queryAmountInvest: 查看最后一次投资是否确认
 *
 */

const InvestApi = {
    createInvest: {
        method: "post",
        url: "/invest?type=mobile"
    },
    queryInvestTotal: {
        method: "get",
        url: "/invest/total?type=mobile"
    },
    queryInvestList: {
        method: "get",
        url: "/invest/list?type=mobile"
    },
    stopInvest: {
        method: "post",
        url: "/invest/stop_income?type=mobile"
    },
    queryFinancialNum: {
        method: "get",
        url: "/invest/financial?type=manager"
    },
    queryAmountInvest: {
        method: "get",
        url: "/invest/amount?type=mobile"
    },
    queryAdminInvestList: {
        method: "get",
        url: "/invest/admin_list?type=manager"
    },
    updateInvestVerify: {
        method: "post",
        url: "/invest/verify_num?type=manager"
    },
    queryInvestEveryDay: {
        method: "get",
        url: "/invest/every_day_invest?type=manager"
    }
};

module.exports = InvestApi;
