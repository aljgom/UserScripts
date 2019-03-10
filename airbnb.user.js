// ==UserScript==
// @name         Airbnb
// @namespace    aljgom
// @version      0.1
// @description  Moves the calendar to the top of the page to be able to see availability easily
//               If you add ?loadCals to the url, it will load all the links in the 'rooms' array,
//               and clone their calendars into the main page to have them all in one
// @author       aljgom
// @match        https://www.airbnb.com/rooms/*
// @grant        none
// ==/UserScript==



(async function(){
    await new Promise(resolve=>setTimeout(resolve,1000))  // wait one second, to make sure All Pages loads
    let url = document.location.href;
    let cal = await waitFor(()=>document.querySelector('[aria-label="Calendar"]'));
    cal.setAttribute('style', 'position:fixed !important; top:0; left:0');

    if(url.match("loadCals")){
        document.querySelector('[role="banner"]').style.display = 'none'
        document.getElementById('site-content').style.display = 'none'
        document.getElementById('site-footer').style.display = 'none'
        document.title = 'Calendars Airbnb'
        document.body.style.zoom = .6;

        const rooms = [
                "https://www.airbnb.com/rooms/31243489?guests=1&adults=1",
                "https://www.airbnb.com/rooms/31243767?guests=1&adults=1",
                "https://www.airbnb.com/rooms/31144603?guests=1&adults=1",
                "https://www.airbnb.com/rooms/31145170?guests=1&adults=1",
                "https://www.airbnb.com/rooms/31145452?guests=1&adults=1",
                "https://www.airbnb.com/rooms/31145653?guests=1&adults=1",
                "https://www.airbnb.com/rooms/30110320?guests=1&adults=1",
                "https://www.airbnb.com/rooms/30110843?guests=1&adults=1",
                "https://www.airbnb.com/rooms/30111035?guests=1&adults=1",
                "https://www.airbnb.com/rooms/30111263?guests=1&adults=1",
                "https://www.airbnb.com/rooms/30111431?guests=1&adults=1",
                "https://www.airbnb.com/rooms/30111431?guests=1&adults=1",]
        for(let room of rooms){
            log(room)
            let container = document.createElement('div');
            container.style.float = 'left';
            container.style.padding = '2em';
            document.body.append(container);
            (async function(){
                let iframe = document.createElement('iframe')
                // iframe.style.display = 'none'
                iframe.src = room
                document.body.appendChild(iframe)
                await sleep(3000);
                let w = iframe.contentWindow
                let cal = await waitFor(()=>w.document.querySelector('[aria-label="Calendar"]'), 60*1000)
                if(!cal) {w.close(); return}
                await sleep(6*1000);                                                     // wait for 2 months to load
                let cal2 = cal.cloneNode(true);
                cal2.setAttribute('style', '');
                container.appendChild((await waitFor(()=>w.document.querySelectorAll('._18hrqvin')[0])).cloneNode(true)) // title
                container.appendChild(cal2);
                // highlight current day
                let today = Array.from(cal2.querySelectorAll('._47fvp1'))               // selector for a day of the calendar
                .filter(e=>e.innerText == new Date().getDate())[0]
                if(today.parentElement.parentElement.className.match('_12fun97')){      // avaliable
                    today.style.border = 'solid thin #71d800';                          // green
                }else {
                    today.style.border = 'solid thin #ff8686';                          // red
                }
                iframe.src = ''
                document.body.removeChild(iframe);
            })()
            await sleep(4*1000)
        }
    }
})();
