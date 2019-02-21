// ==UserScript==
// @name         Megabus
// @namespace    aljgom
// @version      0.1
// @description  enter something useful
// @match        https://us.megabus.com/journey-planner/journeys*
// ==/UserScript==

  // AUTO NAVIGATION


(function() {
    'use strict';


// test URL: https://us.megabus.com/journey-planner/journeys?days=1&concessionCount=0&departureDate=2017-12-30&destinationId=317&inboundOtherDisabilityCount=0&inboundPcaCount=0&inboundWheelchairSeated=0&nusCount=0&originId=100&otherDisabilityCount=0&pcaCount=0&totalPassengers=1&wheelchairSeated=0

setTimeout(()=>{
    if(confirm('auto navigate?')){
        inter = setInterval(()=>{
           log('start inter');
            var days = $(".price-ribbon__inner")[0].children;
            days[days.length-1].click();                  // click last day from results
            // $(".sr-summary__edit")[0].click();            // click 'edit search' (date should have changed from previous click)
            $("#findTickets").click();                    // click search
           log('end inter');
        },4000);
    }
},8000);





})();











return;


// DEPRECATED?


/** USAGE

*Parsing with Ajax
uncomment call to getNext function

* Parsing by loading each page

localStorage.scrape = "true"
localStorage.prices = ''
document.location.reload()


localStorage.scrape = "false"
**/


$ = jQuery;
url = document.location.toString();
function format(str,chars){ return str + " ".repeat( Math.max(0,chars - str.length ) ); }  // format to at least specific amount of characters



if (typeof(localStorage.prices) == "undefined"){ localStorage.prices ='';}
if (typeof(localStorage.scrape) == "undefined"){ localStorage.scrape ='true';}

if(url.match("JourneyResults")){
    localStorage.prices += parseTrips(document);
    console.log(localStorage.prices);
    if (localStorage.scrape == "true") document.getElementById("JourneyResylts_OutboundList_btnNextDayBottom").click();
}


if(url.match(/(SearchAndBuy|default)/i)){
   // localStorage.scrape = "true";
    localStorage.prices = '';
}



function getNext(url){

    $.ajax(url).done(function(data){
        trips = parseTrips(data);
        if(trips === '') return;
        console.log(trips);
        url = url.replace(/outboundDepartureDate=(.*?)&/,function(){
            d =  new Date(arguments[1].replace(/%2f/g,"/") )  ;
            d.setDate(d.getDate() + 1);
            return "outboundDepartureDate=" + d.toLocaleDateString() + "&";
        });
        getNext(url);

    });
}

// getNext(document.location.toString());

function parseTrips(data){
    var date = $("#JourneyResylts_lblSearchParams",data)[0].children[1].innerHTML.match(/>(.*)</)[1];
    date += " ".repeat(30 - date.length);				// format to 30 characters
    var dateOut = '';
    var trips = '';

    $(".journey",data).each(function(){
        var price = $(".five",this)[0].children[0].innerHTML.match(/\$(.*)/)[1];
        var depart = $(".two", this)[0].children[0].innerHTML.match(/[0-9].*/)[0].replace("&nbsp;"," ");        depart   = format(depart,8);
        var arrive = $(".two",this)[0].children[1].innerHTML.match(/[0-9].*/)[0].replace("&nbsp;"," ");         arrive   = format(arrive,8);
        var duration  = $(".three",this)[0].children[0].innerHTML.match(/[0-9]*h|[0-9]*m/g).join('');           duration = format(duration, 8);

        dateOut = dateOut === '' ? date : " ".repeat(30); // date the first time, blank spaces any other times

        trips += dateOut + depart + " - " + arrive + "   " +  duration + "   $" + price +"\n";
    });

    return trips;
}
