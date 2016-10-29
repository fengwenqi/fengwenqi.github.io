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
    var md5key = '37e81a9d8f02596e1b895d07c171d5c9';

    // 初期隐藏画面。
    $(".container").hide();

    // 异步请求书籍信息。
    // $.post("http://tbwalden.ishuqi.com/andapi/book/info",
    //     {
    //         "data": JSON.stringify(data),
    //         "encryptType": -1,
    //         "tsid": tsid,
    //         "placeId": placeId,
    //         "appVer": appVer,
    //         "sign": sign
    //     },
    //     function (result, status) {
    //         alert("返回的状态是：" + result.status + ", 返回的书名是：" + result.data.bookName);
    //         if(status == "success" && result.status == 200){
    //             // 根据请求的书本信息，渲染画面。
    //             var book = new Book(result.data);
    //             book.initView();
    //             tbreader.closeLoading("");
    //             $(".container").show();
    //         }
    //     });

    var createAjax = function(url, data) {
        return $.ajax({
            type: "POST",
            url: url,
            async: true,
            cache: false,
            data: data
        });
    };

    // 设置请求数据。
    var data = {"bookId": bookId, "timestamp": timestamp.toString()};
    var sign = md5(JSON.stringify(data)+md5key);
    var bookParam = {
        "data": JSON.stringify(data),
        "encryptType": -1,
        "tsid": tsid,
        "placeId": placeId,
        "appVer": appVer,
        "sign": sign
    };
    var recomData = {"bookId": parseInt(bookId), "pageSize": 3, "timestamp": timestamp};
    var recomSign = md5(JSON.stringify(recomData)+md5key);
    var recomParam = {
        "data": JSON.stringify(recomData),
        "encryptType": -1,
        "tsid": tsid,
        "placeId": placeId,
        "appVer": appVer,
        "sign": recomSign
    };
    $.when(createAjax("http://tbwalden.ishuqi.com/andapi/book/info", bookParam),createAjax("http://tbwalden.ishuqi.com/andapi/booklist/recom", recomParam))
        .done(function (result1, result2) {
            alert("返回的结果1是：" + result1[0].status + ", 返回的结果2是：" + result1[0].status);
            // alert("返回的状态是：" + result1.status + ", 返回的书名是：" + result1.data.bookName);
            // alert("返回的状态是：" + result2.status + ", 返回的书名是：" + result2.data);
            if(result1[0].status == 200){
                // 根据请求的书本信息，渲染画面。
                var book = new Book(result1[0].data);
                book.initView();
                tbreader.closeLoading("");
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

        var oFragment = document.createDocumentFragment();
        for(var i = 0, count = this.book.tag.length; i < count; ++i) {
            var oLi = document.createElement("li");
            oLi.innerHTML = "<a href='###'>" + this.book.tag[i].tagName +"</a>";
            oFragment.appendChild(oLi);
        }
        $(".tags").append(this.createNav(oFragment));
    },
    createNav: function (oFragment) {
        var oNAV = document.createElement("nav");
        var oUL = document.createElement("ul");
        oUL.appendChild(oFragment);
        oNAV.appendChild(oUL);
        return oNAV;
    }
}