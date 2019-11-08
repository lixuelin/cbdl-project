/**
 * 
 * axios 封装请求
 * 
 */

import axios from "axios";
import {
    getCookie,
    setCookie
} from "./cookie";
import { mylocalStorage } from "./request_api";

import serviceApi from "./api"

let instance = axios.create({
    baseURL: process.env.VUE_APP_ROOT,
    timeout: 5000,
    headers: {
        authorization: getCookie("session_id")
    },
    withCredentials: true
});

const Http = {};

for (let key in serviceApi) {
    let api = serviceApi[key];
    Http[key] = async function(params, isFormData = false, config = {}) {
        let newParams = {};

        if (params && isFormData) {
            newParams = new FormData();
            for (let i in params) {
                newParams.append(i, params[i]);
            }
        } else {
            newParams = params;
        }
        let response = {};
        if (api.method === "post" || api.method === "put" || api.method === "patch") {
            try {
                response = await instance[api.method](api.url, newParams, config)
            } catch (error) {
                response = error;
            }
        } else if (api.method === "get" || api.method === "delete") {
            config.params = newParams;
            try {
                response = await instance[api.method](api.url, config)
            } catch (error) {
                response = error;
            }
        }

        return response;
    }
};

instance.interceptors.request.use(config => {
    config.headers.authorization = getCookie("session_id");
    return config;
}, error => {
    return Promise.reject(error);;
});

instance.interceptors.response.use(res => {
    if (res.headers["cookie"]) {
        localStorage.setItem("cookie", res.headers["cookie"]);
    }
    if (res.headers["authorization"]) {
        localStorage.setItem("session_id", res.config.headers.authorization);
    }
    if (res.config.headers.authorization) {
        setCookie("session_id", res.config.headers.authorization);
    }
    console.log(res.data)
    return res.data;
}, error => {
    if (error.response) {
        let data = {
            status: error.response.status,
            msg: error.response.data.message
        };
        if (data.status === 401) {
            iview.Message.error(data.msg);
            mylocalStorage.setItem("username", "");
            mylocalStorage.setItem("user_id", "");
            mylocalStorage.setItem("session_id", "");
            mylocalStorage.setItem("code", "");
            if (mylocalStorage.getItem("type") === "manager") {
                router.push({
                    path: "/manager"
                });
            } else {
                router.push({
                    path: "/"
                });
            }

        }

        return data;
    }
    return Promise.reject(error);
});

export default Http;