// ==UserScript==
// @name         Meetup Hide Results
// @namespace    aljgom
// @version      0.1
// @description  Adds an [x] to each search result, if clicked it will hide all meetups from that group in this and future searches
// @author       aljgom
// @match        https://www.meetup.com/find/events/*
// @icon         https://secure.meetupstatic.com/s/img/68780390453345256452178/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// ==/UserScript==
//

(function(){
    let links = document.querySelectorAll('.text--labelSecondary a') // selector for group name link

    function getList(){ return GM_getValue('hide_list') || [] }
    function saveList(list){ GM_setValue('hide_list', list) }

    function hideGroups(){
    let list = getList();
    for(let link of links){
        if(list.includes(link.children[0].innerHTML)){
            link.closest("li.event-listing").remove()
        }
    }
    }

    function addToHide(name){
        let list = getList();
        if(true || confirm(`Hide meetups from ${name}? \n\nThe list of groups to hide is saved in the script's storage. You can edit it there to remove entries.`)){
            list.push(name);
            saveList(list);
            hideGroups();
        }
    }

    function addHideButtons(){
        // update links variable
        links = document.querySelectorAll('.text--labelSecondary a') // selector for group name link
        // add hide buttons
        for(let link of links){
            if(link.hideButtonAdded) continue;
            let name = link.children[0].innerHTML;
            let hide_group = document.createElement('span')
            hide_group.onclick = ()=> addToHide(name)
            hide_group.innerHTML = '[x]'
            hide_group.style.cursor = 'pointer';
            link.parentElement.insertBefore(hide_group,link);
            link.hideButtonAdded = true
        }
    }
    addHideButtons();
    hideGroups();
    let hideButtonsInter = setInterval(()=>{
        addHideButtons(); hideGroups();
    }, 5000);


})();
