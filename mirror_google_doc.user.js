// ==UserScript==
// @name         Mirror Google Doc
// @namespace    aljgom
// @version      0.1
// @description  Mirrors the content of the google doc in a new window. If the window is clicked the whole content is selected so it can be copied easily
// @author       aljgom
// @match        https://docs.google.com/document/d/*
// @grant        none
// ==/UserScript==

(async function(){
    // add jQuery if it doesn't exist
    if(!window.jQuery){
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = "//ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js";
        document.head.appendChild(script);
        await script.onload
    }

    if(window.newWin) newWin.close();
    clearInterval(window.copy_inter)
    newWin = window.open('','','width=700, height=700, top=1000, left =100');
    await sleep(2000) // onload won't work because it's an empty page
    newWin.document.title = 'Google Doc Mirror';
    newWin.document.body.append( tarea = newWin.document.createElement('textarea') );
    tarea.style.width = tarea.style.height = "100%";
	tarea.onclick= function(){ this.select() } // automatically select all text when textarea is clicked

    mirror_inter = setInterval(function(){
        all = '';
        $('.kix-lineview-content').each(function(){
            // add line
            $('.kix-lineview-text-block',this).each(function(){
                spaces = parseInt($(this).css('padding-left') )/6;  // calculate the number of spaces from css
                all +=  " ".repeat(spaces) + $(this).text().replace(/​/g,"").replace(/ /g,"");
	            });
            	all += "\n" ;
         })
        tarea.value = all
    },200)
})();
