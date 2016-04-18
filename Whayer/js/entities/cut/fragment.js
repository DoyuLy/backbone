define(["app","config" ,"backbone.picky"], function (CloudMamManager,config) {
    CloudMamManager.module("Cut.Fragment", function (Fragment, CloudMamManager, Backbone, Marionette, $, _) {
        
        //声明model
        Fragment.Model = Backbone.Model.extend({
            urlRoot: "/ac/sequence",
            initialize: function () {//初始化
                var selectable = new Backbone.Picky.Selectable(this);
                _.extend(this, selectable);
            }
        });
        //声明Collection
        Fragment.Collection = Backbone.Collection.extend({
            model: Fragment.Model,
            initialize: function () {//初始化
                var singleSelect = new Backbone.Picky.SingleSelect(this);
                _.extend(this, singleSelect);
            }
        });
        //接口
        var api = {
            getFragments: function () {//获取所有剪切片段
                //var fragments = new Fragment.Collection();

                ////异步请求
                //var defer = Backbone.$.Defered();
                ////请求片段
                //var response = fragments.fetch();//可以定制请求url

                //response.done(function () {
                //    defer.resolveWith(response, [fragments]);
                //}).fail(function () {
                //    defer.rejectWith(response, arguments);
                //});

                //return defer.promise();

                var fragments = new Fragment.Collection([
                    {
                        keyFramePath: "http://172.16.135.124:80/keyframe/Clip/2014/08/04/a523Cq3Rf1W327r3ddJo2rh76Z0U5Ulu/e7a3fafa-2842-4e44-a0e2-96ea6c8da660.jpg",
                        title: "剪切片段1",
                        duration: "00:00:06.37"
                    },
                    {
                        keyFramePath: "http://172.16.135.124:80/keyframe/Clip/2014/08/04/a523Cq3Rf1W327r3ddJo2rh76Z0U5Ulu/e7a3fafa-2842-4e44-a0e2-96ea6c8da660.jpg",
                        title: "剪切片段2",
                        duration: "00:00:06.37"
                    },
                    {
                        keyFramePath: "http://172.16.135.124:80/keyframe/Clip/2014/08/04/a523Cq3Rf1W327r3ddJo2rh76Z0U5Ulu/e7a3fafa-2842-4e44-a0e2-96ea6c8da660.jpg",
                        title: "剪切片段3",
                        duration: "00:00:06.37"
                    }
                ]);

                return fragments;
            },
            createFragement: function (data) {//新增片段
                var response = Backbone.ajax({
                    type: "POST",
                    contentType: 'application/json',
                    url:  config.dcmpRESTfulIp + '' + "/ac/sequence",
                    data: JSON.stringify(data),
                    dataType: "text",
                    //success: function (data, stateText, jqXHR) {
                    //    //console.log(arguments);
                    //    var data = JSON.parse(data);
                    //    //data.id = JSON.parse(response)
                    //    fragmentCollection.add(data);
                    //}
                });
                return response;
            },
            renameFragement: function (data) {//重命名片段
                var response = Backbone.ajax({
                    type: "PUT",
                    url:  config.dcmpRESTfulIp + '' + "/ac/sequence/" + data.id,
                    contentType: 'application/json',
                    dataType: "text",
                    data: JSON.stringify(data),
                    //success: function (response) {
                    //    console.log(response);
                    //}
                });
                return response;
            },
            sortFragments: function (ids) {//重命名片段
                var response = Backbone.ajax({
                    type: "POST",
                    url:  config.dcmpRESTfulIp + '' + "/ac/sequence/" + ids,
                    contentType: 'application/json',
                    dataType: "text"
                });
                return response;
            }
        };

        CloudMamManager.reqres.setHandler("cut:fragments", function () {//返回剪切片段
            return api.getFragments();
        });

        CloudMamManager.reqres.setHandler("create:fragement", function (data) {//新增片段
            return api.createFragement(data);
        });

        CloudMamManager.reqres.setHandler("rename:fragement", function (data) {//新增片段
            return api.renameFragement(data);
        });

        CloudMamManager.reqres.setHandler("sort:fragment", function (ids) {//新增片段
            return api.sortFragments(ids);
        });

    });
    return CloudMamManager.Cut.Fragment;
});