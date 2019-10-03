// ==UserScript==
// @name         Airbnb
// @namespace    aljgom
// @version      0.230
// @description  Moves the calendar to the top of the page to be able to see availability easily
//               If you add &loadCals=1 to the url, it will load all the links in the 'rooms' array,
//               and clone their calendars into the main page to have them all in one
//               Also highlights todays date on all of them, showing green for available
//               and red for unavailable
//               if you use loadCals=2 it runs another version, in which it makes direct calls
//               to the airbnb API to get only the calendar data for the bookings,
//               and creates a visualization for all of the days
// @author       aljgom
// @match        https://www.airbnb.com/rooms/*
// @grant        none
// ==/UserScript==

(async function(){
    let url = document.location.href;

    if(url.match("loadCals=1")){
        await new Promise(resolve=>setTimeout(resolve,1000))  // wait one second, to make sure All Pages loads

        let cal = await waitFor(()=>document.querySelector('[aria-label="Calendar"]'));
        cal.setAttribute('style', 'position:fixed !important; top:0; left:0');
        document.title = 'Calendars Airbnb'
        document.querySelector('[role="banner"]').style.display = 'none'
        document.getElementById('site-content').style.display = 'none'
        document.getElementById('site-footer').style.display = 'none'
        document.body.style.zoom = .6;

        const rooms = [
            "https://www.airbnb.com/rooms/show/34156181",
            "https://www.airbnb.com/rooms/show/34156617",
            "https://www.airbnb.com/rooms/show/34156946",
            "https://www.airbnb.com/rooms/show/34157105",
            "https://www.airbnb.com/rooms/show/34157217",
            "https://www.airbnb.com/rooms/show/34157335",
            "-",
            "https://www.airbnb.com/rooms/31243489?guests=1&adults=1",
            "https://www.airbnb.com/rooms/31243767?guests=1&adults=1",
            "https://www.airbnb.com/rooms/31144603?guests=1&adults=1",
            "https://www.airbnb.com/rooms/31145170?guests=1&adults=1",
            "https://www.airbnb.com/rooms/31145452?guests=1&adults=1",
            "https://www.airbnb.com/rooms/31145653?guests=1&adults=1",
            "-",
            "https://www.airbnb.com/rooms/30110320?guests=1&adults=1",
            "https://www.airbnb.com/rooms/30110843?guests=1&adults=1",
            "https://www.airbnb.com/rooms/30111035?guests=1&adults=1",
            "https://www.airbnb.com/rooms/30111263?guests=1&adults=1",]

        let timestamp = document.createElement('div');
        timestamp.innerHTML = (new Date).toLocaleString();
        timestamp.style.fontSize = "24px";
        document.body.append(timestamp);
        for(let room of rooms){
            if(room == "-") {                                                           // add an horizontal line
                let line = document.createElement('div');
                line.style.width = "100%";
                line.style.height = "3px";
                line.style.float = "left";
                line.style.background = "gray";
                document.body.append(line);
                continue;
            }
            log(room)
            let container = document.createElement('div');
            container.style.float = 'left';
            container.style.padding = '2em';
            document.body.append(container);
            (async function(){
                let iframe = document.createElement('iframe')
                iframe.style.width = '100%'                                             // make iframe wide so the calendar loads 2 months and not just one
                // iframe.style.display = 'none'
                iframe.src = room
                document.body.appendChild(iframe)
                await sleep(3000);
                let w = iframe.contentWindow
                let cal = await waitFor(()=>w.document.querySelector('[aria-label="Calendar"]'), 60*1000)
                if(!cal) {w.close(); return}
                await sleep(1*1000);                                                     // wait for calendar to load
                // copy title and add hyperlink
                let title = document.createElement('a');
                title.href = room;
                title.appendChild( (await waitFor(()=>w.document.querySelectorAll('._18hrqvin')[0])).cloneNode(true) )
                container.appendChild(title)
                // copy calendar
                let cal2 = cal.cloneNode(true);
                cal2.setAttribute('style', '');
                container.appendChild(cal2);
                // highlight current day
                let today = Array.from(cal2.querySelectorAll('._mqakwe'))               // selector for a day of the calendar
                .filter(e=>e.innerText == new Date().getDate())[0]
                if(!today) log("Couldn't select 'Today'")
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

    if(url.match("loadCals=2")){
        document.title = 'Calendars Airbnb 2';
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
        30111263,
        0,
        0,
        0,
        24633990,
        26282060,
        24610101
    ]

        let log = console.log.bind(console);
        let isToday = function(date){
            let d1 = date.split('-').splice(1).map(n=>parseInt(n))
            let d2 = (new Date).toLocaleDateString().split('/').splice(0,2).map(n=>parseInt(n))
            return d1[0] == d2[0] && d1[1] == d2[1]
        }
        let promises = [];
        let resolved = 0;
        let loading = () => (localStorage.previous || '') + `<br><br><br><div align="center"> updating ${"＊".repeat(resolved)}${"．".repeat(ids.filter(id=>id>0).length - resolved)} </div>` ;
        document.body.innerHTML = loading()
        document.body.style.align = "center"
        document.body.style.background = 'black';
        document.body.style.color = "white";

        for(let id of ids){
            if(id == 0) {
                promises.push(['%c','']) // push empty, with empty style, new line is added later to it
                continue;
            }
            let month = (new Date).getMonth() + ((new Date).getDate()>15 ? 1 : 0)   // previous month until the 15th of the month, afterwards show current month
            promises.push(fetch(`https://www.airbnb.com/api/v2/calendar_months?_format=with_conditions&count=4&currency=USD&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&listing_id=${id}&locale=en&month=${month}&year=2019`)
            .then(response => response.json())
            .then(async function(json) {
                // JSON.stringify(json, null, 2);
                resolved += 1;
                console.log(`loaded ${id}`);
                document.body.innerHTML = loading();
                await new Promise(resolve => setTimeout(resolve,10));   // wait a little bit for last part of loading animation to be visible
                // process the first 2 months
                var out = ''
                var styles = []
                for( let month of json.calendar_months ){
                    var current = month.month
                    for(let day of month.days){
                        //log(day)
                        if(current != day.date.split('-')[1]) continue	// ignore ending days of prev month, and begining of next. Use only current month
                        out += `%c${day.date.split('-')[2]}%c `;		// 2 styles, for the day, and for the white space
                        styles.push(`color:${day.available ? 'lightgreen' : 'lightgray'}; background:${isToday(day.date) ? (day.available ? '#005015' : '#671900') :''}`)
                        styles.push('')									// style for the blank space between numbers
                    }
                    out += "| "
                }
                return [out, styles]
            })
            .catch(()=>['%cerror'+' - '.repeat(300), 'color:gray']))
        }


        Promise.all(promises).then(outs=>{
            // log to console
            let final = '';
            let styles = []
            for(let out of outs){
                final += out[0] +'\n';
                styles = styles.concat(out[1])
            }
            log(final, ...styles)

            // write html
            document.body.innerHTML = '<br>'
            document.body.style.background = 'black';
            for(let out of outs){
                if(out[0] == "%c"){		// empty line
                    document.body.innerHTML += '<br>';
                }
                let style = [''].concat(out[1]);
                document.body.innerHTML +=  `<div style="white-space: nowrap">${
                    out[0].split("%c")
                    .map( (str,i)=>`<span style="${style[i]}">${str}</span>` )
                    .join('')  // for each '%c' create a styled span
                }</div>`
            }
            localStorage.previous = document.body.innerHTML

        })

    }
})();
