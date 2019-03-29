// ==UserScript==
// @name         SlickDeals
// @namespace    aljgom
// @author       aljgom
// @version      0.1
// @description  Style changes, and infinite scrolling
// @match        http://slickdeals.net/*
// @match        https://slickdeals.net/*
// @grant        none
// ==/UserScript==




function setStyle(cssText) {
		var sheet = document.createElement('style');
		sheet.type = 'text/css';
		/* Optional */ window.customSheet = sheet;
		(document.head || document.getElementsByTagName('head')[0]).appendChild(sheet);
		setStyle = function setStyle(cssText, node) {
			/* Optional */ cssText += '\n';
			if(!node || node.parentNode !== sheet) {
				return sheet.appendChild(document.createTextNode(cssText));
			}
			node.nodeValue = cssText;
			return node;
		};
		return setStyle(cssText);
}
setStyle(".attachment-preview, .sd_postbit_body_content, .sd_postbit_body, .forumbutton, .firstthread_postcontent, .userbar{background:white}");


//*** HIGHLIGHT LAST SEEN ***//
if(document.location.toString() == "https://slickdeals.net/"){
    if(!localStorage.lastSeen)    localStorage.lastSeen = '{"FP":[], "pop":[]}';
    lastSeen = JSON.parse( localStorage.lastSeen );
    marked = false;
    titles = $(".itemTitle", $(".gridCategory")[1] );
    titles.each(function(){
        if(!marked && lastSeen["FP"].indexOf(this.href) > -1){
            marked = true;
            this.parentElement.parentElement.parentElement.style.background = "#ffcd41";}
    });

    lastSeen["FP"] = [];
    for( i = 0; i<10; i++){
        lastSeen["FP"].push(titles[i].href);
    }
}

if(document.location.toString().match("https://slickdeals.net/deals/")){
    titles = $(".track-popularDealLink");
    titles.each(function(){
        if(!marked && lastSeen["pop"].indexOf(this.href) > -1){
            marked = true;
            this.parentElement.parentElement.style.background = "#ffcd41";}
    });

    lastSeen["pop"] = [];
    for( i = 0; i<10; i++){
        lastSeen["pop"].push(titles[i].href);
    }
    localStorage.lastSeen = JSON.stringify(lastSeen);
}



/*!** END HIGHLIGHT SEEN ***/

if(document.location.toString().match("https://slickdeals.net/deals/") ){
  $('.dealRow').each(function(){ this.insertBefore( $(".priceCol",this)[0] ,this.children[0]);});
  $('.dealRow').each(function(){ this.insertBefore( $(".ratingCol",this)[0] ,this.children[0]);});
  $(".ratingCol>.num"   ).css({'position':'relative', 'left':"87px", "opacity":".9" } );
  $(".ratingCol>.rating").css({'position':'relative', 'left':"917px" });
  $(".ratingCol").width(0);



//*** INFINITE SCROLL ***//

    //el = document.getElementsByClassName("lazyimg dealImg")[0]        // flag for checking that images are loaded
   // $(el).load(function() { this.loaded = true; })
    var counts;
    var f = document.createElement('iframe');
    f.id = "frame1";
    f.style.display='none';
    pageContent.insertBefore(f,pageContent.lastElementChild);
    if(document.location.toString() == "http://slickdeals.net/deals/") count.a = 1;
    else    count = arr =document.location.toString().split("=")[1];
    count++;
    var wait = 3;
  //  frame1.src = "http://slickdeals.net/deals/?page="+count
    var inter = setInterval(function(){
        if(document.body.offsetHeight - window.scrollY < 1900){      // 1900 from bottom of page
            if(document.getElementsByClassName("lazyimg dealImg")[0] === undefined){return;} // if no images, don't load next (stops loading when in last page)
            if(frame1.src === undefined || frame1.src === "" || frame1.src == "about:blank"){
            	frame1.src = "http://slickdeals.net/deals/?page="+count;
                return;
            }
            var image = frame1.contentWindow.document.getElementsByClassName("lazyimg dealImg")[0];
            if( image === undefined || image.loaded !== true ) return;    // check image of deals loaded
            //add count # to title
            frame1.contentWindow.document.getElementsByClassName("popularDeal")[0].firstElementChild.innerHTML = count;
            count++;
            deal_list = document.getElementsByClassName("popularDeal")[0];
            deal_list.insertBefore(frame1.contentWindow.document.getElementsByClassName("popularDeal")[0], deal_list.lastElementChild.nextSiblingElement);
            frame1.src = "http://slickdeals.net/deals/?page="+count;
        }
    },1000);
}


/*** INFINITE SCROLL COMMENTS ***/


if(document.location.toString().match("slickdeals.net/f/")){
    keepLoading = false;
	var page = 1,
        container = "#posts",
        url = document.location.toString();

	if( url.match("page") ){
		page = parseInt ( url.match(/page=(.*?)(&|$)/)[1] );
	}
	else{
		if(      url.match("\\?") ) url =  url.replace("?","?page=2&");
		else if( url.match("#") )   url =  url.replace("#","?page=2#");
		else						url += "?page=2";
	}

    var inter = setInterval(function(){
        if(document.body.offsetHeight - window.scrollY < 4000) getNextPage();  // from bottom of page
    },5000);


	var getNextPage = function(){
	  page++;
	  url = url.replace(/page=(.*?)(&|$)/,function(){return "page="+  page +arguments[2];});
	  console.log(url);

	  $.ajax({url:url,method:"get",data:{}}).done(function(data){
		var newContent = $(container,data).children();
		if( reachedEnd(newContent) ){ clearInterval(inter); return; }

        addPageDiv(page);
		newContent.each(function(){
			$(container).append(this);
		});

        if(keepLoading) getNextPage();

	  });
	};

    var addPageDiv = function(page){
		$(container).append("<div style='background:#e4e4e4;text-align:center;color:gray;font-weight:bold;'>"+page+"</div>");
    };

    var reachedEnd = function(newContent){
        return newContent.length === 0 || $(".postNumber").last().html() == $(".postNumber",newContent).last().html();
    };
}

























// OLD  keep signing up for giveaway

/*
giveaway = "4540/trip-for-2-to-vegas-spending-money-giveaway";
if(document.location.toString() =="http://slickdeals.net/giveaway/"+giveaway+"/entries") {
    setTimeout(function(){
        document.location ="http://slickdeals.net/giveaway/"+giveaway;
    },1000*10);
}

if(document.location.toString() =="http://slickdeals.net/giveaway/"+giveaway) {
    setTimeout(function(){
        if(document.getElementsByClassName("countdown_amount")[0].innerHTML == 0 && document.getElementsByClassName("countdown_amount")[1].innerHTML == 0 && document.getElementsByClassName("countdown_amount")[2].innerHTML == 0){
            console.log('giveaway has ended')
            return;
        }

        if(typeof(reenter_countdown) == "undefined"){
            setTimeout(function(){
            	document.getElementsByClassName("enterBtnContainer")[0].children[0].submit();
            },100*60*2);
        }
        var minutes = Number(reenter_countdown.innerHTML.toString().substr(3,2));
        minutes = minutes == 0 ? 0 : minutes + 4;
        setTimeout(function(){
            enterForm.submit()
        },1000*60*minutes);
    },1000*10);
}


if(document.location.toString() =="http://slickdeals.net/giveaway.php"){

    setTimeout(function(){
       // window.history.back();
        document.location ="http://slickdeals.net/giveaway/"+giveaway;
    },1000*5);
}
*/
