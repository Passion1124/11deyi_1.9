var userType = "";
var oneIndex = 1;
var twoIndex = 1;
$(function(){
    var userid = getUrlParam("userid");
    queryUserById(userid);
    initSelectDataOnly();
});

$("header .back").on("click", function () {
    history.back();
});
$(".question_info p:nth-of-type(1) span").on("click", function () {
    $(".question_info p:nth-of-type(1) span").each(function(index,item){
        $(this).removeClass("sex");
    });
    $(this).addClass("sex");
});
$(".question_info .age select").on("change", function () {
    $(".question_info .age span:nth-of-type(1)").text($(this).val());
});
$(".question_info .dep select").on("change", function () {
    $(".question_info .dep span:nth-of-type(1)").text($(this).val());
});
$("section").on("click",".cut p", function () {
    $("section .cut p").each(function (index,item) {
        $(this).removeClass("sure");
    });
    $(this).addClass("sure");
    var myIndex = $(this).index();
    var userid = $("section>div+div+div").attr("userid");
    console.log(userid);
    if (myIndex === 0){
        if (!$(this).attr("clickNum")){
            if (userType === "D" || userType === "O" || userType === "H"){
                queryUserCenterKpByUserId(userid);
            }
            $(".list_loading").removeClass("hide");
        }
        $("section .content .oneBox").removeClass("hide");
        $("section .content .twoBox").addClass("hide");
    }else {
        if (!$(this).attr("clickNum")){
            if(userType === "D" || userType === "O" || userType === "H"){
                queryUserCenterHistoryByUserId(userid);
            }
            $(".list_loading").removeClass("hide");
        }
        $("section .content .twoBox").removeClass("hide");
        $("section .content .oneBox").addClass("hide");
    }
});
$("section").on("click",".user button,.doctor button,.hospital button,.institution button", function () {
    var buttonVal = $("section .attention").text();
    if (buttonVal === "关注"){
        var userid = $(this).parent().attr("userid");
        var type = $(this).parent().attr("type");
        var name = $("section .head_portrait+p").text();
        verdictLogin(userid, name, type);
    }
});
//$(".present_box button").on("click", function () {
//    $(".present_box").addClass("hide");
//    $(".Top,.question,.ask_doctor,.hint").addClass("hide");
//    $("header,.doctor,.user,.institution,.hospital,.cut_box,.content").removeClass("hide");
//    $("head title").text($(".doctor p:nth-of-type(1)").text());
//    $("html,body").removeClass("ovfHiden");
//});
$("section").on("click",".cut_box .advisory button", function () {
    //var doctorName = $(".doctor p:nth-of-type(1)").text();
    //var backImage = $(".doctor .head_portrait").css("background-image");
    //$(".ask_doctor .head_portrait").css("background-image",backImage);
    //$(".ask_doctor .info p:nth-of-type(1)").text(doctorName);
    //$(".ask_doctor .info p span:nth-of-type(1)").text($(".doctor p:nth-of-type(2) span:nth-of-type(1)").text());
    //$(".ask_doctor .info p span:nth-of-type(2)").text($(".doctor p:nth-of-type(2) span:nth-of-type(2)").text());
    //var login = getLocalStroagelogin();
    //if (localStorage.judge || login.token){
    //    $(".Top,.question,.ask_doctor,.hint").removeClass("hide");
    //    $("header,.doctor,.user,.institution,.hospital,.cut_box,.content").addClass("hide");
    //}else {
    //    $(".popup").removeClass("hide");
    //    $("html,body").addClass("ovfHiden");
    //}
    //$("head title").text("咨询"+doctorName);
    //$(".Top .title").text("咨询"+doctorName);
    //$(".question_info p:nth-of-type(1) span").each(function (index,item) {
    //    $(this).removeClass("sex");
    //});
    //$(".question_info p:nth-of-type(1) span:nth-of-type(1)").addClass("sex");
    //$(".question_info .age span:nth-of-type(1)").text("18岁");
    //$(".question_content textarea").each(function () {
    //    $(this).val("");
    //});
    //$(".question .address input").val("");
    //$(".question_pics img").each(function (index,item) {
    //    $(this).remove();
    //})
    location.href = "chat.html#id="+$(".doctor").attr("hxid");
});
$("section .Top .back").on("click", function () {
    $(".Top,.question,.ask_doctor,.hint").addClass("hide");
    $("header,.doctor,.user,.institution,.hospital,.cut_box,.content").removeClass("hide");
    $("head title").text($(".doctor p:nth-of-type(1)").text());
});
$("section").on("click",".case_list .top p:nth-of-type(3)", function () {
    var userid = $(this).parent().attr("userid");
    var type = $(this).parent().attr("type");
    var name = $(this).parent().find("p:nth-of-type(2)").text();
    verdictLogin(userid, name, type);
});
$("section").on("click",".fullText",function(){
    var text = $(this).text();
    var eleTop = $(this).parent().parent().offset().top;
    if (text === "全文"){
        $(this).text("收起");
        $(this).parent().find("p:nth-of-type(2)").css("display","block")
    }else {
        $(this).text("全文");
        $(this).parent().find("p:nth-of-type(2)").css("display","-webkit-box");
        $(window).scrollTop(eleTop);
    }
});
$("section").on("click","video",function(){
    console.log($(this));
    $(this).toggleClass("play");
    if ($(this).hasClass("play")){
        $(this).get(0).play();
        console.log($(this).get(0).duration);
    }else {
        $(this).get(0).pause();
    }
    //$(this).get(0).play();
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
        //alert("123");
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
$("section").on("click",".content_list .user .user_left", function () {
    var userid = $(this).parent().attr("userid");
    goToHomePage(userid);
});
$("section").on("click",".content_list .doctor .doctor_answer_left", function () {
    var userid = $(this).parent().parent().attr("userid");
    goToHomePage(userid);
});
//获取指定用户信息
function queryUserById(userid){
    getLoginUserToken();
    var postData = {
        "appToken":token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "search_userid":userid
        }
    };
    $.ajax({
        "url": ebase + "/api/User/QueryUserById",
        "type":"POST",
        "data":postData,
        "dataType":"json",
        success:function(data){
            console.log(data);
            if (data.Code === "0000"){
                userType = data.Data.Type;
                $("head title").text(data.Data.Name)
                if (!$(".loading_box").hasClass("hide")){
                    $(".loading_box").addClass("hide");
                }
                $("header .title").text(data.Data.Name);
                console.log(userType);
                if (userType === "U"){
                    $(".list_loading").addClass("hide");
                    userInfo(data.Data);
                }else if (userType === "D"){
                    doctorInfo(data.Data);
                }else if (userType === "H"){
                    hospitalInfo(data.Data);
                }else if (userType === "O"){
                    institutionInfo(data.Data);
                }
                var Data = data.Data;
                createChatUserInfo(Data.Name,Data.FaceImgUrl,Data.HxUserId,Data.UserID);
            }
        },
        error: function(xhr ,errorType ,error){
            //alert("错误");
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
function userInfo(data){
    var html = "<div class='user' userid='"+data.UserID+"' type='"+data.Type+"'>" +
        "<div class='head_portrait'></div>" +
        "<p>"+data.Name+"</p>" +
        "<button class='attention'>关注</button>" +
        "<p>"+data.FansNum+"人关注</p>" +
        "<p>个人简介："+data.Description+"</p>" +
        "</div>";
    html += "<div class='cut_box hide'>" +
        "<div class='advisory'>" +
        "<button>发消息</button>" +
        "</div></div>";
    $("section").append(html);
    if (data.FaceImgUrl){
        $("section .user .head_portrait").css("background-image","url('"+data.FaceImgUrl+"')");
    }
    if (data.IsFocus === "Y"){
        $('section .user button').text("已关注");
    }
}
function doctorInfo(data){
    var html = "<div class='doctor' userid='"+data.UserID+"' type='"+data.Type+"' hxid='"+data.HxUserId+"'>" +
        "<div class='head_portrait'></div>" +
        "<p>"+data.Name+"</p>" +
        "<p><span class='doctor_dep' depid='"+data.DepartmentID+"'>"+data.DepartmentName+"</span><span>"+data.JobName+"</span></p>" +
        "<p class='address'>"+data.Province+"/"+data.City+"/"+data.HospitalName+"</p>" +
        "<button class='attention'>关注</button>" +
        "<p>"+data.FansNum+"人关注</p>" +
        "<p>擅长领域："+data.GoodAt+"</p></div>";
    html += "<div class='cut_box'>" +
        "<div class='advisory'>" +
        "<p class='hide'>"+data.PriceValue+" ￥</p>" +
        "<button>发消息</button>" +
        "</div>" +
        "<div class='cut'>" +
        //"<p class='sure'>医生说</p>" +
        //"<p>问答</p>" +
        "<p class='sure'><span class='bom'>医生说</span></p>" +
        "</div>" +
        "</div>";
    html += "<div class='content'><div class='oneBox'></div><div class='twoBox'></div></div>";
    $("section").append(html);
    if (data.FaceImgUrl){
        $("section .doctor .head_portrait").css("background-image","url('"+data.FaceImgUrl+"')");
    }
    if (data.IsFocus !== "N"){
        $('section .doctor button').text("已关注");
    }
    var sure = $("section .cut_box .cut .sure").text();
    if (sure === "医生说"){
        queryUserCenterKpByUserId(data.UserID);
    }else {
        queryUserCenterHistoryByUserId(data.UserID);
    }
}
function hospitalInfo(data){
    var html = "<div class='hospital' userid='"+data.UserID+"' type='"+data.Type+"'>" +
        "<div class='head_portrait'></div>" +
        "<p>"+data.Name+"</p>" +
        "<p><span>"+data.City+"</span><span class='hide'></span></p>" +
        "<p class='address'></p>" +
        "<button class='attention'>关注</button>" +
        "<p>"+data.FansNum+"人关注</p>" +
        "<p>医院介绍："+data.Description+"</p></div>";
    html += "<div class='cut_box'>" +
        "<div class='advisory hide'>" +
        "<button>发消息</button>" +
        "</div>" +
        "<div class='cut'>" +
        "<p class='sure'>医院动态</p>" +
        "<p>问答</p>" +
        "</div>" +
        "</div>";
    html += "<div class='content'><div class='oneBox'></div><div class='twoBox'></div></div>";
    $("section").append(html);
    if (data.FaceImgUrl){
        $("section .hospital .head_portrait").css("background-image","url('"+data.FaceImgUrl+"')");
    }
    if (data.IsFocus === "Y"){
        $('section .hospital button').text("已关注");
    }
    var sure = $("section .cut_box .cut .sure").text();
    if (sure === "医院动态"){
        queryUserCenterKpByUserId(data.UserID);
    }else {
        queryUserCenterHistoryByUserId(data.UserID);
    }
}
function institutionInfo(data){
    var html = "<div class='institution' userid='"+data.UserID+"' type='"+data.Type+"'>" +
        "<div class='head_portrait'></div>" +
        "<p>"+data.Name+"</p>" +
        "<button class='attention'>关注</button>" +
        "<p>"+data.FansNum+"人关注</p>" +
        "<p>机构介绍："+data.Description+"</p></div>";
    html += "<div class='cut_box'>" +
        "<div class='advisory hide'>" +
        "<button>发消息</button>" +
        "</div>" +
        "<div class='cut'>" +
        "<p class='sure'>健康说</p>" +
        "<p>问答</p>" +
        "</div>" +
        "</div>";
    html += "<div class='content'><div class='oneBox'></div><div class='twoBox'></div></div>";
    $("section").append(html);
    if (data.FaceImgUrl){
        $("section .institution .head_portrait").css("background-image","url('"+data.FaceImgUrl+"')");
    }
    if (data.IsFocus === "Y"){
        $('section .institution button').text("已关注");
    }
    var sure = $("section .cut_box .cut .sure").text();
    if (sure === "健康说"){
        queryUserCenterKpByUserId(data.UserID);
    }else {
        queryUserCenterHistoryByUserId(data.UserID);
    }
}
//获与指定人员相关的视频信息
function queryUserCenterKpByUserId(userid,callback){
    getLoginUserToken();
    var postData = {
        "appToken":token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "search_userid":userid,
            "pageindex":oneIndex,
            "pagesize":pagesize
        }
    };
    $.ajax({
        "url": ebase + "/api/User/QueryUserCenterKpByUserId",
        "type":"POST",
        "data":postData,
        "dataType":"json",
        success:function(data){
            console.log(data);
            if (data.Code === "0000"){
                var Data = data.Data.Rows;
                $("section .cut_box .cut .sure").attr("clickNum","1");
                if (!$(".list_loading").hasClass("hide")){
                    $(".list_loading").addClass("hide");
                }
                if (Data.length < 1){
                    var ele = "<div class='unVideo'><img src='img/video@2x.png' alt=''><p>暂时没有发布视频呢</p></div>"
                    $("section .content .oneBox").append(ele)
                }else {
                    for (var i = 0; i < Data.length; i++){
                        var ele = "<div class='case_list' videoid='"+Data[i].VideoId+"'>" +
                            "<div class='top' userid='"+Data[i].AuthorId+"' type='"+Data[i].AuthorType+"'>" +
                            "<p></p>" +
                            "<p>"+Data[i].Author+"</p>" +
                            "<p>关注</p>" +
                            "</div>";
                        var description = Data[i].Description.replace(/\n/g, "<br>");
                        var text = "<div class='text'>" +
                            "<p class='title'>"+Data[i].VideoTitle+"</p>" +
                            "<p>"+description+"</p>" +
                            "<p class='fullText'>全文</p></div>";
                        if (Data[i].Type == "V"){
                            ele += "<div class='video'>" +
                                "<video poster='"+Data[i].FaceImgUrl+"' webkit-playsinline src='"+Data[i].VideoUrl+"' controls>您的浏览器不支持video标签</video>" +
                                "</div>"
                        }else if (Data[i].Type == "A"){
                            ele += "<div class='audio_box'>" +
                                "<audio src='"+Data[i].VideoUrl+"'></audio>" +
                                "<div class='audio'  timelong='"+Data[i].TimeLong+"'>" +
                                "<img src='img/play03@2x.png' alt=''>" +
                                "<span></span></div>" +
                                "<p><span class='minute'></span><span class='second'>"+Data[i].TimeLong+"’’</span></p></div>";
                        }else if (Data[i].Type == "P"){
                            var image = "";
                            var imgwh = "1080x1920";
                            ele += text;
                            if (Data[i].Pics.length <= 1){
                                if (Data[i].Pics.length == 1){
                                    image = "<div class='onlyImage'><figure itemscope itemtype='1'><a id='minimg"+0+i+"' href='"+Data[i].Pics[0]+"' itemprop='contentUrl' data-size='"+imgwh+"'><img src='"+Data[i].Pics[0]+"' itemprop='thumbnail' alt='Image description' /></a><figcaption itemprop='caption description'>1</figcaption></figure></div>"
                                    var url = Data[i].Pics[0];
                                    var k2=0+""+i;
                                    getImageWidth(url,k2,function(w,h,x){
                                        var imgwh2=w+"x"+h;
                                        $("#minimg"+x).attr("data-size",imgwh2);
                                    });
                                }
                            }else {
                                image = "<div class='moreImage'>";
                                for (var j = 0; j < Data[i].Pics.length; j++){
                                    image += "<figure itemscope itemtype='1'><a id='minimg"+j+i+"' href='"+Data[i].Pics[j]+"' itemprop='contentUrl' data-size='"+imgwh+"'><img src='"+Data[i].Pics[j]+"' itemprop='thumbnail' alt='Image description'/></a><figcaption itemprop='caption description'>"+(j+1)+"</figcaption></figure>";
                                    var url = Data[i].Pics[j];
                                    var k2=j+""+i;
                                    getImageWidth(url,k2,function(w,h,x){
                                        var imgwh2=w+"x"+h;
                                        $("#minimg"+x).attr("data-size",imgwh2);
                                    });
                                }
                                image += "</div>";
                            }
                            var imgBox = '<div class="Pics my-simple-gallery" itemscope itemtype="http://schema.org/ImageGallery">'+image+'</div>';
                            ele += imgBox;
                        }
                        if (Data[i].Type != "P"){
                            ele += text;
                        }
                        if (Data[i].Remarks.length > 0){
                            ele += "<div class='obstetrics'>";
                            for (var k = 0; k < Data[i].Remarks.length; k++ ){
                                ele += " #"+Data[i].Remarks[k].RemarkName
                            }
                            ele += "</div>";
                        }
                        ele += "<div class='heat'><span>"+Data[i].HotValue+"</span> 条热度</div></div>";
                        //if (oneIndex === 1){
                        //    $(".content .oneBox").append(ele);
                        //    if ( i+1 === pagesize){
                        //        var html = "<div class='content_bottom'><button><img class='hide' src='img/loading.gif' alt=''><span>点击加载更多</span></button></div>";
                        //        $(".content .oneBox").append(html);
                        //    }
                        //}else {
                        //    $(".content .oneBox .content_bottom").insertBefore(ele);
                        //}
                        $(".content .oneBox").append(ele);
                        if (Data[i].AuthorFaceImgUrl){
                            $(".content .oneBox .case_list:nth-of-type("+parseInt((oneIndex-1)*pagesize+(i+1))+") .top p:nth-child(1)").css("background_image","url('"+Data[i].AuthorFaceImgUrl+"')");
                        }
                        var Height = $("section .case_list:nth-of-type("+parseInt((oneIndex-1)*pagesize+(i+1))+") .text p:nth-of-type(2)").height();
                        if ( Height <= 120){
                            $(".content .oneBox .case_list:nth-of-type("+parseInt((oneIndex-1)*pagesize+(i+1))+") .text p:nth-of-type(3)").addClass("hide")
                        }else {
                            $(".content .oneBox .case_list:nth-of-type("+parseInt((oneIndex-1)*pagesize+(i+1))+") .text p:nth-of-type(2)").css("display","-webkit-box");
                        }
                        if (Data[i].UserIsFocus === "Y"){
                            $(".content .oneBox .case_list:nth-of-type("+parseInt((oneIndex-1)*pagesize+(i+1))+") .top p:nth-of-type(3)").hide();
                        }
                    }
                    if (oneIndex !== 1){
                        callback();
                    }
                    initPhotoSwipeFromDOM('.my-simple-gallery');
                    if (Data.length !== pagesize){
                        var ele = "<div class='noMoreData'> - 没有了 - </div>";
                        $("section .content .oneBox").append(ele);
                        $("footer").addClass("hide");
                    }
                }
            }
        },
        error: function(xhr ,errorType ,error){
            //alert("错误");
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
//获取医生回复的问题列表信息
function queryUserCenterHistoryByUserId(userid,callback){
    getLoginUserToken();
    var postData = {
        "appToken":token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "pageindex":twoIndex,
            "pagesize":pagesize,
            "search_userid":userid
        }
    };
    $.ajax({
        "url": ebase + "/api/User/QueryUserCenterHistoryByUserId",
        "type":"POST",
        "data":postData,
        "dataType":"json",
        success:function(data){
            console.log(data);
            if (data.Code === "0000"){
                $("section .cut_box .cut .sure").attr("clickNum","1");
                if (!$(".list_loading").hasClass("hide")){
                    $(".list_loading").addClass("hide");
                }
                var Data = data.Data.Rows;
                if (Data.length >= 1){
                    for (var i = 0; i < Data.length; i++){
                        var ele ="<div class='content_list' questionid='"+Data[i].QuestionID+"'>" +
                            "<div class='user'>" +
                            "<div class='user_left'><p class='head_portrait'></p><p class='ask'></p></div>" +
                            "<p class='text'>"+Data[i].DepartmentName+"问题："+Data[i].Sex+"，"+Data[i].Age+"。"+Data[i].Question+"</p>";
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
                                    "<span>限时免费</span>" +
                                    "</div></div>";
                            }else if (Data[i].Type === "A"){
                                ele += "<audio src='"+Data[i].Url+"'></audio>" +
                                    "<div class='audio' timelong='"+Data[i].TimeLong+"'>" +
                                    "<img src='img/play03@2x.png' alt=''>" +
                                    "<span>限时免费</span>" +
                                    "</div>" +
                                    "<p><span class='minute'></span><span class='second'>"+Data[i].TimeLong+"’’</span></p>";
                            }
                            ele += "</div></div></div>"
                        }else {
                            ele += "<div class='reply'><span>为答案出价 "+Data[i].PriceValue+"元/人次</span><span>待回答</span></div></div>"
                        }
                        ele += "</div>";
                        $(".content .twoBox").append(ele);
                        //if (twoIndex === 1){
                        //    $(".content .twoBox").append(ele);
                        //    if ( i+1 === pagesize){
                        //        var html = "<div class='content_bottom'><button><img class='hide' src='img/loading.gif' alt=''><span>点击加载更多</span></button></div>";
                        //        $(".content .twoBox").append(html);
                        //    }
                        //}else {
                        //    $(".content .twoBox .content_bottom").insertBefore(ele);
                        //}
                        if (Data[i].AuthorImgUrl && Data[i].IsAnonymous === "N"){
                            $(".content .twoBox .content_list:nth-of-type("+parseInt((twoIndex-1)*pagesize+(i+1))+") .user .user_left .head_portrait").css("background-image","url('"+Data[i].AuthorImgUrl+"')")
                        }
                        if (Data[i].DoctorFaceImgUrl){
                            $(".content .twoBox .content_list:nth-of-type("+parseInt((twoIndex-1)*pagesize+(i+1))+") .doctor .doctor_answer_left .head_portrait").css("background-image","url('"+Data[i].DoctorFaceImgUrl+"')")
                        }
                        if (Data[i].VideoFaceImgUrl){
                            $(".content .content_list:nth-of-type("+parseInt((twoIndex-1)*pagesize+(i+1))+") .video").css("background-image","url('"+Data[i].VideoFaceImgUrl+"')")
                        }
                        if (Data[i].IsAnonymous === "N"){
                            $(".content .content_list:nth-of-type("+parseInt((twoIndex-1)*pagesize+(i+1))+") .user").attr("userid",Data[i].AuthorID)
                        }
                        if (Data[i].DoctorId){
                            $(".content .content_list:nth-of-type("+parseInt((twoIndex-1)*pagesize+(i+1))+") .doctor").attr("userid",Data[i].DoctorId)
                        }
                    }
                    if (Data.length !== pagesize){
                        console.log("没有更多数据了");
                        var ele = "<div class='noMoreData'> - 没有了 - </div>";
                        $("section .content .twoBox").append(ele)
                    }
                }else {
                    var ele = "<div class='unVideo'><img src='img/qa@2x.png' alt=''><p>专家还在回答问题的路上</p></div>";
                    $("section .content .twoBox").append(ele)
                }
            }
            if (twoIndex !== 1){
                callback();
            }
        },
        error: function(xhr ,errorType ,error){
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
    $.ajax({
        "url": ebase+"/api/Common/CreateFocus",
        "type":"POST",
        "data":postData,
        "dataType":"json",
        success: function (data) {
            console.log(data);
            if (data.Code === "0000" || data.Code === "0006"){
                win();
                var focusNum = parseInt($("section .attention+p").text().substring(0,$("section .attention+p").text().length - 3)) + 1;
                $("section .attention+p").text(focusNum+"人关注");
                $("section .attention").text("已关注");
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
//获取年龄
function initSelectDataOnly(){
    for (var k = 1; k < 13; k++){
        var ele = "<option value='"+k+"月'>"+k+"月</option>";
        $(".question_info .age select").append(ele)
    }
    for (var i = 1; i < 101; i++){
        if (i == 18){
            var ele = "<option value='"+i+"岁' selected>"+i+"岁</option>";

        }else {
            var ele = "<option value='"+i+"岁'>"+i+"岁</option>";

        }
        $(".question_info .age select").append(ele)
    }
}