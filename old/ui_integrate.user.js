// ==UserScript==
// @name         UI integrate
// @namespace    aljgom
// @author       aljgom
// @version      0.1
// @description  Automate login and navigation through UI Integrate website
// @match        https://ui2web1.apps.uillinois.edu/*
// @match        https://apps.uillinois.edu/*
// @match        https://eas.admin.uillinois.edu/eas/*
// ==/UserScript==

url=document.location.toString();
if(url == "https://apps.uillinois.edu/"){
    document.getElementsByClassName("row2")[0].children[0].children[0].click();
}
if(url == "https://apps.uillinois.edu/StudentFacSelfService.html" ||
   url == "https://apps.uillinois.edu/selfservice" ||
   url == "https://apps.uillinois.edu/selfservice/" ||
   url=="https://apps.uillinois.edu/selfservice/index.html"){
    document.getElementsByClassName("row2")[0].children[2].children[2].children[0].click();
}
if(url.match("name=bmenu.P_MainMnu")!=null){
    document.location="https://ui2web1.apps.uillinois.edu/BANPROD1/twbkwbis.P_GenMenu?name=bmenu.P_RegAgreementLook";
}
if(url.match("name=bmenu.P_RegAgreementLook") !=null ||
   url.match("name=bmenu.P_RegAgreementAdd")  !=null){
    document.getElementsByClassName("menuplaintable")[0].children[0].children[0].children[1].children[0].click();
}
if(url.match("bwskfcls.p_sel_crse_search") !=null){
    document.getElementById("term_input_id").value=120148;
    document.forms[1].submit();
}
if(url.match("bwskfreg.P_AltPin") !=null){
    if(document.getElementById("term_id") !=null){
        document.getElementById("term_id").value=120148;
        document.forms[1].submit();
    }
}
if(url.match("https://eas.admin.uillinois.edu/eas/servlet/EasLogin") !=null ){
 if(typeof loginMessage === 'undefined'){
    document.getElementById("ENT_ID").value="";
    document.getElementById("PASSWORD").value="";
    document.getElementsByClassName("idbuttons")[0].children[0].click();
    }
  else alert("login error");
}

if(url == "https://eas.admin.uillinois.edu/eas/jsp/logout.do" ||
   url == "https://apps.uillinois.edu/selfservice/error/" ){
    document.location="https://apps.uillinois.edu/selfservice";
}
if(url == "https://eas.admin.uillinois.edu/eas/jsp/logout.jsp?prompt=y"){
    setTimeout(function(){document.getElementsByName("BTN_YES")[0].click();},1); // if it fails, next step still runs
    setTimeout(function(){document.location="https://apps.uillinois.edu/selfservice";},500);
}
