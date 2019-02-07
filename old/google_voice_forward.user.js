// ==UserScript==
// @name         Google Voice Forward
// @namespace    aljgom
// @version      0.1
// @description  Automatically enable/disable text message forwarding by doing a web request to check which one it should chose
//               sends a text message to confim the change using a PHP google voice API in the backend
// @match        https://www.google.com/voice/b/0#phones
// ==/UserScript==
function loadXMLDoc()
{
	var xmlhttp;
	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	}
	else{// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function(){
      if (xmlhttp.readyState==1)  { }
	  if (xmlhttp.readyState==4 && xmlhttp.status==200){
          checkForward(xmlhttp.responseText);
          loadXMLDoc();
	  }

	}
    xmlhttp.open("POST","http://web.engr.illinois.edu/~gomez14/googleVoiceForward.php",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	txt=""; //"1="+document.getElementById('add').value +
	xmlhttp.send(txt);
}

function checkForward(txt){
    checkbox=document.getElementsByName("gc-sms-enabled2-8")[0];
    if(txt != ""){
        checkbox.click();
        sendMessage(checkbox.checked,txt);
    }
}

function sendMessage(msg,number){
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
	txt="message="+msg+"&number="+number;
	xmlhttp.send(txt);
}
loadXMLDoc();
