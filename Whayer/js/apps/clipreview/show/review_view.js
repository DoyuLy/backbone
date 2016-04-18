define(["app", "SobeyVideo", "timeline", "timeCode", "timeCodeConverter", "jquery-ui", "tooltipster", "mCustomScrollbar", "wPaint.menu"], function (CloudMamManager, SbVideo, TimeLine, TimeCode, TimeCodeConvert) {
    CloudMamManager.module("CutApp.Cut.View", function (View, CloudMamManager, Backbone, Marionette, $, _) {


        //总体布局视图（插入body）
        View.ReviewWholeLayout = Marionette.Layout.extend({
            template: "clipreview/review-main-layout",
            //el: 'body',
            tagName: 'div',
            regions: {
                headerRegion: ".desc-header",
                contentRegion: ".desc-content",
                footerRegion: ".desc-footer"
            }
        });

        //头部视图
        View.HeaderView = Marionette.ItemView.extend({
            tagName: "div",
            template: "clipreview/review-header",
            initialize: function () {
                //$('')
            }
        });

       //中部布局视图content（left|right）
        View.ContentLayout = Marionette.Layout.extend({
            template: "clipreview/review-content-layout",
            className: "desc-content-box",
            regions: {
                leftRegion: ".desc-left",
                rightRegion: ".desc-right"
             }
        });

        //左边视频区 left
        View.LeftView = Marionette.ItemView.extend({

            template: "clipreview/review-content-left",
            timeline: null,
            video: null,
            playendedcount: 0,

            initialize: function () {

                //this.playendedcount = 0;
                var self = this;

                this.listenTo(CloudMamManager, 'player:play', function (option) {
                    if (option) self.video.play();
                    else self.video.pause();
                });

                this.listenTo(CloudMamManager, 'player:setPreFrame', function (option) {
                    var currentframe = self.video.getcurrentframe();
                    self.video.seek(currentframe - 1);
                });

                this.listenTo(CloudMamManager, 'player:setNextFrame', function (option) {
                    var currentframe = self.video.getcurrentframe();
                    self.video.seek(currentframe + 1);
                });

                this.listenTo(CloudMamManager, 'player:muted', function (option) {
                    self.video.setMuted(option);
                });

                this.listenTo(CloudMamManager, 'volume:change', function (option) {
                    self.video.setVolume(option / 100);
                });

                this.listenTo(CloudMamManager, 'story:play', function (option) {
                    //{ data: data, isplay: this.isplay });

                });

                //打点
                this.listenTo(CloudMamManager, 'video:cut', function (option) {
                    //暂停播放器
                    self.video.pause();
                    //重置按钮:player:pause
                    this.trigger('player:ended');
                    option ? self.timeline.setInOutPoint(0, 1) : self.timeline.cleaInOutPoint();
                });

                //点击片段seek播放
                this.listenTo(CloudMamManager, 'fragement:seekplay', function (option) {
                   var selectedItem = _.filter(self.model.get('entities'), function (entity) {
                       return entity.contentId == option.get('contentId');
                    });

                    self.video.onloadCompleted = function () {//onloadeddata /oncanplay
                        console.log('fragement:seekplay onloadCompleted');
                        self.timeline.cleaInOutPoint();//清除打点
                        self.timeline.setInOutPoint(TimeCodeConvert.L100Ns2Frame(option.get('inpoint'), 25.0), TimeCodeConvert.L100Ns2Frame(option.get('outpoint'), 25.0), true);
                    }
                    self.video.setSrc(selectedItem[0].mediaPlayAddress, self.cutString(selectedItem[0].keyFramePath, selectedItem[0].contentId));
                    self.ui.title.html(selectedItem[0].name);
                });

                //this.trigger('media:selected', self.model.get('entities')[0]);
            },

            videoEventListener: function (e) {
                var self = this;
                this.video.addEventListener(e, function () {
                    alert(e);
                });
            },
            ui: {
                "playVideo":".v_bar ul li",
                "togglePlay":".v_area video",
                "commit":".v_bar .js-commit",
                "comment":".v_bar .js-comment",
                "title": ".js-title",
                "duration": ".js-duration",
                "tooltip": "ul li .tooltip",
                "lifirst": ".ul-box li:first"
            },
            events: {
                //轮播事件
                "click @ui.playVideo": "playVideo",
                "click @ui.togglePlay": "togglePlay",
                "click @ui.commit": "commit"
            },
            //点击视频区域播放(弃用)
            togglePlay: function(e) {
                e.stopPropagation() && e.preventDefault();
            },
            //提交评论
            commit: function (e) {
                var frame2100Ns = TimeCodeConvert.Frame2100Ns(this.video.getcurrentframe());
				
				//绘画图像的 base64 encoded image
				var imageData = $("#wPaint").wPaint("image");

                $(".img").attr("src",imageData);
                console.log($(".img"));
				
                if (!this.ui.comment.val()) return;
                var json = {
                    content: this.ui.comment.val(),
                    activityId: this.model.get('activityId'),
                    parentId: null,
                    canvasStream: imageData,
                    point: 0   //百纳秒
                }
				
				console.log(json);
                this.trigger('comment:commit', json);
            },
            playVideo: function (e) {
                e.preventDefault() && e.stopPropagation();
                var targetId = this.$(e.target).data('id');
                this.clearStyle();
                this.$(e.target).parent().addClass('active');
                var self = this;
                this.selectedItem = _.filter(self.model.get('entities'), function (entity) {
                    return entity.contentId == targetId;
                });
                this.video.onloadCompleted = function () {//onloadeddata /oncanplay
                    self.timeline.setInOutPoint(0, 10, false);
                    // 清除打点
                    self.timeline.cleaInOutPoint();
                };
                //设置流媒体 和 poster
                this.video.setSrc(this.selectedItem[0].mediaPlayAddress, self.cutString(self.selectedItem[0].keyFramePath, self.selectedItem[0].contentId));
                //设置title
                this.ui.title.html(this.selectedItem[0].name);
                

                //重置播放器按钮状态
                this.video.setMuted(false);//重置静音状态
                this.trigger('player:reset');//重置播放按钮和cut按钮状态

                this.video.video.onplay = function (e) {
                    self.trigger('player:sgclick', true);
                };
                this.video.video.onpause = function (e) {
                    self.trigger('player:sgclick', false);
                };

                //触发video选中事件
                this.trigger('media:selected', this.selectedItem[0]);
            },
            //清除样式
            clearStyle: function () {
                this.$('li').removeClass('active');
            },

            cutString: function (src, separator) {
                var combineKeyFrame = src.split(separator)[0] + separator + "/merge_1920.jpg";
                return combineKeyFrame;
            },
            timelineframechange: function (f) {
                this.video.seek(f);
            },
            //打点change 事件
            oninoutpointchange: function (p) {
                this.trigger('inoutpoint:change', p);
            },
            videoLoadCompleted: function (t) {
                this.ui.duration.html(t);
            },
            videoOnplayended: function () {
                //触发了两次?
                //test
                this.playendedcount += 1;
                console.log('player ended event has triggered ' + this.playendedcount);
                this.trigger('player:ended');
            },
            onSeekChange: function (t,f) {
                this.trigger('timecode:change', { t: t, f: f });
            },
            onRender: function () {
                var self = this;
                var template = "";
                this.ui.tooltip.tooltipster({
                    animation: 'grow',
                    arrow: true,
                    content: function (e) {
                        return template;
                    },
                    functionBefore: function (origin, continueTooltip) {
                        
                        template = '<p class="tooltip-title">' + $(origin).data('name') + '<p>' +
                                    '<div class="tooltip-detial">' +
                                        '<span>创建者</span><i>' + $(origin).data('creator') + '</i></br>' +
                                        '<span>创建时间</span><i>' + $(origin).data('duration') + '</i>' +
                                    '</div>';
                        continueTooltip();
                    },
                    delay: 200,
                    //fixedWidth: 0,
                    maxWidth: 160,
                    maxHeight: 100,
                    interactive: true,
                    interactiveTolerance: 350,
                    onlyOne: true,
                    position: 'top',
                    speed: 350,
                    timer: 0,
                    theme: '.tooltipster-default',//'.tooltipster-light',
                    trigger: 'hover',
                    updateAnimation: true
                });
            },
            onShow: function () {
                var self = this;
                var defaults = this.model.attributes;
                
                this.ui.title.html(defaults.name);
                //首个素材选中
                this.ui.lifirst.addClass('active');

                //准备初始化播放器+时间线
                this.timeline = new TimeLine({
                    viewObj: this,
                    container: $('.progress_bar')[0],//'timelineContainer',
                    mediaInfo: defaults,
                    frameRate: new TimeCode().frameRates.NTSC,
                    duration: 1000,
                    callback: function (response, format) {
                        console.log(format);
                    },
                    oncurrentframechange: self.timelineframechange,
                    oninoutpointchange: self.oninoutpointchange
                });

                this.video = new SbVideo({
                    viewObj: this,
                    container: this.$('.v_area')[0],
                    frameRate: 25.0,
                    timeline: self.timeline,
                    controlsenable: false,//播放器自带的控件是否可用
                    onloadCompleted: self.videoLoadCompleted,
                    onplayended: self.videoOnplayended,
                    onseekchange: self.onSeekChange,
                    callback: function (response, format) {
                        console.log(format);
                    }
                });

                this.timeline.init();
                this.timeline.cleaInOutPoint();//清除打点
                this.video.init(defaults.mediaPlayAddress, self.cutString(defaults.keyFramePath, defaults.contentId));

                this.video.video.onplay = function (e) {
                    self.trigger('player:sgclick', true);
                };
                this.video.video.onpause = function (e) {
                    self.trigger('player:sgclick', false);
                };
				
				$('#wPaint').wPaint({
                    path          : 'http://172.16.135.124:8080/site/js/libs/wPaint/',
					menuOffsetLeft:  25,   
                });
            }
        });

        //评论
        View.CommentView = Marionette.ItemView.extend({
            template: "clipreview/review-comment-itemview",
            tagName: 'div',
            className: 'review shadow',
            initialize: function () {

            },
            ui: {
                "replay": ".js-replay"
            },
            events: {
               "click @ui.replay": "replay"
            },

            replay: function(e) {
                var $ele = this.$(e.target);
                var $input = $ele.prev();
                if (!$input.val()) return;
                this.model.set('replycontent', $input.val());
                //var json = {
                //    activityId: $ele.get(0).dataset.activityid,
                //    point: TimeCodeConvert.Frame2100Ns($ele.get(0).dataset.point),
                //    canvasStream: "",
                //    content: $input.val(),
                //    parentId: $ele.get(0).dataset.id
                //}
                this.trigger('reply:commit');
            }
        });

        //右边评论复合视图 right
        View.RightView = Marionette.CompositeView.extend({
            template: "clipreview/review-content-right",
            tagName: 'span',
            attributes: {},
            itemView: View.CommentView,
            emptyView: null,
            itemViewContainer: ".right_content",
            initialize: function () {
                //数据被重置
                this.listenTo(this.collection, "reset", function () {
                    this.appendHtml = function (collectionView, itemView, index) {
                        collectionView.$el.append(itemView.el);
                    };
                });
            },
            ui:{
               
            },
            events: {
                
            }
        });

        //底部功能复合视图
        View.FooterLayout = Marionette.Layout.extend({
            template: "clipreview/review-footer",
            regions: {
                timelineRegion: ".frame_bg", //时间线区
                featureBarRegion: ".options" //功能按钮区
            }
        });

        //时间线视图
        View.TimelineView = Marionette.ItemView.extend({
            tagName: "div",
            className: "progress_bar",
            template: "clipreview/review-footer-timeline",
            initialize: function () {

            },
            events: {

            }
        });

        //功能区Layout视图
        View.FeatureBarLayout = Marionette.Layout.extend({
            template: "clipreview/review-footer-featurebar",
            regions: {
                leftPanelRegion: ".left_panel", //左侧按钮区
                centerPanelRegion: ".main-panel",//中部按钮区
                rightPanelRegion: ".right-panel"//右侧按钮区
            }
        });

        //左侧
        View.FeatureLeftView = Marionette.ItemView.extend({

            template: "clipreview/review-footer-left-featurebar",
            initialize: function () {

                var self = this;
                //时码change
                this.listenTo(CloudMamManager, 'timecode:change', function (toptions) {
                    self.ui.standerdTimeCode.html(toptions.t);
                    self.ui.tapeTimeCode.html(toptions.t);
                    self.ui.frame.html(toptions.f);
                });
            },
            ui: {
                "standerdTimeCode": "span.js-standerdtime",
                "tapeTimeCode": "span.js-tapetime",
                "frame": "span.js-totaltime"
            }

        });

        //中部
        View.FeatureCenterView = Marionette.ItemView.extend({

            template: "clipreview/review-footer-center-featurebar",
            initialize: function () {
                var self = this;
                this.muted = false;//音量初始化
                this.playing = false;//播放状态初始化
                this.listenTo(CloudMamManager, 'player:ended', function () {
                    self.ui.play.removeClass('active');
                    self.playing = false;//!self.playing;//重置播放状态
                });

                //重置播放按钮状态 与非静音状态
                this.listenTo(CloudMamManager, 'player:reset', function () {
                    self.ui.play.removeClass('active') && self.ui.muted.removeClass('active');
                    self.playing = self.muted = false;
                });

                //单击播放重置
                this.listenTo(CloudMamManager, 'player:sgclick', function (option) {
                    option ? self.ui.play.addClass('active') : self.ui.play.removeClass('active');
                    //self.ui.muted.removeClass('active');
                    //self.playing = self.muted = false;
                });
            },
            ui: {
                "play": "li.rerun",
                "prev": "li.pre",
                "next": "li.next",
                "muted": "div.voice_full"
                
            },
            events: {
                "click @ui.play": "play",
                "click @ui.prev": "prev",
                "click @ui.next": "next",
                "click @ui.muted": "_muted"
            },
            play: function (e) {
                this.playing = !this.playing;
                e && e.preventDefault() && e.stopPropagation();
                this.$(e.target).toggleClass('active');
                //触发播放器播放暂停
                this.trigger('player:play',this.playing)
            },
            prev: function (e) {
                e && e.preventDefault() && e.stopPropagation();
                //获取上一帧
                this.trigger('player:setPreFrame');
            },
            next: function (e) {
                e && e.preventDefault() && e.stopPropagation();
                //获取下一帧
                this.trigger('player:setNextFrame');
            },
            _muted: function (e) {
                this.muted = !this.muted;
                e && e.preventDefault() && e.stopPropagation();
                this.$(e.target).toggleClass('active');
                //设置静音
                this.trigger('player:muted', this.muted);
            },
            onRender: function () {
                var self = this;
                if (this.el) {
                    this.$('div.voice_bar').slider({
                        value: 100,
                        max: 100,
                        min: 0,
                        orientation: "horizontal",
                        range: "min",
                        animate: false,
                        change: function (event, ui) { },
                        slide: function (event, ui) {
                            console.log(ui.value);
                            ui.value ? self.ui.muted.removeClass('active') : self.ui.muted.addClass('active')
                            self.trigger('volume:change', ui.value);
                        }
                        
                    });
                }
            }
        });

        //右侧
        View.FeatureRightView = Marionette.ItemView.extend({
            template: "clipreview/review-footer-right-featurebar",
            initialize: function () {

                var self = this;
                this.cut = false;
                this.inoutpoint = {};//当前打点区间
                this.currentSelected = this.options.firstmedia;//当前打点的视频
                //重置cut状态
                this.listenTo(CloudMamManager, 'player:reset', function () {
                    self.cut = false;
                    self.ui.cutFragment.removeClass('active');
                });

                //获取打点区间
                this.listenTo(CloudMamManager, 'inoutpoint:change', function (inoutpoint) {
                    if (inoutpoint) {
                        inoutpoint.inpoint = TimeCodeConvert.Frame2100Ns(inoutpoint.inpoint, 29.97);
                        inoutpoint.outpoint = TimeCodeConvert.Frame2100Ns(inoutpoint.outpoint, 29.97);
                    }
                        
                    self.inoutpoint = inoutpoint;
                });

                //video:selected
                this.listenTo(CloudMamManager, 'media:selected', function (currentSelected) {
                    self.currentSelected = currentSelected;
                });
            },
            ui: {
                "cutFragment": "ul li.crop",
                "addFragment": "ul li.add"
            },
            events: {
                "click @ui.cutFragment": "cutFragment",
                "click @ui.addFragment": "addFragment"
            },
            cutFragment: function (e) {
                this.cut = !this.cut;
                this.cut ? this.ui.cutFragment.addClass('active') : this.ui.cutFragment.removeClass('active');
                this.trigger('video:cut', this.cut);
                //判断是不是选中状态
                if($(e.currentTarget).hasClass("active")){
                    $("#timeLine_bg").addClass("white");
                } else {
                    $("#timeLine_bg").removeClass("white");
                }
                return false;     //阻止冒泡和默认事件
            },
            addFragment: function (e) {
                e && e.preventDefault() && e.stopPropagation();
            },
            drawCanvas: function ($video) {
                var canvas = document.createElement("canvas");
                canvas.width = 80;//video.videoWidth * scale;
                canvas.height = 50;//video.videoHeight * scale;
                canvas.getContext('2d')
                      .drawImage($video, 0, 0, canvas.width, canvas.height);

                var img = document.createElement("img");
                img.crossorigin = "anonymous";
                return canvas.toDataURL("image/png");
            },
            onRender: function () {

                var self = this;
                this.ui.addFragment.tooltipster({
                    animation: 'grow',
                    arrow: true,
                    //arrowColor: '',
                    content: function () {
                        var template = self.cut ?
                            '<div class="popup-content">' +
                                //'<p class="popup-lable">To create new Cutlist pls name it.</p>' +
                                '<p class="popup-lable" >请填写片段名:</p>' +
                                '<p><input type="text" name="cutlistname" value="" class="popup-cutlistName js-cutlistName" style="width:150px;" /></p>' +
                                '<p><input type="button" class="popup-creatcutlist js-cutlistCreate" name="Create Cutlist" value="创    建"></p>' +
                            '</div>'
                            :
                            '<div class="popup-lable" style="margin-top:45px;">您还未进行打点!</div>';
                        return template;
                    },
                    delay: 10,
                    fixedWidth: 175,
                    //maxWidth: 290,
                    //maxHeight: 145,
                    functionBefore: function (origin, continueTooltip) {
                        continueTooltip();
                    },
                    iconTheme: '.tooltipster-icon',
                    interactive: true,
                    interactiveTolerance: 350,
                    onlyOne: true,
                    position: 'bottom',
                    speed: 350,
                    timer: 0,
                    theme: '.tooltipster-cutclip',
                    //touchDevices: true,
                    trigger: 'click',
                    updateAnimation: true,
                    functionReady: function (origin, tooltip) {
                        var $create = $(tooltip).find('.js-cutlistCreate');
                        console.log($create.length);
                        //self.inoutpoint
                        $create.click(function () {
                            var $name = $(tooltip).find('.js-cutlistName');
                            var fragementName = $name.val();
                            fragementName ? $name.removeClass('popup-nameError') : $name.addClass('popup-nameError');
                            //fragementName ? null : self.createCutlist($name.val());
                            if (fragementName) {

                                //draw image
                                console.log($('.v_area video').length);
                                //var $video = $('.v_area video').get(0);
                                //var dataURL = self.drawCanvas($video);
                                //self.currentSelected.keyFramePath = dataURL;
                                self.trigger("create:cutlist", _.defaults({ fragementName: fragementName, inoutpoint: self.inoutpoint }, self.currentSelected));
                                self.ui.addFragment.tooltipster("hide");
                            }
                        });
                    }
                });

            }
        });
        
    });
    return CloudMamManager.CutApp.Cut.View;
});