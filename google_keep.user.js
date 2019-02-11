// ==UserScript==
// @name         Google Keep
// @namespace    aljgom
// @version      0.1
// @description  Additional functionality and UI changes for Google Keep
// @match        https://keep.google.com/*
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
        if(!url.match(/#(NOTE|LIST)/)){             // no note/list selected, use name of menu
            document.title = document.getElementsByClassName('gk6SMd')[0].innerText;
            return;
        }
        var titles = document.querySelectorAll('[aria-label=Title]')
        if(titles.length == 0) titles = document.querySelectorAll('[aria-label=Titel]') // Try it in German
        document.title = titles[titles.length-1].innerHTML          // Change the tab title to the name of the current List/Note
    },2000);



    /*** ADD BUTTON FOR SCROLLING TO NEXT UNCHECKED ITEM **/
    (async function(){
        let nextUnchecked = function*(){        // generator that updates with the next unchecked item
            let i = 0;
            let unchecked;
            while(true){
                let currentList = document.querySelectorAll('.VIpgJd-TUo6Hb')[0].querySelectorAll("[aria-checked=false]");
                if(!unchecked || unchecked.length != currentList.length -1 ){   // uncheck variable hasnt' been set, or selection length changed
                    unchecked = Array.from( currentList )                       // update unchecked list
                    unchecked.splice(0,1)								        // remove first result, it's not the correct match
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

        let lastChecked = function(){
            let checked = document.querySelectorAll('.VIpgJd-TUo6Hb')[0].querySelectorAll("[aria-checked=true]")
            return checked[checked.length-1]
        }

        let scrollToCheckBox = async function(box){
            let container = document.querySelectorAll('.VIpgJd-TUo6Hb .IZ65Hb-s2gQvd')[0];
            box.scrollIntoView();
            container.scrollTo(0,container.scrollTop - 75)
            box.style.background = '#e0e0e0'		        // flash it's background
            await sleep(300)
            box.style.background = ''
        }

        let uncheckedIter;

        // Insert button into bottom toolbar
        let insertButton = function(){
            let container = document.querySelectorAll('.VIpgJd-TUo6Hb .IZ65Hb-s2gQvd')[0];
            if(!container || !url.match('#LIST')) return;       // no list selected
            let toolbar = container.parentElement.querySelectorAll('[role=toolbar]')[0];  // bottom toolbar
            if(toolbar.buttonInserted) return;                  // return if list already has button
            toolbar.buttonInserted = true;
            if(lastChecked() !== undefined){
                scrollToCheckBox(lastChecked());                // scroll to last element checked
            }
            uncheckedIter = nextUnchecked();                    // reset unchecked list (if new list opened)

            let button = document.createElement('div')
            toolbar.appendChild(button)
            Object.assign(button.style,{
                userSelect: 'none',                             // disable text selection
                color:      '#202124',
                paddingTop: '.35em'
            });
            button.innerHTML = "Next"
            button.className = "Q0hgme-LgbsSe" 			        // copy class from sibling
            button.id        = "next_button"
            button.onclick = function scrollToNextUnchecked(){
                let next = uncheckedIter.next().value
                if(!next) return;                               // no unchecked boxes
                scrollToCheckBox(next);
            }
        }
        setInterval(insertButton,2000)                          // interval to insert button in new opened lists
    })();

})();
