// ==UserScript==
// @name         Temp Scripts
// @namespace    aljgom
// @version      0.1
// @description  Short/temporary scripts that having a separate page for each seems overkill
// @author       aljgom
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


(async function(){
'use strict';
    let url = document.location.toString();

    /* Write down in the console that we're running a temp script for a matching page
    */
    let identify = ()=>{
        console.log(`%cRUNNING TEMP SCRIPT on ${url}`, 'background:orange');
    }

    let sleep = function(ms){return new Promise(resolve=>{setTimeout(resolve,ms);});};

    await sleep(1000);  // to wait for all pages import


    let you_wrote_this = `

                   TEMPSCRIPT:

                  `;

    // TICKETMASTER CREDIT
    if(url.match("https://www.ticketmaster.com/")){
        confirm(you_wrote_this + `discount from class action lawsuit. email?
               `);
    }


    // MOVIE FREE TICKET GIFTCARD
    if(url.match("https://www.google.com/search") &&
       (url.match(/movie|movies|showtimes|theater/) || document.body.innerHTML.match('Showtimes') )){
        confirm(you_wrote_this + `ticket coupon from years ago
               `);
    }

    // NEWEGG GIFTCARD
    if(url.match("https://www.newegg.com/")){
        confirm(you_wrote_this + `gift card in credit cards bag
               `);
    }


    // WEATHER CHANNEL REMOVE ADS
    if(url.match("https://weather.com/weather/")){
        identify()
        setInterval(()=>{
            document.getElementsByClassName("cm-four-stack")[0].style.display = 'none';
            document.getElementsByClassName("cm-1-plus-4-module")[0].style.display = 'none';
            document.getElementsByClassName("taboola-module")[0].style.display = 'none';
        },5000);
    }


    // GEOGRAPHY
    if(url.match("https://online.seterra.com/en/")){
        identify()
        // scroll to test area
        await sleep(500);
        window.scrollTo(0,740);
        if(url.match('fl')) window.scrollTo(0,700);
        // restart on focus
        let away = new Date();
        addEventListener('focus',function(){if(Date.now()-away > 15000){setTimeout(()=>{
            if(window.setGameMode) setGameMode();
            else setupGame(url.substr(-4));
        },1000);}});
        addEventListener('blur',()=>{away = new Date();});
    }


    // PYTHON PROGRAMMING
    if(url.match("https://pythonprogramming.net/.")){
        identify()
        if(url.match('tutorials')) return;
        // make sidebar fixed/scrollable
        let sidebar = document.querySelectorAll('.row')[0].children[1];
        sidebar.style.cssText = `
            overflow: auto;
            height: 95vh;
            position: fixed;
            right: -50;
            background: #fafafa`;

        // save sidebar scroll position
        sidebar.onscroll = ()=>localStorage.sidebarScroll = sidebar.scrollTop;
        sidebar.scrollTop =    localStorage.sidebarScroll;
        $(".collapsible").css('padding-left','0');

        // click 'go' automatically
        $(".collapsible-header").each(function(i){
            this.innerHTML = String(i+1).padStart(2,'0') +'.  '+ this.innerHTML;
            this.style.cssText = 'line-height:1.5; padding:1.3em 3em';
            this.onclick = function(){
                setTimeout(()=>this.parentElement.children[1].style.display = 'none', 200);
                this.parentElement.children[1].children[0].children[0].children[0].click();
            };
        });

    }


    // CREDIT CARDS FUNCTIONS
	if(url.match('capitalone.com')){
        identify()
        /* Adds functions to the window object */
        let addFunc = function(f,force){
            if( !(f.name in unsafeWindow) )  unsafeWindow[f.name] = f;
            else{
                log___('%caddFunc: '+ f.name +' already exists','color:grey');
                if(force) {
                    log___('%caddFunc:   force adding '+ f.name , 'color:grey' );
                    unsafeWindow[f.name] = f;
                }
            }
        }

        let transfer = function(){
                identify()
                document.location = "https://myaccounts.capitalone.com/Card/QyS+OOBDlD0dI%252FcFbknCfxhc%252Fz4faQcoWdLk6wpwft0=/offers"
            }

        addFunc(transfer);
	}






    var el;
    // UNITED AIRLINES CLICK 'VIEW 30 DAY CALENDAR'
    if(url.match("https://www.united.com/ual/en/us/flight-search/book-a-flight/results/")){
    (async function(){
        identify();
        await waitFor(()=>document.getElementsByClassName('calendar-view-toggle-ngrp')[0], 60*1000) //
        await sleep(1000);
        await waitFor(()=>document.querySelectorAll('.loading-message').length == 2)  // wait for 'loading' to dissapear (loading messages goes from 3 to 2)
        await sleep(1000);
        var el = await waitFor(()=>document.getElementsByClassName('calendar-view-toggle-ngrp')[0], 60*1000) // need to select it again
        el.click();
    })();
    }
            // purchase fare
    if(url.match("https://www.united.com/ual/en/us/flight-search/book-a-flight/results/rev")){(async function(){
        identify();
        var el = await waitFor(()=>gi('elf-fare-agree'), 1000*60*60)
        el.click();
        await sleep(2000);
        gi('btn-select-elf-fare').click()
    })();}


    if(url.match("https://www.united.com/ual/en/us/flight-search/book-a-flight/reviewflight/rev")){(async function(){
        alert('If flight less than a week from now, nonrefundable!!')
        identify();
        await sleep(1000);
        var el = await waitFor(()=>gi('btn-continue'))
        el.click();
    })();}

    if(url.match("https://www.united.com/ual/en/us/flight-search/book-a-flight/reviewflight/awd")){
        alert('If flight less than a week from now, nonrefundable!!')
        identify();
        await sleep(3000);
        el = await waitFor(()=>gi('btn-continue'))
        el.click();                // don't hold fare

    }

    if(url.match("https://www.united.com/ual/en/us/flight-search/book-a-flight/travelerinfo")){
        identify();
        await waitFor(()=>gi('divSelectedTravelerData0'))                // wait for an element from traveler data to load
        await sleep(3000);                                               // just in case for info to load
        el = await waitFor(()=>gi('btnContinue'))
        el.click();

    }
    if(url.match("https://www.united.com/ual/en/us/flight-search/book-a-flight/billinginfo")){
        identify();
        await sleep(3000)
        el = await waitFor(()=>gi('WASCInsuranceOfferOption2'))
        el.click();    // select don't insure trip
        await sleep(3000)
        nextStepBtn.click();
      //  await sleep(2000);
      //  gi('CreditCardViewModels[0].Index').children[1].selected = true  // select credit card
      //  gi('CreditCardViewModels[0].Index').click()

      //  gi('PhoneList').children[1].selected = true                      // select phone
      //  gi('PhoneList').click()
    }

        // cancel trip
    if(url.match("https://www.united.com/web/en-US/apps/reservation/flight/refundAwardPayment.aspx")){
        identify();
        el = await waitFor(()=>gi('ctl00_ContentInfo_btnContinue'))
        el.click() // continue on second cancel confirmation

    }

    if(url.match("https://www.united.com/web/en-US/apps/reservation/flight/refundAwardDetails.aspx")){
        identify();
        el = await waitFor(()=>gi('ctl00_ContentInfo_btnContinue'))
        el.click() // continue on second cancel confirmation

    }


    //
    if(url.match("---------------------")){
        identify();
    }


    //
    if(url.match("-----------------------")){
        identify();

    }

    //
    if(url.match("-----------------------")){
        identify();

    }

















})();
