// ==UserScript==
// @name       All Pages
// @namespace  aljgom
// @description  adds global functions/variables, other scripts depend on these
// @match      http://*/*
// @match      https://*/*
// @grant      GM_setValue
// @grant      GM_getValue
// @grant      GM_deleteValue
// @grant      GM_listValues
// @grant      GM_xmlhttpRequest
// @grant      unsafewindow
// @grant      window.close
// ==/UserScript==

var url = document.location.toString();

// Add forEach to HTMLTableSectionElement, NodeList and HTMLCollection
HTMLTableSectionElement.prototype.forEach = NodeList.prototype.forEach = HTMLCollection.prototype.forEach = Array.prototype.forEach;


function gi(id){ return document.getElementById(id); }
function gc(cl){ return document.getElementsByClassName(cl); }

if(!url.match(/.google.com|.youtube.com/)){      // breaks google docs, probably other google apps too
// Add sorting function to be able to sort using a key function
    Array.prototype.sortBy = function(key_func, reverse=false){
        return this.sort( (a, b) => {
            var keyA = key_func(a),
                keyB = key_func(b);
            if(keyA < keyB) return reverse? 1: -1;
            if(keyA > keyB) return reverse? -1: 1;
            return 0;
        });
    }
     addFunc(gi);
     addFunc(gc);
 }

/* Adds functions to the window object */
function addFunc(f,force){
    if( !(f.name in unsafeWindow) )  unsafeWindow[f.name] = f;
    else{
        log___('%caddFunc: '+ f.name +' already exists','color:grey');
        if(force) {
            log___('%caddFunc:   force adding '+ f.name , 'color:grey' );
            unsafeWindow[f.name] = f;
     }
 }
}




// usage: log({___:10},..);
function log(){                // log = console.log.bind(console)
    var indent = arguments[0] && arguments[0].___;
    if(indent) console.log( Array(indent).join(' ')+arguments[1], ...(Array(...arguments)).splice(2) ); // concatenates first arg in case it's using css formatting
    else    console.log(...arguments);
} addFunc( log );

function log_(){
    log({___:60},...arguments );
}  addFunc( log_ );

log___ = log_;



/* Returns a promise to sleep, can be used with await
 */
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms));    }
addFunc(sleep);


/* Runs fileChangeHandler if the modification date changes for the specified file located at url
 * returns the interval number, so we can clear the monitoring using clearInterval
 * Returns a promise of the response of the request
 */
function monitorFileChange(url, fileChangeHandler){
    var requestHead = url=> new Promise(resolve=>{
        GM_xmlhttpRequest({
            method: "HEAD",
            url: url,
            onload: resolve
        })
    })

    /* Checks every second if the modification date of the file requested changes
     * If it does, it runs fileChangeHandler
     */
    var inter = setInterval(async function f(){
        var response = await requestHead(url);
        var modDate = response.responseHeaders.match(/last-modified: (.*)/)[1];
        if(f.prev != undefined && modDate != f.prev) fileChangeHandler();
            f.prev = modDate;
        },1000);
	return inter;
}
addFunc(monitorFileChange);

/*
Usage:

python -m http.server

clearInterval(window.inter);
inter = monitorFileChange('http://localhost:8000/file',
    function fileChangeHandler(){
		log('file changed')
	})

*/



/* Waits for test to return a truthy value
 */
async function waitFor(test, timeout_ms=20*2000){             // args:("$('#el_id')", timeout_ms= 1000)
    return new Promise(async(resolve,reject)=>{
        if( typeof(timeout_ms) != "number") reject("Timeout argument not a number in waitFor(selector, timeout_ms)");
        var freq = 100;
        var result
        while( result === undefined || result === false || result === null || result.length === 0 ){  // for non arrays, length is undefined, so != 0
            if( timeout_ms % 1000 <freq)     log___('%c'+'waiting for: '+ test,'color:#809fff' );
            if( (timeout_ms -= freq) < 0 ){  log___('%c'+'Timeout : '   + test,'color:#cc2900' );
                                           resolve(false);
                                           return;
                                          }
            await sleep(freq);
            result = typeof(test) === 'string' ? eval(test) : test();
        }
        log___('Passed: ', test);
        resolve(result);
    });
}
addFunc(waitFor);


// there is also a flag from tampermonkey that would let you detect incongito
var isIncognito = new Promise((resolve, reject)=>{
    var fs = window.RequestFileSystem || window.webkitRequestFileSystem;
    if (!fs) reject('Check incognito failed');
    else fs(window.TEMPORARY, 100, ()=>resolve(false), ()=>resolve(true));
});
unsafeWindow.isIncognito = isIncognito;




/* Each time it is called logs the time elapses since last time it was called
 * lap is a name that will be logged when reached
 * used to see how long blocks of code take to run (laps)
 */
function timer(lap){
    if(lap) console.log(lap, 'in:', (performance.now()-timer.prev).toFixed(3) + 'ms');
    timer.prev = performance.now();
} addFunc(timer);
