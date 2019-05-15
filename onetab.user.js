// ==UserScript==
// @name         OneTab
// @namespace    aljgom
// @version      0.1
// @description  additions to the OneTab 'share as website' page. Prompting for tab titles, adding buttons for opening all links, opening all automatically if url contains openAll=true
// @author       aljgom
// @match        https://www.one-tab.com/page/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        unsafewindow
// @grant        window.close
// ==/UserScript==
//
(async function() {
    'use strict';
    while(typeof(waitFor) === "undefined"){
        console.log('waiting for All Pages')
        await new Promise(resolve=>setInterval(resolve, 200))
    }

    let url = document.location.href;
    await sleep(500);                    /* Wait for links to show up in page */
    let links = document.querySelectorAll('body>div>div>a');
    for(let link of links){
        link.href = link.href.replace('http://chrome-extension','chrome-extension:');  /* replace for suspended tabs from The Great Suspender extension */
    }

    async function openAll(wait=false){
        for(let link of links){
            open(link.href);
            if(wait) await sleep(3000);
        }
    }

    // if the url contains openAll=true, it opens all the links automatically
    if(urlParams.get('openAll') == 'true') {
        openAll();
        window.close();
    }

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


    /* Add 'open all links' buttons */
    let button = document.createElement('div');
    button.innerHTML = `<a href='javascript:void(0)' id='openAll' style='font-size:12px'>Open all links</a>`
    document.body.children[0].children[3].appendChild(button)
    button.onclick = ()=>openAll(false);

    button = document.createElement('div');
    button.innerHTML = `<a href='javascript:void(0)' id='openAllDelayed' style='font-size:12px'>Open all links with delay</a>`
    document.body.children[0].children[3].appendChild(button)
    button.onclick = ()=>openAll(true);


})();
