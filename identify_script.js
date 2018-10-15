// This code can be imported into any script using @require,
// helpful to add to all scripts to easily identify when a script is running in a page, and all the other pages (iframes) that trigger script runs
// Logs the script's name and the url it's running on
console.log(GM_info.script.name+"%c Script: "+document.location.toString(),'color:green');
