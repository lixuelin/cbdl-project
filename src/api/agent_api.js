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

const AgentApi = {
    createAgent: {
        method: "post",
        url: "/agent?type=manager"
    },
    querySuperAgents: {
        method: "get",
        url: "/agent?type=manager"
    },
    queryAdminAgents: {
        method: "get",
        url: "/agent/list?type=manager"
    },
    queryAgentInterest: {
        method: "get",
        url: "/agent/interest_list?type=manager"
    },
    queryAgentList: {
        method: "get",
        url: "/agent/agent_list?type=mobile"
    }
};

module.exports = AgentApi;
