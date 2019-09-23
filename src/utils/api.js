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
};

module.exports = requestApi;