// ==UserScript==
// @name         Google Keep Backup
// @namespace    aljgom
// @version      0.1
// @description  Deselects all products and selects Google Keep to back it up
// @author       aljgom
// @match        https://takeout.google.com/settings/takeout
// @match        https://takeout.google.com/settings/takeout/
// @match        https://bitly.com/a/warning?hash=2QQtLmu*
// @grant        none
// ==/UserScript==

(async function(){
    'use strict';
    let url = document.location.toString();
    let sleep = ms => new Promise(resolve=>setTimeout(resolve,ms));

    if(url.match('https://takeout.google.com')){
        await sleep(1000);
        document.getElementsByClassName('RveJvd snByac')[2].click();          // click on select none


        // Find the toogle for Keep by reading all the names.
        var keep = null;
        HTMLCollection.prototype.forEach = Array.prototype.forEach;
        document.getElementsByClassName('uz1rMe').forEach(el=>{
            if(el.children[2] && el.children[2].children[0]){
                if(["Keep", "Notizen"].indexOf(el.children[2].children[0].innerText) >= 0){     // see if the name matches the list (Notizen = german Keep)
                   keep = el.children[5].children[0].children[0];
                }
            }
        });

        // Scroll to Google Keep toggle
        keep.scrollIntoView();
        window.scrollTo(0,window.scrollY-200);      // scroll up a bit because keep is covered by bar
        await sleep(1000);
        keep.click();

        // Add listener to 'select' button so that 'backup' button will be pressed automatically
        document.getElementsByClassName('RveJvd snByac')[20].parentElement.parentElement.addEventListener('click', async ()=>{
            await sleep(1000);
            document.getElementsByClassName('RveJvd snByac')[22].click();
        });
    }

    // Redirect bitly "warning" page to takeout
    if(url.match('bitly')){                         // Userscript match is for bitly.com/2QQtLmu
        window.location = "https://takeout.google.com/settings/takeout/"
    }


})();
