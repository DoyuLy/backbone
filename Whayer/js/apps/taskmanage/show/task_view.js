define(["app", "apps/common/views", "apps/mycloud/dialog/dialog_view", "utils/templates", "jquery-ui", "tooltipster"], function (CloudMamManager, CommonViews, Dialog, templates) {
    CloudMamManager.module("TaskManageApp.Task.View", function (View, CloudMamManager, Backbone, Marionette, $, _) {

        View.Review = Marionette.ItemView.extend({
            tagName: "li",
            template: templates.getTemplate("taskmanage/task-review-item"),
            ui: {
              
            },
            events: {
                
            }
        });
        View.Cut = Marionette.ItemView.extend({
            tagName: "li",
            template: templates.getTemplate("taskmanage/task-cut-item"),
            initialize: function() {
                this.listenTo(this.model, 'change:name', function() {
                    this.render();
                });
            },
            ui: {
                "entercut": ".js-entercut",
                "editcut": ".js-editcut"
            },
            triggers: {
                "click @ui.entercut": "cut:entercut",
                "click @ui.editcut": "cut:editcut"
            },
            removeDOM: function () {
                var self = this;
                this.$el.fadeOut(function () {
                    //self.model.remove();
                    Marionette.ItemView.prototype.remove.call(self);
                    console.log('记录已删除...');
                });
            }
        });

        // status  -1：失败; 0:执行中; 1：完成
        View.Synthesis = Marionette.ItemView.extend({
            tagName: "li",
            template: templates.getTemplate("taskmanage/task-synthesis-item"),
            initialize: function () {
                this.listenTo(this.model, 'change:status', function () {
                    this.render();
                });
            },
            ui: {
                "review": ".js-review",
                "delete": ".js-delete",
                "error": ".js-error",
                "redo": ".js-redo"
            },
            triggers: {
                "click @ui.review": "synthesis:review",
                "click @ui.delete": "synthesis:delete",
                "click @ui.error": "synthesis:error",
                "click @ui.redo": "synthesis:redo"
            },
            removeDOM: function () {
                var self = this;
                this.$el.fadeOut(function () {
                    //self.model.remove();
                    Marionette.ItemView.prototype.remove.call(self);
                    console.log('记录已删除...');
                });
            }
        });
        View.Transcode = Marionette.ItemView.extend({
            tagName: "li",
            template: templates.getTemplate("taskmanage/task-transcode-item"),
            initialize: function() {
                this.listenTo(this.model, 'change:status', function() {
                    this.render();
                });
            },
            ui: {
                "download": ".js-download",
                "delete": ".js-delete",
                "error": ".js-error",
                "retranscode": ".js-renewal"
            },
            triggers: {
                "click @ui.download": "transcode:download",
                "click @ui.delete": "transcode:delete",
                "click @ui.error": "transcode:error"
                //"click @ui.retranscode": "transcode:retranscode"
            },
            events: {
                "click @ui.retranscode": "retranscode"
            },
            retranscode: function () {
                //this.ui.retranscode.addClass('rotate');
                this.trigger('transcode:retranscode');
            },
            removeDOM: function() {
                var self = this;
                this.$el.fadeOut(function () {
                    //self.model.remove();
                    Marionette.ItemView.prototype.remove.call(self);
                    console.log('记录已删除...');
                });
            }
        });
        View.Tasks = Marionette.CollectionView.extend({
            tagName: "ul",
            itemViewOptions: {

            },
            getEmptyView: function () {
                return CommonViews.NullView;
            },
            //itemView: View.Task,
            getItemView: function (item) {

                if (this.type == 'review') return View.Review;
                if (this.type == 'Cut') return View.Cut;
                if (this.type == 'Mixture' || this.type == 'synthesis') return View.Synthesis;
                if (this.type == 'Transcode') return View.Transcode;

            },
            initialize: function () {
                //请求接口类型
                this.type = this.collection.state.type;
               
                this.listenTo(this.collection, "reset", function () {
                    //this.$el.empty();
                    //this.appendHtml = function (collectionView, itemView, index) {
                    //    collectionView.$el.append(itemView.el);
                    //};
                    this.render();
                });
            },
            itemEvents: {
                "transcode:download": "transDownload",
                "transcode:delete": "transDelete",
                "transcode:error": "transError",
                "transcode:retranscode": "transRetranscode",

                "cut:entercut": "cutEntercut",
                "cut:editcut": "cutEditcut",

                "synthesis:review": "syReview",
                "synthesis:delete": "syDelete",
                "synthesis:error": "syError",
                "synthesis:redo": "syRedo"
            },
            transDownload: function (event, itemView) {
                CloudMamManager.trigger('transcode:download', itemView);
            },
            transDelete: function (event, itemView) {
                CloudMamManager.trigger('transcode:delete', itemView);
            },
            transError: function (event, itemView) {
                CloudMamManager.trigger('transcode:error', itemView);
            },
            transRetranscode: function (event, itemView) {
                CloudMamManager.trigger('transcode:retranscode', itemView);
            },

            cutEntercut: function (event, itemView) {
                CloudMamManager.trigger('cut:entercut', itemView);
            },
            cutEditcut: function (event, itemView) {
                CloudMamManager.trigger('cut:editcut', itemView);
            },

            syReview: function (event, itemView) {
                CloudMamManager.trigger('synthesis:review', itemView);
            },
            syDelete: function (event, itemView) {
                CloudMamManager.trigger('synthesis:delete', itemView);
            },
            syError: function (event, itemView) {
                CloudMamManager.trigger('synthesis:error', itemView);
            },
            syRedo: function (event, itemView) {
                CloudMamManager.trigger('synthesis:redo', itemView);
            }
        });

        View.PanelView = Marionette.ItemView.extend({
            tagName: "div",
            //el: ".-tm-panel",
            template: "taskmanage/task-panel-item",
            initialize: function(option) {
                this.type = option.type;
            },
            ui: {
                "changeSortState": ".create-time-display ul li"
            },
            events: {
                "click @ui.changeSortState": "changeSortState"
               
            },
            triggerSort: function(params) {
                CloudMamManager.trigger('change:sort', params);
                params.dom.html( params.text);
            },
            changeSortState: function(e) {
                e && e.stopPropagation() && e.preventDefault();
                var self = this;
                var state = this.$(e.target).data('state');
                var text = this.$(e.target).html();
                var dom = self.$(e.target).closest('.create-time').find('a');
                switch (state) {
                    case 'up':
                        self.triggerSort({ key: 'order', value: 1, dom: dom, text: text });
                        break;
                    case 'down':
                        self.triggerSort({ key: 'order', value: -1, dom: dom, text: text });
                        break;
                    case 'allstate':
                        self.triggerSort({ key: 'status', value: '', dom: dom, text: text });
                        break;
                    case 'sucess':
                        self.triggerSort({ key: 'status', value: 1, dom: dom, text: text });
                        break;
                    case 'excute':
                        self.triggerSort({ key: 'status', value: 0, dom: dom, text: text });
                        break;
                    case 'fail':
                        self.triggerSort({ key: 'status', value: -1, dom: dom, text: text });
                        break;
                    default:
                        break;
                    }
            },
            onRender: function () {
                if (this.type == 'review' || this.type == 'cut')
                    this.$('.js-allstate').hide();
            }
        });

        View.PaginatedView = Marionette.Layout.extend({
            tagName: 'div',
            attributes: {
                
            },
            template: "taskmanage/task-pager-layout",
            regions: {
                paginationPanelRegion: ".-tm-panel",
                paginationMainRegion: ".-tm-aoreview",
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


    });
    return CloudMamManager.TaskManageApp.Task.View;
});