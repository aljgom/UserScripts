
//alert('hdfai')

/*
GM_getValue = allPageWindow.GM_getValue;
GM_setValue = allPageWindow.GM_setValue;
GM_deleteValue = allPageWindow.GM_deleteValue;
GM_listValues = allPageWindow.GM_listValues;

function it(testString, test){
	if(testString == '') return;
	try{
		let result = test();
    }
	catch(err){
		log(err)
	}
	unfake();
	log(`%c${result?'Pass':'Fail'}%c  it ${testString}`,'color:white;background:'+(result?'lime':'red'), 'color:black');
}


function unit_test(func,tests){
	console.log('%cTesting '+func.name,'color:blue');
	tests(func);
	unfake();
}


var faked = {}
function unfake(){
	for( var name in faked ){
		window[name] = faked[name];
	}
	faked = {}
}

function fake(name,...args){		// return one value each time it's called
	if( !(name in faked) ) faked[name] = window[name];
	window[name] = function f(){
        f.i = (f.i || 0) + 1;
        return args[Math.min(f.i-1, args.length-1)]  // return each of the passed values, repeat the last one indefinitely
    }
}


unit_test(pomo,pomo=>{
    it(`saves pomo_critical value if doesn't exist`,()=>{
        GM_deleteValue('pomo_critical');
		fake('requestValue',3)
        pomo();
        return GM_getValue('pomo_critical') == 3
    });

    it(`replaces pomo_critical if it exists`,()=>{
        GM_setValue('pomo_critical', 1);
		fake('requestValue',2)
        pomo();
		return GM_getValue('pomo_critical') == 2;
    });

    it(``,()=>{});
    it(``,()=>{});
})

function pomo(){
        if(GM_getValue('pomo_critical')){
			//log(GM_getValue('pomo_critical'))
        }
        GM_setValue('pomo_critical', requestValue());
        //this.style.display = 'none';
        //setTimeout(()=>{this.style.display ='block';},2000);
}

unit_test(requestValue,requestValue=>{
	it(`returns values only between 1 and 5`,()=>{
		fake('prompt','fasdg',-2,0,9,8,7,6,6,1,2)
		return requestValue() == 1
	});
})
function requestValue(){
	var val =  prompt('Rate how critical current activity is 1-5');
	return (val > 0 && val < 6)? val : requestValue();
}



*/
