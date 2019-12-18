// ==UserScript==
// @name         Airbnb Multicalendar
// @namespace    aljgom
// @version      0.131
// @description  Adds guest photos to the bookings in the multicalendar
//               Changes the background color of bookings that include today, to show check outs, check ins, and current guests. Creates a set with all the guests for the current day
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
    
    let sendMessage = false;
    let guests = new Set()
    let container = document.createElement('div');
    let bookings = await waitFor(()=>document.getElementsByClassName('_160al44'))
    bookings[0].click();
    await waitFor(()=>document.querySelectorAll('._1okh7pi0 div._czm8crp')[0]) // wait for guest details to load (this is the selector for check-in)

    let processBeds = async bookings =>{
        let runs = processBeds.runs = processBeds.runs ? processBeds.runs+1 : 1
        let today = new Date();
        today.setHours(0,0,0,0)
        let itinURL                                     // full itinerary url
        for(let i=0; i<bookings.length; i++){
            if(runs != processBeds.runs) return;        // stop if another instance of this functions starts
            let booking = bookings[i]
            if(booking.processed) continue;
            booking.processed = true;
            booking.click()
            while(itinURL == document.querySelectorAll('._9m9ayv a')[0].href){  // "full itinerary" url
                await sleep(10);
            }
            itinURL = document.querySelectorAll('._9m9ayv a')[0].href;
            // get checkin and checkout dates for other uses
            let checkin = document.querySelectorAll('._1okh7pi0 div._czm8crp')[0].innerHTML
            checkin = new Date(checkin +' '+ (1900+ today.getYear()))
            let checkout= document.querySelectorAll('._1okh7pi0 div._czm8crp')[1].innerHTML
            checkout = new Date(checkout +' '+ (1900+ today.getYear()))
            //checkout.setDate(checkout.getDate()+1);
            let guest = document.querySelectorAll('._n5lh69r ._1p3joamp')[0]
            // get guest photo, clone it, style it, and insert it into the booking
            let photo = document.querySelectorAll('._e296pg>img')[0]
            let photo2 = photo.cloneNode(true);
            booking.setAttribute('style', booking.getAttribute('style') + ' padding: 0 !important') // add !important padding to booking
            photo2.setAttribute('style', 'display:inline !important; margin: 0 1px');
            photo2.style.height = photo2.style.width = "24px"
            booking.children[0].insertBefore(photo2, booking.children[0].children[0])
            booking.children[1].append(photo2.cloneNode(true))
            // log if it's one of today's bookings
            if(checkin <= today && today <= checkout ){
                if(!guests.has(guest.innerText)){       // can be 2 bookings same guest, but add it to the cointainer only once
                    container.append(guest.cloneNode(true))
                    container.append(photo.cloneNode(true));
                }
                guests.add(guest.innerText)
                // log(booking)
                // color bookings for today, highlight checkins and checkouts
                booking.style.backgroundColor = checkin.valueOf() == today.valueOf() ? 'DarkViolet' : checkout.valueOf() == today.valueOf() ? 'DarkOrange' : 'RoyalBlue  ';

				if(sendMessage && checkout.valueOf() != today.valueOf()) {		// current guest, not checking out today
					Array.from(document.querySelectorAll('._12jvhwr')).filter(el=>el.innerText.match('Message'))[0].click();
                }
            }
            await sleep(50);
        }

      //  log(guests)
    };
    let check_beds = ()=>{
        // let bookings = await waitFor(()=>document.getElementsByClassName('_160al44'))
        let bookings = document.getElementsByClassName('_160al44');
        log('bookings', bookings)
        if(check_beds.prev == bookings){
            log('same bookings')
            return
        }
        processBeds(bookings);
    }
    setInterval(check_beds,2000);

    if(sendMessage){
        let ids = [34156181,
                34156617,
                34156946,
                34157105,
                34157217,
                34157335,
                0,
                31243489,
                31243767,
                31144603,
                31145170,
                31145452,
                31145653,
                0,
                30110320,
                30110843,
                30111035,
                30111263]
        ids.forEach(id=>window.open('https://www.airbnb.com/manage-your-space/'+id+'/details/guest-resources'))
    }
})();
