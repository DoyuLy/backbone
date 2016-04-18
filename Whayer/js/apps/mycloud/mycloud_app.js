define(["app"], function (CloudMamManager) {
    CloudMamManager.module("MyCloudApp", function(MyCloudApp, CloudMamManager, Backbone, Marionette, $, _) {
        
        this.onBeforeStart = function() {
            //require('utils/validateUser', function (ValidateUser) {
            //    //ToDo 加载验证模块并进行验证,否则路由到登陆页面 (若后台REST接口调用DB已做过Session判断则不需要)
            //    //ValidateUser.validate();
            //});
        };

        this.onBeforeStop = function() {
            //ToDo 释放父级module ,避免僵尸
        };

        this.onStart = function () {
            //ToDo 启动父Module
            console.log("MyCloudApp has started");
        };

        this.onStop = function () {
            //ToDo 停止父级Module
            console.log("MyCloudApp has stopped");
        };
    });

    CloudMamManager.module("Routers.MyCloudApp", function (MyCloudAppRouter, CloudMamManager, Backbone, Marionette, $, _) {
        
        MyCloudAppRouter.Router = Marionette.AppRouter.extend({

            initialize: function(options) {
                //#page=10, 传入回调函数 "10"
                this.route(/^nav\/(\S+)\/page\!([1-9]\d?)$/, "page", function(type,number){
                    api.showList(type,number);
                }),
                this.route(/^nav\/(\S+)\/folderCode\!(\S+)$/,"goInFolder",function(type,code){
                    api.showList(type,'',code);
                })
            },
            appRoutes: {
                "nav/:type": "showList",//导航查询
                "clouds(/filter/:params)": "showList"
            }
        });



        var executeAction = function (action, subApp, type) {
            CloudMamManager.startSubApp(subApp);
            action(type);
            CloudMamManager.execute("set:active:nav", type);
        };

        var parseParams = function (params) {
            var options = {};
            if (params && params.trim() !== '') {
                params = params.split('_');
                _.each(params, function (param) {
                    var values = param.split('-');
                    if (values[1]) {
                        if (values[0] === "page" || values[0] === "all") {
                            options[values[0]] = parseInt(values[1], 10);
                        } else {
                            options[values[0]] = values[1];
                        }
                    } else {
                        options['type'] = values[0];
                    }
                });
            }
            _.defaults(options, { page:1});
            return options;
        };

        var serializeParams = function (options) {
            options = _.pick(options, "page", "type");
            var serialize = (_.map(
                    _.filter(
                        _.pairs(options), function(pair) {
                            return pair[1];
                        }
                    ),
                    function(pair) {
                        return pair.join("-");
                    }
                )
            ).join("_");
            return serialize;
        };

        var api = {
            //页面初始化(路由)
            showList: function (type,page,folderCode) {
                var options = {};
                if (arguments.length === 1) {
                    options.type = arguments[0];
                } else if (arguments.length === 2) {
                    options.type = arguments[0] || "All";
                    options.page = arguments[1] || "1";
                } else {
                    options.type = arguments[0] || "All";
                    options.page = arguments[1] || "1";
                    options.folderCode = arguments[2] || "Dabi";
                }
                require(["apps/mycloud/list/list_controller"], function (listController) {
                    CloudMamManager.navType = options.type; //保存当前的导航type类型
                    executeAction(listController.listClouds, "MyCloudApp", options);
                    listController.setActiveNav(options);
                });
            },
            refresh: function (type) {
                var options = {};
                options.type = type;
                require(["apps/mycloud/list/list_controller"], function (listController) {
                    listController.setActiveNav(options);
                });
            }
        };

        var self = this;
        //页面初始化
        this.listenTo(CloudMamManager, 'cloudspace:init', function (options) {
            CloudMamManager.navigate("nav/All");
            api.showList("All");
        });

        //左侧导航Action
        var leftNavTriggers = ["leftnav:alllist", "leftnav:avlist", "leftnav:piclist", "leftnav:doclist", "leftnav:otherlist", "leftnav:commonlist", "leftnav:recyclelist"];
        _.each(leftNavTriggers, function(trigger) {
            self.listenTo(CloudMamManager, trigger, function (params) {
                CloudMamManager.navigate("nav/" + params.type);
                api.refresh(params.type);
            });
        });

        //创建cut(弃用)
        this.listenTo(CloudMamManager, 'create:cut', function (options) {
            var localstorage = new Store('_createcut');
            localstorage.create({ id: 'createcut', activityId: options.id, name: options.name });
            //CloudMamManager.trigger("cut:show", options.id);
        });

        //分页
        this.listenTo(CloudMamManager, "page:change", function (options) {
            if (options.criterion || options.page) {
                //CloudMamManager.navigate("clouds/filter/" + serializeParams(options));
            }
        });

        //查询
        this.listenTo(CloudMamManager, "search:filter", function (options) {
            if (options.criterion || options.page) {
                //CloudMamManager.navigate("clouds/filter/" + serializeParams(options));
            }
        });

        //sitemap
        this.listenTo(CloudMamManager, "sitemap:change", function (options) {
            var hash =  "nav/" + options.type + "/folderCode!" + options.folderCode;
            CloudMamManager.navigate(hash);
        });

        CloudMamManager.addInitializer(function () {
            new MyCloudAppRouter.Router({
                controller: api
            });
        });

    });

    return CloudMamManager.MyCloudAppRouter;
});