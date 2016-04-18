define(["app"], function (CloudMamManager) {
    CloudMamManager.module("ReviewApp", function (ReviewApp, CloudMamManager, Backbone, Marionette, $, _) {
        this.startWithParent = false;
        this.onBeforeStart = function () {
            //require('utils/validateUser', function (ValidateUser) {
            //    //ToDo 加载验证模块并进行验证,否则路由到登陆页面 (若后台REST接口调用DB已做过Session判断则不需要)
            //    //ValidateUser.validate();
            //});
        };

        this.onBeforeStop = function () {
            //ToDo 释放父级module ,避免僵尸
        };

        this.onStart = function () {
            //ToDo 启动父Module
            console.log("ReviewApp has started");
        };

        this.onStop = function () {
            //ToDo 停止父级Module
            console.log("ReviewApp has stopped");
        };
    });

    CloudMamManager.module("Routers.ReviewApp", function (ReviewAppRouter, CloudMamManager, Backbone, Marionette, $, _) {

        ReviewAppRouter.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "review/show/:id": "showReview"
            }

        });

        var executeAction = function (action, options) {
            CloudMamManager.startSubApp("ReviewApp");
            action(options);
        };


        var api = {

            showReview: function (options) {
                require(["apps/clipreview/show/review_controller"], function (ReviewController) {
                    if (options)
                        executeAction(ReviewController.showReview, options);
                });
            }
        };

        this.listenTo(CloudMamManager, "review:show", function (options) {
            CloudMamManager.navigate("review/show/" + options);
            api.showReview(options);
        });

        CloudMamManager.addInitializer(function () {
            new ReviewAppRouter.Router({
                controller: api
            });
        });
    });

    return CloudMamManager.ReviewAppRouter;
});