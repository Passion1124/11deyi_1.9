$(function(){
    getDepList();
    initSelectData();
    if (getLocalStroagelogin().token){
        queryListForPublishByme();
    }else {
        $(".turnyard .list_loading").addClass("hide");
        $(".unMoreData").removeClass("hide");
    }
});
$(".turnyard section").on("click",".list .check", function () {
    var id = $(this).parent().parent().attr("detailsid");
    if (location.search){
        location.href = "transfer_details.html"+location.search+"&id="+id;
    }else {
        location.href = "transfer_details.html?id="+id;
    }
});
$(".issue_box section .issue").on("click", function () {
    var patientdes = $(".issue_box section .content textarea:nth-of-type(1)").val();
    var patienttimelong = $(".issue_box section .content textarea:nth-of-type(2)").val();
    var medicinedes = $(".issue_box section .content textarea:nth-of-type(3)").val();
    var chekinfo = $(".issue_box section .content textarea:nth-of-type(4)").val();
    var sex = $(".issue_box section .sex_yes").text();
    console.log(patientdes);
    console.log(patienttimelong);
    console.log(medicinedes);
    console.log(chekinfo);
    if (sex == "男"){
        sex = "M"
    }else {
        sex = "W"
    }
    var age = $(".issue_box section .age span:nth-of-type(1)").text();
    var depname = $(".issue_box section .department span:nth-of-type(1)").text();
    var pics = "";
    $(".issue_box .pics img").each(function(index,item){
        if (index > 0){
            pics += ","+$(this).attr("src")
        }else {
            pics += $(this).attr("src");
        }
    });
    var isanonymous = "N";
    if($(".issue_box section .question_btm p:nth-of-type(1)").hasClass("cryptonym")){
        isanonymous = "N"
    }else {
        isanonymous = "Y"
    }
    var depid = "";
    $(".issue_box section .elect .department select option").each(function(item,index){
        if ($("section .elect .department select").val() === $(this).val()){
            depid = $(this).attr("depid");
        }
    });
    var userAddress = $(".issue_box section .address input").val();
    if (depname === "选择科室"){
        alert("请填写科室");
    }else if (!userAddress){
        alert("请填写地址");
    }else if (!patientdes || patientdes.length < 20){
        alert("哪儿不舒服需要超过20个字");
    }else if (!patienttimelong){
        alert("需要告诉我们您患病多久了");
    }
    if (depname !== "选择科室" && patientdes.length >= 20 && patienttimelong && userAddress){
        //alert("进入");
        $(".consult_loading").removeClass("hide");
        $(".consult_loading img").removeClass("result");
        $(this).attr("disabled",true);
        var Type = "turnyard";
        var data = {patientdes:patientdes, patienttimelong:patienttimelong, medicinedes:medicinedes, chekinfo:chekinfo, sex:sex, age:age, depid:depid, depname:depname, pics:pics, isanonymous:isanonymous, userAddress:userAddress}
        getToken(function () {
            issue_turnyard(patientdes, patienttimelong, medicinedes, chekinfo, sex, age, depid, depname, pics, isanonymous, userAddress)
        }, data, Type);
    }
});
$(".issue_box .elect .age select").on("change",function(){
    $(this).parent().find("span:nth-of-type(1)").text($(this).val());
});
$(".issue_box .elect .department select").on("change",function(){
    $(this).parent().find("span:nth-of-type(1)").text($(this).val());
});
$(".issue_box section .content textarea").on("input", function () {
    $(".issue_box section .question_btm .initLength").text($(this).val().length);
});
$(".issue_box section .question_btm p:nth-of-type(1)").on("click",function(){
    $(this).toggleClass("cryptonym")
});
$(".issue_box section .elect .sex").on("click", function () {
    $(".issue_box section .elect .sex").each(function(item,index){
        $(this).removeClass("sex_yes")
    });
    $(this).addClass("sex_yes");
});
$(".turnyard .issue_btn").on("click", function () {
    var login = getLocalStroagelogin();
    if (localStorage.judge || login.token){
        $(".issue_box").removeClass("hide");
        $(".turnyard").addClass("hide");
        if ($(".issue_box header").hasClass("hide")){
            $(".issue_box header").removeClass("hide");
        }
        $(".issue_box .elect .sex").each(function () {
            $(this).removeClass("sex_yes");
        });
        $(".issue_box .elect .sex:nth-of-type(1)").addClass("sex_yes");
        $(".issue_box .age span:nth-of-type(1)").text("18岁");
        $(".issue_box .age select").empty();
        initSelectData();
        $(".issue_box .department span:nth-of-type(1)").text("选择科室");
        $(".issue_box .department select").empty();
        getDepList();
        $(".issue_box .address input").val("");
        $(".issue_box .content textarea").each(function () {
            $(this).val("");
        });
        $(".issue_box .content .question_btm p").addClass("cryptonym");
    }else {
        $(".popup").removeClass("hide");
        $("html,body").addClass("ovfHiden")
    }
});
$(".issue_box header .back").on("click", function () {
    $(".turnyard,.turnyard .list_loading").removeClass("hide");
    $(".issue_box").addClass("hide");
    $(".turnyard .list").remove();
    queryListForPublishByme();
});
$(".turnyard header .back").on("click", function () {
    history.back();
});
$(".present_box button").on("click", function () {
    $(".present_box").addClass("hide");
    $(".issue_box").addClass("hide");
    $(".turnyard").removeClass("hide");
    queryListForPublishByme();
    $("html,body").removeClass("ovfHiden");
});
$("section").on("click",".list .list_left .head_portrait", function () {
    var userid = $(this).parent().parent().attr("userid");
    goToHomePage(userid);
});
$("section").on("click",".list .list_right .title span:nth-of-type(1)", function () {
    var userid = $(this).parent().parent().parent().attr("userid");
    goToHomePage(userid);
});
$(".header button:nth-of-type(1)").on("click", function () {
    location.href = "department_list.html"+location.search;
});
function queryListForPublishByme(){
    if (getLocalStroagelogin().token){
        token = getLocalStroagelogin().token;
    }
    var postData = {
        "appToken":token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "pageindex":pageindex,
            "pagesize":pagesize
        }
    };
    $.ajax({
        "url": ebase+"/api/TransHospital/QueryListForPublishByme",
        "data":postData,
        "dataType":"json",
        "type":"POST",
        success: function (data) {
            console.log(data);
            var Data = data.Data;
            $(".turnyard .list").remove();
            $(".turnyard .list_loading").addClass("hide");
            if (Data.length < 1){
                $(".turnyard .unMoreData").removeClass("hide");
            }
            for (var i = 0; i < Data.length; i++){
                var ele = "<div class='list' userid='"+Data[i].UserId+"' detailsId='"+Data[i].Id+"'>" +
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
                    "<p class='check'>查看详情</p>" +
                    "<p class='other'>" +
                    "<span>"+Data[i].CreateTime.substring(0,Data[i].CreateTime.indexOf('T'))+"</span>" +
                    "<span>"+Data[i].ViewCount+"人看过</span>" +
                    "</p>" +
                    "</div>" +
                    "</div>";
                $(ele).insertBefore(".unMoreData");
                if (Data[i].FaceImgUrl){
                    $(".turnyard section .list:nth-of-type("+parseInt((pageindex-1)*pagesize+(i+4))+") .head_portrait").css("background-image","url('"+Data[i].FaceImgUrl+"')")
                }
            }
        },
        error:function(xhr ,errorType ,error) {
            //alert("错误");
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
