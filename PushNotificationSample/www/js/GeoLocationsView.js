var GeoLocationsView = function(store) {
	var USER_ID = 'user1';
	var URL = 'http://192.168.1.100:8080/shbton/users/';
	
	this.render = function() {
	    this.el.html(GeoLocationsView.template());
	    return this;
	};
	this.addLocation = function(event) {
	    event.preventDefault();
	    console.log('addLocation');
	    navigator.geolocation.getCurrentPosition(
	        function(position) {
	        	var timezone = jstz.determine();
	
	        	var geo = "{\"locationName\":\"bla\"," +
	        			"\"latitude\":\"" +  position.coords.latitude +" \"," +
	        			"\"longitude\":\"" +  position.coords.longitude +"\"," +
	        			"\"elevation\":\"0.0\"," +
	        			"\"timeZone\":\"" +  timezone.name() +"\"}";
	        	
	        	 var request = $.ajax({
                     url: URL + USER_ID + '/geolocations',
                     type: 'post',
                     crossDomain: true,
                     async: true,
                     data: geo,
                     dataType: 'json'
                 });
	        },
	        function() {
	            alert('Error getting location');
	        });
	    return false;
	};
	
	this.getGeoLocations = function() {
	    store.getGeoLocations(function(geoLocations) {
	    	
	        $('.geoLocation-list').html(GeoLocationsView.liTemplate(geoLocations));
	        
	        if (self.iscroll) {
	            console.log('Refresh iScroll');
	            self.iscroll.refresh();
	        } else {
	            console.log('New iScroll');
	            self.iscroll = new iScroll($('.geoScroll', self.el)[0], {hScrollbar: false, vScrollbar: false });
	        }
	    });
	};
 
    this.initialize = function() {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        this.el = $('<div/>');
//        this.el.on('keyup', '.search-key', this.findByName);
        this.el.on('click', '.add-location-btn', this.addLocation);
        this.getGeoLocations();
    };
 
    this.initialize();
 
}
 
GeoLocationsView.template = Handlebars.compile($("#geoLocation-tpl").html());
GeoLocationsView.liTemplate = Handlebars.compile($("#geoLocation-li-tpl").html());