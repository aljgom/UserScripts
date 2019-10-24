## Skip the next break if there hasn't been activity
The script is set up so that it runs at every 25th and 55th minute of every hour, so in theory when working all day, in every half hour there's a 5 minute breaks
But in reality many times one has to step away from the desk to do other things, that should already count as the break, since the point of the breaks are to change activities for 5 minutes and not focus on the same one for too long of a time. Sometimes one might sit at the computer to start working on something, or return to work, at the 22nd minute of the hour, and the script forces a break after 3 minutes.

Therefore, the new behavior we want is that if the browser hasn't had activity for a while, skip the next break.

We'll do this by keeping track of every time the script is loaded on a page, or any time another page is focused.

We'll add event listeners to store the Date of this activity in the script storage, keep updating it across all windows when there's activity, and we'll check it before blocking all websites so that we don't do it if activity has just started from a period of inactivity.

We'll keep a variable pomo_skip in the script storage, when we save the pomo_skip date, we check if there's been a long period of inactivity and set pomo_skip to true, then when the next break time comes, if pomo_skip is true, it will skip it


This is the bare bones of how that would work, here we check if there's been an inactive period of more than 5 seconds, if so, we set the skip variable, and checkSkip will skip next time it's called and reset the variable

```javascript
let saveLastActive = ()=>{                      // keep track of browser activity
    let inactiveTime = Date.now() - new Date(GM_getValue('pomo_lastActive'))
    if(inactiveTime > 5*1000){
        GM_setValue('pomo_skip', true)
    }
    GM_setValue('pomo_lastActive', Date.now())
}

saveLastActive()
window.addEventListener('focus', saveLastActive)


// simulate what the check would look every half hour, but do it every second to see the behavior
let checkSkip = ()=>{
    if(GM_getValue('pomo_skip')){
        log('skip')
        GM_setValue('pomo_skip', false)
    }
    else log('run')
}
setInterval(checkSkip,1000)
```

Now the problem is that we don't want to skip the next break if the inactivity has been due to the current break. A simple solution to that is to only do the 'inactiveTime' check if we're in the 'work' cycle. The times I will use is:

long inactive time: greater than 10 minutes
set the 'skip' flag only in the inactive time has been within the last 15 minutes of each work cycle, meaning
(10 < minutes < 25) or (40 < minutes < 55)
