define(["app", "apps/common/views", "apps/taskmanage/show/task_view", "config", "localstorage"], function (CloudMamManager, CommonViews, View, config) {

    CloudMamManager.module("TaskManageApp.Task", function (Task, CloudMamManager, Backbone, Marionette, $, _) {

        this.startWithParent = false;

        this.onStart = function () {

        };

        this.onStop = function () {

        };

        var TaskController = Marionette.Controller.extend({});


        _.extend(TaskController.prototype, {
            setActiveNav: function (options) {
                if (options.type) {
                    require(["entities/taskmanage/leftnavList"], function () {
                        var navfetching = CloudMamManager.request("task:subnav:entities");
                        $.when(navfetching).done(function (navs) {
                            var navToSelect = navs.find(function (nav) {
                                return nav.get("router") === options.type;
                            });

                            navToSelect.select();
                            navs.trigger("reset");
                           
                        }).fail(function (error) {
                        });
                    });

                }

            },
            showTask: function (options) {
                var self = Task.Controller;
                //保存当前类型
                self.type = options.type;

                var loadingView = new CommonViews.Loading({
                    title: "loading",
                    message: "loading data from server, pls wait a moment."
                });
                CloudMamManager.bodyRegion.show(loadingView);

                
                var wholeLayout = new CommonViews.WholeLayout();
                var cloudListLayout = new CommonViews.MyCloudLayout(); //全局layout
                //头部视图
                var headerView = new CommonViews.HeaderView();
                CloudMamManager.bodyRegion.show(wholeLayout);
                wholeLayout.headerRegion.show(headerView);//头部
                wholeLayout.mainRegion.show(cloudListLayout);//内容区


                require(["apps/mycloud/dialog/dialog_view", "entities/taskmanage/leftnavList", "entities/taskmanage/taskCollection"], function(Dialog, LeftnavList) {
                    //数据异步获取
                    self.navfetching = CloudMamManager.request("task:subnav:entities", options); //获取左侧导航
                    self.taskfetching = CloudMamManager.request("task:entities", options); //获取列表数据

                    //列表视图
                    self.taskView = null;
                    self.materials = null;
                    //左侧导航
                    $.when(self.navfetching).done(function(navs) {

                        //保存刷新时路由上传递的类型
                        self.typeName = _.find(navs.models, function(item) {
                            return item.get('router') == self.type;
                        }).get('title');

                        var leftSubNavsView = new CommonViews.LeftSubNavs({
                            collection: navs,
                            spaceTag: false
                        });

                        self.listenTo(leftSubNavsView, "itemview:navigate", function(childView, model) {
                            console.log('navigation');
                            var trigger = model.get("navigateTrigger");
                            var router = model.get("router");
                            //保存当前类型为局部的 全局变量
                            var typeName = self.typeName = model.get("title");
                            self.type = router;
                           
                            //切换Tab重置变量
                            self.materials.parameters.set({ 'type': router, 'keyword': '', 'page': options.page ? options.page : 1 }, { silent: true });

                            self.taskfetching = CloudMamManager.request("task:entities", { type: router });
                            CloudMamManager.trigger(trigger, { type: router }); //导航
                            CloudMamManager.trigger("clear:query");//切换类型清空参数

                            //列表
                            $.when(self.taskfetching).done(function (materials) {
                                self.materials = materials;
                                //self.taskView.collection = self.materials;
                                self.taskView = new View.Tasks({
                                    collection: self.materials
                                });
                                var paginatedLayout = new View.PaginatedView({
                                    collection: self.materials,
                                    panelView: new View.PanelView({ type: router }),
                                    listView: self.taskView,
                                    propagatedEvents: [
                                        //"itemview:media:play",
                                        //"itemview:folder:goin",
                                        //"itemview:material:delete"
                                    ]
                                });
                                cloudListLayout.rightRegion.show(paginatedLayout);
                            });
                        });

                        cloudListLayout.leftNavRegion.show(leftSubNavsView);

                    }).fail(function(e) {
                        console.log(e);
                    }); 

                    //首次加载
                    $.when(self.taskfetching).done(function (materials) {
                        self.materials = materials;
                        //self.taskView.collection = self.materials;
                        self.taskView = new View.Tasks({
                            collection: self.materials
                        });
                        var paginatedLayout = new View.PaginatedView({
                            collection: self.materials,
                            panelView: new View.PanelView({ type: self.type }),
                            listView: self.taskView,
                            propagatedEvents: [
                                //"itemview:media:play",
                                //"itemview:folder:goin",
                                //"itemview:material:delete"
                            ]
                        });


                        cloudListLayout.rightRegion.show(paginatedLayout);
                    });

                    var showErrorDiag = function (e) {
                        var error = JSON.parse(e.responseText);
                        var errorTip = new Dialog.TooltipForm({ message: error.message, isErrorMsg: true });
                        wholeLayout.dialogRegion.show(errorTip);
                    };

                    //排序
                    self.listenTo(CloudMamManager, "change:sort", function (params) {
                        params.key == 'order' ?
                            self.materials.parameters.set({ 'order': params.value, 'type': self.type })
                            :
                            self.materials.parameters.set({ 'status': params.value, 'type': self.type });
                    });

                    //检索
                    self.listenTo(headerView, 'header:search', function (searchText) {
                        self.materials.parameters.set({ 'keyword': searchText, 'type': self.type });
                    });

                    //转码下载弹出框
                    self.listenTo(CloudMamManager, "transcode:download", function (view) {
                        var downloading = CloudMamManager.request("transcode:download", view.model);
                        $.when(downloading).done(function (response) {
                            var transFormdwnload = new Dialog.Transformdownload({ list: JSON.parse(response), isShowContinue: false });
                            wholeLayout.dialogRegion.show(transFormdwnload);
                        });
                    });
                    //转码记录删除
                    self.listenTo(CloudMamManager, "transcode:delete", function (view) {
                        var deleting = CloudMamManager.request("transcode:delete", view.model);
                        $.when(deleting).done(function (respone) {
                            //view.remove();
                            view.removeDOM();
                        });
                    });

                    //转码错误信息
                    self.listenTo(CloudMamManager, "transcode:error", function (view) {
                        var errorTip = new Dialog.TooltipForm({ message: view.model.get('errorDSP'), isErrorMsg: true });
                        wholeLayout.dialogRegion.show(errorTip);
                    });

                    //发起重新转码请求
                    self.listenTo(CloudMamManager, "transcode:retranscode", function (view) {
                        var retranscodeing = CloudMamManager.request("transcode:retranscode", view.model);
                        $.when(retranscodeing).done(function (respone) {
                            //ToDo 发起流程查询异常
                            view.model.set({ status: 0 });
                        }).fail(function (e) {
                            showErrorDiag(e);
                        });
                    });


                    //进入cut
                    self.listenTo(CloudMamManager, "cut:entercut", function (view) {
                        var id = view.model.get("id");
                        window.open('myspace.html#cut/show/' + id, '_blank');
                        //var cutsearching = CloudMamManager.request("cut:activity", view.model);
                        //$.when(cutsearching).done(function (respone) {
                        //    window.open('myspace.html#cut/show/' + id, '_blank');
                        //}).fail(function (e) {
                        //    showErrorDiag(e);
                        //});
                    });
                    //编辑cut
                    self.listenTo(CloudMamManager, "cut:editcut", function (view) {
                        var cutmodifying = CloudMamManager.request("cut:activity", view.model);
                        $.when(cutmodifying).done(function (response) {
                            var list = [], data = JSON.parse(response);
                            _.each(data.entities, function(item) {
                                list.push({ name: item.name, ContentID: item.contentId, keyFramePath: item.keyFramePath, frameRate: item.frameRate, videoFormat: item.videoFormat });
                            });


                            var cutForm = new Dialog.CutForm({ list: list, otherInfo: { name: data.name, description: data.description, id: data.id }, isModifyType: true });
                            wholeLayout.dialogRegion.show(cutForm);
                            self.listenTo(cutForm, "cut:update", function (option) {
                                //修改剪切活动
                                var cutupdateing = CloudMamManager.request("cut:update", option);
                                $.when(cutupdateing).done(function (res) {
                                    cutForm.close();
                                    view.model.set({ name: option.name });
                                });
                            });
                            self.listenTo(cutForm, "cut:delete", function (option) {
                                //删除剪切活动 
                                var cutdeleting = CloudMamManager.request("cut:delete", option);
                                $.when(cutdeleting).done(function (res) {
                                    cutForm.close();
                                    view.removeDOM();
                                });
                            });
                        }).fail(function (e) {
                            showErrorDiag(e);
                        });
                    });


                    //合成错误信息
                    self.listenTo(CloudMamManager, "synthesis:error", function (view) {
                        var errorTip = new Dialog.TooltipForm({ message: view.model.get('errorDSP'), isErrorMsg: true });
                        wholeLayout.dialogRegion.show(errorTip);
                    });

                    //合成预览
                    self.listenTo(CloudMamManager, "synthesis:review", function (view) {
                        var reviewing = CloudMamManager.request("synthesis:review", { id: view.model.get('contentId') });
                        $.when(reviewing).done(function (res) {
                            var playerForm = new Dialog.Player({ params: JSON.parse(res) });
                            wholeLayout.dialogRegion.show(playerForm);

                            //设置常用素材
                            self.listenTo(playerForm, 'set:favorite:toggle', function(option) {
                                var setfavorite = CloudMamManager.request("set:favorite:toggle", option);
                                $.when(setfavorite).done(function (ress) {
                                    //playerForm.params.set({ isFavorite: JSON.parse(ress).isFavorite });
                                    //注：由于模态插件的 this.model 问题 不能使用model 的change事件
                                    CloudMamManager.trigger('set:favorite:toggle', { isFavorite: !option.isFavorite });
                                }).fail(function (e) {
                                    showErrorDiag(e);
                                });
                            });
                        }).fail(function(e) {
                            showErrorDiag(e);
                        });
                    });
                    //合成记录删除
                    self.listenTo(CloudMamManager, "synthesis:delete", function (view) {
                        var deleting = CloudMamManager.request("synthesis:delete", { id: view.model.get('id') });
                        $.when(deleting).done(function (res) {
                            //view.remove();
                            view.removeDOM();
                        }).fail(function (e) {
                            showErrorDiag(e);
                        });
                    });
                    
                    //重新发起合成请求
                    self.listenTo(CloudMamManager, "synthesis:redo", function (view) {
                        var redoing = CloudMamManager.request("synthesis:redo", { id: view.model.get('id') });
                        $.when(redoing).done(function (res) {
                            view.model.set({ status: 0 });
                        }).fail(function (e) {
                            showErrorDiag(e);
                        });
                    });


                });

            }
        });
        Task.Controller = new TaskController();
        Task.Controller.listenTo(CloudMamManager.TaskManageApp, 'stop', function () {
            Task.Controller.close();
        });
    });
    return CloudMamManager.TaskManageApp.Task.Controller;
});

