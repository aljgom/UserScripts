// ==UserScript==
// @name         OneTab
// @namespace    aljgom
// @version      0.1
// @description  additions to the OneTab 'share as website' page
// @author       aljgom
// @match        https://www.one-tab.com/page/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// ==/UserScript==
//
(async function() {
    'use strict';
    let url = document.location.href;

    await sleep(500);                    /* Wait for links to show up in page */
    /* Change the Tab Title */
    // Look in the script's storage for a title
    // if it doesn't exist, prompt for one and store it
    if( [undefined, null, 'null - OneTab'].includes( GM_getValue(url) ) ){
        if(document.hasFocus()){                                //  prompt only if the window is focused
            GM_setValue(url, prompt('Enter a Tab Title'));
        }else{                                                   // if it's not focused, wait until it is to do it
            window.onfocus = ()=>{
                GM_setValue(url, prompt('Enter a Tab Title'));
                window.onfocus = undefined
                document.title = GM_getValue(url) + ' - OneTab'
            }
        }
    }
    document.title = GM_getValue(url) + ' - OneTab'

})();
