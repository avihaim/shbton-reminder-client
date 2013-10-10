var LocalStorageStore = function(successCallback, errorCallback) {
	var USER_ID = 'user1';
	var URL = 'http://192.168.1.100:8080/shbton/users/';
	var remindersTemp = [
                     {"id": "1", "text": "dfv", "isShbat": "true", "isHoliday":"false", "isBefore": "false", "days":0, "hours":1, "minutes":15},
                     {"id": "048036b8-7076-4373-96fa-ae23dc83905c", "text": "blabla", "isShbat": "true", "isHoliday":"false", "isBefore": "false", "days":0, "hours":1, "minutes":15},
                     {"id": "4da0615f-dae8-4230-8ccf-aaa83d48e1f9", "text": "bdfs", "isShbat": "true", "isHoliday":"false", "isBefore": "false", "days":0, "hours":1, "minutes":15},
                     {"id": "3", "text": "bergrg", "isShbat": "true", "isHoliday":"false", "isBefore": "false", "days":0, "hours":1, "minutes":15},
                     {"id": "4", "text": "gjg", "isShbat": "true", "isHoliday":"false", "isBefore": "false", "days":0, "hours":1, "minutes":15}
                 ];
	var geoLocations = [ 
	                     {"locationName":"Tel-Aviv - Israel","latitude":32.0667,"longitude":34.7667,"elevation":0.0,"timeZone":"Asia/Jerusalem"},
	                     {"locationName":"Jerusalem-Israel","latitude":31.78,"longitude":35.23,"elevation":0.0,"timeZone":"Asia/Jerusalem"},
	                     {"locationName":"Herzliya - Israel","latitude":32.1658,"longitude":34.8367,"elevation":0.0,"timeZone":"Asia/Jerusalem"},
	                     {"locationName":"Netanya - Israel","latitude":32.3336,"longitude":34.8578,"elevation":0.0,"timeZone":"Asia/Jerusalem"},
	                     {"locationName":"Haifa - Israel","latitude":32.8156,"longitude":34.9892,"elevation":0.0,"timeZone":"Asia/Jerusalem"},
	                     {"locationName":"Elat - Israel","latitude":29.5611,"longitude": 34.9517,"elevation":0.0,"timeZone":"Asia/Jerusalem"},
	                     {"locationName":"Beersheba - Israel","latitude":31.2333,"longitude":34.7833,"elevation":0.0,"timeZone":"Asia/Jerusalem"},
	                     {"locationName":"Lakewood, NJ","latitude":40.096,"longitude":-74.222,"elevation":0.0,"timeZone":"America/New_York"}
	                     ];
    this.findByName = function(searchKey, callback) {
        var reminders = JSON.parse(window.localStorage.getItem("reminders"));
        callLater(callback, reminders);
    }
    
    this.getReminders = function(callback) {
    	
    	//$.getJSON( URL + USER_ID + '/reminders', this.addReminders);
    	   // window.localStorage.setItem("reminders", JSON.stringify(remindersTemp));
    	    var reminders = window.localStorage.getItem("reminders");

    	    if(reminders.length == 0) {
    	    	var request = $.ajax({
    	    		url : URL + USER_ID + '/reminders',
    	    		type : 'GET'
    	    	});

    	    	request.done(function(remindersjson) {
    				alert( JSON.parse(remindersjson));
    				window.localStorage.setItem("reminders", JSON.stringify(remindersjson));
    				reminders = remindersjson;
    	    	});
    	    	
    	    	request.fail(function() {
    	    		window.localStorage.setItem("reminders", JSON.stringify(remindersTemp));
    	    	})
    	    }
    	    
        var reminders = JSON.parse(window.localStorage.getItem("reminders"));
        callLater(callback, reminders);
    }

    this.findById = function(id, callback) {
    	var reminder = null;
    	
    	if(id == '0') {
    		reminder = {"id": "0", "text": $('.search-key').val(), "isShbat": "true", "isHoliday":"false", "isBefore": "false", "days":0, "hours":1, "minutes":15};
    	} else {
	        var reminders = JSON.parse(window.localStorage.getItem("reminders"));
	        var l = reminders.length;
	        for (var i=0; i < l; i++) {
	            if (reminders[i].id === id) {
	            	reminder = reminders[i];
	                break;
	            }
	        }
    	}
        callLater(callback, reminder);
    }

    // Used to simulate async calls. This is done to provide a consistent interface with stores (like WebSqlStore)
    // that use async data access APIs
    var callLater = function(callback, data) {
        if (callback) {
            setTimeout(function() {
                callback(data);
            });
        }
    }

    this.getGeoLocations = function(callback) {
    	var geoLocations = JSON.parse(window.localStorage.getItem("geoLocations"));
        callLater(callback, geoLocations);
    }
    
    this.findGeoByName = function(name, callback) {
    	var geoLocation = null;
    	
        var geoLocations = JSON.parse(window.localStorage.getItem("geoLocations"));
        var l = geoLocations.length;
        for (var i=0; i < l; i++) {
            if (geoLocations[i].locationName === name) {
            	geoLocation = geoLocations[i];
                break;
            }
        }
        
        callLater(callback, geoLocation);
    }


    window.localStorage.setItem("geoLocations", JSON.stringify(geoLocations));
    
    callLater(successCallback);

}