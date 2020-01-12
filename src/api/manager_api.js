/**
 *管理接口请求配置
 * createUser: 创建用户
 *
 */

const ManagerApi = {
    queryCount: {
        method: "get",
        url: "/manager?type=manager"
    }
};

module.exports = ManagerApi;
