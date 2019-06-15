/**
 * author: lixuelin
 * cookie 操作
 * function: setCookie, getCookie, delCookie
 */

/**
 * set cookie 操作
 */

export function setCookie(cname, value, expire) {
    let date = new Date();
    date.setSeconds(date.getSeconds() + expire);
    document.cookie = cname + "=" + escape(value) + "; expires=" + date.toGMTString();
}

/**
 * get cookie 操作
 */

export function getCookie(cname, value, expire) {
    if (document.cookie.length > 0) {
        let cstart = document.cookie.indexOf(cname + "=");
        if (cstart !== -1) {
            cstart = cstart + cname.length + 1;
            let cend = document.cookie.indexOf(";", cstart);
            if (cend === -1) {
                cend = document.cookie.length;
            }
            return document.cookie.substring(cstart, cend);
        }
    }
    return "";
}

/**
 * del cookie 操作
 */

export function delCookie(cname) {
    setCookie(cname, "", -1);
}