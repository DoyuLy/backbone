requirejs.config({
    //enforceDefine: true,
    baseUrl: "js",
    charset: function(url) {
        if (/validationEngine-zh/.test(url)) {
            return 'GBK';
        }
        return 'UTF-8';
    },
    paths: {
        jquery: "libs/jquery",
        underscore: "libs/underscore",
        backbone: "libs/backbone",
        marionette: "libs/backbone.marionette",
        "jquery-ui": "libs/jquery-ui",
        localstorage: "libs/backbone.localStorage",
        handlebars: "libs/handlebars",
        text: "libs/text",
        css: "libs/css.min",
        normalize: "libs/normalize",
        "backbone.syphon": "libs/backbone.syphon",
        "jquery.spin": "libs/jquery.spin",
        "spin": "libs/spin",
        "backbone.picky": "libs/backbone.picky",
        "backbone.paginator": "libs/backbone.paginator",
        "backbone.validation": "libs/backbone-validation-amd",
        "backgrid.paginator": "libs/backgrid-paginator",
        "marionette.templateCache": "utils/marionette.templateCache",
        "selected.helper": "utils/selected-all-helper",
        "backbone.modal": "libs/backbone.modal",


        "backbone.marinette.models": "libs/backbone.marionette.modals",
        "dropzone": "libs/dropzone-amd-module",
        "backbone.sync.custom": "utils/backbone.sync.custom",
        "domReady": "libs/domReady",
        "video": "libs/video",
        "SobeyVideo": "utils/SbVideo",
        "timeCode": "utils/timecode",
        "timeCodeConverter": "utils/timecodeconvert",
        "timeline": "utils/timeline",
        "tooltipster": "libs/jquery.tooltipster.min",
        "nanoscroller": "libs/jquery.nanoscroller.min",
        "mCustomScrollbar": "libs/jquery.mCustomScrollbar.concat.min",
        "zClip": "libs/zClip",
        "validateEngine": "libs/jquery.validationEngine",
        "validateEngine_zh": "libs/jquery.validationEngine-zh",
        "backbone.notifier": "libs/backbone.notifier",
        "notifierHelper": "utils/NotifierHelper",


        "mycloud_app": "apps/mycloud/mycloud_app",
        "cut_app": "apps/cut/cut_app",
        "taskmanage_app": "apps/taskmanage/taskmanage_app",
        "usercenter_app": "apps/usercenter/usercenter_app",
        "login_app": "apps/login/login_app",
        "clipreview_app": "apps/clipreview/review_app",



        "Jcrop": "libs/jquery.Jcrop.min",
        "fullAvatarEditor": "utils/fullAvatarEditor/scripts/fullAvatarEditor",
        "swfobject": "utils/fullAvatarEditor/scripts/swfobject",
        "jQuery.Cookie": "libs/jQuery.Cookie",
        "jQuery.dialog": "libs/jQuery.dialog",
        "jQuery.Drag": "libs/jQuery.Drag",
        "jQuery.Resize": "libs/jQuery.Resize",
        /*
        * jQuery.wPaint 绘图插件加载
        */
        <!-- jQuery UI -->
        "jQuery.ui": "libs/wPaint/libs/jquery.ui.core.1.10.3.min",
        "jQuery.ui.widget": "libs/wPaint/libs/jquery.ui.widget.1.10.3.min",
        "jQuery.ui.mouse": "libs/wPaint/libs/jquery.ui.mouse.1.10.3.min",
        "jQuery.ui.draggable": "libs/wPaint/libs/jquery.ui.draggable.1.10.3.min",
        <!-- wColorPicker -->
        "wColorPicker": "libs/wPaint/libs/wColorPicker.min",
        <!-- wPaint -->
        "wPaint": "libs/wPaint/wPaint.min",
        <!-- wPaint plugins-->
        "wPaint.menu": "libs/wPaint/plugins/main/src/wPaint.menu.main"
    },

    shim: {
        "jQuery.ui": ["jquery"],
        "jQuery.ui.widget": ["jQuery.ui"],
        "jQuery.ui.mouse": ["jQuery.ui.widget"],
        "jQuery.ui.draggable": ["jQuery.ui.mouse"],
        "wColorPicker": ["jQuery.ui.draggable", "css!libs/wPaint/libs/wColorPicker.min.css"],
        "wPaint": ["wColorPicker", "css!libs/wPaint/wPaint.min.css"],
        "wPaint.menu": ["wPaint"],


        "mycloud_app": {
            deps: ['css!../css/manage.css',
                'css!../css/backbone.modal.css',
                'css!../css/backbone.modal.theme.css',
                'css!../css/dropzone_basic.css',
                'css!../css/backbone-treeview.css'
                //'css!../css/dropzone.css'
            ]
        },
        "cut_app": {
            deps: ["css!../css/cut.css"]
        },
        "taskmanage_app": {
            deps: ["css!../css/manage.css"]
        },
        "usercenter_app": {
            deps: ["css!../css/manage.css"]
        },
        "login_app": {
            deps: [
                "css!../css/login.css",
                "css!../css/register.css",
                "css!../css/findPsw.css"
            ]
        },
        "clipreview_app": {
            deps: ["css!../css/clipreview.css",]
        },
        validateEngine: {
            deps: ['jquery', 'validateEngine_zh', "css!../css/template.css", "css!../css/validationEngine.jquery.css"]
        },
        validateEngine_zh: {
          deps: ['jquery']  
        },
        mCustomScrollbar: {
            deps: ['jquery', 'css!../css/jquery.mCustomScrollbar.css']
        },
        tooltipster: {
            deps: ['jquery', 'css!../css/tooltipster.css']
        },
        timeline: {
            deps: ['jquery'],
            exports: 'TimeLine'
        },
        timeCode: {
            exports: "TimeCode"
        },
        timeCodeConverter: {
            exports: "TimeCodeConvert"
        },
        video: {
            deps: ['css!../css/video-js.css', 'jquery']
        },
        SobeyVideo: {
            deps: ['timeCode', 'timeCodeConverter', 'jquery'],
            exports: "SbVideo"
        },
        underscore: {
            exports: "_"
        },
        handlebars: {
            exports: "Handlebars"
        },

        backbone: {
            deps: ["underscore", "jquery", "handlebars"],
            exports: "Backbone"
        },
        marionette: {
            deps: ["backbone"],
            exports: "Marionette"
        },
        zClip: {
            deps: ["jquery"]
        },
        "jquery-ui": {
            deps: ["jquery", "css!../css/jquery-ui-1.10.3.custom.css"]
        },
        "sly":{
            deps: ["jquery"],
            exports: "Sly"
        },
        "backbone.syphon": ["backbone"],

        "backbone.picky": ["backbone"],

        "jquery.spin": ["spin", "jquery"],

        "backbone.paginator": ["backbone"],

        "marionette.templateCache": ["marionette"],

        "backbone.modal": ["marionette"],

        "backbone.marinette.models": ["backbone.modal"],

        "backbone.sync.custom": ["backbone"],

        "Jcrop": {
            deps: ["jquery", "css!../css/jquery.Jcrop.min.css"]
        },
        "backbone.notifier": {
            deps: ["jquery", "backbone", "underscore", "css!../css/notifier-base.css", "css!../css/notifier-theme-plastic.css"]
        },
        "notifierHelper": {
            deps: ["backbone.notifier"]
        }

    }
});

require(["app", "backbone.sync.custom", "marionette.templateCache", "css", "normalize"], function (CloudMamManager) {

    CloudMamManager.start();

});




