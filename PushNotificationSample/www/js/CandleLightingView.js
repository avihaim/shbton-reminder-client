var CandleLightingView = function() {
	
	this.render = function() {
	    this.el.html(CandleLightingView.template());
	    return this;
	};	
	this.getCandleLighting = function() {
		
		var USER_ID = window.localStorage.getItem("userId");
    	var URL = window.localStorage.getItem("url");
    	
		var request = $.ajax({
    		url : URL + USER_ID + '/candlelighting',
    		type : 'GET'
    	});

    	request.done(function(candleLightingTime) {
    		$('.candleLightingTime').html(CandleLightingView.timeTemplate(JSON.parse(candleLightingTime)));
    	});
    	
    	request.fail(function() {
    		//$('.candleLightingTime').html(CandleLightingView.timeTemplate("error"));
    	}) 

	};
 
    this.initialize = function() {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div/>');
        this.getCandleLighting();
    };
 
    this.initialize();
 
}
 
CandleLightingView.template = Handlebars.compile($("#candleLighting-tpl").html());
CandleLightingView.timeTemplate = Handlebars.compile($("#candleLighting-time-tpl").html());