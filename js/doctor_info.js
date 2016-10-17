$(function(){
    init();
    var token = "NzVmNmFkMTYtZmQ0MC0xMWU1LWE4Y2UtYWE1MTk0ZjUwZTY2LDE4MDMwNDk4MzMwLDMzYTBiY2FjLWM5ZjQtNDBkYy1hNjRjLWY3NDIzM2UyMGE4YSw4aVQ0ZjVQQUd0Z3pKUkhVeVN0dTN3TGxyWmtIY3o1dg==";
    var doctorid = location.href.split("?")[1].split("&")[2].split("=")[1];
    $.ajax({
        url:"http://120.76.156.87:660/api/User/QueryUserById",
        type:"POST",
        data:{"appToken":token,"para":{
            "device_type":"PC",
            "device_id":" ",
            "api_version":"1.0.0.0",
            search_userid: doctorid
        }},
        dataType:"json",
        success:function(data){
            console.log(data);
            var Data = data.Data;
            $(".loading").addClass("hide");
            $("section,header").removeClass("hide");
            $("header .title,section .doctor_info .doctor_name").text(Data.Name);
            if (Data.FaceImgUrl != ""){
                $("section .doctor_info .head_portrait").css("background-image","url('"+Data.FaceImgUrl+"')");
            }
            $("section .doctor_info span:nth-of-type(1)").text(Data.DepartTwoName);
            $("section .doctor_info span:nth-of-type(2)").text(Data.JobName);
            $("section .doctor_info .doctor_address").text(Data.City+" / "+ Data.HospitalName);
            if(Data.GoodAt == ""){
                $("section .doctor_content p").text("暂未填写")
            }else {
                $("section .doctor_content p").text(Data.GoodAt)
            }
            $("section .doctor_content span").text(Data.FansNum+"关注");
            if (Data.PriceValue == null){
                $("section .questions_content .questions_text .money").text("免费提问")
            }else {
                $("section .questions_content .questions_text .money").text("￥"+Data.PriceValue)
            }
            $("section .questions .end").text(Data.Name+"已回答了 "+Data.AnswerQuestionNum+" 个问题")
        },
        error: function (xhr ,errorType ,error) {
            alert("错误")
            console.log(xhr)
            console.log(errorType)
            console.log(error)
        }
    })
    $(".people_sex").on("click",function(){
        $(".people_sex").each(function(){
            $(this).removeClass("yes")
        });
        $(this).addClass("yes")
    });
    $(".questions_btm p").on("click",function(){
        if ($(this).hasClass("left")){
            $(this).removeClass("left")
        }else {
            $(this).addClass("left")
        }
    });
    $("select").on("change",function(){
        $(".age").text($("select").val())
    });
    $("header .back").on("click",function(){
        history.back();
    });
});
function init(){
    initSelect();
}
function initSelect(){
    for (var i = 1; i < 13; i++){
        var ele = "<option value='"+i+"月'>"+i+"月</option>";
        $("select").append(ele)
    }
    for (var i = 1; i < 101; i++){
        if (i == 18){
            var ele = "<option value='"+i+"岁' selected>"+i+"岁</option>";

        }else {
            var ele = "<option value='"+i+"岁'>"+i+"岁</option>";

        }
        $("select").append(ele)
    }
}