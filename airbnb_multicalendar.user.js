// ==UserScript==
// @name         Airbnb Multicalendar
// @namespace    aljgom
// @version      0.11
// @description  Adds guest photos to the bookings in the multicalendar
//               Creates a set with all the guests for the current day
// @author       aljgom
// @match        https://www.airbnb.com/multicalendar
// @grant        none
// ==/UserScript==

(async function(){
    let guests = new Set()
    let container = document.createElement('div');
    let wait = 50;
    let beds = await waitFor(()=>document.getElementsByClassName('_1vd7r9f'))
    beds[0].click();
    await waitFor(()=>document.querySelectorAll('._1okh7pi0 div._czm8crp')[0]) // wait for guest details to load (this is the selector for check-in)
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
        let guest = document.querySelectorAll('._n5lh69r ._1p3joamp')[0]
        // get guest photo, clone it, style it
        let photo = document.querySelectorAll(' ._e296pg')[1].children[0]
        let photo2 = photo.cloneNode(true);
        photo2.setAttribute('style', 'display:inline !important');
        photo2.style.height = photo2.style.width = "25px"
        bed.children[1].append(photo2)
        // log if it's one of today's bookings
        if(checkin <= now && now <= checkout && !guests.has(guest.innerText)){
            guests.add(guest.innerText)
            log(bed)
            log(checkin, checkout)
            container.append(guest.cloneNode(true))
            container.append(photo.cloneNode(true));
        }
        await sleep(wait);
    }
    log(guests)
})();
