define(['backbone', 'config'], function (Backbone, config) {
    //定制自己的请求方式
    var originalSync = Backbone.sync;
    //重新Backbone.sync
    Backbone.sync = function (method, model, options) {
        //console.log("调用重写的 Backbone.sync");
        var deferred = $.Deferred();
        options || (options = {});
        //新建操作
        if (method.toUpperCase() === 'CREATE') {
            //options.data = model ? JSON.stringify(model) : null; //$.param(JSON.parse(JSON.stringify(model))) : '';
        }
        //修改操作
        if (method.toUpperCase() === 'UPDATE') {
            //console.log(method + " request");
            //options.url += "?" + $.param(JSON.parse(JSON.stringify(model)));            
        }

        if (method.toUpperCase() === 'DELETE') {
            console.log("Http " + method + " request!");
        }
        if (!options.url) {
            options.url = _.result(model, 'url');
        }
        options.url =  config.dcmpRESTfulIp + options.url;

        deferred.then(options.success, options.error);

        var response = originalSync(method, model, _.omit(options, "success", "error"));

        response.done(deferred.resolve);

        response.fail(function () {
            var returnurl = encodeURIComponent(window.location.href);
            if (response.status == 401) {
                console.log("认证失败，请重新登录");
                window.location = "401.html?returnurl=" + returnurl;
            } else if (response.status == 403) {
                console.log("未处理错误:", response.responseJSON.message);
                window.location = "401.html?returnurl=" + returnurl;
            } else if (response.status == 401) {
                window.location = "404.html?returnurl=" + returnurl;
            } else {
                deferred.rejectWith(response, arguments);
            }
            deferred.rejectWith(response, arguments);
        });
        return deferred.promise();
    };
});