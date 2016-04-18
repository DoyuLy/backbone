/**
 * @class 时码转换帮助类
 * @constructor
 */
var TimeCodeConvert = function () {
};

/** 25 **/

/**
 *   PAL field frequency
 **/
TimeCodeConvert.m_mpcStRate25 = 50; // PAL field frequency

/**
 *   PAL frame  frequency
 */
TimeCodeConvert.MpcStFrameRate25 = 25; // PAL frame  frequency

/**
 *   PAL scale
 */
TimeCodeConvert.MpcStScale25 = 1; // PAL scale


/** 2997 **/

/**
 *   NTSC field frequency
 */
TimeCodeConvert.m_mpcStRate2997 = 60000; // NTSC field frequency

/**
 *   NTSC frame  frequency
 */
TimeCodeConvert.MpcStFrameRate2997 = 30000; // NTSC frame  frequency

/**
 *   NTSC scale
 */
TimeCodeConvert.MpcStScale2997 = 1001; // NTSC scale


/**  30 **/

/**
 *   30-F field frequency
 */
TimeCodeConvert.m_mpcStRate30 = 60; // 30-F field frequency

/**
 *   30-F frame frequency
 */
TimeCodeConvert.MpcStFrameRate30 = 30; // 30-F frame frequency

/**
 *   30-F scale
 */
TimeCodeConvert.MpcStScale30 = 1; // 30-F scale


/**  24 **/

/**
 *   24-F field frequency
 */
TimeCodeConvert.m_mpcStRate24 = 48; // 24-F field frequency

/**
 *   24-F field frequency
 */
TimeCodeConvert.MpcStFrameRate24 = 24; // 24-F field frequency

/**
 *   24-F scale
 */
TimeCodeConvert.MpcStScale24 = 1; // 24-F scale

/**  23.98 **/

/**
 *   2398-F field frequency
 */
TimeCodeConvert.m_mpcStRate2398 = 48000; // 2398-F field frequency

/**
 *   2398-F frame frequency
 */
TimeCodeConvert.MpcStFrameRate2398 = 24000; // 2398-F frame frequency

/**
 *   2398-F scale
 */
TimeCodeConvert.MpcStScale2398 = 1001; // 2398-F scale


/**  50 **/

/**
 *   PAL field frequency
 */
TimeCodeConvert.m_mpcStRate50 = 50; // PAL field frequency

/**
 *   PAL frame  frequency
 */
TimeCodeConvert.MpcStFrameRate50 = 50; // PAL frame  frequency

/**
 *   PAL scale
 */
TimeCodeConvert.MpcStScale50 = 1; // PAL scale


/**  5994 **/

/**
 *   NTSC field frequency
 */
TimeCodeConvert.m_mpcStRate5994 = 60000; // NTSC field frequency

/**
 *   NTSC frame  frequency
 */
TimeCodeConvert.MpcStFrameRate5994 = 60000; // NTSC frame  frequency

/**
 *   NTSC scale
 */
TimeCodeConvert.MpcStScale5994 = 1001; // NTSC scale


/**  60 **/

/**
 *   60-F field frequency
 */
TimeCodeConvert.m_mpcStRate60 = 60; // 60-F field frequency

/**
 *   60-F frame frequency
 */
TimeCodeConvert.MpcStFrameRate60 = 60; // 60-F frame frequency

/**
 *   60-F scale
 */
TimeCodeConvert.MpcStScale60 = 1; // 60-F scale


/**  25 Frame **/

/**
 *   25 Frame: frames per second
 */
TimeCodeConvert.MpcFramesSecond25 = 25; // 25 Frame: frames per second

/**
 *   25 Frame: frames per minute
 */
TimeCodeConvert.MpcFramesMinute25 = 1500; // 25 Frame: frames per minute

/**
 *   25 Frame: frames per hour
 */
TimeCodeConvert.MpcFramesHour25 = 90000; // 25 Frame: frames per hour


/**  24 DROP Frame **/

/**
 *   30 DROP Frame: frames per minute
 */
TimeCodeConvert.MpcFramesMinute24Drop = 1438; // 24 DROP Frame: frames per minute

/**
 *   30 DROP Frame: frames per 10 minutes
 */
TimeCodeConvert.MpcFrames10Minutes24Drop = 14382; // 24 DROP Frame: frames per 10 minutes

/**
 *   30 DROP Frame: frames per hour
 */
TimeCodeConvert.MpcFramesHour24Drop = 86292; // 24 DROP Frame: frames per hour


/**  24 Frame **/

/**
 *   24 Frame: frames per second
 */
TimeCodeConvert.MpcFramesSecond24 = 24; // 24 Frame: frames per second

/**
 *   24 Frame: frames per minute
 */
TimeCodeConvert.MpcFramesMinute24 = 1440; // 24 Frame: frames per minute

/**
 *   24 Frame: frames per hour
 */
TimeCodeConvert.MpcFramesHour24 = 86400; // 24 Frame: frames per hour


/**  30 NO_DROP Frame  **/

/**
 *   30 NO_DROP Frame: frames per second
 */
TimeCodeConvert.MpcFramesSecondNodrop30 = 30; // 30 NO_DROP Frame: frames per second

/**
 *   30 NO_DROP Frame: frames per minute
 */
TimeCodeConvert.MpcFramesMinuteNodrop30 = 1800; // 30 NO_DROP Frame: frames per minute

/**
 *   30 NO_DROP Frame: frames per hour
 */
TimeCodeConvert.MpcFramesHourNodrop30 = 108000; // 30 NO_DROP Frame: frames per hour


/**  30 DROP Frame **/

/**
 *   30 DROP Frame: frames per minute
 */
TimeCodeConvert.MpcFramesMinute30Drop = 1798; // 30 DROP Frame: frames per minute

/**
 *   30 DROP Frame: frames per 10 minutes
 */
TimeCodeConvert.MpcFrames10Minutes30Drop = 17982; // 30 DROP Frame: frames per 10 minutes

/**
 *   30 DROP Frame: frames per hour
 */
TimeCodeConvert.MpcFramesHour30Drop = 107892; // 30 DROP Frame: frames per hour


/**  50 Frame **/

/**
 *   50 Frame: frames per second
 */
TimeCodeConvert.MpcFramesSecond50 = 50; // 25 Frame: frames per second

/**
 *   50 Frame: frames per minute
 */
TimeCodeConvert.MpcFramesMinute50 = 3000; // 25 Frame: frames per minute

/**
 *   50 Frame: frames per hour
 */
TimeCodeConvert.MpcFramesHour50 = 180000; // 25 Frame: frames per hour


/**  60 DROP Frame **/

/**
 *   60 DROP Frame: frames per minute
 */
TimeCodeConvert.MpcFramesMinute60Drop = 3596; // 60 DROP Frame: frames per minute

/**
 *   60 DROP Frame: frames per 10 minutes
 */
TimeCodeConvert.MpcFrames10Minutes60Drop = 35964; // 60 DROP Frame: frames per 10 minutes

/**
 *   60 DROP Frame: frames per hour
 */
TimeCodeConvert.MpcFramesHour60Drop = 215784; // 60 DROP Frame: frames per hour


/**  60 Frame **/

/**
 *   60 Frame: frames per second
 */
TimeCodeConvert.MpcFramesSecond60 = 60; // 60 Frame: frames per second

/**
 *   60 Frame: frames per minute
 */
TimeCodeConvert.MpcFramesMinute60 = 3600; // 60 Frame: frames per minute

/**
 *   60 Frame: frames per hour
 */
TimeCodeConvert.MpcFramesHour60 = 216000; // 60 Frame: frames per hour


/**
 *   桌面视频制式标准枚举定义
 **/
TimeCodeConvert.MpcVideoStandard = {
    MpcVideostandardUnknow: 0x00000000, //Invalid

    MpcVideostandardPal: 0x00000001, //PAL size:720*576 f/s : 25
    MpcVideostandardNtsc2997: 0x00000002, //NTSC size:720*486  f/s : 29.97
    MpcVideostandardNtsc30: 0x00000004, //NTSC size:720*486 f/s : 30
    MpcVideostandardSecam: 0x00000008, //SECAM

    MpcVideostandard1920108050I: 0x00000010, //HDTV size:1920*1080 f/s : 25  interlaced
    MpcVideostandard192010805994I: 0x00000020, //HDTV size:1920*1080 f/s : 29.97 interlaced
    MpcVideostandard1920108060I: 0x00000040, //HDTV size:1920*1080 f/s : 30 interlaced

    MpcVideostandard192010802398P: 0x00000080, //HDTV size:1920*1080 f/s : 23.98 progressive
    MpcVideostandard1920108024P: 0x00000100, //HDTV size:1920*1080 f/s : 24 progressive
    MpcVideostandard1920108025P: 0x00000200, //HDTV size:1920*1080 f/s : 25 progressive
    MpcVideostandard192010802997P: 0x00000400, //HDTV size:1920*1080 f/s : 29.97 progressive
    MpcVideostandard1920108030P: 0x00000800, //HDTV size:1920*1080 f/s : 30 progressive

    MpcVideostandard12807202398P: 0x00001000, //HDTV size:1280*720 f/s : 23.98 progressive
    MpcVideostandard128072024P: 0x00002000, //HDTV size:1280*720 f/s : 24 progressive
    MpcVideostandard128072050P: 0x00004000, //HDTV size:1280*720 f/s : 50 progressive
    MpcVideostandard12807205994P: 0x00008000, //HDTV size:1280*720 f/s : 59.94 progressive

    MpcVideostandard1440108050I: 0x00010000, //HD  size:1440*1080 f/s : 25 interlaced
    MpcVideostandard144010805994I: 0x00020000, //HD  size:1440*1080 f/s : 29.97 interlaced
    MpcVideostandard1440108060I: 0x00040000 //HD  size:1440*1080 f/s : 30 interlaced
};

/**  公共方法 **/

/**  帧转百纳秒 **/

/**
 * 帧转百纳秒
 * @param {Number} lFrame 帧
 * @param {Number} dRate 帧率
 * @param {Number} dScale 修正值
 * @returns {Number} 百纳秒
 * @constructor
 */
TimeCodeConvert._Frame2100Ns = function (lFrame, dRate, dScale) {
    var ref = {};
    ref.dFrameRate = TimeCodeConvert.MpcStFrameRate25;
    ref.dFrameScale = TimeCodeConvert.MpcStScale25;

    ref = TimeCodeConvert._Rate2ScaleFrameRateAndFrameScale(dRate, dScale, ref);

    return parseInt(Math.floor(lFrame * Math.pow(10, 7) * ref.dFrameRate / ref.dFrameScale));
};

/**
 * 帧转百纳秒
 * @param {Number} dFrame 帧
 * @param {Number} dFrameRate 帧率
 * @returns {Number} 百纳秒
 * @constructor
 */
TimeCodeConvert.Frame2100Ns = function (dFrame, dFrameRate) {
    var ref = {};
    ref.dRate = TimeCodeConvert.MpcStFrameRate25;
    ref.dScale = TimeCodeConvert.MpcStScale25;
    ref = TimeCodeConvert._FrameRate2RateAndScale(dFrameRate, ref);

    return parseInt(Math.floor(dFrame * ref.dScale * Math.pow(10, 7) / ref.dRate));
};

/**  帧转秒 **/

/**
 * 帧转秒
 * @param {Number} lFrame 帧
 * @param {Number} dRate 帧率
 * @param {Number} dScale 修正值
 * @returns {Number} 秒
 * @constructor
 */
TimeCodeConvert._Frame2Second = function (lFrame, dRate, dScale) {
    var ref = {};
    ref.dFrameRate = TimeCodeConvert.MpcStFrameRate25;
    ref.dFrameScale = TimeCodeConvert.MpcStScale25;
    ref = TimeCodeConvert._Rate2ScaleFrameRateAndFrameScale(dRate, dScale, ref);

    return (lFrame * ref.dFrameScale / ref.dFrameRate);
};

/**
 * 帧转秒
 * @param {Number} dFrame 帧
 * @param {Number} dFrameRate 帧率
 * @returns {Number} 秒
 * @constructor
 */
TimeCodeConvert.Frame2Second = function (dFrame, dFrameRate) {
    var ref = {};
    ref.dRate = TimeCodeConvert.MpcStFrameRate25;
    ref.dScale = TimeCodeConvert.MpcStScale25;
    ref = TimeCodeConvert._FrameRate2RateAndScale(dFrameRate, ref);

    return (dFrame * ref.dScale / ref.dRate);
};

/**  帧转时码 **/

/**
 * 帧转时码
 * @param dFrame 帧
 * @param dRate 帧率
 * @param dScale
 * @returns {String} 时码字符串
 * @constructor
 */
TimeCodeConvert._Frame2Tc = function (dFrame, dRate, dScale) {
    var strTc;
    if ((dRate == TimeCodeConvert.MpcStFrameRate25 && dScale == TimeCodeConvert.MpcStScale25) || (dRate * TimeCodeConvert.MpcStScale25 == dScale * TimeCodeConvert.MpcStFrameRate25)) {
        var dHour = (Math.floor(dFrame / TimeCodeConvert.MpcFramesHour25));
        var dResidue = (Math.floor(dFrame % TimeCodeConvert.MpcFramesHour25));
        var dMin = (Math.floor(dResidue / TimeCodeConvert.MpcFramesMinute25));
        dResidue = dResidue % TimeCodeConvert.MpcFramesMinute25;
        var dSec = (Math.floor(dResidue / TimeCodeConvert.MpcFramesSecond25));
        var dFra = (Math.floor(dResidue % TimeCodeConvert.MpcFramesSecond25));
        strTc = TimeCodeConvert.Time2TimeCode(dHour, dMin, dSec, dFra, false);
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate2997 && dScale == TimeCodeConvert.MpcStScale2997) || (dRate * TimeCodeConvert.MpcStScale2997 == dScale * TimeCodeConvert.MpcStFrameRate2997)) {
        var dHour = (Math.floor(dFrame / TimeCodeConvert.MpcFramesHour30Drop));
        var dResidue = (Math.floor(dFrame % TimeCodeConvert.MpcFramesHour30Drop));
        var dMin = 10 * (Math.floor((parseInt(dResidue) / parseInt(TimeCodeConvert.MpcFrames10Minutes30Drop))));
        dResidue = dResidue % TimeCodeConvert.MpcFrames10Minutes30Drop;
        if (dResidue >= TimeCodeConvert.MpcFramesMinuteNodrop30) {
            dResidue -= TimeCodeConvert.MpcFramesMinuteNodrop30;
            dMin += 1 + dResidue / TimeCodeConvert.MpcFramesMinute30Drop;
            dResidue %= TimeCodeConvert.MpcFramesMinute30Drop;
            dResidue += 2;
        }
        dMin = (Math.floor(dMin));
        var dSec = (Math.floor(dResidue / TimeCodeConvert.MpcFramesSecondNodrop30));
        var dFra = (Math.floor(dResidue % TimeCodeConvert.MpcFramesSecondNodrop30));
        strTc = TimeCodeConvert.Time2TimeCode(dHour, dMin, dSec, dFra, true);
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate30 && dScale == TimeCodeConvert.MpcStScale30) || (dRate * TimeCodeConvert.MpcStScale30 == dScale * TimeCodeConvert.MpcStFrameRate30)) {
        var dHour = (Math.floor(dFrame / TimeCodeConvert.MpcFramesHourNodrop30));
        var dResidue = (Math.floor(dFrame % TimeCodeConvert.MpcFramesHourNodrop30));
        var dMin = (Math.floor(dResidue / TimeCodeConvert.MpcFramesMinuteNodrop30));
        dResidue = dResidue % TimeCodeConvert.MpcFramesMinuteNodrop30;
        var dSec = (Math.floor(dResidue / TimeCodeConvert.MpcFramesSecondNodrop30));
        var dFra = (Math.floor(dResidue % TimeCodeConvert.MpcFramesSecondNodrop30));
        strTc = TimeCodeConvert.Time2TimeCode(dHour, dMin, dSec, dFra, false);
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate24 && dScale == TimeCodeConvert.MpcStScale24) || (dRate * TimeCodeConvert.MpcStScale24 == dScale * TimeCodeConvert.MpcStFrameRate24)) {
        var dHour = (Math.floor(dFrame / TimeCodeConvert.MpcFramesHour24));
        var dResidue = (Math.floor(dFrame % TimeCodeConvert.MpcFramesHour24));
        var dMin = (Math.floor(dResidue / TimeCodeConvert.MpcFramesMinute24));
        dResidue = dResidue % TimeCodeConvert.MpcFramesMinute24;
        var dSec = (Math.floor(dResidue / TimeCodeConvert.MpcFramesSecond24));
        var dFra = (Math.floor(dResidue % TimeCodeConvert.MpcFramesSecond24));
        strTc = TimeCodeConvert.Time2TimeCode(dHour, dMin, dSec, dFra, false);
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate2398 && dScale == TimeCodeConvert.MpcStScale2398) || (dRate * TimeCodeConvert.MpcStScale2398 == dScale * TimeCodeConvert.MpcStFrameRate2398)) {
        var dHour = (Math.floor(dFrame / TimeCodeConvert.MpcFramesHour24Drop));
        var dResidue = (Math.floor(dFrame % TimeCodeConvert.MpcFramesHour24Drop));
        var dMin = (Math.floor(10 * (dResidue / TimeCodeConvert.MpcFrames10Minutes24Drop)));
        dResidue = dResidue % TimeCodeConvert.MpcFrames10Minutes24Drop;
        if (dResidue >= TimeCodeConvert.MpcFramesMinute24) {
            dResidue -= TimeCodeConvert.MpcFramesMinute24;
            dMin += 1 + dResidue / TimeCodeConvert.MpcFramesMinute24Drop;
            dResidue %= TimeCodeConvert.MpcFramesMinute24Drop;
            dResidue += 2;
        }
        var dSec = (Math.floor(dResidue / TimeCodeConvert.MpcFramesSecond24));
        var dFra = (Math.floor(dResidue % TimeCodeConvert.MpcFramesSecond24));
        strTc = TimeCodeConvert.Time2TimeCode(dHour, dMin, dSec, dFra, true);
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate50 && dScale == TimeCodeConvert.MpcStScale50) || (dRate * TimeCodeConvert.MpcStScale50 == dScale * TimeCodeConvert.MpcStFrameRate50)) {
        var dHour = (Math.floor(dFrame / TimeCodeConvert.MpcFramesHour50));
        var dResidue = (Math.floor(dFrame % TimeCodeConvert.MpcFramesHour50));
        var dMin = (Math.floor(dResidue / TimeCodeConvert.MpcFramesMinute50));
        dResidue = dResidue % TimeCodeConvert.MpcFramesMinute50;
        var dSec = (Math.floor(dResidue / TimeCodeConvert.MpcFramesSecond50));
        var
            dFra = (Math.floor(dResidue % TimeCodeConvert.MpcFramesSecond50));
        strTc = TimeCodeConvert.Time2TimeCode(dHour, dMin, dSec, dFra, false);
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate5994 && dScale == TimeCodeConvert.MpcStScale5994) || (dRate * TimeCodeConvert.MpcStScale5994 == dScale * TimeCodeConvert.MpcStFrameRate5994)) {
        var dHour = (Math.floor(dFrame / TimeCodeConvert.MpcFramesHour60Drop));
        var dResidue = (Math.floor(dFrame % TimeCodeConvert.MpcFramesHour60Drop));
        var dMin = (Math.floor(10 * (dResidue / TimeCodeConvert.MpcFrames10Minutes60Drop)));
        dResidue = dResidue % TimeCodeConvert.MpcFrames10Minutes60Drop;
        if (dResidue >= TimeCodeConvert.MpcFramesMinute60) {
            dResidue -= TimeCodeConvert.MpcFramesMinute60;
            dMin += 1 + dResidue / TimeCodeConvert.MpcFramesMinute60Drop;
            dResidue %= TimeCodeConvert.MpcFramesMinute60Drop;
            dResidue += 4;
        }
        var dSec = (Math.floor(dResidue / TimeCodeConvert.MpcFramesSecond60));
        var dFra = (Math.floor(dResidue % TimeCodeConvert.MpcFramesSecond60));
        strTc = TimeCodeConvert.Time2TimeCode(dHour, dMin, dSec, dFra, true);
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate60 && dScale == TimeCodeConvert.MpcStScale60) || (dRate * TimeCodeConvert.MpcStScale60 == dScale * TimeCodeConvert.MpcStFrameRate60)) {
        var dHour = (Math.floor(dFrame / TimeCodeConvert.MpcFramesHour60));
        var dResidue = (Math.floor(dFrame % TimeCodeConvert.MpcFramesHour60));
        var dMin = (Math.floor(dResidue / TimeCodeConvert.MpcFramesMinute60));
        dResidue = dResidue % TimeCodeConvert.MpcFramesMinute60;
        var dSec = (Math.floor(dResidue / TimeCodeConvert.MpcFramesSecond60));
        var dFra = (Math.floor(dResidue % TimeCodeConvert.MpcFramesSecond60));
        strTc = TimeCodeConvert.Time2TimeCode(dHour, dMin, dSec, dFra, false);
    }
    return strTc;
};

/**
 * 帧转时码
 * @param dFrame 帧
 * @param dFrameRate 帧率
 * @returns {String} 时码字符串
 * @constructor
 */
TimeCodeConvert.Frame2Tc = function (dFrame, dFrameRate) {
    var ref = {};
    ref.dRate = TimeCodeConvert.MpcStFrameRate25;
    ref.dScale = TimeCodeConvert.MpcStScale25;

    ref = TimeCodeConvert._FrameRate2RateAndScale(dFrameRate, ref);

    var strTc = TimeCodeConvert._Frame2Tc(dFrame, ref.dRate, ref.dScale);
    return strTc;
};

/**  时码字符串转帧 **/

/**
 * 时码字符串转帧
 * @param sTimeCode 时码
 * @param frameRate 帧率
 * @param dRate
 * @param dScale
 * @returns {number} 帧
 * @constructor
 */
TimeCodeConvert._TimeCode2Frame = function (sTimeCode, frameRate, dRate, dScale) {
    var ftcFrames = 0;
    if ((dRate == TimeCodeConvert.MpcStFrameRate25 && dScale == TimeCodeConvert.MpcStScale25) || (dRate * TimeCodeConvert.MpcStScale25 == dScale * TimeCodeConvert.MpcStFrameRate25)) {
        ftcFrames = TimeCodeConvert.TimeCode2NdfFrame(sTimeCode, frameRate);
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate2997 && dScale == TimeCodeConvert.MpcStScale2997) || (dRate * TimeCodeConvert.MpcStScale2997 == dScale * TimeCodeConvert.MpcStFrameRate2997)) {
        var ref = TimeCodeConvert.TimeCode2Format(sTimeCode, frameRate);
        var lHour = ref.lHour;
        var lMinute = ref.lMinute;
        var lSecond = ref.lSecond;
        var lFrame = ref.lFrame;

        ftcFrames += lHour * TimeCodeConvert.MpcFramesHour30Drop;

        var lwReste = lMinute / 10;
        ftcFrames += lwReste * TimeCodeConvert.MpcFrames10Minutes30Drop;
        lwReste = lMinute % 10;
        if (lwReste > 0) {
            ftcFrames += TimeCodeConvert.MpcFramesMinuteNodrop30;
            ftcFrames += (lwReste - 1) * TimeCodeConvert.MpcFramesMinute30Drop;
            ftcFrames -= 2;
        }

        ftcFrames += lSecond * TimeCodeConvert.MpcFramesSecondNodrop30;
        ftcFrames += lFrame;
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate30 && dScale == TimeCodeConvert.MpcStScale30) || (dRate * TimeCodeConvert.MpcStScale30 == dScale * TimeCodeConvert.MpcStFrameRate30)) {
        ftcFrames = TimeCodeConvert.TimeCode2NdfFrame(sTimeCode, frameRate);
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate24 && dScale == TimeCodeConvert.MpcStScale24) || (dRate * TimeCodeConvert.MpcStScale24 == dScale * TimeCodeConvert.MpcStFrameRate24)) {
        ftcFrames = TimeCodeConvert.TimeCode2NdfFrame(sTimeCode, frameRate);
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate2398 && dScale == TimeCodeConvert.MpcStScale2398) || (dRate * TimeCodeConvert.MpcStScale2398 == dScale * TimeCodeConvert.MpcStFrameRate2398)) {
        var ref = TimeCodeConvert.TimeCode2Format(sTimeCode, frameRate);
        var lHour = ref.lHour;
        var lMinute = ref.lMinute;
        var lSecond = ref.lSecond;
        var lFrame = ref.lFrame;

        ftcFrames += lHour * TimeCodeConvert.MpcFramesHour24;

        var lwReste = lMinute / 10;
        ftcFrames += lwReste * TimeCodeConvert.MpcFrames10Minutes24Drop;
        lwReste = lMinute % 10;
        if (lwReste > 0) {
            ftcFrames += TimeCodeConvert.MpcFramesMinute60;
            ftcFrames += (lwReste - 1) * TimeCodeConvert.MpcFramesMinute24;
            ftcFrames -= 2;
        }

        ftcFrames += lSecond * TimeCodeConvert.MpcFramesSecond24;
        ftcFrames += lFrame;
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate50 && dScale == TimeCodeConvert.MpcStScale50) || (dRate * TimeCodeConvert.MpcStScale50 == dScale * TimeCodeConvert.MpcStFrameRate50)) {
        ftcFrames = TimeCodeConvert.TimeCode2NdfFrame(sTimeCode, frameRate);
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate5994 && dScale == TimeCodeConvert.MpcStScale5994) || (dRate * TimeCodeConvert.MpcStScale5994 == dScale * TimeCodeConvert.MpcStFrameRate5994)) {

        var ref = TimeCodeConvert.TimeCode2Format(sTimeCode, frameRate);
        var lHour = ref.lHour;
        var lMinute = ref.lMinute;
        var lSecond = ref.lSecond;
        var lFrame = ref.lFrame;

        ftcFrames += lHour * TimeCodeConvert.MpcFramesHour60Drop;
        var lwReste = lMinute / 10;
        ftcFrames += lwReste * TimeCodeConvert.MpcFrames10Minutes60Drop;
        lwReste = lMinute % 10;
        if (lwReste > 0) {
            ftcFrames += TimeCodeConvert.MpcFramesMinute60;
            ftcFrames += (lwReste - 1) * TimeCodeConvert.MpcFramesMinute60Drop;
            ftcFrames -= 4;
        }

        ftcFrames += lSecond * TimeCodeConvert.MpcFramesSecond60;
        ftcFrames += lFrame;
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate60 && dScale == TimeCodeConvert.MpcStScale60) || (dRate * TimeCodeConvert.MpcStScale60 == dScale * TimeCodeConvert.MpcStFrameRate60)) {
        ftcFrames = TimeCodeConvert.TimeCode2NdfFrame(sTimeCode, frameRate);
    }
    return ftcFrames;
};

/**
 * 时间字符串转帧
 * @param sTimeCode 时码
 * @param dFrameRate
 * @returns {number}帧
 * @constructor
 */
TimeCodeConvert.TimeCode2Frame = function (sTimeCode, dFrameRate) {
    /**  格式化TC中的丢帧与非丢帧 **/

    sTimeCode = TimeCodeConvert.FormatTimeCode(sTimeCode, dFrameRate, TimeCodeConvert.GetRateDropFrame(dFrameRate));
    var ref = {};
    ref.dRate = TimeCodeConvert.MpcStFrameRate25;
    ref.dScale = TimeCodeConvert.MpcStScale25;
    ref = TimeCodeConvert._FrameRate2RateAndScale(dFrameRate, ref);

    var ftcFrames = TimeCodeConvert._TimeCode2Frame(sTimeCode, dFrameRate, ref.dRate, ref.dScale);

    var newTc = TimeCodeConvert.Frame2Tc(ftcFrames, dFrameRate);

    /**  防止因为 . 和 : 导致不一样 **/
    newTc = newTc.replace(".", ":");
    sTimeCode = sTimeCode.replace(".", ":");

    if (newTc != sTimeCode) {
        ftcFrames = TimeCodeConvert.GetFrameByTimeCode(sTimeCode, ftcFrames, true, 1, dFrameRate);
    }

    return ftcFrames;
};

/**  获取帧率和修正值

 /**
 *   获取帧率和修正值
 *
 * <param name = "dFrameRate">输入帧率</param>
 * <param name = "ret.dRate">修正帧率</param>
 * <param name = "ret.dScale">修正值</param>
 */
/**
 * 获取帧率和修正值
 * @param dFrameRate 输入帧率
 * @param ret
 * @returns {Object} ret.dRate 修正帧率, ret.dScale修正值
 * @constructor
 */
TimeCodeConvert._FrameRate2RateAndScale = function (dFrameRate, ret) {
    ret = ret || {};

    if (Math.abs(dFrameRate - TimeCodeConvert.MpcStFrameRate25 / TimeCodeConvert.MpcStScale25) < 0.01) {
        ret.dRate = TimeCodeConvert.MpcStFrameRate25;
        ret.dScale = TimeCodeConvert.MpcStScale25;
    }
    else if (Math.abs(dFrameRate - TimeCodeConvert.MpcStFrameRate2997 / TimeCodeConvert.MpcStScale2997) < 0.01) {
        ret.dRate = TimeCodeConvert.MpcStFrameRate2997;
        ret.dScale = TimeCodeConvert.MpcStScale2997;
    }
    else if (Math.abs(dFrameRate - TimeCodeConvert.MpcStFrameRate30 / TimeCodeConvert.MpcStScale30) < 0.01) {
        ret.dRate = TimeCodeConvert.MpcStFrameRate30;
        ret.dScale = TimeCodeConvert.MpcStScale30;
    }
    else if (Math.abs(dFrameRate - TimeCodeConvert.MpcStFrameRate24 / TimeCodeConvert.MpcStScale24) < 0.01) {
        ret.dRate = TimeCodeConvert.MpcStFrameRate24;
        ret.dScale = TimeCodeConvert.MpcStScale24;
    }
    else if (Math.abs(dFrameRate - TimeCodeConvert.MpcStFrameRate2398 / TimeCodeConvert.MpcStScale2398) < 0.01) {
        ret.dRate = TimeCodeConvert.MpcStFrameRate2398;
        ret.dScale = TimeCodeConvert.MpcStScale2398;
    }
    else if (Math.abs(dFrameRate - TimeCodeConvert.MpcStFrameRate50 / TimeCodeConvert.MpcStScale50) < 0.01) {
        ret.dRate = TimeCodeConvert.MpcStFrameRate50;
        ret.dScale = TimeCodeConvert.MpcStScale50;
    }
    else if (Math.abs(dFrameRate - TimeCodeConvert.MpcStFrameRate5994 / TimeCodeConvert.MpcStScale5994) < 0.01) {
        ret.dRate = TimeCodeConvert.MpcStFrameRate5994;
        dScale = TimeCodeConvert.MpcStScale5994;
    }
    else if (Math.abs(dFrameRate - TimeCodeConvert.MpcStFrameRate60 / TimeCodeConvert.MpcStScale60) < 0.01) {
        ret.dRate = TimeCodeConvert.MpcStFrameRate60;
        ret.dScale = TimeCodeConvert.MpcStScale60;
    }

    return ret;
};

/**  百纳秒转帧 **/

/**
 *   百纳秒转帧
 *
 * <param name = "l100Ns">百纳秒</param>
 * <param name = "dRate">帧率</param>
 * <param name = "dScale">修正值</param>
 * <returns>帧</returns>
 */
TimeCodeConvert._L100Ns2Frame = function (l100Ns, dRate, dScale) {
    var ref = {};
    ref.dFrameRate = TimeCodeConvert.MpcStFrameRate25;
    ref.dFrameScale = TimeCodeConvert.MpcStScale25;

    ref = TimeCodeConvert._Rate2ScaleFrameRateAndFrameScale(dRate, dScale, ref);

    return parseInt(Math.floor(l100Ns / Math.pow(10, 7) * ref.dFrameRate / ref.dFrameScale + 0.5));
};

/**
 * 百纳秒转帧
 * @param l100Ns 百纳秒
 * @param dFrameRate 帧率
 * @returns {Number} 帧
 * @constructor
 */
TimeCodeConvert.L100Ns2Frame = function (l100Ns, dFrameRate) {
    var ref = {
        dRate: TimeCodeConvert.MpcStFrameRate25,
        dScale: TimeCodeConvert.MpcStScale25
    };
    ref = TimeCodeConvert._FrameRate2RateAndScale(dFrameRate, ref);

    return parseInt(Math.floor(l100Ns * ref.dRate / ref.dScale / Math.pow(10, 7) + 0.5));
};

/**  百纳秒转时码

 /**
 * 百纳秒转时码
 * @param {Number} l100Ns 百纳秒
 * @param {Boolean} dropFrame 是否是丢帧
 * @returns {String} 时码字符串
 * @constructor
 */
TimeCodeConvert._L100Ns2Tc = function (l100Ns, dropFrame) {
    var dHour = Math.floor(l100Ns / (60 * 60 * Math.pow(10, 7)));
    var llResidue = (l100Ns % (60 * 60 * Math.pow(10, 7)));
    var dMin = Math.floor(llResidue / (60 * Math.pow(10, 7)));
    llResidue = llResidue % parseInt(Math.floor(60 * Math.pow(10, 7)));
    var dSec = Math.floor(llResidue / (Math.pow(10, 7)));
    llResidue = llResidue % parseInt(Math.pow(10, 7));
    var dFraction = Math.floor(llResidue / (10 * 1000 * 10));
    return  TimeCodeConvert.Time2TimeCode(dHour, dMin, dSec, dFraction, dropFrame);
};

/**
 * 百纳秒转时码
 * @param {Number} l100Ns 百纳秒
 * @param {Number} dFrameRate 帧率
 * @returns {String} 时码字符串
 * @constructor
 */
TimeCodeConvert.L100Ns2Tc = function (l100Ns, dFrameRate) {
    return TimeCodeConvert.Frame2Tc(TimeCodeConvert.L100Ns2Frame(l100Ns, dFrameRate), dFrameRate);
};

/**  帧率修正 **/

/**
 * 帧率修正
 * @param {Number} dRate 帧率
 * @param {Number} dScale 修正值
 * @param {Number} ret 输出帧率
 * @returns {Object} 输出修正值 {dFrameRate,dFrameScale}
 * @constructor
 */
TimeCodeConvert._Rate2ScaleFrameRateAndFrameScale = function (dRate, dScale, ret) {
    ret = ret || {};
    var dFrameRate = ret.dFrameRate;
    var dFrameScale = ret.dFrameScale;


    if ((dRate == TimeCodeConvert.MpcStFrameRate25 && dScale == TimeCodeConvert.MpcStScale25) || (dRate * TimeCodeConvert.MpcStScale25 == dScale * TimeCodeConvert.MpcStFrameRate25)) {
        dFrameRate = TimeCodeConvert.MpcStFrameRate25;
        dFrameScale = TimeCodeConvert.MpcStScale25;
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate2997 && dScale == TimeCodeConvert.MpcStScale2997) || (dRate * TimeCodeConvert.MpcStScale2997 == dScale * TimeCodeConvert.MpcStFrameRate2997)) {
        dFrameRate = TimeCodeConvert.MpcStFrameRate2997;
        dFrameScale = TimeCodeConvert.MpcStScale2997;
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate30 && dScale == TimeCodeConvert.MpcStScale30) || (dRate * TimeCodeConvert.MpcStScale30 == dScale * TimeCodeConvert.MpcStFrameRate30)) {
        dFrameRate = TimeCodeConvert.MpcStFrameRate30;
        dFrameScale = TimeCodeConvert.MpcStScale30;
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate24 && dScale == TimeCodeConvert.MpcStScale24) || (dRate * TimeCodeConvert.MpcStScale24 == dScale * TimeCodeConvert.MpcStFrameRate24)) {
        dFrameRate = TimeCodeConvert.MpcStFrameRate24;
        dFrameScale = TimeCodeConvert.MpcStScale24;
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate2398 && dScale == TimeCodeConvert.MpcStScale2398) || (dRate * TimeCodeConvert.MpcStScale2398 == dScale * TimeCodeConvert.MpcStFrameRate2398)) {
        dFrameRate = TimeCodeConvert.MpcStFrameRate2398;
        dFrameScale = TimeCodeConvert.MpcStScale2398;
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate50 && dScale == TimeCodeConvert.MpcStScale50) || (dRate * TimeCodeConvert.MpcStScale50 == dScale * TimeCodeConvert.MpcStFrameRate50)) {
        dFrameRate = TimeCodeConvert.MpcStFrameRate50;
        dFrameScale = TimeCodeConvert.MpcStScale50;
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate5994 && dScale == TimeCodeConvert.MpcStScale5994) || (dRate * TimeCodeConvert.MpcStScale5994 == dScale * TimeCodeConvert.MpcStFrameRate5994)) {
        dFrameRate = TimeCodeConvert.MpcStFrameRate5994;
        dFrameScale = TimeCodeConvert.MpcStScale5994;
    }
    else if ((dRate == TimeCodeConvert.MpcStFrameRate60 && dScale == TimeCodeConvert.MpcStScale60) || (dRate * TimeCodeConvert.MpcStScale60 == dScale * TimeCodeConvert.MpcStFrameRate60)) {
        dFrameRate = TimeCodeConvert.MpcStFrameRate60;
        dFrameScale = TimeCodeConvert.MpcStScale60;
    }

    ret.dFrameRate = dFrameRate;
    ret.dFrameScale = dFrameScale;

    return ret;
};

/**  秒转帧 **/

/**
 * 秒转帧
 * @param {Number} dbSec 秒数
 * @param {Number} dRate 帧率
 * @param {Number} dScale 修正值
 * @returns {Number} 帧数
 * @constructor
 */
TimeCodeConvert._Second2Frame = function (dbSec, dRate, dScale) {
    dbSec = dbSec * Math.pow(10, 7);
    var ret = {};
    ret.dFrameRate = TimeCodeConvert.MpcStFrameRate25;
    ret.dFrameScale = TimeCodeConvert.MpcStScale25;

    ret = TimeCodeConvert._Rate2ScaleFrameRateAndFrameScale(dRate, dScale, ret);

    //return parseInt( dbSec * dRate / dScale );
    return parseInt(Math.floor(dbSec * ret.dFrameRate / ret.dFrameScale / Math.pow(10, 7)));
};

/**
 * 秒转帧
 * @param {Number} dbSec 秒数
 * @param {Number} dFrameRate 帧率
 * @returns {Number} 帧数
 * @constructor
 */
TimeCodeConvert.Second2Frame = function (dbSec, dFrameRate) {
    dbSec = dbSec * Math.pow(10, 7);

    var ref = {
        dRate: TimeCodeConvert.MpcStFrameRate25,
        dScale: TimeCodeConvert.MpcStScale25
    };

    ref = TimeCodeConvert._FrameRate2RateAndScale(dFrameRate, ref);

    //return parseInt( dbSec * dRate / dScale );
    return parseInt(Math.floor(dbSec * ref.dRate / ref.dScale / Math.pow(10, 7)));
};

/**  格式化时码字符串 **/

/**
 * 格式化时码字符串
 * @param {Number} hours 小时数
 * @param {Number} minutes 分指数
 * @param {Number} seconds 秒数
 * @param {Number} frames 帧数
 * @param {Boolean} dropFrame 是否是丢帧
 * @returns {String} 格式化后的时码字符串
 * @constructor
 */
TimeCodeConvert.Time2TimeCode = function (hours, minutes, seconds, frames, dropFrame) {
    hours = hours >= 24 ? hours - 24 : hours;
    minutes = minutes >= 60 ? minutes - 60 : minutes;
    seconds = seconds >= 60 ? seconds - 60 : seconds;

    var framesSeparator = ".";
    if (dropFrame) {
        framesSeparator = ":";
    }

    hours = (Math.floor(hours % 24.0));

    function wrap(n) {
        return ((n < 10) ? '0' + n : n);
    }

    //return string.Format("{0:D2}:{1:D2}:{2:D2}{4}{3:D2}", hours, minutes, seconds, frames, framesSeparator);
    var smtp = (wrap(hours) + ':' + wrap(minutes) + ':' + wrap(seconds) + ':' + wrap(frames));
    return smtp;
};

/**
 * 格式化时码
 * @param {String} timeCode
 * @param {Number} dFrameRate
 * @param {Boolean} dropFrame 验证是否是丢帧时码
 * @returns {String} 格式化后的时码
 * @constructor
 */
TimeCodeConvert.FormatTimeCode = function (timeCode, dFrameRate, dropFrame) {
    if (timeCode) {
        var hours = 0;
        var minutes = 0;
        var seconds = 0;
        var frames = 0;
        var ftcs = timeCode.split(':');
        hours = parseInt(ftcs[0]);
        minutes = parseInt(ftcs[1]);
        if (ftcs.length >= 4) {

            seconds = parseInt(ftcs[2]);

            if (parseInt(ftcs[3]) >= dFrameRate) {
                /**  修正最后一位 29.97最大显示29 25最大显示24 **/
                var showframeRate = Math.ceil(dFrameRate) - 1;

                ftcs[3] = parseInt(showframeRate);
            }
            else {
                /**  验证是否是丢帧时码 **/

                //验证是否是丢帧时码
                if (dropFrame) {
                    //如果是丢帧帧率 分钟 除开 00 10 20 30 40 50 外所有的 00 01帧不存在 强制设置为02帧 5994强制设置为04帧
                    var dropM = [
                        "00", "10", "20", "30", "40", "50"
                    ];
                    var drop5994F = [
                        "00", "01", "02", "03"
                    ];
                    var dropF = [
                        "00", "01"
                    ];

                    if (ftcs[2] == "00" && dropM.indexOf(ftcs[1]) < 0 && drop5994F.indexOf(ftcs[3]) >= 0) {
                        if (60.0 - dFrameRate < 0.1) {
                            ftcs[3] = "04";
                        }
                        else {
                            if (dropF.indexOf(ftcs[3]) >= 0) {
                                ftcs[3] = "02";
                            }
                        }
                    }
                }
            }
            frames = parseInt(ftcs[3]);
        }
        else {
            var ftcssf = ftcs[2].split('.');
            seconds = parseInt(ftcssf[0]);

            if (parseInt(ftcssf[1]) >= dFrameRate) {

                /**  修正最后一位 29.97最大显示29 25最大显示24 **/
                var showframeRate = Math.ceil(dFrameRate) - 1;

                ftcssf[1] = showframeRate;
            }
            else {
                /**  验证是否是丢帧时码 **/

                //验证是否是丢帧时码
                if (dropFrame) {
                    //如果是丢帧帧率 分钟 除开 00 10 20 30 40 50 外所有的 00 01帧不存在 强制设置为02帧
                    var dropM = [
                        "00", "10", "20", "30", "40", "50"
                    ];
                    var drop5994F = [
                        "00", "01", "02", "03"
                    ];
                    var dropF = [
                        "00", "01"
                    ];

                    if (drop5994F.indexOf(ftcssf[1]) >= 0 && dropM.indexOf(ftcs[1]) < 0 && ftcssf[0] == "00") {
                        if (60.0 - dFrameRate < 0.1) {
                            ftcssf[1] = "04";
                        }
                        else {
                            if (dropF.indexOf(ftcssf[1]) >= 0) {
                                ftcssf[1] = "02";
                            }
                        }
                    }
                }
            }
            frames = parseInt(ftcssf[1]);
        }

        return  TimeCodeConvert.Time2TimeCode(hours, minutes, seconds, frames, dropFrame);
    }
    return "--:--:--:--";
};

/**  时间字符串转秒 **/

/**
 * 递归解决时码丢帧的问题
 * @param {String} sTimeCode 时码
 * @param {Number} ftcFrames 帧
 * @param {Boolean} isAdded 是否加修正值 为false的时候 为减了修正值
 * @param {Number} corrValue 修正值
 * @param {Number} dFrameRate 帧率
 * @returns {number} 帧数
 * @constructor
 */
TimeCodeConvert.GetFrameByTimeCode = function (sTimeCode, ftcFrames, isAdded, corrValue, dFrameRate) {
    var ftcNewFrames = 0;
    if (isAdded) {
        ftcNewFrames = ftcFrames + corrValue;
    }
    else {
        ftcNewFrames = ftcFrames - corrValue;
        corrValue++;
    }
    var newTc = TimeCodeConvert.Frame2Tc(ftcNewFrames, dFrameRate);

    /**  防止因为 . 和 : 导致不一样 **/
    newTc = newTc.replace(".", ":");
    sTimeCode = sTimeCode.replace(".", ":");

    if (newTc != sTimeCode) {
        return  TimeCodeConvert.GetFrameByTimeCode(sTimeCode, ftcFrames, !isAdded, corrValue, dFrameRate);
    }

    return ftcNewFrames;
};

/**
 * 获取此帧率是否丢帧
 * @param {number} rate 帧率
 * @returns {boolean} 是否丢帧
 * @constructor
 */
TimeCodeConvert.GetRateDropFrame = function (rate) {
    if (rate == 23.98 || (rate < 24 && rate > 23)) {
        return true;
    }
    else if (rate == 24.0) {
        return false;
    }
    else if (rate == 25.0) {
        return false;
    }
    else if (rate == 29.97 || (rate < 30 && rate > 29)) {
        return true;
    }
    else if (rate == 30.0) {
        return false;
    }
    else if (rate == 50.0) {
        return false;
    }
    else if (rate == 59.94 || (rate < 60 && rate > 59)) {
        return true;
    }
    else if (rate == 60.0) {
        return false;
    }
    return false;
};

/**
 * 时间字符串转秒(未考虑丢帧的情况)
 * @param {String} sTimeCode
 * @param {Number} dFrameRate
 * @returns {number} 帧数
 * @constructor
 */
TimeCodeConvert.TimeCode2NdfFrame = function (sTimeCode, dFrameRate) {

    var ftcSeconds = 0;
    var ftcFrames = 0;

    var ret = TimeCodeConvert.TimeCode2Format(sTimeCode, dFrameRate);

    ftcSeconds += ret.lHour * 60 * 60;
    ftcSeconds += ret.lMinute * 60;
    ftcSeconds += ret.lSecond;
    ftcFrames += ret.lFrame;
    ftcFrames += TimeCodeConvert.Second2Frame(ftcSeconds, dFrameRate);

    return ftcFrames;
};


/**
 *   时间字符串格式化
 *
 * @param {String} sTimeCode 时码
 * @param {number} dFrameRate 帧率
 * @return {number} 格式化的时间对象{lHour,lMinute,lSecond,lFrame}
 */
TimeCodeConvert.TimeCode2Format = function (sTimeCode, dFrameRate) {
    var ret = {};
    var ftcCodes = sTimeCode.split(':');

    if (ftcCodes.length >= 4) {
        ret.lHour = parseInt(ftcCodes[0]);
        ret.lMinute = parseInt(ftcCodes[1]);
        ret.lSecond = parseInt(ftcCodes[2]);
        ret.lFrame = parseInt(ftcCodes[3]);
    }
    else {
        var ftcssf = ftcCodes[2].split('.');
        ret.lHour = parseInt(ftcCodes[0]);
        ret.lMinute = parseInt(ftcCodes[1]);
        ret.lSecond = parseInt(ftcssf[0]);
        ret.lFrame = parseInt(ftcssf[1]);
    }

    ret.lHour = ret.lHour >= 24 ? ret.lHour - 24 : ret.lHour;
    ret.lMinute = ret.lMinute >= 60 ? ret.lMinute - 60 : ret.lMinute;
    ret.lSecond = ret.lSecond >= 60 ? ret.lSecond - 60 : ret.lSecond;
    ret.lFrame = ret.lFrame >= Math.ceil(dFrameRate) ? ret.lFrame - Math.ceil(dFrameRate) : ret.lFrame;

    return ret;
};

