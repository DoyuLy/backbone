define(["app"], function (CloudMamManager) {
    CloudMamManager.module("Cut", function (Cut, CloudMamManager, Backbone, Marionette, $, _) {
        Cut.Activity = Backbone.Model.extend({
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
            getCuts: function (params) {
                var options = {};

                var cut = new Cut.Activity({ id: params, userCode: "admin" });
                cut.url += params;
                var defer = $.Deferred();
                defer.then(options.success, options.error);

                var response = cut.fetch(_.omit(options, "success", "error"));
                response.done(function () {
                    defer.resolveWith(response, [cut]);
                });

                response.fail(function () {
                    defer.rejectWith(response, arguments);
                });
                return defer.promise();

            }
        };

        CloudMamManager.reqres.setHandler("cut:activity", function (params) {
            return api.getCuts(params);
        });
    });
    return CloudMamManager.Cut.Activity;
});
