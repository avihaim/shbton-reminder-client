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
	
    this.findByName = function(searchKey, callback) {
        var reminders = JSON.parse(window.localStorage.getItem("reminders"));
        callLater(callback, reminders);
    }
    
    this.getReminders = function(callback) {
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

    //$.getJSON( URL + USER_ID + '/reminders', this.addReminders);
    window.localStorage.setItem("reminders", JSON.stringify(remindersTemp));
    var reminders = window.localStorage.getItem("reminders");
    if(reminders.length == 0) {
    	var request = $.ajax({
    		url : URL + USER_ID + '/reminders',
    		type : 'GET'
    	});

    	request.done(function(remindersjson) {
			alert(remindersjson);
			window.localStorage.setItem("reminders", JSON.stringify(remindersjson));
			reminders = remindersjson;
    	});
    	
    	request.fail(function() {
    		window.localStorage.setItem("reminders", JSON.stringify(remindersTemp));
    	})
    }
    
    callLater(successCallback);

}