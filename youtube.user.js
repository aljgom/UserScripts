// ==UserScript==
// @name         Youtube
// @namespace    aljgom
// @version      0.31
// @description  Various modifications:
//               Loop and reverse playlist
//               Autoreload on error
//               Download mp3
//               Change speed for playlist
//               Skip videos in playlist
//               Add a remote control mini window
//               Select highest resolution
//               Close 'click here' anotations
//               Get rid of recommendations
//               Add Date to fullscren title, skip videos depening on date
//               Keyboard speed control
//               Add Playlist name to Tab Title
//               Button to pause/play all active videos at once -  When multiple videos are being played at the same time, this button will pause them all, and restart playing them if pressed again, while leaving other videos alone
// @author       aljgom
// @match        http://www.youtube.com/watch*
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/*
// @match        http://www.youtube.com/embed*
// @match        https://www.youtube.com/embed*
// @match        https://ycapi.org/*
// @grant        unsafewindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        window.close
// ==/UserScript==



(async ()=>{
    // uses waitFor from AllPages script, make sure it runs before this.
    while(typeof(waitFor) === "undefined"){
        console.log('waiting for All Pages')
        await new Promise(resolve=>setInterval(resolve, 200))
    }

    HTMLCollection.prototype.forEach = Array.prototype.forEach;
    var debug =  ()=>{};  // debug = function(){console.log(...arguments);};


    /** ADD PLAYLIST TITLE TO TAB TITLE **/
    (async function playlistTabTitle(){
        if(document.location.href.match('[&?]list=')){
            // this title selector has size 2 when it's a playlist and size 1 when it isn't
            // await waitFor(()=>document.getElementsByClassName('title style-scope ytd-playlist-panel-renderer').length > 1)
            let savedTitle = ''
            setInterval(async function(){
                if(savedTitle != document.title){       // chech if tab title has changed
                    let playlistTitle = document.getElementsByClassName('title style-scope ytd-playlist-panel-renderer')[0].innerText
                    document.title = playlistTitle + " - " + document.title;
                    savedTitle = document.title;
                }
            },20*1000)  // title gets replaced after a while, just using a wait to fix it for now, also good if it only shows video title first, and after a while changes it to Playlist title + vid Title. Title changes also if notification count changes

        }
    })();


    /** LOOP AND REVERSE PLAYLIST **/
    if( document.location.toString().match('list=UUZwegPHTG4gvnR0WLzaq5OQ') || // anya
        document.location.toString().match('list=PL_oPtLrWuM5MFLlt0WMJzuV94rFAqdVb0') || // minimal millenials')
        document.location.toString().match('list=PLZJRuafNYdPyq6JkoiQDKPkt1Yp52Cx2U')){  // eamon and bec
        debug('reversing playlist');
        var reverse = true;  // used in skip vid code

        setInterval(async ()=>{
            var url = document.location.toString();
            var video = document.getElementsByClassName("video-stream")[0];
            if( video.duration - video.getCurrentTime() < 4 ){
                if( url.match(/index=1($|&)/) ) // & or end of line
                    document.location = 'https://www.youtube.com/watch?v=bIUgT4H-zWw&index=236&t=1s&list=UUZwegPHTG4gvnR0WLzaq5OQ';
                else{
                    video.pause();
                    document.getElementsByClassName('ytp-prev-button')[0].click();
                    await sleep(100);
                    document.getElementsByClassName('ytp-prev-button')[0].click();
                }
            }
        }, 2000);
    }

     /**SKIP AD
     setInterval(()=>{
         console.log('interval: skip ad');
         if(document.querySelectorAll('.videoAdUi')[0]){
             v = document.querySelector('video');
             v.currentTime = v.duration;
         }
     },1000);
    *** END SKIP AD **/



    /*** ADDING BUTTONS **/
    let newButtons = [];
    function addToButtons(label, click, id){
        newButtons.push({label:label, click:click, id:id});
    }

    function addButtons(){  // rename this.
        newButtons.forEach( nb=>{
            try{
                let btn = unsafeWindow.buttons[0].children[0];
                let x = document.createElement('div');
                x.innerHTML = `| ${nb.label} |`;
                x.style.color = 'gray'; x.style.cursor ="pointer";
                btn.parentElement.insertBefore(x,btn);
                x.onclick = nb.click;
                x.id = nb.id;
            }catch(err){             console.log("%cError adding '"+JSON.stringify(nb)+"' in addToButtons()",'orange');  throw err;  }
        });
        debug('ended add buttons loop');
    }
    setInterval(()=>{   // keep repeating to read when video changes
        if(document.location.toString().match("embed")) return;             // don't add in embeded mode
        if(!unsafeWindow.buttons[0] || !unsafeWindow.buttons[0].children || !unsafeWindow.buttons[0].children[0]) {
            log('Adding buttons: Waiting for reference button');
            return;
        }
        if(unsafeWindow.buttons[0].children.length>5) return;
        addButtons();
    }, 2000);



    /*** AUTORELOAD ON ERROR
    ***/
    (async function autoReload(){
        (async function moveToSavedTime(){
            let video = document.getElementsByClassName("video-stream")[0];
            await sleep(1000);
            await waitFor(()=> video.currentTime > 0, 10*1000);                                         // wait for initialized video
            if(GM_getValue('reloading')){                                                               // after reloaded, move to saved time if it exists
                document.getElementsByClassName('ytp-mute-button')[0].click();                          // unmute
                video.pause();
                video.currentTime = GM_getValue('reloading');
                GM_setValue('reloading','');                                                            // clear
                setTimeout(()=>video.play(),2000);
            }
        })();

        let lastTime = 0;
        let getReloadTries = ()=> GM_getValue('reloadTries') ? parseInt(GM_getValue('reloadTries')) : 0;   // can be shared across other tabs

        async function checkForError(){
            checkForError.count = checkForError.count ? checkForError.count + 1 : 1;                    // keep counter of function calls
            let reloadTries = getReloadTries();
            // log___('reloadTries ', reloadTries,  (reloadTries - (checkForError.count % reloadTries)) % reloadTries)
            // log___('reloading', await GM_getValue('reloading'));
            if(await GM_getValue('reloading')) return;                                                  // don't reload if reloading process hasn't finished, or if another window is reloading
			if(reloadTries > 0 && checkForError.count % reloadTries != 0) return;                       // if it keeps retrying, increase the wait time between checks

            var video = document.getElementsByClassName("video-stream")[0];
            if( document.querySelectorAll(".ytp-error-content")[0]  ||          // if 'video error' message or video not paused and time hasn't changed
                video.currentTime == lastTime && ! video.paused && video.currentTime !== 0
            ){
                GM_setValue('reloading', video.currentTime);                                            // save current time to move to it after reloading
                GM_setValue('reloadTries',reloadTries+=1)
                document.getElementsByClassName('ytp-mute-button')[0].click();                          // mute before reloading
                document.location.reload();
                return;
            }
            if(checkForError.count / reloadTries == 1) decreaseReloadTries();                           // if it loaded without errors, decrease reloadTries (only the first time checking erros passes)
            lastTime = video.currentTime;
        }

        function decreaseReloadTries(){
            let reloadTries = getReloadTries();
            GM_setValue('reloadTries', reloadTries = Math.max(0, reloadTries-1));
        }

        setInterval(checkForError, 8*1000);                                                             // every 8 seconds check if the video is moving when not paused

        /* since we're reloading videos only one by one, there shouldn't be a need to pause others, so ignore this part */
        async function checkReloading(){                                                                // pause if other tabs are reloading. Videos sometimes crash when other videos load, it can be help avoid it if they're paused
            let video = document.getElementsByClassName("video-stream")[0];

                // not paused by thispause by this
                //  process of reloading
                // wasn't paused
                // window vissible
                if( GM_getValue('reloading') //&&
                //    !video.paused && document.visibilityState == "visible"  // only pause visible videos, non-visible should not use as much cpu and they the browser might not start replaying them again if not visible
                ){
                    video.pause();
                    checkReloading.paused = true;
                }
                else if(checkReloading.paused){
                    await sleep(5000)
                    video.play();
                    checkReloading.paused = false;
                }

                if( document.visibilityState == "visible" ){
                    if(checkReloading.paused && !GM_getValue('reloading')){
                        await sleep(5000)
                        video.play();
                        checkReloading.paused = false;
                    }
                }
        }


    //    setInterval(checkReloading, 2000);



    })();




    /*** DOWNLOAD MP3 ***/

    // for downloading
    if( document.location.toString().match('https://ycapi.org')){
        var e = await waitFor(()=>gi('buttons').style.display == 'block' ? gi("download") : false,10*1000);
        setTimeout(()=>e.click(),1000);
        onfocus = close;
        return;
    }

    if( document.location.toString().match('https://ycapi.org/p/')){ // publicity redirect
        window.close();
    }

    addToButtons('Download MP3', function(){
        var videoCode = document.location.toString().match(/(&v=|\?v=|embed\/)(.*?)(&|$|\?)/)[2];  // copied this line from "skip video" code
        var w = window.open('https://ycapi.org/iframe/?v='+videoCode+'&f=mp3','','width=370,height=200');
        // Then opens window, and code at begining of doc runs on it to click 'download'
        //var w = window.open('http://www.video2mp3.de/?url=' + document.location.toString(),'','resizable=1,toolbar=0,location=1,status=0,menubar=0,scrollbars=1,width=400,height=420');
    });

    debug('passed download mp3');


    // CLICK LOOP BUTTON
    (async ()=>{
        var loop = await waitFor('document.querySelectorAll("#playlist-actions .ytd-toggle-button-renderer")[0]', 5*1000);
        if( loop ){
            debug('clicking loop button');
            if(!loop.children[0].className.match('active')) loop.click();
        }
        else{ debug('loop button not found');}
    })();




    /** CHANGE SPEED FOR PLAYLIST **/

    (async ()=>{
        var el  = await waitFor('document.getElementsByTagName("video")[0]',20*1000);
        if(el){
            var count = 0;
            var inter = setInterval(()=>{
                if(count++ > 3) clearInterval(inter);
                if( document.location.toString().match("PLUX6FBiUa2g4YWs6HkkCpXL6ru02i7y3Q") ) {el.playbackRate = 1.8; } // matches algorithms MIT course playlist
            },1000);
        } else debug('passed change playlist speed');
    })();



    /*** SKIP VIDEO ***/
    (async function skipVideos(){
        if(!GM_getValue('skip')) GM_setValue('skip','[]');
        let skip = JSON.parse(GM_getValue('skip'));
        setInterval(async function skipCheck(){                                                        debug('interval: skip vid');
            if(!document.location.href.match('https://www.youtube.com/watch')) return
            let video = document.getElementsByClassName("video-stream")[0];
            let currentVid = document.location.toString();
            if(document.location.toString().match("embed")){
             currentVid = document.getElementsByClassName("ytp-title-link")[0].href;
            }
            window.videoCode = currentVid.match(/(&v=|\?v=|embed\/)(.*?)(&|$|\?)/)[2];  // works on embeded or normal site

            if( skip.indexOf(window.videoCode) > -1 ){
                if(reverse){
                    if( currentVid.match(/index=1($|&)/) ) // & or end of line
                        document.location = 'https://www.youtube.com/watch?v=bIUgT4H-zWw&index=236&t=1s&list=UUZwegPHTG4gvnR0WLzaq5OQ';
                    else{
                        video.pause();
                        document.getElementsByClassName('ytp-prev-button')[0].click();
                        await sleep(100);
                        document.getElementsByClassName('ytp-prev-button')[0].click();
                    }
                }
                else document.getElementsByClassName("ytp-next-button")[0].click();
            }
        },3000);

        function addToSkip(){
            skip.push(window.videoCode);
            GM_setValue('skip', JSON.stringify(skip));
        }

        // insert skip button
        addToButtons("Add To Skip", addToSkip);
        debug('passed skip vid');
    })();




/********  KILLS THE REST OF THE SCRIPT IN ENBEDDED MODE !!!!!    ***/
    if(document.location.toString().match("embed")) return;

    /******/



    /*** REMOTE CONTROL ***/
    /* Pop-up a small seperate window that is able to control the video */
    (async function addRemoteControl(){

        // Control Window

        if(typeof(ws) == "undefined") var ws = [];							// windows opened
        ws.closeAll = function(){
            while(ws.length > 0){
                ws[0].close();
                ws.splice(0,1);
            }
        };
        window.onbeforeunload = function(){ws.closeAll();};

        function ControlWindow(){
            var self = this;
            self.openerW = window;
            ws.push(self);
            self.w = window.open('','','resizable=1,toolbar=0,location=0,status=0,menubar=0,scrollbars=1,width=378,height=114');
            self.w.moveTo(600,100);
            self.copyButton = function(label,className) {
                var btn = document.createElement('button');
                btn.onclick = function(){self.openerW.document.getElementsByClassName(className)[0].click();};
                btn.innerHTML = label;
                return btn;
            };
            setTimeout(function(){
                self.w.document.title = "ꘖ - Youtube Remote";
                self.w.document.getElementsByTagName('head')[0].appendChild(style);                            // insert css
                self.w.document.body.appendChild( self.copyButton('Prev','ytp-prev-button') );
                self.w.document.body.appendChild( self.copyButton('Play','ytp-play-button') );
                self.w.document.body.appendChild( self.copyButton('Next','ytp-next-button') );
                self.w.document.body.appendChild( self.copyButton('Mute','ytp-mute-button') );
                self.w.document.body.appendChild( self.copyButton('Full Screen','ytp-fullscreen-button') );
                //add favicon   TODO: not working. Could probably create a local page with the favicon specified, and open that page and run the code, instead of using an empty page
                var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = 'https://www.youtube.com/yts/img/favicon_32-vfl8NGn4k.png';
                link.sizes= '32x32';
                self.w.document.getElementsByTagName('head')[0].appendChild(link);
            },500);
            self.close = function(){self.w.close();};
        }


        // insert remote button
        addToButtons("Remote Control", function(){ new ControlWindow(); });
        debug('passed remote control');

    })();




    /*** PAUSE/PLAY ALL ***/
    /* When multiple videos are being played at the same time, this button will pause them all, and restart playing them if pressed again, while leaving other videos alone */
    (async function addPausePlayAll(){
        let wasPlaying;
        GM_addValueChangeListener('pausePlayAll', function(name, old_value, new_value) {
            if(new_value == '') return;
            let action = new_value
            let video = document.getElementsByClassName("video-stream")[0];
            let pausePlayAllBtn = document.getElementById('pausePlayAllBtn');
            let buttonLabel = pausePlayAllBtn.innerHTML;
            if(action == 'play'){
                pausePlayAllBtn.innerHTML = buttonLabel.replace('Play','Pause');
                if(video.paused && wasPlaying) document.getElementsByClassName('ytp-play-button')[0].click();
            }
            else{  // pause
                pausePlayAllBtn.innerHTML = buttonLabel.replace('Pause','Play')
                wasPlaying = !video.paused;
                if(!video.paused) document.getElementsByClassName('ytp-play-button')[0].click();
            }
            GM_setValue('pausePlayAll', '')             // reset shared variable
        })

        function pausePlayAllClick(){
            if(this.innerHTML.match('Play'))
                GM_setValue('pausePlayAll', 'play')
            else
                GM_setValue('pausePlayAll', 'pause')
        }
        addToButtons("Pause All", pausePlayAllClick, 'pausePlayAllBtn');
        debug('passed add pause/play all button');

    })();



    /*** INSERT CSS ***/
    var css = `
        body{
        background:rgb(255,96,88);
        }
        button{
        display: inline-block;
        height: 28px;
        border: solid 1px transparent;
        padding: 0 10px;
        font-weight: bold;
        text-decoration: none;
        white-space: nowrap;
        line-height: normal;
        cursor: pointer;
        border-radius: 2px;
        border-color: #d3d3d3;
        background: #f8f8f8;
        color: #3a3a3a;
        font-size: 16px;
        box-shadow: 0 1px 0 rgba(0,0,0,0.05);
        margin: 1px;
        }
        button:hover{
        border-color: #c6c6c6;
        background: #f0f0f0;
        box-shadow: 0 1px 0 rgba(0,0,0,0.10);
        }
        button:active{
        border-color: #c6c6c6;
        background: #e9e9e9;
        box-shadow: inset 0 1px 0 #ddd;
        }
        button:focus {
        outline: 0;
        }
        `;
    var style = document.createElement('style');

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    // NOTE: for this script we insert on opened window.
    // document.getElementsByTagName('head')[0].appendChild(style);
    debug('passed inserting new css');













    /***SELECT HIGHEST RESOLUTION ***/
    /*
var highResInter = setInterval(function(){
    videoStream = document.getElementsByClassName("video-stream")[0];
    if(typeof(videoStream) == 'undefined') return;
    clearInterval(highResInter);
    videoStream.addEventListener('loadedmetadata',setResolution);
    //setResolution();
},300);

setResolution = function(){
    setTimeout(function(){
        document.getElementsByClassName("ytp-settings-button")[0].click();
        setTimeout(function(){document.getElementsByClassName("ytp-panel-menu")[0].lastChild.click();},500);
        setTimeout(function(){
            if( document.getElementsByClassName("ytp-menuitem")[0].attributes['aria-checked'] === undefined ){ // not checked
                document.getElementsByClassName("ytp-menuitem")[0].click();                    // select highest
            }else document.getElementsByClassName("ytp-settings-button")[0].click();        // click menu button
        },2500);
    },1000);
};
                                                                         debug('passed highest resolution');
*/

    /**** CLOSE ANNOTATIONS ****/  // 'click here' boxes in video

    setInterval(function(){
        document.getElementsByClassName("annotation-close-button").forEach(function(e){e.click();});
    },5000);
    debug('passed close annotations');



    /*** GET RID OF RECOMENDATIONS ***/
    if(false){
        var recom = setInterval(function(){
            if(document.location.toString().match("https://www.youtube.com/watch?")) {
                clearInterval(recom);
                var hideRecommendations = function(){
                    localStorage.hideRecommendations='true';
                    var nodes=document.getElementsByClassName("watch-sidebar")[0].style.display="none";
                    document.getElementById("watch7-main").className="";
                    document.getElementById("watch7-content").style.float="none";
                    content.style.width="640px";
                    content.style.minWidth=0;
                    player.style.width="640px";
                    player.style.minWidth=0;
                    if( document.getElementsByClassName("html5-endscreen")[0] !== undefined){
                        document.getElementsByClassName("html5-endscreen")[0].style.display = "none";
                    }
                };

                var hide = function(){localStorage.hideRecommendations=true;};
                var unhide=function(){localStorage.hideRecommendations=false;};

                setInterval(function(){
                    if( localStorage.hideRecommendations == "true" ) hideRecommendations();
                },100);

                if( localStorage.hideRecommendations != "true" ) setTimeout(hide, 2*60*1000);
            }
        },1000);

        debug('passed get rid of reccomendations');
    }






    /*** ADD DATE TO FULLSCREEN TITLE, SKIP DEPENDING ON DATE ***/
    // At the moment works with German youtube, and changes it to 'MM/DD/YYY'
    // can set the month and year in the if statement below, and it will skip videos and play only the ones from that month
    var dateTitleSkip = async function dateTitleSkip(){
        if(!document.querySelectorAll('.date')[0]){
            log('waiting for video date');
            return;
        }
        var uploadDate = document.querySelectorAll('.date')[0].innerHTML.replace('Am ','').replace(' veröffentlicht','').split('.')
        var dateString = ` - ${uploadDate[1]}/${uploadDate[0]}/${uploadDate[2]} `;
        if(window.location.href.match('PLJaq64dKJZoqEYa7L0MSUtM5F8lzryMgw')){
            if( !(uploadDate[2] == '2018' && uploadDate[1] == '03')){
                clearInterval(dateSkipInter)
                dateSkipInter = setInterval(dateTitleSkip, 1000)                                    // increase the repetition speed of the interval until date matched
                if(!document.getElementsByClassName("video-stream")[0].muted)
                    document.getElementsByClassName("ytp-mute-button")[0].click();                  // mute
                document.getElementsByClassName("ytp-next-button")[0].click()                       // skip
                return;
            }
            else {
                clearInterval(dateSkipInter)
                dateSkipInter = setInterval(dateTitleSkip, 3000)                                    // decrease the repetition speed of the interval until next video starts
                if(document.getElementsByClassName("video-stream")[0].muted)
                    document.getElementsByClassName("ytp-mute-button")[0].click();                  // unmute
            }
        }
        if(!document.querySelectorAll('.ytp-title-link')[0].innerHTML.match(dateString)){
            document.querySelectorAll('.ytp-title-link')[0].innerHTML += dateString
            // document.querySelectorAll('.title')[0].children[0].innerHTML += dateString
            document.querySelectorAll('.ytp-title-link')[0].addedDate = true
        }
    }
    var dateSkipInter = setInterval(dateTitleSkip, 3000)







    /*** KEYBOARD SPEED CONTROL ***

speedControlDone = false;

var speedControl = setInterval(function(){

    videoStream = document.getElementsByClassName("video-stream")[0]
    if(typeof(videoStream) != 'undefined'){
        if(speedControlDone) return;                             //redoes addding listener for new videos
        speedControlDone = true;
        console.log('adding speed control')

        try{
            videoStream = document.getElementsByClassName("video-stream")[0]
            speedDiv = document.getElementsByClassName("yt-masthead-logo-container ")[0].appendChild(document.createElement('div'));
            speedDiv.style.position="absolute"
            speedDiv.style.top = "10px"
            speedDiv.style.left = "130px"

            document.body.addEventListener("keypress", function(e){
                if(document.activeElement==document.body || document.activeElement == movie_player){	// don't change speed if focus is in input elements
                    if(e.which==113) {videoStream.playbackRate += .5; speedDiv.innerHTML = "x"+videoStream.playbackRate}
                    if(e.which==97)  {videoStream.playbackRate -= .5; speedDiv.innerHTML = "x"+videoStream.playbackRate}
                }
            })
        }
        catch(err){ // When HTML5 is not used for video, and exeption will be raised

    }

},1000);




    ***/








})();
