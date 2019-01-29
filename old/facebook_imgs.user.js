// ==UserScript==
// @name       Facebook Imgs
// @namespace  aljgom
// @author     aljgom
// @description  Removes Images on facebook, temporarily shows them if 'i' is pressed
// @match	   https://www.facebook.com/*
// @match      http://www.facebook.com/*
// ==/UserScript==


/*
hideImages = function(){
    var nodes=document.getElementsByTagName("img");
    nodes.forEach(function(n){
        n.style.display = 'none'
    })
}
showImages = function(){
    var nodes=document.getElementsByTagName("img");
    nodes.forEach(function(n){
        	if(n.state) console.log(n.state)//
            n.style.display = n.state;
    })
}

saveState = function(){
    var nodes=document.getElementsByTagName("img");
    nodes.forEach(function(n){
        n.state = n.style.display;
    })
}

saveState();
hide = setInterval(hideImages,100);

document.body.onkeypress = function(e){
    if(e.which ==105){
        clearInterval(hide);
       	showImages();
        setTimeout(function(){saveState();hide = setInterval(hideImages,100);},2*1000);
	}

}

*/

localStorage.showImages = "false"

var hideShow = function(){
    var nodes=document.getElementsByTagName("img");
    nodes.forEach(function(n){
        if(n.state==undefined) n.state = n.style.visibility;							// store state if it doesn't exist
        if(localStorage.showImages == "false") n.style.visibility = "hidden"
        else n.style.visibility = n.state;
    })
}

setInterval(hideShow,1000)

document.body.onkeypress = function(e){
    if(e.which ==105){
        localStorage.showImages="true"
        setTimeout(function(){localStorage.showImages="false"},5*1000);
	}

}
