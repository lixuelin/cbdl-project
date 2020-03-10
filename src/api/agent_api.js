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
        url: "/agent?type=mobile"
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
    queryNextAgents: {
        method: "get",
        url: "/agent/next_agent?type=mobile"
    },
    queryAgentList: {
        method: "get",
        url: "/agent/agent_list?type=mobile"
    },
    updateAgent: {
        method: "put",
        url: "/agent?type=manager"
    },
    upgradeAgent: {
        method: "put",
        url: "/agent/upgrade_agent?type=manager"
    },
    queryAgentIncome: {
        method: "get",
        url: "/agent/income_list?type=mobile"
    },
    updateAgentIncome: {
        method: "put",
        url: "/agent/income_cash?type=mobile"
    },
    queryAgentByUser: {
        method: "get",
        url: "/agent/agent_by_user?type=mobile"
    }
};

module.exports = AgentApi;
