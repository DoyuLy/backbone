/**
 * @class
 * @classdesc Main TimeLine Implementation.
 * @param {Object} options - Configuration object for initialization.
 */
var TimeLine = function (options) {
    if (this === window) {
        return new TimeLine(options);
    }
    this.obj = options || {};
    this.mediaInfo = this.obj.mediaInfo || null;
    this.viewObj = this.obj.viewObj;
    this.frameRate = this.obj.frameRate || 24;//帧率
    this.duration = this.obj.duration || 100;//总时长,单位帧
    this.showduration = this.obj.duration || 100;//显示总时长,单位帧 配合缩放使用
    this.zoom = this.obj.zoom || 1;//放大倍数
    this.timelineoffset = this.obj.timelineoffset || 0;//时间线偏移量 单位帧,初始为0,配合放大倍数使用
    this.canvaswidth = 0; //宽
    this.linewidth = 0;   //线长
    this.inpointResize;
    this.outpointResize;
    this.lineInfo;
    this.currentframe = 0;
    this.oncurrentframechange = this.obj.oncurrentframechange;//当前时间线改变事件
    this.oninoutpointchange = this.obj.oninoutpointchange;//打点更改事件
    this.playRangeInpoint = 0;//区间锁定入点
    this.playRangeOutpoint = 0;//区间锁定出点
    this.lockRange = false;//是否区间锁定
    this.sbvideoPlayer;
    this.combineKeyFrame = this.obj.combineKeyFrame || null;
};

TimeLine.prototype = {
    fps: this.frameRate,
    /**
     * init
     */
    init: function (duration, combineKeyFrame) {
        var self = this;
        this.combineKeyFrame = combineKeyFrame;
        this.duration = duration || this.duration;
        this.showduration = this.duration;

        this.container = this.obj.container;//document.getElementById(this.obj.id);
        //绘制时间线
        this.drawcanvas();
        //改变窗口大小重绘时间线
        window.onresize = function () {
            self.drawcanvas();
        };
    },
    /**
     * 设置时长
     *
     * @return {Number} - Frame number in timeline
     */
    setDuration: function (duration) {
        this.init(duration);
    },
    drawcanvas: function () {
        console.log("123456");
        this.offset = 2;//左右间距
        this.canvaswidth = this.container.offsetWidth; 
        //canvas高度： 110px  宽度： 父级宽度(1920px)
        this.container.innerHTML = '<canvas id="timeline" width="' + this.canvaswidth + '" height="90">您的浏览器不支持html5！</canvas>' +
            //当前进度线
            '<div id="currentProgressSpan"></div>' +
            '<div id="currentInPointSpan" style="display:none;"><div class="left_btn"></div><div class="left_line"></div></div>' +
            '<div id="currentOutPointSpan" style="left: ' + (this.canvaswidth - 10 - 10) + 'px;display:none;"><div class="left_line"></div><div class="right_btn"></div></div>' +
            '<div id="timeLine_bg" style="width:' + (this.canvaswidth - 10 - 4) + 'px;"></div>' +
            '<div class="range none"><div class="left_btn"></div><div class="right_btn"></div></div>';
        //绑定进度线移动事件
        this.__bindMove(document.getElementById('currentProgressSpan'));

        //打点：入点对象
        this.inpointResize = new InOutPointResize({
                el: document.getElementById('currentInPointSpan'),
                isright: false,
                canvaswidth: this.canvaswidth,
                offset: this.offset,
                timeline: this
            }
        );

        //打点：出点对象
        this.outpointResize = InOutPointResize({
                el: document.getElementById('currentOutPointSpan'),
                isright: true,
                canvaswidth: this.canvaswidth,
                offset: this.offset,
                timeline: this
            }
        );

        //2D绘制时间线刻度
        this.canvas = document.getElementById('timeline') || document.getElementsByTagName('canvas')[0];
        this.cont = this.canvas.getContext("2d");
        this.__drawLine();

        //初始化默认合成帧
        document.getElementById('timeLine_bg').style.background = 'url(' + this.combineKeyFrame + ') repeat-x scroll left center';
    },
    /**
     * Returns the current frame number
     *
     * @return {Number} - current Frame number
     */
    //获取当前帧数
    getCurrentframe: function () {
        return this.currentframe;
    },
    /**
     * Returns the current frame number TimeCode
     *
     * @return {String} - current Frame number TimeCode
     */
    //获取当前时码
    getTimeCode: function () {
        var tc = new TimeCode({
            duration: this.currentframe,
            frameRate: this.frameRate
        });
        return tc;
    },
    /**
     * Event listener for handling callback execution at double the current frame rate interval
     *
     * @param  {String} format - Accepted formats are: SMPTE, time, frame
     * @param  {Number} tick - Number to set the interval by.
     * @return {Number} Returns a value at a set interval
     */
    listen: function (format, tick) {
        var _timeline = this;
        if (!format) {
            console.log('TimeLine: Error - The listen method requires the format parameter.');
            return;
        }
        this.interval = setInterval(function () {
            if (_timeline.video.paused || _timeline.video.ended) {
                return;
            }
            var frame = ((format === 'SMPTE') ? _timeline.toSMPTE() : ((format === 'time') ? _timeline.toTime() : _timeline.get()));
            if (_timeline.obj.callback) {
                _timeline.obj.callback(frame, format);
            }
            return frame;
        }, (tick ? tick : 1000 / _timeline.frameRate / 2));
    },
    /** Clears the current interval */
    stopListen: function () {
        var _timeline = this;
        clearInterval(_timeline.interval);
    }
};

//设置合成帧
TimeLine.prototype.setKeyframe = function (src) {
    document.getElementById('timeLine_bg').style.background = 'url(' + src + ') repeat-x scroll left center';
};

//设置缩放比例
TimeLine.prototype.zoomScale = function (zoom) {
    zoom = zoom > 1 ? zoom : 1;
    var linewidth = this.canvas.width - 2 * this.offset-10;//- 60;
    var maxzoom = this.duration * 10 / linewidth;
    zoom = zoom >= maxzoom ? maxzoom : zoom;
    this.zoom = zoom;
    console.log('zoomScale maxzoom:' + maxzoom + ' this.zoom:' + this.zoom);
    this.showduration = this.duration / this.zoom;
    console.log('zoomScale this.showduration:' + this.showduration);
    this.__drawLine();

    return this.zoom;
};

TimeLine.prototype.setOffset = function (offset) {

    this.lineInfo = this.lineInfo || {};
    offset = parseInt(offset);
    offset = offset > 0 ? offset : 0;
    var maxoffset = this.duration - this.showduration;
    offset = offset >= maxoffset ? maxoffset : offset;

    this.timelineoffset = offset;
    console.log("setOffset timelineoffset:" + this.timelineoffset);
    //this.showduration = this.duration - this.offset;
    this.__drawLine();
};

/**
 * Set Cut inpoint outpoint
 * @param {Number} inpoint  - Unit frame.
 * @param {Number} outpoint - Unit frame.
 * @param {Boolean} lockRange - 是否锁定区间.
 */
TimeLine.prototype.setInOutPoint = function (inpoint, outpoint, lockRange) {
    inpoint = inpoint || 0;
    outpoint = outpoint || this.showduration;

    this.inpointResize.setPointWidth(inpoint);
    this.outpointResize.setPointWidth(outpoint);

    $('#currentInPointSpan').show();
    $('#currentOutPointSpan').show();

    this.playRangeInpoint = inpoint;
    this.playRangeOutpoint = outpoint;
    this.lockRange = lockRange;
    if (this.sbvideoPlayer) {
        this.sbvideoPlayer.seek(inpoint);
    }
};

//清除打点
TimeLine.prototype.cleaInOutPoint = function () {
    $("#currentInPointSpan").hide();
    $('#currentOutPointSpan').hide();
};

//获取打点区间(出入点)
TimeLine.prototype.getInOutPoint = function () {
    var points = {
        inpoint: this.inpointResize.getPoint(),//帧
        outpoint: this.outpointResize.getPoint()
    };
    return points;
};

/**
 * seekTo
 * @param {Number} frame - frame.
 */
//时间线seek
TimeLine.prototype.seekTo = function (frame) {
    this.lineInfo = this.lineInfo || {};
    //超长处理
    frame = frame >= this.duration ? this.duration : frame;

    var offset = this.timelineoffset;
    //超过显示区域处理
    if (frame > this.showduration + this.timelineoffset) {
        offset = frame - 5;
    }
    else if (frame < this.timelineoffset) {
        offset = frame - 5;
    }

    if (this.lockRange) {

        if (frame < this.playRangeInpoint) {

            frame = this.playRangeInpoint;
            this.sbvideoPlayer.pause();
            this.sbvideoPlayer.seek(frame);

            if (this.sbvideoPlayer.onplayended)
                this.sbvideoPlayer.onplayended.call(this.sbvideoPlayer.viewObj);

            if (this.sbvideoPlayer.isstory) {
                this.sbvideoPlayer._storyPlayEnded();
            }
        }
        if (frame > this.playRangeOutpoint) {

            frame = this.playRangeOutpoint;
            this.sbvideoPlayer.pause();
            this.sbvideoPlayer.seek(frame);
            if (this.sbvideoPlayer.onplayended)
                this.sbvideoPlayer.onplayended.call(this.sbvideoPlayer.viewObj);

            if (this.sbvideoPlayer.isstory) {
                this.sbvideoPlayer._storyPlayEnded();
            }
        }
    }

    if (offset != this.timelineoffset) {
        console.log('seekTo timelineoffset:' + this.timelineoffset);
        console.log('seekTo offset:' + offset);
        this.setOffset(offset);
    }
    this.currentframe = frame;
    var el = document.getElementById('currentProgressSpan');
    var left = (frame - this.timelineoffset) / ( this.showduration / this.lineInfo.linewidth);
    left = left > this.lineInfo.linewidth ? this.lineInfo.linewidth : left;
    if (left != 0) {
        left = left + this.offset + Math.ceil(this.lineInfo.parmargin / 2);
    }
    el.style.left = left + 'px';
};

//画时间线
TimeLine.prototype.__drawLine = function () {
    var width = this.canvas.width;
    var height = this.canvas.height;
    var offset = this.offset;
    var linewidth = width - 2 * offset-10;// - 60;
    var linemarginleft = width - offset-10;// - 60;
    var lineheight = 40;//height - 2 * offset;
    var linemarginbottom = height - offset;

    //计算最佳刻度数字 保证每个个度间距>8像素(parmargin>8)
    var parmargin = this.showduration / linewidth;
    parmargin = parmargin >= 8 ? parmargin : 10;
    var totalScale = linewidth / parmargin;

    var lineInfo = {
        linewidth: linewidth,
        linemarginleft: linemarginleft,
        parmargin: parmargin,
        totalScale: totalScale,
        framewidth: linewidth / this.showduration
    };

    this.inpointResize.setTimelineInfo(lineInfo);
    this.outpointResize.setTimelineInfo(lineInfo);
    this.lineInfo = lineInfo;

    var cont = this.cont;
    cont.clearRect(0, 0, width, height);
    cont.beginPath(); //定义一个路径的开始
    cont.moveTo(offset, linemarginbottom); //路径的起始点
    cont.lineTo(linemarginleft, linemarginbottom); //起始点和该点确定一条直线
    cont.lineWidth = 0.3; //线条宽度
    cont.strokeStyle = "#FFF";//线条颜色
    cont.lineCap = "square"; //线条两端点类型，butt：默认，round：圆角，square：直角
    cont.font = '12px 微软雅黑';
    cont.fillStyle = "#FFF";

    cont.stroke();

    for (var i = 0; i <= totalScale; i++) {
        cont.moveTo(i * parmargin + offset, linemarginbottom); //路径的起始点
        if (i % 10 == 0) {
            cont.lineTo(i * parmargin + offset, height - (lineheight * 3 / 4 + offset)); //起始点和该点确定一条直线

            var showframes = i * this.showduration / totalScale + this.timelineoffset;
            //console.log('showframes:' + showframes);
            var tc = new TimeCode({
                frames: showframes,
                frameRate: this.frameRate
            });
            var showtext = tc.toSMPTE();

            cont.fillText(showtext, i * parmargin + offset, height - (lineheight * 3 / 4 + offset))
        } else if (i % 5 == 0) {
            cont.lineTo(i * parmargin + offset,  height-(lineheight * 2 / 4 + offset)); //起始点和该点确定一条直线
        } else {
            cont.lineTo(i * parmargin + offset, height-(lineheight * 1 / 4 + offset)); //起始点和该点确定一条直线
        }
    }
    cont.stroke(); //为线条赋予颜色，如果未设定默认为黑色

    if (this.lockRange) {
        this.setInOutPoint(this.playRangeInpoint, this.playRangeOutpoint, this.lockRange);
    }
};


TimeLine.prototype.__bindMove = function (el) {
    //初始化参数
    var els = el.style,
    //鼠标的 X 和 Y 轴坐标
        x = y = 0;
    var self = this;
    //邪恶的食指
    $(el).mousedown(function (e) {
        //按下元素后，计算当前鼠标与对象计算后的坐标
        x = e.clientX - el.offsetWidth;
        y = e.clientY - el.offsetHeight;
        //在支持 setCapture 做些东东
        el.setCapture ? (
            //捕捉焦点
            el.setCapture(),
                //设置事件
                el.onmousemove = function (ev) {
                    mouseMove(ev || event)
                },
                el.onmouseup = mouseUp
            ) : (
            //绑定事件
            $(document).bind("mousemove", mouseMove).bind("mouseup", mouseUp)
            );
        //防止默认事件发生
        e.preventDefault()
    });
    //移动事件
    function mouseMove(e) {
        //宇宙超级无敌运算中...
        els.left = e.clientX + 'px';
        //els.height = e.clientY - y + 'px';
        var currentframe = (e.clientX - self.offset) / self.lineInfo.framewidth + self.timelineoffset;

        if (self.lockRange) {
            if (currentframe <= self.playRangeInpoint) {

                currentframe = self.playRangeInpoint;
                self.sbvideoPlayer.pause();
                self.sbvideoPlayer.seek(currentframe);
            }
            if (currentframe >= self.playRangeOutpoint) {

                currentframe = self.playRangeOutpoint;
                self.sbvideoPlayer.pause();
                self.sbvideoPlayer.seek(currentframe);
            }
        }
        self.currentframe = currentframe;
        if (self.oncurrentframechange) {
            self.oncurrentframechange.apply(self.viewObj, [self.currentframe]);
        }
    }

    //停止事件
    function mouseUp() {
        //在支持 releaseCapture 做些东东
        el.releaseCapture ? (
            //释放焦点
            el.releaseCapture(),
                //移除事件
                el.onmousemove = el.onmouseup = null
            ) : (
            //卸载事件
            $(document).unbind("mousemove", mouseMove).unbind("mouseup", mouseUp)
            );
    }
};

var InOutPointResize = function (options) {
    //初始化参数
    if (this === window) {
        return new InOutPointResize(options);
    }
    this.options = options || {};
    this.el = this.options.el || document.getElementsByTagName('canvas');
    this.isright = this.options.isright || false;
    this.canvaswidth = this.options.canvaswidth || 0;
    this.offset = this.options.offset || 0;
    this.timeline = this.options.timeline;

    //鼠标的 X 和 Y 轴坐标
    this.x = this.y = 0;
    this.width = 0;
    this.point = 0;
    this.lineInfo = {};
    this.init();
};

InOutPointResize.prototype = {
    init: function () {
        var self = this;
        var el = self.el;
        var els = el.style;

        $(el).mousedown(function (e) {
            //按下元素后，计算当前鼠标与对象计算后的坐标
            self.x = e.clientX - el.offsetWidth;
            self.y = e.clientY - el.offsetHeight;
            //在支持 setCapture 做些东东
            el.setCapture ? (
                //捕捉焦点
                el.setCapture(),
                    //设置事件
                    el.onmousemove = function (ev) {
                        mouseMove(ev || event)
                    },
                    el.onmouseup = mouseUp
                ) : (
                //绑定事件
                $(document).bind("mousemove", mouseMove).bind("mouseup", mouseUp)
                );
            //防止默认事件发生
            e.preventDefault()
        });

        //移动事件
        function mouseMove(e) {
            if (!self.timeline.lockRange) {
                var inoutpoint = self.timeline.getInOutPoint();
                var templeft = 10;
                if (self.isright) {
                    var inpointwidth = (inoutpoint.inpoint + 1) * self.lineInfo.framewidth + self.offset;
                    if (e.clientX < self.canvaswidth - templeft && inpointwidth < e.clientX) {
                        //宇宙超级无敌运算中...
                        var left = e.clientX;
                        left = self.canvaswidth - templeft - left >= 5 ? left : self.canvaswidth - templeft - 5;
                        left = left >= self.offset + 25 ? left : self.offset + 25;
                        els.left = left + 'px';
                        self.width = self.canvaswidth - templeft - left;
                        els.width = self.width + 'px';
                    }
                }
                else {
                    var outpointwidth = (inoutpoint.outpoint - 1) * self.lineInfo.framewidth + self.offset;
                    if (e.clientX <= self.canvaswidth - templeft - 10 && outpointwidth > e.clientX) {
                        self.width = e.clientX - self.offset;
                        self.width = self.width >= 5 ? self.width : 5;
                        els.width = self.width + 'px';
                    }
                }

                if (self.isright) {
                    self.point = Math.floor((el.offsetLeft - self.offset) / self.lineInfo.framewidth);
                } else {
                    self.point = Math.floor(el.offsetWidth / self.lineInfo.framewidth);
                }
                //els.height = e.clientY - y + 'px'

                //self.currentframe = currentframe;
                if (self.timeline.oninoutpointchange) {
                    self.timeline.oninoutpointchange.apply(self.timeline.viewObj, [inoutpoint]);
                }
            }
        };

        //停止事件
        function mouseUp() {
            //在支持 releaseCapture 做些东东
            el.releaseCapture ? (
                //释放焦点
                el.releaseCapture(),
                    //移除事件
                    el.onmousemove = el.onmouseup = null
                ) : (
                //卸载事件
                $(document).unbind("mousemove", mouseMove).unbind("mouseup", mouseUp)
                );
        }
    },
    setTimelineInfo: function (lineInfo) {
        var self = this;
        var el = self.el;
        this.lineInfo = lineInfo;
        if (self.isright) {
            self.point = Math.floor((el.offsetLeft - self.offset) / self.lineInfo.framewidth);
        } else {
            self.point = Math.floor(el.offsetWidth / self.lineInfo.framewidth);
        }
    },
    setPointWidth: function (point) {
        var self = this;
        var el = self.el;
        var els = el.style;

        self.lineInfo = self.timeline.lineInfo;
        var inoutpoint = self.timeline.getInOutPoint();

        var pointWidth = Math.floor(point * self.lineInfo.framewidth) + self.offset;

        var templeft = 10;
        if (self.isright) {
            pointWidth = Math.floor((point + 1) * self.lineInfo.framewidth) + self.offset;
            var inpointwidth = (inoutpoint.inpoint + 1) * self.lineInfo.framewidth + self.offset;
            if (pointWidth < self.canvaswidth - templeft && inpointwidth < pointWidth) {
                //宇宙超级无敌运算中...
                var left = pointWidth;
                left = self.canvaswidth - templeft - left >= 5 ? left : self.canvaswidth - templeft - 5;
                left = left >= self.offset + 25 ? left : self.offset + 25;
                els.left = left + 'px';
                self.width = self.canvaswidth - templeft - left;
                els.width = self.width + 'px';
            }
        }
        else {
            var outpointwidth = (inoutpoint.outpoint - 1) * self.lineInfo.framewidth + self.offset;
            outpointwidth = outpointwidth > 0 ? outpointwidth : self.lineInfo.linewidth;
            if (pointWidth <= self.canvaswidth - templeft - 10 && outpointwidth > pointWidth) {
                self.width = pointWidth - self.offset;
                self.width = self.width >= 5 ? self.width : 5;
                els.width = self.width + 'px';
            }
        }

        if (self.isright) {
            self.point = Math.floor((el.offsetLeft - self.offset) / self.lineInfo.framewidth);
        } else {
            self.point = Math.floor(el.offsetWidth / self.lineInfo.framewidth);
        }
    },
    //获取当前打点位置
    getPoint: function () {
        return this.point;
    }
};