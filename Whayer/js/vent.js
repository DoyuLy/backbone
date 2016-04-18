define(["backbone","Marionette"],function(Backbone){
	return new Backbone.Wreqr.EventAggregator();
});

var tpldata =
{
    All: { title: '全部文件', router: '#all', imgUrl: 'images/icon_1.png', navigateTrigger: "rightmain:alllist" },
    Subnav:
    [
        { title: '视音频', router: '#av', imgUrl: 'images/icon_4.png', navigateTrigger: "rightmain:avlist" },
        { title: '图片', router: '#pic', imgUrl: 'images/icon_5.png', navigateTrigger: "rightmain:piclist" },
        { title: '文档', router: '#doc', imgUrl: 'images/icon_6.png', navigateTrigger: "rightmain:doclist" },
        { title: '其他', router: '#other', imgUrl: 'images/icon_7.png', navigateTrigger: "rightmain:otherlist" }
    ],
    Commonly: { title: '常用文件', router: '#common', imgUrl: 'images/icon_2.png', navigateTrigger: "rightmain:commonlist" },
    Recycle: { title: '回收站', router: '#recycle', imgUrl: 'images/icon_3.png', navigateTrigger: "rightmain:recyclelist" }
};