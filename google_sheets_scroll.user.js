// ==UserScript==
// @name         Google Sheets Scroll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scroll to certain position when google sheet loads
// @author       aljgom
// @match        https://docs.google.com/spreadsheets/d/*
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';
    while(typeof(waitFor) === "undefined"){
        console.log('waiting for All Pages')
        await new Promise(resolve=>setInterval(resolve, 200))
    }

    let url = document.location.href;
    // await waitFor(()=>document.querySelector(".jfk-butterBar-shown") == null)  // wait for 'still working' message to dissapear
    let [yBar, xBar] = await waitFor(()=>document.querySelectorAll('.native-scrollbar'));
    let cellHeight = 21;
    let cellWidth = 100;
    let daysSince = date =>   Math.floor( (Date.now() - (new Date(date)) )/(1000*60*60*24) );

    if(url.match("https://docs.google.com/spreadsheets/d/1vctvEcsYrLRACOhMfd9ThbRTbVTmZGwD9p5qIcQNBwQ/")){
        confirm();  // To bring focus to the page once loaded, the scroll buttons in the scrollbar need to be clicked once for it to scroll to the right position
        yBar.scrollTop = 1800;
        xBar.scrollLeft = daysSince('3/31/2018') * cellWidth + 5000;  // 17xxx days, scroll to 5000 + days*cellWidth ;
    }

    if(url.match("https://docs.google.com/spreadsheets/d/1Blx76YvGaXwllkD4FC0MKKT9PAVOlRWsE2br7s9rka0")){
        //confirm();   // To bring focus to the page once loaded, the scroll buttons in the scrollbar need to be clicked once for it to scroll to the right position
        yBar.scrollTop = (4260  + 24 * daysSince('4/1/2019')) * cellHeight;
    }


})();
