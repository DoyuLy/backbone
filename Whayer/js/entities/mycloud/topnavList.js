define(["app"], function (CloudMamManager) {
    CloudMamManager.module("Entities", function (Entities, CloudMamManager, Backbone, Marionette, $, _) {
        Entities.Topnav = Backbone.Model.extend({ });

        Entities.TopnavCollection = Backbone.Collection.extend({
            model: Entities.Topnav
        });

        var initializeTopnavs = function () {
            Entities.Topnavs = new Entities.TopnavCollection(
				
                    [
                        { title: '上传', router: 'mycloud/upload', cssClass: "doc dropzone", navigateTrigger: "topnav:upload" },
                        { title: '新建文件夹', router: 'mycloud/newfolder', cssClass: "file", navigateTrigger: "topnav:newfolder" },
                        { title: '下载', router: 'mycloud/download', cssClass: "cloud", navigateTrigger: "topnav:download" },
                        { title: '删除', router: 'mycloud/delete', cssClass: "rubbish", navigateTrigger: "topnav:delete" },
                        { title: '更多操作', router: 'mycloud/more', cssClass: "more", navigateTrigger: "topnav:more" },
                        { title: '重命名', router: 'mycloud/rename', cssClass: "rename", navigateTrigger: "topnav:rename" },
                        { title: '移动到', router: 'mycloud/move', cssClass: "move", navigateTrigger: "topnav:move" }
                    ]
				
            );
        };

        var api = {
            getTopnavs: function () {
                if (Entities.Topnavs === undefined) {
                    initializeTopnavs();
                }
                return Entities.Topnavs;
            }
        };

        CloudMamManager.reqres.setHandler("topnav:entities", function () {
            return api.getTopnavs();
        });
    });

    return CloudMamManager.Entities.TopnavCollection;
});
