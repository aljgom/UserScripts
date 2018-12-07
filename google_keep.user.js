// ==UserScript==
// @name       Google Keep
// @namespace    aljgom
// @version    0.1
// @description  Additional functionality and UI changes for Google Keep
// @match      https://keep.google.com/*
// @author       aljgom
// @grant        none
// ==/UserScript==

(async function(){
    /*** CHANGE TITLE OF TAB **/
    var url = document.location.href;
    setInterval(()=>{
        url = document.location.href;
        if(!url.match("#") || url.match(/#(home)/)){
            document.title = document.getElementsByClassName('gb_ue gb_pe')[0].innerHTML
            return;
        }
        if(url.match(/#search/)){
            document.title = decodeURIComponent(decodeURIComponent(decodeURIComponent(location.hash.substr(1)))).replace('/text','')   // need to decode it a few consecutive times
            return;
        }
        if(!url.match(/#(NOTE|LIST)/)){             // no note/list selected, use name of manu
            document.title = document.getElementsByClassName('gk6SMd')[0].innerText;
            return;
        }
        var titles = document.querySelectorAll('[aria-label=Title]')
        if(titles.length == 0) titles = document.querySelectorAll('[aria-label=Titel]') // Try it in German
        document.title = titles[titles.length-1].innerHTML          // Change the tab title to the name of the current List/Note
    },2000);



    /*** ADD BUTTON FOR SCROLLING TO NEXT UNCHECKED ITEM **/
    (async function(){
        var nextUnchecked = function*(){
            var i = 0;
            var unchecked;
            while(true){
                if(!unchecked || unchecked.length != document.querySelectorAll('.VIpgJd-TUo6Hb')[0].querySelectorAll("[aria-checked=false]").length -1 ){ // uncheck variable hasnt' been set, or selection length changed
                    unchecked = Array.from( document.querySelectorAll('.VIpgJd-TUo6Hb')[0].querySelectorAll("[aria-checked=false]") )
                    unchecked.splice(0,1)								// remove first result, it's not the correct match
                    i = 0;
                }
                if(unchecked.length == 0)
                    yield;
                else{
                    yield unchecked[i]
                    i = (i+1) % unchecked.length
                }
            }
        }
        var uncheckedIter;

        // Insert button into bottom toolbar
        var insertButton = function(){
            var container = document.querySelectorAll('.VIpgJd-TUo6Hb .IZ65Hb-s2gQvd')[0];
            if(!container) return;                      // no note selected
            var toolbar = container.parentElement.querySelectorAll('[role=toolbar]')[0];  // bottom toolbar
            if(toolbar.buttonInserted) return;
            toolbar.buttonInserted = true;
            uncheckedIter = nextUnchecked();            // reset unchecked list

            var button = document.createElement('div')
            toolbar.appendChild(button)
            Object.assign(button.style,{
                userSelect: 'none',                     // disable text selection
                color:      '#202124',
                paddingTop: '.35em'
            });
            button.innerHTML = "Next"
            button.className = "Q0hgme-LgbsSe" 			// copy class from sibling
            button.id        = "next_button"
            button.onclick = async function scrollToNextUnchecked(){
                var next = uncheckedIter.next().value
                if(!next) return;                       // no unchecked boxes
                next.scrollIntoView();
                container.scrollTo(0,container.scrollTop - 75)
                next.style.background = '#e0e0e0'		// flash it's background
                await sleep(300)
                next.style.background = ''
            }
        }
        setInterval(insertButton,2000)
    })();

})();
