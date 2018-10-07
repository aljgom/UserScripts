// ==UserScript==
// @name         HackerRank/FireIO
// @namespace    aljgom
// @version      0.1
// @description  Run code when F5 is pressed, prevent reload, and handle how output is displayed
//               Uses waitFor function from All Pages script
// @author       aljgom
// @match        https://www.hackerrank.com/challenges*
// @match        https://www.hackerrank.com/contests*
// @match        https://www.firecode.io/problems/index
// @grant        none
// ==/UserScript==



(async function() {  ///
    'use strict';
    let url = document.location.toString();

    /* HACKERRANK */
    if(url.match('hackerrank')){
        if(url.match('challenges')){                                    // new layout, contests still have old
            // Change size of output
            setInterval(()=>{
                document.getElementsByClassName('compile-output-message').forEach((e)=>{
                    e.style.maxHeight = 'initial'
                })
            },1000)
        }

        // Add area where cloned output will be placed
        var output = await waitFor(()=>$('.fs-container')[0]);
        var prev = document.createElement('div');
        prev.className = 'prev-output';
        output.parentElement.insertBefore(prev, output.nextSibling); // insert cointainer after output

        // Clone output when submit botton is pressed, to keep the previous output visible
        function cloneOutput(){
            prev.innerHTML = '';
            prev.appendChild( output.cloneNode(true) );
        }
        var run_code = await waitFor(()=> gc('bb-compile')[0]);
        run_code.addEventListener('mousedown',cloneOutput);             // mousedown  instead of click so it fires before submission

        // Keybord listener to click the 'submit code' button if F5 is pressed, and prevent from reloading
        document.addEventListener('keydown', function fkey(e){
            if (e.keyCode == 116) {  //f5
                e.returnValue = false;
                cloneOutput();
                run_code.click();
            }
        });
    }

    /* FIRECODE */
    if(url.match('firecode')){
        // Keybord listener to click the 'submit code' button if F5 is pressed, and prevent from reloading
        document.getElementById('console').style.height = "500px";
        document.addEventListener('keydown', async function fkey(e){
            if (e.keyCode == 116) {  //f5
                e.returnValue = false;
                btnRun.click();

                var el = await waitFor(()=>gc("modal-backdrop")[0],20*1000);
                if (el) el.style.display ='none';

                await waitFor(()=>testModal.style.display == 'block',20*1000);
                testModal.click();
            }
        });

    }

})();  // highlight bc of async
