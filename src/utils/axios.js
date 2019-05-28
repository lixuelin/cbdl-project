/**
 *
 * 异步请求拦截封装
 */

import axios from "axios"
import {getCookie, setCookie} from "./cookie"

import { Message } from "iview"
import {mylocalStorage} from "./request_api";
// import { LoadingBar } from "iview"

let instance = axios.create({
	headers: {
		authorization: getCookie("session_id")
	},
	timeout: 5000,
	baseURL: process.env.VUE_APP_ROOT,
	withCredentials: true
})

instance.interceptors.request.use(
	config => {
		config.headers.authorization = getCookie("session_id");
		return config;
	},
	error => {
		return Promise.reject(error);
	}
)

instance.interceptors.response.use(
	res => {
		if(res.headers["cookie"]) {
			localStorage.setItem("cookie", res.headers["cookie"]);
		}
		if (res.headers["authorization"]) {
			localStorage.setItem("session_id", res.config.headers.authorization);
		}
		if (res.config.headers.authorization) {
			setCookie("session_id", res.config.headers.authorization);
		}
		
		let data = {
			status: res.status,
			data: res.data
		}
		return data;
	},
	error => {
		if (error.response) {
			console.log(error.response, "dd")
			let data = {
				status: error.response.status,
				msg: error.response.data.message
			}
			if (data.status === 401) {
				Message.error(data.msg)
				if (mylocalStorage.getItem("type") === "admin") {
					window.location = "/admin"
				} else {
					window.location = "/login"
				}
				
			}
			
			return data
		}
		return Promise.reject(error);
	}
)

function sign(url) {
	return url.indexOf("?") > -1 ? "&" : "?"
}

export function all(method, url, data={}, headers) {
	var url = url + sign(url) + "timestamp=" + (new Date().getTime())
	return new Promise((resolve, reject) => {
		let setData = {
			method: method || "post",
			url: url,
			data: method === "get" ? {params: data} : data
		}
		instance(setData).then(response => {
			resolve(response)
		}).catch(error => {
			reject(error)
		})
	})
}