// ==UserScript==
// @name         Ebay
// @namespace    aljgom
// @version      0.1
// @description  Modifications to pages in ebay, filtering out results, loading delivery dates for items in results page, etc
// @author       aljgom
// @match        https://www.ebay.com/sch/*
// @match        https://www.ebay.com/itm/*
// @match        https://pay.ebay.com/*
// ==/UserScript==

    /* I use this code also to run it in my phone's browser. I copy it and save it as a bookmarklet and run it manually on the phone when desired.
        Bookmarklets can't use // for comments.
    */
    /* USE THESE TYPE OF COMENTS, AND COPY TO MOBILE BOOKMARKLET */


var url = document.location.toString();
if(url.match( 'https://www.ebay.com/sch/')){
  (function() {
    print = ()=>{console.log(...arguments);};
    /* copy page num bar to the top of search results too */
    mainContent.insertBefore(mainContent.lastElementChild.cloneNode(true),mainContent.firstChild);


    /* HIDE PRICE RANGES */
    /* Hide search results that have a price range instead of just one price, and add a button to 'Show All' of the results  */

    /* USING OLD NOW. NEW -now using checkViewed function from below */
    /* START OLD */
    $(".s-item").each(function(){
        let price = $(".s-item__price", $(this))[0];
        if(price.innerText.match('to')) $(this).css("display","none");
    });

    /* END OLD */
    $('body').append('<input type="button" value="Show All" id="showAllButton"> ');

    $("#showAllButton").addClass("btn").css({position:"fixed",top:"534px",right:0, "font-size":"11px"});
    showAllButton.onclick = ()=>{  $(".s-item").css("display","initial"); };

    /* SHOW DELIVERY DATES */
    /* Create a button that when clicked will load the estimated delivery dates of each of the search results, when they come into view */
    function isScrolledIntoView(elem)
    {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom+$(elem).height()) && (elemTop >= docViewTop-$(elem).height()));    /* partially */
        /* return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));  // fully  */
    }


    function checkViewed(){
      $(".s-item").each((i,e)=>{
        if( !e.viewed && isScrolledIntoView(e) ) {  /* run function first time el in view */
          e.viewed = true;
          loadDates(i,e);    /* inserting hide price ranges into this function now as well.. */
        }
      });
    }

    /* return red if the delivery date is over 40 days from now, or green if it's less */
    function getDateColor(deliveryDate){
        var d = deliveryDate.match(/- (.*)/);
        if(!d) return "#dd1e31";      /* hack: red, input is 'no date range, so no match */
        d = new Date(d[1]);
        d.setFullYear((new Date()).getFullYear());
        if(d < Date.now()) d.setFullYear(d.getFullYear() +1);
        var max = Math.ceil( (d - Date.now() )/(1000*3600*24) );
        if(max < 40) return "rgb(119, 226, 86)";
        else return "#dd1e31";
    }

    function loadDates(i,e){
      $.ajax($(".s-item__link",e)[0].href).done((data)=>{
        console.log('%cLoaded result..' ,'color:orange');
        try{ /* Traceback isn't printed for errors here. Log better? */
            var deliveryDate = $(".vi-acc-del-range",data)[0];
            if(deliveryDate){
                  deliveryDate = deliveryDate.children[0].innerHTML.replace(/.*?\. /,'').replace(/and.*?\./,"-");
            }else deliveryDate = 'no date range';

            var newEl = $("<span>").html( deliveryDate ).css({
                "font-style": "initial",
                "font-weight": "initial",
                zoom: 0.7,
                float: "right",
                color: getDateColor(deliveryDate),
            });
            $(".amt",e).first().append(newEl);

            /* NEW: HIDE PRICE RANGES */
            var  prices = data.match(/"price":"(.*?)"/g);
            if( !prices.reduce(function(a, b){ return (a === b) ? a : NaN; }) ){  /* not all the same */
                $(e).css("display","none");
            }
        }catch(err){
            console.log('Error in ajax callback for', $(".s-item__link",e)[0].href);
            console.log(err.message);
            $(e).css("background","#ffcccc");
        }
      });
    }
    /* OLD */
    $('body').append('<input type="button" value="Load Dates" id="datesButton"> ');
    $("#datesButton").addClass("btn").css({position:"fixed",top:"500px",right:0, "font-size":"11px"});

    datesButton.onclick = ()=>{  checkViewed(); $(document).scroll(checkViewed);   };
    /* END OLD */
    /* setInterval(checkViewed,2000); $(document).scroll(checkViewed); NEW */





  })();
}

if(url.match('https://pay.ebay.com/')){
    /* OPEN EBAY GOOGLE SHEET WHEN BUYING */
    /* Open this google sheet when reaching the confirmation page to write down the delivery time of the item
        to keep track of the average time it takes for items to arrive from China*/
    if(document.location.toString().match("pay.ebay.com/rxo\\?action=view")){
        let docUrl = "https://docs.google.com/spreadsheets/d/16XVRVGTnYIJQfheERqwhoaIMtqKCRCotPF7GyKn0i3A/edit#gid=0";
        let features = 'width=960, height=1030, top=0, left=0';                // open it as a popup
        let nw = window.open(docUrl,'', features);
        open().close();                                                         // brings opener window back to focus
    }
}

/* print price list in the console */
/* print all of the prices for items that have selection dropdowns for different options */
if(url.match( 'https://www.ebay.com/itm/')) {
  (function() {
    var data = document.body.innerHTML;
    var itmVarModel = data.match(/"itmVarModel":(.*),"supressQty/);
    itmVarModel = JSON.parse(itmVarModel[1]);
    var menuItemMap = itmVarModel.menuItemMap
    var prices = (ids)=>{
        var s = new Set();
        ids.forEach((id)=>{s.add(itmVarModel.itemVariationsMap[id].convertedPrice)})
        return [...s].sort();
    }
    prices(menuItemMap[0].matchingVariationIds)

    var p = Object.keys(menuItemMap).map( key => {
        var name = menuItemMap[key].valueName;
        return [name, prices(menuItemMap[key].matchingVariationIds) ]
    })

    p.forEach((e)=>console.log('%c'+e[0] + '%c'+e[1].toString(),'color:blue','color:black'))


  })();
}
