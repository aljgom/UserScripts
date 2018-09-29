// ==UserScript==
// @name         Keep Alive
// @namespace    aljgom
// @version      0.1
// @description  Prevents session ending
// @author       aljgom
// @match        https://www.53.com/fifththird/html/session-timeout-warning-update.html
// @match        https://www.53.com/fifththird/html/session-timeout-warning.html
// @match        https://*.chase.com/*
// @match        https://www.discovercard.com/*
// @match        https://card.discover.com/*
// @match        https://online.americanexpress.com/*
// @match        https://creditwise.capitalone.com/*
// @match        https://my.lendingtree.com/*
// @match        https://wwws.mint.com/*
// @match        https://online.penfed.org/PenFedOnline/*
// @match        https://www.quizzle.com/*
// @match        https://tcfbank.com/*
// @match        https://secure.creditsesame.com/*
// @match        https://services1.capitalone.com/*
// @match        https://services2.capitalone.com/*
// @match        https://secure.bankofamerica.com/*
// @match        https://myaccounts.capitalone.com/*
// @grant      unsafewindow
// ==/UserScript==
/* jshint -W097 */

'use strict';
console.log('keeping alive');

setInterval(function(){
    var w = unsafeWindow;
    // gi and gc are defined in this local scope.
    function gi(id){ return document.getElementById(id); }
    function gc(cl){ return document.getElementsByClassName(cl); }
    var button;

  //id
    // American Express
    if( w.session_btn_continue )  w.session_btn_continue.click();

    // BoA
    if( w.fsd_timeout_okBtn ) { w.fsd_timeout_okBtn[0].click();   }

    // Capital One
    if( w.timeOutContinue )  w.timeOutContinue.click();
    if (gc('progressive')[0] && gc('progressive')[0].innerHTML == "Wait, I'm still here!" ? gc('progressive')[0] : false){
        gc('progressive')[0].click();
    }

    // Chase
    if( w.btnContinue ) w.btnContinue.click();    // Chase homepage
    if( w.btnLogIn ) if(w.SessionDialogContainer.style.display !="none") {w.btnLogIn.click();} // Chase ultimate rewards
	if( w.requestSessionExtension ) w.requestSessionExtension.click();

    // Discover
    button = gi("staylogin");
    if(button !== null) button.click();

    // Mint
    button = gi("message-timeout");
    if( button !== null && button.style.display !="none") w.alert('timing out');

    // TCF
    if( w.Ok_Button ) { w.Ok_Button.click();   }


  //class

     // 5/3
    button = gc("ui-button-text")[0];
    if(button !== undefined) button.click();

    // CreditWise
    if( gc("cancel-modal-buttons")[0] ) gc("cancel-modal-buttons")[0].children[0].children[0].click();

    // Credit Sesame
    if( gc("ui-dialog-buttonpane")[0] ) gc("ui-dialog-buttonpane")[0].children[0].click();

    // LendingTree
    if( gc("session-timeout ")[0] ) gc("session-timeout ")[0].children[0].children[0].children[2].children[1].click();

    // Quizzle
    button = gc("primary-button larger-margin-bottom")[0];
    if(button !== undefined) button.click();

},55*1000);
