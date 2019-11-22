/**
 * 
 * 后端服务接口请求配置
 * 
 */

const requestApi = {
    queryBalance: { // 前端界面查询充值、提现、理财回收记录
        method: "get",
        url: "/balance"
    },
    queryBalanceAdmin: { // 前端界面查询充值、提现、理财回收记录
        method: "get",
        url: "/balance/admin"
    },
    createBalance: { // 前端界面充值余额
        method: "post",
        url: "/balance"
    },
    updateBalance: { // 后台界面管理员修改记录
        method: "put",
        url: "/balance"
    },
    queryBalanceCount: { // 查询余额统计
        method: "get",
        url: "/balance/total"
    },
    queryBankInfo: { // 查询用户银行信息
        method: "get",
        url: "/user/bank"
    },
    queryFinancial: { // 查询理财
        method: "get",
        url: "/financial"
    },
    queryInvestList: { // 查询投资列表
        method: "get",
        url: "/invest/list"
    },
    queryIncomeCount: { // 查询投资总计
        method: "get",
        url: "/income/total"
    },
    changeTradePwd: { // 检验交易密码
        method: "post",
        url: "/user/cash_pwd"
    },
    createInvest: { // 检验交易密码
        method: "post",
        url: "/invest"
    },
    queryFinancialNum: { // 查询生态2号限制投资额度和已投资额度
        method: "get",
        url: "/invest/financial"
    },
    queryBalanceIncome: { // 查询余额收益
        method: "get",
        url: "/balance/income"
    },
    queryBalanceLastInvest: { // 查看最后一次投资是否确认
        method: "get",
        url: "/balance/last_invest"
    },
    queryBalanceLastCash: { // 查看最后一次投资是否确认
        method: "get",
        url: "/balance/last_cash"
    },
    queryAmountInvest: { // 查看最后一次投资是否确认
        method: "get",
        url: "/invest/amount"
    },
    queryTeamIncome: { // 查看团队收益
        method: "get",
        url: "/income/team_income"
    },
};

module.exports = requestApi;