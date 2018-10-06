// ==UserScript==
// @name       Instant Login
// @namespace  aljgom
// @version    0.1
// @description  Automates login forms to log in automatically to pages.
//               I use it in conjunction with a password manager (LastPass), and it clicks log in buttons after LastPass fills up the required fields
//               Uses WaitFor function defined in All Pages script
// @match      http://*/*
// @match      https://*/*
// @grant      window.close
// @copyright  2012+, aljgom
// ==/UserScript==

(async ()=>{

    // gi and gc are defined in this local scope.
    function gi(id){ return document.getElementById(id); }
    function gc(cl){ return document.getElementsByClassName(cl); }
    let url = document.location.toString();

    /**
     * Keep track if we're submitting too fast, in case there's some error
     * and we're trying over and over and ;
     */
    function submitTooFast(){
        var diff = new Date() - new Date(localStorage.loginAttempt);
        localStorage.loginAttempt = Date();
        if( diff < 15*1000 ){
            alert('Script "Instant Login": Logging in too fast');
            return true;
        }
        return false;
    }

    /**
     * Wait until 'field' has a value, then click 'submitEl'
     */
    function loginWhenFieldSet(field, submitEl){
        log('instant login', field,submitEl)
        if( !field || !field.value) {
            setTimeout(loginWhenFieldSet,1000,...arguments); return;  }
        if(field.prev != field.value){                          // wait one iteration to see if field is changing
            field.prev = field.value;
            setTimeout(loginWhenFieldSet,1000,...arguments);
            return;
        }
        if(submitTooFast()) return;
        submitEl.click();
    }

    /**
     * Deprecated: it was used with the PasswordBox manager, which ended it's life
     */    function setAccountChooseAlert(msg){                         // alert when account select shows up
        if( !gc("PBTooltipFrame")[0] ){  setTimeout(setAccountChooseAlert,1000,...arguments);
                                       return;  }
        msg += '\n'.repeat(20);
        alertTimeout = setTimeout(alert,10000,msg);                            // in case popup was already loaded when adding event listener
        gc("PBTooltipFrame")[0].addEventListener('load', ()=>{ setTimeout(alert,100,msg); clearTimeout(alertTimeout); });
    }

    /**
     * Wait until query exists, then set a value for it
     */
    async function setValue(query,value){
        let el = await waitFor(query,15*1000);
        if(el) {
            el.value = value;
            return true;
        }
        return false;
    }

    /**
     * redirect to 'other' url if wer're in 'check' url
     */
    function redirect(check,other){ if( url == check) setTimeout(()=> document.location= other,300); }



    redirect('https://myactivity.google.com/myactivity','https://myactivity.google.com/item');

    // login when field set:

/*** BANK OF AMERICA **/
    if( url                                                     == "https://www.bankofamerica.com/"){
        //loginWhenFieldSet( gi("passcode1"), gi("hp-sign-in-btn"));
    }

/** BARCLAYCARD **/                                             redirect("https://www.barclaycardus.com/", "https://www.barclaycardus.com/servicing/login");
    if( url                                                     .match("https://www.barclaycardus.com/servicing/authenticate") || url.match("https://www.barclaycardus.com/servicing/home") ){
        //loginWhenFieldSet( password, gi("loginButton") );
    }

    redirect("https://www.chase.com/", "https://secure07a.chase.com/web/auth/#/logon/logon/chaseOnline");

/*** CHASE **/                                                //  redirect("https://secure07a.chase.com/web/auth/dashboard#/dashboard/index/index","https://secure07a.chase.com/web/auth/#/logon/logon/chaseOnline");
    if( url                                                     == "https://www.chase.com/" || url == "https://secure07a.chase.com/web/auth/#/logon/logon/chaseOnline"){
        setAccountChooseAlert('');
        loginWhenFieldSet( await waitFor(()=>gi('password-input-field')), gi('signin-button') );
    }

                                                                redirect("https://www.capitalone.com/sign-out/?service=e", "https://verified.capitalone.com/sic-ui/#/esignin?Product=Card");
/*** CAPITAL ONE **/                                            redirect("https://www.capitalone.com/",                    "https://verified.capitalone.com/sic-ui/#/esignin?Product=Card");
    if( url                                                     .match("https://verified.capitalone.com/sic-ui/#/esignin")){
        loginWhenFieldSet(await waitFor(()=>gi('password')), gi("id-signin-submit") ); }
    if( url                                                     .match("https://verified.capitalone.com/challenge.html") ){
        var el = await waitFor(()=>document.getElementsByClassName("choice-list-text")[0],10*1000);
        if(el) el.click();
        el = await waitFor(()=>document.getElementById("otp-button-0"),10*1000)
        if(el) el.click();

    }
                                                                redirect("https://secure.creditsesame.com/s/signup1v3", "https://secure.creditsesame.com/s/login"); // loggeed out page
/*** CREDIT SESAME ***/                                         redirect("https://www.creditsesame.com/", "https://secure.creditsesame.com/s/login");
    if(url                                                      .match("https://secure.creditsesame.com/s/login") ){
        loginWhenFieldSet( password, gi("loginButton") );
    }

/*** CREDITKARMA ***/                                         redirect("https://www.creditkarma.com/", "https://www.creditkarma.com/auth/logon");
    if(url                                                      .match("https://www.creditkarma.com/auth/logon") ){
        loginWhenFieldSet( password, gi("Logon") );
    }

                                                                var loginPage = 'https://portal.discover.com/customersvcs/universalLogin/ac_main'
                                                                redirect("https://www.discover.com/", loginPage);
                                                                redirect("https://portal.discover.com/customersvcs/universalLogin/logoff_confirmed" ,  loginPage);
/*** DISCOVER **/                                               redirect("https://portal.discover.com/customersvcs/universalLogin/timeout_confirmed",  loginPage);
    if( url                                                     == loginPage){
        loginWhenFieldSet( await waitFor(()=>gi("password-content")),gc("log-in-button")[1]);
    }

/*** EXPEDIA **/
    if( url                                                     .match("https://www.expedia.com/user/itin?")){
        loginWhenFieldSet( await waitFor(()=>gi("unified-itin-password")), gi("unified-itin-submit-button") );
    }

/** FIFTH THIRD **/
    if( url                                                     == "https://www.53.com/content/fifth-third/en.html"){
        waitFor("gc('desktop-login login-btn')[0]",20000)
        .then(r=>r.click());
        loginWhenFieldSet( gi("pw-label"), gi("ib-login-button") );
    }

/*** MYNETDIARY **/                                             redirect("http://www.mynetdiary.com/", "http://www.mynetdiary.com/daily.do");

                                                                redirect("https://www.mint.com/",  "https://mint.intuit.com/bills.event");
/*** MINT **/                                                   redirect("https://play.google.com/store/apps/details?id=com.mint",  "https://mint.intuit.com/bills.event");  // from google play app page
    if( url                                                     .match("accounts.intuit.com/index.html")){
        loginWhenFieldSet(await waitFor(()=>gi('ius-password')), gi("ius-sign-in-submit-btn") );        //  });
    }

/*** SAVVYMONEY **/                                             redirect("https://www.savvymoney.com/", "https://www.savvymoney.com/login");
    if(url                                                      .match("https://www.savvymoney.com/login")){
        loginWhenFieldSet(await waitFor(()=>gi("password-sign-in")), gi("login-btn") );
    }

                                                                redirect("https://www.penfed.org/logoff/?reas=to", "https://www.penfed.org/login/");
/*** PENFED **/                                                 redirect("https://www.penfed.org/",                "https://www.penfed.org/login/");
    if(url                                                      == "https://www.penfed.org/login/"){
        await setValue(()=>gi("mlloginusernameinput"), 'aljgom');
        gi('login-user-ml-login').click()
    }
    if(url                                                      .match("online.penfed.org/PenFedOnline/Forms/Security/LogonPassword.aspx")){
        loginWhenFieldSet( gi("ctl00_ctl00_MainContentPlaceHolder_cphSecurityMainContent_txtPassword"), gi("ctl00_ctl00_MainContentPlaceHolder_imgLogon") );
    }


/*** WALLETHUB **/                                                 redirect("https://wallethub.com/", "https://wallethub.com/home/dashboard");
    if(url                                                      .match("https://wallethub.com/join/login")){
        // only works when right clicking submit button before this code. (?)
        loginWhenFieldSet( await waitFor(()=> document.querySelectorAll('[name=pw]')[0]), document.querySelectorAll('button>span')[0] );
        //await waitFor(()=> document.querySelectorAll('[name=pw]')[0]);
        //await waitFor(()=> document.querySelectorAll('[name=pw]')[0].value != '')
        // document.querySelectorAll("[name='$form']")[0].submit()
    }




                                                                var loginPage = "https://www.netteller.com/login2008/Authentication/Views/Login.aspx"
                                                                redirect("https://uoficreditunion.org/",                                     loginPage);
                                                                redirect("https://ap.pscu.com/AP/apresources/close.html",                    loginPage); // logged out page
                                                                redirect("https://apstp.pscu.com/AP/APCardholder/?wicket:interface=:1::::#", loginPage); // error page
                                                                redirect("https://apstp.pscu.com/AP/APCardholder/pages/sessiontimeout",      loginPage); // timeout page
/***UIECU ***/
    if( url                                                     == loginPage ){
        await sleep(1000);
        // reload on error
        if(document.body.innerHTML.match('An Error Occurred While Processing Your Request') )
            document.location.reload();

        // submit username and submit pw
        setValue(()=>gi("ctl00_PageContent_Login1_IdTextBox"), 'aljgom') // running async
        .then(()=>ctl00_PageContent_Login1_IdSubmitButton.click());
        loginWhenFieldSet( gi("ctl00_PageContent_Login1_PasswordTextBox"), gi("ctl00_PageContent_Login1_PasswordSubmitButton") );
    }

                                                                if( url.match("netteller.com/login2008/Views/Retail/MyNetTeller.aspx"  ) ){
                                                                    ctl00_ctl26_primaryMenuInfolinkV2MenuItemLinkButton.click(); // click Visa Card
                                                                }
    if( url == 'https://www.netteller.com/login2008/Views/Retail/InfolinkV2.aspx'){
        await sleep(5000);
        window.close();   // close window left behind
    }





    // set value
/** PAYPAL **/                                                  redirect("https://www.paypal.com/","https://www.paypal.com/signin");
                                                                redirect("https://www.paypal.com/home","https://www.paypal.com/signin");
                                                                redirect("https://www.paypal.com/us/home","https://www.paypal.com/signin");
    if( url                                                     .match("https://www.paypal.com/signin") || url.match("https://www.paypal.com/us/signin") )  {
        //setAccountChooseAlert('');
    }


// are these being used?
    if(url == "https://home.personalcapital.com/page/login/app#/dashboard" ||
       url == "https://home.personalcapital.com/page/login/goHome#/all-transactions" ||
       url == "https://home.personalcapital.com/page/login/app")
        document.location = 'https://home.personalcapital.com/page/login/app#/all-transactions';





/*** TRENDNET ROUTER **/
    if( url                                                     .match("http://192.168.10.1/login.asp") )  {
        await setValue(()=>gi("UserName"),  "admin");
        await setValue(()=>gi("Passwd"),  "password");
        Login_s.click();
    }

    if( url                                                     .match("http://192.168.10.1/home.html") )  {
        gc("menuheader ")[0].click();
        waitFor("myframe.document.getElementsByClassName('button_normal')[0]",10*1000).then(function(el){
            el.click();
            el.click();
        });
    }


})();
