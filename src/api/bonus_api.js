/**
 * 奖金接口请求配置
 * queryBonusTotal: 查询奖金统计
 * queryBonusList: 查询奖金列表
 * queryBonusNextList: 查询奖金下次统计
 * bonusCashMoney: 奖金提现
 *
 */

const BonusApi = {
    queryBonusTotal: {
        method: "get",
        url: "/bonus/total?type=mobile"
    },
    queryBonusList: {
        method: "get",
        url: "/bonus/list?type=mobile"
    },
    queryBonusNextList: {
        method: "get",
        url: "/bonus/next_list?type=mobile"
    },
    bonusCashMoney: {
        method: "post",
        url: "/bonus/cash?type=mobile"
    },
    queryBonusAdmin: {
        method: "get",
        url: "/bonus/admin_list?type=manager"
    },
    queryBonusAdminSecond: {
        method: "get",
        url: "/bonus/admin_second_list?type=manager"
    },
    queryBonusEveryDay: {
        method: "get",
        url: "/bonus/every_data_bonus?type=manager"
    },
    queryNextBonusEveryDay: {
        method: "get",
        url: "/bonus/every_data_next_bonus?type=manager"
    }
};

module.exports = BonusApi;
