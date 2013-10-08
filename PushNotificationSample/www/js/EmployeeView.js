var EmployeeView = function(reminder) {
	
	this.render = function() {
	    this.el.html(EmployeeView.template(reminder));
	    return this;
	};
	
	
 
    this.initialize = function() {
        this.el = $('<div/>');
    };
 
    this.initialize();
 
 }
 
EmployeeView.template = Handlebars.compile($("#reminder-tpl").html());