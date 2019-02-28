// ==UserScript==
// @name         Suburban Express
// @namespace    aljgom
// @version      0.1
// @description  Open a new window to load all the prices of the buses in the search result, and add them all one by one into the table of the main window
// @match        https://www.busline.com/choose_schedule.php
// @match        https://busline.com/choose_schedule.php
// ==/UserScript==


//nw.close()
var gettingPrice = 0;
var direction;
var nw = new Array();
waitFor('document.getElementsByName("schedule_1")[0] != undefined',function()
	{
    var available = document.getElementsByName("schedule_1");
    addExtraTds();
    getPrice(available.length-1);
});

function getPrice(j){
    if(j-1>= 0) getPrice(j-1);
	nw[j] = window.open(document.location+"?running",'', 'width=100,height=100'); nw[j].resizeTo(500,500);
	waitFor('nw['+j+'].document.getElementsByName("schedule_1")[0]!=undefined && nw['+j+'].document.getElementsByName("whereto")[2]!=undefined && gettingPrice == '+j+'',function(){
        var available = nw[j].document.getElementsByName("schedule_1");
        direction = nw[j].document.getElementsByTagName("h2")[0].innerHTML.toString().match("to Champaign-Urbana") != null ? "chicago" : "champaign";
		available[j].click();
		nw[j].document.getElementsByName("whereto")[2].click();
		waitFor('nw['+j+'].document.getElementsByName("spec_origin_1")[0] != undefined',function()		//select buses
		{
			from=nw[j].document.getElementsByName("spec_origin_1")[0];
            var selected = false;
			for(var i=0;i<from.children.length;i++){
                if( ! from.children[i].disabled && ( direction == "champaign" || from.children[i].value == "OAK" || from.children[i].value == "WFD")){
                    from.value= from.children[i].value;
                    selected = true;
                }
			}
            if(!selected){
                /*if(++j<l){getPrice(l,j);return;}	//current+1 less than length
                else */ nw[j].close();
                gettingPrice++;
                return;
            }
			to=nw[j].document.getElementsByName("spec_dest_1")[0];
            selected = false;
			for(i=0;i<to.children.length;i++){
                if( ! to.children[i].disabled && ( direction == "chicago" || to.children[i].value == "OAK" || to.children[i].value == "WFD") ){
                    to.value= to.children[i].value;
                    selected = true;
                }
			}
            if(!selected){
                /*if(++j<l){getPrice(l,j);return;}	//current+1 less than length
                else */ nw[j].close();
            	gettingPrice++;
                return;
            }
			nw[j].document.getElementsByTagName("input")[2].click();
			waitFor('nw['+j+'].document.location.toString().match("choose_confirm")!=null && nw['+j+'].document.getElementsByClassName("botbor")[2]!=undefined',function()
			{
				row=document.getElementsByName("schedule_1")[j].parentElement.parentElement;
                var price = nw[j].document.getElementsByClassName("botbor")[2].innerHTML;
                price = price.substring(0,price.indexOf("$")+1)+ (Number( price.substring( price.indexOf("$")+1 , price.indexOf("$")+6 ) ) +1.05) + ".00";
                row.lastChild.innerHTML=price;
			//	if(++j<l)getPrice(l,j);		//current+1 less than length
    			//else
            //    nw[j].alert(j);
                    nw[j].close();
                	gettingPrice++;
			},j+ " "+ 3);
		},j+ " "+ 2);
	},j+ " "+ 1);
}
function addExtraTds(){
    var index=0;
	var rows= document.getElementsByClassName("botbor")[0].parentElement.parentElement.children;
    var available = document.getElementsByName("schedule_1");
	var head= document.getElementsByTagName("thead")[0].children[0];
    var th=document.createElement("th");
    th.innerHTML="&nbsp;Price&nbsp;";
	head.insertBefore(th,head.last);
    for(var i=0; i<rows.length; i++){
        if(rows[i] == available[index]){index++; continue};
        console.log(rows[i].children.length);
        if(rows[i].children.length ==7){
        var td=document.createElement("td");
        td.className=rows[i].children[0].className;
        rows[i].insertBefore(td,rows[i].last);
        }
        if(rows[i].children.length == 1 ) rows[i].children[0].setAttribute("colspan",8);
    }
}

function waitFor(condition, next, i){
	var waitInterval=setInterval(function()
	{
	//console.log('waiting..' +i);
	if(eval(condition)){clearInterval(waitInterval);next();}
	},100);
}
