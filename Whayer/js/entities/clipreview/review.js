define(["app", "config"], function (CloudMamManager,config) {
    CloudMamManager.module("Review", function (Review, CloudMamManager, Backbone, Marionette, $, _) {
        Review.Review = Backbone.Model.extend({
            url: "/ac/activity/",
            parse: function (response) {
                return {
                    entities: response.entities,
                    sequences: response.sequences,
                    name: response.name,
                    description: response.description
                }
            }
        });

        var api = {
            createReview: function (params) {
                var response = Backbone.ajax({
                    url: config.dcmpRESTfulIp + "/ac/review/info",
                    type: "POST",
                    data: JSON.stringify(params),
                    contentType: 'application/json;charset=utf-8'
                });
                return response.promise();
            },
            getReview: function (params) {
                var response = Backbone.ajax({
                    url: config.dcmpRESTfulIp + "/ac/review/info/" + params,
                    type: "GET"
                });
                return response.promise();
            },
            getMedia: function (params) {
                var response = Backbone.ajax({
                    url: config.dcmpRESTfulIp + "/emc/entity/" + params,
                    type: "GET"
                });
                return response.promise();
            }
        };

        CloudMamManager.reqres.setHandler("create:review", function (params) {
            return api.createReview(params);
        });
        CloudMamManager.reqres.setHandler("get:review", function (params) {
            return api.getReview(params);
        });
        //get:media
        CloudMamManager.reqres.setHandler("get:media", function (params) {
            return api.getMedia(params);
        });
    });
    return CloudMamManager.Review.Activity;
});
