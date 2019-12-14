// ==UserScript==
// @name         All Pages
// @namespace    aljgom
// @author       aljgom
// @description  adds global functions/variables, other scripts depend on these
// @version      0.2
// @match        http://*/*
// @match        https://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @grant        unsafewindow
// @grant        window.close
// ==/UserScript==

var url = document.location.toString();

// Add forEach to HTMLTableSectionElement, NodeList and HTMLCollection
HTMLTableSectionElement.prototype.forEach = NodeList.prototype.forEach = HTMLCollection.prototype.forEach = Array.prototype.forEach;

// Add url search parameters as a global variable
let urlParams = unsafeWindow.urlParams = new URLSearchParams( window.location.href.split('?')[1]);


function gi(id){ return document.getElementById(id); }
function gc(cl){ return document.getElementsByClassName(cl); }


// TODO remove this from being global
if(!url.match(/.google.com|.youtube.com|.wallethub.com|.creditkarma|.usbank|.linkedin/)){      // breaks google docs, probably other google apps too
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


/* log() is thes same as console.log */
function log(){console.log(...arguments)}
addFunc( log );


/* Logs with indentation */
function log___(){
    console.log( Array(60).join(' ')+arguments[0], ...(Array(...arguments)).splice(1) );  // concatenates first arg in case it's using css formatting
}  addFunc( log___ );



/* Pythonesque: */
function len(a){return a.length;}
addFunc(len);

let zip = (...rows) => [...rows[0]].map((_,c) => rows.map(row => row[c]));
addFunc(zip)


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



/* Waits for test function to return a truthy value
example usage:
    // wait for an element to exist, then save it to a variable
    var el = await waitFor(()=>$('#el_id')))                 // second timeout argument optional, or defaults to 20 seconds
 */
async function waitFor(test, timeout_ms=20*2000){
    return new Promise(async(resolve,reject)=>{
        if( typeof(timeout_ms) != "number") reject("Timeout argument not a number in waitFor(selector, timeout_ms)");
        var freq = 100;
        var result
        // wait until the result is truthy, or timeout
        while( result === undefined || result === false || result === null || result.length === 0 ){  // for non arrays, length is undefined, so != 0
            if( timeout_ms % 1000 <freq)        log___('%c'+'waiting for: '+ test,'color:#809fff' );
            if( (timeout_ms -= freq) < 0 ){     log___('%c'+'Timeout : '   + test,'color:#cc2900' );
                resolve(false);
                return;
            }
            await sleep(freq);
            result = typeof(test) === 'string' ? eval(test) : test();       // run the test and update result variable
        }
        // return result if test passed
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




/*** SHOW LAST ELEMENT CLICKED ****/
/* addding functions showLastClicked and doneClicking
 * will highlight the last element clicked, print a path to it,
 * and save it to the global variable lastClicked
 */
var clicking = null;  // without var, it's assigned to global scope
var lastClicked = {};
function showLastClicked(){
    clicking = true;   // global
	var all = document.getElementsByTagName("*");
	lastClicked.style = {};
	lastClicked.oldborder = "";
	function alertPath(el) {
		var rightArrowParents = [],
			elm,
			entry;

		for (elm = el.parentNode; elm; elm = elm.parentNode) {
			entry = elm.tagName.toLowerCase();
			if (entry === "html") {
				break;
			}
			if (elm.className) {
				entry += "." + elm.className.replace(/ /g, '.');
			}
			rightArrowParents.push(entry);
		}
		rightArrowParents.reverse();
		console.log(rightArrowParents.join(" "));
	}

	var clickcallback = function(){
		if(!clicking)return;
		var e = unsafeWindow.event || e;
		if(this === e.target) {
			lastClicked.style.border = lastClicked.oldborder;
			unsafeWindow.lastClicked = lastClicked = this;
			lastClicked.oldborder = lastClicked.style.border;
			lastClicked.style.border = "solid thin red";
			alertPath(this);
		}
	};

	all.forEach(function(el){
		el.addEventListener("click", clickcallback);
		//if(el.tagName == "A") el.oldhref=el.href; el.href ='javascript:void(0)';
	});

} addFunc(showLastClicked);

function doneClicking(){
	clicking = false;
	lastClicked.style.border = lastClicked.oldborder;
} addFunc(doneClicking);



/* Used for testing if the selection of an element hasn't changed
 * Tests if the passed element exists, if not consoles.logs error message
 * Usage: in the calling script, set testElement.scriptName = GM_info.script.name
 *        then use it.
 */

function testElement(elName, el){
    if(!testElement.scriptWindow){
        // use another script's window instead of this one to print out that name
        console.log(`%cNo scriptWindow set for testElement. Use testElement.scriptWindow = window`,'color:orange');
        return;
    }
	if(!el) console.log(`%c${ testElement.scriptWindow.GM_info.script.name }: ${elName} selector changed, update script`,'color:orange');
}
addFunc(testElement);



/*** CHANGE TAB TITLE ****/
(async function(){
    if(urlParams.get('tabTitle')){
        document.title = urlParams.get('tabTitle');
     }
})()
