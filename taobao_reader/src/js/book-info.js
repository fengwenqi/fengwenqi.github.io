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
                // 根据请求的书本信息，渲染画面。
                var book = new Book(result.data);
                book.initView();
                $(".container").show();
            }
        });

    // var createAjax = function(url, data) {
    //     return $.ajax({
    //         type: "POST",
    //         url: url,
    //         async: true,
    //         cache: false,
    //         data: data
    //     });
    // };
    //
    // var bookParam = {
    //     "data": JSON.stringify(data),
    //     "encryptType": -1,
    //     "tsid": tsid,
    //     "placeId": placeId,
    //     "appVer": appVer,
    //     "sign": sign
    // };
    // $.when(createAjax("http://tbwalden.ishuqi.com/andapi/book/info", bookParam))
    //     .done(function (result) {
    //         alert("返回的状态是：" + result.status + ", 返回的书名是：" + result.data.bookName);
    //         if(result.status == 200){
    //             alert("data=" + result.data.authorName);
    //             // 根据请求的书本信息，渲染画面。
    //             var book = new Book(result.data);
    //             book.initView();
    //             $(".container").show();
    //         }
    //     });
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
        alert("data2=" + this.book.authorName);
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
        }else if(this.book.disType == "11") {
            $(".sale-deadline").show();
        }
        $(".desc").text(this.book.desc);
        $("#author-introduce").text(this.book.authorName);

        // var oFragment = document.createDocumentFragment();
        // for(var i = 0, count = this.book.tag.length; i < count; ++i) {
        //     var oLi = document.createElement("li");
        //     oLi.innerHTML = "<a href='###'>" + this.book.tag[i].tagName +"</a>";
        //     oFragment.appendChild(oLi);
        // }
        // this.createNav(oFragment);
        // $(".tags").append(oNAV);
    },
    // createNav: function (oFragment) {
    //     var oNAV = document.createElement("nav");
    //     var oUL = document.createElement("ul");
    //     oUL.appendChild(oFragment);
    //     oNAV.appendChild(oUL);
    // }
}