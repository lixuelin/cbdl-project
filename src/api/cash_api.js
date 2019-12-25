/**
 * 提现接口请求配置
 * queryCashList: 查询提现列表
 *
 */

const CashApi = {
    queryCashList: {
        method: "get",
        url: "/cash?type=mobile"
    },
    updateCashVerify: {
        method: "post",
        url: "/cash/verify_cash?type=mobile"
    },
    queryCashEveryDay: {
        method: "get",
        url: "/cash/every_day_cash?type=manager"
    },
    queryCashEveryDayBonus: {
        method: "get",
        url: "/cash/every_day_cash_bonus?type=manager"
    }
};

module.exports = CashApi;
