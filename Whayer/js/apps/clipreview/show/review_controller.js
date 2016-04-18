define(["app", "apps/clipreview/show/review_view", "config", "apps/common/utility", "localstorage"], function (CloudMamManager, View, config, utility) {

    CloudMamManager.module("ReviewApp.Review", function (Review, CloudMamManager, Backbone, Marionette, $, _) {

        this.startWithParent = false;

        this.onStart = function () {

        };

        this.onStop = function () {

        };

        var ReviewController = Marionette.Controller.extend({});


        _.extend(ReviewController.prototype, {
            showReview: function (options) {
                var self = Review.Controller;
                var commonModel = Backbone.Model.extend({});

                var mainLayout = new View.ReviewWholeLayout(); 
                var contentLayout = new View.ContentLayout();
                var footerLayout = new View.FooterLayout(); 
                var hearderView = new View.HeaderView(); 

                var timeline = new View.TimelineView();
                var featureBarLayout = new View.FeatureBarLayout();

                require(['apps/common/views',
                    'SobeyVideo', "timeline",
                    "timeCode", "timeCodeConverter",
                    "entities/clipreview/comment",
                    "entities/clipreview/review"], function (CommonViews, SbVideo, TimeLine, TimeCode, TimeCodeConvert, Comment) {

                    var loadingView = new CommonViews.Loading({
                        title: "loading",
                        message: "loading data from server, pls wait a moment."
                    });
                    CloudMamManager.bodyRegion.show(loadingView);

                    //创建活动
                    if (options === 'default') {
                        var params = utility.localStorage.GetReviewInfo();
                        var creating = CloudMamManager.request("create:review", params.data);
                        $.when(creating).done(function(res) {
                            CloudMamManager.trigger('review:show', JSON.parse(res).id);
                        }).fail(function() { alert('failed'); });
                    } else {
                        var reviewfeatching = CloudMamManager.request("get:review", options);//id
                        $.when(reviewfeatching).done(function (response) {

                            CloudMamManager.bodyRegion.show(mainLayout);
                            mainLayout.headerRegion.show(hearderView);
                            mainLayout.contentRegion.show(contentLayout);
                            mainLayout.footerRegion.show(footerLayout);

                            var featureLeftView = new View.FeatureLeftView();
                            var featureCenterView = new View.FeatureCenterView();
                            //赋予视频数据
                            var jsonr = JSON.parse(response);
                            var mediafetching = CloudMamManager.request("get:media", jsonr.contentId);
                            $.when(mediafetching).done(function (res) {
                                var jsonm = _.extend({ activityId: options }, JSON.parse(res));
                                var featureRightView = new View.FeatureRightView({ firstmedia: jsonm });
                                var leftView = new View.LeftView({ model: new commonModel(jsonm) });

                                //加载时间线控件(播放器依赖时间线)
                                footerLayout.timelineRegion.show(timeline);
                                self.listenTo(timeline, "show", function () {
                                    //中部左侧
                                    contentLayout.leftRegion.show(leftView);
                                });

                                //播放器渲染完毕
                                self.listenTo(leftView, "show", function () {

                                });

                                //中部右侧
                                var itemjson = jsonr.items;
                                _.each(itemjson, function(item) {
                                    item.pointTime = TimeCodeConvert.L100Ns2Tc(item.point, 25.0);
                                    if (item.subItems) {
                                        _.each(item.subItems, function(itemj) {
                                            itemj.pointTime = TimeCodeConvert.L100Ns2Tc(itemj.point, 25.0);
                                        });
                                    }
                                });
                                var commentCollection = new Comment.Collection(itemjson);
                                var rightView = new View.RightView({ collection: commentCollection, activeName: jsonr.name });
                                contentLayout.rightRegion.show(rightView);

                                footerLayout.timelineRegion.show(timeline);
                                footerLayout.featureBarRegion.show(featureBarLayout);

                                featureBarLayout.leftPanelRegion.show(featureLeftView);
                                featureBarLayout.centerPanelRegion.show(featureCenterView);
                                featureBarLayout.rightPanelRegion.show(featureRightView);


                                //提交主题评论
                                self.listenTo(leftView, "comment:commit", function (option) {
                                    var commiting = CloudMamManager.request("reply:commit", option);
                                    $.when(commiting).done(function (resp) {
                                        var headerUrl = utility.localStorage.GetHeaderImg();
                                        var data = JSON.parse(resp);
                                        data.pointTime = TimeCodeConvert.L100Ns2Tc(data.point, 25.0);
                                        var json = _.extend({ headerUrl: headerUrl }, data);
                                        commentCollection.add(json);
                                    });
                                });

                                //提交回复评论
                                self.listenTo(rightView, "itemview:reply:commit", function (childView, model) {
                                    var data = {
                                        activityId: childView.model.get('activityId'),
                                        point: childView.model.get('point'),
                                        canvasStream: "",
                                        content: childView.model.get('replycontent'),
                                        parentId: childView.model.get('id')
                                    };
                                    var commiting = CloudMamManager.request("reply:commit", data);
                                    $.when(commiting).done(function (resp) {
                                        var headerUrl = utility.localStorage.GetHeaderImg();
                                        resp = JSON.parse(resp);
                                        resp.pointTime = TimeCodeConvert.L100Ns2Tc(resp.point, 25.0);
                                        var json = _.extend({ headerUrl: headerUrl }, resp);

                                        childView.model

                                        var tempCol = _.clone(itemjson);
                                        _.each(tempCol, function(item) {
                                            if (item.id == data.parentId) {
                                                item.subItems.push(json);
                                            }
                                        });
                                        
                                        commentCollection.set(tempCol);
                                    });
                                });

                                //播放/暂停
                                self.listenTo(featureCenterView, "player:play", function (option) {
                                    CloudMamManager.trigger("player:play", option);
                                });

                                //seek 上一帧 
                                self.listenTo(featureCenterView, "player:setPreFrame", function (option) {
                                    CloudMamManager.trigger("player:setPreFrame", option);
                                });

                                //seek 下一帧
                                self.listenTo(featureCenterView, "player:setNextFrame", function (option) {
                                    CloudMamManager.trigger("player:setNextFrame", option);
                                });

                                //播放完毕
                                self.listenTo(leftView, "player:ended", function () {
                                    CloudMamManager.trigger("player:ended");
                                });

                                //设置静音
                                self.listenTo(featureCenterView, "player:muted", function (option) {
                                    CloudMamManager.trigger("player:muted", option);
                                });

                                //重置播放器
                                self.listenTo(leftView, "player:reset", function () {
                                    CloudMamManager.trigger("player:reset");
                                });

                                //单击播放
                                self.listenTo(leftView, "player:sgclick", function (option) {
                                    CloudMamManager.trigger("player:sgclick", option);
                                });

                                //设置音量
                                self.listenTo(featureCenterView, "volume:change", function (option) {
                                    CloudMamManager.trigger("volume:change", option);
                                });

                                //时码change事件
                                self.listenTo(leftView, "timecode:change", function (option) {
                                    CloudMamManager.trigger("timecode:change", option);
                                });



                                //点击播放
                                self.listenTo(rightView, "itemview:fragement:seekplay", function (itemView) {
                                    CloudMamManager.trigger("fragement:seekplay", _.clone(itemView.model));
                                });

                                //剪切打点
                                self.listenTo(featureRightView, "video:cut", function (option) {
                                    CloudMamManager.trigger("video:cut", option);
                                });

                                //打点更改cut区间
                                self.listenTo(leftView, "inoutpoint:change", function (option) {
                                    CloudMamManager.trigger("inoutpoint:change", option);
                                });

                                //触发video选中事件
                                self.listenTo(leftView, "media:selected", function (option) {
                                    CloudMamManager.trigger("media:selected", option);
                                });
                            });
                        }).fail(function (e) {
                            console.log(e);
                        });
                    }
                });

            }
        });
        Review.Controller = new ReviewController();
        Review.Controller.listenTo(CloudMamManager.ReviewApp, 'stop', function () {
            Review.Controller.close();
        });
        //Review.Controller.onStop = function (options) {
        //    this.close();
        //};
    });
    return CloudMamManager.ReviewApp.Review.Controller;
});

