// ==UserScript==
// @name       Instant Login
// @namespace  aljgom
// @version    0.1
// @description  Automates login forms to log in automatically to pages.
//               I use it in conjunction with a password manager (LastPass),
//               and it clicks log in buttons after LastPass fills up the required fields
//               Uses WaitFor function defined in All Pages script
// @match      http://*/*
// @match      https://*/*
// @grant      window.close
// @grant      GM_setValue
// @grant      GM_getValue
// @grant      unsafeWindow
// ==/UserScript==

(async ()=>{
    function gi(id){ return document.getElementById(id); }
    function gc(cl){ return document.getElementsByClassName(cl); }
    let sleep = ms=>new Promise(resolve=>setTimeout(resolve,ms));
    let url = document.location.toString();

    /**
     * Keep track if we're submitting too fast, in case there's some error
     * and we're trying over and over
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
     * Wait until 'field' has a value, then click 'submitEl'  #todo, change it to promise, or use waitFor
     */
    function loginWhenFieldSet(field, submitEl){
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
     */
    function setAccountChooseAlert(msg){                         // alert when account select shows up
        if( !gc("PBTooltipFrame")[0] ){  setTimeout(setAccountChooseAlert,1000,...arguments);
                                       return;  }
        msg += '\n'.repeat(20);
        let alertTimeout = setTimeout(alert,10000,msg);                            // in case popup was already loaded when adding event listener
        gc("PBTooltipFrame")[0].addEventListener('load', ()=>{ setTimeout(alert,100,msg); clearTimeout(alertTimeout); });
    }


    /**
     * redirect to 'other' url if wer're in 'check' url
     */
    function redirect(check,other){ if( url == check) setTimeout(()=> document.location= other,300); }

    /**
     * Store usernames and passwords if needed into Script storage.
     * Keep in mind this is not really secure, so don't store important stuff
     * As of now it will only prompt for storing if it doesn't exist.
     * To update, do it manually in the Storage tab of the script
     */
    function getStorageValue(key){
        let data = getData();
        // if object doesn't have {key}, assign it
        if(data[key] == undefined){
             data[key] = prompt(`Instant Login Script: Enter *${key}* to store it`);
             storeData(data);
        }
        return data[key]
    }

    function storeData(data){
        GM_setValue(document.location.hostname, JSON.stringify(data))
    }


    function getData(){
        let data = GM_getValue(document.location.hostname);
        if( data === undefined){
            return {}
        }
        return JSON.parse(data)
    }




/*** BANK OF AMERICA **/
    if( url                                                     == "https://www.bankofamerica.com/"){
        //loginWhenFieldSet( gi("passcode1"), gi("hp-sign-in-btn"));
    }

/** BARCLAYCARD **/                                             redirect("https://cards.barclaycardus.com/", "https://www.barclaycardus.com/servicing/home?secureLogin=");
    if( url                                                     .match("https://www.barclaycardus.com/servicing/authenticate") || url.match("https://www.barclaycardus.com/servicing/home") ){
        loginWhenFieldSet( await waitFor(()=>gi('password')), gi("loginButton") );
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
        loginWhenFieldSet( unsafeWindow.password, gi("loginButton") );
    }

/*** CREDITKARMA ***/                                           redirect("https://www.creditkarma.com/", "https://www.creditkarma.com/auth/logon");
    if(url                                                      .match("https://www.creditkarma.com/auth/logon") ){
        loginWhenFieldSet( unsafeWindow.password, gi("Logon") );
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


/** FREEDOMPOP **/                                              redirect("https://www.freedompop.com/", "https://www.freedompop.com/login.htm");
    if( url                                                     == "https://www.freedompop.com/login.htm"  ||
        url                                                     .match( "https://support.freedompop.com/app/utils/login_form" ) ){
        var pw = await waitFor(()=>document.getElementsByName("signin-password-full")[0]);
        var user = document.getElementsByName("signin-username-full")[0]
        pw.value = getStorageValue('password');
        user.value = getStorageValue('email');
        //pw.onKeyPress = user.onkeypress = e => if(e.keyCode == 13) login.submit(); // they prevent Enter propagation, this line doesnt work

    }
    if(url.match('my.freedompop')){ setInterval(()=>{
        if(gc('account-list-dropdown')[1]) gc('account-list-dropdown')[1].parentElement.style.maxHeight = 'initial';
        var prev;
        url = document.location.toString();
        if(url != prev) redirect("https://my.freedompop.com/login", "https://www.freedompop.com/login.htm");
        prev = prev ? prev : url;
    },200);}


                                                                redirect("https://www.mint.com/",  "https://mint.intuit.com/bills.event");
/*** MINT **/                                                   redirect("https://play.google.com/store/apps/details?id=com.mint",  "https://mint.intuit.com/bills.event");  // from google play app page
    if( url                                                     .match("accounts.intuit.com/index.html")){
        loginWhenFieldSet(await waitFor(()=>gi('ius-password')), gi("ius-sign-in-submit-btn") );        //  });
    }


/*** MYNETDIARY **/                                             redirect("http://www.mynetdiary.com/", "http://www.mynetdiary.com/daily.do");


                                                                redirect("https://www.paypal.com/","https://www.paypal.com/signin");
                                                                redirect("https://www.paypal.com/home","https://www.paypal.com/signin");
/** PAYPAL **/                                                  redirect("https://www.paypal.com/us/home","https://www.paypal.com/signin");
    if( url                                                     .match("https://www.paypal.com/signin") || url.match("https://www.paypal.com/us/signin") )  {
        loginWhenFieldSet( await waitFor(()=>gi("password")), gi("btnLogin"));
    }

                                                                redirect("https://play.google.com/store/apps/details?id=com.personalcapital.pcapandroid",  "https://home.personalcapital.com/page/login/goHome");  // from google play app page
                                                                // redirect to transactions tab
                                                                if(url == "https://home.personalcapital.com/page/login/app#/dashboard" ||
                                                                   url == "https://home.personalcapital.com/page/login/goHome#/all-transactions" ||
                                                                   url == "https://home.personalcapital.com/page/login/app")
                                                                    document.location = 'https://home.personalcapital.com/page/login/app#/all-transactions';
                                                                setTimeout(()=>{
/** PERSONAL CAPITAL **/                                            redirect( "https://www.personalcapital.com/" , "https://home.personalcapital.com/page/login/goHome" );  },2000);
    if( url                                                     .match("https://home.personalcapital.com/page/login/")){
        // enter username if password form hidden
        if(gi('form-password').style.display != 'block') {
            let user_field = await waitFor(()=>gc("input-xlarge validate")[0])
            user_field.value = getStorageValue('email');
            gc("btn btn-primary")[0].click() ;
            await sleep(3000);
            document.location.reload();         // reaload so LastPass will fill up password field
        }
        // password
        loginWhenFieldSet( await waitFor(()=>document.getElementsByName("passwd")[0]), gc("btn btn-primary")[1]);
    }


                                                                redirect("https://www.penfed.org/logoff/?reas=to", "https://www.penfed.org/login/");        // timed out page
/*** PENFED **/                                                 redirect("https://www.penfed.org/",                "https://www.penfed.org/login/");
    // username
    if(url                                                      == "https://www.penfed.org/login/"){
        let user_field = await waitFor(()=>gi("mlloginusernameinput"));
        user_field.value = getStorageValue('username');
        gi('login-user-ml-login').click();
    }
    // password
    if(url                                                      .match("online.penfed.org/PenFedOnline/Forms/Security/LogonPassword.aspx")){
        loginWhenFieldSet( await waitFor(()=>gi("ctl00_ctl00_MainContentPlaceHolder_cphSecurityMainContent_txtPassword")), gi("ctl00_ctl00_MainContentPlaceHolder_imgLogon") );
    }

/*** SAVVYMONEY **/                                             redirect("https://www.savvymoney.com/", "https://www.savvymoney.com/login");
    if(url                                                      .match("https://www.savvymoney.com/login")){
        loginWhenFieldSet(await waitFor(()=>gi("password-sign-in")), gi("login-btn") );
    }


                                                                loginPage = "https://digitalbanking.tcfbank.com/#login"
                                                                redirect('https://tcfbank.com/', loginPage);
                                                                redirect('https://www.tcfbank.com/digital-banking-session-ended', loginPage);
/*** TCF ***/                                                   redirect('https://www.tcfbank.com/digital-banking-timeout',loginPage);
    if(url                                                      .match('https://digitalbanking.tcfbank.com/#login')){
        loginWhenFieldSet( await waitFor(()=> gi('challengePassword')) , gc('btn-submit')[0]);
    }

    if( url                                                     == "https://onlinebanking.tcfbank.com/fitcf/retail/logon/mfa/challenge"){
        let  questions = setInterval(function(){
            if( gc("sc_oc_RO_form_input ")[5] === undefined) return;
            clearInterval(questions);
            let ques = gc("sc_oc_RO_form_input ")[4].innerHTML;
            let ans = gc("sc_oc_RO_form_input ")[5].children[0];
            if( ques.match('middle') )              ans.value = getStorageValue('momMiddle');
            else if( ques.match('grandmother') )    ans.value = getStorageValue('grandma');
            else                                    ans.value = getStorageValue('city');
            unsafeWindow.formbutton1.click();
        },100);
    }

                                                                loginPage = "https://www.netteller.com/login2008/Authentication/Views/Login.aspx"
                                                                redirect("https://ap.pscu.com/AP/apresources/close.html",                    loginPage); // logged out page
                                                                redirect("https://apstp.pscu.com/AP/APCardholder/?wicket:interface=:1::::#", loginPage); // error page
                                                            //    redirect("https://apstp.pscu.com/AP/APCardholder/?wicket:interface=:0::::",  loginPage); // account home page, we'll redirect if error by looking for element instead
                                                                redirect("https://apstp.pscu.com/AP/APCardholder/pages/sessiontimeout",      loginPage); // timeout page
                                                                redirect("https://apphx.pscu.com/AP/APCardholder/pages/sessiontimeout",      loginPage); // timeout page (there's 2)
/***UIECU ***/                                                  redirect("https://uoficreditunion.org/",                                     loginPage);
    if( url                                                     == loginPage ){
        await sleep(1000);
        // reload on error
        if(document.body.innerHTML.match('An Error Occurred While Processing Your Request'))
            document.location.reload();
        // submit username and submit pw, they use the same url, so run both waits asyncronously
        (async function enter_username(){
            let user_field = await waitFor(()=>gi("ctl00_PageContent_Login1_IdTextBox"));
            user_field.value = getStorageValue('username');
            unsafeWindow.ctl00_PageContent_Login1_IdSubmitButton.click();
        })();
        loginWhenFieldSet( await waitFor(()=>gi("ctl00_PageContent_Login1_PasswordTextBox")), gi("ctl00_PageContent_Login1_PasswordSubmitButton") );
    }
    if( url                                                      == "https://apstp.pscu.com/AP/APCardholder/?wicket:interface=:0::::"){
        if(gc('genericerror')[0]){
            document.location = loginPage;
         }
     }
                                                                if( url.match("netteller.com/login2008/Views/Retail/MyNetTeller.aspx"  ) ){
                                                                    unsafeWindow.ctl00_ctl26_primaryMenuInfolinkV2MenuItemLinkButton.click(); // click Visa Card
                                                                }
    if( url == 'https://www.netteller.com/login2008/Views/Retail/InfolinkV2.aspx'){
        await sleep(5000);
        window.close();   // close window left behind
    }


/*** TRENDNET ROUTER **/
    if( url                                                     .match("http://192.168.10.1/login.asp") )  {
        let user_field = await waitFor(()=>gi("UserName"));
        user_field.value = getStorageValue('username');
        gi("Passwd").value = getStorageValue('password');
        unsafeWindow.Login_s.click();
    }

    if( url                                                     .match("http://192.168.10.1/home.html") )  {
        gc("menuheader ")[0].click();
        let button = await waitFor(()=> unsafeWindow.myframe.document.getElementsByClassName('button_normal')[0])
        button.click();
        button.click();
    }


                                                                redirect("https://www.uber.com/es/ec/","https://auth.uber.com/login/?next_url=https%3A%2F%2Friders.uber.com");
/** UBER **/                                                    redirect("https://www.uber.com/","https://auth.uber.com/login/?next_url=https%3A%2F%2Friders.uber.com");
    if( url                                                     .match("https://auth.uber.com/login/") )  {
        /*      field doesnt recognize value when clicked. Neither automated or manually.
        let user_field = await waitFor(()=>gi('useridInput'));
        await sleep(5000)
        user_field.value = getStorageValue('email');
        gc("btn")[0].click();
        */
    }


/*** WALLETHUB **/                                              redirect("https://wallethub.com/", "https://wallethub.com/home/dashboard");
    if(url                                                      .match("https://wallethub.com/join/login")){
        console.log("InstantLogin: can't get it to click the submit button")
        // only works when right clicking submit button before this code. (?)
        loginWhenFieldSet( await waitFor(()=> document.querySelectorAll('[name=pw]')[0]), document.querySelectorAll('button>span')[0] );
        //await waitFor(()=> document.querySelectorAll('[name=pw]')[0]);
        //await waitFor(()=> document.querySelectorAll('[name=pw]')[0].value != '')
        // document.querySelectorAll("[name='$form']")[0].submit()
    }


















})();
