/**
 * Created by LeeHong on 16/10/27.
 */
$(document).ready(function(){
    var val = getQueryString("tsid");
    // alert("tsid = " + val);
    alert("url = " + location.href);
    var tsid = getQueryString("tsid");
    alert("tsid = " + tsid);

    $("#gotoChapter").click(function () {
        $.post("http://tbwalden.demowx.uae.uc.cn/andapi/book/info",
            {"data": {"bookId": 172679, "timestamp": Date.parse(new Date())/1000 }},
            function (data, status) {
                alert("返回的数据是：" + data.status + ", 返回的状态是：" + status);
            })
    });
});