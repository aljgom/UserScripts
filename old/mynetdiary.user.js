// ==UserScript==
// @name         Mynetdiary
// @namespace    aljgom
// @author       aljgom
// @version      0.1
// @description  Adds checkboxex for each of the entered items, saves if they're checked in localStorage so they keep the state when the page is reloaded
//               Adds functionality to copy everything from the previous day
// @match        https://www.mynetdiary.com/meals.do*
// @match        http://www.mynetdiary.com/daily.do*
// @match        https://www.mynetdiary.com/daily.do*
// ==/UserScript==


/** Add checkboxes next to each food item **/

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
};

localStorageDict = function(name){ // creates a dict object, with name
  dict = localStorage.getItem(name);
  this.name = name;
  this.dict = dict === null || dict === '' ? {} : JSON.parse(dict);

  this.save = function(){ localStorage.setObject( this.name, this.dict );};
  this.set = function(key,value){
	this.dict[key]=value;
    this.save();
  };

  this.get = function(key){
	return this.dict[key];
  }  ;

  this.clear = function(){
      this.dict ={};
      this.save();
  }  ;
};


checkboxes = new localStorageDict('checkbox');




wait = setInterval(function(){         if(!fdGrdCnt_obj_table) return; clearInterval(wait);

    window.scrollTo(0,225);
    //fdGrdCnt_obj_table.children[0].children[2].style.width = "200px"
    //fdGrdCnt_obj_table.children.forEach(function(e){e.children[2].style.fontSize = "8px"})

    // clear-all checkbox
	checkbox = document.createElement('input');
	checkbox.type = "checkbox";
	checkbox.onclick = function(){
	  fdGrdCnt_obj_table.getElementsBySelector('input').forEach(function(el){
		el.checked = false;
	  });
	  checkboxes.clear();
	};
	fdGrdCnt_rowMeal1_4.insertBefore(checkbox,fdGrdCnt_rowMeal1_4.firstChild);
    // add checkboxes
	fdGrdCnt_obj_table.children.forEach(function(row){
        row.style.height = "20px";
		if(row.title != "Click on white cell and enter the value" &&
			row.title !== "" )
			{
			checkbox = document.createElement('input');
			checkbox.num = row.id.substr(12);
			checkbox.type = "checkbox";
			checkbox.id = "checkbox"+ checkbox.num;
			checkbox.style.float="left";
			checkbox.checked = checkboxes.get(checkbox.num);
			row.children[4].insertBefore(checkbox,row.children[4].firstChild);

			checkbox.onclick = function(){
				checkboxes.set(this.num,this.checked);
				console.log(localStorage.checkbox);
			};
		}
	});

},100);




// COPY FOR TOMORROW
waitFor('document.getElementById("fdGrdCnt_rowTotals_5")', 10*1000, (total)=>{
    function get(name){  // find value in get request
        var val = ( new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)') ).exec(location.search);
        if(val) return decodeURIComponent(val[1]);
    }
    tomorrow = (new Date()).toISOString().substr(0,10).replace(/-/g,'');  // format to same as in get request
    tomorrow = parseInt(tomorrow)+1;
    console.log(tomorrow,get('date'));
    if( /*get('date') == tomorrow && */total.innerHTML == "&nbsp;" ){
        if( confirm('copy from yesterday?')){
            var i = 0 ;
            jQuery('.mealActions').each(function(){
                setTimeout(()=>{this.children[0].click();},i*1000);
                i++;
            });
        }
    }
});

// REMOVE ADVICE DIV
document.getElementById("adviceForWebContainer").remove();
