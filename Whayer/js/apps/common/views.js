define(["app", "config", "apps/common/utility", "backbone.syphon", "jquery.spin"], function (CloudMamManager, config, utility) {


    CloudMamManager.module("MyCloudApp.Common.Views", function(Views, CloudMamManager, Backbone, Marionette, $, _) {
        Views.Loading = Marionette.ItemView.extend({
            template: "mycloud/mycloud-loading-view", //Handlebars.compile($("#loading-view").html()),

            initialize: function(options) {
                var options = options || {};
                this.title = options.title || "数据加载中";
                this.message = options.message || "请稍后，数据加载中...";
            }
        });

        _.extend(Views.Loading.prototype, {
            serializeData: function() {
                return {
                    title: this.title,
                    message: this.message
                };
            },
            onShow: function() {
                var opts = {
                    lines: 15, // 画的线条数
                    length: 10, // 每条线的长度 
                    width: 10, // 线宽
                    radius: 30, // 线的圆角半径
                    corners: 1, //Corner roundness (0..1)
                    rotate: 0, // 旋转偏移量 
                    direction: 1, // 1: 顺时针, -1: 逆时针 
                    color: "#000",
                    speed: 1, // 转速/秒 
                    trail: 60, // Afterglow percentage 
                    shadow: true, // 是否显示阴影   
                    hwaccel: false, // 是否使用硬件加速 
                    className: "spinner", // 绑定到spinner上的类名 
                    zIndex: 2e9, // 定位层 (默认 2000000000)
                    top: "50%", // 相对父元素上定位，单位px
                    left: "50%" //相对父元素左定位，单位px
                };
                $("#spinner").spin(opts);
            }

        });


        Views.PaginationControls = Marionette.ItemView.extend({
            template: "common/mycloud-pagination-control",
            initialize: function(options) { //初始化
                this.state = true;
                this.collection = options.paginatedCollection;
                this.listenTo(this.collection, "reset", this.render);
                this.listenTo(this.collection, "remove", this.removeRender);
                this.listenTo(this.collection, "add", this.addRender);
            },
            addRender: function(model) {
                if (model.get("entityTypeName") !== "Folder") { //默认不增加Folder
                    var state = this.collection.state;
                    state.totalRecords = state.totalRecords + 1;
                    this.render();
                }
            },
            removeRender: function() {
                var state = this.collection.state;
                state.totalRecords = state.totalRecords - 1;
                this.render();
            },
            events: {
                "click a.js-navigatable": "navigateToPage"
            },
            navigateToPage: function(e) {
                var page = parseInt($(e.target).data("page"), 10);
                this.collection.parameters.set("page", page);
                var index = location.hash.indexOf("page");
                if(this.state && index < 0 ){
                    hash = location.hash;
                    this.state = false;
                    CloudMamManager.navigate(hash+'/page!'+page);
                } else {
                    var hash = location.hash.split("!")
                    CloudMamManager.navigate(hash[0]+"!"+page);
                }
                this.trigger("page:change", page);
                return false;   //阻止事件冒泡并且不执行默认事件
            },

            serializeData: function() { //串行化数据
                var data = {};
                var previous = this.collection.state.currentPage - 1;
                previous = (previous < 1) ? 1 : previous;
                var currentPage = this.collection.state.totalPages == 0 ? 0 : this.collection.state.currentPage;
                var next = this.collection.state.currentPage + 1;
                next = (next > this.collection.state.totalPages) ? this.collection.state.totalPages : next;
                data = _.extend(data,
                    this.collection.state,
                    {
                        previous: previous,
                        next: next,
                        currentPage: currentPage
                    }
                );
                return data;
            }
        });

        //网盘页面全局Layout
        Views.WholeLayout = Marionette.Layout.extend({
            template: "mycloud/mycloud-whole-layout",
            //el: "body",
            tagName: 'div',
            attributes: {
                style: 'height:100%;width:100%'
            },
            regions: {
                headerRegion: ".header",
                mainRegion: ".main",
                dialogRegion: {
                    selector: "#dialog-region",
                    regionType: Backbone.Marionette.Modals
                }
            }
        });

        //main布局
        Views.MyCloudLayout = Marionette.Layout.extend({
            template: "mycloud/mycloud-main-layout",

            regions: {
                leftNavRegion: ".leftnav-region",
                rightRegion: ".right-region"
            }
        });

        //个人中心头部视图
        Views.UserCenterHeaderView = Marionette.ItemView.extend({
            template: "header/usercenter-header",
            events: {
                "click .info": "onExtend",
                "click .js-usercenter": "goUserCenter",
                "click .js-logout": "logOut"
            },
            initialize: function() {
                this.userInfo = utility.localStorage.getUserInfo();
            },
            logOut: function(e) {
                Backbone.ajax({
                    url: config.dcmpRESTfulIp + "/uic/logout",
                    type: 'POST',
                    contentType: 'application/json',
                    success: function() {
                        location.href = 'myspace.html';
                    }
                });
            },
            onExtend: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                this.$(".info>ul").toggleClass("none");
            },
            goUserCenter: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                window.open('myspace.html#user/center/default', '_blank');
            },
            onRender: function () {
                var self = this;
                if (this.userInfo) {
                    this.$('.js-username').html(self.userInfo.info.userName);
                }
            }
        });

        //通用头部视图
        Views.HeaderView = Marionette.ItemView.extend({
            template: "header/mycloud-header",
            events: {
                "keyup #s": "onSearch",
                "click .searchimg": "search",
                "click .info": "onExtend",
                "click .js-usercenter": "goUserCenter",
                "click .js-logout": "logOut"
            },
            initialize: function () {
                var self = this;
                self.userInfo = utility.localStorage.getUserInfo();
                //进入文件夹清空查询参数
                this.listenTo(CloudMamManager, 'clear:query', function () {
                    self.$('#s').val('');
                });
            },
            logOut: function (e) {
                Backbone.ajax({
                    url: config.dcmpRESTfulIp + "/uic/logout",
                    type: 'POST',
                    contentType: 'application/json',
                    success: function () {
                        location.href = 'myspace.html';
                    }
                });
            },
            onSearch: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                //当Enter键敲入
                if (e.keyCode == 13) {
                    var searchText = this.$("#s").val();
                    this.trigger("header:search", searchText);
                }
            },
            search: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                var searchText = this.$("#s").val();
                this.trigger("header:search", searchText);
            },
            onExtend: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                this.$(".info>ul").toggleClass("none");
            },
            goUserCenter: function(e) {
                e && e.stopPropagation() && e.preventDefault();
                window.open('myspace.html#user/center/default', '_blank');
            },
            onRender: function () {
                var self = this;
                if (this.userInfo) {
                    this.$('.js-username').html(self.userInfo.info.userName);
                }
            }
        });


        Views.LeftSubNav = Marionette.ItemView.extend({
            tagName: "li",
            //className: "",
            template: "mycloud/mycloud-nav-item",
            initialize: function () {
                var self = this;
                this.listenTo(this.model, "selected:change", function () {
                    CloudMamManager.trigger("materials:type:refresh", { type: self.model.get('router'), typeName: self.model.get('title') });
                });
            },
            events: {
                "click a": "navigate"
            },

            navigate: function (e) {
                e && e.stopPropagation() && e.preventDefault();
                this.trigger("navigate", this.model);
            },
            onRender: function () {
                if (this.model.selected) {
                    this.$el.css('background', '#292929');
                    this.$el.addClass("active");
                }
            },
            remove: function () {
                var self = this;
                Marionette.ItemView.prototype.remove.call(self);
            }
        });

        Views.LeftSubNavs = Marionette.CompositeView.extend({
            itemView: Views.LeftSubNav,
            emptyView: Views.NullView,
            template: "mycloud/mycloud-nav-list",
            itemViewContainer: "ul.nav",
            ui: {
                "memory": ".memory",
                "usercenter": ".usercenter",
                "percentage": ".memory .p span",
                "used": ".js-used",
                "total": ".js-total"
            },
            initialize: function (options) {
                //是否显示空间大小
                this.spaceTag = options.spaceTag;
                this.showTitle = options.showTitle;
                this.usedPercent = null;

                this.listenTo(this.collection, "reset", function () {
                    this.appendHtml = function (collectionView, itemView, index) {
                        collectionView.$("ul.nav").append(itemView.el);
                    };
                });
            },

            onCompositeCollectionRendered: function () {
                this.appendHtml = function (collectionView, itemView, index) {
                    collectionView.$el.prepend(itemView.el);
                };
            },
            onRender: function () {
                var self = this;
                this.spaceTag ? null : this.ui.memory.hide();
                this.showTitle ? this.ui.usercenter.show() : null;
                if (this.spaceTag && !this.usedPercent) {
                    Backbone.ajax({
                        url: config.dcmpRESTfulIp + "/emc/usedStatistics/import",
                        type: "GET",
                        success: function(res) {
                            var data = JSON.parse(res);
                            self.ui.used.html(data.total.totalFileSize);
                            self.ui.total.html(data.total.userPermissionSpace);
                            self.ui.percentage.css({ width: data.total.usedPercent + "%" });
                            self.usedPercent = data.total.usedPercent;
                        },
                        error: function(error) {
                            
                        }
                    });
                }
            }
        });

        Views.NotFind404 = Marionette.ItemView.extend({
            className: ".er-page",
            template: "common/notfind_404",
            initialize: function () {
               
            },
            events: {
                "click .js-return": "returnIndex"
            },
            returnIndex: function() {
                location.href = 'index.html';
            }
        });

        Views.NoPermission401 = Marionette.ItemView.extend({
            className: ".er-page",
            template: "common/nopermission_401",
            initialize: function () {
            },
            events: {
                "click .js-return": "returnLogin"
            },
            returnLogin: function() {
                location.href = 'myspace.html';
            }
        });

        Views.NullView = Marionette.ItemView.extend({
            tagName: "div",
            className: "center",
            template: "mycloud/mycloud-list-none"

        });

    });

    return CloudMamManager.MyCloudApp.Common.Views;
});	