
define(["app", "apps/common/views", "apps/mycloud/list/list_view", "dropzone", "config", "apps/common/utility", "jQuery.Cookie"], function (CloudMamManager, CommonViews, View, Dropzone, config, utility) {
    CloudMamManager.module("MyCloudApp.List", function (List, CloudMamManager, Backbone, Marionette, $, _) {

        this.startWithParent = false;

        this.onStart = function () {

        };

        this.onStop = function () {

        };

        var ListController = Marionette.Controller.extend({});


        _.extend(ListController.prototype, {
            setActiveNav: function (options) {
                if (options.type) {
                    require(["entities/mycloud/leftnavList"], function() {
                        var navfetching = CloudMamManager.request("subnav:entities");
                        $.when(navfetching).done(function(navs) {
                            var navToSelect = navs.find(function(nav) {
                                return nav.get("router") === options.type;
                            });

                            navToSelect.select();
                            navs.trigger("reset");

                        }).fail(function(error) {
                        });
                    });
                }
            },
            listClouds: function (options) {

                var self = List.Controller;
                //保存当前类型
                self.typeName = options.type;
                var wholeLayout = new CommonViews.WholeLayout();
                var cloudListLayout = new CommonViews.MyCloudLayout(); //全局layout
                var rightLayout = new View.RightLayout();       //右侧内容区layout

                CloudMamManager.bodyRegion.show(wholeLayout);

               

                //头部视图
                var headerView = new CommonViews.HeaderView();
                //监听搜索事件
                self.listenTo(headerView, "header:search", function (searchText) {
                    CloudMamManager.trigger("header:search", { criterion: searchText });
                });
                //渲染头部
                wholeLayout.headerRegion.show(headerView);
                //渲染内容区
                wholeLayout.mainRegion.show(cloudListLayout);


                require([
                    "apps/mycloud/dialog/dialog_view",
                    "entities/mycloud/leftnavList", "entities/mycloud/topnavList",
                    "entities/mycloud/siderbarList", "entities/mycloud/materialCollection"
                ], function (Dialog, LeftnavList, TopnavList, SiderbarList, MaterialCollection) {

                    var navfetching = CloudMamManager.request("subnav:entities"); //获取左侧导航
                    var siderbarfethching = CloudMamManager.request("siderbar:entities"); //获取siderbar




                    var materialsfetching = CloudMamManager.request("material:entities", options); //获取列表数据

                    if(options.folderCode){
                        var folderLevel = CloudMamManager.request("material:pull:FolderLevel",options.folderCode  /* "Dabiaacaadaabaabaad" */); //获取文件目录层级
                    }

                    var loadingView = new CommonViews.Loading({
                        title: "loading",
                        message: "loading data from server, pls wait a moment."
                    });

                    
                    cloudListLayout.rightRegion.show(rightLayout);
                    

                    //显示topnav

                    var topNavsView = new View.TopNav({ navType: options.type });
                    rightLayout.topNavRegion.show(topNavsView);




                    self.listenTo(topNavsView, "topnav:newfolder", function () {
                        CloudMamManager.trigger("topnav:newfolder");
                    });

                    //显示左侧导航
                    $.when(navfetching).done(function(navs) {

                        //保存刷新时路由上传递的类型
                        self.typeName = _.find(navs.models, function(item) {
                            return item.get('router') == self.typeName;
                        }).get('title');

                        var leftSubNavsView = new CommonViews.LeftSubNavs({
                            collection: navs,
                            spaceTag: true
                        });

                        self.listenTo(leftSubNavsView, "itemview:navigate", function(childView, model) {
                            var trigger = model.get("navigateTrigger");
                            var router  = model.get("router");
                            //保存当前类型为局部的 全局变量
                            var typeName = self.typeName = model.get("title");

                            //切换Tab重置变量
                            self.materials.parameters.set({ q: "", type: "", page: 1, folderCode: "" }, { silent: true });
                            self.materials.parameters.set({ type: router });

                            CloudMamManager.trigger(trigger, { type: router }); //导航
                            CloudMamManager.trigger("materials:type:refresh", { type: router, typeName: typeName }); //切换topnav的功能/清空素材选中状态/sitemap切换
                            CloudMamManager.trigger("clear:query"); //切换类型清空查询参数

                        });
                        
                        cloudListLayout.leftNavRegion.show(leftSubNavsView);
                        

                    }).fail(function(e) {
                        console.log(e);
                    });


                    //显示siderbar
                    $.when(siderbarfethching).done(function (siderbars) {
                        var siderbarView = new View.SiderBars({
                            collection: siderbars
                        });

                        rightLayout.sideBarRegion.show(siderbarView);
                    });

                    //显示分页区域
                    $.when(materialsfetching).done(function (materials) {
                        //全局保存列表数据对象
                        self.materials = this.materials = materials;
                        var materialsView = new View.Materials({
                            collection: materials
                        });
                        var paginatedLayout = new View.PaginatedView({
                            collection: materials,
                            panelView: new View.FolderView({}),
                            listView: materialsView,
                            propagatedEvents: [
                                "itemview:media:play",
                                "itemview:folder:goin",
                                "itemview:material:delete"
                            ]
                        });


                        //分页路由导航
                        self.listenTo(paginatedLayout, "page:change", function () {
                            CloudMamManager.trigger("page:change", _.clone(materials.parameters.attributes));
                        });

                        //检索
                        self.listenTo(CloudMamManager, "header:search", function (params) {
                            materials.parameters.set("q", params.criterion);
                            //关键字路由导航
                            //CloudMamManager.trigger("search:filter", _.clone(materials.parameters.attributes));
                        });

                        //监听新建文件夹
                        self.listenTo(CloudMamManager, "topnav:newfolder", function () {
                            var model = {
                                parentFolderCode: self.currentFolderCode,
                                entityTypeName: "Folder",
                                name: "新建文件夹",
                                entityCount: 0
                            };
                            materials.add(model);
                        });
                        //监听下载
                        self.listenTo(paginatedLayout.listView, "show:download:dialog", function (list) {
                            //下载对话框
                            var downloadForm = new Dialog.DownloadForm({ list: list });
                            wholeLayout.dialogRegion.show(downloadForm);
                        });

                        self.listenTo(paginatedLayout.listView, "show:move:dialog", function (list) {
                            //移动到
                            var moveToForm = new Dialog.MoveToForm({ list: list });
                            wholeLayout.dialogRegion.show(moveToForm);
                        });

                        //监听编辑对话框
                        self.listenTo(paginatedLayout.listView, "show:edit:dialog", function (list) {
                            //过滤非音视频
                            var filterlist = _.filter(list, function (item) {
                                return (item.entityTypeName.toLowerCase() == 'clip');
                            });
                            if (0 < filterlist.length && filterlist.length < 2) {
                                //创建视频审阅对话框
                                var editForm = new Dialog.EditForm({ list: filterlist });
                                wholeLayout.dialogRegion.show(editForm);
                            }
                        });

                        self.listenTo(paginatedLayout.listView, "show:cut:dialog", function (list) {

                            //不同码率不能创建关系
                            var frameRate = list[0].frameRate;
                            var videoFormat = list[0].videoFormat;

                            //创建视频剪切对话框
                            var cutForm = new Dialog.CutForm({ list: list });
                            wholeLayout.dialogRegion.show(cutForm);
                            console.log('create cut dialog.');
                            //创建cut
                            self.listenTo(cutForm, "create:clip:cut", function (options) {

                                var load = new Dialog.Loading({
                                    title: "loading",
                                    message: "loading data from server, pls wait a moment."
                                });
                                require(['entities/mycloud/createClipDes'], function (CreateClipDes) {
                                    var arr = new Array();
                                    _.each(options.data, function (model) {
                                        arr.push({ contentId: model.ContentID });
                                    });

                                    var model = new CreateClipDes({ entities: arr, name: options.name, description: options.desc });
                                    model.sync("create", model, {
                                        url: "/ac/activity",
                                        contentType: 'application/json',
                                        success: function (response) {
                                            CloudMamManager.trigger("create:cut", response);
                                        }
                                    });

                                });
                            });
                        });

                        //helper Func
                        self.TransformDialog = function (list) {
                            if(list.length>1){
                                return ;
                            }
                            //创建视频转码对话框
                            var transForm = null;
                            Backbone.ajax({
                                url:  config.dcmpRESTfulIp + "/emc/entity/" + list[0].ContentID,
                                type: 'GET',
                                success: function (response) {
                                    var res = JSON.parse(response);
                                    res.width = res.aspect.split('×')[0] || 0;
                                    res.height = res.aspect.split('×')[1] || 0;
                                    transForm = new Dialog.Transform({ model: JSON.stringify(res) });
                                    wholeLayout.dialogRegion.show(transForm, { preventClose: false });

                                    //发起视频转码
                                    self.listenTo(transForm, "create:clip:transform", function (options) {
                                        var json = {
                                            'entityName': options.entityName,
                                            'contentId': options.contentId,
                                            'transcodeType': options.selectedFormat == 'NetWorkFormat' ? 1 : 2, //网络版：1  专业版：2
                                            'targetFileType': options.selectedFormat == 'NetWorkFormat' ? options.networkFormats : options.professionalFormats, //['FILE_FLV', 'FILE_3GP', 'FILE_MP4'],
                                            'targetImageWidth': options.selectedFormat == 'NetWorkFormat' ? options.networkFormatSize.split('×')[0] : options.professionalFormatSize.split('×')[0], //'640',
                                            'targetImageHeight': options.selectedFormat == 'NetWorkFormat' ? options.networkFormatSize.split('×')[1] : options.professionalFormatSize.split('×')[1] // '360'
                                        };
                                        var model = new Backbone.Model(json);
                                        model.sync("create", model, {
                                            url: '/ac/transcode',
                                            contentType: 'application/json',
                                            success: function (response) {

                                            }
                                        });
                                    });
                                },
                                error: function (e) {
                                    console.log(e);
                                }
                            });
                        };

                        //创建视频转码对话框
                        self.listenTo(paginatedLayout.listView, "show:transform:dialog", function (list) {
                            self.TransformDialog(list);
                        });

                        //转码下载
                        self.listenTo(paginatedLayout.listView, "show:transformdownload:dialog", function (list) {

                            Backbone.ajax({
                                url:  config.dcmpRESTfulIp + "/ac/transcode/" + list[0].ContentID,
                                type: 'GET',
                                success: function(response) {
                                    var transFormdwnload = new Dialog.Transformdownload({ list: JSON.parse(response) });

                                    wholeLayout.dialogRegion.show(transFormdwnload);
                                    //继续转码
                                    self.listenTo(transFormdwnload, "continue:alert:transform", function (options) {
                                        wholeLayout.dialogRegion.close(); //reset();
                                        self.TransformDialog(list);
                                    });
                                },
                                error: function (error) { console.log(error); }
                            });

                        });

                        //路由导航时，触发
                        self.listenTo(paginatedLayout.panelView, "onRender:folderLevel", function () {
                            if (folderLevel) {
                                folderLevel.done(function (data) {
                                    var $ele = paginatedLayout.panelView.$el.find(".js-tree");
                                    //当前子目录的数组
                                    paginatedLayout.panelView.subFolderItems = [];
                                    var length = data.length;
                                    $.each(data, function (i, obj) {
                                        //添加子目录信息
                                        paginatedLayout.panelView.subFolderItems[i] = {
                                            folderCode: obj.code,
                                            folderName: obj.name,
                                            parentFolderCode: obj.parentFolderCode
                                        }
                                        if (i === length - 1) {
                                            $ele.append([
                                                '<span>&gt;</span><a href="javascript:void(0);"foldercode=',
                                                obj.code,
                                                '><b>',
                                                obj.name,
                                                '</b></a>'
                                            ].join(''));
                                        } else {
                                            $ele.append([
                                                '<span>&gt;</span><a href="javascript:void(0);"foldercode=',
                                                obj.code,
                                                '>',
                                                obj.name,
                                                '</a>'
                                            ].join(''));
                                        }
                                    });
                                });
                            }
                        })


                        //切换排序
                        self.listenTo(paginatedLayout.panelView, "toggle:sort", function (params) {
                            materials.parameters.set({ "sort": params.sort, "order": params.order });
                        });

                        //切换pageSize
                        self.listenTo(paginatedLayout.panelView, "set:page:size", function (pageSize) {
                            materials.parameters.set("pagesize", pageSize);
                        });

                        //双击进入文件夹
                        self.currentFolderCode = "-1";//保存当前文件夹的FolderCode
                        self.folderCode = "";


                        //监听进入文件夹事件
                        self.listenTo(paginatedLayout.listView, "materials:goin:folder", function (model) {
                            self.currentFolderCode = self.folderCode = model.get("contentID");
                            materials.parameters.set("page", 1, { silent: true });
                            //2014-8-22 进入文件夹清理查询参数
                            materials.parameters.set("q", "", { silent: true });
                            materials.parameters.set("folderCode", self.currentFolderCode);
                            //刷新当sitemap 导航
                            var folder = {
                                type: options.type,    //文件类型
                                folderCode: model.get("contentID"),
                                folderName: model.get("name"),
                                parentFolderCode: model.get("publicFolder")
                            };

                            paginatedLayout.panelView.addSubFolder(folder);

                            CloudMamManager.trigger("sitemap:change", folder);//更改路由
                            CloudMamManager.trigger("clear:query");//进入文件夹清除查询条件
                        });
                        //双击播放媒体
                        self.listenTo(paginatedLayout.listView, "item:play:box", function (model) {
                            var listView = paginatedLayout.listView;
                            model.sync("read", model, {
                                url: "/emc/entity/" + model.get("contentID"),
                                success: function (response) {
                                    //  console.log(response);
                                    var playerForm = new Dialog.Player({
                                        params: response,
                                        view:listView
                                    });
                                    wholeLayout.dialogRegion.show(playerForm);
                                },
                                error: function () {}
                            });
                            
                        });
                        
                        //提示
                        self.listenTo(CloudMamManager, "materials:tooltip", function (message) {
                            var tooltip = new Dialog.TooltipForm({ message: message });
                            wholeLayout.dialogRegion.show(tooltip);
                        });
                        

                        //设置常用素材（收藏功能）
                        self.listenTo(paginatedLayout.listView, "set:favorite:toggle", function (model) {
                            console.log(model);
                            require(['entities/mycloud/createClipDes'], function (CreateClipDes) {
                                var m = new CreateClipDes({ contentID: model.get("contentID") });
                                if (model.get("isFavorite") === 0) {
                                    m.sync("create", m, {
                                        url: "/emc/favorite/" + model.get("contentID"),
                                        success: function (response) {
                                            CloudMamManager.trigger('set:favorite:toggle', { isFavorite: !model.get("isFavorite") });
                                            model.set("isFavorite", 1);
                                        }
                                    });
                                } else {
                                    m.sync("delete", m, {
                                        url: "/emc/favorite/" + model.get("contentID"),
                                        success: function (response) {
                                            CloudMamManager.trigger('set:favorite:toggle', { isFavorite: !model.get("isFavorite") });
                                            model.set("isFavorite", 0);
                                        }
                                    });
                                    
                                }
                                
                            });
                        });

                        //选择目录树进入文件夹
                        self.listenTo(paginatedLayout.panelView, "goto:folder", function (folderCode) {

                            materials.parameters.set({ page: 1, q: '', folderCode: folderCode });

                            var type = materials.parameters.get("type");
                            self.currentFolderCode = self.folderCode = folderCode;
                            //刷新当前目录
                            paginatedLayout.panelView.renderSubFolders();
                            CloudMamManager.trigger("sitemap:change", { type: type, folderCode: folderCode });
                            CloudMamManager.trigger("clear:query");//进入文件夹清除查询条件
                        });
                        
                        //恢复素材
                        self.listenTo(paginatedLayout.listView, "recycle:recover", function (list) {
                            console.log("topnav:recover");
                            var contentIds = _.pluck(list, "ContentID");
                            var recovering = CloudMamManager.request("material:entities:recover", contentIds);
                            $.when(recovering).done(function (materials) {
                                //成功调用
                                _.forEach(list, function (item) {
                                    item.view.remove();
                                });
                            });
                        });
                        //彻底删除
                        self.listenTo(paginatedLayout.listView, "recycle:remove", function (list) {
                            console.log("topnav:completelyremove");
                            var contentIds = _.pluck(list, "ContentID");
                            var completelyremoving = CloudMamManager.request("material:entities:remove", contentIds);
                            $.when(completelyremoving).done(function (materials) {
                                //成功调用
                                _.forEach(list, function (item) {
                                    item.view.remove();
                                });
                            });
                        });
                        //彻底删除全部
                        self.listenTo(CloudMamManager, "topnav:removeall", function () {
                            console.log("topnav:removeall");
                            var userCode = "admin";//模拟userCode
                            var allRemoving = CloudMamManager.request("material:entities:removeall",userCode);
                            $.when(allRemoving).done(function (responeState) {                                
                                //成功调用
                                materials.reset();
                            });
                        });

                        //移动素材到文件夹
                        self.listenTo(CloudMamManager, "move:entity:to:folder", function (params) {//拖拽移动
                            var contentID = params.contentID;
                            var folderCode = params.folderCode;
                            var deleteView = params.deleteView;
                            var folderModel = params.folderModel;
                            var MoveToFolder = CloudMamManager.request("material:moveto:folder", contentID, folderCode);
                            $.when(MoveToFolder).done(function () {
                                //成功调用
                                params.deleteView.remove();
                                var count = folderModel.get("entityCount");
                                count += 1;
                                folderModel.set({ entityCount: count });
                                folderModel.collection.forEach(function (model) {//删除素材model
                                    if (model.get("contentID") === contentID) {
                                        folderModel.collection.remove(model);
                                    }
                                });
                                CloudMamManager.trigger("materials:type:refresh", { typeName: self.typeName });//刷新状态
                                //model.collection.remove(model);
                            });
                        });

                        //移动文件夹到文件夹
                        self.listenTo(CloudMamManager, "move:folder:to:folder", function (params) {//拖拽移动
                            var moveFolder = params.moveFolder;
                            var movetoFolder = params.movetoFolder;
                            var deleteView = params.deleteView;
                            var folderModel = params.folderModel;
                            var entityCount = params.entityCount;
                            var MoveToFolder = CloudMamManager.request("folder:moveto:folder", moveFolder, movetoFolder);
                            $.when(MoveToFolder).done(function () {
                                //成功调用
                                params.deleteView.remove();
                                var count = folderModel.get("entityCount");
                                count = count + parseInt(entityCount);
                                folderModel.set({ entityCount: count });
                                folderModel.collection.forEach(function (model) {//删除素材model
                                    if (model.get("contentID") === moveFolder) {
                                        folderModel.collection.remove(model);
                                    }
                                });
                                //model.collection.remove(model);
                                CloudMamManager.trigger("materials:type:refresh", { typeName: self.typeName });//刷新状态
                            });
                        });

                        self.listenTo(paginatedLayout.listView, "show", function () {
                            self.types = [];
                            var url =  config.upLoadRESTfulIp + '/api/cliptype';
                            Backbone.ajax(url, {
                                type: "GET",
                                success: function (response) {
                                    console.log(response);
                                    if (response) {
                                        _.each(response, function (item) {
                                            self.types = _.union(self.types, item.exts);
                                        });

                                        InitUpLoad(self.types.join(','));
                                    }
                                }, error: function (error) {
                                    console.log(error);
                                }
                            });
                            
                        });

                        rightLayout.detailsRegion.show(paginatedLayout);



                        //注册全选功能
                        //materialsView.on("collection:rendered", function() {
                        //    //render也可
                        //    console.log($('dl.pic').length);
                        //    new SelectHelper.RegionSelect({
                        //        region: 'dl.pic',
                        //        selectedClass: 'active'
                        //    }).select();
                        //});


                    }).fail(function (e) {
                        console.log(e);
                    });


                    function InitUpLoad(uploadTypes) {
                        //domReady(function () {
                        if (self.fileDropzone) return;
                            Dropzone.autoDiscover = true;
                            var previewTemplate =
                               
                                '<div class="dz-preview dz-file-preview pic">' +
                                  '<div class="dz-details">' +
                                    '<div class="dz-filename default"><span data-dz-name></span></div>' +
                                    '<div class="dz-size" data-dz-size></div>' +
                                    '<img data-dz-thumbnail />' +
                                  '</div>' +
                                  '<div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>' +
                                  '<div class="dz-success-mark"><span>✔</span></div>' +
                                  '<div class="dz-error-mark"><span>✘</span></div>' +
                                  '<div class="dz-error-message"><span data-dz-errormessage></span></div>' +
                                '</div>';

                            self.fileDropzone = new Dropzone(document.body, {
                                url: config.upLoadRESTfulIp + "/api/fileupload",
                                thumbnailWidth: 80,
                                thumbnailHeight: 80,
                                parallelUploads: 20,//上传并行处理文件数
                                myAwesomeDropzone: true,
                                maxFilesize: 1024, //单个文件上传大小限制
                                maxFiles: 20, //最多同时上传数量
                                addRemoveLinks: false, //删除预览缩略图的链接
                                uploadMultiple: true,//多文件同时上传
                                headers: { "helloSobeyMAM": "NO.1" },
                                acceptedFiles: uploadTypes,//"video/*",
                                dictDefaultMessage: "",//默认提示文本
                                dictInvalidInputType: "上传类型不支持！",
                                dictFileTooBig: "单文件最大超过1G！",
                                dictCancelUpload: "取消上传链接的文本",
                                dictCancelUploadConfirmation: "取消上传确认信息的文本",
                                dictRemoveFile: "移除文件链接的文本",
                                dictMaxFilesExceeded: "并行上传不能超过20个文件!",
                                previewTemplate: previewTemplate,
                                previewsContainer: ".content>div",
                                clickable: "#dropzone", 
                                init: function () {
                                    var _self = this;
                                    this.on("addedfile", function (file) { });
                                    this.on('sending', function (file, xhr, formData) {
                                        var userInfo = utility.localStorage.getUserInfo();
                                        formData.append('folderCode', self.folderCode);
                                        formData.append('userCode', userInfo.info.userCode);
                                        formData.append('importToken', [_self.sid, file.size].join('_'));
                                    });
                                },
                                accept: function (file, done) {
                                    var _self = this;
                                    var checking = CloudMamManager.request("upload:importcheck", file.size);
                                    $.when(checking).done(function(res) {
                                        if (res) {
                                            _self.sid = JSON.parse(res);
                                            done();
                                        }
                                        else
                                            done("空间不足!");

                                    }).fail(function(res) { done("空间不足!"); });
                                }
                            });
                        //});
                    }
                });
            }
        });
        List.Controller = new ListController();

        List.Controller.listenTo(CloudMamManager.MyCloudApp, 'stop', function () {
            List.Controller.close();
        });

        List.Controller.listenTo(List.Controller, "materials:goin:folder", function () {
        });

    });
    return CloudMamManager.MyCloudApp.List.Controller;
});

