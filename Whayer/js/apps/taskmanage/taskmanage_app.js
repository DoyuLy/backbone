define(["app"], function (CloudMamManager) {
    CloudMamManager.module("TaskManageApp", function (TaskManageApp, CloudMamManager, Backbone, Marionette, $, _) {
        this.startWithParent = false;
        this.onBeforeStart = function () {
            //require('utils/validateUser', function (ValidateUser) {
            //    //To Do 加载验证模块并进行验证,否则路由到登陆页面 (若后台REST接口调用DB已做过Session判断则不需要)
            //    //ValidateUser.validate();
            //});
        };

        this.onBeforeStop = function () {
            //To Do 释放父级module ,避免僵尸
        };

        this.onStart = function () {
            //To Do 启动父Module
            console.log("TaskManageApp has started");
        };

        this.onStop = function () {
            //To Do 停止父级Module
            console.log("TaskManageApp has stopped");
        };
    });

    CloudMamManager.module("Routers.TaskManageApp", function (TaskManageRouter, CloudMamManager, Backbone, Marionette, $, _) {

        TaskManageRouter.Router = Marionette.AppRouter.extend({
            initialize: function (options) {
                this.route(/^task\/manage\/(\S+)$/, "manage", function (type) {
                    api.taskManage(type);
                }),
                this.route(/^task\/manage\/(\S+)\/page\!([1-9]\d?)$/, "page", function (type, number) {
                    api.taskManage(type, number);
                })
            }
        });

        var executeAction = function (action, options) {
            CloudMamManager.startSubApp("TaskManageApp");
            action(options);
        };


        var api = {

            taskManage: function (options) {
                var opt = {};
                switch (arguments.length) {
                    case 1:
                        opt.type = arguments[0] || "cut";
                        break;
                    case 2:
                        opt.type = arguments[0] || "cut";
                        opt.page = arguments[1] || 0;
                        break;
                }
                require(["apps/taskmanage/show/task_controller"], function (taskController) {
                    executeAction(taskController.showTask, opt);
                    taskController.setActiveNav(opt);
                });
            },
            //左侧导航(点击选中)
            leftNav: function (params) {
                require(["apps/taskmanage/show/task_controller"], function (taskController) {
                    var options = { type: params };
                    CloudMamManager.navType = options.type;//保存当前的导航type类型
                    taskController.setActiveNav(options);// To Do 导航选中
                });
            }
        };
        var self = this;
        //左侧导航Action
        var leftNavTriggers = ["leftnav:review", "leftnav:cut", "leftnav:transcode", "leftnav:synthesis"];
        _.each(leftNavTriggers, function (trigger) {
            self.listenTo(CloudMamManager, trigger, function (params) {
                CloudMamManager.navigate("task/manage/" + params.type);
                api.leftNav(params.type);
            });
        });

        CloudMamManager.addInitializer(function () {
            new TaskManageRouter.Router({
                controller: api
            });
        });
    });

    return CloudMamManager.TaskManageRouter;
});