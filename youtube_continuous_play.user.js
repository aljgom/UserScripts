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

    var debug = ()=>{};
    //debug = console.log.bind(console)

    setInterval(()=>{
        if(document.querySelectorAll('paper-dialog')[0] &&
            document.querySelectorAll('paper-dialog .line-text')[0].innerText.match(/Video angehalten|Video stopped/) &&
            document.querySelectorAll('paper-dialog')[0].style.display != "none" )
        {
                document.querySelectorAll('paper-dialog #confirm-button')[0].click();
        }
    },5*1000);



    // click next button if video ends and next video doesn't start playing automatically.
    // only when the window is not focused, so it doens't leave the video the page is being looked at
    setInterval(async ()=>{
        var video = document.querySelectorAll('video')[0];
        await sleep(2000);
        debug('duration ', video.duration);
        debug('current Time ', video.currentTime);
        debug('duration == currentTime', video.duration == video.currentTime)
        debug('document not focused', !document.hasFocus())
        if(!document.hasFocus() && video.duration == video.currentTime){
            await sleep(10*1000);
            if(!document.hasFocus() && video.duration == video.currentTime){   // if 10 seconds later it's still paused
                console.log('Youtube Continuous Play: click next');
                document.getElementsByClassName('ytp-next-button ')[0].click()
            }
        }
        else debug ("didn't click")
    },10*1000)
})();
