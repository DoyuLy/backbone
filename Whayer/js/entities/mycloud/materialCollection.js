define(["app", "entities/mycloud/materialModel","config","jquery","backbone.paginator"],
	function (CloudMamManager, MaterialModel,config,$) {

	    var MaterialCollection = Backbone.PageableCollection.extend({
	        url: "/sc/search",
	        model: MaterialModel,
	        mode: "server",
	        //本地客户端设置初始状态
	        state: {
	            firstPage: 1,//1-based，（分页从1开始符合阅读习惯)
	            lastPage: null,//这是基于firstPage 算出来的 不可修改
	            pageSize: 15,//默认
	            totalPages: null,
	            totalRecords: null,//  server-mode 可填此参数
	            sortKey: "createtime",//默认
	            order: -1,//desc  默认-1    为0则不会发送服务端
	            currentPage: 1//初始页索引,默认和firstPage相同,若不同则指定
                
	        },


	        //默认服务端 "键"映射: {currentPage: "page", pageSize: "per_page", totalPages: "total_pages", totalRecords: "total_entries", sortKey: "sort_by", order: "order", directions: {"-1": "asc", "1": "desc"}}

	        queryParams: {
	            totalPages: null,//默认"键" "total_pages" 设置为null 则会从querystring中移除
	            totalRecords: null,//默认"键""total_entries" 设置为null 则会从querystring中移除
	            sortKey: "sort", // 默认"键" "sort_by"
	            order: "order", //默认"键" "order"
	            currentPage: "page",//默认"键" "page"
	            pageSize: "size", //默认"键" "per_page"
	            //directions:"" 默认"键" { "-1": "asc", "1": "desc" }
	            directions: {
	                "1": "asc",//"asc",
	                "-1": "desc"
	            },
	            q: "", //关键帧
	            folderCode: "",//文件夹code
	            type: "",//素材类型 
	            webType: "pc"
	        },

	        //修改本地数据状态：如：总个数/当前页索引/
	        parseState: function (response, queryParams, state, options) {
	            if (response.page === 0) { response.page = 1; }
	            return {
	                totalRecords: response.totalCount,
	                totalPages: response.totalPage,
	                currentPage: response.page
	            };
	        },

	        //返回数据记录
	        parseRecords: function (response, options) {
	            if (this.url === "/emc/recycle")
	                return response.entityInRecycle;
	            else
	                return response.entities;//后台返回的格式                
	        },


	        //这是"无限分页" 模式才会使用
	        parseLinks: function () {

	        },

	        initialize: function () {
                //value为初始化参数
	            var params = { q:"", page: 1, type: "All", folderCode: "", pagesize: 15, order: -1, sort: "createtime" };
	            this.parameters = new Backbone.Model(params);
	            var self = this;

	            //修复多次请求问题
	            this.listenTo(this.parameters,'change', function() {
	                var page = parseInt(self.parameters.get("page"), 10);
	                var q = self.parameters.get("q");
	                var pagesize = self.parameters.get("pagesize");
	                var sort = self.parameters.get("sort");
	                var order = self.parameters.get("order");
	                var type = self.parameters.get("type");
	                var folderCode = self.parameters.get("folderCode");
	                

	                self.state.totalPages = page;
	                self.state.pageSize = pagesize;
	                self.state.sortKey = sort;
	                self.state.order = order;
	                //q,folderCode,type需要设置queryParams
	                self.queryParams.q = q;
	                self.queryParams.folderCode = folderCode;
	                self.queryParams.type = type === "All" ? "" : type;

                    //切换接口
	                switch (type) {
	                    case "Favorite":
	                        self.url = "/emc/favorite/";
	                        self.queryParams.usercode = "admin";//ToDo admin用户为模拟用户
	                        break;
	                    case "Recycle":
	                        self.url = "/emc/recycle";
	                        self.queryParams.userCode = "admin";
	                        break;
	                    default:
	                        self.url = "/sc/search";
	                        self.queryParams.userCode = "";
	                        break;
	                }

	                self.getPage(page, { reset: true });
	            });

                /*
	            this.listenTo(this.parameters, "change:page", function() {
	                var page = parseInt(self.parameters.get("page"), 10);
	                self.getPage(page, { reset: true });
	            }); 
	            this.listenTo(this.parameters, "change:q", function () {
	                var q = self.parameters.get("q");
	                self.queryParams.q = q;
	                self.getPage(self.parameters.get("page"), { reset: true });
	            });

	            this.listenTo(this.parameters, "change:pagesize", function () {
	                var pagesize = self.parameters.get("pagesize");
	                self.state.pageSize = pagesize;
	                self.getPage(self.state.firstPage, { reset: true });
	            });

	            this.listenTo(this.parameters, "change:sort", function () {
	                var sort = self.parameters.get("sort");
	                var order = self.parameters.get("order");
	                self.state.sortKey = sort;
	                self.state.order = order;
	                self.getPage(self.parameters.get("page"), { reset: true });
	            });

	            this.listenTo(this.parameters, "change:order", function () {
	                var sort = self.parameters.get("sort");
	                var order = self.parameters.get("order");
	                self.state.sortKey = sort;
	                self.state.order = order;
	                self.getPage(self.parameters.get("page"), { reset: true });
	            });

	            this.listenTo(this.parameters, "change:type", function () {
	                var type = self.parameters.get("type");
	                self.queryParams.type = type === "All" ? "" : type;
	                switch (type) {
	                    case "Favorite":
	                        self.url = "/emc/favorite/";
	                        self.queryParams.usercode = "admin";//ToDo admin用户为模拟用户
	                        break;
	                    case "Recycle":
	                        self.url = "/emc/recycle";
	                        self.queryParams.userCode = "admin";
	                        break;
	                    default:
	                        self.url = "/sc/search";
	                        self.queryParams.userCode = "";
	                        break;
	                }

                    //修正每次刷新右侧全部视图
	                self.getPage(self.parameters.get("page"), { reset: true });
	            });

	            this.listenTo(this.parameters, "change:folderCode", function () {
	                var folderCode = self.parameters.get("folderCode");
	                self.queryParams.folderCode = folderCode;
	                self.getPage(self.parameters.get("page"), { reset: true });
	            });
                */
	        }
	    });


	    var API = {
	        getMaterialsEntities: function (options) {

	            var materials = new MaterialCollection();
				//路由分布
	            if(options.page){
	                materials.parameters.set("page", parseInt(options.page));
	            }

	            if (options.type){
	                materials.parameters.set("type", options.type);
	            }

                if (options.folderCode) {
                    materials.parameters.set("folderCode", options.folderCode);
                }
                
	            var defer = $.Deferred();
	            var options = {};
	            defer.then(options.success, options.error);

	            var response =
                        materials.fetch(_.omit(options, "success", "error"));

	            response.done(function () {

	                defer.resolveWith(response, [materials]);
	            }).fail(function () {
	                defer.rejectWith(response, arguments);
	            });

	            return defer.promise();


	        },
	        recoverMaterialsEntities: function (contentIds) {//恢复删除
	            var defer = $.Deferred();
	            var options = {};
	            //defer.then(options.success, options.error);
                //指定请求路径
	            var url =  config.dcmpRESTfulIp + "/emc/recycle/" + contentIds.join(",");
	            var response = Backbone.ajax(url, {
	                type: "PUT"	            
	            });

	            response.done(function () {

	                defer.resolveWith(response);
	            }).fail(function () {
	                defer.rejectWith(response, arguments);
	            });

	            return defer.promise();
	        },
	        completelyremoveMaterialsEntities: function (contentIds) {//彻底删除
	            var defer = $.Deferred();
	            //var options = {};
	            //defer.then(options.success, options.error);
	            //指定请求路径
	            var url =  config.dcmpRESTfulIp + "/emc/recycle/" + contentIds.join(",");
	            var response = Backbone.ajax(url, {
	                type: "DELETE"
	            });

	            response.done(function () {

	                defer.resolveWith(response);
	            }).fail(function () {
	                defer.rejectWith(response, arguments);
	            });

	            return defer.promise();
	        },
	        completelyremoveAllMaterialsEntities: function (userCode) {//彻底删除全部文件
	            var defer = $.Deferred();

	            var url =  config.dcmpRESTfulIp + "/emc/recycle?" + "userCode=" + userCode;
	            var response = Backbone.ajax(url, {
	                type: "DELETE"
	            });

	            response.done(function () {

	                defer.resolveWith(response);
	            }).fail(function () {
	                defer.rejectWith(response, arguments);
	            });

	            return defer.promise();
	        },
            pullFolderLevel:function(folderCode){
                /*拼接的字符串很多时，使用数组方法*/
                var url = [
                    config.dcmpRESTfulIp,
                    '/emc/folder/path/',
                    folderCode
                ].join('');

                /* $.ajax()操作
                 * 如果使用的是低于1.5.0版本的jQuery，返回的是XHR对象，你没法进行链式操作；
                 * 如果高于1.5.0版本，返回的是deferred对象，可以进行链式操作。
                 * 所以，在此时不需要在重新生成一个延迟对象 $.Deferred()
                 */
                var response = $.ajax({
                    url: url,
                    type: "GET",
                    dataType:"json"
                })
                return response.promise();
            },
	        moveEntityToFolder: function (contentID, folderCode) {//移动素材到文件夹
	            var defer = $.Deferred();
	            //指定请求路径
	            var url =  config.dcmpRESTfulIp + "/emc/entity/" + contentID;//+ "?entity=" + folderCode + "&" + "type=move";
	            var response = Backbone.ajax(url, {
	                type: "PUT",
	                data: JSON.stringify({ name: '', publicfolder: folderCode }),
	                contentType: 'application/json;charset=utf-8',
	                dataType: 'JSON'
	            });

	            response.done(function () {

	                defer.resolveWith(response);
	            }).fail(function () {
	                defer.rejectWith(response, arguments);
	            });

	            return defer.promise();
	        },
	        moveFolderToFolder: function (moveFolder, movetoFolder) {//移动文件夹到文件夹
	            var defer = $.Deferred();
	            //指定请求路径
	            var url =  config.dcmpRESTfulIp + "/emc/folder/" + moveFolder;//+ "?entity=" + movetoFolder + "&" + "type=move";
	            var response = Backbone.ajax(url, {
	                type: "PUT",
	                //data: { code: movefolder, name: '', parentfoldercode: movetofolder },
	                data: JSON.stringify({ code: moveFolder, parentfoldercode: movetoFolder }),
	                contentType: 'application/json',
	                dataType: 'JSON'
	            });
	           

	            response.done(function () {

	                defer.resolveWith(response);
	            }).fail(function () {
	                defer.rejectWith(response, arguments);
	            });

	            return defer.promise();
	        },
	        uploadCheck: function(filesize) {
	            var response = Backbone.ajax({
	                url: config.dcmpRESTfulIp + "/ec/importCheck",
	                type: "POST",
	                data: $.param({ fileSize: filesize }),
	                contentType: 'application/x-www-form-urlencoded'
	            });
	            return response.promise();
	        }
	    };

	    CloudMamManager.reqres.setHandler("material:entities", function (type) {
	        return API.getMaterialsEntities(type);
	    });

	    CloudMamManager.reqres.setHandler("material:entities:recover", function (contentIds) {
	        return API.recoverMaterialsEntities(contentIds);
	    });

	    CloudMamManager.reqres.setHandler("material:entities:remove", function (contentIds) {
	        return API.completelyremoveMaterialsEntities(contentIds);
	    });

	    CloudMamManager.reqres.setHandler("material:moveto:folder", function (contentID, folderCode) {
	        return API.moveEntityToFolder(contentID,folderCode);
	    });

        CloudMamManager.reqres.setHandler("material:pull:FolderLevel", function (folderCode) {
            return API.pullFolderLevel(folderCode);
        });

	    CloudMamManager.reqres.setHandler("folder:moveto:folder", function (moveFolder, movetoFolder) {
	        return API.moveFolderToFolder(moveFolder, movetoFolder);
	    });

	    CloudMamManager.reqres.setHandler("material:entities:removeall", function (userCode) {
	        return API.completelyremoveAllMaterialsEntities(userCode);
	    });

	    CloudMamManager.reqres.setHandler("upload:importcheck", function (filesize) {
	        return API.uploadCheck(filesize);
	    });
	    return MaterialCollection;
	});
