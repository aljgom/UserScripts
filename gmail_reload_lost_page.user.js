// ==UserScript==
// @name           Gmail Reload Lost Page
// @namespace      aljgom
// @version        0.1
// @description    Reloads tabs that were opened from another gmail window and lost reference to it and now display nothing.
//                 Redirects them to a new url that works, matching the email ID
//                 This could be used as a bookmarklet instead as well, just using the redirection without checking for when to run it and doing it manually as needed
//                 This uses a lot of ram, since each tab reloads a whole new Gmail page instead of all referencing to one (as expected, but keep it in mind)
// @match          https://mail.google.com/?ui=2&view=btop*
// ==/UserScript==

(async function(){
    if( ! document.location.toString().match('ui=2&view=btop')) return   // adding a url match in case this script is 'required' instead of saved as a new script (ui=2&view=btop seems to be how the page is displayed when opened in a new window)

    document.addEventListener("readystatechange", async function() {
        // wait until page finishes loading to check if we should redirect
        if(document.readyState == 'complete'){
            // wait 5 seconds more to check if we should redirect
            await new Promise(resolve=>setTimeout(resolve, 5*1000))
            if(document.querySelector('.SG') == null){               // this element exists on pages that are loaded but not on 'lost' pages
                redirect();
            }
        }
    });

    function redirect(){
        var inbox_or_spam = document.location.toString().match('search=spam')?"spam":"inbox";   // used for creating the redirection url
        // create a dictionary from url key/value pairs
        var d= {};
        document.location.search.substr(1).split("&").forEach(function(e){
            var t = e.split("=");
            d[t[0]] = t[1]
        });
        // redirect
        history.pushState({}, window.location.href)                   // make sure to save url into history so we can go back if desired
        document.location = `https://mail.google.com/mail/u/0/#${inbox_or_spam}/` + d['th'];
    }



})();
