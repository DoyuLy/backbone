define(["handlebars", "utils/handlebars-helper"], function (Handlebars) {
    var templatesCache = templatesCache || {};

    templatesCache.getTemplate = function(name) {

    if (templatesCache.templates === undefined || templatesCache.templates[name] === undefined) {
        $.ajax({
            url : "templates/" + name + ".html",
            success : function(data) {
            if (templatesCache.templates === undefined) {
                templatesCache.templates = {};
            }
            templatesCache.templates[name] = Handlebars.compile(data);
            },

            async : false
          });
        }
      return templatesCache.templates[name];
    }

    return templatesCache;
});

 
    