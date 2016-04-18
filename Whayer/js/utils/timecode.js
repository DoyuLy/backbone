/**
 * FrameRates - Industry standard frame rates
 *
 * @namespace
 * @type {Object}
 * @property {Number} film - 24
 * @property {Number} NTSC - 29.97
 * @property {Number} NTSC_Film - 23.98
 * @property {Number} NTSC_HD - 59.94
 * @property {Number} PAL - 25
 * @property {Number} PAL_HD - 50
 * @property {Number} web - 30
 * @property {Number} high - 60
 */
var FrameRates = {
    film: 24,
    NTSC: 29.97,
    NTSC_Film: 23.98,
    NTSC_HD: 59.94,
    PAL: 25,
    PAL_HD: 50,
    web: 30,
    high: 60
};

/**
 * @class
 * @classdesc Main TimeCode Implementation.
 * @param {Object} options - Configuration object for initialization.
 */
var TimeCode = function (options) {
    if (this === window) {
        return new TimeCode(options);
    }
    this.obj = options || {};
    this.frameRate = this.obj.frameRate || 24;
    this.frames = this.obj.frames || 0;
    this.bns = this.obj.bns || 0;
    this.seconds = this.obj.seconds || 0;
    this.smpte = this.obj.smpte || '00:00:00.00';
    this.getFrames();
};


TimeCode.prototype = {
    /**
     * Returns the current frame number
     *
     * @return {Number} - Frame number
     */
    frameRates : {
        film: 24,
        NTSC: 29.97,
        NTSC_Film: 23.98,
        NTSC_HD: 59.94,
        PAL: 25,
        PAL_HD: 50,
        web: 30,
        high: 60
    },
    getFrames: function () {
        if (!this.frames) {
            if (!this.seconds) {
                if (this.bns) {
                    this.frames = TimeCodeConvert.L100Ns2Frame(this.bns, this.frameRate);
                    this.seconds = this.bns / Math.pow(10, 7);
                } else {
                    this.frames = TimeCodeConvert.TimeCode2Frame(this.smpte, this.frameRate);
                    this.seconds = TimeCodeConvert.Frame2Second(this.frames, this.frameRate);
                    this.bns = TimeCodeConvert.Frame2100Ns(this.frames, this.frameRate);
                }
            }
            this.frames = TimeCodeConvert.Second2Frame(this.seconds, this.frameRate);
        } else {
            this.seconds = TimeCodeConvert.Frame2Second(this.frames, this.frameRate);
            this.bns = TimeCodeConvert.Frame2100Ns(this.frames, this.frameRate);
        }
        return Math.floor(this.frames);
    },
    /**
     * 获取秒
     * @returns {Number} 秒
     */
    getSeconds: function () {
        return TimeCodeConvert.Frame2Second(this.getFrames(), this.frameRate);
    },
    /**
     * 获取100NS
     * @returns {Number} 100NS
     */
    getBns: function () {
        return TimeCodeConvert.Frame2100Ns(this.getFrames(), this.frameRate);
    },
    /**
     * 获取时码
     * @returns {String} 获取时码
     */
    getTc: function () {
        return TimeCodeConvert.Frame2Tc(this.getFrames(), this.frameRate);
    },
    /**
     * 获取时码
     * @returns {String} 时码
     */
    toString: function () {
        return TimeCodeConvert.Frame2Tc(this.getFrames(), this.frameRate);
    },
    /**
     * Event listener for handling callback execution at var  the current frame rate interval
     *
     * @param  {String} format - Accepted formats are: SMPTE, time, frame
     * @param  {Number} tick - Number to set the interval by.
     * @return {Number} Returns a value at a set interval
     */
    listen: function (format, tick) {
        var _video = this;
        if (!format) {
            console.log('TimeCode: Error - The listen method requires the format parameter.');
            return;
        }
        this.interval = setInterval(function () {
            if (_video.video.paused || _video.video.ended) {
                return;
            }
            var frame = ((format === 'SMPTE') ? _video.toSMPTE() : ((format === 'time') ? _video.toTime() : _video.get()));
            if (_video.obj.callback) {
                _video.obj.callback(frame, format);
            }
            return frame;
        }, (tick ? tick : 1000 / _video.frameRate / 2));
    },
    /** Clears the current interval */
    stopListen: function () {
        var _video = this;
        clearInterval(_video.interval);
    },
    fps: this.FrameRates
};

/**
 * Returns the current time code in the video in HH:MM:SS format
 * - used internally for conversion to SMPTE format.
 *
 * @param  {Number} frames - The current time in the video
 * @return {String} Returns the time code in the video
 */
TimeCode.prototype.toTime = function (frames) {
    var time = (typeof frames !== 'number' ? this.getFrames() : frames), frameRate = this.frameRate;
    var dt = (new Date()), format = 'hh:mm:ss' + (typeof frames === 'number' ? ':ff' : '');
    dt.setHours(0);
    dt.setMinutes(0);
    dt.setSeconds(0);
    dt.setMilliseconds(time * 1000);
    function wrap(n) {
        return ((n < 10) ? '0' + n : n);
    }

    return format.replace(/hh|mm|ss|ff/g, function (format) {
        switch (format) {
            case "hh":
                return wrap(dt.getHours() < 13 ? dt.getHours() : (dt.getHours() - 12));
            case "mm":
                return wrap(dt.getMinutes());
            case "ss":
                return wrap(dt.getSeconds());
            case "ff":
                return wrap(Math.floor(((time % 1) * frameRate)));
        }
    });
};

/**
 * Returns the current SMPTE Time code in the video.
 * - Can be used as a conversion utility.
 *
 * @param  {Number} frame - OPTIONAL: Frame number for conversion to it's equivalent SMPTE Time code.
 * @return {String} Returns a SMPTE Time code in HH:MM:SS:FF format
 */
TimeCode.prototype.toSMPTE = function (frame) {
    if (!frame) {
        frame = this.getFrames();
    }
    var frameNumber = Number(frame);

    var tc = TimeCodeConvert.Frame2Tc(frameNumber, this.frameRate);
    return tc;
};

/**
 * Converts a SMPTE Time code to Seconds
 *
 * @param  {String} SMPTE - a SMPTE time code in HH:MM:SS:FF format
 * @return {Number} Returns the Second count of a SMPTE Time code
 */
TimeCode.prototype.toSeconds = function (SMPTE) {
    var frames;
    if (!SMPTE) {
        frames = this.getFrames();
    }
    else {
        frames = this.toFrames(SMPTE);
    }
    return TimeCodeConvert.Frame2Second(frames, this.frameRate);
};

/**
 * Converts a SMPTE Time code, or standard time code to Milliseconds
 *
 * @param  {String} SMPTE OPTIONAL: a SMPTE time code in HH:MM:SS:FF format,
 * or standard time code in HH:MM:SS format.
 * @return {Number} Returns the Millisecond count of a SMPTE Time code
 */
TimeCode.prototype.toMilliseconds = function (SMPTE) {
    var frames = (!SMPTE) ? Number(this.toSMPTE().split(':')[3]) : Number(SMPTE.split(':')[3]);
    var milliseconds = (1000 / this.frameRate) * (isNaN(frames) ? 0 : frames);
    return Math.floor(((this.toSeconds(SMPTE) * 1000) + milliseconds));
};

/**
 * Converts a SMPTE Time code to it's equivalent frame number
 *
 * @param  {String} SMPTE - OPTIONAL: a SMPTE time code in HH:MM:SS:FF format
 * @return {Number} Returns the var running video frame number
 */
TimeCode.prototype.toFrames = function (SMPTE) {
    return TimeCodeConvert.TimeCode2Frame(SMPTE);
};

