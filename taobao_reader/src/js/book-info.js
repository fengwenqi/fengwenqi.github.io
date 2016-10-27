/**
 * Created by LeeHong on 16/10/27.
 */
$(document).ready(function(){
    var bookId = getQueryString("bid");
    var timestamp = Date.parse(new Date())/1000;
    var tsid = getQueryString("tsid");
    var placeId = getQueryString("placeId");
    var appVer = getQueryString("appVer");


    var data = {"bookId": bookId, "timestamp": timestamp.toString()};
    var md5key = '37e81a9d8f02596e1b895d07c171d5c9';
    var sign = md5(JSON.stringify(data)+md5key);
    alert("raw = " + (JSON.stringify(data)+md5key) + ", sign = " + sign);

    $("#gotoChapter").click(function () {
        $.post("http://tbwalden.ishuqi.com/andapi/book/info",
            {
                "data": data,
                "encryptType": -1,
                "tsid": tsid,
                "placeId": placeId,
                "appVer": appVer,
                "sign": sign
            },
            function (data, status) {
                alert("返回的数据是：" + data.status + ", 返回的状态是：" + status);
            })
    });
});