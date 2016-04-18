define(["app", "config", "jquery", "backbone.validation"], function (CloudMamManager, config, $, validation) {

    _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

    // See: http://thedersen.com/projects/backbone-validation/#configuration/callbacks
    //覆盖默认的验证，这样可以做到个性化自定义验证，用自己写的方法来做提消息提醒
    _.extend(Backbone.Validation.callbacks, {
        valid  : function (view, attr, selector) {
            var $el = view.$('[name=' + attr + ']'),
                $group = $el.closest('.form-group');
            $group.removeClass('has-error');
            $group.find('span').html('').removeClass().addClass('success');
        },
        invalid: function (view, attr, error, selector) {
            var $el = view.$('[name=' + attr + ']'),
                $group = $el.closest('.form-group');
            $group.addClass('has-error');
            $group.find('span').html(error).removeClass().addClass("error");
        }
    });

    var Login = Backbone.Model.extend({
        urlRoot: '/uic/login'
    });

    var RegisterModel = Backbone.Model.extend({
        url       :  "/uic/register",
        default   : {
            captcha: ""
        },
        //定义这个模块的验证规则
        validation: {
            userCode      : [{
                required: true,
                msg     : '用户名不能为空'
            }, {
                pattern: /^\w{4,20}$/,
                msg: "用户名为4到20字母或数字"
            }],
            password      : {
                minLength: 6,
                msg: "密码错误"
            },
            repeatPassword: {
                equalTo: 'password',
                msg    : '密码不一致'
            },
            mobileNum           : {
                required: true,
                length  : 11,
                msg: "电话错误"
            },
            verificationCode       : {
                required: true,
                length  : 5,
                msg: "验证码错误"
            },
            email         : [{
                required: true,
                msg     : '请输入一个邮箱地址'
            }, {
                pattern: 'email',
                msg    : '邮箱是无效的'
            }]
        }
    });


    var api = {

        userLogin   : function (options) {
            var data = _.extend(options, {rememberMe: false, logintype: "web"});
            //var model = new Login(data);
            //var response = model.save(null, { contentType: 'application/x-www-form-urlencoded' });
            var response = Backbone.ajax({
                url        : config.dcmpRESTfulIp + "/uic/login",
                type       : 'POST',
                data       : $.param(data),
                contentType: 'application/x-www-form-urlencoded'
            });
            return response.promise();
        },
        userRegister: function (options) {
            var response = Backbone.ajax({
                url        : config.dcmpRESTfulIp + '' + "/uic/register",
                type       : 'POST',
                data       : JSON.stringify(options),
                contentType: 'application/json'
            });
            return response.promise();
        },
        userValidate: function (options) {
            var response = Backbone.ajax({
                url : config.dcmpRESTfulIp + '' + "/uic/verificationCode",
                type: 'GET',
                data: $.param(options)
            });
            return response.promise();
        }
    };


    CloudMamManager.reqres.setHandler("user:login", function (options) {
        return api.userLogin(options);
    });
    CloudMamManager.reqres.setHandler("user:registing", function (options) {
        return api.userRegister(options);
    });
    CloudMamManager.reqres.setHandler("user:validateing", function (options) {
        return api.userValidate(options);
    });
    //取得注册模块的实例
    CloudMamManager.reqres.setHandler("register:entity:new", function () {
        return new RegisterModel();
    });
    return Login;
});