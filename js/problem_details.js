$(function(){
    var questionid = getLocalStorageQuestionId();
    getProblem(questionid);
});

function getProblem(id){
    if (getLocalStroagelogin().token){
        token = getLocalStroagelogin().token;
    }
    var postData = {
        "appToken":token,
        "para":{
            "device_type":"PC",
            "device_id":" ",
            "api_version":"1.0.0.0",
            "id": id
        }
    };
    $.ajax({
        "url": ebase+"/api/Question/QueryById",
        "data":postData,
        "type":"POST",
        "dataType":"json",
        success: function (data) {
            console.log(data);
            var Data = data.Data;
            if (!$(".section_load").hasClass("hide")){
                $(".section_load").addClass("hide");
                wxBrowser();
            }
            if (Data.AuthorId && Data.IsAnonymous === "N"){
                $("section .problem").attr("userid",Data.AuthorId);
            }
            var ViewCount = 0;
            var sex = "男";
            if (Data.Sex == "M"){
                sex = "男"
            }else {
                sex = "女"
            }
            var text = sex+"，"+Data.Age+"，"+Data.DepartmentName+"。"+Data.Question;
            $("section .problem .text").text(text);
            if (Data.Videos){
                $("header .title").text(Data.Videos.length+"条回答")
            }else {
                $("header .title").text("0条回答")
            }
            if (Data.FaceImgUrl){
                $("section .problem .head_portrait").css("background-image","url('"+Data.FaceImgUrl+"')")
            }
            if (Data.Pics.length > 0){
                var ele = "";
                var imgwh = "1080x1920";
                for (var x = 0; x < Data.Pics.length; x++){
                     //ele += "<img src='"+Data.Pics[x]+"' />";
                    ele +="<figure itemscope itemtype='1'><a id='minimg"+x+"' href='"+Data.Pics[x]+"' itemprop='contentUrl' data-size='"+imgwh+"'><img src='"+Data.Pics[x]+"' itemprop='thumbnail' alt='Image description'/></a><figcaption itemprop='caption description'>"+(x+1)+"</figcaption></figure>"
                    var url = Data.Pics[x];
                    var k2= x;
                    getImageWidth(url,k2,function(w,h,x){
                        var imgwh2=w+"x"+h;
                        $("#minimg"+x).attr("data-size",imgwh2);
                    });
                }
                var imgBox = '<div class="Pics my-simple-gallery" itemscope itemtype="http://schema.org/ImageGallery">'+ele+'</div>';
                $("section .problem .imgBox").append(imgBox);
                initPhotoSwipeFromDOM('.my-simple-gallery');
            }
            $("section .problem .footer span:nth-of-type(2)").text(Data.FocusedCount+" 人关注");
            $("section .problem").removeClass("hide");
            var video = Data.Videos;
            if (video){
                if (video.length > 0){
                    for (var i = 0; i < video.length; i++){
                        ViewCount += video[i].ViewCont;
                        var ele = "<div class='answer'>" +
                            "<div class='top' userid='"+video[i].AuthorId+"' type='"+video[i].AuthorType+"'>" +
                            "<div class='head_portrait'></div>" +
                            "<span class='name'>"+video[i].Author+"</span>" +
                            "<span class='attention'>关注</span>" +
                            "</div>";
                        if (video[i].Type == "V"){
                            ele += "<div class='video'><video src='"+video[i].VideoUrl+"' poster='"+video[i].FaceImgUrl+"' webkit-playsinline controls></video></div>"
                        }
                        if (video[i].Type == "A"){
                            ele += "<div class='audio_box'>" +
                                "<audio src='"+video[i].VideoUrl+"'></audio>" +
                                //"<img src='img/play03@2x.png' alt='' timelong='"+video[i].TimeLong+"'>" +
                                //"<span class='time'>"+video[i].TimeLong+"’’</span>" +
                                "<div class='audio' timelong='"+video[i].TimeLong+"'>" +
                                "<img src='img/play03@2x.png' alt=''>" +
                                "<span>限时免费</span>" +
                                "</div>" +
                                "<p><span class='minute'></span><span class='second'>"+video[i].TimeLong+"’’</span></p>"+
                                "</div>";
                        }
                        ele += "<p class='heat'>热度 "+video[i].HotValue+"</p></div>";
                        $("section").append(ele);
                        if (video[i].AuthorFaceImgUrl){
                            $("section .answer:nth-of-type("+(i+2)+") .top .head_portrait").css("background-image","url('"+video[i].AuthorFaceImgUrl+"')")
                        }
                        if (video[i].UserIsFocus === "Y"){
                            $("section .answer:nth-of-type("+(i+2)+") .top .attention").hide();
                        }
                    }
                }
            }else {
                ViewCount = 0;
            }
            $("section .problem .footer span:nth-of-type(1)").text(ViewCount+" 人偷偷看");
        },
        error: function (xhr ,errorType ,error) {
            //alert("错误");
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}

function createFocus(focusedid,focusename,type){
    token = getLocalStroagelogin().token;
    var postData = {
        "appToken": token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "focusedid": focusedid,
            "focusename": focusename,
            "type": type
        }
    };
    console.log(postData);
    $.ajax({
        "url": ebase+"/api/Common/CreateFocus",
        "type":"POST",
        "data":postData,
        "dataType":"json",
        success: function (data) {
            console.log(data);
            if (data.Code === "0000" || data.Code === "0006"){
                win();
                $("section .answer .top").each(function(index,item){
                    if ($(this).attr("userid") === focusedid){
                        $(this).find(".attention").hide();
                    }
                })
            }else {
                fail();
            }
        },
        error:function (xhr ,errorType ,error) {
            //alert("错误")
            fail();
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}

$("header .back").on("click", function () {
    history.back();
});
$("section").on("click",".audio", function () {
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
        $("section .audio").each(function(item,index){
            $(this).removeClass("audio_play");
            $(this).parent().find("audio").get(0).pause();
            $(this).find("img").attr("src","img/play03@2x.png");
        });
        $(this).parent().find("audio").attr("src","");
        $(this).parent().find("audio").attr("src",audioSrc);
        $(this).addClass("audio_play");
        audio_text = $(this).find("span").text();
        $(this).parent().find("audio").get(0).play();
        $(this).find("img").attr("src","img/play02.gif");
        $(this).find("span").text("加载中");
        var time = setInterval(function(){
            var audio_time = $(self).attr("timelong") - parseInt($(self).parent().find("audio").get(0).currentTime);
            $(self).parent().find("p .second").text(audio_time+"’’");
            //console.log(111);
            if (!$(self).hasClass("audio_play")){
                clearInterval(time);
                $(self).parent().find("p .second").text($(self).attr("timelong")+"’’");
                $(self).find("span").text(audio_text);
            }
        },100)
    }else {
        $(this).parent().find("audio").get(0).pause();
        $(this).find("img").attr("src","img/play03@2x.png");
    }
});
$("section").on("click",".answer .top .attention", function () {
    var userid = $(this).parent().attr("userid");
    var type = $(this).parent().attr("type");
    var name = $(this).parent().find(".name").text();
    verdictLogin(userid, name, type);
});
$("section").on("click",".problem .head_portrait,.answer .top .head_portrait", function () {
    var userid = $(this).parent().attr("userid");
    if (userid){
        if (location.search){
            location.href = "personage.html"+location.search+"&userid="+userid;
        }else {
            location.href = "personage.html?userid="+userid;
        }
    }
})