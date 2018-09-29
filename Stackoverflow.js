// ==UserScript==
// @name         Stackoverflow
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://stackoverflow.com/questions*
// @grant        none
// ==/UserScript==

// Removes "topic" from stackoverflow tab title, so question will be visible instead

(function() {
    'use strict';
    document.title = document.title.replace(/(javascript|python|java|syntax|oop) - /,'')

})();
