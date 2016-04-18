define(["app", "backbone.picky"], function (CloudMamManager) {
    CloudMamManager.module("Entities", function (Entities, CloudMamManager, Backbone, Marionette, $, _) {
        Entities.TaskSubnav = Backbone.Model.extend({
            initialize: function () {
                var selectable = new Backbone.Picky.Selectable(this);
                _.extend(this, selectable);
            }
        });

        Entities.TaskSubnavCollection = Backbone.Collection.extend({
            model: Entities.TaskSubnav,

            initialize: function () {
                var singleSelect = new Backbone.Picky.SingleSelect(this);
                _.extend(this, singleSelect);
            }
        });

        var initializeSubnavs = function () {
            Entities.tasksubnavs = new Entities.TaskSubnavCollection(

                    [
                        //{ title: '视音频审阅', router: 'review', prefix: "task/manage", imgUrl: 'images/taskmanage/video.png', navigateTrigger: "leftnav:review" },
                        { title: '剪切', router: 'cut', prefix: "task/manage", imgUrl: 'images/taskmanage/cut1.png', navigateTrigger: "leftnav:cut" },
                        { title: '转码', router: 'transcode', prefix: "task/manage", imgUrl: 'images/taskmanage/zhuanma1.png', navigateTrigger: "leftnav:transcode" },
                        { title: '合成新素材', router: 'synthesis', prefix: "task/manage", imgUrl: 'images/taskmanage/left-hecheng1.png', navigateTrigger: "leftnav:synthesis" }
                    ]

            );
        };

        var api = {
            getSubnavs: function () {
                if (Entities.tasksubnavs === undefined) {
                    initializeSubnavs();
                }
                return Entities.tasksubnavs;
            },
            getSubNavTypeName: function (navType) {
                if (Entities.tasksubnavs) {
                    var subNav = Entities.tasksubnavs.find(function (model) {
                        return model.get("router") === navType;
                    });
                    return subNav.get("title");
                }
                return;
            }
        };

        CloudMamManager.reqres.setHandler("task:subnav:entities", function () {
            return api.getSubnavs();
        });

        CloudMamManager.reqres.setHandler("task:navtypename:entities", function (navType) {
            return api.getSubNavTypeName(navType);
        });
    });

    return;
});
