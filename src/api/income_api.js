/**
 * 投资收益接口请求配置
 * queryIncomeCount: 查询当前投资收益总计
 * queryTeamIncome: 查询团队总收益
 * incomeCash: 单个投资提取
 * incomeCashAll: 所有投资提取
 *
 */

const IncomeApi = {
    queryIncomeCount: {
        method: "get",
        url: "/income/total?type=mobile"
    },
    queryTeamIncome: {
        method: "get",
        url: "/income/team_income?type=mobile"
    },
    incomeCash: {
        method: "post",
        url: "/income/cash_one?type=mobile"
    },
    incomeCashAll: {
        method: "post",
        url: "/income/cash_all?type=mobile"
    },
    queryIncomeTotal: {
        method: "get",
        url: "income/total?type=mobile"
    },
    queryIncomeEveryDay: {
        method: "get",
        url: "income/every_day_income?type=manager"
    }
};

module.exports = IncomeApi;
