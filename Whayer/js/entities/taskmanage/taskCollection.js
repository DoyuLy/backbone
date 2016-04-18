define(["app", "entities/taskmanage/taskModel", "config", "jquery", "backbone.paginator"],
	function (CloudMamManager, TaskModel, config, $) {

	    var TaskCollection = Backbone.PageableCollection.extend({//MaterialCollection
	        url: "/xx/xxx",
	        model: TaskModel,
	        mode: "server",
	        //本地客户端设置初始状态
	        state: {
	            firstPage: 1,//1-based，（分页从1开始符合阅读习惯)
	            lastPage: null,//这是基于firstPage 算出来的 不可修改
	            pageSize: 35,//默认
	            totalPages: null,
	            totalRecords: null,//  server-mode 可填此参数
	            sortKey: "createTime",//默认
	            order: -1,//desc  默认-1    为0则不会发送服务端
	            currentPage: 1,//初始页索引,默认和firstPage相同,若不同则指定

	            keyword: "", //关键字
	            type: "", //素材类型 
	            status: ""
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
	            keyword: "", //关键字
	            type: "", //素材类型 
	            status: ""
	        },

	        //修改本地数据状态：如：总个数/当前页索引/
	        parseState: function (response, queryParams, state, options) {
	            if (response.page === 0) { response.page = response.page + 1; }
	            return {
	                totalRecords: response.totalCount,
	                totalPages: response.totalPage,
	                currentPage: response.page,
	                type: response.type
	            };
	        },

	        //返回数据记录
	        parseRecords: function (response, options) {
	            return response.searchData;//后台返回的格式                
	        },

	        //这是"无限分页" 模式才会使用
	        parseLinks: function () {

	        },

	        initialize: function (options) {
	            //value为初始化参数
	            var params = { keyword: "", page: 1, type: "", pagesize: 35, order: -1, sort: "createTime", status: "" };
	            this.parameters = new Backbone.Model(params);

	            var self = this;
	            this.listenTo(this.parameters, "change", function () {
	                var page = parseInt(self.parameters.get("page"), 10);
	                var pagesize = self.parameters.get("pagesize");
	                var sort = self.parameters.get("sort");
	                var order = self.parameters.get("order");

	                var keyword = self.parameters.get("keyword");
	                var status = self.parameters.get("status");
	                var type = self.parameters.get("type") ? self.parameters.get("type") : 'cut';//默认

	                self.state.sortKey = sort;
	                self.state.order = order;
	                self.state.pageSize = pagesize;
	                self.state.totalPages = page;
	                //keyword,status,type需要设置queryParams
	                self.state.keyword = self.queryParams.keyword = keyword;
	                self.state.status = self.queryParams.status = status;
	                self.state.type = self.queryParams.type = type;

	                //切换接口
	                switch (type) {
	                    case "review":
	                        self.url = "/xx/xxx/";
	                        self.queryParams.usercode = "admin";//ToDo admin用户为模拟用户
	                        break;
	                    case "cut":
	                        self.url = "/ac/activity";
	                        self.queryParams.userCode = "admin";
	                        break;
	                    case "synthesis":
	                        self.url = "/ac/mixture";
	                        self.queryParams.userCode = "admin";
	                        break;
	                    case "transcode":
	                        self.url = "/ac/transcode";
	                        self.queryParams.userCode = "admin";
	                        break;
	                    default:
	                        break;
	                }

	                self.getPage(page, { reset: true });
	            });
                /*
	            this.listenTo(this.parameters, "change:page", function () {
	                var page = parseInt(self.parameters.get("page"), 10);
	                self.getPage(page, { reset: true });
	            });

	            this.listenTo(this.parameters, "change:keyword", function () {
	                var keyword = self.parameters.get("keyword");
	                self.queryParams.keyword = keyword;
	                self.getPage(self.parameters.get("page"), { reset: true });
	            });

	            this.listenTo(this.parameters, "change:pagesize", function () {
	                var pagesize = self.parameters.get("pagesize");
	                self.state.pageSize = pagesize;
	                self.getPage(self.state.firstPage, { reset: true });
	            });

	            this.listenTo(this.parameters, "change:sort", function () {
	                var sort = self.parameters.get("sort");
	                self.state.sortKey = sort;
	                self.getPage(self.parameters.get("page"), { reset: true });
	            });

	            this.listenTo(this.parameters, "change:order", function () {
	                var order = self.parameters.get("order");
	                self.state.order = order;
	                self.getPage(self.parameters.get("page"), { reset: true });
	            });
	            this.listenTo(this.parameters, "change:status", function () {
	                var status = self.parameters.get("status");
	                self.state.status = self.queryParams.status = status;
	                self.getPage(self.parameters.get("page"), { reset: true });
	            });

	            this.listenTo(this.parameters, "change:type", function () {
	                var type = self.parameters.get("type");
	                switch (type) {
	                    case "review":
	                        self.url = "/xx/xxx/";
	                        self.queryParams.usercode = "admin";//ToDo admin用户为模拟用户
	                        break;
	                    case "cut":
	                        self.url = "/ac/activity";
	                        self.queryParams.userCode = "admin";
	                        break;
	                    case "synthesis":
	                        self.url = "/ac/mixture";
	                        self.queryParams.userCode = "admin";
	                        break;
	                    case "transcode":
	                        self.url = "/ac/transcode";
	                        self.queryParams.userCode = "admin";
	                        break;
	                    default:
	                        break;
	                }

	                //修正每次刷新右侧全部视图
	                self.getPage(self.parameters.get("page"), { reset: true });
	            });
                */
	        }
	    });


	    var API = {
	        getTasksEntities: function (options) {
	            var tasks = new TaskCollection();
	            switch (options.type) {
	                case "review":
	                    tasks.url = "/xx/xxx/";//Todo 活动列表接口
	                    tasks.queryParams.usercode = "admin";
	                    break;
	                case "cut":
	                    tasks.url = "/ac/activity";
	                    tasks.queryParams.userCode = "admin";
	                    break;
	                case "synthesis":
	                    tasks.url = "/ac/mixture";
	                    tasks.queryParams.userCode = "admin";
	                    break;
	                case "transcode":
	                    tasks.url = "/ac/transcode";
	                    tasks.queryParams.userCode = "admin";
	                    break;
	                default:
	                    break;
	            }
                if(options.page){
                    tasks.queryParams.page = options.page;
                }
	            var defer = $.Deferred();
	            var options = {};
	            defer.then(options.success, options.error);

	            var response =
                        tasks.fetch(_.omit(options, "success", "error"));

	            response.done(function () {

	                defer.resolveWith(response, [tasks]);
	            }).fail(function () {
	                defer.rejectWith(response, arguments);
	            });

	            return defer.promise();
	            
	        },
            transcodeDownload: function(model) {
                var response = Backbone.ajax({
                    url:  config.dcmpRESTfulIp + "/ac/transcode/" + model.get('contentId'),
                    type: 'GET'
                });
                return response.promise();
            },
            transcodeDelete: function (model) {
                var response = Backbone.ajax({
                    url:  config.dcmpRESTfulIp + "/ac/transcode/" + model.get('id'),
                    type: 'DELETE'
                });
                return response.promise();
            },
	        reTranscode: function(model) {
	            var response = Backbone.ajax({
	                url:  config.dcmpRESTfulIp + "/ac/transcode/" + model.get('id'),
	                type: 'PUT'
	            });
	            return response.promise();
	        },
	        cutActivity: function (model) {
	            var response = Backbone.ajax({
	                url:  config.dcmpRESTfulIp + "/ac/activity/" + model.get('id'),
	                type: 'GET'
	            });
	            return response.promise();
	        },
	        cutUpdate: function (option) {
	            var data = {
	                name: option.name,
	                description: option.desc,
	               };
	            var response = Backbone.ajax({
	                url:  config.dcmpRESTfulIp + "/ac/activity/" + option.id,
	                data: JSON.stringify(data),
	                type: 'PUT',
	                contentType: 'application/json;charset=utf-8',
	                dataType: 'JSON'
	            });
	            return response.promise();
	        },
	        cutDelete: function (option) {
	            var response = Backbone.ajax({
	                url:  config.dcmpRESTfulIp + "/ac/activity/" + option.id,
	                type: 'DELETE'
	            });
	            return response.promise();
	        },
	        synthesisReview: function(option) {
	            var response = Backbone.ajax({//"/emc/entity/" + model.get("contentID"),
	                url:  config.dcmpRESTfulIp + "/emc/entity/" + option.id,
	                type: 'GET'
	            });
	            return response.promise();
	        },
	        synthesisDelete: function (option) {
	            var response = Backbone.ajax({
	                url:  config.dcmpRESTfulIp + "/ac/mixture/" + option.id,
	                type: 'DELETE'
	            });
	            return response.promise();
	        },
	        synthesisRedo: function (option) {
	            var response = Backbone.ajax({
	                url:  config.dcmpRESTfulIp + "/ac/mixture/" + option.id,
	                type: 'GET'
	            });
	            return response.promise();
	        },
	        setFavorite: function (option) {
	            var response = null;
	            if (option.isFavorite) {
	                response = Backbone.ajax({
	                    url:  config.dcmpRESTfulIp + "/emc/favorite/" + option.contentId,
	                    type: 'DELETE'
	                });
	            } else {
	                response = Backbone.ajax({
	                    url:  config.dcmpRESTfulIp + "/emc/favorite/" + option.contentId,
	                    type: 'POST',
	                    data: JSON.stringify({ contentID: option.contentId }),
	                    contentType: 'application/json;charset=utf-8',
	                    dataType: 'JSON'
	                });
	            }

	            return response.promise();
	        },
	    };

	    CloudMamManager.reqres.setHandler("task:entities", function (type) {
	        return API.getTasksEntities(type);
	    });

	    CloudMamManager.reqres.setHandler("transcode:download", function (model) {
	        return API.transcodeDownload(model);
	    });

	    CloudMamManager.reqres.setHandler("transcode:delete", function (model) {
	        return API.transcodeDelete(model);
	    });

	    CloudMamManager.reqres.setHandler("transcode:retranscode", function (model) {
	        return API.reTranscode(model);
	    });

	    CloudMamManager.reqres.setHandler("cut:activity", function (model) {
	        return API.cutActivity(model);
	    });

	    CloudMamManager.reqres.setHandler("cut:editcut", function (model) {
	        return API.cutActivity(model);
	    });

	    CloudMamManager.reqres.setHandler("cut:update", function (option) {
	        return API.cutUpdate(option);
	    });

	    CloudMamManager.reqres.setHandler("cut:delete", function (option) {
	        return API.cutDelete(option);
	    });

	    CloudMamManager.reqres.setHandler("synthesis:review", function (option) {
	        return API.synthesisReview(option);
	    });

	    CloudMamManager.reqres.setHandler("synthesis:delete", function (option) {
	        return API.synthesisDelete(option);
	    });

	    CloudMamManager.reqres.setHandler("synthesis:redo", function (option) {
	        return API.synthesisRedo(option);
	    });

	    CloudMamManager.reqres.setHandler("set:favorite:toggle", function (option) {
	        return API.setFavorite(option);
	    });
	    return TaskCollection;
	});
