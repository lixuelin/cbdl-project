/**
 * 余额接口请求配置
 * queryBalance: 查询充值、提现、理财回收记录
 * queryBalanceAdmin: 查询充值、提现、理财回收记录
 * createBalance: 前端界面充值余额
 * updateBalance: 后台界面管理员修改记录
 * queryBalanceCount: 查询余额统计
 * queryBalanceLastInvest: 查看最后一次投资是否确认
 * queryBalanceLastCash: 查看最后一次投资是否确认
 *
 */

const BalanceApi = {
    queryBalanceTotal: {
        method: "get",
        url: "/balance/total?type=mobile"
    },
    queryBalance: {
        method: "get",
        url: "/balance?type=mobile"
    },
    queryBalanceAdmin: {
        method: "get",
        url: "/balance/admin?type=manager"
    },
    createBalance: {
        method: "post",
        url: "/balance?type=mobile"
    },
    updateBalance: {
        method: "put",
        url: "/balance?type=mobile"
    },
    queryBalanceLastInvest: {
        method: "get",
        url: "/balance/last_invest?type=mobile"
    },
    queryBalanceLastCash: {
        method: "get",
        url: "/balance/last_cash?type=mobile"
    },
    queryBalanceIncome: {
        method: "get",
        url: "/balance/income?type=manager"
    },
    deleteBalance: {
        method: "delete",
        url: "/balance?type=manager"
    },
    createTransferAccount: {
        method: "post",
        url: "/balance/transfer_account?type=mobile"
    }
};

module.exports = BalanceApi;
