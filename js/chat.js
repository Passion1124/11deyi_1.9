var user = {};
$(function () {
    if (!official){
        WebIM.config.appkey = 'cd11deyi#yydytest';
    }
    if (isAndroid){
        $(".chat .footer .add span").css("line-height","2.8rem");
    }
    var uiid = getUiid(localStorage.hxuser);
    if (uiid && uiid !==  "undefined"){
        getUserData();
    }
    //alert(getRouterParam("userid"))
    if (getRouterParam("id")){
        $(".chat").removeClass("hide");
        resizeSectionHeight();
        hx();
        chatShow();
        var chatUser = user[getRouterParam('id')];
        if (chatUser){
            $(".chat header .title").text(chatUser.name);
            $("head title").text(chatUser.name);
        }
    }else {
        $(".message").removeClass("hide");
        if (getUrlParam("userid") && getUrlParam("token")){
            updateLogin();
        }
        getUser(function(){
            uiid = getUiid(localStorage.hxuser);
            if (uiid && uiid !==  "undefined"){
                getUserData();
            }
            hx();
            createList();
        });
        if(!!getLocalStroagelogin().token){
            HideShare();
        }
        $("html,body").css("height","auto")
    }
});
function  HideShare(){
    var paraData={"appToken":getLocalStroagelogin().token,
        "para":{
            "device_type":"PC",
            "device_id":" ",
            "api_version":"1.0.0.0",
            "url":location.href
        }};
    $.ajax({
        url: ebase+"/api/Sign/GetJsTicket",
        type:"POST",
        data:paraData,
        dataType:"json",
        success:function(data){
            var Data = data.Data;
            if (data.Code === "0000"){
                WxLicense(Data.appId,Data.timestamp,Data.nonceStr,Data.ticket);
            }
        },
        error: function (xhr ,errorType ,error) {
            //alert("数据错误！请刷新页面！")
            console.log(xhr)
            console.log(errorType)
            console.log(error)
        }
    });
}
//授权
function WxLicense(aId,times,nonce,ticket){
    wx.config({
        debug: false,
        appId: aId,
        timestamp: times,
        nonceStr: nonce,
        signature: ticket,
        jsApiList:[
            'checkJsApi',
            'hideMenuItems',
            'hideAllNonBaseMenuItem',
            'hideOptionMenu'
            ]
    });

    wx.ready(function () {
        wx.hideMenuItems({
            menuList: [
                'menuItem:share:timeline',
                'menuItem:share:qq',
                'menuItem:share:weiboApp',
                'menuItem:share:QZone',
                'menuItem:share:facebook',
                'menuItem:favorite'
            ], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
            success: function () {
                console.log('已隐藏“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
            }
        });
        wx.hideOptionMenu();
        wx.hideAllNonBaseMenuItem();
    });
}

$(window).on("resize", function () {
    resizeSectionHeight();
});
$(".message .top div:nth-of-type(1),.message .bottom div:nth-of-type(3)").on("click", function () {
    location.href = "http://www.11deyi.com/"+Api+"/Weixin/profile?type=MD";
});
$(".message .top div:nth-of-type(2)").on("click", function () {
    location.href = "department_list.html"
});
$(".message .bottom div:nth-of-type(2)").on("click", function () {
    location.href = "http://www.11deyi.com/"+Api+"/Weixin/profile?type=DS";
});
$(".chat section").on("click",".other", function () {
    var qid = $(this).attr("qid");
    var token = getLocalStroagelogin().token;
    location.href = "disease_details.html?id="+qid+"&token="+token;
});
function getUserData(){
    user = {};
    var uiid = getUiid(localStorage.hxuser);
    //console.log(uiid);
    for (var i = 0; i < uiid.length; i++){
        var info = getChatUserInfo(uiid[i]);
        if (info){
            user[uiid[i]] = {name:info.name,docid:info.docid,url:info.url,unread:localStorage[uiid[i]+"_unread"]};
        }else {
            var chat = getChatId(uiid[i]);
            for (var j = 0; j < chat.length; j++){
                var message = getMessage(chat[j]);
                if (message.ext){
                    if (message.ext.show_ext){
                        if (message.ext.show_ext !== "Y"){
                            user[uiid[i]] = {name:message.ext.extra_user_name,docid:message.ext.extra_user_app_id,url:message.ext.extra_user_avater,unread:localStorage[message.from+"_unread"]};
                            break;
                        }
                    }else {
                        user[uiid[i]] = {name:message.ext.extra_user_name,docid:message.ext.extra_user_app_id,url:message.ext.extra_user_avater,unread:localStorage[message.from+"_unread"]};
                        break;
                    }
                }
                else {
                    //console.log(message.to)
                    var userInfo = getChatUserInfo(message.to);
                    //console.log(info)
                    var name = undefined;
                    var url = "http://www.11deyi.com/img/30.png";
                    var docid = "";
                    if (userInfo){
                        name = userInfo.name;
                        url = userInfo.url;
                        docid = userInfo.docid;
                    }
                    //console.log(name);
                    //console.log(url);
                    user[uiid[i]] = {name:name,url:url,unread:localStorage[message.to+"_unread"],docid:docid};
                    break;
                }
            }
        }
    }
}
function createList(){
    $(".message_list").empty();
    //console.log(user);
    var list = 0;
    for (var a in user){
        //alert(a)
        var chat = getChatId(a)
        var message = getMessage(chat[chat.length - 1]);
        //console.log(message);
        var timeText = getChatTime(message);
        var backUrl = "http://www.11deyi.com/img/30.png";
        if (user[a].url){
            backUrl = user[a].url;
        }
        var unread = "";
        var unreadEle = "";
        if (user[a].unread && parseInt(user[a].unread) !== 0){
            unread = user[a].unread;
            unreadEle = "<span>"+unread+"</span>";
            if (parseInt(unread) > 9){
                $(".message .message_list .list").eq(list).find(".head_portrait span").css("padding",".33rem .45rem");
            }
            list++;
        }
        var infoText = "";
        if (message.data){
            var data = message.data;
            if (message.data.indexOf("<div>") !== -1){
                data = message.data.substring(0,message.data.indexOf("<div>"));
            }
            infoText = data
        }else {
            //console.log(message.length)
            if (message.length){
                infoText = "[语音]"
            }else {
                infoText = "[图片]"
            }
        }
        var ele = "<div class='list' hxid='"+a+"'>" +
            "<div class='head_portrait' style='background-image: url("+backUrl+")'>"+unreadEle+"</div>" +
            "<div class='info'>" +
            "<p>"+user[a].name+"</p>" +
            "<p>"+infoText+"</p>" +
            "</div>" +
            "<div class='message_time'>"+timeText+"</div>" +
            "</div>";
        $(".message_list").append(ele);
    }
}
var audioLength = 0;
function chatShow(){
    $(".chat section").empty();
    if (!localStorage[getRouterParam('id')]){
        return ;
    }
    var chat = getChatId(getRouterParam("id"));
    for (var i = 0; i < chat.length; i++){
        //console.log(chat);
        //console.log(i)
        var message = getMessage(chat[i]);
        //console.log(message);
        if (message.from === getRouterParam("id")){
            if (!message.url){
                if (message.ext.show_ext === "Y"){
                    var msg = message.ext.ext_bl.msg.split(/\n/);
                    var ele = "<div class='head_portrait'></div>" +
                        "<div class='content other' qid='"+message.ext.ext_bl.qid+"'>" +
                        "<p>"+msg[0]+"</p>" +
                        "<p>"+msg[1]+"</p>" +
                        "<p>"+msg[2]+"</p>" +
                        "<p>"+msg[3]+"</p>" +
                        "<p>"+msg[4]+"</p>" +
                        "<p>"+msg[5]+"</p>" +
                        "<p>"+msg[6]+"</p>" +
                        "<p>"+msg[7]+"</p>" +
                        "<p>"+msg[8]+"</p>" +
                        "<p>"+msg[9]+"</p>" +
                        "<div class='check_details'>查看详情</div>" +
                        "</div>";
                }else {
                    //console.log(message.ext.ext_bl_sheet)
                    if (message.ext.ext_bl_sheet){
                        var ele = "<div class='head_portrait'></div>" +
                            "<div class='content write'>" +
                            "<div class='write_case'>" +
                            "<div class='bg_img'></div>" +
                            "<p>请填写病例</p>" +
                            "<p>只有通过完整病历信息了解你的病情后，才能通过微信更准确的回复你。</p></div>" +
                            "<div class='write_btm' docid='"+message.ext.extra_user_app_id+"'><p>填写新病历</p><p>选择已有病历</p></div></div>";
                    }else {
                        var data = message.data.replace(/\n/g,"<br>");
                        var ele = "<div class='head_portrait'></div><div class='content'>"+data+"</div>"
                    }
                }
            }else {
                if (!message.length){
                    var imgwh = "1080x1920";
                    var content = "<div class='head_portrait'></div><div class='content imgBox'><figure itemscope itemtype='1'><a id='minimg"+0+i+"' href='"+message.url+"' itemprop='contentUrl' data-size='"+imgwh+"'><img src='"+message.url+"'  alt='此图片已过期' itemprop='thumbnail' alt='Image description' /></a><figcaption itemprop='caption description'>1</figcaption></figure></div>"
                    var ele = '<div class="Pics my-simple-gallery" itemscope itemtype="http://schema.org/ImageGallery">'+content+'</div>'
                    var url = message.url;
                    var k2=0+""+i;
                    getImageWidth(url,k2,function(w,h,x){
                        setTimeout(function () {
                            var imgwh2=w+"x"+h;
                            $("#minimg"+x).attr("data-size",imgwh2);
                        },200)
                    });
                }else {
                    var audioUrl = "";
                    blobObj.getBlob(message.url, function (blob) {
                        audioUrl = URL.createObjectURL(blob);
                        $(".chat .left .audio").eq(audioLength).attr("audio",audioUrl);
                        $(".chat .left .audio").eq(audioLength).find("audio").attr("src",audioUrl);
                        audioLength++;
                    });
                    var ele ="<div class='head_portrait'></div><div class='content audio"+(message.isRead===false?" isRead":"")+"' audio='"+audioUrl+"'><audio src='"+audioUrl+"'></audio><img src='img/chatyy.png' alt=''></div><span>"+message.length+"’’</span><span class='dot'></span>"
                }
            }
            var html = "<div class='left'>"+ele+"</div>"
            $(".chat section").append(html);
        }else {
            if (!message.url){
                if (message.ext){
                    if (message.ext.show_ext === "Y"){
                        var msg = message.ext.ext_bl.msg.split(/\n/);
                        var ele = "<div class='head_portrait'></div>" +
                            "<div class='content other' qid='"+message.ext.ext_bl.qid+"'>" +
                            "<p>"+msg[0]+"</p>" +
                            "<p>"+msg[1]+"</p>" +
                            "<p>"+msg[2]+"</p>" +
                            "<p>"+msg[3]+"</p>" +
                            "<p>"+msg[4]+"</p>" +
                            "<p>"+msg[5]+"</p>" +
                            "<p>"+msg[6]+"</p>" +
                            "<p>"+msg[7]+"</p>" +
                            "<p>"+msg[8]+"</p>" +
                            "<p>"+msg[9]+"</p>" +
                            "<div class='check_details'>查看详情</div>" +
                            "</div>";
                    }else {
                        var ele = "<div class='head_portrait'></div><div class='content'>"+message.data+"</div>"
                    }
                }else {
                    var ele = "<div class='head_portrait'></div><div class='content'>"+message.data+"</div>"
                }
            }else {
                var imgwh = "1080x1920";
                var content = "<div class='head_portrait'></div><div class='content imgBox'><figure itemscope itemtype='1'><a id='minimg"+0+i+"' href='"+message.url+"' itemprop='contentUrl' data-size='"+imgwh+"'><img src='"+message.url+"'  alt='此图片已过期' itemprop='thumbnail' alt='Image description' /></a><figcaption itemprop='caption description'>1</figcaption></figure></div>"
                var url = message.url;
                var k2=0+""+i;
                var ele = '<div class="Pics my-simple-gallery" itemscope itemtype="http://schema.org/ImageGallery">'+content+'</div>'
                getImageWidth(url,k2,function(w,h,x){
                    setTimeout(function () {
                        var imgwh2=w+"x"+h;
                        $("#minimg"+x).attr("data-size",imgwh2);
                    },200)
                });
            }
            var html = "<div class='right'>"+ele+"</div>";

            $(".chat section").append(html);
        }
    }
    initPhotoSwipeFromDOM('.my-simple-gallery');
    $(".right .head_portrait").css("background-image","url('"+getLocalStroagelogin().faceimg+"')");
    var leftUrl = "http://www.11deyi.com/img/30.png";
    if (user[getRouterParam("id")].url){
        leftUrl = user[getRouterParam("id")].url;
    }
    var docid = undefined;
    if (user[getRouterParam("id")].docid){
        docid = user[getRouterParam("id")].docid;
    }
    $(".left .head_portrait").css("background-image","url('"+leftUrl+"')").attr("docid",docid);
    if ($(".chat section img").length != 0){
        $(".chat section img").load(function(){
            goBottom();
        })
    }
    goBottom();
}

$(window).bind('hashchange', function() {
    var hashId = getRouterParam("id");
    if (hashId){
        $(".chat").removeClass("hide");
        $(".message").addClass("hide");
        $("head title").text(user[getRouterParam("id")].name);
        $("html,body").css("height","100%")
    }else {
        createList();
        $("head title").text("咨询医生");
        $(".chat").addClass("hide");
        $(".message").removeClass("hide");
        $("html,body").css("height","auto")
    }
});
$(".chat section").on("click",".write_btm p:nth-of-type(1)", function () {
    location.href = "add_case.html?userid="+getLocalStroagelogin().userid +"&hxid="+getRouterParam("id")+"&docid="+$(this).parent().attr("docid")+"#add_case";
});
$(".chat section").on("click",".write_btm p:nth-of-type(2)", function () {
    location.href = "add_case.html?userid="+getLocalStroagelogin().userid +"&hxid="+getRouterParam("id")+"&docid="+$(this).parent().attr("docid");
});
$(".chat .btm p:nth-of-type(1)").on("click", function () {
    var docid = "";
    if ($(".write_btm").attr("docid")){
        docid = $(".write_btm").attr("docid")
    }else {
        if (user[getRouterParam("id")]){
            docid = user[getRouterParam("id")].docid;
        }else {
            docid = JSON.parse(localStorage[getRouterParam("id")+"_info"]).docid;
        }
    }
    location.href = "add_case.html?userid="+getLocalStroagelogin().userid +"&hxid="+getRouterParam("id")+"&docid="+docid;
});
$(".chat section").on("click",".left .head_portrait", function () {
    var docid = $(this).attr("docid");
    location.href = 'http://www.11deyi.com/Api/Weixin/profile?id='+docid+'&type=SHARE';
})
$(".chat section").on("click",".audio", function () {
    var self = this;
    var idx=$(this).parent().index();
    var chat = getChatId(getRouterParam("id"));
    var c=JSON.parse(localStorage.getItem(chat[idx]));
    c.isRead=true;
    localStorage.setItem(chat[idx],JSON.stringify(c));
    var audioSrc = $(this).attr("audio");
    var onplay=$(".chat section .audio_play");
    $(this).removeClass('isRead');
    if (onplay.length !== 0 && !$(this).hasClass("audio_play")){
        onplay.find("audio").get(0).pause();
        onplay.find("img").attr("src","img/chatyy.png");
        onplay.removeClass("audio_play");
    }
    $(this).toggleClass("audio_play");
    $(this).find("audio").on("ended", function () {
        $(self).find("img").attr("src","img/chatyy.png");
        $(self).removeClass("audio_play");
    });
    if ($(this).hasClass("audio_play")){
        //var scroll=$(this).offset().top;
        $(this).find("audio").attr("src","");
        $(this).find("audio").attr("src",audioSrc);
        $(this).find("audio").get(0).play();
        $(this).find("img").attr("src","img/chatyy.gif");
        //$('.chat section').scrollTop(scroll);
    }else {
        $(this).find("audio").get(0).pause();
        $(this).find("img").attr("src","img/chatyy.png");
    }
});
$(".chat").on("input",".footer .text", function () {
    var textHeight = $(this).height();
    var textLineHeight = parseInt($(this).css("line-height"))*parseInt($("body").css("font-size"));
    if (isAndroid){
        if (parseInt(textHeight/textLineHeight) > 1){
            resizeSectionHeight();
        }
    }
    if (parseInt(textHeight/textLineHeight) > 1){
        $(".chat .footer .text").css("line-height","1.8rem")
    }else {
        $(".chat .footer .text").css("line-height","1.5rem")
    }
    if ($(this).text()){
       $(".footer button").removeClass("hide");
       $(".footer .add").addClass("hide");
    }else {
       $(".footer button").addClass("hide");
       $(".footer .add").removeClass("hide");
    }
    //resizeSectionHeight();
    goBottom();
});

function goBottom(){
    if ($(".chat section div:last-of-type").hasClass("left")){
        leftTop()
    }else if ($(".chat section div:last-of-type").hasClass("right")){
        rightTop();
    }
}
function resizeSectionHeight(){
    var windowHeight = $(window).height();
    var headerHeight = $(".chat header").height();
    var footerHeight = $(".chat .footer").height();
    var btmHeight = $(".chat .btm").height();
    $(".chat section").height(windowHeight - headerHeight - footerHeight - btmHeight)
}
function rightTop(){
    var lastDivTop = $(".chat section").find(".right:last-of-type").offset().top;
    var docHeight = $(document).height();
    var scrollTop = $(".chat section").scrollTop();
    $(".chat section").scrollTop(lastDivTop+scrollTop+docHeight);
}
function leftTop(){
    var lastDivTop = $(".chat section").find(".left:last-of-type").offset().top;
    var docHeight = $(document).height();
    var scrollTop = $(".chat section").scrollTop();
    $(".chat section").scrollTop(lastDivTop+scrollTop+docHeight);
}

$(".footer button").on("click", function () {
    var text = $(".footer .text").html();
    text = text.replace(/&nbsp;/g,"");
    //console.log(text);
    if(text && text !== " "){
        text = $(".footer .text").html().replace(/&nbsp;/g," ");
        sendText(text);
        $(".footer .text").text("");
    }else {
        alert("不能发送空白消息");
    }
    if (isAndroid){
        resizeSectionHeight();
    }
    $(".footer button").addClass("hide");
    $(".footer .add").removeClass("hide");
});

//$(".footer .getImage input").on("change", function () {
//    sendImage();
//    $(this).val("");
//});
$(".chat .btm p:nth-of-type(2) input").on("change", function () {
    sendImage();
    $(this).val("");
})
$(".chat .footer .add").on("click", function () {
    $(".chat .btm").toggleClass("hide");
    resizeSectionHeight();
    goBottom();
});
$(".chat .footer .text").on("focus", function () {
    $(".chat .btm").addClass("hide");
    resizeSectionHeight();
    if (!isAndroid){
        setTimeout(function () {
            $("body").scrollTop($("body")[0].scrollHeight);
        },100)
    }
})
//$(".chat .footer .text").on("blur", function () {
//    if (!isAndroid){
//        $(".footer").css("top","0");
//    }
//});
$(".message .message_list").on("click",".list", function () {
    audioLength = 0;
    $(".message").addClass("hide");
    $(".chat").removeClass("hide");
    resizeSectionHeight();
    window.location = "#id="+$(this).attr("hxid");
    user[$(this).attr("hxid")].unread = 0;
    localStorage[$(this).attr("hxid")+"_unread"] = 0;
    var title = user[getRouterParam('id')].name;
    $("head title").text(title);
    $(".chat header .title").text(title);
    chatShow();
    HideShare();
});
$(".chat header .back").on("click", function () {
    history.back();
    createList();
    $("head title").text("咨询医生")
});
/*---------------------------环信------------------------------------------------------*/
var conn;
function hx(){
     conn = new WebIM.connection({
        isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
        https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
        url: WebIM.config.xmppURL,
        isAutoLogin: false
    });
    WebIM.Emoji = {
        path: 'demo/images/faces/' /*表情包路径*/
        , map: {
            '[):]': 'ee_1.png',
            '[:D]': 'ee_2.png',
            '[;)]': 'ee_3.png',
            '[:-o]': 'ee_4.png',
            '[:p]': 'ee_5.png'
        }
    }
    conn.listen({
        onOpened: function ( message ) {          //连接成功回调
            //如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
            console.log(message);
            //alert("环信登陆成功");
            conn.setPresence();
            if (localStorage.send && getChatSend().state && getChatSend().hxid === getRouterParam("id")){
                sendText("有患者求助",getChatSend())
            }
        },
        onClosed: function ( message ) {},         //连接关闭回调
        onTextMessage: function ( message ) {
            console.log(message);
            var newMessage = message;
            if (message.delay){
                newMessage.time = Date.parse(message.delay)
            }else {
                newMessage.time = new Date().getTime()
            }
            createMessageId(message.id,newMessage);
            createChatId(message.from,message.id);
            createMeId(message.to,message.from);
            updateChatUserInfo(message);
            getUserData();
            if (message.from === getRouterParam("id")){
                if (message.ext.show_ext !== "Y"){
                    if (message.ext.ext_bl_sheet){
                        var html = "<div class='left'>" +
                            "<div class='head_portrait'></div>" +
                            "<div class='content write'>" +
                            "<div class='write_case'>" +
                            "<div class='bg_img'></div>" +
                            "<p>请填写病例</p>" +
                            "<p>只有通过完整病历信息了解你的病情后，才能通过微信更准确的回复你。</p></div>" +
                            "<div class='write_btm' docid='"+message.ext.extra_user_app_id+"'><p>填写新病历</p><p>选择已有病历</p></div></div>" +
                            "</div>"
                    }else {
                        var data = message.data.replace(/\n/g,"<br>");
                        var html = "<div class='left'>" +
                            "<div class='head_portrait'></div>" +
                            "<div class='content'>"+data+"</div></div>";
                    }
                    $(".chat section").append(html);
                }else {
                    var msg = message.ext.ext_bl.msg.split(/\n/);
                    console.log(msg);
                    var html = "<div class='left'>" +
                        "<div class='head_portrait'></div>" +
                        "<div class='content other' qid='"+message.ext.ext_bl.qid+"'>" +
                        "<p>"+msg[0]+"</p>" +
                        "<p>"+msg[1]+"</p>" +
                        "<p>"+msg[2]+"</p>" +
                        "<p>"+msg[3]+"</p>" +
                        "<p>"+msg[4]+"</p>" +
                        "<p>"+msg[5]+"</p>" +
                        "<p>"+msg[6]+"</p>" +
                        "<p>"+msg[7]+"</p>" +
                        "<p>"+msg[8]+"</p>" +
                        "<p>"+msg[9]+"</p>" +
                        "<div class='check_details'>查看详情</div>" +
                        "</div></div>";
                    $(".chat section").append(html);
                }
                leftTop();
                if (user[getRouterParam('id')]){
                    var leftUrl = "http://www.11deyi.com/img/30.png";
                    if (user[getRouterParam("id")].url){
                        leftUrl = user[getRouterParam("id")].url;
                        console.log(leftUrl);
                    }
                    $(".left .head_portrait").css("background-image","url('"+leftUrl+"')");
                }
            }else {
                createChatUnread(message.from);
            }
            getUserData();
            createList();
        },    //收到文本消息
        onEmojiMessage: function ( message ) {},   //收到表情消息
        onPictureMessage: function ( message ) {
            console.log(message);
            var newMessage = message;
            if (message.delay){
                newMessage.time = Date.parse(message.delay)
            }else {
                newMessage.time = new Date().getTime()
            }
            createMessageId(message.id,newMessage);
            createChatId(message.from,message.id);
            createMeId(message.to,message.from);
            updateChatUserInfo(message);
            getUserData();
            if (message.from === getRouterParam("id")){
                var length = $(".chat section img").length;
                var imgwh = "1080x1920";
                var updataImg = message.url;
                var content = "<div class='head_portrait'></div><div class='content imgBox'><figure itemscope itemtype='1'><a id='minimg"+0+length+"' href='"+updataImg+"' itemprop='contentUrl' data-size='"+imgwh+"'><img src='"+updataImg+"' alt='此图片已过期' itemprop='thumbnail' alt='Image description' /></a><figcaption itemprop='caption description'>1</figcaption></figure></div>"
                var ele = '<div class="Pics my-simple-gallery" itemscope itemtype="http://schema.org/ImageGallery">'+content+'</div>'
                var url = updataImg;
                var k2= "0"+length;
                getImageWidth(url,k2,function(w,h,x){
                    setTimeout(function () {
                        var imgwh2=w+"x"+h;
                        $("#minimg"+x).attr("data-size",imgwh2);
                    },200)
                });
                console.log("成功");
                var html = "<div class='left'>"+ele+"</div>";
                $(".chat section").append(html);
                $(".chat section .right").each(function (item,index) {
                    $(this).find(".head_portrait").css("background-image","url('"+getLocalStroagelogin().faceimg+"')");
                });
                initPhotoSwipeFromDOM('.my-simple-gallery');
                leftTop();
                var leftUrl = "http://www.11deyi.com/img/30.png";
                if (user[getRouterParam("id")].url){
                    leftUrl = user[getRouterParam("id")].url;
                }
                $(".left .head_portrait").css("background-image","url('"+leftUrl+"')");
            }else {
                createChatUnread(message.from);
            }
            getUserData();
            createList();
        }, //收到图片消息
        onCmdMessage: function ( message ) {},     //收到命令消息
        onAudioMessage: function ( message ) {
            console.log(message);
            var newMessage = message;
            if (message.delay){
                newMessage.time = Date.parse(message.delay)
            }else {
                newMessage.time = new Date().getTime()
            }
            var options = { url: message.url };

            options.onFileDownloadComplete = function ( response ) {
                //音频下载成功
                console.log(options);
                blobObj.setBlob(response, function (data) {
                    newMessage.url = data;
                    newMessage.isRead=false;
                    createMessageId(message.id,newMessage);
                    createChatId(message.from,message.id);
                    createMeId(message.to,message.from);
                    updateChatUserInfo(message);
                    getUserData();
                    createList();
                });
                var audioUrl = URL.createObjectURL(response);
                //console.log(audioUrl);
                if (message.from === getRouterParam("id")){
                    var html = "<div class='left'><div class='head_portrait'></div><div class='content audio isRead' audio='"+audioUrl+"'><audio src='"+audioUrl+"'></audio><img src='img/chatyy.png' alt=''></div><span>"+message.length+"’’</span><span class='dot'></span></div>";
                    $(".chat section").append(html);
                    var leftUrl = "http://www.11deyi.com/img/30.png";
                    if (user[getRouterParam("id")].url){
                        leftUrl = user[getRouterParam("id")].url;
                    }
                    $(".left .head_portrait").css("background-image","url('"+leftUrl+"')");
                    goBottom();
                }else {
                    createChatUnread(message.from);
                }
                getUserData();
                createList();
            };
            options.onFileDownloadError = function () {
                //音频下载失败
                console.log("音频下载失败");
            };

            //通知服务器将音频转为mp3
            options.headers = {
                'Accept': 'audio/mp3'
            };

            WebIM.utils.download.call(conn, options);
        },   //收到音频消息
        onLocationMessage: function ( message ) {},//收到位置消息
        onFileMessage: function ( message ) {},    //收到文件消息
        onVideoMessage: function ( message ) {},   //收到视频消息
        onPresence: function ( message ) {},       //收到联系人订阅请求、处理群组、聊天室被踢解散等消息
        onRoster: function ( message ) {},         //处理好友申请
        onInviteMessage: function ( message ) {},  //处理群组邀请
        onOnline: function () {},                  //本机网络连接成功
        onOffline: function () {},                 //本机网络掉线
        onError: function ( message ) {
            console.log(message);
            conn.open(options);
        },           //失败回调
        onReceivedMessage:function(message){
            console.log(message);
        }
    });

    var options = {
        apiUrl: WebIM.config.apiURL,
        user: localStorage.hxuser,
        pwd: localStorage.hxpwd,
        appKey: WebIM.config.appkey
    };
    conn.open(options);
}

function sendText(text,send){
    var id = conn.getUniqueId();//生成本地消息id
    var msg = new WebIM.message('txt', id);//创建文本消息
    if (send){
        var sex = "男";
        if (send.Sex === "W"){
            sex = "女";
        }
        var sendText = send.UserName+"的病历信息\n性别："+sex+"\n年龄："+send.Age+"\n联系电话："+send.Phone+"\n就诊时间："+send.VisitingTime+"\n就诊卡ID/编号："+send.CardNumber+"\n首发症状时间："+send.FirstVisitingTime+"\n患病疼痛部位："+send.PatientAddr+"\n诊断结果："+send.CureInfo+"\n治疗情况："+send.CheckInfo;
    }
    //alert(localStorage.hxuser);
    msg.set({
        msg: text,
        to: getRouterParam('id'),
        success: function ( id,serverMsgId ) {
            console.log(id);
            console.log(serverMsgId);
            if (send){
                var myText = sendText.split("\n");
                //console.log(myText)
                var html = "<div class='right'>" +
                    "<div class='head_portrait'></div>" +
                    "<div class='content other' qid='"+send.QuestionID+"'>" +
                    "<p>"+myText[0]+"</p>" +
                    "<p>"+myText[1]+"</p>" +
                    "<p>"+myText[2]+"</p>" +
                    "<p>"+myText[3]+"</p>" +
                    "<p>"+myText[4]+"</p>" +
                    "<p>"+myText[5]+"</p>" +
                    "<p>"+myText[6]+"</p>" +
                    "<p>"+myText[7]+"</p>" +
                    "<p>"+myText[8]+"</p>" +
                    "<p>"+myText[9]+"</p>" +
                    "<div class='check_details'>查看详情</div>" +
                    "</div></div>";
                var mysend = getChatSend();
                mysend.state = false;
                localStorage.send = JSON.stringify(mysend);
            }else {
                var html = "<div class='right'>" +
                    "<div class='head_portrait'></div>" +
                    "<div class='content'>"+text+"</div></div>";
            }
            $(".chat section").append(html);
            $(".chat section .right").each(function (item,index) {
                $(this).find(".head_portrait").css("background-image","url('"+getLocalStroagelogin().faceimg+"')");
            });
            rightTop();
            var data = {
                data:text,
                from:localStorage.hxuser,
                to:getRouterParam('id'),
                id:serverMsgId,
                type:"chat",
                time:new Date().getTime()
            };
            if (send){
                data.ext = {
                    extra_user_name : getLocalStroagelogin().name,
                    extra_user_avater : getLocalStroagelogin().faceimg,
                    show_ext : "Y",
                    ext_bl : {msg:sendText,qid:send.QuestionID,uid:getLocalStroagelogin().userid},
                    extra_user_app_id : getLocalStroagelogin().userid
                }
            }
            createMessageId(serverMsgId,data);
            createChatId(getRouterParam('id'),serverMsgId);
            createMeId(localStorage.hxuser,getRouterParam('id'));
            getUserData();
            createList();
        }//消息发送成功回调
    });
    var newText = text.replace(/<div>/g,"\n").replace(/<br>/g," ");
    var divLength = newText.split("</div>");
    for (var i = 0; i < divLength.length; i++){
        newText = newText.replace("</div>"," ");
    }
    msg.body.msg = newText;
    msg.body.ext.extra_user_name = getLocalStroagelogin().name;
    msg.body.ext.extra_user_avater = getLocalStroagelogin().faceimg;
    msg.body.ext.extra_user_app_id = getLocalStroagelogin().userid;
    if (send){
        msg.body.ext.show_ext = "Y";
        msg.body.ext.ext_bl = {msg:sendText,qid:send.QuestionID,uid:getLocalStroagelogin().userid};
    }
    conn.send(msg.body);
}
function sendImage(){
    var length = $(".chat section img").length + 1;
    $(".chat section").append("<div class='right'><div class='Pics my-simple-gallery' itemscope itemtype='http://schema.org/ImageGallery'>"+
        "<div class='head_portrait' style='background-image:url("+getLocalStroagelogin().faceimg+") '></div><div class='content imgBox'><figure itemscope itemtype='1'>" +
        "<a id='minimg"+0+length+"' href='' itemprop='contentUrl' data-size='1080x1920'><img src='./img/loading.gif' alt='此图片已过期' itemprop='thumbnail' alt='Image description' /></a>"+
        "<figcaption itemprop='caption description'>1</figcaption></figure></div></div>");
    rightTop();
    var id = conn.getUniqueId();
    var msg = new WebIM.message('img', id);
    var input = document.getElementById('pictureInput');//选择图片的input
    var file = WebIM.utils.getFileUrl(input);
    var updataImg = "";
    var allowType = {
        "jpg": true,
        "gif": false,
        "png": true,
        "bmp": false
    };
    if ( file.filetype.toLowerCase() in allowType ) {
        msg.set({
            apiUrl: WebIM.config.apiURL,
            file: file,
            to: getRouterParam('id'),
            onFileUploadError: function ( error ) {
                console.log(error)
            },//图片上传失败
            onFileUploadComplete: function ( data ) {
                //图片地址：data.uri + '/' + data.entities[0].uuid;
                console.log(data.uri + '/' + data.entities[0].uuid);
                updataImg = data.uri + '/' + data.entities[0].uuid;
            },
            //图片消息发送成功
            success: function ( id, serverMsgId ) {
                var imgwh = "1080x1920";
                //var content = "<div class='head_portrait'></div><div class='content imgBox'><figure itemscope itemtype='1'><a id='minimg"+0+length+"' href='"+updataImg+"' itemprop='contentUrl' data-size='"+imgwh+"'><img src='"+updataImg+"' alt='此图片已过期' itemprop='thumbnail' alt='Image description' /></a><figcaption itemprop='caption description'>1</figcaption></figure></div>"
                //var ele = '<div class="Pics my-simple-gallery" itemscope itemtype="http://schema.org/ImageGallery">'+content+'</div>'
                var url = updataImg;
                $(".chat section img").last().attr('src',updataImg).parent().attr('href',updataImg);
                var k2= "0"+length;
                getImageWidth(url,k2,function(w,h,x){
                    setTimeout(function () {
                        var imgwh2=w+"x"+h;
                        $("#minimg"+x).attr("data-size",imgwh2);
                    },200)
                });
                console.log("成功");
                //var html = "<div class='right'>"+ele+"</div>";
                //$(".chat section").append(html);
                $(".chat section .right").each(function (item,index) {
                    $(this).find(".head_portrait").css("background-image","url('"+getLocalStroagelogin().faceimg+"')");
                });
                initPhotoSwipeFromDOM('.my-simple-gallery');
                rightTop();
                var data = {
                    from:localStorage.hxuser,
                    to:getRouterParam('id'),
                    id:serverMsgId,
                    type:"chat",
                    time:new Date().getTime(),
                    url:updataImg
                };
                createMessageId(serverMsgId,data);
                createChatId(getRouterParam('id'),serverMsgId);
                createMeId(localStorage.hxuser,getRouterParam('id'));
                getUserData();
                createList();
            },
            flashUpload:WebIM.flashUpload
        })
    }
    msg.body.ext.extra_user_app_id = getLocalStroagelogin().userid;
    msg.body.ext.extra_user_name = getLocalStroagelogin().name;
    msg.body.ext.extra_user_avater = getLocalStroagelogin().faceimg;
    conn.send(msg.body)
}