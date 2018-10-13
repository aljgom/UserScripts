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
    let sleep = ms => new Promise(resolve=>setTimeout(resolve,ms));

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
        var output = await waitFor(()=>gc('challenge-response fs-container')[0]);
        var prev = document.createElement('div');
        prev.className = 'prev-output';
        output.parentElement.insertBefore(prev, output.nextSibling); // insert cointainer after output

        // Clone output when submit botton is pressed, to keep the previous output visible
        let cloneOutput = function(){
            resetOutputPosition();
            prev.innerHTML = '';
            prev.appendChild( output.cloneNode(true) );
        }
        var run_code = await waitFor(()=> gc('bb-compile')[0]);
        run_code.addEventListener('mousedown',cloneOutput);             // mousedown  instead of click so it fires before submission

        // Make output float when run_code is clicked, put it back in original position if output clicked
        let floatOutput = function(){
            Object.assign(output.style,{
                position: 'fixed',
                top: '100%',
                transform: 'translateY(-100%)',
                left: 0,
                zIndex: 10,
                width: '30%'
            });
            output_floating = true;
        }
        // minimizes output (still floating)
        let minimizeOutput = function(){
            Object.assign(output.style,{
                // position: 'relative',
                transform: 'translateY(-10%)',
                //width:'100%'
            });
            output_floating = false;
        }
        // return output to original position before cloning
        let resetOutputPosition = function(){
            Object.assign(output.style,{
                position: 'relative',
                transform: '',
                width:'100%',
                zIndex: 1
            });
        }
        let toggleFloat = function(){
            if(output_floating) minimizeOutput();
            else                floatOutput();
        }

        var output_floating = false;
        run_code.addEventListener('click', async ()=>{          // float output and prevent scrolling behavior triggered when running code
            floatOutput();
            // Disable Scrolling
            // scrolling is done by using jQuery animate, we'll disable it for a second
            var temp = $.prototype.animate;
            if($.prototype.animate.name == 'temp'){             // don't do it if it's already waiting, it would replace the function permanently
                //console.log('already disabling scrolling')
            }
            else{
                $.prototype.animate = function temp(){};
                await sleep(1000);
                $.prototype.animate = temp;
            }
        });
        output.addEventListener('click', toggleFloat);      // float and minimize when clicking the output

        // Keybord listener to click the 'submit code' button if F5 is pressed, and prevent from reloading
        document.addEventListener('keydown', function(e){
            if (e.keyCode == 116) {             //f5
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

})();
