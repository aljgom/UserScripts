// ==UserScript==
// @name         Keep Backup
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  -
// @author       aljgom
// @match        https://takeout.google.com/settings/takeout
// @match        https://takeout.google.com/settings/takeout/
// @grant        none
// ==/UserScript==
console.log(GM_info.script.name+"%c Script: "+document.location.toString(),'color:green');

(async function() {
    'use strict';

    var sleep = ms => new Promise(resolve=>setTimeout(resolve,ms))

    await sleep(1000);
    document.getElementsByClassName('RveJvd snByac')[2].click();          // click on select none


    // Find the toogle for Keep by reading all the names.
    var keep = null;
    HTMLCollection.prototype.forEach = Array.prototype.forEach;
    document.getElementsByClassName('uz1rMe').forEach(el=>{
    	if(el.children[2] && el.children[2].children[0]){
            if(el.children[2].children[0].innerText == "Keep"){
               keep = el.children[5].children[0].children[0];
            }
        }
    })


    keep.scrollIntoView();
    window.scrollTo(0,window.scrollY-200)   // scroll up a bit because keep is covered by bar
    await sleep(1000);
    keep.click();

    document.getElementsByClassName('RveJvd snByac')[20].addEventListener('click', async()=>{
	    await sleep(1000);
	    document.getElementsByClassName('RveJvd snByac')[22].click();
    });




})();
