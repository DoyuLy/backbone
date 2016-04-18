define(["app", "backbone.picky"], function (CloudMamManager) {
    CloudMamManager.module("Entities", function (Entities, CloudMamManager, Backbone, Marionette, $, _) {
        Entities.UserCenterSubnav = Backbone.Model.extend({
            initialize: function () {
                var selectable = new Backbone.Picky.Selectable(this);
                _.extend(this, selectable);
            }
        });

        Entities.UserCenterSubnavCollection = Backbone.Collection.extend({
            model: Entities.UserCenterSubnav,

            initialize: function () {
                var singleSelect = new Backbone.Picky.SingleSelect(this);
                _.extend(this, singleSelect);
            }
        });

        var initializeSubnavs = function () {
            Entities.usersubnavs = new Entities.UserCenterSubnavCollection(

                    [
                        { title: '个人详细信息', router: 'detail', prefix: "user/center", imgUrl: '', navigateTrigger: "leftnav:detail" },
                        { title: '修改头像', router: 'changehead', prefix: "user/center", imgUrl: '', navigateTrigger: "leftnav:changehead" },
                        { title: '修改密码', router: 'changepsw', prefix: "user/center", imgUrl: '', navigateTrigger: "leftnav:changepsw" },
                        { title: '当前资费', router: 'currentrate', prefix: "user/center", imgUrl: '', navigateTrigger: "leftnav:currentrate" },
                        { title: '用量', router: 'dosage', prefix: "user/center", imgUrl: '', navigateTrigger: "leftnav:dosage" }
                    ]

            );
        };

        var api = {
            getSubnavs: function () {
                if (Entities.usersubnavs === undefined) {
                    initializeSubnavs();
                }
                return Entities.usersubnavs;
            },
            getSubNavTypeName: function (navType) {
                if (Entities.usersubnavs) {
                    var subNav = Entities.usersubnavs.find(function (model) {
                        return model.get("router") === navType;
                    });
                    return subNav.get("title");
                }
                return;
            }
        };

        CloudMamManager.reqres.setHandler("usercenter:subnav:entities", function () {
            return api.getSubnavs();
        });

        CloudMamManager.reqres.setHandler("usercenter:navtypename:entities", function (navType) {
            return api.getSubNavTypeName(navType);
        });
    });

    return;
});
