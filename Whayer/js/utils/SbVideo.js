/**
 * @class
 * @classdesc Main SbVideo Implementation.
 * @param {Object} options - Configuration object for initialization.
 */
var SbVideo = function (options) {
    if (this === window) {
        return new SbVideo(options);
    }
    this.obj = options || {};
    this.viewObj = this.obj.viewObj;//播放视图
    this.width = this.obj.width || 320;
    this.height = this.obj.height || 240;
    this.controlsenable = this.obj.controlsenable || false;
    this.intervalId;//定时器的标识
    this.video = {};
    this.video.currentframe = 0;
    this.video.isPlaying = false;
    this.timeline = this.obj.timeline;
    this.onplayended = this.obj.onplayended;//播放完成事件
    this.onloadCompleted = this.obj.onloadCompleted;//加载完事件
    this.loadCompleted = false;
    this.onresize = this.obj.onresize;
    this.frameRate = this.obj.frameRate || 25;

    this.isstory = this.obj.isstory || false;//是否Story播放
    this.playList = this.obj.playList || [];
    this.playIndex = 0;//story播放索引
    this.storyplayed = this.obj.storyplayed;//story播放设置
    this.src = this.obj.src;
    this.combineKeyFrame = this.obj.combineKeyFrame || null;
    this.onseekchange = this.obj.onseekchange || null;//时码change事件
};


SbVideo.prototype = {
    fps: this.frameRate,
    /**
     * init
     */
    init: function (src, combineKeyFrame) {
        if (!this.loadCompleted || this.src != src) {
            this.loadCompleted = false;
            this.src = src || this.src;
            this.combineKeyFrame = combineKeyFrame;
            this.container = this.obj.container;//document.getElementById(this.obj.id);
            this.width = this.container.offsetWidth;
            this.height = this.container.offsetHeight;
            //this.height = this.container.offsetHeight - 30;
            this.container.innerHTML =
                //'<div class="btn-group">' +
                //'<button class="btn disabled trackframes btn-danger triggertooltip"' +
                //'id="currentsmpte" data-original-title="current smpte time code." data-placement="top"' +
                //'rel="tooltip">00:00:00:00</button>' +
                //'<button class="btn disabled trackframes btn-danger triggertooltip"' +
                //'id="totalsmpte" data-original-title="current smpte time code." data-placement="top"' +
                //'rel="tooltip">00:00:00:00</button>' +
                //'</div>' +
                //'<video controls preload="auto"  id="video" width="' + this.width + '" height="' + this.height + '">Your browser does not support the video tag.</video>';
                '<video controls preload="auto"  id="video" width="100%" height="100%">Your browser does not support the video tag.</video>';
            this.video = document.getElementById('video') || document.getElementsByTagName('video');
            this.video.controls = this.controlsenable;
            this.video.src = this.src;
            this.video.oncontextmenu = function () {
                event.returnValue = false;
            };
            this.src ? this.initPlay() : null;
        }
        else{
            this.video.onloadeddata();
        }
    },
    
    initPlay: function () {
        var self = this;
        var num = 0;
        var timeFunName = null;
        console.log("initPlay");
        if (this.timeline) {
            //播放器对象回传
            this.timeline.sbvideoPlayer = this;
        }

        //story Play
        if (this.playList && this.playList.length > 0 && this.isstory) {
            if (this.playList.length >= (this.playIndex + 1) && this.storyplayed) {
                self.storyplayed.apply(self.viewObj, [self.playIndex, self.playList[self.playIndex]]);
                return;
            }
        } else {
            //story状态重置
            this.isstory = false;
            this.playIndex = 0;
        }
        
        //单双击事件兼容
        this.video.onclick = function () {
            // 取消上次延时未执行的方法
            clearTimeout(timeFunName);
            // 延时300毫秒执行单击
            timeFunName = setTimeout(function () {
                num++;
                if (self.video.isPlaying) {
                    self.pause();
                }
                else {
                    self.play();
                }
            }, 300);
        };
        this.video.ondblclick = function () {
            // 取消上次延时未执行的方法
            clearTimeout(timeFunName);
            num++;
            self.launchFullScreen(self.video);
        };
        //流媒体加载完毕重绘时间线
        this.video.onloadeddata = function () {
            self.loadCompleted = true;
            console.log("onloadeddata");
            if (TimeCode) {
                var tc = new TimeCode({ seconds: self.video.duration, frameRate: self.frameRate });
                if (self.timeline) {
                    //重新初始化时间线
                    self.timeline.init(tc.frames, self.combineKeyFrame);
                }
                if (self.onloadCompleted) {
                    self.onloadCompleted.call(self.viewObj, tc.toString(), tc.getFrames());
                }
                //if (self.onseekchange)
                //    self.onseekchange.apply(self.viewObj, [tc.toString()]);
            }
        };
        //播放进度事件关联时间线seek
        this.video.ontimeupdate = function () {
            console.log("ontimeupdate");
            if (TimeCode) {
                var tc = new TimeCode({ seconds: self.video.currentTime, frameRate: self.frameRate });
                self.video.currentframe = tc.frames;
                if (self.timeline) {
                    self.timeline.seekTo(self.video.currentframe);
                }

                //播放完毕事件回调
                if (self.video.ended) {
                    self.pause();
                    if (self.onplayended) 
                        self.onplayended.call(self.viewObj);
                }


                if (self.onseekchange)
                    self.onseekchange.apply(self.viewObj, [tc.toString(), tc.getFrames()]);
            }
        };

        /*
        this.video.ended = function () {
            self.pause();
            self.onplayended && self.onplayended();
        };
        */
        //播放器resize事件
        /*
        this.video.onresize = function () {
            if (this.video.onresize && self.onresize)
                self.onresize.apply(self.viewObj);
        }*/
    },
    /**
     *story播放时间线回调(仅供内部调用)
     */
    _storyPlayEnded: function () {
        if (this.playList && this.playList.length > 0 && this.isstory) {
            ++this.playIndex;
            this.initPlay();
        }
    },

    /**
     * 设置播放列表
     * @param {Object} 播放信息地址
     */
    setstoryList: function (playList) {
        this.playList = playList;
        if (this.playList && this.playList.length > 0 && this.isstory) {
            this.initPlay();
        }
    },
    /**
     * 设置播放地址
     * @param {String} src 播放地址
     */
    setSrc: function (src,combineKeyFrame) {
        this.init(src, combineKeyFrame);
    }
};

/**
 * 静音设置
 * @param {Boolean} boolean 是否静音
 */
SbVideo.prototype.setMuted = function (boolean) {
    this.video.muted = boolean;
}

/**
 * 音量设置
 * @param {int} volume 音量
 */
SbVideo.prototype.setVolume = function (volume) {
    if (volume >= 0)
        this.video.volume = volume;
}
/**
 * 预览图
 * @param {String} src 预览图
 */
SbVideo.prototype.setPoster = function (src) {
    src ? this.video.poster : null;
};


//获取本地流媒体地址
SbVideo.prototype.createObjectURL = function (object) {
    return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
};

//播放本地文件
SbVideo.prototype.playLocalFile = function (file) {
    var files = file.files;
    if (files && files.length) {
        this.video.currentframe = 0;
        this.video.src = (window.URL) ? window.URL.createObjectURL(files[0]) : window.webkitURL.createObjectURL(files[0]);
        this.initPlay();
    }
};

//播放路径设置
SbVideo.prototype.setResources = function (options) {
    if (typeof (options) == "object") {
        this.video.src = options.src;
        this.initPlay();
    }
};

//获取当前播放帧
SbVideo.prototype.getcurrentframe = function () {
    return this.video.currentframe;
};


//区间播放
SbVideo.prototype._start = function () {
    if (this.intervalId) {
        this.pause();
    }
    var self = this;
    var timerInterval = function () {
        //var tc = new TimeCode({seconds: video.currentTime, frameRate: frameRate});
        //video.currentframe = tc.frames;
        self.video.ontimeupdate();
    }
    this.intervalId = window.setInterval(timerInterval, Math.floor(1000 / (2 * this.frameRate)));//?
    this.video.isPlaying = true;
    this.video.play();
};

//开始播放
SbVideo.prototype.play = function () {
    this._start();
};

//暂停
SbVideo.prototype.pause = function () {
    window.clearInterval(this.intervalId);
    this.video.pause();
    this.video.isPlaying = false;
};

//seek到指定帧
SbVideo.prototype.seek = function (frame) {
    if (TimeCode) {
        var self = this;
        var tc = new TimeCode({ frames: frame, frameRate: this.frameRate });
        var time = tc.seconds;
        console.log('seek to frame:' + frame + ' Second:' + time);
        this.video.currentTime = time;//当前播放位置(可读写)
        this.video.currentframe = frame;
        console.log('video.currentTime:' + this.video.currentTime);
        if (this.timeline) {
            this.timeline.seekTo(frame);
        }
        //$("#currentsmpte").html(tc.toString());

        if (self.onseekchange)
            self.onseekchange.apply(self.viewObj, [tc.toString(), tc.getFrames()]);
    }
};
// 进入全屏：launchFullScreen(document.getElementById("videoElement"));  
SbVideo.prototype.launchFullScreen = function (element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
};
//退出全屏 : exitFullscreen(); 
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozExitFullScreen) {
        document.mozExitFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}
