// ==UserScript==
// @name       Pomodoro
// @namespace  aljgom
// @description  At every 25, or 55 minutes in each hour, it will add a black modal with a 5 minute timer to cover all webpages
//               If the modal is clicked, it will dissapear briefly, it will also open a google keep TO-DO list
// @match      http://*/*
// @match      https://*/*
// @grant      GM_setValue
// @grant      GM_getValue
// @grant      GM_deleteValue
// @grant      unsafewindow
// ==/UserScript==

function Pomo(){
    var url = document.location.href;
    if(document.getElementById('pomo_modal')) return;
    /* Whitelist */
    // URL patterns can be also be added in the 'whitelist' array in the Script Storage tab
    // if matched, the script won't run on it
    if(GM_getValue('pomo_whitelist') === undefined) GM_setValue('pomo_whitelist', [])
    else{
        for(let pattern of GM_getValue('pomo_whitelist')){
            if(url.match(pattern)) return
        }
    }

	var self = this;
	self.modalStarted = false;
    self.bodyOverflow = document.body.style.overflow// === undefined ? 'initial' : document.body.style.overflow;    // to restore scrolling to original value
    // interval to reinsert if removed manually
    self.insertModal = ()=>{
        if(unsafeWindow.pomo_modal) return;
        self.modal = document.createElement('div');
        self.modal.id = 'pomo_modal';
        document.body.appendChild(self.modal );

        self.timer = document.createElement('div');
        self.timer.id = 'pomo_timer';
        self.modal.appendChild(self.timer);

        Object.assign(self.modal.style,{
            display: 'none',
            position: 'fixed',
            zIndex:1000,
            left:0,
            top:0,
            width: '100%',
            height: '100%',
            backgroundColor: 'black'
        });
        Object.assign(self.timer.style,{
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            top: '50%',
            transform: 'translateY(-50%)'
        });


        self.modal.onclick = async function(){      // hide modal for a moment if work is important
            self.openTodoList();
            await sleep(2000);
            var val = parseInt( prompt('Rate how critical current activity is 1-5') );
            while(isNaN(val) || val< 1 || val > 5) val = parseInt( prompt('Rate how critical current activity is 1-5') );
            self.modal.style.display = 'none';
            await sleep(val*1000);
            if(self.modalStarted){
                self.modal.style.display ='block';
            }
        }
    };
    setInterval(self.insertModal,5000);
    self.insertModal();

    // open to do list in a new tab. If the window already exist just focus to it
    self.openTodoList = function(){
        if(!GM_getValue('pomo_todo')) GM_setValue('pomo_todo', prompt('Pomo Script: enter to-do list url'))
        var todo = GM_getValue('pomo_todo');
        if(url == todo || url.match("accounts.google.com/signin")) return;
        if(self.nw) self.nw.focus();
        else self.nw = open(todo)
    }



    self.startTimer = function(secs){
        var inter = setInterval((function f(){
            secs -= 1;
            var minutes = parseInt(secs / 60, 10)
            var seconds = parseInt(secs % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            self.timer.innerHTML = minutes + ":" + seconds;
            return f;
        })(),1000);
        setTimeout(clearInterval, secs*1000, inter);
    }

    self.startModal = (secs)=>{
		self.modalStarted = true;
        self.modal.style.display = 'block';
        setTimeout(self.stopModal, secs*1000);
        self.startTimer(secs);
        document.body.style.overflow = 'hidden'; // prevent body from scrolling
        if(document.hasFocus()) self.openTodoList();
    };

    self.stopModal = ()=>{
        self.modal.style.display ='none';
        self.modalStarted = false;
        document.body.style.overflow = self.bodyOverflow;
    }

    // check if modal should be started
    setInterval(()=>{
        if(self.modalStarted) return;
        var curr_mins = new Date().getMinutes();
        var curr_secs = new Date().getSeconds()

        // calculate seconds until :30 or :00
        var secs = (30 - curr_mins %30 - 1)*60 + (60 - curr_secs );
        if(secs <= 5*60) self.startModal(secs);
    },1000);
}


new Pomo();
