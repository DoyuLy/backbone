
define(["backbone.notifier"], function () {
    var notifierHelper = {};
    this.notifier = window.notifier = new Backbone.Notifier({
        ms: 5000,
        caller: 'examples'
    });
    // 显示loading
    notifierHelper.showLoading = function () {
        var loader = notifier.notify({
            'type': 'info',
            modal: true,
            loader: true,
            myAttr: 'ajaxLoader',
            ms: 20000,
            theme: 'clean',
            opacity: 1,
            position: 'center',
            message: "",
            screenOpacity: 0.1
        });
    };
    
    notifierHelper.tip = function (msg) {
        notifier.info({
            message: msg,
            destroy: true,
            opacity: 1,
            position: 'center',
            theme:'plastic',
            ms: 3000
        });
    };
    notifierHelper.info = function (msg, title) {
        notifier.info({
            dialog: true,
            title: title,
            message: msg,
            closeBtn: true,
            destroy: true,
            opacity: 1,
            position: 'center',
            theme:'plastic',
            ms: null
        });
    }

    notifierHelper.closeLoading = function () {
        notifier.destroyAll();
    };

    return notifierHelper;
})