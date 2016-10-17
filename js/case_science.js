$(function(){
    if (getUrlParam("userid") && getUrlParam("token")){
        updateLogin();
    }
    getUser(function(){
        getData();
    });
    if (isWx){
        getWx();
    }
});
$("header .back").on("click",function(){
    history.back();
});
$("section").on("click",".case_list .text p:nth-of-type(1),.case_list .text p:nth-of-type(2)", function () {
    var videoId = $(this).parent().parent().attr("videoid");
    createQuestionId(videoId);
    location.href = "case_details.html"+location.search;
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
})
$(".bottom div:nth-of-type(1)").on("click", function () {
    location.href = "http://www.11deyi.com/Api/Weixin/profile?type=ASK";
});
$(".bottom div:nth-of-type(2)").on("click", function () {
    location.href = "http://www.11deyi.com/Api/Weixin/profile?type=DS";
});
$(".bottom div:nth-of-type(3)").on("click", function () {
    location.href = "http://www.11deyi.com/Api/Weixin/profile?type=MD";
});
//$(window).on("scroll", function () {
//    // console.log($("body").height())
//    //console.log($(this).scrollTop()+$(this).height());
//    if ($(this).scrollTop()+$(this).height() >= $(document).height() ){
//        console.log("到达底部");
//    }
//});
$("section").on("click",".case_list .top p:nth-child(1),.case_list .top p:nth-of-type(2)", function () {
    var userid = $(this).parent().attr("userid");
    goToHomePage(userid);
});
$(".header button:nth-of-type(1)").on("click", function () {
    location.href = "department_list.html"+location.search;
});
$("footer button").on("click", function () {
    var self = this;
    $(this).find("img").removeClass("hide");
    $(this).find("span").addClass("hasImg").text("加载中");
    pageindex++;
    getData(function(){
        $(self).find("img").addClass("hide");
        $(self).find("span").removeClass("hasImg").text("点击加载更多");
    });
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
function getData(callback){

    //var token = "NzVmNmFkMTYtZmQ0MC0xMWU1LWE4Y2UtYWE1MTk0ZjUwZTY2LDE4MDMwNDk4MzMwLDMzYTBiY2FjLWM5ZjQtNDBkYy1hNjRjLWY3NDIzM2UyMGE4YSw4aVQ0ZjVQQUd0Z3pKUkhVeVN0dTN3TGxyWmtIY3o1dg==";
    $.ajax({
        url:ebase+"/api/Admin/Video/QueryVideoListForHomeByUserId",
        type:"POST",
        data:{"appToken":getUrlParam("token"),"para":{
            "device_type":"PC",
            "device_id":" ",
            "api_version":"1.0.0.0",
            pageindex:pageindex,
            pagesize:pagesize
        }},
        dataType:"json",
        success:function(data){
            if (!$(".list_loading").hasClass("hide")){
                $(".list_loading").addClass("hide");
                $("footer").removeClass("hide");
            }
            console.log(data);
            if (data.Code === "0000"){
                var Data = data.Data.Rows;
                for (var i = 0; i < Data.length; i++){
                    //console.log(i)
                    var ele = "<div class='case_list' videoid='"+Data[i].VideoId+"'>" +
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
                    //console.log(Data[i].Description.indexOf("\n") >= 0);
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
                                //console.log("only")
                                image = "<div class='onlyImage'><figure itemscope itemtype='1'><a id='minimg"+0+i+"' href='"+Data[i].Pics[0]+"' itemprop='contentUrl' data-size='"+imgwh+"'><img src='"+Data[i].Pics[0]+"' itemprop='thumbnail' alt='Image description' /></a><figcaption itemprop='caption description'>1</figcaption></figure></div>"
                                var url = Data[i].Pics[0];
                                var k2=0+""+i;
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
                            for (var j = 0; j < Data[i].Pics.length; j++){
                                image += "<figure itemscope itemtype='1'><a id='minimg"+j+i+"' href='"+Data[i].Pics[j]+"' itemprop='contentUrl' data-size='"+imgwh+"'><img src='"+Data[i].Pics[j]+"' itemprop='thumbnail' alt='Image description'/></a><figcaption itemprop='caption description'>"+(j+1)+"</figcaption></figure>";
                                var url = Data[i].Pics[j];
                                var k2=j+""+i;
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
                    $("section").append(ele)
                    if (Data[i].AuthorFaceImgUrl){
                        //console.log(parseInt((pageindex-1)*pagesize+(i+1)));
                        $("section .case_list:nth-of-type("+parseInt((pageindex-1)*pagesize+(i+2))+") .top p:nth-child(1)").css("background_image","url('"+Data[i].AuthorFaceImgUrl+"')");
                    }
                    var Height = $("section .case_list:nth-of-type("+parseInt((pageindex-1)*pagesize+(i+2))+") .text p:nth-of-type(2)").height();
                    //var lineHeight = parseInt($("section .case_list:nth-of-type("+parseInt((pageindex-1)*pagesize+(i+1))+") .text p:nth-of-type(2)").css("line-height"));
                    //console.log("第"+parseInt((pageindex-1)*pagesize+(i+1))+"个:"+ Height/lineHeight);
                    if ( Height <= 120){
                        $("section .case_list:nth-of-type("+parseInt((pageindex-1)*pagesize+(i+2))+") .text p:nth-of-type(3)").addClass("hide")
                    }else {
                        $("section .case_list:nth-of-type("+parseInt((pageindex-1)*pagesize+(i+2))+") .text p:nth-of-type(2)").css("display","-webkit-box");
                    }
                    if (Data[i].UserIsFocus === "Y"){
                        $("section .case_list:nth-of-type("+parseInt((pageindex-1)*pagesize+(i+2))+") .top p:nth-of-type(3)").hide();
                    }
                    //console.log("第"+i+"个的类型:"+Data[i].Type)
                }
                initPhotoSwipeFromDOM('.my-simple-gallery');
                if (pageindex !== 1){
                    callback();
                }
                $("body,html").css("height","auto");
            }
        },
        error: function (xhr ,errorType ,error) {
            //alert("错误")
            console.log(xhr)
            console.log(errorType)
            console.log(error)
        }
    });
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
        wx.onMenuShareTimeline({
            title:'专注传播医学实用经验，每天更新医学健康知识，是你健康生活的好帮手。',
            link:location.href,
            imgUrl:'http://yydy.image.alimmdn.com/source/7F79A0F3-0052-4AD5-AFBB-E5D64B9D4840',
            success:function(){

            },
            cancel: function () {

            }
        });
        //分享给朋友
        wx.onMenuShareAppMessage({
            title: '专注传播医学实用经验。', // 分享标题
            desc: '每天更新医学健康知识，是你健康生活的好帮手。', // 分享描述
            link: location.href, // 分享链接
            imgUrl: 'http://yydy.image.alimmdn.com/source/7F79A0F3-0052-4AD5-AFBB-E5D64B9D4840', // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
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
                $("section .case_list .top").each(function(index,item){
                    if ($(this).attr("userid") === focusedid){
                        $(this).find("p:nth-of-type(3)").hide();
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