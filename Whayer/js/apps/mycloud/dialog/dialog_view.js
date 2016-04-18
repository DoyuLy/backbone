define(["app", "config", "apps/common/utility", "jquery.spin", "localstorage", "zClip"], function (CloudMamManager, config, utility) {
    CloudMamManager.module("MyCloudApp.Dialog", function (Dialog, CloudMamManager, Backbone, Marionette, $, _) {
        //定制对话框外点击失效
        Backbone.Modal.prototype.clickOutside = function(e) {
            //ToDo
        };

        //Loading
        Dialog.Loading = Backbone.Modal.extend({
            template: Marionette.TemplateCache.get("mycloud/mycloud-loading-view"),
            initialize: function(options){
                var options = options || {};
                this.title = options.title || "数据加载中";
                this.message = options.message || "请稍后，数据加载中...";
            },
            serializeData: function () {
                return {
                    title: this.title,
                    message: this.message
                };
            },
            onShow: function () {
                var opts = {
                    lines: 15, // 画的线条数
                    length: 10, // 每条线的长度 
                    width: 10, // 线宽
                    radius: 30,// 线的圆角半径
                    corners: 1, //Corner roundness (0..1)
                    rotate: 0, // 旋转偏移量 
                    direction: 1, // 1: 顺时针, -1: 逆时针 
                    color: "#000",
                    speed: 1, // 转速/秒 
                    trail: 80, // Afterglow percentage 
                    shadow: true, // 是否显示阴影   
                    hwaccel: false, // 是否使用硬件加速 
                    className: "spinner",  // 绑定到spinner上的类名 
                    zIndex: 2e9, // 定位层 (默认 2000000000)
                    top: "25%",// 相对父元素上定位，单位px
                    left: "28%" //相对父元素左定位，单位px
                };
                this.$("#spinner").spin(opts);
            }
        });

        //文件转码
        Dialog.Transform = Backbone.Modal.extend({
            template: Marionette.TemplateCache.get("mycloud/mycloud-dialog-transform"),
            cancelEl: ".close",
            submitEl: "#wf",
            viewContainer: ".transform .fix",//步骤容器
            initialize: function (options) {
                options || {};
                this.materials = JSON.parse(options.model) || JSON.parse(this.model);//转码素材
                this.currentStep = null;//当前步骤
                this.params = {};//请求参数
            },
            ui: {
                "numWidth": ".js-numw",
                "numHeight": ".js-numh",
                "minus": ".js-minus",
                "add": ".js-add"
            },
            events: {
                "click ul li .check": "toggleSelecte",
                "click .js-next": "nextStep",//点击下一步
                "click .js-previous": "previousStep",//点击上一步
                "click .js-format-group": "toggleFormatSelected",//选择转码格式
                "click .js-network-format-group": "toggleNetworkFormat",//选择网络格式的转码格式
                "click .js-network-format-size-group": "toggleNetworkFormatSize",//选择网络格式的转码大小
                "click .js-professional-format": "toggleProfessionalFormat",//选择专业格式的转码格式
                "click .js-professional-format-size": "toggleProfessionalFormatSize"//选择专业格式的转码大小
                //"click @ui.minus": "minus",
                //"click @ui.add": "add"
            },
            ////累加
            //minus: function(e) {
            //    var target = this.$(e.target);
            //    var val = target.val();

            //},
            ////累减
            //add: function(e) {
            //    var target = this.$(e.target);
            //},
            isShowNextStep: function(option) {
                //是否显示"下一步"
                if (option === 'network') {//网络格式
                    if (this.params.networkFormats && this.params.networkFormats.length > 0 && this.params.networkFormatSize)
                        this.$el.find('.js-next').show();
                    else
                        this.$el.find('.js-next').hide();
                }
                if (option === 'professional') {//专业格式
                    if (this.params.professionalFormats && this.params.professionalFormats.length > 0 && this.params.professionalFormatSize)
                        this.$el.find('.js-next').show();
                    else
                        this.$el.find('.js-next').hide();
                }
            },
            toggleProfessionalFormatSize: function (e) {//专业格式的转码大小
                e && e.preventDefault() && e.stopPropagation();
                var $current = this.$(e.target);//当前选中项
                var $sizeGroup = this.$(".js-professional-format-size");//所有转码大小
                var disabled = $current.data('disabled');//是否禁用
                //样式设置
                if (!disabled) {
                    $sizeGroup.removeClass("active");
                    $current.addClass("active");
                    var professionalFormatSize = $current.data("size");
                    _.extend(this.params, { professionalFormatSize: professionalFormatSize });
                    this.isShowNextStep('professional');
                }
            },
            toggleProfessionalFormat: function (e) {//专业格式的转码格式
                e && e.preventDefault() && e.stopPropagation();
                var self = this;
                var disabled = this.$(e.target).data('disabled');
                if (!disabled) {
                    this.$(e.target).toggleClass("active");
                    var professionalFormats = [];
                    var $professionalFormats = this.$(".js-professional-format");
                    _.forEach($professionalFormats, function($format) {
                        $format = self.$($format);
                        if ($format.hasClass("active")) {
                            professionalFormats.push($format.data("format"));
                        }
                    });
                    _.extend(this.params, { professionalFormats: professionalFormats });
                    this.isShowNextStep('professional');
                }
            },
            toggleNetworkFormatSize: function (e) {//网络格式的转码大小
                e && e.preventDefault() && e.stopPropagation();
                var $current = this.$(e.target);//当前选中项
                var $sizeGroup = this.$(".js-network-format-size-group");//所有转码大小
                //样式设置
                $sizeGroup.removeClass("active");
                $current.addClass("active");
                var custom = this.$(this.ui.numWidth).val() + '×' + this.$(this.ui.numHeight).val();
                var networkFormatSize = $current.data("size") || custom;
                _.extend(this.params, { networkFormatSize: networkFormatSize });
                this.isShowNextStep('network');
            },
            toggleNetworkFormat: function(e) { //网络格式的转码格式
                e && e.preventDefault() && e.stopPropagation();
                var self = this;
                this.$(e.target).toggleClass("active");
                var networkFormats = [];
                var $networkFormats = this.$(".js-network-format-group");
                _.forEach($networkFormats, function($format) {
                    $format = self.$($format);
                    if ($format.hasClass("active")) {
                        networkFormats.push($format.data("format"));
                    }
                });
                _.extend(this.params, { networkFormats: networkFormats });
                this.isShowNextStep('network');

            },
            toggleFormatSelected: function (e) {//选择转码格式
                e && e.preventDefault() && e.stopPropagation();                
                var $current = this.$(e.target);
                var $formatGroup = this.$el.find(".js-format-group");
                $formatGroup.removeClass("active");
                $current.addClass("active");
                var formatSelected = $current.data("format");                
                _.extend(this.params, { selectedFormat: formatSelected });
            },
            nextStep: function (e) {//下一步
                e && e.preventDefault() && e.stopPropagation();                              
                if (this.currentStep === this.steps.firstStep) {//设置第一步的下一步
                    if (this.params.selectedFormat && this.params.selectedFormat === "NetWorkFormat") {
                        this.currentStep.nextStep = "networkFormatStep";
                    } else if (this.params.selectedFormat && this.params.selectedFormat === "ProfessionalFormat") {
                        this.currentStep.nextStep = "professionalFormatStep";
                    }
                }
                if (this.currentStep.nextStep === "lastStep") {
                    if (this.params.selectedFormat && this.params.selectedFormat === "NetWorkFormat") {
                        this.steps.lastStep.preStep = "networkFormatStep";
                    } else if (this.params.selectedFormat && this.params.selectedFormat === "ProfessionalFormat") {
                        this.steps.lastStep.preStep = "professionalFormatStep";
                    }
                }
                this.currentStep = this.steps[this.currentStep.nextStep];
                this.renderStep();
            },
            previousStep: function (e) {//上一步
                e && e.preventDefault() && e.stopPropagation();
                this.currentStep = this.steps[this.currentStep.preStep];   
                this.renderStep();
            },
            renderStep: function () {
                var data = this.serializeData();//获取模板数据  
                var template = Handlebars.compile(this.$el.find(this.currentStep.template).html());
                this.$el.find(".js-view").empty().append(template(data));
                //根据网络/专业 格式进行赋值
                if (this.currentStep == this.steps.lastStep) {
                    if (this.currentStep.preStep == 'networkFormatStep') {
                        this.$('.js-targetFormat').html(this.params.networkFormats.join('/ '));
                        this.$('.js-targetFormatSize').html(this.params.networkFormatSize);
                    }
                    if (this.currentStep.preStep == 'professionalFormatStep') {
                        this.$('.js-targetFormat').html(this.params.professionalFormats.join('/ '));
                        this.$('.js-targetFormatSize').html(this.params.professionalFormatSize);
                    }
                }


                var helperFunc = function() {
                    
                }

                //注册点击累加/累减事件
                var self = this, timer = null;
                this.$([this.ui.minus, ',', this.ui.add].join('')).mousedown(function(e) {
                    var type = self.$(e.target).data('group');
                    var func = self.$(e.target).data('func');
                    var i = 0, j = 0, iOriginal = 0, jOriginal = 0, percent = 0;
                    i = iOriginal = self.$(self.ui.numWidth).val(); //宽 
                    j = jOriginal = self.$(self.ui.numHeight).val(); //高

                    timer = setInterval(function() {
                        if (type == 'width') {
                            func == 'minus' ? --i : ++i;
                            percent = i / iOriginal;
                        } else {
                            func == 'minus' ? --j : ++j;
                            percent = j / jOriginal;
                        }
                        self.showValue(type, i, j, percent);
                    }, 50);
                }).mouseup(function(e) {
                    clearTimeout(timer);
                });
            },
            //高宽联动
            showValue: function (type, i, j, percent) {
                if (type === 'width') {
                    j = Math.round(j * percent);
                    this.$(this.ui.numWidth).val(i);
                    this.$(this.ui.numHeight).val(j);
                } else {
                    i = Math.round(i * percent);
                    this.$(this.ui.numWidth).val(i);
                    this.$(this.ui.numHeight).val(j);
                }

                //重新装载参数
                var custom = this.$(this.ui.numWidth).val() + '×' + this.$(this.ui.numHeight).val();
                _.extend(this.params, { networkFormatSize: custom });
            },
            steps:{
                firstStep: {//第一步
                    preStep: null,//无上一步，默认为null                        
                    nextStep: null,//无下一步，供用户选择
                    template:"#formatSelecte"
                },
                networkFormatStep: {//网络格式设置
                    preStep: "firstStep",//默认为第一步                        
                    nextStep: "lastStep",//无下一步，供用户选择
                    template:"#setNetworkFormat"
                },
                professionalFormatStep: {//专业格式设置
                    preStep: "firstStep",//默认为第一步                        
                    nextStep: "lastStep",//无下一步，供用户选择
                    template:"#setProfessionalFormat"
                },
                lastStep: {
                    preStep: null,//无上一步，供用户选择后动态设置                        
                    nextStep: null,//无下一步，供用户选择
                    template:"#sureFormatInfo"
                }               
            },
            onRender: function () {//渲染之后
                var steps = this.steps;
                this.currentStep = steps.firstStep;
                _.extend(this.params, { selectedFormat: "NetWorkFormat" });//默认为
                console.log("You has selected the formate : " + this.params.selectedFormat);
                this.renderStep();//初始化当前步骤
            },
            onShow: function() {
                
            },
            submit: function (e) {
                var self = this;
                e && e.stopPropagation() && e.preventDefault();
                _.extend(this.params, { 'entityName': self.materials.name, 'contentId': self.materials.contentID });
                this.trigger('create:clip:transform', this.params);
            }
        });

        //转码下载
        Dialog.Transformdownload = Backbone.Modal.extend({
            template: Marionette.TemplateCache.get("mycloud/mycloud-dialog-transformdownload"),
            cancelEl: ".close",
            submitEl: "#wf",
            initialize: function (options) {
                options || {};
                var self = this;
                this.params = options.list;
                //是否有继续转码按钮功能
                this.isShowContinue = options.isShowContinue == false ? options.isShowContinue : true;
                _.map(self.params, function (item) {
                    item.fileType = item.fileType.substr(-3);
                    return item;
                });
                this.model = JSON.stringify(this.params);//modal插件需要string

                self.$('.trans-copy').zclip({
                    path: 'js/libs/ZeroClipboard.swf',
                    copy: function () {
                        var contentid = self.$(this).data('contentid');
                        var url = config.upLoadRESTfulIp + "/api/getfile/" + contentid;
                        return url;
                    },
                    beforeCopy: function () {
                    },
                    afterCopy: function (e1) {
                        alert('已经复制到剪贴板.');
                        console.log(' 已经复制到剪贴板');
                    }
                });
            },
            events: {
                "click .trans-down": "download"
                //"click .transformdownload .trans-copy": "copyurl"
            },
            download: function(e) {
                e && e.stopPropagation() && e.preventDefault();
                var contentid = this.$(e.target).data('contentid');
                var url = config.upLoadRESTfulIp + "/api/getfile/" + contentid;
                window.open(url,'_self');
                
            },
            submit: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                this.isShowContinue ? this.trigger('continue:alert:transform', {}) : null;
            },
            onRender: function () {
                var self = this;
                jQuery('.transformdownload .trans-copy').zclip({
                    path: 'js/libs/ZeroClipboard.swf',
                    copy: function () {
                        var contentid = self.$(this).data('contentid');
                        var url =  config.upLoadRESTfulIp + "/api/getfile/" + contentid;
                        return url;
                    },
                    beforeCopy: function () {
                    },
                    afterCopy: function (e1) {
                        alert( '已经复制到剪贴板.');
                        console.log('已经复制到剪贴板');
                    }
                });
            },
            onShow: function () {
                //显示/隐藏
                var self = this;
                var netWorkFormat = false, professionalFormat = false;
                $.each(this.serializeData(), function (i, item) {
                    if (item.transcodeType == 1) netWorkFormat = true;
                    else professionalFormat = true;
                    
                });
                netWorkFormat ? this.$('.download-network').show() : null;
                professionalFormat ? this.$('.download-definition').show() : null;
                this.isShowContinue ? null : this.$el.find('#wf').val('关闭');
            }
        });

        //播放器
        Dialog.Player = Backbone.Modal.extend({
            template: function () {
                var type = this.params.entityTypeName.toLowerCase();
                if (type === "clip" || type === "audio")
                    return Marionette.TemplateCache.get("mycloud/mycloud-dialog-player");
                else
                    return Marionette.TemplateCache.get("mycloud/mycloud-dialog-other");
            }, 
            cancelEl: '.close',
            initialize: function (options) {
                options || {};
                var self = this;
                this.params = options.params;
                this.view = options.view;
                document.fullScreenEnabled = true;//禁用全屏
                //this.listenTo(this.params, "change:isFavorite", function (model, value, options) {
                //    this.render();
                //});

                this.listenTo(CloudMamManager, 'set:favorite:toggle', function (option) {
                    //更新本地参数
                    self.params.isFavorite = option.isFavorite;//0:false/ 1:true
                    if (option.isFavorite) {
                        self.$el.find(".favorites").addClass("active");
                    } else {
                        self.$el.find(".favorites").removeClass("active");
                    }
                });

            },
            events: {
                "click .download a": "download",
                "click .favorites": "collect"
            },
            download: function (e) {},
            collect:function(event) {
                var isFavorite = this.params.isFavorite;
                if(isFavorite){
                    $(event.currentTarget).removeClass("active");
                } else {
                    $(event.currentTarget).addClass("active");
                }

                //兼容任务管理-合成
                if (this.view)
                    this.view.trigger("set:favorite:toggle", this.view.SelectedItemViews[0].model);
                else
                    this.trigger("set:favorite:toggle", { contentId: this.params.contentID, isFavorite: this.params.isFavorite });
                
            },
            onShow: function () {
                this.$('.js-title').html(this.params.name);
                this.$('.js-title').attr( 'title',this.params.name);
                this.$('.js-creator').html(this.params.creator);
                this.$('.js-createTime').html(this.params.createTime);
                this.$('.js-size').html(this.params.fileSize);
                var type = this.params.entityTypeName.toLowerCase();

                //同步收藏选中状态
                var isFavorite = this.params.isFavorite;//this.view.SelectedItemViews[0].model.get("isFavorite");
                if(isFavorite){
                    this.$el.find(".favorites").addClass("active");
                } else {
                    this.$el.find(".favorites").removeClass("active");
                }

                if (type == 'clip') {
                    this.$('.js-bitrate').html(this.params.videobitrate);
                    this.$('.js-ratio').html(this.params.aspect);
                }
                else if (type == 'audio') {
                    console.log('this.params.samplesrate:'+this.params.samplesrate);
                    this.$('.js-bitrate').html(this.params.samplesrate);
                    this.$('.js-ratio-li').hide();
                }

                this.$('.download a').attr('href', config.upLoadRESTfulIp + "/api/getfile/" + this.params.contentID);

                var self = this;
                var type = this.params.entityTypeName.toLowerCase();
                var mediaPlayAddress = this.params.mediaPlayAddress;
                if (type === "clip" || type === "audio") {
                    //初始化播放器
                    document.createElement('video'); document.createElement('audio'); document.createElement('track');
   
                    var video = document.getElementById("cloud_video");
                    
                    if (!mediaPlayAddress)
                        video.poster = 'images/manage/canot-view.jpg';
                    else {
                        if (type == 'audio') {
                            video.poster = 'images/manage/audio-default.jpg';
                            video.onplay = function (e) {
                                video.poster = 'images/manage/audio-default.jpg';
                            };
                            video.onpause = function (e) {
                                video.poster = 'images/manage/audio-default.jpg';
                            };
                        }
                        else
                            video.poster = self.params.keyFramePath;
                    }
                   
                    video.src = self.params.mediaPlayAddress;
                    video.onloadeddata = function () {
                        //video.play();
                    };
                    video.ontimeupdate = function () {
                        //video.play();
                    };
                    
                } else {
                    if (mediaPlayAddress)
                        this.$('.player .player_left').css('background-image', 'url(' + self.params.mediaPlayAddress + ')');
                    else
                        this.$('.player .player_left').css('background-image', 'url(images/manage/canot-view.jpg)');
                }

            }
        });

        //cut创建对话框
        Dialog.CutForm = Backbone.Modal.extend({
            template: Marionette.TemplateCache.get("mycloud/mycloud-dialog-cutform"),
            //submitEl: ".wf",
            cancelEl: ".close",
            initialize: function (options) {
                options || {};
                var self = this;
                this.cansubmit = true;
                //是否编辑模式标识
                this.isModifyType = options.isModifyType ? true : false;
                this.model = JSON.stringify({ isModifyType: this.isModifyType });
                this.otherInfo = options.otherInfo;
                this.list = options.list;
                 this.frameRate = this.list[0].frameRate;
                this.videoFormat = this.list[0].videoFormat;
                _.map(this.list, function(obj) {
                    if (self.frameRate != obj.frameRate || self.videoFormat != obj.videoFormat) {
                        self.cansubmit = false;
                        return obj.cancut = false;
                    }
                    else
                        return obj.cancut = true;
                });

            },
            events: {
                "click #modify": "cutModify",
                "click #delete": "cutDelete",
                "click #create":"createCut",//点击创建
                "click .cut-img": "deleteItem",
                "keyup .js-edit-name": "checkNameEmpty",//检查名称是否为空
                "keyup .js-edit-desc": "checkDescriptionEmpty"//检查描述是否为空
            },
            checkNameEmpty: function (e) {
                e.preventDefault() && e.stopPropagation();
                var $el = this.$el.find(".js-name-tooltip");
                var name = this.$el.find('.js-edit-name').val();
                name ? $el.hide() : $el.show();
            },
            checkDescriptionEmpty: function (e) {
                e.preventDefault() && e.stopPropagation();
                var $el = this.$el.find(".js-desc-tooltip");
                var desc = this.$el.find('.js-edit-desc').val();
                desc ? $el.hide() : $el.show();
            },
            deleteItem: function (e) {
                e.preventDefault() && e.stopPropagation();
                var self = this;
                var $el = this.$(e.target).parent('li');
                var contentId = $el.data('code');
                //过滤出来                                
                var templist = [];
                _.forEach(this.list, function (item) {//隐藏删除的素材                    
                    if (contentId === item.ContentID) {
                        $el.hide();
                    } else {
                        templist.push(item);//需要创建cut的素材
                    }
                });
                this.list = templist;
                
                _.map(this.list, function (obj) {
                    if (self.frameRate != obj.frameRate || self.videoFormat != obj.videoFormat)
                        self.cansubmit = false;
                    else
                        self.cansubmit = true;
                });
                if (this.list.length === 0) {
                    this.showEmpty();
                }
                this.showFileCount();
                this.checkSubmitBtn();
            },
            showFileCount: function () {
                this.$el.find(".js-count").text(this.list.length);
                this.list.length == (0 || 1) ? this.$('.file_box ul li').css({ 'border-bottom': '0' }) : this.$('.file_box ul li').css({ 'border-bottom': '1px solid #5E5C5C' });
            },
            showEmpty: function () {//显示空素材提示
                var emptyHtml = "<span class='emptyitem js-empty-item empty-material'>已经没有素材了！</span>";
                this.$el.find(".js-cut-filelist").append(emptyHtml);
            },
            onRender: function() {
                //编辑模式
                if (this.isModifyType && this.otherInfo) {
                    this.$el.find('.js-edit-name').val(this.otherInfo.name);
                    this.$el.find('.js-edit-desc').val(this.otherInfo.description);
                }
            },
            onShow: function () {
                //刷新页面
                var template = "";
                //编辑模式不能删除素材
                var deleteTmpl = this.isModifyType ? '' : '<img src="images/edit_cut/trash.png" class="cut-img">';
                _.forEach(this.list, function (value, key, list) {
                    if (value.cancut)
                        template += '<li data-code="' + value.ContentID + '" class="remove"><a href="#"><img class="vm vm-style" src="' + value.keyFramePath + '"></a><span class="f14 material-name"><b>' + value.name + '</b></span>' + deleteTmpl + '</li>';
                    else
                        template += '<li data-code="' + value.ContentID + '" class="remove"><a href="#"><img class="vm vm-style" src="' + value.keyFramePath + '"></a><span class="f14 material-name"><b class="dif-name">' + value.name + '</b> <i class="prompt"> 帧率与第一个素材不一致！</i></span><img src="images/edit_cut/trash.png" class="cut-img wrong-img"></li>';
                });
                this.$(".js-cut-filelist").append(template);
                this.showFileCount();
                this.checkSubmitBtn();
            },
            checkSubmitBtn: function () {
                //码率不同的素材需要删除完才能创建cut
                this.cansubmit ? this.$('#wf').removeClass('disable').attr('disabled', false) : this.$('#wf').addClass('disable').attr('disabled', true);
            },
            cutModify: function () {
                var name = this.$el.find('.js-edit-name').val();
                var desc = this.$el.find('.js-edit-desc').val();
                if (!(name && desc && this.list.length)) {
                    this.$('.js-tooltip').show();
                    return;
                }
                var options = { name: name, desc: desc, id: this.otherInfo.id };
                this.trigger('cut:update', options);
            },
            cutDelete: function () {
                this.trigger('cut:delete', { id: this.otherInfo.id });
            },
            createCut: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                var self = this;
                //console.log('开始创建cut...,开始保存cut原始数据...');
                var name = this.$el.find('.js-edit-name').val();
                var desc = this.$el.find('.js-edit-desc').val();
                if (!(name && desc && this.list.length)) {
                    this.$('.js-tooltip').show();
                    return;
                }
                var options = { name: name, desc: desc, data: this.list };//{name: "sss", desc: "sss", data: Array[2]}

                utility.localStorage.SaveCutId(options);
                //var localstorage = new Store('create_cut');
                //localstorage.create({ id: 'create_cut_data', name: name, desc: desc, data: self.list });
                window.open('myspace.html#cut/show/default', '_blank');
                this.close();
            }
        });

        //创建视频审阅对话框
        Dialog.EditForm = Backbone.Modal.extend({
            template: Marionette.TemplateCache.get("mycloud/mycloud-dialog-editform"),
            submitEl: "#wf",
            cancelEl: ".close",
            initialize: function (options) {
                options || {};
                this.list = _.clone(options.list);
            },
            events: {
                "click #wf": "",//创建
                "click .cut-img": "deleteItem",
                "keyup .js-edit-name": "checkNameEmpty",//检查名称是否为空
                "keyup .js-edit-desc": "checkDescriptionEmpty"//检查描述是否为空
            },
            checkNameEmpty: function (e) {
                e.preventDefault() && e.stopPropagation();
                var $el = this.$el.find(".js-name-tooltip");
                var name = this.$el.find('.js-edit-name').val();
                name ? $el.hide() : $el.show();
            },
            checkDescriptionEmpty: function (e) {
                e.preventDefault() && e.stopPropagation();
                var $el = this.$el.find(".js-desc-tooltip");
                var desc = this.$el.find('.js-edit-desc').val();
                desc ? $el.hide() : $el.show();
            },
            deleteItem: function (e) {
                e.preventDefault() && e.stopPropagation();
                var $el = this.$(e.target).parent('li');
                var contentId = $el.data('code');
                //过滤出来                                
                var templist = [];
                _.forEach(this.list, function (item) {//隐藏删除的素材                    
                    if (contentId === item.ContentID) {
                        $el.hide();
                    } else {
                        templist.push(item);
                    }
                });
                this.list = templist;
                if (this.list.length === 0) {
                    this.showEmpty();
                }
                this.showFileCount();
            },
            showFileCount: function () {
                this.$el.find(".js-count").text(this.list.length);
            },
            showEmpty: function () {//显示空素材提示
                var emptyHtml = "<li class='emptyitem js-empty-item'>已经没有素材了！</li>";                
                this.$el.find(".js-edit-filelist").append(emptyHtml);
            },
            onShow: function () {
                //刷新页面
                var template = "";
                _.forEach(this.list, function (value, key, list) {
                    template += '<li data-code="' + value.ContentID + '"><a href="#" class="ml10"><img class="vm vm-style" src="' + value.keyFramePath + '"></a><span class="ml20 f14"><b>' + value.name + '</b></span></li>';//<img src="images/edit_cut/trash.png" class="cut-img">
                });
                this.$el.find(".js-edit-filelist").append(template);
                this.showFileCount();
            },
            submit: function () {
                //window.open("templates/desc/desc.html", "_blank");
                var name = this.$el.find('.js-edit-name').val();
                var desc = this.$el.find('.js-edit-desc').val();
                if (!(name && desc && this.list.length)) {
                    this.$('.js-tooltip').show();
                    return;
                }
                var options = { name: name, desc: desc, contentId: this.list[0].ContentID, user: [] };//{ userCode: utility.localStorage.getUserInfo().userCode }

                utility.localStorage.SaveReviewInfo(options);
                window.open('myspace.html#review/show/default', '_blank');
                this.close();
            }

        });


        //下载对话框
        Dialog.DownloadForm = Backbone.Modal.extend({
            template: Marionette.TemplateCache.get("mycloud/mycloud-dialog-downloadform"),
            submitEl: ".close",
            initialize: function (options) {
                options || {};
                this.list = options.list;
            },
            onShow: function () {
                //刷新页面
                var template = "";
                _.forEach(this.list, function (value, key, list) {
                    template += "<div class='download-div'> <a class='download-name' href='" + config.upLoadRESTfulIp + "/api/getfile/" + value.ContentID + "' width='351'>" + value.name + "</a>" +
                        " <a class='download-adress' href='" + config.upLoadRESTfulIp + "/api/getfile/" + value.ContentID + "'></div>";
                });
                this.$(".bbm-modal__section").append(template);
            }
        });

        //移动到对话框
        Dialog.MoveToForm = Backbone.Modal.extend({
            template: Marionette.TemplateCache.get("mycloud/mycloud-dialog-movetoform"),
            submitEl: ".js-submit",
            cancelEl: ".close",
            initialize: function (options) {
                options || {};
                this.list = options.list;//获取移动列表
                this.treeView = null;
            },
            events: {
                "click .js-newfolder": "addNewFolder",
                "click .js-sumbit": "moveToFolder"
            },
            addNewFolder: function () {//新增文件夹
                var treeView = this.treeView;                
                if (treeView) {//执行新增文件夹方法
                    treeView.addNewFolder();
                }
            },
            moveToFolder: function () {//移动到文件夹
                console.log("moveToFolder");
                var self = this;
                var treeView = this.treeView;
                if (treeView) {//执行新增文件夹方法
                    if (treeView.moveToFolder(this.list)) {
                        this.close();
                    } else {
                        this.$el.find(".js-tooltip").show();                        
                        setTimeout(function () {
                            self.$el.find(".js-tooltip").hide();
                        }, 5000);
                    }
                }
            },
            onShow: function () {
                //初始化隐藏提示
                this.$el.find(".js-tooltip").hide();
                // Render view
                var self = this;
                require(["apps/mycloud/dialog/tree_view"], function (Tree) {//请求目录树形结构
                    var collection = new Tree.NodeCollection([
                                       { id: 0, name: '根文件夹', children: [], parentId: -1, code: -1 }
                    ]);

                    // Instantiate a TreeView on the root
                    var treeView = new Tree.View({
                        el: '.bbm-modal__section',
                        model: collection.get(0),
                        collection: collection
                    });

                    treeView.render();                    
                    treeView.loadChildrenNode(treeView.model);//默认加载根文件下的目录
                    collection.toggleSelected(treeView.model);//默认选中根节点
                    treeView.toggleCollapse();

                    self.treeView = treeView;//赋值当前树形图
                    //self.collection = collection;//赋值当前树形图数据
                });
            }
        });

        //提示对话框
        Dialog.TooltipForm = Backbone.Modal.extend({
            template: Marionette.TemplateCache.get("mycloud/mycloud-dialog-tooltipform"),
            submitEl: ".js-submit",
            cancelEl: ".close",
            initialize: function (options) {
                options || {};
                this.message = options.message;//获取信息
                this.isErrorMsg = options.isErrorMsg ? true : false;
            },
            events: {
                "click .close": "onCloseClick",
                "click .js-sumbit": "onCloseClick"
            },
            onCloseClick: function () {//点击关闭
                this.close();
            },
            onShow: function () {//显示
                this.$el.find(".js-message").text(this.message);
                this.isErrorMsg ? this.$el.find('.caption').html('错误信息') : null;
            }
        });

    });

    return CloudMamManager.MyCloudApp.Dialog;
});