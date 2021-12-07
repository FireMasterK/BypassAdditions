// ==UserScript==
// @name         BypassAdditions
// @namespace    http://tampermonkey.net/
// @version      0.6.1
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

(function() {
    const fake_user_agent = "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1";

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

        let re_regular = /^(\/[0-9]+\/[^\/]+)/;
        let is_regular = re_regular.exec(window.location.pathname);
        if (is_regular === null) {
            // unknown url type
            return;
        }

        let paths = ["/captcha", "/countdown_impression?trafficOrigin=network", "/todo_impression?mobile=true&trafficOrigin=network"]

        paths.map(path => {
            GM.xmlHttpRequest({
                method: "GET",
                headers: {
                    "User-Agent": fake_user_agent
                },
                url: `https://publisher.linkvertise.com/api/v1/redirect/link${is_regular[1]}${path}`
            });
        })

        let o = {
            timestamp: new Date().getTime(),
            random: "6548307"
        };
        let bypass_url = `https://publisher.linkvertise.com/api/v1/redirect/link/static${is_regular[1]}`;
        GM.xmlHttpRequest({
            method: "GET",
            headers: {
                "User-Agent": fake_user_agent
            },
            url: bypass_url,
            onload: function (response) {
                let json = JSON.parse(response.responseText);

                let link_target_type;
                if (json.data.link.target_type === "URL") {
                    link_target_type = "target";
                } else if (json.data.link.target_type === "PASTE") {
                    link_target_type = "paste";
                } else {
                    console.warn(`Unexpected link target type: ${json.data.link.target_type}`);
                    return;
                }

                o.link_id = json.data.link.id
                o = { serial: btoa(JSON.stringify(o)) }
                bypass_url = `https://publisher.linkvertise.com/api/v1/redirect/link${is_regular[1]}/${link_target_type}?X-Linkvertise-UT=${localStorage.getItem("X-LINKVERTISE-UT")}`;

                GM.xmlHttpRequest({
                    method: "POST",
                    headers: {
                        "User-Agent": fake_user_agent,
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(o),
                    url: bypass_url,
                    onload: function (response) {
                        let json = JSON.parse(response.responseText);
                        if (link_target_type === "target") {
                            window.location = json.data.target;
                        } else {

                            let body = document.createElement("body");
                            let pre = document.createElement("pre");
                            pre.textContent = json.data.paste.trim();
                            body.appendChild(pre);
                            document.body = body;
                        }
                    }
                });
            }
        });
    }
})();
