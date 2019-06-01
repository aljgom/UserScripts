// ==UserScript==
// @name         Focus on one task
// @namespace    aljgom
// @author       aljgom
// @description  Prompts for what is the highest priority task, every 5 minutes asks to retype it, or enter a new one by writing 'new' in the prompt
// @version      0.1
// @match        http://*/*
// @match        https://*/*
// @grant        GM_setValue
// @grant        GM_getValue
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
            else{
                while(document.hasFocus()){
                    task = prompt("Retype highest priority task: " + GM_getValue('task'));
                    if(task == 'new'){
                        promptNewTask();
                        break
                    }
                    if(!task) continue;
                    if(levenshteinDistance(GM_getValue('task'), task) <= 2) break    // allow some typos
                    await sleep(100)
                }
            }
        }
    }

    let promptNewTask = async ()=>{
        let task;
        while(document.hasFocus()){
            task = prompt('Enter highest priority task')
            await sleep(100)
            if(['new', undefined, null].includes(task) || task.length < 2) continue;
            else{
                GM_setValue('task', task);
                break
            }
        }
    }


    if(GM_getValue('prompted') == undefined) {      // no task
        await sleep(5*1000)
        GM_setValue('prompted', Date.now());
        promptNewTask();
    }
    else if(url == GM_getValue('todo')){            // in to do list
        await sleep(30*1000)
        GM_setValue('prompted', Date.now());
        promptNewTask();
    }
    else retypeTask();

    setInterval(retypeTask,5*60*1000);
})();
