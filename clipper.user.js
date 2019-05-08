// ==UserScript==
// @name         Clipper
// @namespace    aljgom
// @version      0.1
// @description  Automate reload cash process
//               Goes through muiltiple clicks to get through the add cash forms, checkout buttons, card selection, accepting terms of service
//               Leaving only the last "Place order" click to be made
// @author       aljgom
// @match        https://*.clippercard.com/*
// @grant        unsafeWindow
// ==/UserScript==


(async function(){
    let url = document.location.href;
    if(url == "https://www.clippercard.com/ClipperWeb/index.do"){
        document.location = "https://m.clippercard.com/ClipperCard/dashboard.js";}  // redirect to the mobile site
    if(url.match("https://m.clippercard.com/")){
        if(url == "https://m.clippercard.com/ClipperWeb/index.do" || url == "https://m.clippercard.com/"){
             document.location = "https://m.clippercard.com/ClipperCard/dashboard.jsf";
        }
        if(url == "https://m.clippercard.com/ClipperCard/dashboard.jsf"){
            if(confirm("Load Cash?")){
                let amount = prompt("How much?");
                while(amount < 1.25) amount = prompt("Needs to be $1.25 or more")
                localStorage.loadAmount = amount
                //localStorage.loadAmount = 2
                document.querySelector('[value="Add Value"').click();
            }
        }
        if(url == "https://m.clippercard.com/ClipperCard/manage.jsf"){
            if(localStorage.paying != "true"){
                console.log('setting value')
                unsafeWindow.cashAmount.value = localStorage.loadAmount;
                localStorage.paying = true
                document.getElementsByClassName('addCashButton')[0].click()
            }
            else{
                console.log('checking out')
                localStorage.paying = false
                document.querySelector('[title="Checkout"]').click();
            }
        }
        if(url == "https://m.clippercard.com/ClipperCard/checkout.jsf") {
            if(unsafeWindow.payMethod){                 // same url, 2 behaviours
                unsafeWindow.payMethod[0].click();      // select payment method
                document.querySelector('[title="Checkout"]').click();
            }else{
                unsafeWindow.acceptTaC.click();         // accept terms of service
            }
        }
    }
})();

if(false){    // hide personal information
    (async function(){
            document.getElementsByClassName('fieldData').forEach(e=>e.style.display = "none")
    })();
    (async function(){

        document.getElementById('mainForm:summaryEmail').style.display = 'none'
    })();
    (async function(){
        setInterval(()=>document.getElementsByClassName('h5-num ui-state-valid')[0].style. display = 'none',100)
    })();
    (async function(){
        document.getElementsByClassName('pairing confirm-payinfo')[0].style. display = 'none'
    })();
    (async function(){

    })();
}
