// ==UserScript==
// @name         Google Music
// @namespace    aljgom
// @version      0.1
// @description  Additions to Google Music
// @match        https://play.google.com/music/*
// ==/UserScript==

/*  Change zoom for small window */
setInterval(()=>{
    var w = window.outerWidth;
	document.body.style.zoom =  (w - 542 < 2) ? 0.5 : 1;
	player.style.width =		(w - 542 < 2) ? '55%' : '100%';
},500);


/* SONG TITLE CAPITALIZATION */
if(false){
     NodeList.prototype.forEach = Array.prototype.forEach;
    bginter= setInterval(function(){
    document.getElementsByClassName("song-row").forEach(function(row){
    if(row.children[0].children[0].innerHTML.match(/\w\S*/g) == null) {console.log(row.children[0].children[0].innerHTML);return}
    red=false;
    row.children[0].children[0].innerHTML.match(/\w\S*/g).forEach(function(w){ if( w[0].match(/[a-z]/) ) red = true});
    if(red)row.style.background= "red"; else row.style.background = "white";
    })
    },1000)

    function toTitleCase(str)
    {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
    artist = true;
    name = true;

    inter= setInterval(function(){
    if(document.getElementsByClassName("modal-dialog edit-dialog")[0].attributes["aria-hidden"].value == "true") return;
    if(name)document.getElementById("edit-name").value = toTitleCase(document.getElementById("edit-name").value)
    if(artist)document.getElementById("edit-song-artist").value = toTitleCase(document.getElementById("edit-song-artist").value)
    document.getElementsByName("save")[0].click()
    },100)

}


/* /// GET ARTISTS WITH NO COVER ART
setInterval(function(){
    if(document.location.toString() == "https://play.google.com/music/listen#artists"){
        artists = document.getElementsByClassName("browseArtistContainer");
        for(i=0;i<artists.length;i++){
        artists[i].style.display = "none";
        }


        imgs = document.getElementsByTagName("img");
        for(i=0;i<imgs.length;i++){
        if(imgs[i].src.match("default_album_med.png")){
        traverseUp(imgs[i],0);
        }
        }

        function traverseUp(node,depth){
        if(depth>4) return;
        var parent = node.parentElement;
        if(parent.className == "browseArtistContainer") {parent.style.display =""; return true}
        else traverseUp(parent,depth+1);
        return false;
        }
	}
},1000);
*/

/*if( new Date() > new Date(2013,3,7) ) alert ("check TM instant Mix fix");

// instant mix images arent displaying right on load on the main page.
instantMixFix = setInterval(function(){
    if( document.getElementById("loading-progress")== undefined || document.getElementById("loading-progress").style.display != "none" )return;
    if(document.location.toString() =="https://play.google.com/music/listen#start"){
        document.location = "https://play.google.com/music/listen#all";
        setTimeout('document.location = "https://play.google.com/music/listen#start"',1)
    }
    clearInterval(instantMixFix);
},50);
*/

promoPackInter=setInterval(function(){
	if(document.getElementById("promo_pack_bar")==null)return;
	//promoHeight=document.getElementById("promo_pack_bar").offsetHeight;
    //node=document.getElementById("promo_pack_bar");
    //node.parentNode.removeChild(node);
    //contentHeight=document.getElementById("content").offsetHeight+promoHeight+10;
	//document.getElementById("content").style.height=contentHeight+"px";
    if(  document.getElementById("loading-progress").style.display == "none" &&		//wait to finish loading
         document.getElementById("promo_pack_bar").scrollHeight != 0 // for some reason checking style.display doesn't work
      ) document.getElementById("promo_pack_close_button").click();
    //clearInterval(inter);
},1000);

//Search google images for when clicking on album cover

setInterval(function(){
    if(document.getElementById("edit-album-art")==null)return;
    document.getElementById("edit-album-art-error").onclick=document.getElementById("edit-album-art").onclick=function(){
        album=document.getElementsByClassName("edit-section")[3].children[1].value;
     	albumOrSong=( album=="" || album == "Unknown Album" || album == "Album Desconocido") ? document.getElementsByClassName("edit-section")[0].children[1].value : album;
        albumArtist = document.getElementsByClassName("edit-section")[2].children[1].value;
        songArtist = document.getElementsByClassName("edit-section")[1].children[1].value
        artist = albumArtist == "" ? songArtist : albumArtist;
        searchStr=artist + " " + albumOrSong;
        window.open("https://www.google.com/search?num=10&hl=en&authuser=0&site=imghp&tbm=isch&q="+searchStr);
    };
},500);
