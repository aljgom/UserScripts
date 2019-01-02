// ==UserScript==
// @name       Code Signals
// @namespace  aljgom
// @version    0.1
// @description  Run code when F5 is pressed, prevent reload, and handle how output is displayed
//               Uses waitFor function from All Pages script
// @match      https://app.codesignal.com/*
// ==/UserScript==


(async function() {
    'use strict';
    let url = document.location.toString();
    let sleep = ms => new Promise(resolve=>setTimeout(resolve,ms));

    // The app doesn't reload the page when moving between tabs,
    // so we want to re-run the script if the url has changed

    /*
    With this modifications you can listen to a 'locationChange' event
    When the history object changes, there's a `popstate` event, but there are no events for `pushstate`, and `replacestate`
    This modifies these three functions so that all fire a `locationchange` event, and also `pushstate` and `replacestate`
    */
    history.pushState = ( f => function pushState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushState'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.pushState);

    history.replaceState = ( f => function replaceState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replaceState'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.replaceState);

    window.addEventListener('popstate',()=>{
        window.dispatchEvent(new Event('locationchange'))
    });

    // Now this is the listener that will take care of re-running the code if the location changes
    window.addEventListener('locationchange', function(){
        url = document.location.toString();
        console.log('Location Changed')
        // if url matches Script's @match
        if(GM_info.script.matches.reduce((prev,m)=>prev||url.match(m) , false)){
            main();
        }
    });

    let main = async function(){
        if( false //!( url.match(/challenge|contest|tests/))                       // ignore for some url matches
           ) return;
        log('starting code_signals UserScript')
        await waitFor(()=>gc('source-editor')[0])   // wait for editor to load as singal of page ready
        /* code from hackerrank, don't clone output for now, add in near future

        // Add area where cloned output will be placed
        var output
		if(url.match('tests')){
			output = await waitFor(()=>gi('runstatus'));
            var question = document.querySelector('[aria-label="Question Content"]').innerText;
            console.log(question)
        }else{
            output = await waitFor(()=>gc('challenge-response fs-container')[0]);
        }

        if(output.modified == true) return;                             // since we're running the code every time the url changes, make sure we haven't modified already
        output.modified = true

        var prev = document.createElement('div');
        prev.className = 'prev-output';
        output.parentElement.insertBefore(prev, output.nextSibling);    // insert cointainer after output

        // Clone output when submit botton is pressed, to keep the previous output visible
        let cloneOutput = function(){
            resetOutputPosition();
            prev.innerHTML = '';
            prev.appendChild( output.cloneNode(true) );
        }

        // Make output float when run_code is clicked, put it back in original position if output clicked
        let floatOutput = function(){
            Object.assign(output.style,{
                position: 'fixed',
                top: '100%',
                transform: 'translateY(-100%)',
                right: 0,
                zIndex: 10,
                width: '30%',
                maxHeight: '95%',
                overflow: 'scroll'
            });
            output_floating = true;
        }
        // minimizes output (still floating)
        let minimizeOutput = function(){
            Object.assign(output.style,{
                // position: 'relative',
                transform: 'translateY(-50px)',
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

        let dissable_autoScroll = async function(){ // float output and prevent scrolling behavior triggered when running code
            // Disable Scrolling
            // scrolling is done by using jQuery animate, we'll disable it for a second
            if(url.match('tests')) return                       // don't disable if in tests layout
            var temp = $.prototype.animate;
            if($.prototype.animate.name == 'temp'){             // don't do it if it's already waiting, it would replace the function permanently
                //console.log('already disabling scrolling')
            }
            else{
                $.prototype.animate = function temp(){};
                await sleep(1000);
                $.prototype.animate = temp;
            }
        }
        */
        // select "Run Code" button
        var run_code = Array.from(gc('button--content')).filter(e=>e.innerHTML.match('Run'))[0]
        log(run_code    )
        //run_code.addEventListener('mousedown',cloneOutput);             // mousedown  instead of click so it fires before submission
        // var output_floating = false;
        // $.prototype.animate = ((f)=>function(){log('animating'); f.call(this,...arguments);})($.prototype.animate)  // add a logged message to the function for testing
        /*
        run_code.addEventListener('click', async ()=>{
            floatOutput();
        });
        */
        //run_code.addEventListener('mousedown', dissable_autoScroll);
        //output.addEventListener('click', toggleFloat);      // float and minimize when clicking the output

        // Keybord listener to click the 'submit code' button if F5 is pressed, and prevent from reloading
        document.addEventListener('keydown', function(e){
            if (e.keyCode == 116) {             //f5
                e.returnValue = false;
                //dissable_autoScroll();
                //cloneOutput();
                run_code.click();
            }
        });
    }
    main();

})();
