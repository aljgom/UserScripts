// ==UserScript==
// @name         Google Sheets Scroll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scroll to certain position when google sheet loads
// @author       aljgom
// @match        https://docs.google.com/spreadsheets/d/1vctvEcsYrLRACOhMfd9ThbRTbVTmZGwD9p5qIcQNBwQ/*
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';


    var [yBar, xBar] = await waitFor("document.querySelectorAll('.native-scrollbar')", 30*1000);
    confirm();  // To bring focus to the page once loaded
    yBar.scrollTop = 1800;
    xBar.scrollLeft = Math.floor( (Date.now() - (new Date('3/31/2018')) )/(1000*60*60*24) ) * 100 + 5000;  // 17xxx days, each cell is 100 width, scroll to 5000 + days*100 ;




})();
