// ==UserScript==
// @name         Google Translate Bar
// @namespace    aljgom
// @version      0.1
// @description  Translates whole page, hides translate bar, and adds a button to show it
// @match        http://*/*
// @match        https://*/*
// @match        */*
// ==/UserScript==


var clickButton = function(){
      var translateBar = document.getElementsByClassName("skiptranslate")[0];
      translateBar.children[0].style.display='block';
      var buttonStyle = document.getElementById("hideButton").style;
      if(translateBar.style.display != "none"){
          document.body.style.top="0px";
          buttonStyle.position = "absolute";
          buttonStyle.top = "0";
          buttonStyle.right = "0";
          buttonStyle.height = '3px';
          document.getElementById("hideButton").innerHTML='';
          //$("#hideButton").css("position", "absolute").css("top", 0).css("right", 0).val("").css("height","3");
          translateBar.style.display="none";
      }
      else{
          document.body.style.top="40px";
          //$("#hideButton").css("position", "fixed").css("top", 9).css("right", 120).val("   hide   ").css("height","1.5em");
          buttonStyle.height = '9px';
          translateBar.children[0].style.zIndex="1002";
          translateBar.style.display="block";
      }
}
//$('body').insertBefore($('body').children[0],'<input type="button" value="" id="hideButton"> ');
hideButton = document.createElement('button');
hideButton.id='hideButton'
document.body.appendChild(hideButton);
hideButton.style.position = "fixed";
hideButton.style.top=0;
hideButton.style.right=0;
hideButton.style.zIndex=1003;
hideButton.style.height = 3;
hideButton.onclick = clickButton;
/*if( !document.location.toString().match("dropbox.com") ){ //adding the button breaks the dropbox website
    /*
    $('body').append('<input type="button" value="" id="hideButton"> ');
    $("#hideButton").css("position", "fixed").css("top", 0).css("right", 0).css("z-index",1003).css("height",3);
    $('#hideButton').click(clickButton);
}*/

localStorage.isNoTranslatePage = false;
var urls = [
    "celery",
    "docs.djangoproject",
    "http://www.cybercoders.com/",
    "ht",
    "newhire.uihr.uillinois.edu",
    "http://slickdeals.net/",
    "tps://www.creditkarma.com/myfinances/simulator",
    "lmgtfy",
    "http://classsos.com/",
    "docs.google.com/document",
    "mygreatlakes",
    "craigslist.org",
    "http://play.typeracer.com/",
    "https://www.fc.campusoncall.com",
    "xda-developers",
    "http://www.codeskulptor.org/",
    "http://www.greyhound.com/",
    "writecodeonline",
    "http://isws.illinois.edu/",
    "http://www.isws.illinois.edu/",
    "rsetserver",
    "https://www.interviewstreet.com",
    "https://www.google.com/webmasters/tools",
    "http://careers.peopleclick.com",
    "jobsearch.abou",
    "http://infoencrypt.com/",
    "https://plus.google.com/hangouts",
    "youtube",
    "http://careers.epic.com/",
    "http://www.rembrandtadvantage.com",
    "http://www.codecademy.com",
    "http://localhost",
    "http://helios.sws.uiuc.edu/",
    "https://www.greyhound.com/",
    "live.com",
    "http://docs.oracle.com",
    "http://www.wolframalpha.com",
    "https://wiki.engr.illinois.edu",
    "\\?en",
    "https://www.busline.com",
    "http://userscripts.org",
    "http://translate.google.com/",
    "https://amazon.icims.com",
    "https://us-amazon.icims.com",
    "http://knockoutjs.com",
    "https://ui2web1.apps.uillinois.edu/BANPROD1/bwckschd.p_disp_detail_sched",
    "http://web.engr.illinois.edu/~gomez14/",
    "http://classalert.web44.net/",
    "http://php.net/",
    "http://www.php.net",
    "http://web.engr.illinois.edu/~gomez14/getSeats.php",
    "http://www.000webhost.com",
    "http://phptester.net",
    "http://api.jqueryui.com",
    "https://ui2web1.apps.uillinois.edu/BANPROD1/bwckcoms.P_Regs",
    "http://aa.usno.navy.mil",
    "http://www.codingunit.com",
    "http://stackoverflow.com",
    "https://ui2web1.apps.uillinois.edu/BANPROD1/bwckgens.p_proc_term_date",
    "https://ui2web1.apps.uillinois.edu/BANPROD1/bwckschd.p_disp_listcrse",
    "http://www.intel.com",
    "http://breakoutjs.com",
    "http://arduino.cc"
];
for (var x=0; x < urls.length; x++){
    if(document.location.toString().match(urls[x]) != null){
        localStorage.isNoTranslatePage = true;
    }
}
