var LocalStorageStore = function(successCallback, errorCallback) {
	var USER_ID = 'user1';
	var URL = 'http://192.168.1.100:8080/shbton/users/';
	var reminders = [
                     {"id": 1, "text": "dfv", "isShbat": "true", "isHoliday":"false", "isBefore": "false", "days":0, "hours":1, "minutes":15},
                     {"id": 2, "text": "bla bla", "isShbat": "true", "isHoliday":"false", "isBefore": "false", "days":0, "hours":1, "minutes":15},
                     {"id": 3, "text": "bdfs", "isShbat": "true", "isHoliday":"false", "isBefore": "false", "days":0, "hours":1, "minutes":15},
                     {"id": 4, "text": "bergrg", "isShbat": "true", "isHoliday":"false", "isBefore": "false", "days":0, "hours":1, "minutes":15},
                     {"id": 5, "text": "gjg", "isShbat": "true", "isHoliday":"false", "isBefore": "false", "days":0, "hours":1, "minutes":15}
                 ];
	
    this.findByName = function(searchKey, callback) {
        var reminders = JSON.parse(window.localStorage.getItem("reminders"));
        callLater(callback, reminders);
    }
    
    this.addReminders = function( data ) {
    	alert(data);
//    	$.each( data, function( i, item ) { 
//    		//reminders.push(item);
//    		}); 
//    	}
    }

    this.findById = function(id, callback) {
        var reminders = JSON.parse(window.localStorage.getItem("reminders"));
        var reminder = null;
        var l = reminders.length;
        for (var i=0; i < l; i++) {
            if (reminders[i].id === id) {
            	reminder = reminders[i];
                break;
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

    var request = $.ajax({
        url: URL + USER_ID + '/reminders',
        type: 'get',
        crossDomain: true
    });
    
    request.done(function(data) {
    	alert(data);
    });
    
    request.fail(function( jqXHR, textStatus ) {
    	alert( "Request failed: " + textStatus );
    });
    
    //$.getJSON( URL + USER_ID + '/reminders', this.addReminders);
    	
    
    window.localStorage.setItem("reminders", JSON.stringify(reminders));

    callLater(successCallback);

}