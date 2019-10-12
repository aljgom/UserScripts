<!-- 





 **DO NOT EDIT THIS FILE.** Make changes to `_readme.md`, and that will be used to create this file -->





# UserScripts
Userscripts for automating / improving browser experience


## Instalation instructions
https://tampermonkey.net/faq.php#Q100
or
https://greasyfork.org/en

Many of the scripts depend on the All Pages script, it injects some global functions that might be used by other scripts, it needs to be installed first so it runs before the other ones

Quick Preview:

<!-- Preview table will be appended at the end of the document) -->

| Name / File | Description / Match |
|---|---|
| [Old Userscripts](old/) | Older Userscripts | 
| **Airbnb** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./airbnb.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./airbnb.user.js "Download/Install")| Moves the calendar to the top of the page to be able to see availability easily<br>If you add &loadCals=1 to the url, it will load all the links in the 'rooms' array,<br>and clone their calendars into the main page to have them all in one<br>Also highlights todays date on all of them, showing green for available<br>and red for unavailable<br>if you use loadCals=2 it runs another version, in which it makes direct calls<br>to the airbnb API to get only the calendar data for the bookings,<br>and creates a visualization for all of the days <br> _Match:_ <br> ``https://www.airbnb.com/rooms/*`` |
| **Airbnb Multicalendar** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./airbnb_multicalendar.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./airbnb_multicalendar.user.js "Download/Install")| Adds guest photos to the bookings in the multicalendar<br>Changes the background color of bookings that include today\. Creates a set with all the guests for the current day <br> _Match:_ <br> ``https://www.airbnb.com/multicalendar`` |
| **All Pages** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./all_pages.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./all_pages.user.js "Download/Install")| adds global functions/variables, other scripts depend on these <br> _Match:_ <br> ``http://*/*``<br>``https://*/*`` |
| **Clipper** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./clipper.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./clipper.user.js "Download/Install")| Automate reload cash process<br>Goes through muiltiple clicks to get through the add cash forms, checkout buttons, card selection, accepting terms of service<br>Leaving only the last "Place order" click to be made <br> _Match:_ <br> ``https://*.clippercard.com/*`` |
| **Code Signals** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./code_signals.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./code_signals.user.js "Download/Install")| Run code when F5 is pressed, prevent reload, and handle how output is displayed<br>Uses waitFor function from All Pages script <br> _Match:_ <br> ``https://app.codesignal.com/*`` |
| **Ebay** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./ebay.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./ebay.user.js "Download/Install")| Modifications to pages in ebay, filtering out results, loading delivery dates for items in results page, etc <br> _Match:_ <br> ``https://www.ebay.com/sch/*``<br>``https://www.ebay.com/itm/*``<br>``https://pay.ebay.com/*`` |
| **Focus on one task** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./focus_on_one.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./focus_on_one.user.js "Download/Install")| Prompts for what is the highest priority task, every 5 minutes asks to retype it, or enter a new one by writing 'new' in the prompt <br> _Match:_ <br> ``http://*/*``<br>``https://*/*`` |
| **Gmail Reload Lost Page** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./gmail_reload_lost_page.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./gmail_reload_lost_page.user.js "Download/Install")| Reloads tabs that were opened from another gmail window and lost reference to it and now display nothing\.<br>Redirects them to a new url that works, matching the email ID<br>This could be used as a bookmarklet instead as well, just using the redirection without checking for when to run it and doing it manually as needed<br>This uses a lot of ram, since each tab reloads a whole new Gmail page instead of all referencing to one \(as expected, but keep it in mind\) <br> _Match:_ <br> ``https://mail.google.com/?ui=2&view=btop*`` |
| **Google Doc Mirror** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./google_doc_mirror.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./google_doc_mirror.user.js "Download/Install")| Mirrors the content of the google doc in a new window\. If the window is clicked the whole content is selected so it can be copied easily <br> _Match:_ <br> ``https://docs.google.com/document/d/*`` |
| **Google Keep** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./google_keep.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./google_keep.user.js "Download/Install")| Additional functionality and UI changes for Google Keep <br> _Match:_ <br> ``https://keep.google.com/*`` |
| **Google Keep Backup** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./google_keep_backup.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./google_keep_backup.user.js "Download/Install")| Deselects all products and selects Google Keep to back it up <br> _Match:_ <br> ``https://takeout.google.com/settings/takeout``<br>``https://takeout.google.com/settings/takeout/``<br>``https://bitly.com/a/warning?hash=2QQtLmu*`` |
| **Google Sheets Scroll** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./google_sheets_scroll.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./google_sheets_scroll.user.js "Download/Install")| Scroll to certain position when google sheet loads <br> _Match:_ <br> ``https://docs.google.com/spreadsheets/d/*`` |
| **HackerRank/FireIO** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./hackerrank_firecode.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./hackerrank_firecode.user.js "Download/Install")| Run code when F5 is pressed, prevent reload, and handle how output is displayed<br>Uses waitFor function from All Pages script <br> _Match:_ <br> ``https://www.hackerrank.com/*``<br>``https://www.firecode.io/problems/index`` |
| **Instant Login** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./instant_login.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./instant_login.user.js "Download/Install")| Automates login forms to log in automatically to pages\.<br>I use it in conjunction with a password manager \(LastPass\),<br>and it clicks log in buttons after LastPass fills up the required fields<br>Uses WaitFor function defined in All Pages script <br> _Match:_ <br> ``http://*/*``<br>``https://*/*`` |
| **Keep Session Alive** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./keep_session_alive.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./keep_session_alive.user.js "Download/Install")| Prevents session ending <br> _Match:_ <br> ``https://www.53.com/fifththird/html/session-timeout-warning-update.html``<br>``https://www.53.com/fifththird/html/session-timeout-warning.html``<br>``https://*.chase.com/*``<br>``https://*.discover.com/*``<br>``https://online.americanexpress.com/*``<br>``https://creditwise.capitalone.com/*``<br>``https://my.lendingtree.com/*``<br>``https://wwws.mint.com/*``<br>``https://online.penfed.org/PenFedOnline/*``<br>``https://www.quizzle.com/*``<br>``https://tcfbank.com/*``<br>``https://digitalbanking.tcfbank.com/*``<br>``https://secure.creditsesame.com/*``<br>``https://services1.capitalone.com/*``<br>``https://services2.capitalone.com/*``<br>``https://secure.bankofamerica.com/*``<br>``https://myaccounts.capitalone.com/*`` |
| **Life Countdown** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./life_countdown.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./life_countdown.user.js "Download/Install")| Adds a countdown to the bottom corner of every page, that counts down how many years, months, days, hours, minutes, seconds until a specified date<br>runs it only while the page is focused, and pauses it when it's not <br> _Match:_ <br> ``http://*/*``<br>``https://*/*`` |
| **Meetup Hide Results** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./meetup_hide_results.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./meetup_hide_results.user.js "Download/Install")| Adds an \[x\] to each search result, if clicked it will hide all meetups from that group in this and future searches <br> _Match:_ <br> ``https://www.meetup.com/find/events/*`` |
| **OneTab** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./onetab.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./onetab.user.js "Download/Install")| additions to the OneTab 'share as website' page\. Prompting for tab titles, adding buttons for opening all links, opening all automatically if url contains openAll=true <br> _Match:_ <br> ``https://www.one-tab.com/page/*`` |
| **Pomodoro** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./pomodoro.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./pomodoro.user.js "Download/Install")| At every 25, or 55 minutes in each hour, it will add a black modal with a 5 minute timer to cover all webpages<br>If the modal is clicked, it will dissapear briefly, it will also open a google keep TO\-DO list <br> _Match:_ <br> ``http://*/*``<br>``https://*/*`` |
| **Sprint reload until chat** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./sprint_reload_until_chat.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./sprint_reload_until_chat.user.js "Download/Install")| \- <br> _Match:_ <br> ``https://www.sprint.com/*`` |
| **Stackoverflow** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./stackoverflow.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./stackoverflow.user.js "Download/Install")| Remove language / topic from title so it won't be cluttered <br> _Match:_ <br> ``https://stackoverflow.com/questions*`` |
| **Temp Scripts** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./temp.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./temp.user.js "Download/Install")| Short/temporary scripts that having a separate page for each seems overkill <br> _Match:_ <br> ``http://*/*``<br>``https://*/*`` |
| **Youtube** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./youtube.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./youtube.user.js "Download/Install")| Various modifications:<br>Loop and reverse playlist<br>Autoreload on error<br>Download mp3<br>Change speed for playlist<br>Skip videos in playlist<br>Add a remote control mini window<br>Select highest resolution<br>Close 'click here' anotations<br>Get rid of recommendations<br>Add Date to fullscren title, skip videos depening on date<br>Keyboard speed control<br>Add Playlist name to Tab Title <br> _Match:_ <br> ``http://www.youtube.com/watch*``<br>``https://www.youtube.com/watch*``<br>``https://www.youtube.com/*``<br>``http://www.youtube.com/embed*``<br>``https://www.youtube.com/embed*``<br>``https://ycapi.org/*`` |
| **Youtube Continuous Play** <br> [Source Code](https://github.com/aljgom/UserScripts/blob/master/./youtube_continuous_play.user.js "Source Code") [Download/Install](https://aljgom.github.io/UserScripts/./youtube_continuous_play.user.js "Download/Install")| When playing in the background for a long time, youtube will eventually stop the video and<br>ask if we want to contininue playing\. This will click yes automatically when the dialog shows up\. <br> _Match:_ <br> ``https://www.youtube.com/watch*`` |

