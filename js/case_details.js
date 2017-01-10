$(function(){
    var questionId = getLocalStorageQuestionId();
    if (questionId){
        queryVideoById(questionId);
    }else {
        location.href = "case_science.html";
    }
});

$("header .back").on("click",function(){
    history.back();
});

$("section").on("click",".footer button",function(){
    var text = $(this).text();
    if (text === "关注作者，了解更多健康知识"){
        var focusid = $(".doctor_box").attr("userid");
        var type = $(".doctor_box").attr("type");
        var name = $(".doctor_box .doctor_info p:nth-of-type(1) span").text();
        if (getLocalStroagelogin().token){
            $(this).attr("disabled","disabled");
        }
        verdictLogin(focusid, name, type);
    }else {
        location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.yiyideyi.yiyideyi";
    }
});
$("section").on("click",".case_list .top p:nth-child(1),.case_list .top p:nth-child(2)", function () {
    var userid = $(this).parent().attr("userid");
    goToHomePage(userid);
});
$("section").on("click",".doctor_box .doctor .avatar", function () {
    var userid = $(this).parent().parent().attr("userid");
    goToHomePage(userid);
});
$("section").on("click",".doctor_box .doctor .doctor_info p:nth-of-type(1) span", function () {
    var userid = $(this).parent().parent().parent().parent().attr("userid");
    goToHomePage(userid);
});

$("section").on("click",".case_list .top p:nth-of-type(3)", function () {
    var focusid = $(".doctor_box").attr("userid");
    var type = $(".doctor_box").attr("type");
    var name = $(".doctor_box .doctor_info p:nth-of-type(1) span").text();
    if (getLocalStroagelogin().token){
        $("section .footer button").attr("disabled","disabled");
    }
    verdictLogin(focusid, name, type);
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
        alert("123");
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

var imageUrl = "";
function queryVideoById(id){
    if (getLocalStroagelogin().token){
        token = getLocalStroagelogin().token;
    }
    var postData = {
        "appToken": token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "videoid":id
        }
    };
    $.ajax({
        "url":ebase+"/api/Video/QueryVideoById",
        "type":"POST",
        "data":postData,
        "dataType":"json",
        success: function (data) {
            console.log(data);
            if (data.Code === "0000"){
                var Data = data.Data;
                var title = Data.VideoTitle;
                if (title.length > 8){
                    title = title.substring(0,8)+"...";
                }
                $("head title,header .title").text(title)
                var ele = "<div class='case_list' videoid='"+Data.VideoId+"'>" +
                    "<div class='transmit hide'>" +
                    "<div class='transmit_left'><div class='head_portrait'></div></div>" +
                    "<div class='transmit_right'>" +
                    "<p>" +
                    "<span>仝永红</span>" +
                    "<span>转发</span>" +
                    "<span>关注</span>" +
                    "<span>取消转发</span>" +
                    "</p>" +
                    "<p>转发描述内容可以这样显示出来，字体大小为15pt。行距为20pt。最长120字。</p>" +
                    "</div>" +
                    "</div>" +
                    "<div class='top' userid='"+Data.AuthorId+"'>" +
                    "<p></p>" +
                    "<p>"+Data.Author+"</p>" +
                    "<p>关注</p>" +
                    "</div>";
                var description = Data.Description.replace(/\n/g, "<br>");
                var text = "<div class='text'>" +
                    "<p class='title'>"+Data.VideoTitle+"</p>" +
                    "<p>"+description+"</p></div>";
                //console.log(Data.Description.indexOf("\n") >= 0);
                if (Data.Type == "V"){
                    ele += "<div class='video'>" +
                        "<video poster='"+Data.FaceImgUrl+"' webkit-playsinline src='"+Data.VideoUrl+"' controls>您的浏览器不支持video标签</video>" +
                        "</div>";
                }else if (Data.Type == "A"){
                    ele += "<div class='audio_box'>" +
                        "<audio src='"+Data.VideoUrl+"'></audio>" +
                        "<div class='audio'  timelong='"+Data.TimeLong+"'>" +
                        "<img src='img/play03@2x.png' alt=''>" +
                        "<span></span></div>" +
                        "<p><span class='minute'></span><span class='second'>"+Data.TimeLong+"’’</span></p></div>";
                }else if (Data.Type == "P"){
                    var image = "";
                    var imgwh = "1080x1920";
                    ele += text;
                    if (Data.Pics.length <= 1){
                        if (Data.Pics.length == 1){
                            //console.log("only")
                            image = "<div class='onlyImage'><figure itemscope itemtype='1'><a id='minimg"+0+"' href='"+Data.Pics[0]+"' itemprop='contentUrl' data-size='"+imgwh+"'><img src='"+Data.Pics[0]+"' itemprop='thumbnail' alt='Image description' /></a><figcaption itemprop='caption description'>1</figcaption></figure></div>"
                            var url = Data.Pics[0];
                            var k2=0;
                            getImageWidth(url,k2,function(w,h,x){
                                setTimeout(function () {
                                    var imgwh2=w+"x"+h;
                                    $("#minimg"+x).attr("data-size",imgwh2);
                                },200)
                            });
                        }
                    }else {
                        //console.log("more")
                        image = "<div class='moreImage'>";
                        for (var j = 0; j < Data.Pics.length; j++){
                            image += "<figure itemscope itemtype='1'><a id='minimg"+j+"' href='"+Data.Pics[j]+"' itemprop='contentUrl' data-size='"+imgwh+"'><img src='"+Data.Pics[j]+"' itemprop='thumbnail' alt='Image description'/></a><figcaption itemprop='caption description'>"+(j+1)+"</figcaption></figure>";
                            var url = Data.Pics[j];
                            var k2=j;
                            getImageWidth(url,k2,function(w,h,x){
                                setTimeout(function () {
                                    var imgwh2=w+"x"+h;
                                    $("#minimg"+x).attr("data-size",imgwh2);
                                },200)
                            });
                        }
                        image += "</div>";
                    }
                    var imgBox = '<div class="Pics my-simple-gallery" itemscope itemtype="http://schema.org/ImageGallery">'+image+'</div>';
                    ele += imgBox;
                }
                if (Data.Type != "P"){
                    ele += text;
                }
                if (Data.Remarks.length > 0){
                    ele += "<div class='obstetrics'>";
                    for (var k = 0; k < Data.Remarks.length; k++ ){
                        ele += " #"+Data.Remarks[k].RemarkName
                    }
                    ele += "</div>";
                }
                ele += "<div class='heat'><span>"+Data.HotValue+"</span> 条热度</div></div>";
                $("section").append(ele);
                if (Data.Type == "V"){
                    imageUrl = Data.FaceImgUrl;
                }else if (Data.Type == "A"){
                    imageUrl = Data.AuthorFaceImgUrl
                }else if(Data.Type == "P" && Data.Pics.length > 0){

                    imageUrl = Data.Pics[0]
                }else if (Data.Type == "P" && Data.Pics.length < 1){
                    imageUrl = Data.AuthorFaceImgUrl;
                }
                console.log(imageUrl);
                if (Data.AuthorFaceImgUrl){
                    $("section .case_list:nth-of-type(1) .top p:nth-child(1)").css("background_image","url('"+Data.AuthorFaceImgUrl+"')");
                }
                $("section .case_list .top").css("border-bottom","1px solid #CCC");
                initPhotoSwipeFromDOM('.my-simple-gallery');
                if (Data.UserIsFocus === "Y"){
                    $("section .case_list .top p:nth-of-type(3)").hide();
                }
                queryUserById(Data.AuthorId);
            }
        },
        error: function (xhr ,errorType ,error) {
            //alert("错误")
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
function queryUserById(id){
    if (getLocalStroagelogin().token){
        token = getLocalStroagelogin().token;
    }
    var postData = {
        "appToken":token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "search_userid": id
        }
    };
    $.ajax({
        "url": ebase+"/api/User/QueryUserById",
        "type":"POST",
        "data":postData,
        "dataType":"json",
        success:function(data){
            console.log(data);
            var Data = data.Data;
            if (Data.Type === "D"){
                var eleChild = "<p>" +
                    "<span>"+Data.Name+"</span>" +
                    "<span>"+Data.DepartmentName+"</span>" +
                    "<span>"+Data.JobName+"</span>" +
                    "</p>" +
                    "<p>"+Data.Province+"-"+Data.City+" / "+Data.HospitalName+"</p>"
            }else if (Data.Type === "H"){
                var eleChild = "<p><span>"+Data.Name+"</span></p><p>医院官方博客</p>"
            }else if (Data.Type === "O"){
                var eleChild = "<p><span>"+Data.Name+"</span></p><p>官方博客</p>";
            }else if (Data.Type === "U"){
                var eleChild = "<p><span>"+Data.Name+"</span></p>";
            }
            var ele = "<div class='doctor_box' userid='"+Data.UserID+"' type='"+Data.Type+"'>" +
                "<div class='doctor'>" +
                "<div class='avatar'></div>" +
                "<div class='doctor_info'>"+eleChild+"</div>" +
                "</div>" +
                "</div>";
            if (Data.IsFocus === "N"){
                ele += "<div class='footer'><button>关注作者，了解更多健康知识</button></div>";
            }else {
                ele += "<div class='footer'><button class='download'>下载壹壹得医，与作者一对一交流</button></div>";
            }
            $("section").append(ele);
            $("section .doctor .avatar").css("background-image","url('"+Data.FaceImgUrl+"')");
            $(".loading_box").addClass("hide");
            if (!Data.DepartmentName){
                $("section .doctor_info p:nth-of-type(1) span:nth-of-type(2)").addClass("hide");
            }
            if (!Data.JobName){
                $("section .doctor_info p:nth-of-type(1) span:nth-of-type(3)").addClass("hide");
            }
            if (!(Data.Province && Data.City && Data.HospitalName)){
                $("section .doctor_info p:nth-of-type(2)").addClass("hide");
            }
            if (isWx){
                getWx();
            }
        },
        error:function (xhr ,errorType ,error) {
            //alert("错误")
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
                $("section .case_list .top p:nth-of-type(3)").hide();
                $(".footer button").text("下载壹壹得医，与作者一对一交流");
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
function getWx(){
    if (getLocalStroagelogin().token){
        token = getLocalStroagelogin().token;
    }
    var paraData={"appToken":token,"para":{
        "device_type":"PC",
        "device_id":" ",
        "api_version":"1.0.0.0",
        "url":location.href
    }};
    $.ajax({
        url:ebase+"/api/Sign/GetJsTicket",
        type:"POST",
        data:paraData,
        dataType:"json",
        success:function(data){
            console.log(data);
            var Data = data.Data;
            if (data.Code === "0000"){
                getLicense(Data.appId,Data.timestamp,Data.nonceStr,Data.ticket)
            }
        },
        error: function (xhr ,errorType ,error) {
            //alert("数据错误！请刷新页面！")
            console.log(xhr)
            console.log(errorType)
            console.log(error)
        }
    })
}
function getLicense(appId,timestamp,nonceStr,signature){
    wx.config({
        debug: false,
        appId: appId,
        timestamp: timestamp,
        nonceStr: nonceStr,
        signature: signature,
        jsApiList:['checkJsApi',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone']
    });
    wx.ready(function(){
        //显示所有功能按钮
        //wx.showAllNonBaseMenuItem();
        ////隐藏所有非基础按钮接口
        //wx.hideAllNonBaseMenuItem();
        //显示需要引用按钮
        //wx.showMenuItems({
        //    menuList:['menuItem:share:appMessage','menuItem:share:timeline','menuItem:favorite'] //要显示的菜单项
        //});
        //分享到朋友圈
        var title = $(".case_list .title").text()+" 作者:"+$(".doctor_info p span").text() + " 热度:"+ $(".case_list .heat span").text();
        var desc = $("section .case_list .text p:nth-of-type(2)").text();

        wx.onMenuShareTimeline({
            title:title,
            link:location.href,
            imgUrl:imageUrl,
            success:function(){

            },
            cancel: function () {

            }
        });
        //分享给朋友
        wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: location.href, // 分享链接
            imgUrl: imageUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    })
}
//function win(){
//    $(".consult_loading p").text("关注成功");
//    $(".consult_loading img").addClass("result").attr("src","img/chenggong_@2x.png");
//    setTimeout(function(){
//        $(".footer button").removeAttr("disabled");
//        $(".consult_loading").addClass("hide");
//        $(".consult_loading img").removeClass("result").attr("src","img/loading.gif");
//        $(".consult_loading p").text("正在关注");
//    },500);
//}
//function fail(){
//    $(".consult_loading p").text("关注失败");
//    $(".consult_loading img").addClass("result").attr("src","img/fail@2x.png");
//    setTimeout(function(){
//        $(".footer button").removeAttr("disabled");
//        $(".consult_loading").addClass("hide");
//        $(".consult_loading img").removeClass("result").attr("src","img/loading.gif");
//        $(".consult_loading p").text("正在关注");
//    },500);
//}
//function clickFocus(){
//    var focusid = $(".doctor_box").attr("userid");
//    var type = $(".doctor_box").attr("type");
//    var name = $(".doctor_box .doctor_info p:nth-of-type(1) span").text();
//    $(".consult_loading").removeClass("hide");
//    $(this).attr("disabled","disabled");
//    createFocus(focusid,name,type);
//}