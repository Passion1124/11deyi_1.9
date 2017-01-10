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

function getToken(callback,data,Type){
    if (location.search && tel && name){             //判断是否是基层医联网进入的
        var loginToken = getLocalStroagelogin();
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