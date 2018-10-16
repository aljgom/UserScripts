// ==UserScript==
// @name         Youtube Continuous Play
// @namespace    aljgom
// @version      0.1
// @description  When playing in the background for a long time, youtube will eventually stop the video and
//               ask if we want to contininue playing. This will click yes automatically when the dialog shows up.
// @author       aljgom
// @match        https://www.youtube.com/watch*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    setInterval(()=>{
        if(document.querySelectorAll('paper-dialog')[0] &&
            document.querySelectorAll('paper-dialog .line-text')[0].innerText.match(/Video angehalten|Video stopped/) &&
            document.querySelectorAll('paper-dialog')[0].style.display != "none" )
        {
                document.querySelectorAll('paper-dialog #confirm-button')[0].click();
        }
    },5*1000);

})();
