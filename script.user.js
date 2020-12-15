// ==UserScript==
// @name         BypassAdditions
// @namespace    http://tampermonkey.net/
// @version      0.4.2
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

  GM.xmlHttpRequest({
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1"
    },
    url: "https://publisher.linkvertise.com/api/v1/redirect/link" + window.location.pathname + "/captcha",
    onload: function () { }
  });
  GM.xmlHttpRequest({
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1"
    },
    url: "https://publisher.linkvertise.com/api/v1/redirect/link" + window.location.pathname + "/countdown_impression?trafficOrigin=network",
    onload: function () { }
  });
  GM.xmlHttpRequest({
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1"
    },
    url: "https://publisher.linkvertise.com/api/v1/redirect/link" + window.location.pathname + "/todo_impression?mobile=true&trafficOrigin=network",
    onload: function () { }
  });
  GM.xmlHttpRequest({
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1"
    },
    url: "https://publisher.linkvertise.com/api/v1/redirect/link" + window.location.pathname + "/click?trafficOrigin=network",
    onload: function () { }
  });

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
      bypass_url = "https://publisher.linkvertise.com/api/v1/redirect/link" + window.location.pathname + "/target?serial=" + encodeURIComponent(btoa(JSON.stringify(o)));

      GM.xmlHttpRequest({
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1"
        },
        url: bypass_url,
        onload: function (response) {
          var json = JSON.parse(response.responseText);
          window.location = json.data.target;
        }
      });
    }
  });
}
