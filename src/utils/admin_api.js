/**
 *
 * 项目请求接口全局
 *
 */

import {all} from "./../utils/axios"

export const mylocalStorage = window.localStorage;

/**
 *
 * 后台用户登录接口
 *
 */

export function loginRequest(data) {
	return all("post", "/admin_login", data)
}

/**
 *
 * 后台用户所有用户接口
 *
 */

export function queryUsers(data) {
	return all("get", "/user/list?currentPage="+data.currentPage + "&pageSize="+data.pageSize
		+ "&username="+data.username + "&card=" + data.card + "&bank_name=" + data.bank_name
		+ "&household=" + data.household + "&start_time=" + data.start_time + "&end_time=" + data.end_time)
}

/**
 *
 * 后台用户所有银行接口
 *
 */

export function queryBanks() {
	return all("get", "/user/bank_list")
}


/**
 *
 * 后台更新用户银行信息接口
 *
 */

export function updateBankInfo(data) {
	return all("post", "/user/update_bank", data)
}


/**
 *
 * 后台获取所有投资数据接口
 *
 */

export function queryInvestList(data) {
	return all("get", "/invest/admin_list?currentPage="+data.currentPage + "&pageSize="+data.pageSize
		+ "&username="+data.username + "&card=" + data.card + "&bank_name=" + data.bank_name + "&household="
		+ data.household + "&start_time=" + data.start_time + "&end_time=" + data.end_time + "&invest_num="
		+ data.invest_num + "&cash_status=" + data.cash_status + "&invest_pay=" + data.invest_pay)
}

/**
 *
 * 后台确认数据接口
 *
 */

export function updateVerify(data) {
  return all("post", "/invest/verify_num", data)
}



/**
 *
 * 后台获取每天投资数据接口
 *
 */

export function queryInvestEveryDay(data) {
	return all("get", "/invest/every_day_invest?currentPage="+data.currentPage + "&pageSize="+data.pageSize
		+ "&start_time=" + data.start_time + "&end_time=" + data.end_time )
}

/**
 *
 * 后台获取每天收益数据接口
 *
 */

export function queryIncomeEveryDay(data) {
	return all("get", "/income/every_day_income?currentPage="+data.currentPage + "&pageSize="+data.pageSize
		+ "&start_time=" + data.start_time + "&end_time=" + data.end_time)
}

/**
 *
 * 后台获取每天提现数据接口
 *
 */

export function queryCashList(data) {
	return all("get", "/cash?currentPage="+data.currentPage + "&pageSize="+data.pageSize
		+ "&start_time=" + data.start_time + "&end_time=" + data.end_time + "&username=" + data.username
		+ "&household=" + data.household + "&cash_num=" + data.cash_num + "&cash_type=" + data.cash_type
		+ "&cash_pay=" + data.cash_pay)
}

/**
 *
 * 后台获取每天提现接口
 *
 */

export function verify_cash(data) {
  return all("post", "/cash/verify_cash", data)
}



/**
 *
 * 后台获取每天奖金数据接口
 *
 */

export function queryAdminBonusList(data) {
	return all("get", "/bonus/admin_list?currentPage="+data.currentPage + "&pageSize="+data.pageSize
		+ "&start_time=" + data.start_time + "&end_time=" + data.end_time + "&username=" + data.username
		+ "&household=" + data.household + "&lower_username=" + data.lower_username + "&lower_household=" + data.lower_household
		+ "&lower_lower_username=" + data.lower_lower_username + "&lower_lower_household=" + data.lower_lower_household)
}


/**
 *
 * 后台获取每天提现本金数据接口
 *
 */

export function queryCashEveryDay(data) {
	return all("get", "/cash/every_day_cash?currentPage="+data.currentPage + "&pageSize="+data.pageSize
		+ "&start_time=" + data.start_time + "&end_time=" + data.end_time + "&cash_num=" + data.cash_num )
}

/**
 *
 * 后台获取每天提现奖金数据接口
 *
 */

export function queryCashEveryDayBonus(data) {
	return all("get", "/cash/every_day_cash_bonus?currentPage="+data.currentPage + "&pageSize="+data.pageSize
		+ "&start_time=" + data.start_time + "&end_time=" + data.end_time + "&cash_num=" + data.cash_num )
}


/**
 *
 * 后台获取每天投资数据接口
 *
 */

export function queryBonusEveryDay(data) {
	return all("get", "/bonus/every_data_bonus?currentPage="+data.currentPage + "&pageSize="+data.pageSize
		+ "&start_time=" + data.start_time + "&end_time=" + data.end_time)
}

/**
 *
 * 导出投资流水数据接口
 *
 */

export function downloadEveryExecl() {
	return all("get", "/invest/download_invest")
}

