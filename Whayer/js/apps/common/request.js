define([['backbone', 'config']], function (Backbone, config) {
    /* model必须为JSON格式 */
    function request(options) {
        this.baseUrl = config.dcmpRESTfulIp;
        this.post = function(restUrl, model, callback) {
                Backbone.ajax({
                    type: 'POST',
                    url: this.baseUrl + restUrl,
                    data: JSON.stringify(model),
                    dataType: 'text',
                    processData: false,
                    contentType: 'application/json; charset=utf-8',
                    success: callback,
                    error: function(req, status, ex) {},
                    timeout: 60000
                });
            },
            this.put = function(restUrl, model, callback) {
                Backbone.ajax({
                    type: 'PUT',
                    url: this.baseUrl + restUrl,
                    data: JSON.stringify(model),
                    dataType: 'text',
                    processData: false,
                    contentType: 'application/json; charset=utf-8',
                    success: callback,
                    error: function(req, status, ex) {},
                    timeout: 60000
                });
            };

        this.get = function(restUrl, model, callback) {
            Backbone.ajax({
                type: 'GET',
                url: this.baseUrl + restUrl,
                contentType: 'application/json; charset=utf-8',
                success: callback,
                error: function(req, status, ex) {},
                timeout: 60000
            });
        };

        this.remove = function(restUrl, id, callback) {
            Backbone.ajax({
                type: 'DELETE',
                url: this.baseUrl + restUrl + '/' + id,
                contentType: 'application/json; charset=utf-8',
                success: callback,
                error: function(req, status, ex) {},
                timeout: 60000
            });
        };

        this.find = function(restUrl, id, callback) {
            Backbone.ajax({
                type: 'GET',
                url: this.baseUrl + restUrl + '/' + id,
                contentType: 'application/json; charset=utf-8',
                success: callback,
                error: function(req, status, ex) {},
                timeout: 60000
            });
        };

        this.findAll = function(restUrl, callback) {
            Backbone.ajax({
                type: 'GET',
                url: this.baseUrl + restUrl,
                contentType: 'application/json; charset=utf-8',
                success: callback,
                error: function(req, status, ex) {},
                timeout: 60000
            });
        };
    }


    return {
        request: request
    }
});