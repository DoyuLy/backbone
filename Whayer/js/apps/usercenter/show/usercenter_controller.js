define(["app", "apps/common/views", "apps/usercenter/show/usercenter_view", "config", "notifierHelper", "localstorage"], function (CloudMamManager, CommonViews, View, config, notifierHelper) {

    CloudMamManager.module("UserCenterApp.UserCenter", function (UserCenter, CloudMamManager, Backbone, Marionette, $, _) {

        this.startWithParent = false;

        this.onStart = function () {

        };

        this.onStop = function () {

        };

        var UserCenterController = Marionette.Controller.extend({});


        _.extend(UserCenterController.prototype, {
            setActiveNav: function (options) {
                if (options.type) {
                    require(["entities/usercenter/leftnavList"], function () {
                        var navfetching = CloudMamManager.request("usercenter:subnav:entities");
                        $.when(navfetching).done(function (navs) {
                            var navToSelect = navs.find(function (nav) {
                                //选择资费
                                if (options.type == 'selectrate')
                                    return nav.get('router') == 'currentrate';
                                else
                                    return nav.get("router") === options.type;
                            });

                            navToSelect.select();
                            navs.trigger("reset");

                        }).fail(function (error) {
                        });
                    });

                }

            },
            showUserCenter: function (options) {
                var self = UserCenter.Controller;
                //保存当前类型
                self.typeName = options.type;

                var loadingView = new CommonViews.Loading({
                    title: "loading",
                    message: "loading data from server, pls wait a moment."
                });
                CloudMamManager.bodyRegion.show(loadingView);

                //通用数据模型
                var commonModel = Backbone.Model.extend({});

                var wholeLayout = new CommonViews.WholeLayout();
                var cloudListLayout = new CommonViews.MyCloudLayout(); //全局layout
                //头部视图
                
                var headerView = new CommonViews.UserCenterHeaderView();
                CloudMamManager.bodyRegion.show(wholeLayout);
                wholeLayout.headerRegion.show(headerView);//头部
                wholeLayout.mainRegion.show(cloudListLayout);//内容区

                var dosageLayout = new View.DosageLayout();//"用量"模板

                require(["apps/mycloud/dialog/dialog_view", "entities/usercenter/leftnavList", "entities/usercenter/usercenterModel"], function (Dialog) {
                    //数据异步获取
                    var navfetching = CloudMamManager.request("usercenter:subnav:entities", options); //获取左侧导航
                   

                    //配置模板
                    var selectTmpl= function(type) {
                        switch (type) {
                            case "detail":
                                return new View.Detail();
                                break;
                            case "changepsw":
                                return new View.ChangePsw();
                                break;
                            case "changehead":
                                return new View.ChangeHead();
                                break;
                            case "currentrate":
                                return new View.CurrentRate();
                                break;
                            case "selectrate":
                                return new View.SelectRate();
                                break;
                            case "dosage":
                                return new View.Dosage();
                            default:
                                return null;
                                break;
                        }
                    }

                    var showDosage = function() {
                        cloudListLayout.rightRegion.show(dosageLayout);
                        var importdosage = CloudMamManager.request("usercenter:dosage:import");
                        var activitydosage = CloudMamManager.request("usercenter:dosage:activity");

                        $.when(importdosage).done(function (res) {

                            var dosageTopView = new View.DosageTopView({ params: (res ? JSON.parse(res) : null) });
                            dosageLayout.TopRegion.show(dosageTopView);
                        }).fail(function (res) { });

                        $.when(activitydosage).done(function (res) {

                            var dosageBottomView = new View.DosageBottomView({ params: res ? JSON.parse(res) : null });
                            dosageLayout.BottomRegion.show(dosageBottomView);
                        }).fail(function (res) { });
                    }
                    //左侧导航
                    $.when(navfetching).done(function (navs) {

                        //保存刷新时路由上传递的类型
                        self.typeName = options.type == 'selectrate' ? '选择资费类型' : _.find(navs.models, function (item) {
                            return item.get('router') == self.typeName;
                        }).get('title');

                        var leftSubNavsView = new CommonViews.LeftSubNavs({
                            collection: navs,
                            spaceTag: false,//显示空间
                            showTitle: false //显示标题
                        });

                        cloudListLayout.leftNavRegion.show(leftSubNavsView);

                        self.listenTo(leftSubNavsView, "itemview:navigate", function (childView, model) {
                            console.log('left bar navigation');
                            var trigger = model.get("navigateTrigger");
                            var router = self.router = model.get("router");
                            //保存当前类型为局部的 全局变量
                            var typeName = self.typeName = model.get("title");

                            CloudMamManager.trigger(trigger, { type: router }); //导航

                            if (router === 'dosage')
                                showDosage();
                            else
                                cloudListLayout.rightRegion.show(selectTmpl(router));


                        });

                    }).fail(function (e) {
                        console.log(e);
                    });


                    //路由显示模板:用量需要请求数据
                    if (options.type === 'dosage') 
                        showDosage();
                    else 
                        cloudListLayout.rightRegion.show(selectTmpl(options.type));
                    
                    
                    //选择资费
                    self.listenTo(CloudMamManager, 'goto:selectrate', function (option) {
                        cloudListLayout.rightRegion.show(selectTmpl(option.type));
                        CloudMamManager.trigger('route:selectrate', { type: option.type }); //导航
                    });
                    
                    //修改个人信息
                    self.listenTo(CloudMamManager, 'update:personal:info', function (option) {
                        notifierHelper.showLoading();
                        var updating = CloudMamManager.request("update:personal:info", option);
                        $.when(updating).done(function (res) {
                            notifierHelper.closeLoading();
                        }).fail(function (res) {
                            notifierHelper.closeLoading();
                            notifierHelper.tip("修改失败!");
                        });
                    });

                    //修改密码
                    self.listenTo(CloudMamManager, 'update:password', function (option) {
                        var changepsw = CloudMamManager.request("update:password", option);
                        $.when(changepsw).done(function (res) {

                        }).fail(function (res) {

                        });
                    });
                });

            }
        });
        UserCenter.Controller = new UserCenterController();
        UserCenter.Controller.listenTo(CloudMamManager.UserCenterApp, 'stop', function () {
            UserCenter.Controller.close();
        });
    });
    return CloudMamManager.UserCenterApp.UserCenter.Controller;
});

