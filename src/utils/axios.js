/**
 *
 * 异步请求拦截封装
 */

// import axios from "axios"
import { getCookie, setCookie } from "./cookie";

// import { Message } from "iview"
import { mylocalStorage } from "./request_api";
import router from "./../router/index";
// import { LoadingBar } from "iview"

let instance = axios.create({
    headers: {
        authorization: getCookie("session_id")
    },
    timeout: 5000,
    baseURL: process.env.VUE_APP_ROOT,
    withCredentials: true
});

instance.interceptors.request.use(
    config => {
        config.headers.authorization = getCookie("session_id");
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    res => {
        if (res.headers["cookie"]) {
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
        };
        return data;
    },
    error => {
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
    }
);

function sign(url) {
    return url.indexOf("?") > -1 ? "&" : "?";
}

export function all(method, url, data = {}, headers) {
    var url = url + sign(url) + "timestamp=" + (new Date().getTime());
    return new Promise((resolve, reject) => {
        let setData = {
            method: method || "post",
            url: url,
            data: method === "get" ? { params: data } : data
        };
        instance(setData).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}
