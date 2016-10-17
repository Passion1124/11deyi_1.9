$(function(){
    getToken(function(){
        if (getLocalStroagelogin().token){
            getMyConsult();
        }else {
            $(".popup").removeClass("hide");
            $(".section_load").addClass("hide");
        }
    },"","myConsult")
});

function getMyConsult(callback){
    var token = getLocalStroagelogin().token;
    var postData = {"appToken":token,"para":{
        "device_type":"PC",
        "device_id":" ",
        "api_version":"1.0.0.0",
        "pageindex": pageindex,
        "pagesize": pagesize
    }};
    $.ajax({
        "url": ebase+"/api/Question/QueryMyQuestionByUserId",
        "type":"POST",
        "data":postData,
        "dataType":"json",
        success:function(data){
            console.log(data);
            var Data = data.Data.Rows;
            if (Data.length !== pagesize){
                $(".unMoreData").removeClass("hide");
                $("footer").addClass("hide");
            }else {
                $("footer").removeClass("hide");
            }
            if (!$(".section_load").hasClass("hide")){
                $(".section_load").addClass("hide");
            }
            for (var i = 0; i < Data.length; i++){
                var ele ="<div class='content_list' questionid='"+Data[i].QuestionID+"'>" +
                    "<div class='user' userid='"+Data[i].AuthorID+"'>" +
                    "<div class='user_left'><p class='head_portrait'></p><p class='ask'></p></div>" +
                    "<p class='text'>"+Data[i].Question+"</p>";
                if (Data[i].Type){
                    ele += "</div><div class='doctor'>" +
                        "<div class='doctor_info'>" +
                        "<span>"+Data[i].DoctorName+" </span>" +
                        "<span>｜ "+Data[i].DoctorDepartment+"</span>" +
                        "<span> "+Data[i].DoctorLevel+"</span>" +
                        "</div>" +
                        "<div class='doctor_answer'>" +
                        "<div class='doctor_answer_left'>" +
                        "<p class='head_portrait'></p>" +
                        "<p class='answer'></p>" +
                        "</div>" +
                        "<div class='doctor_answer_right'>";
                    if(Data[i].Type === "V"){
                        ele += "<div class='video'>" +
                            "<div class='shade'>" +
                            "<img src='img/index_play.png' alt=''>" +
                                //"<span>"+Data[i].PriceValue+"元偷偷看</span>" +
                            "<span>限时免费</span>" +
                            "</div></div>";
                        if (Data[i].VideoViewCount === 0){
                            ele += "<span class='look hide'>"+Data[i].VideoViewCount+"人点播</span>"
                        }else {
                            ele += "<span class='look'>"+Data[i].VideoViewCount+"人点播</span>"
                        }
                    }else if (Data[i].Type === "A"){
                        ele += "<audio src='"+Data[i].Url+"'></audio>" +
                            "<div class='audio' timelong='"+Data[i].TimeLong+"'>" +
                            "<img src='img/play03@2x.png' alt=''>" +
                                //"<span>"+Data[i].PriceValue+"元偷偷看</span>" +
                            "<span>限时免费</span>" +
                            "</div>" +
                            "<p><span class='minute'></span><span class='second'>"+Data[i].TimeLong+"’’</span></p>";
                        if (Data[i].VideoViewCount === 0){
                            ele += "<span class='look ado hide'>"+Data[i].VideoViewCount+"人点播</span></div>"
                        }else {
                            ele += "<span class='look ado'>"+Data[i].VideoViewCount+"人点播</span></div>";
                        }
                    }
                    ele += "</div></div></div>"
                }else {
                    ele += "<div class='reply'><span>"+Data[i].PriceValue+"元</span><span>待回答</span></div></div>"
                }
                ele += "</div>";
                $(".content").append(ele);
                if (Data[i].AuthorImgUrl){
                    $(".content .content_list:nth-of-type("+parseInt((pageindex-1)*pagesize+(i+1))+") .user .user_left .head_portrait").css("background-image","url('"+Data[i].AuthorImgUrl+"')")
                }
                if (Data[i].DoctorFaceImgUrl){
                    $(".content .content_list:nth-of-type("+parseInt((pageindex-1)*pagesize+(i+1))+") .doctor .doctor_answer_left .head_portrait").css("background-image","url('"+Data[i].DoctorFaceImgUrl+"')")
                }
                if (Data[i].VideoFaceImgUrl){
                    $(".content .content_list:nth-of-type("+parseInt((pageindex-1)*pagesize+(i+1))+") .video").css("background-image","url('"+Data[i].VideoFaceImgUrl+"')")
                }
                if (Data[i].DoctorId){
                    $(".content .content_list:nth-of-type("+parseInt((pageindex-1)*pagesize+(i+1))+") .doctor").attr("userid",Data[i].DoctorId)
                }
            }
            if (pageindex !== 1){
                callback();
            }
        },
        error: function (xhr ,errorType ,error) {
            //alert("错误");
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
$("section").on("click",".problem .content_list .user .head_portrait", function () {
    var userid = $(this).parent().parent().attr("userid");
    goToHomePage(userid);
});
$("section").on("click",".problem .content_list .doctor .head_portrait", function () {
    var userid = $(this).parent().parent().parent().attr("userid");
    goToHomePage(userid);
});
$("footer button").on("click", function () {
    var self = this;
    $(this).find("img").removeClass("hide");
    $(this).find("span").addClass("hasImg").text("加载中");
    pageindex++;
    getMyConsult(function(){
        $(self).find("img").addClass("hide");
        $(self).find("span").removeClass("hasImg").text("点击加载更多");
    });
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
$("header .back").on("click",function(){
    history.back();
});