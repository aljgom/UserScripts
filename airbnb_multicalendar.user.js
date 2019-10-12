// ==UserScript==
// @name         Airbnb Multicalendar
// @namespace    aljgom
// @version      0.12
// @description  Adds guest photos to the bookings in the multicalendar
//               Changes the background color of bookings that include today. Creates a set with all the guests for the current day
// @author       aljgom
// @match        https://www.airbnb.com/multicalendar
// @grant        none
// ==/UserScript==

(async function(){
    while(typeof(waitFor) === "undefined"){
        console.log('waiting for All Pages')
        await new Promise(resolve=>setInterval(resolve, 200))
    }

    //liveReload('airbnb_multicalendar.user.js')
    document.body.style.zoom = .8

    let guests = new Set()
    let container = document.createElement('div');
    let bookings = await waitFor(()=>document.getElementsByClassName('_1vd7r9f'))
    bookings[0].click();
    await waitFor(()=>document.querySelectorAll('._1okh7pi0 div._czm8crp')[0]) // wait for guest details to load (this is the selector for check-in)
    log('bookings', bookings)

    let processBeds = async bookings =>{
        log('starting')
        let runs = processBeds.runs = processBeds.runs ? processBeds.runs+1 : 1
        log(runs)
        let now = new Date();
        let wait = 50;
        for(let i=0; i<bookings.length; i++){
            if(runs != processBeds.runs) return;        // stop if another instance of this functions starts
            let booking= bookings[i]
            if(booking.processed) continue;
            booking.processed = true;
            booking.click()
            await sleep(wait);
            // get checkin and checkout dates for other uses
            let checkin = document.querySelectorAll('._1okh7pi0 div._czm8crp')[0].innerHTML
            checkin = new Date(checkin +' '+ (1900+ now.getYear()))
            let checkout= document.querySelectorAll('._1okh7pi0 div._czm8crp')[1].innerHTML
            checkout = new Date(checkout +' '+ (1900+ now.getYear()))
            checkout.setDate(checkout.getDate()+1);
            let guest = document.querySelectorAll('._n5lh69r ._1p3joamp')[0]
            // get guest photo, clone it, style it
            let photo = document.querySelectorAll('._e296pg>img')[0]
            let photo2 = photo.cloneNode(true);
            photo2.setAttribute('style', 'display:inline !important');
            photo2.style.height = photo2.style.width = "25px"
            booking.children[1].append(photo2)
            // log if it's one of today's bookings
            if(checkin <= now && now <= checkout ){
                if(!guests.has(guest.innerText)){       // can be 2 bookings same guest, but add it to the cointainer only once
                    container.append(guest.cloneNode(true))
                    container.append(photo.cloneNode(true));
                }
                guests.add(guest.innerText)
                booking.style.backgroundColor = 'gray'
                log(booking)
                log(checkin, checkout)
            }
            await sleep(50);
        }

        log(guests)
    };
    let check_beds = ()=>{
        // let bookings = await waitFor(()=>document.getElementsByClassName('_1vd7r9f'))
        let bookings = document.getElementsByClassName('_1vd7r9f');
        log('bookings', bookings)
        if(check_beds.prev == bookings){
            log('same bookings')
            return
        }
        processBeds(bookings);
    }
    setInterval(check_beds,2000);
})();
