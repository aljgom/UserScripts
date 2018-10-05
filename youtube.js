// ==UserScript==
// @name       Youtube
// @namespace  aljgom
// @version    0.1
// @description  -
// @author       aljgom
// @match      http://www.youtube.com/watch*
// @match      https://www.youtube.com/watch*
// @match      https://www.youtube.com/*
// @match      http://www.youtube.com/embed*
// @match      https://www.youtube.com/embed*
// @match      https://ycapi.org/*
// @grant      unsafewindow
// @grant      window.close
// @copyright  2012+, You
// ==/UserScript==


// uses waitFor from AllPages script, make sure it runs before this.

(async ()=>{
    // why is this part run? breaks ycapi download cuz never matches url
    /*
    while( ! document.location.toString().match(/watch|embed/) ){
		log('youtube script: waiting for url match');
		await sleep(2000);
	}
*/


    HTMLCollection.prototype.forEach = Array.prototype.forEach;
    debug =  ()=>{};  // debug = function(){console.log(...arguments);};


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
    newButtons = [];
    function addToButtons(label, click){
        newButtons.push({label:`| ${label} |`, click:click});
    }

    function addButtons(){  // rename this.
        newButtons.forEach(nb=>{
            try{
                var btn = buttons[0].children[0];
                var x = document.createElement('div'); x.innerHTML = nb.label; x.style.color = 'gray'; x.style.cursor ="pointer";
                btn.parentElement.insertBefore(x,btn);
                x.onclick = nb.click;
            }catch(err){             console.log("%cError adding '"+JSON.stringify(nb)+"' in addToButtons()",'orange');  throw err;  }
        });
        debug('ended add buttons loop');
    }
    setInterval(()=>{   // keep repeating to read when video changes
        if(!unsafeWindow.buttons[0] || !unsafeWindow.buttons[0].children || !unsafeWindow.buttons[0].children[0]) {
            log('reference button not found');
            return;
        }
        if(buttons[0].children.length>5) return;
        addButtons();
    },1000);



    /*** AUTORELOAD ON ERROR ***/
    (async ()=>{
        var video = document.getElementsByClassName("video-stream")[0]
        await waitFor(()=> video.currentTime > 0, 10*1000);                                        // wait for initialized video
        if(localStorage.reloading){                                                                // after reloaded, move to saved time if it exists
            video.pause();
            video.currentTime = localStorage.reloading;
            localStorage.reloading = '';                                                           // clear
            setTimeout(()=>video.play(),2000);
        }
    })();

    var lastTime = 0;
    setInterval(()=>{
        var video = document.getElementsByClassName("video-stream")[0];
        if( document.querySelectorAll(".ytp-error-content")[0]  ||                             // if 'video error' message or
            video.currentTime == lastTime && ! video.paused && video.currentTime !== 0){       // every 8 seconds check if video is moving when not paused
            localStorage.reloading = video.currentTime;                                        // save current time to move to it after reloading
            document.location.reload();
        }
        lastTime = video.currentTime;
    }, 8*1000);



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

    if(! localStorage.skip) localStorage.skip = '[]';
    var skip = JSON.parse(localStorage.skip);
    setInterval(async ()=>{                                                        debug('interval: skip vid');
                     var video = document.getElementsByClassName("video-stream")[0];
                     var currentVid = document.location.toString();
                     if(document.location.toString().match("embed")){
                         currentVid = document.getElementsByClassName("ytp-title-link")[0].href;
                     }
                     window.videoCode = currentVid.match(/(&v=|\?v=|embed\/)(.*?)(&|$|\?)/)[2];  // works on embeded or normal site

                     if( skip.indexOf(videoCode) > -1 ){
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
                         /*
      waitFor('document.getElementsByClassName("ytp-next-button")[0]', 10*1000)
      .then((el)=>{
          log(el)
          el.click();
      })      ;
      */
                     }
    },3000);

    function addToSkip(){
        skip.push(videoCode);
        localStorage.skip = JSON.stringify(skip);
    }



    /********  KILLS THE REST OF THE SCRIPT IN ENBEDDED MODE !!!!!    ***/
    if(document.location.toString().match("embed")) return;

    /******/


    // insert skip button
    addToButtons("Add To Skip", addToSkip);
    debug('passed skip vid');

    /*** REMOTE CONTROL ***/


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
    style = document.createElement('style');

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
                hideRecommendations = function(){
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

                hide = function(){localStorage.hideRecommendations=true;};
                unhide=function(){localStorage.hideRecommendations=false;};

                setInterval(function(){
                    if( localStorage.hideRecommendations == "true" ) hideRecommendations();
                },100);

                if( localStorage.hideRecommendations != "true" ) setTimeout(hide, 2*60*1000);
            }
        },1000);

        debug('passed get rid of reccomendations');
    }













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























