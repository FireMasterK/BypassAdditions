// ==UserScript==
// @name         BypassAdditions
// @namespace    http://tampermonkey.net/
// @version      0.4.5
// @updateURL    https://raw.githubusercontent.com/FireMasterK/BypassAdditions/master/script.user.js
// @description  Bypass links that cannot be bypassed by Universal Bypass
// @author       FireMasterK
// @match        *://*.linkvertise.com/*
// @match        *://*.linkvertise.net/*
// @match        *://*.linkvertise.download/*
// @match        *://*.link-to.net/*
// @match        *://*.file-link.net/*
// @match        *://*.direct-link.net/*
// @match        *://*.up-to-down.net/*
// @grant        GM.xmlHttpRequest
// ==/UserScript==

let search_params = new URLSearchParams(window.location.search);

if (search_params.get("r") !== null) {
    window.location = atob(decodeURIComponent(search_params.get("r")));
} else {

    // iframe check
    if (window.parent.location != window.location) { return }
 
    // check if page is download page
    let re_download = /^\/download(\/[0-9]+\/[^\/]+)\//;
    let is_download = re_download.exec(window.location.pathname);
    
    if (is_download !== null) {
        window.location.pathname = is_download[1];
        return;
    }

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
