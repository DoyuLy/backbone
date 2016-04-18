define(["app", "backbone.picky"], function (CloudMamManager) {
    CloudMamManager.module("Entities", function (Entities, CloudMamManager, Backbone, Marionette, $, _) {
        Entities.Subnav = Backbone.Model.extend({
            initialize: function () {
                var selectable = new Backbone.Picky.Selectable(this);
                _.extend(this, selectable);
            }
        });

        Entities.SubnavCollection = Backbone.Collection.extend({
            model: Entities.Subnav,

            initialize: function () {
                var singleSelect = new Backbone.Picky.SingleSelect(this);
                _.extend(this, singleSelect);
            }
        });

        var initializeSubnavs = function () {
            Entities.subnavs = new Entities.SubnavCollection(
				
                    [
                        { title: '全部文件', router: 'All',prefix:"nav", imgUrl: 'images/manage/icon_1.png', navigateTrigger: "leftnav:alllist" },
                        { title: '视音频', router: 'Clip', prefix: "nav", imgUrl: 'images/manage/icon_4.png', navigateTrigger: "leftnav:avlist" },
                        { title: '音频', router: 'Audio', prefix: "nav", imgUrl: 'images/manage/icon_18.png', navigateTrigger: "leftnav:avlist" },
                        { title: '图片', router: 'Picture', prefix: "nav", imgUrl: 'images/manage/icon_53.png', navigateTrigger: "leftnav:piclist" },
                        { title: '文档', router: 'Document', prefix: "nav", imgUrl: 'images/manage/icon_6.png', navigateTrigger: "leftnav:doclist" },
                        { title: '其他', router: 'Other', prefix: "nav", imgUrl: 'images/manage/icon_7.png', navigateTrigger: "leftnav:otherlist" },
                        { title: '常用文件', router: 'Favorite', prefix: "nav", imgUrl: 'images/manage/icon_3.png', navigateTrigger: "leftnav:commonlist" },
                        { title: '回收站', router: 'Recycle', prefix: "nav", imgUrl: 'images/manage/icon_2.png', navigateTrigger: "leftnav:recyclelist" }
                    ]
				
            );
        };

        var api = {
            getSubnavs: function () {
                if (Entities.subnavs === undefined) {
                    initializeSubnavs();
                }
                return Entities.subnavs;
            },
            getSubNavTypeName: function (navType) {
                if (Entities.subnavs) {
                    var subNav = Entities.subnavs.find(function (model) {
                        return model.get("router") === navType;
                    });
                    return subNav.get("title");
                }
                return;
            }
        };

        CloudMamManager.reqres.setHandler("subnav:entities", function () {
            return api.getSubnavs();
        });

        CloudMamManager.reqres.setHandler("navtypename:entities", function (navType) {
            return api.getSubNavTypeName(navType);
        });
    });

    return;
});
