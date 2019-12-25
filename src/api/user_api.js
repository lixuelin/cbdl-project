/**
 * 用户接口请求配置
 * createUser: 创建用户
 * queryUser: 查询用户
 * queryUserName: 查询用户名称
 * queryUserInviteCode: 查询用户提交的邀请码
 * queryUserBank: 查询用户银行信息
 * queryUserBankCard: 查询用户银行卡号
 * userLogin: 用户登录
 * userTradePwd: 提交用户交易密码
 *
 */

const UserApi = {
    queryUser: {
        method: "get",
        url: "/user?type=mobile"
    },
    createUser: {
        method: "post",
        url: "/user?type=mobile"
    },
    updateUser: {
        method: "put",
        url: "/user?type=mobile"
    },
    userLogin: {
        method: "post",
        url: "/login?type=mobile"
    },
    adminUserLogin: {
        method: "post",
        url: "/admin_login?type=admin"
    },
    queryUserInfo: {
        method: "post",
        url: "/user/find_user?type=mobile"
    },
    queryUserNext: {
        method: "get",
        url: "/user/find_next?type=mobile"
    },
    queryUsers: {
        method: "get",
        url: "/user/list?type=manager"
    },
    queryUserBanks: {
        method: "get",
        url: "/user/bank_list?type=manager"
    }
};

module.exports = UserApi;
