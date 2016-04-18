define(["app", "SobeyVideo", "timeline", "timeCode", "timeCodeConverter", "jquery-ui", "tooltipster", "mCustomScrollbar"], function (CloudMamManager, SbVideo, TimeLine, TimeCode, TimeCodeConvert) {
    CloudMamManager.module("CutApp.Cut.View", function (View, CloudMamManager, Backbone, Marionette, $, _) {


        //重构
        View.LayoutView = Marionette.ItemView.extend({
            tagName: "div",
            template: "cut/Layout",
            initialize: function () {

            },
            onRender: function () {

            },
            onShow: function () {

            }
        });

        //总体布局视图（插入body）
        View.CutWholeLayout = Marionette.Layout.extend({
            template: "cut/cut-main-layout",
            //el: 'body',
            tagName: 'div',
            regions: {
                headerRegion: ".cut-header",
                contentRegion: ".cut-content",
                footerRegion: ".cut-footer"
            }
        });

        //头部视图
        View.HeaderView = Marionette.ItemView.extend({
            tagName: "div",
            template: "cut/cut-header",
            initialize: function () {
                //$('')
            }
        });

       //中部布局视图content（left|right）
        View.ContentLayout = Marionette.Layout.extend({
            template: "cut/cut-content-layout",
            className: "cut-content-box",
            regions: {
                leftRegion: ".cut-left",
                rightRegion: ".cut-right"              
             }
        });

        //左边视频区 left
        View.LeftView = Marionette.ItemView.extend({

            template: "cut/cut-content-left",
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
                        self.timeline.cleaInOutPoint();//清除打点
                        self.timeline.setInOutPoint(TimeCodeConvert.L100Ns2Frame(option.get('inpoint'), option.get('frameRate') ? option.get('frameRate') : 25), TimeCodeConvert.L100Ns2Frame(option.get('outpoint'), option.get('frameRate') ? option.get('frameRate') : 25), true);
                    }
                    self.video.setSrc(selectedItem[0].mediaPlayAddress, self.cutString(selectedItem[0].keyFramePath, selectedItem[0].contentId));
                    self.ui.title.html(selectedItem[0].name);
                });

                //story播放
                this.listenTo(CloudMamManager, 'story:play', function (option) {
                    if (option.storyIsplay) {
                        //若非初始播放状态
                        if (this.video.playIndex > 0) {
                            self.video.play();
                        }
                        //初始播放状态
                        else {
                            //设置story播放状态 
                            this.video.isstory = true;
                            var storyArr = [];
                            _.each(option.data.models, function (item) {
                                //流媒体地址/入点/出点/合成帧地址/
                                _.each(self.model.get('entities'), function (itemj) {
                                    if (itemj.contentId == item.get('contentId')) {
                                        storyArr.push({ model: item, src: itemj.mediaPlayAddress, frameRate: itemj.frameRate, inpoint: item.get('inpoint'), outpoint: item.get('outpoint'), bgsrc: self.cutString(item.get('keyframepath'), item.get('contentId')), name: itemj.name });
                                    }
                                });
                            });
                            if (storyArr.length && storyArr.length == option.data.models.length) {
                                self.video.setstoryList(storyArr);
                            }
                        }
                        
                    } else {
                        //取消story播放状态
                        //this.video.isstory = option.storyIsplay;
                        self.video.pause();
                    }
                });
            },

            videoEventListener: function (e) {
                var self = this;
                this.video.addEventListener(e, function () {
                    alert(e);
                });
            },
            ui: {
                "title": ".js-title",
                "tooltip": "ul li .tooltip",
                "firstli": ".ul-box li:first",
                "timelinecontainer": ".progress_bar",
                "videocontainer": ".v_area",
                "duration": ".js-duration"
            },
            events: {
                //轮播事件
                "click .v_bar ul li": "playVideo",
                "click .v_area video": "togglePlay"
            },
            //点击视频区域播放
            togglePlay: function(e) {
                e.stopPropagation() && e.preventDefault();
                //this.video.video.paused ? this.trigger('player:sgclick', false) : this.trigger('player:sgclick', true);
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
                var defaults = this.model.get('entities')[0];
                
                this.ui.title.html(defaults.name);
                //首个素材选中
                this.ui.firstli.addClass('active');

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
                    oncurrentframechange: function(f) {
                        self.video.seek(f);
                    },
                    oninoutpointchange: function (p) {
                        //打点change 事件
                        self.trigger('inoutpoint:change', p);
                    }
                });

                this.video = new SbVideo({
                    viewObj: this,
                    container: self.ui.videocontainer[0],
                    frameRate: defaults.frameRate ? defaults.frameRate : 25,
                    timeline: self.timeline,
                    controlsenable: false, //播放器自带的控件是否可用
                    onloadCompleted: function(t) {
                        //this.timeline.setInOutPoint(10, 25, true);
                        self.ui.duration.html(t);
                    },
                    onplayended: function() {
                        //触发了两次?
                        this.playendedcount += 1;
                        console.log('player ended event has triggered ' + this.playendedcount);
                        this.trigger('player:ended');
                    },
                    onseekchange: function(t, f) {
                        this.trigger('timecode:change', { t: t, f: f });
                    },
                    callback: function(response, format) {
                        console.log(format);
                    },
                    storyplayed: function (index, params) {
                        self.video.onloadCompleted = function () {
                            self.timeline.cleaInOutPoint(); //清除打点
                            self.timeline.setInOutPoint(TimeCodeConvert.L100Ns2Frame(params.inpoint, params.frameRate ? params.frameRate : 25), TimeCodeConvert.L100Ns2Frame(params.outpoint, params.frameRate ? params.frameRate : 25), true);
                            self.video.play();
                        }
                        //story播放设置片段选中
                        if (self.video.isstory == true)
                            self.trigger("story:fragement:toggleSelecte", params.model);
                        self.video.setSrc(params.src, params.bgsrc);
                        self.ui.title.html(params.name);
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

                //触发video选中事件
                //this.trigger('media:selected', defaults);

            }

        });

        //打点片段子视图
        View.FragmentView = Marionette.ItemView.extend({
            template: "cut/cut-fragment-itemview",
            tagName: 'ul',
            className: 'lists',//active
            initialize: function () {//初始化

                //添加时码
                //_.each(this.model.collection.models, function (item) {
                //    var timecode = item.outpoint - item.inpoint;
                //    item.duration = TimeCodeConvert.L100Ns2Tc(timecode, 29.97);
                //});

                this.listenTo(this.model, "selected", function () {//选中当前
                    this.$el.addClass("active");
                });
                this.listenTo(this.model, "deselected", function () {//没选中当前
                    this.$el.removeClass("active");
                });
                this.listenTo(this.model, "change", this.render);//监听数据发生改变
            },
            events: {//触发事件
                "click li": "onClick",//点击
                "mouseenter li": "toggleOperations",//显示操作
                "mouseleave li": "toggleOperations",//显示操作
                "click .js-rename": "onRenameClick",//点击重命名
                "click .js-remove":"onRemoveClick",//点击删除
            },
            onRenameClick: function (e) {//点击重命名
                e && e.preventDefault() && e.stopPropagation();
                var self = this;
                //this.trigger("fragement:rename");
                var oldVal= this.$('.js-title a').html();
                this.$el.find('.js-title a').hide().next('input').show().focus().blur(function () {
                    var newVal = self.$(this).val();
                    var el = self.$el.find('.js-title a');
                    el.html(newVal).attr('title', newVal).show().next('input').hide();
                    //self.model.set('name', newVal);
                    self.trigger("fragement:rename",newVal);
                });
            },
            onRemoveClick:function(e){//点击删除
                e && e.preventDefault() && e.stopPropagation();
                //this.trigger("fragement:delete");
                var self = this;
                this.$el.fadeOut(function () {
                    self.trigger("fragement:delete");
                    //self.model.destroy({
                    //    url: '/ac/sequence/' + self.model.get('id')
                    //});
                    Marionette.ItemView.prototype.remove.call(self);
                    //console.log('素材已删除...');
                });
            },
            onClick: function (e) {//切换选中
                e && e.preventDefault() && e.stopPropagation();
                this.trigger("fragement:toggleSelecte");
                this.trigger("fragement:seekplay", this);
                //重置播放按钮和cut状态（有问题）
                //CloudMamManager.trigger('player:reset')
            },
            toggleOperations: function (e) {//切换操作
                e && e.preventDefault() && e.stopPropagation();
                this.$el.find("li span.js-oprations").toggleClass("none");
            },
            onRender: function () {                
            }
        });

        //右边复合视图 right
        View.RightView = Marionette.CompositeView.extend({
            template: "cut/cut-content-right",
            tagName: 'div',
            attributes: {
                style: 'height:100%;width:100%;padding-right:10px;'
            },
            itemView: View.FragmentView,
            emptyView: null,
            itemViewContainer: ".lists",
            initialize: function () {
                //story播放状态标识
                this.storyIsplay = false;
                this.s_tipShow = false;
                this.e_tipShow = false;
                //this.ui.exportFcp.attr('href',  config.dcmpRESTfulIp + '' + "/ac/export/" + options);
            },
            ui:{
                "storyplay": ".topnav li i.play",
                "exportFcp": ".topnav li i.send",
                "share": ".topnav li i.share",
                "synthesis": ".topnav li i.synthesis"
            },
            events: {
                "click @ui.storyplay": "storyplay",
                "click @ui.exportFcp": "exportFcp",
                "click @ui.synthesis": "synthesis"
            },

            exportFcp: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                //导出FCP
                this.e_tipShow = !this.e_tipShow;
                this.e_tipShow ? this.ui.exportFcp.tooltipster('show') : this.ui.exportFcp.tooltipster('hide');
                //this.trigger("export:fcp", this);
            },

            synthesis: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                //合成新素材
                //this.trigger("synthesis:clips", this);
                this.s_tipShow = !this.s_tipShow;
                this.s_tipShow ? this.ui.synthesis.tooltipster('show') : this.ui.synthesis.tooltipster('hide');
            },

            storyplay: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                this.storyIsplay = !this.storyIsplay;
                this.ui.storyplay.toggleClass('active');
                //story 播放
                var data = this.collection;

                this.trigger('story:play', { data: data, storyIsplay: this.storyIsplay });
            },

            onCompositeCollectionRendered: function () {
                //this.appendHtml = function (collectionView, itemView, index) {
                //    collectionView.$('.fragment-list').prepend(itemView.el);
                //}
            },
            onRender: function () {
                var self = this;
                //设置活动名称
                this.$el.find('h2').html(this.options.activeName);

                if (this.$el) {//拖动排序
                    var $fragmentList = this.$el.find('div.lists');
                    $fragmentList.sortable({
                        axis: "y", cursor: "move", opacity: 0.75,                        
                        stop: function (event, ui) {
                            var sortedIds = [];
                            _.forEach($fragmentList.find("ul"), function (fragment) {
                                var $fragment = self.$(fragment);
                                var id = $fragment.find("li").data("id");
                                sortedIds.push(id);
                            });
                            self.trigger("fragment:sorted", sortedIds.join(","));
                        }
                    });
                }
            },
            onShow: function () {
                var self = this;
                this.ui.exportFcp.tooltipster({
                    animation: 'grow',
                    arrow: true,
                    content: function () {
                        var template = self.collection.models.length ?
                            '<div class="popup-content">' +
                                //'<p class="popup-lable">To create new Cutlist pls name it.</p>' +
                                '<p class="popup-lable" >确认导出FCP?</p>' +
                                '<p><input type="button" class="popup-creatcutlist js-exportfcp" name="exportfcp" value="导  出"></p>' +
                            '</div>'
                            :
                            '<div class="popup-lable" style="line-height:20px;">当前无片段,不可导出FCP!</div>';
                        return template;
                    },
                    delay: 10,
                    maxWidth: 140,
                    maxHeight: 140,
                    iconTheme: '.tooltipster-icon',
                    interactive: true,
                    interactiveTolerance: 350,
                    onlyOne: true,
                    position: 'top',
                    speed: 350,
                    timer: 0,
                    theme: '.tooltipster-default',
                    trigger: 'click',
                    updateAnimation: true,
                    functionBefore: function (origin, continueTooltip) {
                        continueTooltip();
                    },
                    functionReady: function (origin, tooltip) {
                        self.e_tipShow = true;
                        var $fpcexport = $(tooltip).find('.js-exportfcp');
                        console.log($fpcexport.length);

                        $fpcexport.click(function () {
                            self.trigger("export:fcp", self);
                            self.ui.exportFcp.tooltipster("hide");
                        });
                    },
                    functionAfter: function (origin) {
                        self.e_tipShow = false;
                    }
                });

                this.ui.synthesis.tooltipster({
                    animation: 'grow',
                    arrow: true,
                    content: function () {
                        var template = self.collection.models.length?
                            '<div class="popup-content">' +
                                //'<p class="popup-lable">To create new Cutlist pls name it.</p>' +
                                '<p class="popup-lable" >确认合成新素材?</p>' +
                                '<p><input type="button" class="popup-creatcutlist js-synthesis" name="synthesis" value="合  成"></p>' +
                            '</div>'
                            :
                             '<div class="popup-lable" style="line-height:20px;">当前无片段,不可合成新素材!</div>';
                        return template;
                    },
                    delay: 10,
                    maxWidth: 140,
                    maxHeight: 140,
                    iconTheme: '.tooltipster-icon',
                    interactive: true,
                    interactiveTolerance: 350,
                    onlyOne: true,
                    position: 'top-right',
                    speed: 350,
                    timer: 0,
                    theme: '.tooltipster-default',
                    trigger: 'click',
                    updateAnimation: true,
                    functionBefore: function (origin, continueTooltip) {
                        continueTooltip();
                    },
                    functionReady: function (origin, tooltip) {
                        self.s_tipShow = true;
                        var $synthesis = $(tooltip).find('.js-synthesis');
                        console.log($synthesis.length);
                        $synthesis.click(function () {
                            self.trigger("synthesis:clips", self);
                            self.ui.synthesis.tooltipster("hide");
                        });
                    },
                    functionAfter: function (origin) {
                        self.s_tipShow = false;
                    }
                });


                //自定义滚动条
                $("#fragment-list").mCustomScrollbar({
                    autoHideScrollbar: true,
                    theme: "rounded"
                }); 
               

            }
        });

        //底部功能复合视图
        View.FooterLayout = Marionette.Layout.extend({
            template: "cut/cut-footer",
            regions: {
                timelineRegion: ".frame_bg", //时间线区
                featureBarRegion: ".options" //功能按钮区
            }
        });

        //时间线视图
        View.TimelineView = Marionette.ItemView.extend({
            tagName: "div",
            className: "progress_bar",
            template: "cut/cut-footer-timeline",
            initialize: function () {

            },
            events: {

            }
        });

        //功能区Layout视图
        View.FeatureBarLayout = Marionette.Layout.extend({
            template: "cut/cut-footer-featurebar",
            regions: {
                leftPanelRegion: ".left_panel", //左侧按钮区
                centerPanelRegion: ".main-panel",//中部按钮区
                rightPanelRegion: ".right-panel"//右侧按钮区
            }
        });

        //左侧
        View.FeatureLeftView = Marionette.ItemView.extend({

            template: "cut/cut-footer-left-featurebar",
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

            template: "cut/cut-footer-center-featurebar",
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
            template: "cut/cut-footer-right-featurebar",
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