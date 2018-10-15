// ==UserScript==
// @name         Sprint reload until chat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  -
// @author       aljgom
// @match        https://www.sprint.com/*
// @require      file://C:\Users\Alejo\Dropbox\Programming\Javascript\UserScripts\sprint_reload_until_chat.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    localStorage.found = false;
    setTimeout(()=>{
        if(document.body.innerHTML.match('Click to Chat')) {
            localStorage.found = true;
            confirm();
        }
        else if(localStorage.found == 'false') location.reload();
    },12*1000);




})();