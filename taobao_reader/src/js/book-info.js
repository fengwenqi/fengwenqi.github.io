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

    var createAjax = function(url, data) {
        return $.ajax({
            type: "POST",
            url: url,
            async: true,
            cache: false,
            data: data
        });
    };

    // 设置书籍的请求参数。
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
    // 设置推荐书籍的请求参数。
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

    // 异步请求书籍和推荐书籍信息。
    $.when( createAjax("http://tbwalden.ishuqi.com/andapi/book/info", bookParam),
            createAjax("http://tbwalden.ishuqi.com/andapi/booklist/recom", recomParam)
            )
        .done(function (bookResult, recomResult) {
            if(bookResult[0].status == 200 && recomResult[0].status == 200){
                // 设置作者其他作品的请求参数。
                var proListData = {"authorId": bookResult[0].data.authorId, "timestamp": timestamp.toString(), "pageSize": 3, "page": 1};
                var proListParam = {
                    "data": JSON.stringify(proListData),
                    "encryptType": "-1",
                    "tsid": tsid,
                    "placeId": placeId,
                    "appVer": appVer,
                    "sign": md5(JSON.stringify(proListData)+md5key)
                };

                // 异步请求作者其他作品。
                createAjax("http://tbwalden.ishuqi.com/andapi/author/prolist", proListParam)
                    .done(function (proListResult) {
                        // 渲染书籍信息画面。
                        var book = new Book(bookResult[0].data, recomResult[0].data, proListResult.data);
                        book.initView();
                        $(".container").show();
                        tbreader.closeLoading("");
                });
            }
        });
});

/**
 * The Book class is used to render view with the book data.
 *
 * @param bookInfo
 * @constructor
 */
function Book(book, recomBookList, proList) {
    var self = this;
    self.book = book;
    self.recom = recomBookList;
    self.proList = proList;
}

Book.prototype = {
    initView: function () {
        var self = this;
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
        $(".desc").text(limitText(this.book.desc, 100));
        $(".desc").click(function () {
            if($(".desc").text().indexOf("...") > -1){
                $(".desc").text(self.book.desc + "∧");
            }else {
                $(".desc").text(limitText(self.book.desc, 100));
            }
        });
        $("#author-introduce").text(this.book.authorName);

        // tag
        var aLi = [];
        for(var i = 0, count = this.book.tag.length; i < count; ++i) {
            aLi.push("<li><a href='###'>" + this.book.tag[i].tagName +"</a></li>");
        }
        $(".tags").append("<nav><ul>" + aLi.join("") + "</ul></nav>");

        // 推荐书籍
        oFragment = document.createDocumentFragment();
        aLi.length = 0;
        for(var i = 0, count = this.recom.bookList.length; i < count; ++i) {
            aLi.push("<li><a href='###'><img src='" + this.recom.bookList[i].coverUrl +"'/>"
                + "<h2 class='book-name'>" + this.recom.bookList[i].bookName + "</h2>"
                + "<h3 class='author-name'>" + this.recom.bookList[i].authorName + "</h3></a></li>");
        }
        $(".recom .title").after("<nav><ul>" + aLi.join("") + "</ul></nav>");

        // 作者的作品
        aLi.length = 0;
        for(var i = 0, count = this.proList.bookList.length; i < count; ++i) {
            aLi.push("<li><a href='###'>" + this.proList.bookList[i].bookName +"</a></li>");
        }
        $(".author-other-books .title").after("<nav><ul>" + aLi.join("") + "</ul></nav>");

        // 出版信息
        var publishTime = new Date();
        publishTime.setTime(this.book.pubInfo.pubTime * 1000);
        var publish = "<section><p> 出版：" + this.book.pubInfo.press + "<br/>"
                        + "字数：" + this.book.words + "万字<br/>"
                        + "ISBN：" + this.book.pubInfo.isbn +"<br/>"
                        + "出版时间：" + publishTime.toLocaleDateString() + "</p><section>";
        $(".publish-info aside").before(publish);
    },
    createNav: function (oFragment) {
        var oNAV = document.createElement("nav");
        var oUL = document.createElement("ul");
        oUL.appendChild(oFragment);
        oNAV.appendChild(oUL);
        return oNAV;
    }
}

var limitText = function (text, maxLen) {
    var retTxt = "";
    if(typeof text == "string") {
        var txtLen = text.length;
        var ellipsisDown = "... ∨";
        if(txtLen <= maxLen) {
            retTxt = text;
        }else {
            retTxt = text.substr(0, maxLen);
        }
        retTxt += ellipsisDown;
    }
    return retTxt;
};

