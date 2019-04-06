// ==UserScript==
// @name         Life Countdown
// @author       aljgom
// @namespace    aljgom
// @description  Adds a countdown to the bottom corner of every page, that counts down how many years, months, days, hours, minutes, seconds until a specified date
//               runs it only while the page is focused, and pauses it when it's not
// @match        http://*/*
// @match        https://*/*
// ==/UserScript==


(function(){
	let lifeCountDown = document.createElement("div");
	document.body.appendChild(lifeCountDown);

	let updateCountDown = function(){
        let zeroPad = (n,zs) => String(n).padStart(zs, '0')
		let endDate = new Date("04/05/2020");
		let now = new Date();
		let diff = Math.floor((endDate - now)/1000);
        let s = zeroPad(diff % 60, 2); diff = Math.floor(diff/60);
        let m = zeroPad(diff % 60, 2); diff = Math.floor(diff/60);
		let h = zeroPad(diff % 24, 2); diff = Math.floor(diff/24);
		// let diff = zeroPad(c % 365, 3); diff = Math.floor(diff/365);
		// more elaborate calculation for days and years, because of leap years
		let next = new Date(endDate)						   // clone end date
		next.setFullYear(now.getFullYear())				       // change the year to the next occurrence of that same date
		if(now > next) next.setFullYear(next.getFullYear() + 1);
		let d = Math.floor((next-now)/(24*60*60*1000))		   // calculate the days until then
		d = zeroPad(d, 3)
		let y = endDate.getFullYear() - next.getFullYear();    // and the years from that date until the end date
		lifeCountDown.innerHTML = y+":"+d+":"+h+":"+m+":"+s;
	};

	let inter = setInterval(updateCountDown,1000);
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
