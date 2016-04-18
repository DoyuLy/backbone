define(["app", "apps/common/views", "config", "jquery-ui", "tooltipster"], function (CloudMamManager, CommonViews, config) {
    CloudMamManager.module("MyCloudApp.List.View", function (View, CloudMamManager, Backbone, Marionette, $, _) {


        View.RightLayout = Marionette.Layout.extend({
            template: "mycloud/mycloud-right-layout",

            regions: {
                topNavRegion: ".topnav", 
                sideBarRegion: ".sidebar",
                detailsRegion: ".details"
            }
        });


        View.PaginatedView = Marionette.Layout.extend({
            template: "common/mycloud-pager-layout",
            regions: {
                paginationPanelRegion: ".panel", 
                paginationMainRegion: ".content", 
                paginationControlsRegion: ".page"
            },

            initialize: function (options) {

                this.collection = options.collection;
                this.panelView = options.panelView;
                this.listView = options.listView;  
                this.controls = new CommonViews.PaginationControls({
                    paginatedCollection: this.collection
                });
                var eventsToPropagate = options.propagatedEvents || [];

                var self = this;
                this.listenTo(this.controls, "page:change", function (page) {
                    self.trigger("page:change", page);
                });


        
                _.each(eventsToPropagate, function (event) {
                    self.listenTo(self.listView, event, function (view, model) {
                        self.trigger(event, view, model);
                    });
                });

                this.on("show", function () {
                    this.paginationPanelRegion.show(self.panelView);
                    this.paginationMainRegion.show(self.listView);
                    this.paginationControlsRegion.show(self.controls);
                });
            }
        });



        View.FolderView = Marionette.ItemView.extend({
            tagName: "div",
            className: "fix",
            template: "mycloud/mycloud-foldernav-list",
            initialize: function (options) {//初始化

                //当前记住子目录的数组
                this.subFolderItems = [];//记录{folderCode,folderName,parentFolderCode}三个数据
                ////时间排序的方向
                this.timeOrderDirection = false;
                ////名称排序的方向
                this.nameOrderDirection = false;
                //监听刷新类型
                this.listenTo(CloudMamManager, "materials:type:refresh", function (options) {
                    this.$("a.js-root").text(options.typeName);
                    this.subFolderItems = [];
                    this.renderSubFolders();//刷新下级子文件夹
                });
            },
            events: {
                "click .js-goback": "gotoCurrentParentFolder",
                "click .js-root": "gotoRootFolder",
                "click .js-tree a": "gotoCurrentFolder",
                "click .js-time": "toggleOrder",//"toggleTimeOrder",
                "click .js-name": "toggleOrder",//"toggleNameOrder",
                "click .js-pagesize li": "setPageSize"
            },
            onRender: function () {//显示默认
                var navTypeName = CloudMamManager.request("navtypename:entities", CloudMamManager.navType);
                this.$("a.js-root").text(navTypeName);
                if(location.hash.indexOf("folderCode")){    //路由中要包含有folderCode字符串才触发
                    this.trigger("onRender:folderLevel");
                }
            },
            toggleOrder: function(e) {
                e && e.stopPropagation() && e.preventDefault();
                var orderName = this.$(e.target).data("sort");
                if (orderName === 'createtime') {
                    this.timeOrderDirection = !this.timeOrderDirection;
                    if (this.timeOrderDirection) {
                        this.$(e.target).text("时间 ↑").addClass('selected').next('a').removeClass('selected');
                        this.trigger("toggle:sort", { sort: orderName, order: 1 });
                    } else {
                        this.$(e.target).text("时间 ↓").addClass('selected').next('a').removeClass('selected');
                        this.trigger("toggle:sort", { sort: orderName, order: -1 });
                    }
                } else {
                    this.nameOrderDirection = !this.nameOrderDirection;
                    if (this.nameOrderDirection) {
                        this.$(e.target).text("名称  ↓").addClass('selected').prev('a').removeClass('selected');
                        this.trigger("toggle:sort", { sort: orderName, order: -1 });
                    } else {
                        this.$(e.target).text("名称  ↑").addClass('selected').prev('a').removeClass('selected');
                        this.trigger("toggle:sort", { sort: orderName, order: 1 });
                    }                        
                }
            },

            setPageSize: function (e) {//设置页面大小
                e && e.stopPropagation() && e.preventDefault();
                //var pageSize = 30;// To Do 需要获取DOM上的数据
                var pageSize = this.$(e.target).data("pagesize");
                this.$('.js-pagesize .counthide').toggleClass('none').prev('span').text(pageSize + ' ∨');
                this.trigger("set:page:size", pageSize);
            },
            gotoCurrentParentFolder: function (e) {//返回上一级
                e && e.stopPropagation() && e.preventDefault();
                if (this.subFolderItems.length) {
                    var currentFolder = this.subFolderItems.pop();//返回最后一个元素
                    //ToDo 使用folderCode
                    //if (currentFolder.parentFolderCode == null) { currentFolder.parentFolderCode = -1; }
                    var current = "";
                    if (this.subFolderItems.length > 0)
                        current = this.subFolderItems[this.subFolderItems.length - 1].folderCode;

                    this.gotoFolder(current);//(currentFolder.parentFolderCode);
                }
            },
            gotoRootFolder: function (e) {//根目录
                e && e.stopPropagation() && e.preventDefault();
                if (this.subFolderItems.length) {
                    var currentFolder = this.subFolderItems.pop();//返回最后一个元素
                    this.subFolderItems = [];//清空整个数组
                    this.renderSubFolders();
                    this.gotoFolder("");
                }
            },
            gotoCurrentFolder: function (event) {//跳转到指定的Folder
                if (this.subFolderItems.length) {
                    var currentFolder = $(event.currentTarget);    //获取A元素节点
                    var folderCode = currentFolder.attr("foldercode");

                    var index = _.indexOf(_.pluck(this.subFolderItems, "folderCode"), folderCode);
                    this.subFolderItems.splice(index + 1, this.subFolderItems.length - (index + 1));
                    this.gotoFolder(folderCode);
                }
                return false;
            },
            gotoFolder: function (folderCode) {//选择当前目录
                this.trigger("goto:folder", folderCode);
            },
            addSubFolder: function (folder) {//新增子目录
                //console.log("enter addSubFolder!");

                if (!_.contains(_.pluck(this.subFolderItems, "folderCode"), folder.folderCode)) {
                    this.subFolderItems.push(folder);
                    this.renderSubFolders();//刷新当前目录
                }
            },
            renderSubFolders: function () {//刷新当前目录
                //清空目录
                var subFolders = this.$el.find(".js-tree");
                subFolders.empty();
                var template = "";
                var self = this;
                _.forEach(this.subFolderItems, function (folder, index) {
                    if (index == (self.subFolderItems.length - 1))
                        template += "<span>&gt;</span><a href='javascript:void(0);' foldercode='" + folder.folderCode + "'><b>" +  folder.folderName + "</b></a>";
                    else
                        template += "<span>&gt;</span><a href='javascript:void(0);' foldercode=" + folder.folderCode + ">" + folder.folderName + "</a>";
                });
                subFolders.append(template);
            }
        });

        //topNav
        View.TopNav = Marionette.ItemView.extend({
            tagName: "ul",
            className: "fix",
            template: "mycloud/mycloud-topnav",            
            ui: {
                "upload": "a.doc",
                "newfolder": "a.file",
                "download": "a.cloud",
                "delete": "a.rubbish",
                "more": "a.more",
                "spread": "a.spread",
                "rename": "a.rename",
                "move": "a.move",
                "recover": "a.recover",
                "remove": "a.rremove",
                "removeall": "a.removeall"
            },
            events: {
                "click @ui.upload": "onUploadClick",
                "click @ui.newfolder": "onNewFolderClick",
                "click @ui.download": "onDownloadClick",
                "click @ui.delete": "onDeleteClick",
                "click @ui.spread": "onSpreadClick",
                "click @ui.rename": "onRenameClick",
                "click @ui.move": "onMoveClick",
                "click @ui.recover": "onRecoverClick",//恢复删除
                "click @ui.remove": "onRemoveClick",//彻底删除
                "click @ui.removeall":"onRemoveAllClick",//彻底全部删除
                "click li.setting-4" : "onMore"
            },
            initialize: function () {
                this.isSpread = false;//是否展开更多功能
                this.isSingleSelected = false;//是否材料已单选
                this.listenTo(CloudMamManager, "materials:selected:none", function () {
                    if (this.isSpread) {
                        this.triggerMethod("rename:disable");
                    }
                    this.isSingleSelected = false;
                });
                this.listenTo(CloudMamManager, "materials:selected:single", function () {
                    if (this.isSpread) {
                        this.triggerMethod("rename:enable");
                    }
                    this.isSingleSelected = true;
                });
                this.listenTo(CloudMamManager, "materials:selected:multi", function () {
                    if (this.isSpread) {
                        this.triggerMethod("rename:disable");
                    }
                    this.isSingleSelected = false;
                });
                this.listenTo(CloudMamManager, "materials:selected:reset", function () {//状态重置

                    if (this.isSpread) {
                        this.$("li.js-rename").show();
                    } else {
                        this.$("li.js-rename").hide();
                    }
                });
                this.listenTo(CloudMamManager, "materials:type:refresh", function (options) {
                    // 左边导航触发的事件，重新设置TOPNAV 需要的图标
                    options = options || {};
                    this.iconSettings(options.type);
                });
            },
            onRenameEnable: function () {
                if (this.isSpread) {
                    this.$("li.js-rename").show();
                } else {
                    this.$("li.js-rename").hide();
                }
            },
            onRenameDisable: function () {
                if (this.isSpread) {
                    this.$("li.js-rename").hide();
                }
            },
            iconSettings : function(options){
                var navType = options || this.options.navType;
                if (navType === "Favorite") {
                    this.$("li").show().not(".setting-2,.setting-3,.setting-5").hide().parent("ul").width("195");
                } else if (navType === "Recycle") {
                    this.$("li").show().not(":gt(6)").hide().parent("ul").width("195");
                } else {
                    this.$("li").show().not(":lt(5)").hide().parent("ul").width("460");
                }
            },
            onRender: function () {
                this.iconSettings();
            },
            onMore:function(event){
                var target = $(event.currentTarget).children("a");
                if( target.hasClass("more") ){
                    target.removeClass().addClass("spread");
                    $(event.currentTarget).siblings(":lt(6)").show();
                } else {
                    target.removeClass().addClass("more");
                    $(event.currentTarget).nextAll().hide();
                }
                return false;
            },
            onUploadClick: function (e) {
                e && e.stopPropagation() && e.preventDefault();
            },
            onNewFolderClick: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                this.trigger("topnav:newfolder");
            },
            onDownloadClick: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                CloudMamManager.trigger("topnav:download");
            },
            onDeleteClick: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                CloudMamManager.trigger("topnav:delete");
            },
            onRenameClick: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                CloudMamManager.trigger("topnav:rename");
            },
            onMoveClick: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                CloudMamManager.trigger("topnav:move");
            },
            onRecoverClick:function(e){//点击恢复删除
                e && e.stopPropagation() && e.preventDefault();
                CloudMamManager.trigger("topnav:recover");
            },
            onRemoveClick: function (e) {//点击彻底删除
                e && e.stopPropagation() && e.preventDefault();
                CloudMamManager.trigger("topnav:remove");
            },
            onRemoveAllClick: function (e) {//点击彻底全部删除
                e && e.stopPropagation() && e.preventDefault();
                CloudMamManager.trigger("topnav:removeall");
            }
        });

        //SiderBar
        View.SiderBar = Marionette.ItemView.extend({
            tagName: "li",
            template: "mycloud/mycloud-siderbar-item",
            ui: {
                "edit": "a.edit",//
                "copy": "a.copy",//
                "video": "a.video",//
                "music": "a.music",//
                "transform": "a.trans",//转码
                "miaoge": "a.miaoge"
            },
            events: {
                "click @ui.edit": "onEditClick",
                "click @ui.copy": "onClipClick",
                "click @ui.video": "onVideoClick",
                "click @ui.music": "onMusicClick",
                "click @ui.transform": "onTransformClick",
                "click @ui.miaoge": "onMiaogeClick"
            },
            pdsp: function (e) {
                e && e.stopPropagation() && e.preventDefault();
            },
            onEditClick: function (e) {
                this.pdsp(e);
                //this.toggleCssClass();    
                window.open('myspace.html#task/manage/cut', '_blank');
            },
            onClipClick: function (e) {
                this.pdsp(e);
                //this.toggleCssClass();//
                CloudMamManager.trigger("cut:clips");
            },
            onVideoClick: function (e) {
                this.pdsp(e);
                //this.toggleCssClass();//
                CloudMamManager.trigger("edit:siderbar");
                //CloudMamManager.trigger("copy:video");
            },
            onMusicClick: function (e) {
                this.pdsp(e);
                //this.toggleCssClass();//
                CloudMamManager.trigger("copy:music");
            },
            onTransformClick: function (e) {
                this.pdsp(e);
                CloudMamManager.trigger("copy:transform");
            },
            onMiaogeClick: function (e) {
                this.pdsp(e);
                CloudMamManager.trigger("copy:miaoge");
            },
            toggleCssClass: function () {
                var currentCss = this.$el.attr("class");
                this.$el.parent("ul").find("li").removeClass("hover");
                this.$el.addClass(currentCss);
                this.$el.toggleClass("hover");
            }
        });

        View.SiderBars = Marionette.CollectionView.extend({
            tagName: "ul",
            className: "fix",
            itemView: View.SiderBar
        });


        //转码、收藏操作
        View.Media = Marionette.ItemView.extend({
            tagName: "dl",
            className: "pic",
            template: "mycloud/mycloud-material-mediaItem",
            initialize: function () {
                //this.selected = false;
                this.isdbclick = false;
                this.listenTo(CloudMamManager, "topnav:rename", this.rename);//监听重命名
                this.listenTo(this.model, "change:isFavorite", function (model,value,options) {//监听model改变，刷新显示
                    this.model.get("isFavorite") == 1 ? this.ui.star.addClass("star_mark") : this.ui.star.removeClass("star_mark");
                });
            },
            attributes: {
                title: ""
            },
            ui: {
                "star": "div.star",
                "trans_star": "div.js-transform",
                "image": "dt",
                "title": "dd"
            },
            events: {

                "click @ui.image": "toggleSelecte",
                "click @ui.title": "toggleSelecte",
                "dblclick @ui.image": "play",
                "dblclick @ui.title": "play",
                "click @ui.star": "starToggle",
                "click @ui.trans_star": "transStarToggle",
                "mouseenter dt": "onMouseEnter",//鼠标移入
                "mouseleave dt": "onMouseLeave"//鼠标移出
            },
            //triggers: {
            //    "dblclick @ui.image": "item:play:box",
            //    "dblclick @ui.title": "item:play:box",
            //},
            onMouseEnter: function (e) {//鼠标移入
                e && e.stopPropagation() && e.preventDefault();
                this.ui.star.show();
                //this.ui.trans_star.show();
            },
            onMouseLeave: function (e) {//鼠标移出
                e && e.stopPropagation() && e.preventDefault();
                this.ui.star.hide();
                //this.ui.trans_star.hide();
            },
            starToggle: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                console.log("This has triggered 'favorite:toggle' event!");
                this.trigger("favorite:toggle");
            },
            trans_starToggle: function (e) {
                e && e.stopPropagation() && e.preventDefault();

                this.ui.trans_star.toggleClass("trans_star_mark");//�л���ʽ
                console.log("This has triggered 'favorite:toggle' event!");
                this.trigger("favorite:toggle");//��Ϊ�����ز�
            },
            transStarToggle: function (e) {
                //转码弹窗业务
                e && e.stopPropagation() && e.preventDefault();
                //事件定义在视图 View.Materials 的 itemEvents 中
                this.trigger("copy:video");
            },
            play: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                this.isdbclick = true;
                this.trigger("item:play:box", this);
            }, 
            toggleSelecte: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                var self = this;
                this.selected = !this.selected;
                this.$el.toggleClass('active').find('div.check').toggleClass('none');
                    if (e && e.ctrlKey) {
                        this.selected ? this.trigger("multi:add:selected:count", this) : this.trigger("multi:reduce:selected:count", this);
                        return;
                    }
                    this.selected ? this.trigger("add:selected:count", this) : this.trigger("reduce:selected:count", this);
            },
            rename: function () {
                var self = this;
                if (this.selected)
                    this.$el.find('.js-showname').hide().next('input').show().focus().blur(function () {
                        var value = self.$(this).val();
                        var el = self.$el.find('.js-showname');
                        self.$el.find('img').attr('title', value);
                        //el.html(value).attr('title', value).show().next('input').hide();
                        el.html(value).show().next('input').hide();
                        //self.trigger("materials:rename");//触发重命名
                        self.model.set('name', value);
                        self.model.save({ name: value, publicfolder: "" }, {
                            url: '/emc/entity/' + self.model.get('contentID')
                        });
                        //console.log('素材已更新...');
                    });
            },
            onRender: function () {
                var self = this;
                //是否有转码下载
                this.model.get('transcodeFileCount') > 0 ? null: this.ui.trans_star.remove();
                this.ui.star.hide();//初始化样式
                this.model.get("isFavorite") == 1 ? this.ui.star.addClass("star_mark") : null;
                if (this.$el && CloudMamManager.navType.toLowerCase() === "all") {//声明为可拖拽
                    this.$el.draggable({
                        revert: true, delay: 50, opacity: 0.8, snapMode: "inner", snapTolerance: 50, zIndex: 999, scroll:false,
                        helper: function () {
                            return $("<div class='cut-circle'>1</div>");
                        }, 
                        distance: 6, containment: "body", cursor: "move", cursorAt: { top: 22, left: 12 }
                    });
                }
                this.$('.tooltip').tooltipster({
                    animation: 'grow',
                    arrow: true,
                    content: function () {
                        return 'loading...';
                    },
                    delay: 200,
                    maxWidth: 200,
                    functionBefore: function (origin, continueTooltip) {
                        continueTooltip();
                        if (origin.data('ajax') !== 'cached') {
                            Backbone.ajax({
                                type: 'GET',
                                url:  config.dcmpRESTfulIp + "/emc/entity/" + self.model.get("contentID"),
                                success: function (data) {
                                    data = JSON.parse(data);
                                    var template = '<p class="tooltip-title">' + data.name + '<p>' +
                                                    '<div class="tooltip-detial">' +
                                                        '<span>创建者</span><i>' + data.creator + '</i></br>' +
                                                        '<span>创建时间</span><i>' + data.createTime + '</i></br>' +
                                                         '<span>文件大小</span><i>' + data.fileSize + '</i></br>' +
                                                        '<span>格式信息</span><i>' + data.videoFormat + '</i>' +
                                                    '</div>';

                                    origin.tooltipster('content', $(template)).data('ajax', 'cached');
                                }
                            });
                        }
                    },
                    //functionReady: function (origin, tooltip) { },
                    //functionAfter: function (origin) { },
                    interactive: true,
                    interactiveTolerance: 350,
                    onlyOne: true,
                    position: 'bottom',
                    speed: 350,
                    timer: 0,
                    theme: '.tooltipster-manange',
                    trigger: 'hover',
                    updateAnimation: true
                });
            },
            removeDOM: function () {
                if (this.selected && !this.isdbclick) {
                    var self = this;
                    //this.model.destroy();//ɾ�����
                    this.$el.fadeOut(function () {
                        self.model.destroy({
                            url: '/emc/entity/' + self.model.get('contentID')
                        });
                        Marionette.ItemView.prototype.remove.call(self);
                        console.log('素材已删除...');
                    });
                }
            }
        });

       
        View.Folder = Marionette.ItemView.extend({
            tagName: "dl",
            className: "pic",
            template: "mycloud/mycloud-material-folderItem",
            //timer: null,
            initialize: function () {
          
                //this.selected = false;
                this.isdbclick = false;
               
                this.listenTo(CloudMamManager, "topnav:rename", this.rename);
                //监听文件夹内文件数的改变
                this.listenTo(this.model, "change:entityCount", function () {
                    //console.log("This folder has changed the 'entityCount'.");
                    this.render();
                });
                //监听文件夹名称改变
                this.listenTo(this.model, "change:name", function () {
                    //console.log("This folder has changed the 'name'.");
                    this.render();
                });
            },
            events: {
                "click": "toggleSelecte",
                "dblclick": "goinfolder"
            },
            goinfolder: function (e) {

                this.isdbclick = true;
                this.trigger("folder:goin", this);
                return false;
            },
            toggleSelecte: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                //clearTimeout(this.timer);
                var self = this;
                //this.timer = setTimeout(function () {
                this.selected = !this.selected;
                this.$el.toggleClass('active').find('div.check').toggleClass('none');
                    //this.model.set("selected", true);
                    if (e && e.ctrlKey) {
                        this.selected ? this.trigger("multi:add:selected:count", this) : this.trigger("multi:reduce:selected:count", this);
                        return;
                    }
                    this.selected ? this.trigger("add:selected:count", this) : this.trigger("reduce:selected:count", this);
                //}, 30);           
            },            
            rename: function () {
                var self = this;
                if (this.selected) {
                    //this.$el.find('.js-showname').hide().next('input').show().focus();
                    //$('.pic>dd').delegate('.js-showname + input', 'keypress blur', function (e) {
                    //    var key = e.which;
                    //    if (key == 13) {
                    //    }
                    //});
                    var doNext = function (obj,e) {
                        var key = e ? e.which : "blur";
                        if (key == 13 || key == "blur") {
                            var value = self.$(obj).val();
                            var el = self.$el.find('.js-showname');
                            self.$el.find('img').attr('title', value);
                            //el.html(value).attr('title', value).show().next('input').hide();
                            el.html(value).show().next('input').hide();
                            //self.trigger("materials:rename");//触发文件夹重命名
                            //self.model.set('name', value);
                            if (self.model.isNew()) {//新建文件夹
                                self.model.save({ name: value }, {
                                    url: '/emc/folder'
                                });
                            } else {//已有文件夹                      
                                console.log("This model has 'ContentID' attribute!");
                                console.log(self.model);
                                self.model.save({ name: value, publicfolder: "" }, {
                                    url: '/emc/folder/' + self.model.get("contentID")
                                });
                            }
                        }
                    };
                    this.$el.find('.js-showname').hide().next('input').show().focus().blur(function () {
                        doNext(this);
                    });
                    this.$el.find('.js-showname').hide().next('input').show().focus().keypress(function (e) {
                        doNext(this, e);
                    });
                }
            },
            removeDOM: function () {
                if (this.selected && !this.isdbclick) {
                    var self = this;
                    //this.model.destroy();//ɾ�����
                    this.$el.fadeOut(function () {
                        if (self.model.get("entityCount") === 0) {
                            self.model.destroy({
                                url: '/emc/folder/' + self.model.get('contentID'),
                                success: function (model,res) { },
                                error: function(model,error) {
                                    var e = error;
                                }
                            });
                            Marionette.ItemView.prototype.remove.call(self);
                        } else {
                            CloudMamManager.trigger("materials:tooltip", "文件内有素材不能删除！");                            
                        }
                    });                    
                }
            },
            onRender: function () {
                var self = this;
                if (this.$el && CloudMamManager.navType.toLowerCase() === "all") {
                    this.$el.droppable({//声明为可移动到 target
                        drop: function (event, ui) {
                            //console.log(ui.draggable.find("img").attr("contentid"));
                            var contentID = ui.draggable.find("section").attr("contentid") || ui.draggable.find("img").attr("contentid");
                            var isFolder = (ui.draggable.find("section").attr("type") || ui.draggable.find("img").attr("type")) === "Folder";
                            if (!isFolder) {
                                CloudMamManager.trigger("move:entity:to:folder", { contentID: contentID, folderCode: self.model.get("contentID"), deleteView: ui.draggable, folderModel: self.model });//触发移动到事件                            
                            } else {
                                var entityCount = ui.draggable.find("i").text();//获取文件夹包含素材数量
                                CloudMamManager.trigger("move:folder:to:folder", { moveFolder: contentID, movetoFolder: self.model.get("contentID"), entityCount: entityCount, deleteView: ui.draggable, folderModel: self.model });//触发移动到事件
                            }
                        }
                    });                    
                    this.$el.draggable({//声明为可拖拽
                        revert: true, delay: 50, opacity: 0.8, snapMode: "inner", snapTolerance: 50, zIndex: 999, scroll: false,
                        helper: function () {
                            return $("<div class='cut-circle'>" + self.model.get("entityCount") + "</div>");
                        },
                        distance: 6, containment: "body", cursor: "move", cursorAt: { top: 22, left: 12 }
                    });
                }
            }
        });


        View.Other = Marionette.ItemView.extend({
            tagName: "dl",
            className: "pic",
            template: "mycloud/mycloud-material-otherItem",
            initialize: function () {
                //this.selected = false;
                this.isdbclick = false;
                this.listenTo(CloudMamManager, "topnav:rename", this.rename);
                this.listenTo(this.model, "change:isFavorite", function (model, value, options) {//监听model改变，刷新显示
                    this.model.get("isFavorite") == 1 ? this.ui.star.addClass("star_mark") : this.ui.star.removeClass("star_mark");
                });
            },
            ui: {
                "star": "div.star",
                "image": "dt",
                "title": "dd"
            },
            events: {
                "click @ui.image": "toggleSelecte",
                "click @ui.title": "toggleSelecte",                
                "click @ui.star": "starToggle",
                "dblclick @ui.image": "play",
                "dblclick @ui.title": "play",
                "mouseenter dt": "onMouseEnter",//鼠标移入
                "mouseleave dt": "onMouseLeave"//鼠标移出
            },
            //triggers: {
            //    "dblclick @ui.image": "item:play:box",
            //    "dblclick @ui.title": "item:play:box",
            //},
            onMouseEnter: function (e) {//鼠标移入
                e && e.stopPropagation() && e.preventDefault();
                this.ui.star.show();
            },
            onMouseLeave: function (e) {//鼠标移出
                e && e.stopPropagation() && e.preventDefault();
                this.ui.star.hide();
            },
            play: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                this.isdbclick = true;
                this.trigger("item:play:box", this);
            },
            starToggle: function (e) {
                e && e.stopPropagation() && e.preventDefault();

                //this.ui.star.toggleClass("star_mark");
                this.trigger("favorite:toggle");
            },


            toggleSelecte: function (e) {
                e && e.stopPropagation() && e.preventDefault();

                this.selected = !this.selected;
                this.$el.toggleClass('active').find('div.check').toggleClass('none');
                //this.model.set("selected", true);//����ģ��ѡ����Ϣ
                if (e && e.ctrlKey) {
                    this.selected ? this.trigger("multi:add:selected:count", this) : this.trigger("multi:reduce:selected:count", this);
                    return;
                }
                this.selected ? this.trigger("add:selected:count", this) : this.trigger("reduce:selected:count", this);
            },
            rename: function () {
                var self = this;
                if (this.selected)
                    this.$el.find('.js-showname').hide().next('input').show().focus().blur(function () {
                        var value = self.$(this).val();
                        var el = self.$el.find('.js-showname');
                        self.$el.find('dt').attr('title', value);
                        el.html(value).attr('title', value).show().next('input').hide();
                        //self.trigger("materials:rename");//触发文件夹重命名
                        self.model.set('name', value);
                        self.model.save({ name: value, publicfolder: "" }, {
                            url: '/emc/entity/' + self.model.get('contentID')
                        });
                    });
            },
            onRender: function () {
                var self = this;
                this.ui.star.hide();//初始化显示
                this.model.get("isFavorite") == 1 ? this.ui.star.addClass("star_mark") : null;
                if (this.$el && CloudMamManager.navType === "All") {//声明为可拖拽
                    this.$el.draggable({
                        revert: true, delay: 50, opacity: 0.8, snapMode: "inner", snapTolerance: 50, zIndex: 999, scroll: false,
                        helper: function () {
                            return $("<div class='cut-circle'>1</div>");
                        }, 
                        distance: 6, containment: "body", cursor: "move", cursorAt: { top: 20, left: 10 }
                    });
                }
                this.$('.tooltip').tooltipster({
                    animation: 'grow',
                    arrow: true,
                    content: function () {
                        return 'loading...';
                    },
                    delay: 200,
                    maxWidth: 200,
                    functionBefore: function (origin, continueTooltip) {
                        continueTooltip();
                        if (origin.data('ajax') !== 'cached') {
                            Backbone.ajax({
                                type: 'GET',
                                url:  config.dcmpRESTfulIp + "/emc/entity/" + self.model.get("contentID"),
                                success: function (data) {
                                    data = JSON.parse(data);
                                    // update our tooltip content with our returned data and cache it
                                    var template = '<p class="tooltip-title">' + data.name + '<p>' +
                                                    '<div class="tooltip-detial">' +
                                                        '<span>创建者</span><i>' + data.creator + '</i></br>' +
                                                        '<span>创建时间</span><i>' + data.createTime + '</i></br>' +
                                                        '<span>文件大小</span><i>' + data.fileSize + '</i>' +
                                                    '</div>';
                                    origin.tooltipster('content', $(template)).data('ajax', 'cached');
                                }
                            });
                        }
                    },
                    iconTheme: '.tooltipster-icon',
                    interactive: true,
                    interactiveTolerance: 350,
                    onlyOne: true,
                    position: 'bottom',
                    speed: 350,
                    timer: 0,
                    theme: '.tooltipster-default',
                    trigger: 'hover',
                    updateAnimation: true
                });
                
            },
            removeDOM: function () {
                if (this.selected && !this.isdbclick) {
                    var self = this;
                    this.$el.fadeOut(function () {
                        self.model.destroy({
                            url: '/emc/entity/' + self.model.get('contentID')
                        });
                        Marionette.ItemView.prototype.remove.call(self);
                    });
                }
            }
        });


        View.Add = Marionette.ItemView.extend({
            tagName: "dl",
            className: "pic",
            template: "mycloud/mycloud-material-defaultItem",
            remove: function () {
                var self = this;
                this.$el.fadeOut(function () {
                    Marionette.ItemView.prototype.remove.call(self);
                });
            },
            onRender: function () {
                var self = this;
                this.$el.fadeIn(function () {
                    Marionette.ItemView.render();
                });
            }
        });
        //Materials
        View.Materials = Marionette.CollectionView.extend({
            itemViewOptions: {
                selected: false
            },
            //emptyView: View.NullView,
            getEmptyView: function() {
                return CommonViews.NullView;
            },
            getItemView: function (item) {
                //console.log("Enter getItemView");
                var type = item.get('entityTypeName');
                switch (type) {
                    case "Folder":
                        return View.Folder;
                    case "Clip"://"media":
                        if (item.get("status") === -1) {
                            var fileTypeExt = item.get("fileTypeExt").toUpperCase();
                            item.set({ canShowSuffix: true, fileTypeExt: fileTypeExt }, { silent: true });
                        }
                        return View.Media;
                    case "add":
                        return View.Add;
                    default:
                        if (type === "Other" || type === "Audio"|| type==="Document" || item.get("status")=== -1) {
                            //console.log(item);
                            var fileTypeExt = item.get("fileTypeExt") ? item.get("fileTypeExt").toUpperCase() : null;

                            fileTypeExt = fileTypeExt == "UNKNOWN" || null ? "未知" : fileTypeExt;
                            item.set({ canShowSuffix: true, fileTypeExt: fileTypeExt }, { silent: true });
                        }
                        return View.Other;
                }
            },
            initialize: function () {
                
                this.SelectedItemViews = [];
                
                this.triggerState();
                //console.log(this.collection);
             
                             

                this.listenTo(CloudMamManager, "topnav:delete", this.removeFileOrFolder);
                this.listenTo(this.collection, "add", this.addNewFileOrNewFolder);
                //this.listenTo(this.collection, "remove", this.removeFileOrFolder);
        
                this.listenTo(CloudMamManager, "topnav:download", function () {

                    console.log("This has got 'topnav:download' event!");

                    var list = new Array();
                    _.forEach(this.SelectedItemViews, function (itemView) {
                        var model = itemView.model;
                        if (model.get('entityTypeName').toLowerCase() !== 'folder') {
                            var obj = { name: model.get("name"), ContentID: model.get("contentID") };
                            list.push(obj);
                        }
                    });
                    if (list.length) {
                        this.trigger("show:download:dialog", list);
                    }
                });
              
                this.listenTo(CloudMamManager, "topnav:move", function () {
                    console.log("This has got 'topnav:move' event!");

                    var list = new Array();
                    _.forEach(this.SelectedItemViews, function (itemView) {
                        var model = itemView.model;
                        var isFolder = model.get("entityTypeName") === "Folder";
                        list.push({ contentID: model.get("contentID"), isFolder: isFolder, view: itemView });
                    });
                    if (list.length) {
                        this.trigger("show:move:dialog", list);
                    }
                });
                this.listenTo(CloudMamManager, "edit:siderbar", function () {
                    var list = new Array();
                    _.forEach(this.SelectedItemViews, function (itemView) {
                        var model = itemView.model;
                        var obj = { name: model.get("name"), ContentID: model.get("contentID"), keyFramePath: model.get("keyFramePath"), entityTypeName: model.get('entityTypeName') };
                        list.push(obj);
                    });
                    if (list.length) {
                        this.trigger("show:edit:dialog", list);
                    }
                });
                this.listenTo(CloudMamManager, "cut:clips", function () {
                    var list = new Array();
                    var self = this;
                    _.forEach(self.SelectedItemViews, function (itemView) {
                        var model = itemView.model;
                        if (model.get("entityTypeName").toLowerCase() === "clip") {
                            var obj = { name: model.get("name"), ContentID: model.get("contentID"), keyFramePath: model.get("keyFramePath"), frameRate: model.get('frameRate'), videoFormat: model.get('videoFormat') };
                            list.push(obj);
                        }
                    });
                    if (list.length) {
                        this.trigger("show:cut:dialog", list);
                    }
                });

                //copy:video

                this.listenTo(CloudMamManager, "copy:video", function () {
                    var list = new Array();
                    var self = this;
                    _.forEach(self.SelectedItemViews, function (itemView) {
                        var model = itemView.model;
                        if (model.get("entityTypeName").toLowerCase() === "clip") {
                            var obj = { name: model.get("name"), ContentID: model.get("contentID"), keyFramePath: model.get("keyFramePath") };
                            list.push(obj);
                        }
                    });
                    if (list.length) {
                        this.trigger("show:transformdownload:dialog", list);
                    }
                });

                this.listenTo(CloudMamManager, "copy:transform", function () {
                    var list = new Array();
                    var self = this;
                    _.forEach(self.SelectedItemViews, function (itemView) {
                        var model = itemView.model;
                        if (model.get("entityTypeName").toLowerCase() === "clip") {
                            var obj = { name: model.get("name"), ContentID: model.get("contentID"), keyFramePath: model.get("keyFramePath") };
                            list.push(obj);
                        }
                    });
                    if (list.length) {
                        this.trigger("show:transform:dialog", list);
                    }
                });

                this.listenTo(CloudMamManager, "topnav:recover", function () {//恢复删除
                    
                    var list = new Array();
                    var self = this;
                    _.forEach(self.SelectedItemViews, function (itemView) {
                        var model = itemView.model;
                        var obj = { ContentID: model.get("contentID"), view: itemView };
                        list.push(obj);
                    });
                    if (list.length) {
                        this.trigger("recycle:recover", list);
                    }
                });
                this.listenTo(CloudMamManager, "topnav:remove", function () {//恢复删除
                    
                    var list = new Array();
                    var self = this;
                    _.forEach(self.SelectedItemViews, function (itemView) {
                        var model = itemView.model;
                        var obj = { ContentID: model.get("contentID"), view: itemView };
                        list.push(obj);
                    });
                    if (list.length) {
                        this.trigger("recycle:remove", list);
                    }
                });
                //监听刷新类型
                this.listenTo(CloudMamManager, "materials:type:refresh", function (options) {
                    this.SelectedItemViews = [];//清空所选
                    this.triggerState();//触发当前状态
                });
                //数据被重置
                this.listenTo(this.collection, "reset", function () {
                    //console.log("Materials has got 'reset' event!");
                    this.$el.empty();

                    this.appendHtml = function (collectionView, itemView, index) {
                        collectionView.$el.append(itemView.el);
                    };
                    this.SelectedItemViews = [];//清空所选
                   
                    this.triggerState();//触发当前状态
                    
                    this.$el.hide();
                });
            },            
            itemEvents: {
                "add:selected:count": "addSelectedItemViews",
                "reduce:selected:count": "reduceSelectedItemViews",
                "multi:add:selected:count":"multiAddSelectedItemViews",
                "multi:reduce:selected:count": "multiReduceSelectedItemViews",
                //"media:play": "mediaPlay",
                "item:play:box": "itemPlay",
                "folder:goin": "folderGoin",
                "favorite:toggle": "favoriteToggle",
                "copy:video": "transform"
            },
            onRender: function () {  
                this.appendHtml = function (collectionView, itemView, index) {
                    collectionView.$el.prepend(itemView.el); 
                };

                this.$el.animate({ opacity: "show" }, "slow");                
            },
            //onItemRemoved: function(itemView){//删除子项目后发生
            //    itemView
            //},
            //moveToFolder: function (event, itemView) {//移动到文件夹
            //    console.log(arguments);
            //    this.trigger("moveto:folder",);
            //},
            transform: function (event, itemView) {
                //转码操作逻辑代码，触发该操作逻辑在此视图的子视图中
                var list = new Array();

                if (itemView.model.get("entityTypeName").toLowerCase() === "clip") {
                    var obj = { name: itemView.model.get("name"), ContentID: itemView.model.get("contentID"), keyFramePath: itemView.model.get("keyFramePath") };
                    list.push(obj);
                }

                this.trigger("show:transformdownload:dialog", list);
            },
            favoriteToggle: function (event, itemView) {
                this.trigger("set:favorite:toggle", itemView.model);
            },
            itemPlay: function (event, itemView) {
                this.emptySelectedItemViews();
                itemView.toggleSelecte();
                this.trigger("item:play:box", itemView.model);
                console.log("This has triggered 'item:play:box' event");
            },
            folderGoin: function (event, itemView) {

                this.emptySelectedItemViews();

                CloudMamManager.trigger("materials:selected:reset");

                this.trigger("materials:goin:folder", itemView.model);
            },
            addSelectedItemViews: function (event, itemView) {
                this.emptySelectedItemViews();
                this.SelectedItemViews.push(itemView);
                this.triggerState();
            },
            reduceSelectedItemViews: function (event,itemView) {
                this.SelectedItemViews = _.reject(this.SelectedItemViews, function (currentItemView) {
                    return itemView == currentItemView;
                });
                this.triggerState();
            },
            multiAddSelectedItemViews: function (event, itemView) {
                this.SelectedItemViews.push(itemView);
                this.triggerState();
            },
            multiReduceSelectedItemViews:function(event, itemView){
                this.SelectedItemViews = _.reject(this.SelectedItemViews, function (currentItemView) {
                    return itemView == currentItemView;
                });
                this.triggerState();
            },
            triggerState: function () {
                var count = this.SelectedItemViews.length;
                if (count == 0) {
                    CloudMamManager.trigger("materials:selected:none");
                    console.log("This has triggered 'materials:selected:none' event!");
                } else if (count == 1) {
                    CloudMamManager.trigger("materials:selected:single");
                    console.log("This has triggered 'materials:selected:single' event!");
                } else {
                    CloudMamManager.trigger("materials:selected:multi");
                    console.log("This has triggered 'materials:selected:multi' event!");
                }
            },
            emptySelectedItemViews: function () {
                var self = this;
                _.forEach(this.SelectedItemViews, function (itemView) {                    
                    itemView.toggleSelecte();                   
                    //console.log(self.SelectedItemViews.length);
                });                
            },
            removeSelectedItemViews: function () {
                var self = this;
                _.forEach(this.SelectedItemViews, function (itemView) {
                    itemView.removeDOM();
                    //console.log(self.SelectedItemViews.length);
                });
            },
            addNewFileOrNewFolder: function (model, collection, options) {
                var self = this;
                if (model.get("entityTypeName") === "Folder") {
                    model.listenToOnce(self, "after:item:added", function () {
                        var itemView = self.children.findByModel(model);                     
                        self.emptySelectedItemViews();                    
            
                        itemView.toggleSelecte();
                        
                        itemView.rename();
                    });
                }
            },
            removeFileOrFolder: function () { 
                this.removeSelectedItemViews();
                this.emptySelectedItemViews();
                this.SelectedItemViews = [];//清空当前已选视图
            }
        });

    });
    return CloudMamManager.MyCloudApp.List.View;
});