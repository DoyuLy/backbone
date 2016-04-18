define(["app", "backbone.validation"],
	function (CloudMamManager) {
	    var Material = Backbone.Model.extend({
	        //defaults: {
	        //    //imgUrl: "images/manage/img_04.png",
	        //    //name: "Default Name",
	        //    //type: "Default Name"
	        //}
	    });
	    

	    var API = {

	        getMaterialEntity: function (materialId, options) {
	            options || (options = {});

	            var material = new Material({ id: materialId });

	            var defer = $.Deferred();
	            defer.then(options.success, options.error);

	            var response = material.fetch(_.omit(options, "success", "error"));
	            response.done(function () {
	                defer.resolveWith(response, [material]);
	            });

	            response.fail(function () {
	                defer.rejectWith(response, arguments);
	            });
	            
	            return defer.promise();
	        }
	    };


	    CloudMamManager.reqres.setHandler("material:entity", function (id, options) {
	        return API.getMaterialEntity(id, options);
	    });

	    CloudMamManager.reqres.setHandler("material:entity:new", function (id) {
	        return new Material();
	    });

	    return Material;
	});