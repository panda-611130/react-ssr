import { secret } from '../config';
import { addParam } from '../components/Url';
const baseUrl = '';


const fetchClient = (url) => {
    url = addParam(baseUrl + url, 'secret', secret);
    return fetch(url, {
        //fetch可以通过credentials自己控制发送请求时是否带上cookie。
        // credentials可设置为include、same-origin、omit。
        // include为了让浏览器发送包含凭据的请求（即使是跨域源）。
        // 如果你只想在请求URL与调用脚本位于同一起源处时发送凭据，请添加credentials: 'same-origin'。
        // 要改为确保浏览器不在请求中包含凭据，请使用credentials: 'omit'。
        credentials: 'include',
    });
}
export default fetchClient;