define(["app","config", "backbone.validation"], function (CloudMamManager, config) {
        //个人信息
	    var PersonalDetails = Backbone.Model.extend({
	        defaults: {

	        }
	    });
        //修改密码
	    var ChangePsw = Backbone.Model.extend({
	        defaults: {

	        }
	    });
        //当前资费
	    var CurrentRate = Backbone.Model.extend({
	        defaults: {

	        }
	    });
        //用量
	    var Dosage = Backbone.Model.extend({
	        defaults: {

	        }
	    });

	    var api = {

	        DosageImport: function (options) {
	            var response = Backbone.ajax({
	                url:  config.dcmpRESTfulIp + '/emc/usedStatistics/import',
	                type: 'GET'
	            });
	            return response.promise();
	        },
	        DosageActivity: function (options) {
	            var response = Backbone.ajax({
	                url: config.dcmpRESTfulIp + '/emc/usedStatistics/activity',
	                type: 'GET'
	            });
	            return response.promise();
	        },
	        UpdateUserInfo: function (options) {
	            var response = Backbone.ajax({
	                url: config.dcmpRESTfulIp + '/uic/userInfoDetail',
	                type: 'PUT',
	                contentType: 'application/json',
	                data: JSON.stringify(options)
	            });
	            return response.promise();
	        },
	        UpdatePassWord: function (options) {
	            var response = Backbone.ajax({
	                url: config.dcmpRESTfulIp + '/uic/changePassword',
	                type: 'PUT',
	                contentType: 'application/json',
	                data: JSON.stringify(options),
	            });
	            return response.promise();
	        }
	    };

	   
	    CloudMamManager.reqres.setHandler("usercenter:dosage:import", function (options) {
	        return api.DosageImport(options);
	    });

	    CloudMamManager.reqres.setHandler("usercenter:dosage:activity", function (options) {
	        return api.DosageActivity(options);
	    });
    
	    CloudMamManager.reqres.setHandler("update:personal:info", function (options) {
	        return api.UpdateUserInfo(options);
	    });
    
	    CloudMamManager.reqres.setHandler("update:password", function (options) {
	        return api.UpdatePassWord(options);
	    });
	});