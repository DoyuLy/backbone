define(["handlebars"], function (Handlebars) {

	Handlebars.registerHelper("compare",function(v1,v2,options){
		if(v1 > v2 ){
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper("equal", function (v1, v2, options) {
	    if (v1 == v2) {
	        return options.fn(this);
	    } else {
	        return options.inverse(this);
	    }
	});

});