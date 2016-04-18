define(["app", "apps/common/views", "apps/login/show/login_view", "apps/common/utility", "backbone.validation"], function (CloudMamManager, CommonViews, View, utility) {

    CloudMamManager.module("LoginApp.Login", function (Login, CloudMamManager, Backbone, Marionette, $, _) {

        this.startWithParent = false;

        this.onStart = function () {

        };

        this.onStop = function () {

        };

        var LoginController = Marionette.Controller.extend({});


        _.extend(LoginController.prototype, {
            showLogin: function (options) {

                var self = Login.Controller;
                
                var loginView = new View.LoginView();
                CloudMamManager.bodyRegion.show(loginView);

                require(["entities/login/loginModel"], function() {
                    //跳转注册
                    self.listenTo(loginView, 'user:register', function () {
                        CloudMamManager.trigger('user:register');
                    });

                    //登陆
                    self.listenTo(loginView, 'user:login', function (option) {
                        var logining = CloudMamManager.request("user:login", option);
                        $.when(logining).done(function (res) {
                            var cookie = document.cookie;
                            //本地存储
                            utility.localStorage.saveUserInfo(res.userInfo);
                            CloudMamManager.trigger('user:login');
                        }).fail(function (res) {
                            var resdata = JSON.parse(res.responseText);
                            alert(resdata.message);
                            //CloudMamManager.trigger('user:login');
                        });
                    });

                    //忘记密码
                    self.listenTo(loginView, 'user:forgetPassword', function () {
                        CloudMamManager.trigger('user:forgetPassword');
                    });
                });
            },

            showRegister: function (options) {
                var self = Login.Controller;

                var registerLayout = new View.RegisterLayout();
                var registerHeaderView = new View.RegisterHeaderView({ title: "" });    //layout




                require([""], function () {

                    CloudMamManager.bodyRegion.show(registerLayout);
                    registerLayout.headerRegion.show(registerHeaderView);


                    require(["entities/login/loginModel"], function() {
                        //获取用户注册页面的MODEL
                        var newRegister = CloudMamManager.request("register:entity:new");

                        //视图绑定数据，双向绑定
                        var registerContentView = new View.RegisterContentView({
                            model: newRegister
                        });

                        //把视图最后render到节点上
                        registerLayout.mainRegion.show(registerContentView);


                        //手机验证
                        self.listenTo(registerContentView, 'user:validateing', function(option) {
                            var validateing = CloudMamManager.request("user:validateing", option);
                            $.when(validateing).done(function(res) {
                            }).fail(function(res) {
                                var resdata = JSON.parse(res.responseText);
                                alert(resdata.message);
                            });
                        });

                        //注册
                        self.listenTo(registerContentView, 'user:registing', function(option) {
                            var registering = CloudMamManager.request("user:registing", option);
                            $.when(registering).done(function(res) {
                                //ToDo跳转显示成功
                                var resdata = JSON.parse(res);
                                if (resdata.status != "0")
                                    CloudMamManager.trigger('login:init');
                                else
                                    alert(resdata.msg);
                            }).fail(function(res) {
                                var resdata = JSON.parse(res.responseText);
                                alert(resdata.message);
                            });
                        });
                    });
                });
            },

            showForgotPsw: function (options) {
                var self = Login.Controller;

                var registerLayout = new View.RegisterLayout();
                var registerHeaderView = new View.RegisterHeaderView({ title: '找回密码' });   //layout
                var forgetFirstStep = new View.ForgetFirstStep();
                var forgetSecondStep = new View.ForgetSecondStep();
                var forgetThirdStep = new View.ForgetThirdStep();
                var forgetLastStep = new View.ForgetLastStep();

                CloudMamManager.bodyRegion.show(registerLayout);
                registerLayout.headerRegion.show(registerHeaderView);
                registerLayout.mainRegion.show(forgetFirstStep);

                self.listenTo(forgetFirstStep, "first:nextstep", function() {
                    registerLayout.mainRegion.show(forgetSecondStep);
                });

                self.listenTo(forgetSecondStep, "second:nextstep", function () {
                    registerLayout.mainRegion.show(forgetThirdStep);
                });

                self.listenTo(forgetThirdStep, "third:nextstep", function () {
                    registerLayout.mainRegion.show(forgetLastStep);
                });
            }
        });
        Login.Controller = new LoginController();
        Login.Controller.listenTo(CloudMamManager.LoginApp, 'stop', function () {
            Login.Controller.close();
        });
    });
    return CloudMamManager.LoginApp.Login.Controller;
});

