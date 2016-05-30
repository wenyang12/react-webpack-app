import http from './HttpClient';
import util from '../core/Util';
import { apiBaseUrl, isMobileClient } from './ApiConfig';

const urlMap = {
    'createNewOrder': apiBaseUrl + '/workOrder/formApply'
};

const ApiService = {
    /**
     * [createNewOrder 创建新的工单]
     * @param  {[object]}   requestConfig [请求参数]
     * @param  {Function} callback      [请求完成，回调函数]
     * @return {[...]}                 [回调函数返回值]
     */
    createNewOrder(requestConfig, callback) {
        const url = urlMap.createNewOrder;

        return http.post(url, requestConfig.params).then(response => {
            return callback(response);
        });
    }
};

export default ApiService;
