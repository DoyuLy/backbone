define(["app"], function (CloudMamManager) {
    CloudMamManager.module("CutApp", function (CutApp, CloudMamManager, Backbone, Marionette, $, _) {
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
            console.log("CutApp has started");
        };

        this.onStop = function () {
            //ToDo 停止父级Module
            console.log("CutApp has stopped");
        };
    });

    CloudMamManager.module("Routers.CutApp", function (CutAppRouter, CloudMamManager, Backbone, Marionette, $, _) {

        CutAppRouter.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "cut/show/:id": "showCuts"
            }

        });

        var executeAction = function (action, options) {
            CloudMamManager.startSubApp("CutApp");
            action(options);
        };


        var api = {

            showCuts: function (options) {
                require(["apps/cut/show/cut_controller"], function (CutController) {
                    //options = options || {}; 
                    //options = new Store('_createcut').find({ id: 'createcut' }) || "";
                    if (options)
                        executeAction(CutController.showCuts, options);
                });
            }
        };

        this.listenTo(CloudMamManager, "cut:show", function (options) {
            CloudMamManager.navigate("cut/show/" + options);
            api.showCuts(options);
        });


        CloudMamManager.addInitializer(function () {
            new CutAppRouter.Router({
                controller: api
            });
        });
    });

    return CloudMamManager.CutAppRouter;
});