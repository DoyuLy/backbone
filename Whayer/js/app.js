define(["marionette", "backbone.marinette.models"], function (Marionette, Dialog) {

    var CloudMamManager = new Marionette.Application();

    CloudMamManager.addRegions({
        //headerRegion: ".header",
        //mainRegion: ".main",
        //dialogRegion: {
        //    selector: "#dialog-region",
        //    regionType: Backbone.Marionette.Modals
        //},
        bodyRegion: "body"
    });
    //手动导航
    CloudMamManager.navigate = function (route, options) {
        options || (options = {});
        Backbone.history.navigate(route, options);
    };

    CloudMamManager.getCurrentRoute = function () {
        return Backbone.history.fragment;
    };

    CloudMamManager.startSubApp = function (appName, args) {
        var currentApp = appName ? CloudMamManager.module(appName) : null;

        if (CloudMamManager.currentApp === currentApp) {
            return;
        }

        if (CloudMamManager.currentApp) {
            CloudMamManager.currentApp.stop();
        }

        CloudMamManager.currentApp = currentApp;
        if (currentApp) {
            currentApp.start(args);
        }
    };

    CloudMamManager.on("initialize:after", function () {

        if (Backbone.history) {

            require(["mycloud_app", "cut_app", "taskmanage_app", "usercenter_app", "login_app", "clipreview_app"], function () {

                Backbone.history.start();

                var options = {
                    version: "0.1.0",
                    author: "cloud mam group"
                };

                if (CloudMamManager.getCurrentRoute() === "") {

                    //初始化登陆页面
                    CloudMamManager.trigger("login:init");
                    //初始化网盘页面
                    //CloudMamManager.trigger("cloudspace:init");
                }
            });
        }
    });


    return CloudMamManager;

});


/*
 1. 手动调用 module.appstart(options) 事件生命周期：

 ↓ module.on("before:appstart", fn); --> 模块启动前,可做用户sesion验证之类的(改写：this.listenTo(module, 'before:appstart', fn(options)) 或者 this.onBeforeStart = funtion(options){};)
 Ps：此法顺带可避免定时器轮询用户session
 ↓ module.addInitializer(fn(options));   --> 模块 module.appstart(options);之后开始执行初始化 ,且数量不限制
 ↓ module.on("appstart", fn(options));    --> 初始化完成后执行(改写：this.listenTo(module, 'appstart', fn(options)) 或者 this.onStart = funtion(options){};)

 Ps：在本域下路由出错,提供404 page

 2. startWithParent
 我们所有的顶级父模块(SubApp)默认随父应用启动,但SubApp下的SubModule我们不建议不这样做,请显式屏蔽自动启动: this.startWithParent = false;
 原因：父级一旦启动,子模块只需要 按需启动即可; 父级一旦stop,子模块会默认跟着强制关闭
 若需要启动module ,请显式调用module.appstart();

 3. module.stop();
 避免僵尸,切换应用时请stop模块(stop父级模块会自动停止其下子模块)
 Ps：stop 和 appstart 有类似生命周期

 4.SubApp一旦关闭,请添加监听并关闭其下所有controller ：
 //controller.listenTo(ContactManager.ContactApp, 'stop', fn);
 controller.onStop = function(options){
 this.close();
 }
 */