define(["app", "apps/cut/show/cut_view", "config", "apps/common/utility", "localstorage"], function (CloudMamManager, View, config, utility) {

    CloudMamManager.module("CutApp.Cut", function (Cut, CloudMamManager, Backbone, Marionette, $, _) {

        this.startWithParent = false;

        this.onStart = function () {

        };

        this.onStop = function () {

        };

        var CutController = Marionette.Controller.extend({});


        _.extend(CutController.prototype, {
            showCuts: function(options) {
                var self = Cut.Controller;


                var mainLayout = new View.CutWholeLayout(); 
                var contentLayout = new View.ContentLayout();
                var footerLayout = new View.FooterLayout(); 
                var hearderView = new View.HeaderView(); 

                var timeline = new View.TimelineView();
                var featureBarLayout = new View.FeatureBarLayout();



                
                require(['apps/common/views', 'entities/cut/activity', "entities/cut/fragment", 'SobeyVideo', "timeline", "timeCode", "timeCodeConverter"], function (CommonViews, activity, Fragment, SbVideo, TimeLine, TimeCode, TimeCodeConvert) {

                    var loadingView = new CommonViews.Loading({
                        title: "loading",
                        message: "loading data from server, pls wait a moment."
                    });
                    CloudMamManager.bodyRegion.show(loadingView);

                    //创建活动
                    if (options === 'default') {
                        var params = utility.localStorage.GetCutId();
                        require(['entities/mycloud/createClipDes'], function(CreateClipDes) {
                            var arr = new Array();
                            _.each(params.data, function(model) {
                                arr.push({ contentId: model.ContentID });
                            });

                            var model = new CreateClipDes({ entities: arr, name: params.name, description: params.desc });
                            model.sync("create", model, {
                                url: "/ac/activity",
                                contentType: 'application/json',
                                success: function(res) {
                                    //重新触发路由
                                    CloudMamManager.trigger('cut:show', res.id);
                                }
                            });

                        });
                    } else {
                        var cutfeatching = CloudMamManager.request("cut:activity", options); //id
                        $.when(cutfeatching).done(function(response) {

                            CloudMamManager.bodyRegion.show(mainLayout);
                            mainLayout.headerRegion.show(hearderView);
                            mainLayout.contentRegion.show(contentLayout);
                            mainLayout.footerRegion.show(footerLayout);

                            var featureLeftView = new View.FeatureLeftView();
                            var featureCenterView = new View.FeatureCenterView();
                            //赋予第一个视频数据
                            var featureRightView = new View.FeatureRightView({ firstmedia: response.get('entities')[0] });

                            var leftView = new View.LeftView({ model: response });

                            //加载时间线控件(播放器依赖时间线)
                            footerLayout.timelineRegion.show(timeline);
                            self.listenTo(timeline, "show", function() {
                                //中部左侧
                                contentLayout.leftRegion.show(leftView);
                            });

                            //播放器渲染完毕
                            self.listenTo(leftView, "show", function() {

                            });

                            //出入点换时码
                            _.each(response.get('sequences'), function(item) {
                                var timecode = item.outpoint - item.inpoint;
                                item.duration = TimeCodeConvert.L100Ns2Tc(timecode, 25.0);
                            });

                            //中部右侧
                            var fragmentCollection = new Fragment.Collection(response.get('sequences'));
                            var rightView = new View.RightView({ collection: fragmentCollection, activeName: response.get('name') });
                            contentLayout.rightRegion.show(rightView);

                            footerLayout.timelineRegion.show(timeline);
                            footerLayout.featureBarRegion.show(featureBarLayout);

                            featureBarLayout.leftPanelRegion.show(featureLeftView);
                            featureBarLayout.centerPanelRegion.show(featureCenterView);
                            featureBarLayout.rightPanelRegion.show(featureRightView);


                            //播放/暂停
                            self.listenTo(featureCenterView, "player:play", function(option) {
                                CloudMamManager.trigger("player:play", option);
                            });

                            //seek 上一帧 
                            self.listenTo(featureCenterView, "player:setPreFrame", function(option) {
                                CloudMamManager.trigger("player:setPreFrame", option);
                            });

                            //seek 下一帧
                            self.listenTo(featureCenterView, "player:setNextFrame", function(option) {
                                CloudMamManager.trigger("player:setNextFrame", option);
                            });

                            //播放完毕
                            self.listenTo(leftView, "player:ended", function() {
                                CloudMamManager.trigger("player:ended");
                            });

                            //设置静音
                            self.listenTo(featureCenterView, "player:muted", function(option) {
                                CloudMamManager.trigger("player:muted", option);
                            });

                            //重置播放器
                            self.listenTo(leftView, "player:reset", function() {
                                CloudMamManager.trigger("player:reset");
                            });

                            //单击播放
                            self.listenTo(leftView, "player:sgclick", function(option) {
                                CloudMamManager.trigger("player:sgclick", option);
                            });

                            //设置音量
                            self.listenTo(featureCenterView, "volume:change", function(option) {
                                CloudMamManager.trigger("volume:change", option);
                            });

                            //时码change事件
                            self.listenTo(leftView, "timecode:change", function(option) {
                                CloudMamManager.trigger("timecode:change", option);
                            });

                            //创建片段(蛋疼的传参)
                            self.listenTo(featureRightView, "create:cutlist", function(options) {
                                if (options) {
                                    var data = {
                                        activityId: options.activityId,
                                        contentId: options.contentId,
                                        inpoint: options.inoutpoint.inpoint,
                                        outpoint: options.inoutpoint.outpoint,
                                        name: options.fragementName,
                                        keyframepath: options.keyFramePath,
                                        frameRate: options.frameRate,
                                        mediaPlayAddress: options.mediaPlayAddress
                                    };
                                    var requesting = CloudMamManager.request("create:fragement", data);
                                    requesting.done(function(res) {
                                        var resp = JSON.parse(res);
                                        data.duration = TimeCodeConvert.L100Ns2Tc((data.outpoint - data.inpoint), options.frameRate); //29.97);

                                        fragmentCollection.add(data);
                                    });
                                }
                            });

                            //story播放片段自动选中
                            self.listenTo(leftView, "story:fragement:toggleSelecte", function(model) {
                                model.toggleSelected();
                            });

                            //监听片段选中
                            self.listenTo(rightView, "itemview:fragement:toggleSelecte", function(itemView) {
                                itemView.model.toggleSelected();
                            });

                            //片段重命名
                            self.listenTo(rightView, "itemview:fragement:rename", function(itemView, newName) {
                                var data = { name: newName, id: itemView.model.get("id") };
                                var requesting = CloudMamManager.request("rename:fragement", data);
                                requesting.done(function(data) {
                                    //请求成功
                                    itemView.model.set("name", newName);
                                });
                            });

                            //删除片段
                            self.listenTo(rightView, "itemview:fragement:delete", function(itemView) {
                                itemView.model.destroy();
                            });

                            //拖拽排序
                            self.listenTo(rightView, "fragment:sorted", function(ids) {
                                console.log(ids);
                                var requesting = CloudMamManager.request("sort:fragment", ids);
                                requesting.done(function() {

                                });
                            });

                            //点击播放
                            self.listenTo(rightView, "itemview:fragement:seekplay", function(itemView) {
                                CloudMamManager.trigger("fragement:seekplay", _.clone(itemView.model));
                            });

                            //剪切打点
                            self.listenTo(featureRightView, "video:cut", function(option) {
                                CloudMamManager.trigger("video:cut", option);
                            });

                            //打点更改cut区间
                            self.listenTo(leftView, "inoutpoint:change", function(option) {
                                CloudMamManager.trigger("inoutpoint:change", option);
                            });

                            //触发video选中事件
                            self.listenTo(leftView, "media:selected", function(option) {
                                CloudMamManager.trigger("media:selected", option);
                            });

                            //story播放
                            self.listenTo(rightView, "story:play", function(option) {
                                CloudMamManager.trigger("story:play", option);
                            });

                            //导出FCP
                            self.listenTo(rightView, "export:fcp", function(option) {

                                var form = document.createElement("form");
                                form.action = config.dcmpRESTfulIp + '' + "/ac/export/" + options;
                                //form.target = "_blank";
                                form.method = 'post';
                                document.body.appendChild(form);
                                var input = document.createElement("input");
                                input.type = "hidden";
                                input.name = "param";
                                input.id = "param";
                                input.value = "";
                                form.appendChild(input);
                                try {
                                    form.submit();
                                } catch (e) {
                                    alert(e);
                                }

                            });

                            //合成新素材
                            self.listenTo(rightView, "synthesis:clips", function(option) {

                                Backbone.ajax({
                                    url: config.dcmpRESTfulIp + '' + "/ac/mixture/" + options,
                                    type: 'POST',
                                    data: $.param({ name: "" }),
                                    contentType: 'application/x-www-form-urlencoded',
                                    success: function(response) {
                                        console.log('to synthesis a new clip success !');
                                    }
                                });
                                //var model = new Fragment.Model({ name: "" });
                                //model.sync("create", model, {
                                //    url: "/ac/mixture/" + options,//此参数为app传入参数
                                //    success: function (response) {
                                //        console.log('to synthesis a new clip success !');
                                //    }
                                //});
                            });

                        }).fail(function(e) {
                            console.log(e);
                        });
                    }
                });

            }
        });
        Cut.Controller = new CutController();
        Cut.Controller.listenTo(CloudMamManager.CutApp, 'stop', function () {
            Cut.Controller.close();
        });
        //Cut.Controller.onStop = function (options) {
        //    this.close();
        //};
    });
    return CloudMamManager.CutApp.Cut.Controller;
});

