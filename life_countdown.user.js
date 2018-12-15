// ==UserScript==
// @name         Life Countdown
// @author       aljgom
// @namespace    aljgom
// @description  adds a simple countdown to the bottom corner of every page, that counts down how many years, months, days, hours, minutes, seconds until a specified date
// @match        http://*/*
// @match        https://*/*
// ==/UserScript==


(function(){
	var lifeCountDown = document.createElement("div");
	document.body.appendChild(lifeCountDown);

	var updateCountDown = function(){
		var a = new Date("04/05/2020");
		var b = new Date();
		var c = Math.floor((a - b)/1000);
		var s = c % 60;  s = s < 10 ? "0" + s : s; c = Math.floor(c/60);
		var m = c % 60;  m = m < 10 ? "0" + m : m; c = Math.floor(c/60);
		var h = c % 24;  h = h < 10 ? "0" + h : h; c = Math.floor(c/24);
		var d = c % 365; d = d < 10 ? "0" + d : d; c = Math.floor(c/365);
		var y = c;
		lifeCountDown.innerHTML = y+":"+d+":"+h+":"+m+":"+s;
	};

	var inter = setInterval(updateCountDown,1000);
	window.addEventListener("focus",function(){
		updateCountDown();
		clearInterval(inter);
		inter = setInterval(updateCountDown,1000);
	});
	window.addEventListener("blur", function(){
		clearInterval(inter);
	});

	(function styleCounter(){
		lifeCountDown.style.color = "black";
		lifeCountDown.style.background = "white";
		lifeCountDown.style.opacity = 0.5;
		lifeCountDown.style.position = "fixed";
		lifeCountDown.style.bottom = 0;
		lifeCountDown.style.right = 0;
		lifeCountDown.style.zIndex = 10000;

	})();
})();
