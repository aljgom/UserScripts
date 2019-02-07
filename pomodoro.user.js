// ==UserScript==
// @name         Pomodoro
// @namespace    aljgom
// @description  At every 25, or 55 minutes in each hour, it will add a black modal with a 5 minute timer to cover all webpages
//               If the modal is clicked, it will dissapear briefly, it will also open a google keep TO-DO list
// @match        http://*/*
// @match        https://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafewindow
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

    self.beep = ()=>{
        let sound = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
        sound.play();
    }

    self.flashModal = async ()=>{
        self.modal.style.display = 'block'
        self.modal.style.opacity = 1
        for(let i = 10; i > 0; i--){
            await sleep(30);
            self.modal.style.opacity -= 0.1
        }
        self.modal.style.display = 'none';
        self.modal.style.opacity = 1;
    }

    self.startModal = async (secs)=>{
		self.modalStarted = true;
        if(document.hasFocus()){                        // beep 15 seconds before blocking page
            // self.beep(); await sleep(300); self.beep();
            // chrome is blocking automatic playing of web-audio? (needs to be user started?)
            // or refusing to load data url because of source?
            self.flashModal();
            await sleep(15*1000)
        }
        self.modal.style.display = 'block';
        setTimeout(self.stopModal, secs*1000);
        self.startTimer(secs);
        document.body.style.overflow = 'hidden';        // prevent body from scrolling
        if(document.hasFocus()) self.openTodoList();
    };

    self.stopModal = ()=>{
        self.modal.style.display ='none';
        self.modalStarted = false;
        document.body.style.overflow = self.bodyOverflow;
    }


    // check if modal should be started
    // TODO change interval to do one check, calculate remainig time, and start another interval using that
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
