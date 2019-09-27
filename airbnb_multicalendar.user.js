// ==UserScript==
// @name         Airbnb Multicalendar
// @namespace    aljgom
// @version      0.1
// @description  Adds guest photos to the bookings in the multicalendar
// @author       aljgom
// @match        https://www.airbnb.com/multicalendar
// @grant        none
// ==/UserScript==

(async function(){
    let beds = await waitFor(()=>document.getElementsByClassName('_1vd7r9f'))
    log('beds', beds)
    let now = new Date();
    for(let i=0; i<beds.length; i++){
        let bed = beds[i]
        bed.click()
        await sleep(50);
        // get checkin and checkout dates for other uses
        let checkin = document.querySelectorAll('._1okh7pi0 div._czm8crp')[0].innerHTML
        checkin = new Date(checkin +' '+ (1900+ now.getYear()))
        let checkout= document.querySelectorAll('._1okh7pi0 div._czm8crp')[1].innerHTML
        checkout = new Date(checkout +' '+ (1900+ now.getYear()))
        checkout.setDate(checkout.getDate()+1);
        // get guest photo, clone it, style it
        let photo = document.querySelectorAll(' ._e296pg')[1].children[0]
        let photo2 = photo.cloneNode(true);
        photo2.setAttribute('style', 'display:inline !important');
        photo2.style.height = photo2.style.width = "25px"
        bed.children[1].append(photo2)
        // log if it's one of today's bookings
        if(checkin <= now && now <= checkout){
            log(bed)
            log(checkin, checkout)
        }
        await sleep(100);
    }
})();
