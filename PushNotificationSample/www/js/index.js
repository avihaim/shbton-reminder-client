/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var URL = '';
var USER_ID = 'user1';
var app = {

	slidePage : function(page) {

		var currentPageDest, self = this;

		// If there is no current page (app just started) -> No transition:
		// Position new page in the view port
		if (!this.currentPage) {
			$(page.el).attr('class', 'page stage-center');
			$('body').append(page.el);
			this.currentPage = page;
			return;
		}

		// Cleaning up: remove old pages that were moved out of the viewport
		$('.stage-right, .stage-left').not('.homePage').remove();

		if (page === app.homePage) {
			// Forward transition (slide from right)
			$(page.el).attr('class', 'page stage-right');
			currentPageDest = "stage-left";
		} else {
			// Always apply a Back transition (slide from left) when we go back
			// to the search page
			$(page.el).attr('class', 'page stage-left');
			currentPageDest = "stage-right";
		}

		$('body').append(page.el);

		// Wait until the new page has been added to the DOM...
		setTimeout(function() {
			// Slide out the current page: If new page slides from the right ->
			// slide current page to the left, and vice versa
			$(self.currentPage.el).attr('class',
					'page transition ' + currentPageDest);
			// Slide in the new page
			$(page.el).attr('class', 'page stage-center transition');
			self.currentPage = page;
		});

	},
	showAlert : function(message, title) {
		if (navigator.notification) {
			navigator.notification.alert(message, null, title, 'OK');
		} else {
			alert(title ? (title + ": " + message) : message);
		}
	},
	registerEvents : function() {
		$(window).on('hashchange', $.proxy(this.route, this));
		$('body').on('mousedown', 'a', function(event) {
			$(event.target).addClass('tappable-active');
		});
		$('body').on('mouseup', 'a', function(event) {
			$(event.target).removeClass('tappable-active');
		});
	},

	route : function() {
		var self = this;
		var hash = window.location.hash;
		if (!hash) {
			if (this.homePage) {
				this.slidePage(this.homePage);
			} else {
				this.homePage = new HomeView(this.store).render();
				this.slidePage(this.homePage);
			}
			
			
			return;
		}
		
		if(hash.match(this.getCandleLighting)) {
			this.slidePage(new CandleLightingView());
		} else if(hash.match(this.getGeoLocationURL)) {
			this.slidePage(this.homePage);
			var match = hash.split("\/")[1];
			
			this.store.findGeoByName(match, function(geoLocation) {
				var userId = window.localStorage.getItem("userId");
				var geo = "{\"locationName\":\"" +  geoLocation.locationName +"\"," +
    			"\"latitude\":\"" +  geoLocation.latitude +" \"," +
    			"\"longitude\":\"" +  geoLocation.longitude +"\"," +
    			"\"elevation\":\"" +  geoLocation.elevation +"\"," +
    			"\"timeZone\":\"" +  geoLocation.timeZone +"\"}";
    	
		    	 var request = $.ajax({
		             url: URL + userId + '/geolocations',
		             type: 'post',
		             crossDomain: true,
		             async: true,
		             data: geo,
		             dataType: 'json'
		         });
			});
			
		} else if(hash.match(this.geoURL)) {
			self.slidePage(new GeoLocationsView(this.store).render());
		} else {
			var match = hash.split("\/")[1]; // hash.match(this.detailsURL);
			if (match) {
				this.store.findById(match, function(reminder) {
					self.slidePage(new EmployeeView(reminder).render());

					$('.save').bind(
							"click",
							function() {
								
								var userId = window.localStorage.getItem("userId");
								
								var reminder = "{\"id\": \"" + $('#eventIs').val() + "\"," 
										+ "\"text\":\"" + $('#text').val() + "\","
										+ "\"isShbat\": \"true\","
										+ "\"isHoliday\":\"false\", "
										+ "\"isBefore\": \"true\"," + "\"days\":\""
										+ $('#days').val() + "\", "
										+ "\"hours\":\"" + $('#hours').val()
										+ "\"," + "\"minutes\":\""
										+ $('#minutes').val() + "\"}";

								var request = $.ajax({
									url : URL + userId + '/reminders',
									type : 'post',
									crossDomain : true,
									async : true,
									data : reminder,
									dataType : 'json'
								});
								//	                    
							});

				});
			}
		}
		
		
		
	},
	// Application Constructor
	initialize : function() {
		
		this.store = new LocalStorageStore(function() {
			self.route();
		});
		USER_ID = this.store.getUserId();
		
		this.bindEvents();
		var self = this;
		this.geoURL = /^#geo/;
		this.getGeoLocationURL = /^#getGeoLocation/;
		this.getCandleLighting = /^#candleLighting/;
		this.registerEvents();
		
		
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents : function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicity call 'app.receivedEvent(...);'
	onDeviceReady : function() {
		app.receivedEvent('deviceready');
	},
	// Update DOM on a Received Event
	receivedEvent : function(id) {
		var parentElement = document.getElementById(id);
		var listeningElement = parentElement.querySelector('.listening');
		var receivedElement = parentElement.querySelector('.received');

		listeningElement.setAttribute('style', 'display:none;');
		receivedElement.setAttribute('style', 'display:block;');
		//console.log('Received Event: ' + id);

		var regid = window.localStorage.getItem("notificationId");
		var userId = window.localStorage.getItem("userId");

		// if(regid == '') {
		alert(window.plugins.pushNotification);
		var pushNotification = window.plugins.pushNotification;
		alert("receivedEvent 3");

		if (device.platform == 'android' || device.platform == 'Android') {
			alert("Register called");
			pushNotification.register(this.successHandler, this.errorHandler, {
				"senderID" : "346033639851",
				"ecb" : "app.onNotificationGCM"
			});
		} else {
			// alert("Register called");
			pushNotification.register(this.successHandler, this.errorHandler, {
				"badge" : "true",
				"sound" : "true",
				"alert" : "true",
				"ecb" : "app.onNotificationAPN"
			});
		}
		// }
	},
	// result contains any message sent from the plugin call
	successHandler : function(result) {
		// alert('Callback Success! Result = '+result)
	},
	errorHandler : function(error) {
		alert(error);
	},
	onNotificationGCM : function(e) {
		switch (e.event) {
		case 'registered':
			if (e.regid.length > 0) {
				console.log("Regid " + e.regid);
				alert('registration id = '+e.regid);
				var userId = window.localStorage.getItem("userId");

				request = $.ajax({
					url : URL + userId + '/notifications',
					type : 'POST',
					async : true,
					data : e.regid
				});

				request.fail(function(jqXHR, textStatus) {
					alert("Request failed: " + textStatus);
				});

				request.done(function() {
					window.localStorage.setItem("notificationId", e.regid);
				});

			}
			break;

		case 'message':
			// this is the actual push notification. its format depends on the
			// data model from the push server
			alert('message = ' + e.message + ' msgcnt = ' + e.msgcnt);
			break;

		case 'error':
			alert('GCM error = ' + e.msg);
			break;

		default:
			alert('An unknown GCM event has occurred');
			break;
		}
	},
	onNotificationAPN : function(event) {
		var pushNotification = window.plugins.pushNotification;
		alert("Running in JS - onNotificationAPN - Received a notification! "
				+ event.alert);

		if (event.alert) {
			navigator.notification.alert(event.alert);
		}
		if (event.badge) {
			pushNotification.setApplicationIconBadgeNumber(this.successHandler,
					this.errorHandler, event.badge);
		}
		if (event.sound) {
			var snd = new Media(event.sound);
			snd.play();
		}
	}
};

$(document).ready(

function() {
	window.localStorage.setItem("url", 'http://192.168.1.100:8080/shbton/users/');
	URL = window.localStorage.getItem("url");
	app.initialize();
});
