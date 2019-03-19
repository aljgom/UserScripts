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
        document.getElementsByClassName('ksBjEc')[1].click();           // click on select none


        // Find the toogle for Keep by reading all the names.
        var keepBox = null;
        HTMLCollection.prototype.forEach = Array.prototype.forEach;
        document.getElementsByClassName('gGfIad').forEach(el=>{         // selector for whole row
           if(el.children[1] && el.children[1].children[0]){            // make sure node has children
               if(["Keep", "Notizen"].includes(el.children[1].children[0].innerText)){     // see if the name matches the list (Notizen = german Keep)
                  keepBox = el.children[2].children[0].children[0];     // keep checkbox
               }
           }
       });

        // Scroll to Google Keep toggle
        keepBox.scrollIntoView();
        window.scrollTo(0,window.scrollY-300);                          // scroll up a bit because keep is covered by bar
        await sleep(1000);
        keepBox.click();

        // Add listener to 'select' button so that 'backup' button will be pressed automatically
        document.getElementsByClassName('oFLoie')[0].children[0].addEventListener('click', async ()=>{
            await sleep(1000);
            document.getElementsByClassName('oFLoie')[1].children[0].click();
        });
    }

    // Redirect bitly "warning" page to takeout
    if(url.match('bitly')){                         // Userscript match is for bitly.com/2QQtLmu
        window.location = "https://takeout.google.com/settings/takeout/"
    }


})();
