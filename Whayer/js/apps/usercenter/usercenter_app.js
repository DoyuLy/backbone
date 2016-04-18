define(["app"], function (CloudMamManager) {
    CloudMamManager.module("UserCenterApp", function (UserCenterApp, CloudMamManager, Backbone, Marionette, $, _) {
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
            console.log("UserCenterApp has started");
        };

        this.onStop = function () {
            //ToDo 停止父级Module
            console.log("UserCenterApp has stopped");
        };
    });

    CloudMamManager.module("Routers.UserCenterApp", function (UserCenterRouter, CloudMamManager, Backbone, Marionette, $, _) {

        UserCenterRouter.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "user/center/:type": "userCenterInit"
            }

        });

        var executeAction = function (action, options) {
            CloudMamManager.startSubApp("UserCenterApp");
            action(options);
        };


        var api = {

            userCenterInit: function (options) {
                require(["apps/usercenter/show/usercenter_controller"], function (usercenterController) {
                    options = options ? { type: options } : {};
                    options = options.type == 'default' ? { type: 'detail' } : options;
                    executeAction(usercenterController.showUserCenter, options);
                    //options = options.type == 'selectrate' ? { type: 'currentrate' } : options;
                    usercenterController.setActiveNav(options);
                });
            },
            //左侧导航(点击选中)
            leftNav: function (params) {
                require(["apps/usercenter/show/usercenter_controller"], function (usercenterController) {
                    var options = { type: params };
                    CloudMamManager.navType = options.type;//保存当前的导航type类型
                    usercenterController.setActiveNav(options);//ToDo 导航选中
                });
            }
        };
        var self = this;
        //左侧导航Action
        var leftNavTriggers = ["leftnav:detail", "leftnav:changehead", "leftnav:changepsw", "leftnav:currentrate", "leftnav:dosage"];
        _.each(leftNavTriggers, function (trigger) {
            self.listenTo(CloudMamManager, trigger, function (params) {
                CloudMamManager.navigate("user/center/" + params.type);
                api.leftNav(params.type);
            });
        });

        //选择资费
        self.listenTo(CloudMamManager, 'route:selectrate', function (params) {
            CloudMamManager.navigate("user/center/" + params.type);
            //api.leftNav('currentrate');
        });

        CloudMamManager.addInitializer(function () {
            new UserCenterRouter.Router({
                controller: api
            });
        });
    });

    return CloudMamManager.UserCenterRouter;
});