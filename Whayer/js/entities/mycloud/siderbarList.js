define(["app"], function (CloudMamManager) {
    CloudMamManager.module("Entities", function (Entities, CloudMamManager, Backbone, Marionette, $, _) {
        Entities.Siderbar = Backbone.Model.extend({});

        Entities.SiderbarCollection = Backbone.Collection.extend({
            model: Entities.Siderbar
        });

        var initializeSiderbars = function () {
            Entities.Siderbars = new Entities.SiderbarCollection(
				
                    [
                        { title: '所有活动', router: 'mycloud/edit', cssClass: "edit", navigateTrigger: "siderbar:edit" },
                        { title: '剪切', router: 'mycloud/copy', cssClass: "copy", navigateTrigger: "siderbar:copy" },
                        { title: '视频审阅', router: 'mycloud/video', cssClass: "video", navigateTrigger: "siderbar:video" },
                        { title: '音频审阅', router: 'mycloud/music', cssClass: "music", navigateTrigger: "siderbar:music" },
                        { title: '转码', router: 'mycloud/transform', cssClass: "trans", navigateTrigger: "siderbar:transform" },
                        { title: '秒鸽', router: 'mycloud/miaoge', cssClass: "miaoge", navigateTrigger: "siderbar:miaoge" }
                    ]
            );
        };

        var api = {
            getSiderbars: function () {
                if (Entities.Siderbars === undefined) {
                    initializeSiderbars();
                }
                return Entities.Siderbars;
            }
        };

        CloudMamManager.reqres.setHandler("siderbar:entities", function () {
            return api.getSiderbars();
        });
    });

    return CloudMamManager.Entities.Siderbar;
});
