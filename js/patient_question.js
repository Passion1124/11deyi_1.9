$(function () {
    var title = getUrlParam("title");
    if (title){
        if(isAndroid){
            $("head title").text(title)
        }else {
            updateTitle(title);
        }
    }
    var token = getUrlParam("token");
    var paperid = getUrlParam("paperid");
    !token && (token = getLocalStroagelogin().token);
    var postData = {
        appToken : token,
        para: {
            device_type: "PC",
            device_id: "",
            api_version: "1.0.0.0",
            answerid: paperid
        }
    };
    $.ajax({
        url: ebase + "/api/LookUp/QueryAnswerByUidOrByIdOrForAll",
        type: "POST",
        data: postData,
        dataType: "json",
        success: function(data){
            console.log(data);
            if (data.Code === "0000"){
                var newData = JSON.parse(data.Data.Subs);
                var getTime = new Date(parseInt(data.Data.AnswerTime)).format("yyyy/M/d h:m");
                var content = JSON.parse(data.Data.PatientUserInfo);
                var sex = "男";
                if (content.sex === "W"){
                    sex = "女"
                }
                var bir = getBirthday(content.birthday);
                if (bir != "未填写"){
                    bir += "岁"
                }
                $(".info .content p:nth-of-type(2) span").text(content.name);
                $(".info .content p:nth-of-type(3) a").attr("href","tel:"+content.tel).text(content.tel);
                $(".info .content p:nth-of-type(4) span").text(bir);
                $(".info .content p:nth-of-type(5) span").text(sex);
                $(".info .top>div:last-of-type p:last-of-type").text("填表时间："+getTime);
                for (var i = 0; i < newData.length; i++){
                    !newData[i].answer&&(newData[i].answer=[]);
                    switch (newData[i].type) {
                        case "0":
                            var ele = "<p class='green'>"+newData[i].title+"</p>";
                            break;
                        case "1":
                        case "3":
                        case "4":
                            if (newData[i].answer.length > 0){
                                var ele = "<p>"+newData[i].title+"：<span>"+newData[i].answer[0]+"</span></p>";
                            }else {
                                var ele = "<p>"+newData[i].title+"：<span>未填写</span></p>";
                            }
                            break;
                        case "2":
                            if (newData[i].answer.length > 0){
                                var text = "";
                                for (var j = 0; j < newData[i].answer.length; j++){
                                    if (j != newData[i].answer.length - 1 ){
                                        text += newData[i].answer[j] + "、";
                                    }else {
                                        text += newData[i].answer[j];
                                    }
                                }
                                var ele = "<p>"+newData[i].title+"：<span>"+text+"</span></p>";
                            }else {
                                var ele = "<p>"+newData[i].title+"：<span>未填写</span></p>";
                            }
                            break;
                        case "5":
                            if (newData[i].answer){
                                var img = "";
                                if (newData[i].answer.length > 0){
                                    for (var k = 0; k < newData[i].answer.length; k++){
                                        img += "<div><img src='"+newData[i].answer[k]+"@150w' itemprop='thumbnail' alt='Image description'/></div>";
                                    }
                                    var imgBox = '<div class="img_box">'+img+'</div>';
                                    var ele = "<div><p>"+newData[i].title+"：</p>"+imgBox+"</div>";
                                }else {
                                    var ele = "<div><p>"+newData[i].title+"：<span>暂无图片</span></p></div>";
                                }
                            }else {
                                var ele = "<div><p>"+newData[i].title+"：<span>暂无图片</span></p></div>";
                            }
                            break;
                    }
                    $(".num_one").append(ele);
                    $(".num_one").find(".green").prev().css({"padding-bottom":"1.2rem","border-bottom":"1px solid #ccc"});
                }
                getDetails(paperid,token, function (data) {
                    console.log(data);
                    if (data.Code === "0000"){
                        var myData = data.Data;
                        for (var z = 0; z < myData.length; z++){
                            if (myData[z].NoteResultInfo){
                                $(".diagnose_postil>p>span").text(myData[z].NoteResultInfo);
                            }
                            if (myData[z].NoteCureInfo){
                                $(".cure_postil>p>span").text(myData[z].NoteCureInfo);
                            }
                            if (myData[z].Pics.length > 0){
                                var img = "";
                                for (var x = 0; x < myData[z].Pics.length; x++){
                                    img += "<div><img src='"+myData[z].Pics[x]+"@150w' itemprop='thumbnail' alt='Image description'/></div>";
                                }
                                var imgBox = '<div>'+img+'</div>';
                                $(".img_postil").append(imgBox);
                            }
                        }
                        if (!$(".diagnose_postil p>span").text()){
                            $(".postil .diagnose_postil").addClass("hide");
                        }
                        if (!$(".cure_postil p>span").text()){
                            $(".postil .cure_postil").addClass("hide");
                        }
                        if ($(".postil .img_postil img").length == 0){
                            $(".postil .img_postil").addClass("hide");
                        }
                        if (!$(".diagnose_postil p>span").text() && !$(".cure_postil p>span").text() && $(".postil .img_postil img").length == 0){
                            $(".postil").addClass("hide");
                        }else {
                            $(".postil").removeClass("hide");
                        }
                        if ($(".postil .cure_postil").hasClass("hide") && $(".postil .img_postil").hasClass("hide")){
                            $(".postil .diagnose_postil").css("border","0");
                        }
                        if ($(".postil .diagnose_postil").hasClass("hide") && $(".postil .img_postil").hasClass("hide")){
                            $(".postil .cure_postil").css("border","0");
                        }
                    }
                });
                getUserInfo(token,data.Data.PatientId, function (data) {
                    console.log(data)
                    if (data.Code === "0000"){
                        var userData = data.Data;
                        $(".info .top>div:last-of-type p:nth-of-type(1)").text(userData.Name);
                        if (userData.HeadImg){
                            $(".info .top .head_portrait").css("background-image","url("+userData.HeadImg+")");
                        }else {
                            $(".info .top .head_portrait").css("background-image","url(http://www.11deyi.com/img/30.png)");
                        }
                    }
                    $(".loading_box").addClass("hide");
                });
            }
        },
        error: function (xhr ,errorType ,error){
            $(".loading_box").addClass("hide");
            $("body .bug").append("//XHR:"+xhr+"///errorType:"+errorType + "////error:"+error)
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
});
$("body").on("click","img",function(){
    //if ($(this).hasClass("me")){
    //    return;
    //}
    //var img_src = $(this).attr("src").replace(/@150w/g,"");
    //$(".img_show>img").attr("src",img_src);
    //$(".img_show").show();
    //var imgWidth = $(".img_show>img").width();
    //var imgHeight = $(".img_show>img").height();
    //$(".img_show>img").css({"margin-top":-(imgHeight / 2)+"px","margin-left": -(imgWidth / 2) + "px"});
    if ($(this).hasClass("me") || $(this).hasClass("load")){
        return;
    }
    var img_src = $(this).attr("src").replace(/@150w/g,"");
    var img=$(".img_show>img")[0];
    img.src=img_src;
    img.onload=function(){
        $(".img_show").show();
        var imgWidth = $(".img_show>img").width();
        var imgHeight = $(".img_show>img").height();
        $(".img_show>img").css({"margin-top":-(imgHeight / 2)+"px","margin-left": -(imgWidth / 2) + "px",'top':'50%','left':'50%'});
    }
});
$(".img_show,.img_show>img").on("click",function(){
    $(this).addClass("me");
    $(".img_show").hide();
    $(".img_show>img").css({"margin-top":0,"margin-left": 0,'top':0,'left':0});
    $(".img_show>img")[0].src='';
});
function getUserInfo(token,id,callback){
    var postData = {
        "appToken": token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "search_userid": id
        }
    };
    //console.log(token);
    $.ajax({
        "url": phpEbase+ "/api/php/QueryUserById",
        "type":"POST",
        "dataType":"json",
        "data":postData,
        success:function(data){
            callback(data)
        },
        error: function(xhr ,errorType ,error){
            //alert("错误");
            $(".loading_box").addClass("hide");
            $("body .bug").append("//XHR:"+xhr+"///errorType:"+errorType + "////error:"+error)
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
function getDetails(id,token,callback){
    var postData = {
        "appToken": token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "qid": id
        }
    };
    //console.log(token);
    $.ajax({
        "url": ebase+ "/api/Question/QueryQuestionNoteByQidWithUid",
        "type":"POST",
        "dataType":"json",
        "data":postData,
        success:function(data){
            callback(data)
        },
        error: function(xhr ,errorType ,error){
            //alert("错误");
            $(".loading_box").addClass("hide");
            $("body .bug").append("//XHR:"+xhr+"///errorType:"+errorType + "////error:"+error)
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
function getBirthday(time){
    var myTime = parseInt(time);
    var myYear = "";
    if (isNaN(myTime) || !myTime){
        myYear = "未填写";
    }else {
        var localTime =  parseInt(new Date().format("yyyy"));
        var birTime = parseInt(new Date(parseInt(time)).format("yyyy"));
        myYear = localTime - birTime;
    }
    return myYear;
}
function updateTitle(title){
    var $body = $('body');
    document.title = title;
    var $iframe = $("<iframe style='display:none;' src='/favicon.ico'></iframe>");
    $iframe.on('load',function() {
        setTimeout(function() {
            $iframe.off('load').remove();
        }, 0);
    }).appendTo($body);
}