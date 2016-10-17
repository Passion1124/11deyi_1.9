$(function(){
    getToken(function(){
        if (getLocalStroagelogin().token){
            getMyTurnYard();
        }else {
            $(".popup").removeClass("hide");
            $(".section_load").addClass("hide");
        }
    },"","myTurnYard")
})

function getMyTurnYard(callback){
    var token = getLocalStroagelogin().token;
    var postData = {"appToken":token,"para":{
        "device_type":"PC",
        "device_id":" ",
        "api_version":"1.0.0.0",
        "pageindex": pageindex,
        "pagesize": pagesize
    }};
    $.ajax({
        "url": ebase+"/api/TransHospital/QueryListForPublishByme",
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
                var ele = "<div class='list' userid='"+Data[i].UserId+"'>" +
                    "<div class='list_left'>" +
                    "<p class='head_portrait'></p>" +
                    "</div>" +
                    "<div class='list_right'>" +
                    "<p class='title'>" +
                    "<span>"+Data[i].UserName+"</span>" +
                    "<span>"+Data[i].Type+"</span>" +
                    "</p>" +
                    "<p class='address'>" +
                    "<span>"+Data[i].DepName+"</span>" +
                    "<span>"+Data[i].Addr+"</span>" +
                    "</p>" +
                    "<p class='text'>"+Data[i].PatientDes+"</p>" +
                    "<p class='other'>" +
                    "<span>"+Data[i].CreateTime+"</span>" +
                    "<span>"+Data[i].ViewCount+"人看过</span>" +
                    "</p>" +
                    "</div>" +
                    "</div>";
                $("section").append(ele);
                if (Data[i].FaceImgUrl) {
                    $("section .list:nth-of-type(" + parseInt((pageindex - 1) * 10 + (i + 2)) + ") .head_portrait").css("background-image", "url('" + Data[i].FaceImgUrl + "')")
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
    getMyTurnYard(function(){
        $(self).find("img").addClass("hide");
        $(self).find("span").removeClass("hasImg").text("点击加载更多");
    });
});
$("header .back").on("click",function(){
    history.back();
});
$("section").on("click",".list .list_left .head_portrait", function () {
    var userid = $(this).parent().parent().attr("userid");
    goToHomePage(userid);
});
$("section").on("click",".list .list_right .title span:nth-of-type(1)", function () {
    var userid = $(this).parent().parent().parent().attr("userid");
    goToHomePage(userid);
})
$(".bottom div:nth-of-type(1)").on("click", function () {
    location.href = "chat.html"
});
$(".bottom div:nth-of-type(2)").on("click", function () {
    location.href = "case_science.html"
});
$(".bottom div:nth-of-type(3)").on("click", function () {
    location.href = "concern_doctor.html"
});