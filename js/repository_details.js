$(function () {
    var id = getUrlParam("id");
    var token = getUrlParam("token");
    var app = getUrlParam("app");
    var title = getUrlParam("title");
    if (title){
        $("head title").text(title);
        if (!isAndroid) {
            updateTitle(title);
        }
    }
    var postData = {
        appToken: token,
        para: {
            device_type:"PC",
            device_id: "",
            api_version: "1.0.0.0",
            kid: id,
            uid:""
        }
    };
    ajaxPost("/api/Knowledge/QueryKnowledgeByUidOrByIdOrForAll", postData, function (data) {
        console.log(data);
        if (data.Code === "0000"){
            var mydata = data.Data;
            if (mydata){
                var description = mydata.Des.replace(/\n/g, "<br>");
                var userHeadImage = "http://www.11deyi.com/img/30.png";
                if (mydata.HeadImgUrl){
                    userHeadImage = mydata.HeadImgUrl;
                }
                var html = "<div class='repository'>" +
                    "<div class='top'>" +
                    "<p style='background-image: url("+userHeadImage+")'></p>" +
                    "<p>"+mydata.Uname+"</p></div>";
                var text = "<div class='text'>" +
                    "<p class='title'>"+mydata.Title+"</p>" +
                    "<p>"+description+"</p>" +
                    "<p class='fullText'>全文</p></div>";
                switch (mydata.Type) {
                    case "V":
                        var ele = "<div class='video'>" +
                            "<video poster='"+mydata.FaceImgUrl+"' src='"+mydata.SourceUrl+"' webkit-playsinline controls>您的浏览器不支持video标签</video>" +
                            "</div>";
                        $("html,body").css("height","auto");
                        break;
                    case "A":
                        var ele = "<div class='audio_box'>" +
                            "<audio src='"+mydata.SourceUrl+"'></audio>" +
                            "<div class='audio' timelong='"+mydata.TimeLong+"'>" +
                            "<img src='img/play03@2x.png' alt=''>" +
                            "<span></span>" +
                            "</div>" +
                            "<p>" +
                            "<span class='minute'></span><span class='second'>"+mydata.TimeLong+"’’</span></p></div>";
                        break;
                    case "P":
                        var image = "";
                        var imgwh = "1080x1920";
                        html += text;
                        if (mydata.SourceUrl){
                            if (mydata.SourceUrl.indexOf(",") === -1){
                                image = "<div class='onlyImage'><figure itemscope itemtype='1'><a id='minimg00' href='"+mydata.SourceUrl+"' itemprop='contentUrl' data-size='"+imgwh+"'><img src='"+mydata.SourceUrl+"' itemprop='thumbnail' alt='Image description' /></a><figcaption itemprop='caption description'>1</figcaption></figure></div>";
                                var url = mydata.SourceUrl;
                                var k2="00";
                                getImageWidth(url, k2, function (w, h, x) {
                                    setTimeout(function () {
                                        var imgwh2=w+"x"+h;
                                        $("#minimg"+x).attr("data-size",imgwh2);
                                    },200)
                                });
                            }else {
                                var pics = mydata.SourceUrl.split(",");
                                image = "<div class='moreImage'>";
                                for (var i = 0; i < pics.length; i++){
                                    image += "<figure itemscope itemtype='1'><a id='minimg0"+i+"' href='"+pics[i]+"' itemprop='contentUrl' data-size='"+imgwh+"'><img src='"+pics[i]+"' itemprop='thumbnail' alt='Image description'/></a><figcaption itemprop='caption description'>"+(i+1)+"</figcaption></figure>";
                                    var url = pics[i];
                                    var k2=0+""+i;
                                    getImageWidth(url, k2, function (w, h, x) {
                                        setTimeout(function () {
                                            var imgwh2=w+"x"+h;
                                            $("#minimg"+x).attr("data-size",imgwh2);
                                        },200)
                                    })
                                }
                                image += "</div>";
                            }
                            var ele = '<div class="Pics my-simple-gallery" itemscope itemtype="http://schema.org/ImageGallery">'+image+'</div>';
                        }else {
                            var ele = "";
                        }
                        break;
                }
                html += ele;
                if (mydata.Type != "P"){
                    html += text;
                }
                html += "</div>";
                $("section").append(html);
                if (mydata.Type == "P"){
                    initPhotoSwipeFromDOM('.my-simple-gallery');
                }
                var Height = $("section .repository .text p:nth-of-type(2)").height();
                if (Height <= 120){
                    $("section .repository .text .fullText").addClass("hide");
                }else {
                    $("section .repository .text p:nth-of-type(2)").css("display","-webkit-box")
                }
            }else {
                $(".delete").removeClass("hide");
                if (app){
                    $(".delete img:nth-of-type(2)").addClass("hide");
                    $(".delete p:nth-of-type(2),.delete p:nth-of-type(3)").addClass("hide");
                    $(".delete").css("margin-top","37%");
                    $(".delete>img:nth-of-type(3)").css("margin-top","25%");
                    if (!isAndroid){
                        $(".delete>img:nth-of-type(3)").css("margin-top","28%");
                    }
                }
            }
            $(".loading_box").addClass("hide");
        }
    })
});

$("section").on("click",".repository .audio_box .audio", function () {
    var self = this;
    var audio_text;
    var audioSrc = $(this).parent().find("audio").attr("src");
    $(this).toggleClass("audio_play");
    $(this).parent().find("audio").on("playing",function(){
        $(this).parent().find(".audio img").attr("src","img/play.gif");
        $(this).parent().find(".audio span").text("");
    });
    $(this).parent().find("audio").on("ended",function(){
        $(this).parent().find(".audio img").attr("src","img/play03@2x.png");
        $(this).parent().find(".audio").removeClass("audio_play");
        clearInterval(time);
        var timelong = $(this).parent().find(".audio").attr("timelong");
        $(this).parent().find("p .second").text(timelong+"’’");
        $(this).parent().find(".audio span").text(audio_text);
    });
    if ($(this).hasClass("audio_play")){
        $(this).parent().find("audio").attr("src","");
        $(this).parent().find("audio").attr("src",audioSrc);
        $(this).addClass("audio_play");
        audio_text = $(this).find("span").text();
        $(this).parent().find("audio").get(0).play();
        $(this).find("img").attr("src","img/play02.gif");
        $(this).find("span").text("加载中");
        var time = setInterval(function(){
            if (!$(self).hasClass("audio_play")){
                clearInterval(time);
                $(self).find("span").text(audio_text);
            }
        },100)
    }else {
        $(this).parent().find("audio").get(0).pause();
        $(this).find("img").attr("src","img/play03@2x.png");
    }
});
$("section").on("click",".repository .text .fullText", function () {
    var text = $(this).text();
    if (text === "全文"){
        $(this).text("收起");
        $(this).parent().find("p:nth-of-type(2)").css("display","block");
    }else {
        $(this).text("全文");
        $(this).parent().find("p:nth-of-type(2)").css("display","-webkit-box");
    }
});

function ajaxPost(url,postData,callback){
    $.ajax({
        url: ebase+url,
        type: "POST",
        data: postData,
        dataType: "json",
        success: function (data) {
            callback(data);
        },
        error: function (xhr ,errorType ,error) {
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}