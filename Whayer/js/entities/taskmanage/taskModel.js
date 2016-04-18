define(["app", "backbone.validation"],
	function (CloudMamManager) {
	    var TaskMaterial = Backbone.Model.extend({
	        defaults: {
	            
	        }
	    });


	    var API = {

	        getMaterialEntity: function (materialId, options) {
	            options || (options = {});

	            var taskmaterial = new TaskMaterial({ id: materialId });

	            var defer = $.Deferred();
	            defer.then(options.success, options.error);

	            var response = taskmaterial.fetch(_.omit(options, "success", "error"));
	            response.done(function () {
	                defer.resolveWith(response, [taskmaterial]);
	            });

	            response.fail(function () {
	                defer.rejectWith(response, arguments);
	            });

	            return defer.promise();
	        }
	    };


	    CloudMamManager.reqres.setHandler("task:entity", function (id, options) {
	        return API.getMaterialEntity(id, options);
	    });

	    CloudMamManager.reqres.setHandler("task:entity:new", function (id) {
	        return new TaskMaterial();
	    });

	    return TaskMaterial;
	});