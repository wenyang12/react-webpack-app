import Util from '../core/Util';

const DoLog = {
    // 项目工程 ID, 项目名称即可
    projectId: 'ithelpdesk',

    /**
     * [ 手机设备信息 ]
     *  platform -> 平台类型，enum{'android', 'ios', 'pc'}
     *  version  -> 平台版本信息
     */
    device: '',

    // 开放平台下发的 应用ID
    appid: '',

    // 应用的发布版本
    appversion: /fsh5\/[\w|\-]*\/([\d|\.]*)\/?/g.test(location.href) ? RegExp.$1 : 'unknown',

    // 终端平台 'pc' || 'android' || 'ios'
    _fplatform: '',

    // 终端系统版本号
    _fversion: '',

    // host 日志上报域
    host: /\w+\.(\w+)\.\w+/g.test(location.host) ? RegExp.$1 : 'fxiaoke',

    openUserId: '',


    /**
     * [log 封装jsapi埋点统计，和本地写的currentLog ]
     * @param  {[type]} key  [统计类型]
     * @param  {[type]} data [统计参数]
     * @return {[Object]}    [...]
     */
    log: function(key, data){
        let _self = this;
        if(FSOpen){
            if(window.itGlobalData.fsOpenReady){
                _self.jsapiLog(key, data);
            }else{
                window.itGlobalData.fsOpenCallback['jsapi'] = function(){
                    _self.jsapiLog(key, data);
                }
            }
        }else{
            window.itGlobalData.bindCallback(window.itGlobalData.getIdReady, function(){
                _self.currentLog(key, data);
            });
        }
    },
    /**
     * jsapi 埋点统计
     * @param  {[type]} key  [统计类型]
     * @param  {[type]} data [统计参数]
     */
    jsapiLog: function(key, data){
        let detailData = data || {};
        let tempData = {};
        for(let sKey in data){
            if(sKey === "orderId"){
                tempData["M2"] = detailData[sKey];
            }else if(sKey === "status"){
                tempData["M3"] = detailData[sKey];
            }else{
                tempData[sKey] = detailData[sKey];
            }

        }
        this.device = this.device || this.getDeviceInfo();

        if (!this.appid) {
            this.appid = (window.itGlobalData && window.itGlobalData.appId) || '';
        }

        if (!this.openUserId) {
            this.openUserId = (window.itGlobalData && window.itGlobalData.openUserId) || '';
        }

        detailData = Util.extend({
            projectId: this.projectId,
            appid: this.appid,
            M1: key,
            ouserid: this.openUserId
        }, tempData);
        FSOpen.util.traceEvent({
            detail: detailData
        });
    },
    /**
     * [log 真正做打点统计的API; DoLog.currentLog('OrderDetailShow', {orderId: 'FS_123', status: 'Solved'}) ]
     * @param  {[type]} key  [统计类型]
     * @param  {[type]} data [统计参数]
     * @return {[Object]}    [...]
     */
    currentLog: function(key, data){
        let detailData = data || {};

        this.device = this.device || this.getDeviceInfo();

        if (!this.appid) {
            this.appid = (window.itGlobalData && window.itGlobalData.appId) || '';
        }

        if (!this.openUserId) {
            this.openUserId = (window.itGlobalData && window.itGlobalData.openUserId) || '';
        }

        detailData = Util.extend({
            projectId: this.projectId,
            appid: this.appid,
            appversion: this.appversion,
            _fplatform: this.device.platform,
            _fversion: this.device.version,

            actionid: key,
            ouserid: this.openUserId,
            _t: + new Date()
        }, detailData);
        let img = new Image();
        img.src = '//sp.' + this.host + '.com/m.gif?' + Util.toKeyValue(detailData);
        img = null;
    },
    getDeviceInfo: function() {
        let device = {
                platform: '',
                version: ''
            },

            ua = window.navigator.userAgent,

            _android = [],
            _ios = [];

        if ((_android = ua.match(/(Android);?[\s\/]+([\d.]+)?/))) {
            device.platform = 'android';
            device.version = _android[2];
        } else if ((_ios = ua.match(/(iPhone|iPod|iPad).*OS\s([\d_]+)/))) {
            device.platform = 'ios';
            device.version = _ios[2].replace(/_/g, '.');
            return device;
        } else {
            device.platform = 'pc';
        }

        return device;
    }
};

export default DoLog;