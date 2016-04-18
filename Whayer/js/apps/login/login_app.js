define(["app"], function (CloudMamManager) {
    CloudMamManager.module("LoginApp", function (LoginApp, CloudMamManager, Backbone, Marionette, $, _) {
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
            console.log("LoginApp has started");
        };

        this.onStop = function () {
            //ToDo 停止父级Module
            console.log("LoginApp has stopped");
        };
    });

    CloudMamManager.module("Routers.LoginApp", function (LoginAppRouter, CloudMamManager, Backbone, Marionette, $, _) {

        LoginAppRouter.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "user/login": "login",
                "user/register": "register",
                "user/forget": "forgotPsw"
            }

        });

        var executeAction = function (action, options) {
            CloudMamManager.startSubApp("LoginApp");
            action(options);
        };


        var api = {

            login: function (options) {
                require(["apps/login/show/login_controller"], function (LoginController) {
                    executeAction(LoginController.showLogin, options);
                });
            },
            register: function (options) {
                require(["apps/login/show/login_controller"], function (LoginController) {
                    executeAction(LoginController.showRegister, options);
                });
            },
            forgotPsw: function (options) {
                require(["apps/login/show/login_controller"], function (LoginController) {
                    executeAction(LoginController.showForgotPsw, options);
                });
            }
        };

        //登陆初始化
        this.listenTo(CloudMamManager, "login:init", function (options) {
            CloudMamManager.navigate("user/login");
            api.login();
        });

        //登陆事件
        this.listenTo(CloudMamManager, "user:login", function (options) {
            CloudMamManager.trigger("cloudspace:init");
        });

        //注册路由
        this.listenTo(CloudMamManager, "user:register", function (options) {
            CloudMamManager.navigate("user/register");
            api.register();
        });

        //找回密码路由
        this.listenTo(CloudMamManager, "user:forgetPassword", function (options) {
            CloudMamManager.navigate("user/forget");
            api.forgotPsw();
        });

        CloudMamManager.addInitializer(function () {
            new LoginAppRouter.Router({
                controller: api
            });
        });
    });

    return CloudMamManager.LoginAppRouter;
});