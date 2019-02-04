// ==UserScript==
// @name           Buses
// @namespace      aljgom
// @author         aljgom
// @version        0.1
// @description    Automatically fills out forms to search for bus tickets
// @match          http://*/*
// @match          https://*/*
// ==/UserScript==
    /////greyhound
if(document.location.toString()=="https://www.greyhound.com/?1"){
    document.getElementById("ctl00_body_search_listOrigin_Input").value="Champaign, IL";
    document.getElementById("ctl00_body_search_listOrigin_ClientState").value='{"logEntries":[],"value":"560219|Champaign/IL","text":"Champaign, IL","enabled":true}';
    document.getElementById("ctl00_body_search_listDestination_Input").value="Chicago, IL";
    document.getElementById("ctl00_body_search_listDestination_ClientState").value='{"logEntries":[],"value":"560252|Chicago/IL","text":"Chicago, IL","enabled":true}';
    document.getElementById("ticketsSearchSchedules").click();
}
//////megabus
if(document.location.toString()=="http://us.megabus.com/?1"){
    d = new Date();
    dateStr=d.getMonth() +1+ "%2f" + d.getDate()   + "%2f" + d.getFullYear();
    window.location="http://us.megabus.com/JourneyResults.aspx?originCode=98&destinationCode=100&outboundDepartureDate="+dateStr+"&inboundDepartureDate=&passengerCount=1&transportType=0&concessionCount=0&nusCount=0&outboundWheelchairSeated=0&outboundOtherDisabilityCount=0&inboundWheelchairSeated=0&inboundOtherDisabilityCount=0&outboundPcaCount=0&inboundPcaCount=0&promotionCode=&withReturn=0";
}
/////////amtrak
if(document.location.toString()=="http://www.amtrak.com/home?1"){
    document.getElementById("tickets_dep_city").children[2].value = "Champaign";
    document.getElementById("tickets_arr_city").children[2].value = "Chicago";
    document.getElementById("ff_submit_button").children[0].click();
}

////////lex woodfield
if(document.location.toString()=="http://www.illiniexpress.com/?11"){
    document.location = "http://www.illiniexpress.com/?origin_stop_id=8&destination_stop_id=30&num_adults=01&promo_code=&num_children=00&num_bags=1&handicapped_access=0";
   /* document.forms[0].action="?11";
    document.getElementsByName("origin_stop_id")[0].value=8;
    document.getElementsByName("destination_stop_id")[0].value=30;
    itemselect.submit();
    document.getElementsByName("PROCEED")[0].click()*/
}
if(document.location.toString().match("origin_stop_id") != null){
    document.getElementsByName("PROCEED")[0].click();
}

////////lex oakbrook
if(document.location.toString()=="http://www.illiniexpress.com/?12"){
    document.location = "http://www.illiniexpress.com/?origin_stop_id=8&destination_stop_id=32&num_adults=01&promo_code=&num_children=00&num_bags=1&handicapped_access=0";
}
if(document.location.toString().match("origin_stop_id") != null){
    document.getElementsByName("PROCEED")[0].click();
}

////////peoria
if(document.location.toString()=="https://www.peoriacharter.com/tickets/?mrkt=uofi&1"){
    document.getElementById("ctl00_ContentPlaceHolder1_TripSelector_bullst_Trip_2").click()
}

//suburban
if(document.location.toString()=="https://www.busline.com/?1"){
    document.getElementsByName("org_1")[0].value=4;
    document.getElementsByName("org_1")[0].onchange();
    document.getElementsByName("dest_1")[0].value=3;
    document.getElementsByName("dest_1")[0].onchange();
    d = new Date();
    dateStr=d.getFullYear() + "-" + (d.getMonth() +1)+ "-" + d.getDate();
    document.getElementsByName("date_1")[0].value=dateStr;
    selection.submit();
}
