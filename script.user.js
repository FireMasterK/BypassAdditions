// ==UserScript==
// @name         BypassAdditions
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @updateURL    https://raw.githubusercontent.com/FireMasterK/BypassAdditions/master/script.user.js
// @description  Bypass links that cannot be bypassed by Universal Bypass
// @author       FireMasterK
// @match        *://*.linkvertise.com/*
// @match        *://*.linkvertise.net/*
// @match        *://*.link-to.net/*
// @grant        GM.xmlHttpRequest
// ==/UserScript==

var url = window.location.href.toString();

if (url.indexOf("?r=") != -1) {
    window.location = atob(decodeURIComponent(url.substr(url.indexOf("?r=") + 3)));
} else {

    // iframe check
    if (window.parent.location != window.location) { return }

    var paths = ["/captcha", "/countdown_impression?trafficOrigin=network", "/todo_impression?mobile=true&trafficOrigin=network"]

    paths.map(path => {
        GM.xmlHttpRequest({
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1"
            },
            url: "https://publisher.linkvertise.com/api/v1/redirect/link" + window.location.pathname + path
        });
    })


    let o = {
        timestamp: new Date().getTime(),
        random: "6548307"
    };
    var bypass_url = "https://publisher.linkvertise.com/api/v1/redirect/link/static" + window.location.pathname;
    GM.xmlHttpRequest({
        method: "GET",
        headers: {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1"
        },
        url: bypass_url,
        onload: function (response) {
            var json = JSON.parse(response.responseText);
            o.link_id = json.data.link.id
            o = { serial: btoa(JSON.stringify(o)) }
            bypass_url = "https://publisher.linkvertise.com/api/v1/redirect/link" + window.location.pathname + "/target?X-Linkvertise-UT=" + localStorage.getItem("X-LINKVERTISE-UT");

            GM.xmlHttpRequest({
                method: "POST",
                headers: {
                    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1",
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(o),
                url: bypass_url,
                onload: function (response) {
                    var json = JSON.parse(response.responseText);
                    window.location = json.data.target;
                }
            });
        }
    });
}
