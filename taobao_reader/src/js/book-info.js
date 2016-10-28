/**
 * Created by LeeHong on 16/10/27.
 */
$(document).ready(function(){
    // 获取公共参数。
    var bookId = getQueryString("bid");
    var timestamp = Date.parse(new Date())/1000;
    var tsid = getQueryString("tsid");
    var placeId = getQueryString("placeId");
    var appVer = getQueryString("appVer");

    // 设置请求数据。
    var data = {"bookId": bookId, "timestamp": timestamp.toString()};
    var md5key = '37e81a9d8f02596e1b895d07c171d5c9';
    var sign = md5(JSON.stringify(data)+md5key);

    // 初期隐藏画面。
    $(".container").hide();

    // 异步请求书籍信息。
    $.post("http://tbwalden.ishuqi.com/andapi/book/info",
        {
            "data": JSON.stringify(data),
            "encryptType": -1,
            "tsid": tsid,
            "placeId": placeId,
            "appVer": appVer,
            "sign": sign
        },
        function (result, status) {
            alert("返回的状态是：" + result.status + ", 返回的书名是：" + result.data.bookName);
            if(status == "success" && result.status == 200){
                var book = new Book(result.data);
                book.initView();
                $(".container").show();
            }
        });
});
/**
 * The Book class is used to render view with the book data.
 *
 * @param bookInfo
 * @constructor
 */
function Book(book) {
    var self = this;
    self.book = book;
}

Book.prototype = {
    initView: function () {
        $(".top #cover img").attr("src", this.book.coverUrl);
        $("#book-name").text(this.book.bookName);
        $("#author-name").text(this.book.authorName);
        $("#book-words").text(this.book.words);
        $("#price").text(this.book.price);
        $("#final-price").text(this.book.finalPrice);
        var unit = "淘豆";
        if(this.book.payMode == "1") {
            unit = "淘豆/千字";
        }
        $(".unit").text(unit);
        if(this.book.disType == "0") {
            $(".sale-deadline").hide();
            alert("无打折信息" );
        }else if(this.book.disType == "11") {
            alert("打折信息：" + JSON.stringify(this.book.disInfo));
        }
        $(".desc").text(this.book.desc);
        $("#author-introduce").text(this.book.authorName);

        alert("tag长度：" + this.book.tag);
        var oNAV = document.createElement("nav");
        var oUL = document.createElement("ul");
        var oFragment = document.createDocumentFragment();
        for(var i = 0, count = this.book.tag.length; i < count; ++i) {
            var oLi = document.createElement("li");
            oLi.innerHTML = "<a href='###'>" + this.book.tag[i].tagName +"</a>";
            oFragment.appendChild(oLi);
        }
        oUL.appendChild(oFragment);
        oNAV.appendChild(oUL);
        $(".tags").append(oNAV);
    }
}