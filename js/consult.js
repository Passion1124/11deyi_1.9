$(function () {
    if (!location.search){
        var login = getLocalStroagelogin();
        if (login.token){
            getDepList();
            initSelectData();
        }else {
            location.href = "index.html"
        }
    }else {
        getDepList();
        initSelectData();
        $(".price,.remind").addClass("hide");
        $(".price input").val(0);
    }
});
//function getDepList(){
//    var token = "NzVmNmFkMTYtZmQ0MC0xMWU1LWE4Y2UtYWE1MTk0ZjUwZTY2LDE1ODI4NTUwMTY1LDcwNEZFODQ3LTQ3QzItNEM5Mi1BNzJFLUQ4MjQ2RDFBRUREMyxqdE84WXBWcjVCZWYrWVBRV2VVRlNPMTdkSU5pOEd5aA==";
//    var postData = {"appToken":token,"para":{
//        "device_type":"PC",
//        "device_id":"",
//        "api_version":"1.0.0.0"
//    }};
//    $.ajax({
//        url:ebase+"/api/Admin/Question/QueryDepList",
//        type:"POST",
//        data:postData,
//        dataType:"json",
//        success: function (data) {
//            console.log(data);
//            $(".loading").addClass("hide");
//            $("header,section").removeClass("hide");
//            var Data = data.Data;
//            for (var i = 0; i < Data.length; i++){
//                var option = "<option class='opt' depid='"+Data[i].ParentID+"'>"+Data[i].ParentName+"</option>";
//                $(".elect .department select").append(option)
//            }
//        },
//        error: function (xhr ,errorType ,error) {
//            //alert("错误");
//            console.log(xhr);
//            console.log(errorType);
//            console.log(error)
//        }
//    })
//}
//function initSelectData(){
//    for (var i = 1; i < 13; i++){
//        var ele = "<option value='"+i+"月'>"+i+"月</option>";
//        $(".elect .age select").append(ele)
//    }
//    for (var i = 1; i < 101; i++){
//        if (i == 18){
//            var ele = "<option value='"+i+"岁' selected>"+i+"岁</option>";
//
//        }else {
//            var ele = "<option value='"+i+"岁'>"+i+"岁</option>";
//
//        }
//        $(".elect .age select").append(ele)
//    }
//}
$("section .issue").on("click",function(){
    var title = $("section .content textarea").val();
    var sex = $("section .sex_yes").text();
    if (sex == "男"){
        sex = "M"
    }else {
        sex = "W"
    }
    var age = $("section .age span:nth-of-type(1)").text();
    var depname = $("section .department span:nth-of-type(1)").text();
    var questionpics;
    var isanonymous = "N";
    if($("section .question_btm p:nth-of-type(1)").hasClass("cryptonym")){
        isanonymous = "N"
    }else {
        isanonymous = "Y"
    }
    var depid = "";
    $("section .elect .department select option").each(function(item,index){
        if ($("section .elect .department select").val() === $(this).val()){
            depid = $(this).attr("depid");
        }
    });
    var pricevalue = $(".price input").val();
    var doctorid = "";
    var questionpics = "";
    if (title){
        if (depname === "选择科室"){
            alert("请选择科室")
        }else {
            if (!pricevalue){
                alert("请设置答案出价的金额")
            }else {
                var reg = new RegExp("^[0-9]*$");
                if (reg.test(pricevalue) && (0 <= pricevalue && pricevalue <= 10)){
                    $(".consult_loading").removeClass("hide");
                    $(".consult_loading img").removeClass("result");
                    var Type = "consult";
                    var data = {title:title,sex:sex,age:age,depid:depid,depname:depname,questionpics:questionpics,isanonymous:isanonymous,pricevalue:pricevalue,doctorid:doctorid};
                    getToken(function(){
                        issue_consult(title,sex,age,depid,depname,questionpics,isanonymous,pricevalue,doctorid);
                    }, data, Type)
                }else {
                    alert("请输入0-10之间的数字")
                }
            }
        }
    }else {
        alert("内容不能为空")
    }
});
$(".elect .age select").on("change",function(){
    $(this).parent().find("span:nth-of-type(1)").text($(this).val());
});
$(".elect .department select").on("change",function(){
    $(this).parent().find("span:nth-of-type(1)").text($(this).val());
});
$("section .question_btm p:nth-of-type(1)").on("click",function(){
    $(this).toggleClass("cryptonym")
});
$("section .elect .sex").on("click", function () {
    $("section .elect .sex").each(function(item,index){
        $(this).removeClass("sex_yes")
    });
    $(this).addClass("sex_yes");
});
$("section .content textarea").on("input", function () {
    $("section .question_btm .initLength").text($(this).val().length);
});
$(".price input").on("blur",function(){
    var reg = new RegExp("^[0-9]*$");
    var text = $(this).val();
    if (reg.test(text)){
        if (!(0 <= text && text <= 10)){
            alert("请输入0-10之间的数字")
        }
    }else {
        alert("请输入0-10之间的数字")
    }
});
$("header .back").on("click",function(){
    history.back();
});
$(".present_box button").on("click", function () {
    location.href = "index.html"+location.search;
});