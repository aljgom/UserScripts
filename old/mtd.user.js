// ==UserScript==
// @name         MTD
// @namespace    aljgom
// @version      0.1
// @description  Replace tab title with arrival time of the next bus, add bus filtering when changing the URL
// @match        http://www.cumtd.com/maps-and-schedules/bus-stops/info/*
// @match        https://www.cumtd.com/maps-and-schedules/bus-stops/info/*
// ==/UserScript==


NodeList.prototype.forEach = HTMLCollection.prototype.forEach = Array.prototype.forEach;


var changeTitle = function(){
    var loop = true;
    realTimeData.children[1].children.forEach(function(x){
        if(loop && x.style.display!="none" ){
            var txt = x.children[3].innerHTML;
            if(txt == "Due"){
                document.title = "Due|" + x.children[1].innerHTML + " " + x.children[2].innerHTML;
            }else if(txt.substr(txt.length-2) == "PM" || txt.substr(txt.length-2) == "AM" ){
                document.title = txt +"|" + x.children[1].innerHTML + " " + x.children[2].innerHTML;
            }else{
                document.title = txt.substr(0,txt.length-5) + "m|" + x.children[1].innerHTML + " " + x.children[2].innerHTML;
            }
            loop=false;
        }
    });
}



var a=document.location.toString();
var prune = function(){
            buses = a.substr(a.indexOf("&b")+3).split(',');
            rows=document.getElementById("realTimeData").children[1].children;
            rows.forEach(function(row){
           		if(buses.indexOf( row.children[1].innerHTML ) == -1) row.style.display="none";
            });
		}
if(a.indexOf("&b") != -1){
    prune();
    setInterval(prune,1000);
}

changeTitle();
setInterval(changeTitle,5000);




document.getElementById("adviceForWebContainer").remove();    // remove advice div
