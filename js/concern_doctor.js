$(function () {
    //getToken(function(){
    //    if (getLocalStroagelogin().token){
    //        getConcernDoctor();
    //    }else {
    //        $(".popup").removeClass("hide");
    //        $(".section_load").addClass("hide");
    //    }
    //},"","concern")
    if (getUrlParam("userid") && getUrlParam("token")){
        updateLogin();
    }
    getUser(getUrlParam("userid"),getUrlParam("token"),function(){
        console.log("用户信息加载成功");
    });
    getConcernDoctor();
});

function getConcernDoctor(callback){
    var postData = {"appToken":getUrlParam("token"),"para":{
        "device_type":"PC",
        "device_id":" ",
        "api_version":"1.0.0.0",
        "onlydoctor": "Y",
        "pageindex": pageindex,
        "pagesize": pagesize
    }};
    $.ajax({
        "url": ebase+"/api/Common/QueryUserFocusListByUserID",
        "type":"POST",
        "data":postData,
        "dataType":"json",
        success:function(data){
            console.log(data);
            var Data = data.Data;
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
                var ele = "<div class='doctor' userid='"+Data[i].UserID+"'>" +
                    "<div class='head_portrait'></div>" +
                    "<div class='doctor_info'>" +
                    "<span class='doctor_name'>"+Data[i].UserName+"</span>" +
                    "<p>" +
                    "<span>"+Data[i].DepartmentName+"</span>" +
                    "<span>"+Data[i].JobLevelName+"</span>" +
                    "</p>" +
                    "</div>" +
                    "<div class='advisory'>" +
                    "<img src='img/doctor_list_go.png' alt=''>" +
                    "</div>" +
                    "</div>";
                $("section").append(ele);
                if (Data[i].FaceImgUrl){
                    $("section .doctor:nth-of-type("+parseInt((pageindex-1)*10+(i+2))+") .head_portrait").css("background-image","url('"+Data[i].FaceImgUrl+"')")
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

$("footer button").on("click", function () {
    var self = this;
    $(this).find("img").removeClass("hide");
    $(this).find("span").addClass("hasImg").text("加载中");
    pageindex++;
    getConcernDoctor(function(){
        $(self).find("img").addClass("hide");
        $(self).find("span").removeClass("hasImg").text("点击加载更多");
    });
});
$("header .back").on("click",function(){
    history.back();
});
$("section").on("click",".doctor", function () {
    var userid = $(this).attr("userid");
    //goToHomePage(userid);
    location.href = "http://www.11deyi.com/"+Api+"/Weixin/profile?id="+userid+"&type=SHARE";
});
$(".bottom div:nth-of-type(1)").on("click", function () {
    location.href = "http://www.11deyi.com/"+Api+"/Weixin/profile?type=ASK";
});
$(".bottom div:nth-of-type(2)").on("click", function () {
    location.href = "http://www.11deyi.com/"+Api+"/Weixin/profile?type=DS";
});
$(".bottom div:nth-of-type(3)").on("click", function () {
    location.href = "http://www.11deyi.com/"+Api+"/Weixin/profile?type=MD";
});