/// <reference path="jquery.js" />
/*
* 定制Marionette功能
* 
*
* 定制Marionette.TemplateCache
* 定制Backbone.Marionette.TemplateCache.prototype.loadTemplate为同步加载文件夹templates里模板
* 定制Backbone.Marionette.TemplateCache.prototype.compileTemplate为Handlebars的模板处理

* 定制Marionette.Renderer
* 定制Backbone.Marionette.Renderer.render的模板渲染方式
*/

/*
* 定制Backbone.Marionette.TemplateCache.prototype.loadTemplate为同步加载文件夹templates里模板
*/
define(['utils/handlebars-helper'], function () {



    Backbone.Marionette.TemplateCache.prototype.loadTemplate = function (templateId) {
        var template;
        $.ajax("templates/" + templateId + ".html", { async: false })
            .complete(function (data) {
                template = data.responseText;
            })
            .fail(function () {
                throw ("Could not find template: '" + templateId + "'", "NoTemplateError");
            });
        return template;
    }

    /*
    * 定制Backbone.Marionette.TemplateCache.prototype.compileTemplate为Handlebars的模板处理
    */
    Backbone.Marionette.TemplateCache.prototype.compileTemplate = function (rawTemplate) {
        //console.log("rawTemplate", rawTemplate);
        // use Handlebars.js to compile the template    
        return Handlebars.compile(rawTemplate);
    }

    /*
    *   定制Backbone.Marionette.Renderer.render的模板渲染方式
    */
    Backbone.Marionette.Renderer.render = function (template, data) {

        if (!template) {
            throw ("Cannot render the template since it's false, null or undefined.", "TemplateNotFoundError");
        }

        var templateFunc;
        if (typeof template === "function") {
            templateFunc = template;
        } else {
            template = template.charAt(0) == "#" ? template.substring(1) : template;
            templateFunc = Marionette.TemplateCache.get(template);
        }
        return templateFunc(data);
    }
});