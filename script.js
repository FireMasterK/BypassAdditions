// ==UserScript==
// @name         BypassAdditions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @updateURL    https://raw.githubusercontent.com/FireMasterK/BypassAdditions/master/script.js
// @description  Bypass links that cannot be bypassed by Universal Bypass
// @author       FireMasterK
// @match        *://*.linkvertise.com/*
// @match        *://*.linkvertise.net/*
// @match        *://*.link-to.net/*
// @grant        GM.xmlHttpRequest
// ==/UserScript==

var url = window.location.href.toString();

if (url.match( /*://*.linkvertise.com/*?r=*/ ).index != 0 || url.match( /*://*.linkvertise.net/*?r=*/ ).index != 0 || url.match( /*://*.link-to.net/*?r=*/ ).index != 0) {
 window.location = atob(decodeURIComponent(url.substr(url.indexOf("?r=") + 3)));
} else {
  let o = {
  timestamp: new Date().getTime(),
  random: "375123"
 };
 var bypass_url = "https://linkvertise.net/api/v1/redirect/link/static" + window.location.pathname;
 GM.xmlHttpRequest({
  method: "GET",
  headers: {
   "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1"
  },
  url: bypass_url,
  onload: function(response) {
   var json = JSON.parse(response.responseText);
   o.link_id = json.data.link.id
   bypass_url = "https://linkvertise.net/api/v1/redirect/link" + window.location.pathname + "/target?serial=" + btoa(JSON.stringify(o));

    GM.xmlHttpRequest({
    method: "GET",
    headers: {
     "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1"
    },
    url: bypass_url,
    onload: function(response) {
     var json = JSON.parse(response.responseText);
     window.location = json.data.target;
    }
   });
  }
 });
}
