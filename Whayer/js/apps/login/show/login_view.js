define(["app", "apps/common/views", "apps/mycloud/dialog/dialog_view", "utils/templates", "jquery-ui", "tooltipster"], function (CloudMamManager, CommonViews, Dialog, templates) {
    CloudMamManager.module("LoginApp.Login.View", function (View, CloudMamManager, Backbone, Marionette, $, _) {

        // https://github.com/hongymagic/jQuery.serializeObject
        $.fn.serializeObject = function () {
            "use strict";
            var a = {}, b = function (b, c) {
                var d = a[c.name];
                "undefined" != typeof d && d !== null ? $.isArray(d) ? d.push(c.value) : a[c.name] = [d, c.value] : a[c.name] = c.value
            };
            return $.each(this.serializeArray(), b), a
        };

        View.LoginView = Marionette.ItemView.extend({
            template: "login/login-content",
            className: "login-box",
            ui: {
                "register": ".register",
                "login": ".login",
                "username": "#js_user",
                "password": "#js_password",
                "forget": ".login-forget"
            },
            events: {
                "click @ui.register": "register",
                "click @ui.login": "login",
                "click @ui.forget": "forget",
                "keydown @ui.password": "enterLogin"
            },
            register: function(e) {
                this.trigger('user:register');
            },
            login: function () {
                var data = { username: this.ui.username.val(), password: this.ui.password.val() };
                var validate = this.validate(data);
                //后台登陆
                validate ? this.trigger('user:login', data) : null;
            },
            enterLogin: function(e) {
                if( e.which === 13 ) {
                  this.login();
                }
            },
            forget: function() {
                this.trigger('user:forgetPassword');
            },
            //本地验证
            validate: function (data) {
                //为空验证
                var regUserCode = /^\w{4,16}$/; // /^(?![0-9]+$)|^[a-zA-Z_]{5,17}$/;  // /^[a-zA-Z]\w{5,17}$/;
                var regPsw = /^\w{4,20}$/;
                if (!(data.username && data.password)) {
                    alert('请输入用户名和密码.');
                    return false;
                }
                if (!regUserCode.test(data.username) || !regPsw.test(data.password)) {
                    alert('用户名或密码错误.');
                    return false;
                }
                return true;
            },
            onRender: function () {
                $('body').addClass('login-bg');
            }
        });

        View.ForgetFirstStep = Marionette.ItemView.extend({
            template: "login/forget-firststep",
            className: "fg-wrapper",
            ui: {
                "firstnext": ".js-first-next"
            },
            events: {
                "click @ui.firstnext": "firstNextStep"
            },
            firstNextStep: function() {
                this.trigger('first:nextstep');
            }
        });
        View.ForgetSecondStep = Marionette.ItemView.extend({
            template: "login/forget-secondstep",
            className: "fg-wrapper",
            ui: {
                "secondtnext": ".js-second-next"
            },
            events: {
                "click @ui.secondtnext": "secondNextStep"
            },
            secondNextStep: function () {
                this.trigger('second:nextstep');
            }
        });
        View.ForgetThirdStep = Marionette.ItemView.extend({
            template: "login/forget-thirdstep",
            className: "fg-wrapper",
            ui: {
                "thirdtnext": ".js-third-next"
            },
            events: {
                "click @ui.thirdtnext": "thirdNextStep"
            },
            thirdNextStep: function () {
                this.trigger('third:nextstep');
            }
        });
        View.ForgetLastStep = Marionette.ItemView.extend({
            template: "login/forget-laststep",
            className: "fg-wrapper",
            ui: {

            }
        });

        View.RegisterLayout = Marionette.Layout.extend({
            template: "login/register-layout",
            tagName: 'div',
            attributes: {
                //style: 'height:100%;width:100%'
            },
            regions: {
                headerRegion: ".regs-header",
                mainRegion: ".regs-main",
                dialogRegion: {
                    selector: "#dialog-region",
                    regionType: Backbone.Marionette.Modals
                }
            }
        });

        View.RegisterHeaderView = Marionette.ItemView.extend({
            template: "login/register-header",
            tagName: 'div',
            ui: {
                "title": ".title-font"
            },
            initialize: function(options) {
                this.title = options.title;
            },
            onRender: function() {
                this.title ? this.ui.title.html(this.title) : null;
            }
        });

        //用户注册内容视图，匹配的导航路由为 #user/register
        View.RegisterContentView = Marionette.ItemView.extend({
            template: "login/register-content",
            className: "region fix",
            initialize: function() {
                // This hooks up the validation
                // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/validation-binding
                //绑定验证
                Backbone.Validation.bind(this);
            },
            events: {
                //短息验证码
                "click #verifyCodeSend": "CodeSend",

                //注册提交按钮的单击事件，执行验证规则
                "click #register": function(e) {
                    e.preventDefault()   //取消a标签的默认事件
                    this.register()
                }
            },

            //发起短信验证
            CodeSend: function (e) {
                var self = this;
                var ele = $(e.currentTarget);
                var telephoneVal = self.$el.find("#mobileNum").val();
                var wait = 60;
                //短息验证倒计时
                function time() {
                    if (wait == 0) {
                        ele.prop("disabled", false);
                        ele.removeClass("disabled");
                        ele.val("免费获取验证码");
                        wait = 60;
                    } else {
                        // 按钮不可用，增加不可用样式，并且开始倒计时;
                        ele.prop("disabled", true);
                        ele.addClass("disabled");
                        ele.val("重新发送(" + wait + ")");
                        wait--;
                        setTimeout(function () {
                                time();
                            },
                            1000
                        );
                    }
                }

                if (telephoneVal) {
                    var data = {mobileNum: telephoneVal};
                    this.trigger('user:validateing', data);
                    time();
                }

            },
            //注册
            register: function () {
                //序列化数据表单
                var data = this.$el.find("form").serializeObject();
                //重新设置属性
                this.model.set(data);
                // Check if the model is valid before saving
                // See: http://thedersen.com/projects/backbone-validation/#methods/isvalid
                //如果全部通过验证规则
                if (this.model.isValid(true)) {
                    this.model.save("", "", {
                        success: function (model, response) {
                            alert(response.msg);
                        },
                        error  : function (model, response) {
                            alert("网络错误！")
                        }
                    });
                }
            },
            //移除验证事件
            remove: function() {
                // Remove the validation binding
                // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/unbinding
                Backbone.Validation.unbind(this);
                return Backbone.View.prototype.remove.apply(this, arguments);
            }
        });
    });
    return CloudMamManager.LoginApp.Login.View;
});