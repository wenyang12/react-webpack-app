/**
 * API config for PC/Client
 */
import MobileDetect from 'mobile-detect';

let apiBaseUrl;
const clientPrefix = '';
const rootUrl = '/open/workOrder';
const baseUrl = '/h5';

const MobileClientObj = new MobileDetect(window.navigator.userAgent);
const isMobileClient = MobileClientObj.mobile() ? true : false;

apiBaseUrl = isMobileClient ? [clientPrefix, rootUrl, baseUrl].join('') : [rootUrl, baseUrl].join('');

export { apiBaseUrl, isMobileClient };


