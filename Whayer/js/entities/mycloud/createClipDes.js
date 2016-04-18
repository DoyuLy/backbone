define(["app"], function (CloudMamManager) {
    CloudMamManager.module("Entities", function (Entities, CloudMamManager, Backbone, Marionette, $, _) {
        Entities.CreateClipDes = Backbone.Model.extend({
            //urlRoot: "/emc/favorite/",
            //idAttribute: "contentId"
        });
        Entities.ClipDesCollection = Backbone.Collection.extend({
            model: Entities.CreateClipDes
        });

    });

    return CloudMamManager.Entities.CreateClipDes;
    //{
    //    CreateClipDes: CreateClipDes,
    //    ClipDesCollection: ClipDesCollection
    //}
});
