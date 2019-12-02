// ==UserScript==
// @name         Focus on one task
// @namespace    aljgom
// @author       aljgom
// @description  Prompts for what is the highest priority task or enter a new one by writing 'new' in the prompt,
//               for each tab that is opened, it asks what task it is for. Re-focuses on the tabs of the most important task
// @version      0.2
// @match        http://*/*
// @match        https://*/*
// @grant        window.focus
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @noframes
// ==/UserScript==


(async function(){
    while(typeof(waitFor) === "undefined"){
        console.log('waiting for All Pages')
        await new Promise(resolve=>setInterval(resolve, 200))
    }

    let timeSince = date => Date.now() - new Date(date)
    let url = document.location.href

    if(!GM_getValue('todo')) {
        await sleep(30*1000)
        GM_setValue('todo', prompt('Focus on One: \nEnter url for to-do list'));
        return;
    }

    // Compute the edit distance between the two given strings
    function levenshteinDistance(a, b) {
      if (a.length === 0) return b.length;
      if (b.length === 0) return a.length;

      var matrix = [];

      // increment along the first column of each row
      var i;
      for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
      }

      // increment each column in the first row
      var j;
      for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
      }

      // Fill in the rest of the matrix
      for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
          if (b.charAt(i-1) == a.charAt(j-1)) {
            matrix[i][j] = matrix[i-1][j-1];
          } else {
            matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                    Math.min(matrix[i][j-1] + 1, // insertion
                                             matrix[i-1][j] + 1)); // deletion
          }
        }
      }

      return matrix[b.length][a.length];
    }

    let retypeTask = async ()=>{
        if(GM_getValue('alerted') == undefined || timeSince(GM_getValue('alerted')) > 60*1000){   // avoid alerting multiple times if script runs more than once
            GM_setValue('alerted', Date.now());
            await sleep(100)                    // wait for value to save before prompting
            let task = GM_getValue('task')
            if(['new', undefined, null].includes(task) || task.length < 2){
                promptNewTask();
            }
            else if(document.hasFocus()){
                while(true){
                    log('Focus on one: looping')
                    task = prompt("Retype highest priority task");
                    if(task == 'new'){
                        promptNewTask();
                        break
                    }
                    await sleep(100)
                    if(!task) continue;
                    if(levenshteinDistance(GM_getValue('task'), task) < task.length/4+1){   // allow some typos
                        switchWindow(task);
                        break
                    }
                    else{
                        if(confirm("Task didn't match. Retry? ('cancel' to reveal)")) continue
                        else alert(GM_getValue('task'));
                    }
                }
            }
        }
    }

    let switchWindow = task=>{
        GM_setValue('switchWindow', '');    // empty it first so change event listener triggers even if task is the same
        GM_setValue('switchWindow', task);
    }

    let promptNewTask = async ()=>{
        let task;
        while(document.hasFocus()){
            await sleep(100)
            task = prompt('Enter highest priority task')
            if(['new', undefined, null].includes(task) || task.length < 2) continue;    // can't be 'new', empty, or short
            else{
                GM_setValue('task', task);
                switchWindow(task);
                break
            }
        }
    }

    let windowTask
    let setWindowTask = async ()=>{
        let task;
        while(document.hasFocus() && !windowTask ){
            await sleep(100)
            task = prompt('Enter task for this window:')        // be careful, after runing this line, a window.focus event is trigered again
            if(['new', undefined, null].includes(task) || task.length < 2) continue;    // can't be 'new', empty, or short
            else{
                windowTask = task;
                break
            }
        }
    }

    await sleep(5*1000);
    // if the url cointains 'task=' use that as the task
    if(urlParams.get('task')) {
        windowTask = urlParams.get('task')
    }
    else{
        setWindowTask();
        addEventListener('focus', async ()=>{
            await sleep(5*1000);
            setWindowTask()
        })
    }

    if(GM_getValue('prompted') == undefined) {      // no task
        GM_setValue('prompted', Date.now());
        promptNewTask();
    }
    else if(url == GM_getValue('todo')){            // in to do list
        await sleep(30*1000)
        GM_setValue('prompted', Date.now());
        promptNewTask();
    }
    else retypeTask();

    // switch to this window if the task entered matches this window's task
    GM_addValueChangeListener('switchWindow', function(name, old_value, new_value) {
        if(new_value == '') return;
        let task = new_value;
        if(levenshteinDistance(windowTask, task) < task.length/4+1){   // allow some typos
            window.focus();
        }
    });

    setInterval(retypeTask,5*60*1000);
})();
