// ==UserScript==
// @name       Google Keep
// @namespace    aljgom
// @version    0.1
// @description  Additional functionality and UI changes for Google Keep
// @match      https://keep.google.com/*
// @author       aljgom
// @grant        none
// ==/UserScript==

(async function(){

    // *** CHANGE TITLE OF TAB **//
    setInterval(()=>{
        if(document.location.href.match('#home')) return;           // Leave the homepage alone
        var titles = document.querySelectorAll('[aria-label=Title]')
        document.title = titles[titles.length-1].innerHTML          // Change the tab title to the name of the current List/Note
    },2000);


})();
