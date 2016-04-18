define(["app", "config", "backbone.picky"], function (CloudMamManager, config) {
    CloudMamManager.module("Review.Comment", function (Comment, CloudMamManager, Backbone, Marionette, $, _) {

        //声明model
        Comment.Model = Backbone.Model.extend({
            urlRoot: "/ac/review/item",
            initialize: function () {//初始化
                var selectable = new Backbone.Picky.Selectable(this);
                _.extend(this, selectable);
            }
        });
        //声明Collection
        Comment.Collection = Backbone.Collection.extend({
            model: Comment.Model,
            initialize: function () {//初始化
                var singleSelect = new Backbone.Picky.SingleSelect(this);
                _.extend(this, singleSelect);
            }
        });
    });

    //接口
    var api = {
        commitReply: function (params) {
            var response = Backbone.ajax({
                url: config.dcmpRESTfulIp + "/ac/review/item",
                type: "POST",
                data: JSON.stringify(params),
                contentType: 'application/json;charset=utf-8'
            });
            return response.promise();
        }
    };

    //提交评论
    CloudMamManager.reqres.setHandler("reply:commit", function (params) {
        return api.commitReply(params);
    });

    return CloudMamManager.Review.Comment;
});