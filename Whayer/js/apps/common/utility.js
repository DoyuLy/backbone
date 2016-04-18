define(['localstorage'], function () {

    //本地存储
    var localStorage = {
        saveUserInfo: function (options) {
            var localstorage = new Store('_user');
            localstorage.create({ id: '_userinfo', info: options });
        },
        getUserInfo: function() {
            return new Store('_user').find({ id: '_userinfo' });
        },
        SaveCutId: function (options) {
            var localstorage = new Store('_cut');
            localstorage.create({ id: '_cutid', name: options.name, desc: options.desc, data: options.data });
        },
        GetCutId: function() {
            return new Store('_cut').find({ id: '_cutid' });
        },
        SaveReviewInfo: function (options) {
            var localstorage = new Store('_review');
            localstorage.create({ id: '_reviewid', data: { name: options.name, description: options.desc, contentId: options.contentId, user: options.user } });
        },
        GetReviewInfo: function() {
            return new Store('_review').find({ id: '_reviewid' });
        },
        GetHeaderImg: function() {
            return localStorage.getUserInfo().info.headUrl;
        }
    };


    return {
        localStorage: localStorage
    }
});