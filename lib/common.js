var ebase = "http://120.76.156.87:610";
var Api = "Api";
var token = getUrlParam("token");
var pageindex = 1;
var pagesize = 10;
var official = false;

if (location.search){
    var tel = getUrlParam("tel");
    var name = getUrlParam("name");
    var type = getUrlParam("type");
}

if (!official){
    ebase = "http://120.76.156.87:660";
    Api = "TApi";
}

function initLocalStorage(){
    if (location.search){
        if (!localStorage.judge && tel && name ){
            var judge = {"tel": tel, "name": name, "type": type, "jcylw": true};
            localStorage.judge = JSON.stringify(judge);
        }
    }
    if (!localStorage.login){
        var login = {};
        localStorage.login = JSON.stringify(login);
    }
    if (!location.search && localStorage.judge){
        localStorage.removeItem("judge");
    }
    if (!localStorage.testMyUrl){
        localStorage.testMyUrl = ebase;
    }
    if (localStorage.testMyUrl !== ebase){
        localStorage.removeItem("testMyUrl");
        localStorage.login = JSON.stringify({});
        localStorage.testMyUrl = ebase;
    }
}

initLocalStorage();

//关注成功
function win(){
    $(".consult_loading p").text("关注成功");
    $(".consult_loading img").addClass("result").attr("src","img/chenggong_@2x.png");
    setTimeout(function(){
        $(".consult_loading").addClass("hide");
        $(".consult_loading img").removeClass("result").attr("src","img/loading.gif");
        $(".consult_loading p").text("正在关注");
    },500);
}
//关注失败
function fail(){
    $(".consult_loading p").text("关注失败");
    $(".consult_loading img").addClass("result").attr("src","img/fail@2x.png");
    setTimeout(function(){
        $(".consult_loading").addClass("hide");
        $(".consult_loading img").removeClass("result").attr("src","img/loading.gif");
        $(".consult_loading p").text("正在关注");
    },500);
}
//点击关注后
function clickFocus(focusid,name,type){
    $(".consult_loading").removeClass("hide");
    createFocus(focusid,name,type);
}
//点击关注时判断用户是否登陆
function verdictLogin(userid, name, type){
    var Type = "createFocus";
    var data = {"userid":userid,"name":name,"type":type};
    var login = getLocalStroagelogin();
    if (localStorage.judge || login.token){
        getToken(function(){
            clickFocus(userid,name,type);
        },data,Type);
    }else {
        $(".popup").removeClass("hide");
        $("html,body").addClass("ovfHiden");
    }
}

function updateLogin(){
    var Login = getLocalStroagelogin();
    Login.token = getUrlParam("token");
    Login.userid = getUrlParam("userid");
    localStorage.login = JSON.stringify(Login);
}

function getLoginUserToken(){
    if (getLocalStroagelogin().token){
        token = getLocalStroagelogin().token;
    }
}

function goToHomePage(userid){
    //if (userid){
    //    if (location.search){
    //        var oldUserId = getUrlParam("userid");
    //        if (oldUserId){
    //           // http://www.11deyi.com/Api/Weixin/profile?id=oqFjAuMTyxbjIDjH3K8BqkEv1ZM0&type=SHARE
    //            location.href = "http://www.11deyi.com/Api/Weixin/profile?id="+userid+"&type=SHARE";
    //        }else {
    //            location.href = "personage.html"+location.search+"&userid="+userid;
    //        }
    //    }else {
    //        location.href = "personage.html?userid="+userid;
    //    }
    //}
    location.href = "http://www.11deyi.com/Api/Weixin/profile?id="+userid+"&type=SHARE";
}

function getToken(callback,data,Type){
    if (location.search && tel && name){             //判断是否是基层医联网进入的
        var loginToken = getLocalStroagelogin();
        //alert(tel);
        //alert(loginToken.tel);
        addLocalStorageJudge(function (judge) {
            judge.tel = tel;
            judge.name = name;
            judge.type = type;
            localStorage.judge = JSON.stringify(judge);
        });
        if (loginToken.token){
            if (tel !== loginToken.tel){
                var reg =  /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                if (!reg.test(tel)){
                    alert("账号数据异常");
                    $(".consult_loading").addClass("hide");
                }else {
                    autoRegister(tel,name,data,Type);
                }
            }else {
                callback();
            }
        }else {
            autoRegister(tel,name,data,Type);
        }
    }else {
        console.log("PC端");
        callback();
    }
}


/*-----------------------------------获取用户信息----------------------------------------------------*/
function getUser(callback){
    var postData = {
        "appToken":getUrlParam("token"),
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "search_userid": getUrlParam("userid")
        }
    };
    $.ajax({
        url: ebase + "/api/User/QueryUserById",
        data: postData,
        type: "POST",
        dataType: "json",
        success: function (data) {
            console.log(data);
            //alert(data.Data.UserID);
            localStorage.hxuser = data.Data.HxUserId;
            localStorage.hxpwd = data.Data.HxUserPwd;
            addLocalStorageLogin(function (newData) {
                var Data = data.Data;
                if (Data.FaceImgUrl){
                    newData.faceimg = Data.FaceImgUrl;
                }else {
                    newData.faceimg = "http://www.11deyi.com/img/30.png";
                }
                newData.name = Data.Name;
                newData.tel = Data.Phone;
                //if (getUrlParam("token")){
                //    newData.token = getUrlParam("token");
                //}
                //newData.userid = Data.UserID;
                localStorage.login = JSON.stringify(newData)
            });
            callback(data)
        },
        error: function (xhr ,errorType ,error){
            //alert("错误");
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}

//自动注册功能
function autoRegister(tel,name,info,Type){
    $.ajax({
        url:ebase+"/api/User/Register",
        type:"POST",
        data:{"appToken":"","para":{
            "device_type":"PC",
            "device_id":" ",
            "api_version":"1.0.0.0",
            "phone":tel
        }},
        dataType:"json",
        success:function(data){
            console.log(data);
            //console.log(info);
            var Data = data.Data;
            if (data.Code === "0006"){
                addLocalStorageLogin(function(login){
                    login.token = Data.appToken;
                    login.name = Data.Name;
                    login.tel = Data.Phone;
                    login.faceimg = Data.FaceImgUrl;
                    login.userid = Data.UserId;
                    localStorage.login = JSON.stringify(login);
                });
                if (Type === "consult"){
                    if (info.doctorid){
                        issue_consult(info.title,info.sex,info.age,info.depid,info.depname,info.questionpics,info.isanonymous,info.pricevalue,info.doctorid,info.addr,info.patienttimelong,info.cureinfo,info.checkinfo);
                    }else {
                        issue_consult(info.title,info.sex,info.age,info.depid,info.depname,info.questionpics,info.isanonymous,info.pricevalue,info.doctorid);
                    }
                }else if (Type === "turnyard"){
                    issue_turnyard(info.title, info.sex, info.age, info.depid, info.depname, info.pics, info.isanonymous, info.describe, info.userAddress)
                }else if (Type === "concern"){
                    getConcernDoctor();
                }else if (Type === "myConsult"){
                    getMyConsult();
                }else if (Type === "myTurnYard"){
                    getMyTurnYard();
                }else if (Type === "createFocus"){
                    clickFocus(info.userid,info.name,info.type)
                }
            }
            else  if (data.Code === "0000"){
                addLocalStorageLogin(function(login){
                    login.token = Data.appToken;
                    localStorage.login = JSON.stringify(login);
                });
                update_info(tel,name,Data.UserId,info,Type)
            }
        },
        error: function (xhr ,errorType ,error) {
            console.log("错误");
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
//发布转院求助信息
function issue_turnyard(patientdes,patienttimelong,medicinedes,chekinfo,sex,age,depid,depname,pics,isanonymous,address){
    var token = getLocalStroagelogin().token;
    var postData = {
        "appToken":token,"para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "patientdes":patientdes,
            "sex":sex,
            "age":age,
            "departmentid":depid,
            "departmentname":depname,
            "pics":pics,
            "isanonymous":isanonymous,
            "medicinedes":medicinedes,
            "addr":address,
            "patienttimelong":patienttimelong,
            "chekinfo":chekinfo
        }};
    console.log(postData);
    $.ajax({
        url:ebase+"/api/TransHospital/Submit",
        type:"POST",
        data:postData,
        dataType:"json",
        success:function(data){
            console.log(data);
            if (data.Code === "0000"){
                $(".issue_box section .issue").removeAttr("disabled");
                $(".present_box").removeClass("hide");
                $(".consult_loading").addClass("hide");
                $(window).scrollTop(0);
                $("html,body").addClass("ovfHiden");
            }else {
                $(".issue_box section .issue").removeAttr("disabled");
                $(".consult_loading p").text("发布失败");
                $(".consult_loading img").addClass("result").attr("src","img/fail@2x.png");
                setTimeout(function(){
                    $(".consult_loading").addClass("hide");
                    $(".consult_loading img").removeClass("result").attr("src","img/loading.gif");
                },300);
            }
        },
        error:function(xhr ,errorType ,error) {
            //alert("错误");
            $(".issue_box section .issue").removeAttr("disabled");
            $(".consult_loading p").text("发布失败");
            $(".consult_loading img").addClass("result").attr("src","img/fail@2x.png");
            setTimeout(function(){
                $(".consult_loading").addClass("hide");
                $(".consult_loading img").removeClass("result").attr("src","img/loading.gif");
            },300);
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
//发布病情咨询信息
function issue_consult(title,sex,age,depid,depname,questionpics,isanonymous,pricevalue,doctorid,addr,patienttimelong,cureinfo,checkinfo){
    var token = getLocalStroagelogin().token;
    var postData = {
        "appToken":token,"para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "title":title,
            "sex":sex,
            "age":age,
            "depid":depid,
            "depname":depname,
            "questionpics":questionpics,
            "isanonymous":isanonymous,
            "pricevalue":pricevalue,
            "doctorid":doctorid,
            "addr":addr,
            "patienttimelong":patienttimelong,
            "cureinfo":cureinfo,
            "checkinfo":checkinfo
        }};
    console.log(postData);
    $.ajax({
        url:ebase+"/api/Question/Submit",
        type:"POST",
        data:postData,
        dataType:"json",
        success:function(data){
            console.log(data);
            if (data.Code === "0000"){
                if (!doctorid){
                    $(".present_box").removeClass("hide");
                    $(".consult_loading").addClass("hide");
                    $(window).scrollTop(0);
                    $("html,body").addClass("ovfHiden");
                }else {
                    $(".consult_loading img").addClass("result").attr("src","img/success@2x.png");
                    $(".consult_loading p").text("发布成功");
                    setTimeout(function(){
                        location.href = "chat.html#id="+data.Data.DocotorHxId.toLowerCase();
                    },400)
                }
            }else {
                $(".consult_loading p").text("发布失败");
                $(".consult_loading img").addClass("result").attr("src","img/fail@2x.png");
                setTimeout(function(){
                    $(".consult_loading").addClass("hide");
                    $(".consult_loading p").text("正在发布");
                    $(".consult_loading img").removeClass("result").attr("src","img/loading.gif");
                },300);
            }
        },
        error:function(xhr ,errorType ,error) {
            //alert("错误");
            $(".consult_loading p").text("发布失败");
            $(".consult_loading img").addClass("result").attr("src","img/fail@2x.png");
            setTimeout(function(){
                $(".consult_loading").addClass("hide");
                $(".consult_loading p").text("正在发布");
                $(".consult_loading img").removeClass("result").attr("src","img/loading.gif");
            },300);
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
//修改用户信息
function update_info(tel,name,userid,info,Type){
    var login = getLocalStroagelogin();
    var token = login.token;
    var userType = "U";
    if (type === "doctor"){
        userType = "D"
    }
    var postData = {
        "appToken": token,
        "para":{
            "device_type":"PC",
            "device_id":" ",
            "api_version":"1.0.0.0",
            "update_userid":userid,
            "faceimgurl":"http://www.11deyi.com/img/30.png",
            "nikename":name,
            "sex":"M",
            "type": userType,
            "adviser":"bg-jcylw(村医)"
        }
    };
    $.ajax({
        "url":ebase+"/api/User/UpdateUser",
        "type": "POST",
        "data":postData,
        "dataType":"json",
        success:function(data){
            console.log(data);
            if (data.Code === "0000"){
                var userInfo = data.Data.userInfo;
                addLocalStorageLogin(function(login){
                    login.tel = userInfo.Phone;
                    login.name = userInfo.Name;
                    login.faceimg = userInfo.FaceImgUrl;
                    localStorage.login = JSON.stringify(login);
                });
                if (Type === "consult"){
                    issue_consult(info.title,info.sex,info.age,info.depid,info.depname,info.questionpics,info.isanonymous,info.pricevalue,info.doctorid);
                }else if (Type === "turnyard"){
                    issue_turnyard(info.title, info.sex, info.age, info.depid, info.depname, info.pics, info.isanonymous, info.describe, info.userAddress)
                }else if (Type === "concern"){
                    getConcernDoctor();
                }else if (Type === "myConsult"){
                    getMyConsult();
                }else if (Type === "myTurnYard"){
                    getMyTurnYard();
                }else if (Type === "createFocus"){
                    clickFocus(info.userid,info.name,info.type);
                }
            }
        },
        error: function (xhr ,errorType ,error) {
            console.log("错误");
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
//获取科室列表
function getDepList(){
    if (getLocalStroagelogin().token){
        token = getLocalStroagelogin().token;
    }
    var postData = {"appToken":token,"para":{
        "device_type":"PC",
        "device_id":"",
        "api_version":"1.0.0.0"
    }};
    $.ajax({
        url:ebase+"/api/Admin/Question/QueryDepList",
        type:"POST",
        data:postData,
        dataType:"json",
        success: function (data) {
            console.log(data);
            $(".loading").addClass("hide");
            $("section").removeClass("hide");
            var Data = data.Data;
            for (var i = 0; i < Data.length; i++){
                var option = "<option class='opt' depid='"+Data[i].ParentID+"'>"+Data[i].ParentName+"</option>";
                $(".elect .department select").append(option)
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
//获取年龄
function initSelectData(){
    for (var k = 1; k < 13; k++){
        var ele = "<option value='"+k+"月'>"+k+"月</option>";
        $(".elect .age select").append(ele)
    }
    for (var i = 1; i < 101; i++){
        if (i == 18){
            var ele = "<option value='"+i+"岁' selected>"+i+"岁</option>";

        }else {
            var ele = "<option value='"+i+"岁'>"+i+"岁</option>";

        }
        $(".elect .age select").append(ele)
    }
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return decodeURI(r[2]); return null; //返回参数值
}
//获取路由修改的参数
function getRouterParam(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.hash.substr(1).match(reg);  //匹配目标参数
    if (r != null) return decodeURI(r[2]); return null; //返回参数值
}

$(".case_science").on("click",function(){
    location.href = "case_science.html"+location.search;
});
$(".index").on("click",function(){
    location.href = "index.html"+location.search;
});
$(".turn_yard").on("click",function(){
    location.href = "turn_yard.html"+location.search;
});

//对登陆弹窗的操作
$(".popup button:nth-of-type(1)").on("click",function(){
    createBackUrl(location.href);
    location.href = "login.html";
});
$(".popup button:nth-of-type(2)").on("click",function(){
    createBackUrl(location.href);
    location.href = "register.html";
});
$(".popup .login_popup span").on("click",function(){
    $(".popup").addClass("hide");
    $("html,body").removeClass("ovfHiden");
});

$(".switch p:nth-of-type(1)").on("click",function(){
    location.href = "concern_doctor.html"+location.search;
});
//$(".switch p:nth-of-type(2)").on("click",function(){
//    location.href = "myconsult.html"+location.search;
//});
$(".switch p:nth-of-type(2)").on("click",function(){
    location.href = "my_turnyard.html"+location.search;
});

//添加localStorage的里面的judge的属性
function addLocalStorageJudge(callback){
    var newData = JSON.parse(localStorage.judge);
    callback(newData);
    //localStorage.judge = JSON.stringify(newData);
}
//获取localStorage里的judge数据
function getLocalStroagejudge(){
    var newData = JSON.parse(localStorage.judge);
    return newData;
}
//添加localStorage的里面的login的属性
function addLocalStorageLogin(callback){
    var newData = JSON.parse(localStorage.login);
    callback(newData);
    //localStorage.judge = JSON.stringify(newData);
}
//获取localStorage里的login数据
function getLocalStroagelogin(){
    var newData = JSON.parse(localStorage.login);
    return newData;
}

function createQuestionId(questionid){
    var question = questionid;
    //localStorage.questionid = question;
    sessionStorage.questionid = question;
}
function getLocalStorageQuestionId(){
    var question = sessionStorage.questionid;
    return question;
}

function createBackUrl(backurl){
    var backUrl = backurl;
    localStorage.backurl = backUrl;
}
function getLocalStorageBackUrl(){
    var backurl = localStorage.backurl;
    return backurl;
}

function createUserId(userid){
    var user = userid;
    localStorage.userid = user;
}
function getLocalStorageUserId(){
    var user = localStorage.userid;
    return user;
}

function createMessageId(id,data){
    localStorage[id] = JSON.stringify(data);
}
function getMessage(id){
    return JSON.parse(localStorage[id]);
}
function createChatId(chatid,messageid){
    if (localStorage[chatid]){
        var data = getChatId(chatid);
        data.push(messageid);
        localStorage[chatid] = JSON.stringify(data);
    }else {
        localStorage[chatid] = JSON.stringify([messageid]);
    }
}
function getChatId(chatid){
    return JSON.parse(localStorage[chatid]);
}
function createMeId(uiid,chatid){
    if (localStorage[uiid]){
        var data = getUiid(uiid);
        for (var  i = 0; i < data.length; i++){
            if (data[i] === chatid){
                data.splice(i,1);
            }
        }
        data.splice( 0, 0, chatid);
        localStorage[uiid] = JSON.stringify(data);
    }else {
        localStorage[uiid] = JSON.stringify([chatid]);
    }
}
function getUiid(uiid){
    //alert(localStorage[uiid])
    if (localStorage[uiid]){
        return JSON.parse(localStorage[uiid]);
    }
}
function createChatUnread(chatid){
    if (localStorage[chatid+"_unread"]){
        localStorage[chatid+"_unread"]++;
    }else {
        localStorage[chatid+"_unread"] = 1;
    }
}
function createChatUserInfo(name,url,hxid,docid){
    var info = {name:name,url:url,docid:docid}
    localStorage[hxid+"_info"] = JSON.stringify(info);
}
function updateChatUserInfo(message){
    var ext = message.ext;
    createChatUserInfo(ext.extra_user_name,ext.extra_user_avater,message.from,ext.extra_user_app_id);
}
function getChatUserInfo(hxid){
    if (localStorage[hxid+"_info"]){
        return JSON.parse(localStorage[hxid+"_info"]);
    }else {
        return null;
    }
}
function createChatSend(data,state,hxid){
    //console.log(data);
    var newData = data;
    newData.state = state;
    newData.hxid = hxid;
    localStorage.send = JSON.stringify(newData);
}
function updateChatSend(sendState){
    var send = JSON.parse(localStorage.send);
    send.state = sendState;
    localStorage.send = JSON.stringify(send);
}
function getChatSend(){
    if (localStorage.send){
        return JSON.parse(localStorage.send)
    }
}

var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {         //移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
var isWx = false;
var isAndroid = browser.versions.android;

//判断打开页面的浏览器是否是微信
function wxBrowser(){
    if (browser.versions.mobile) {//判断是否是移动设备打开。browser代码在下面
        var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            //在微信中打开
            $("header").addClass("hide");
            isWx = true;
        }
    }
}

wxBrowser();

var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            childElements,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {


            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        var clickedListItem = closest(eTarget, function(el) {
            return el.tagName === 'FIGURE';
        });

        if(!clickedListItem) {
            return;
        }


        // find index of clicked item
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) {
                continue;
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
            params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if(pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        if(!params.hasOwnProperty('pid')) {
            return params;
        }
        params.pid = parseInt(params.pid, 10);
        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {
            index: index,

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of docs for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            },

            // history & focus options are disabled on CodePen
            // remove these lines in real life:
            historyEnabled: false,
            focus: false

        };

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }
        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid > 0 && hashData.gid > 0) {
        openPhotoSwipe( hashData.pid - 1 ,  galleryElements[ hashData.gid - 1 ], true );
    }
};

function getImageWidth(url,k,callback){
    var img = new Image();
    img.src = url;
    // 如果图片被缓存，则直接返回缓存数据
    if(img.complete){
        callback(img.width, img.height,k);
    }else{
        // 完全加载完毕的事件
        img.onload = function(){
            callback(img.width, img.height,k);
        }
    }
}

function getChatTime(message){
    var newDate = new Date().getTime();
    var time = (newDate - message.time)/1000;
    var day = parseInt(parseInt(time / 3600) / 24);
    var testTime = new Date(parseInt(message.time));
    var timeText = "";
    if ( day < 1){
        var h = testTime.getHours();
        var m = testTime.getMinutes();
        if (m < 10){
            m = "0"+m;
        }
        timeText = h+":"+m;
    }else if ( day >= 1 && day < 2){
        timeText = "昨天"
    }else if ( 2 <= day && day <= 7){
        var getDay = testTime.getDay() - 1;
        var week = ["一","二","三","四","五","六","日"]
        timeText = "星期"+week[getDay];
    }else if (day > 7){
        timeText = testTime.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ").split(" ")[0];
    }
    return timeText;
}

//获取url#之后的参数
function getParamShape(){
    var params=window.location.href.split('#');
    if(params[1]!=""){
        var search={};
        params=params[1].split("&").forEach(
            function(v){
                var arr=v.split("=");
                search[arr[0]]=arr[1];
            }
        );
        return search;
    }
}
//blob类型转换存储
var blobObj={
    /**
     * btoa()：字符串或二进制值转为Base64编码
     * atob()：Base64编码转为原来的编码
     */
    setBlob:function(blob,callback){  //接收Blob和操作base64的字符串
        var reader = new window.FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
            callback(reader.result);
        };
    },
    getBlob:function(dataurl,callback) {  //接收base64字符
        var obj = dataurl.split(','), mime = obj[0].match(/:(.*?);/)[1], //获取类型
            bstr = atob(obj[1]);
        var n = bstr.length, arr = new Array(n);
        while (n--) {
            arr[n] = bstr.charCodeAt(n);
        }
        var u8arr=new Uint8Array(arr);
        var newblob=new Blob([u8arr], { type: mime });
        var url=URL.createObjectURL(newblob);
        var xhr;
        if(window.XMLHttpRequest){
            xhr = new XMLHttpRequest();
        }else{//对IE7及以下版本浏览器做兼容
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhr.open("GET",url,true);
        xhr.responseType = "blob";
        xhr.onload = function() {
            var blob = this.response;
            callback(blob);
        }
        xhr.send(null);
    }
}
//md5加密
function md5(string){
    function md5_RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }
    function md5_AddUnsigned(lX,lY){
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }
    function md5_F(x,y,z){
        return (x & y) | ((~x) & z);
    }
    function md5_G(x,y,z){
        return (x & z) | (y & (~z));
    }
    function md5_H(x,y,z){
        return (x ^ y ^ z);
    }
    function md5_I(x,y,z){
        return (y ^ (x | (~z)));
    }
    function md5_FF(a,b,c,d,x,s,ac){
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_GG(a,b,c,d,x,s,ac){
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_HH(a,b,c,d,x,s,ac){
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_II(a,b,c,d,x,s,ac){
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };
    function md5_WordToHex(lValue){
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for(lCount = 0;lCount<=3;lCount++){
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };
    function md5_Utf8Encode(string){
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;
    string = md5_Utf8Encode(string);
    x = md5_ConvertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=md5_FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=md5_FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=md5_FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=md5_FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=md5_FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=md5_FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=md5_FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=md5_FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=md5_FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=md5_FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=md5_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=md5_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=md5_FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=md5_FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=md5_FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=md5_FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=md5_GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=md5_GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=md5_GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=md5_GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=md5_GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=md5_GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=md5_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=md5_GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=md5_GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=md5_GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=md5_GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=md5_GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=md5_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=md5_GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=md5_GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=md5_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=md5_HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=md5_HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=md5_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=md5_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=md5_HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=md5_HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=md5_HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=md5_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=md5_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=md5_HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=md5_HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=md5_HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=md5_HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=md5_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=md5_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=md5_HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=md5_II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=md5_II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=md5_II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=md5_II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=md5_II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=md5_II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=md5_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=md5_II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=md5_II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=md5_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=md5_II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=md5_II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=md5_II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=md5_II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=md5_II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=md5_II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=md5_AddUnsigned(a,AA);
        b=md5_AddUnsigned(b,BB);
        c=md5_AddUnsigned(c,CC);
        d=md5_AddUnsigned(d,DD);
    }
    return (md5_WordToHex(a)+md5_WordToHex(b)+md5_WordToHex(c)+md5_WordToHex(d)).toLowerCase();
}
