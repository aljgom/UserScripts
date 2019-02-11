// ==UserScript==
// @name         Register
// @namespace    aljgom
// @version      0.1
// @description  Automatically register to courses. Continiously checks register.php, this page in the backend gets
//               updated with the course number when a spots opens for it, which is the result of a backend monitoring script
//               sends a text message to notify that the registration was completed
// @match        https://ui2web1.apps.uillinois.edu/BANPROD1/bwckcoms.P_Regs
// @match        https://ui2web1.apps.uillinois.edu/BANPROD1/bwskfreg.P_AltPin
// @match        https://apps.uillinois.edu/selfservice/error/
// ==/UserScript==

function getScript(url, success) {
    var script = document.createElement('script');
    script.src = url;
    var head = document.getElementsByTagName('head')[0],
        done = false;
    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function() {
      if (!done && (!this.readyState
           || this.readyState == 'loaded'
           || this.readyState == 'complete')) {
        done = true;
        success();
        script.onload = script.onreadystatechange = null;
        head.removeChild(script);
      }
    };
    head.appendChild(script);
}
function loadXMLDoc()
{
	var xmlhttp;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function()
	{
	  if (xmlhttp.readyState==1)  { }
	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
	  {
          register(xmlhttp.responseText);
	  }

	}
    xmlhttp.open("POST","http://web.engr.illinois.edu/~gomez14/register.php",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	txt="";
	//"1="+document.getElementById('add').value ;
	xmlhttp.send(txt);
}
function register(txt){
    x=-1;
    for(i=1;i<11;i++){
        document.getElementById('crn_id'+i).value=txt.substring(x+=1,x+=5);
    }
    if (txt!="") document.getElementsByName("REG_BTN")[1].click();
}
function sendMessage(msg){
    var xmlhttp;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function()
	{
	  if (xmlhttp.readyState==1)	{	  }
	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
	  {
	  }
	}
    xmlhttp.open("POST","http://web.engr.illinois.edu/~gomez14/send_sms_post.php",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	txt="message="+msg;
	xmlhttp.send(txt);
}


if(document.location.toString()=="https://ui2web1.apps.uillinois.edu/BANPROD1/bwckcoms.P_Regs"){
    if(document.getElementsByClassName("datadisplaytable")[1] != undefined){
        row=document.getElementsByClassName("datadisplaytable")[1].children[0].children;
        var msg="";
        for(y=1;y<row.length;y++){
            for(x=0;x<5;x++){
                msg+=row[y].children[x].innerHTML+" ";
            }
            msg+="\n";
        }
        sendMessage(msg);

    }
    else {
        row=document.getElementsByClassName("datadisplaytable")[0].children[0].children;
        var msg="";
        for(y=1;y<row.length;y++){
            msg+=row[y].children[2].children[1].value+" ";
            msg+=row[y].children[3].children[0].value+" ";
            msg+=row[y].children[4].children[0].value+" ";
            msg+=row[y].children[5].children[0].value+" ";
            if(y<row.length-1)msg+=" ---- \n";
        }
        sendMessage(msg);
    }
    document.location="https://ui2web1.apps.uillinois.edu/BANPROD1/bwskfreg.P_AltPin";
}
if(document.location.toString()=="https://ui2web1.apps.uillinois.edu/BANPROD1/bwskfreg.P_AltPin"){
    setInterval(function(){loadXMLDoc()},30000);
    setTimeout(function(){location.reload()},2400000);
}
if(document.location.toString()=="https://apps.uillinois.edu/selfservice/error/"){
    sendMessage("logged out");
}
