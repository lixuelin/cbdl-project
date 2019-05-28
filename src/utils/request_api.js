/**
 *
 * 项目请求接口全局
 *
 */


import {all} from "./axios"

export const mylocalStorage = window.localStorage

/**
 * 用户注册接口
 *
 */

export function registerRequest(data) {
	return all("post", "/register", data)
}


/**
 * 用户注册之用户名称唯一验证接口
 *
 */

export function registerRequestUserName(data) {
	return all("get", "/register?username=" + data.username)
}

/**
 * 用户银行接口
 *
 */

export function queryBank(data) {
	return all("get", "/user/bank?user_id=" + data.user_id)
}

/**
 * 手机界面用户登陆接口
 *
 */

export function loginRequest(data) {
	return all("post", "/login", data)
}


/**
 *
 * 用户投资接口
 *
 */

export function userInvest(data) {
	return all("post", "/invest", data)
}

/**
 *
 * 用户投资统计接口
 *
 */

export function queryInvestTotal(data) {
	return all("get", "/invest/total?user_id=" + data.user_id)
}

/**
 *
 * 用户收益统计接口
 *
 */

export function queryIncomeTotal(data) {
	return all("get", "/income/total?user_id=" + data.user_id)
}

/**
 *
 * 用户收益统计接口
 *
 */

export function queryInvestList(data) {
	return all("get", "/invest/list?user_id=" + data.user_id)
}

/**
 *
 * 用户收益统计接口
 *
 */

export function queryBonusTotal(data) {
	return all("get", "/bonus/total?user_id=" + data.user_id)
}


/**
 *
 * 用户奖金统计接口
 *
 */

export function queryBonusList(data) {
	return all("get", "/bonus/list?user_id=" + data.user_id)
}


/**
 *
 * 用户奖金统计接口
 *
 */

export function queryBonusNextList(data) {
	return all("get", "/bonus/next_list?user_id=" + data.user_id)
}

/**
 *
 * 用户提现密码匹配接口
 *
 */

export function checkCashPwd(data) {
	return all("post", "/user/cash_pwd", data)
}

/**
 *
 * 用户登录密码匹配接口
 *
 */

export function checkLoginPwd(data) {
	return all("post", "/user/login_pwd", data)
}

/**
 *
 * 用户修改提现密码匹配接口
 *
 */

export function updateCashPwd(data) {
	return all("post", "/user/update_cash_pwd", data)
}

/**
 *
 * 用户修改提现密码匹配接口
 *
 */

export function updateLoginPwd(data) {
	return all("post", "/user/update_login_pwd", data)
}

/**
 *
 * 用户投资提现单个接口
 *
 */

export function IncomeCashOne(data) {
	return all("post", "/income/cash_one", data)
}

/**
 *
 * 用户投资提现所有接口
 *
 */

export function IncomeCashAll(data) {
	return all("post", "/income/cash_all", data)
}

/**
 *
 * 用户奖金提现接口
 *
 */

export function bonusCashMoney(data) {
	return all("post", "/bonus/cash", data)
}