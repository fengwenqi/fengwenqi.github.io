/**
 * Created by LeeHong on 16/10/27.
 */
/**
 * 获取URL请求参数
 *
 * @param name Query key.
 * @returns {*}
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
