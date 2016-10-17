$(function(){
    var dep = getSessionDep();
    $("header .title").text(dep.depName);
    getDoctor(dep.depId);
});
function getSessionDep(){
    var Data = JSON.parse(sessionStorage.dep);
    return Data;
}

function getDoctor(parentid,callback){
    var postData = {"appToken":token,"para":{
        "device_type":"PC",
        "device_id":" ",
        "api_version":"1.0.0.0",
        depid: parentid,
        pageindex:pageindex,
        pagesize:pagesize
    }};
    $.ajax({
        url: ebase + "/api/Doctor/QueryDoctorWithDepId",
        type:"POST",
        data: postData,
        dataType:"json",
        success:function(data){
            $(".loading").addClass("hide");
            if (data.Code === "0000"){
                var Data = data.Data;
                for (var i = 0; i < Data.length; i++){
                    var ele = "<div class='doctor' doctorid='"+Data[i].DoctorId+"'>" +
                        "<div class='head_portrait'></div>" +
                        "<div class='doctor_info'>" +
                        "<span class='doctor_name'>"+Data[i].DoctorName+"</span>" +
                        "<span>"+Data[i].DepartmentName+"</span>" +
                        "<span>"+Data[i].JobLevelName+"</span>" +
                        "<h4>"+Data[i].HName+"</h4>" +
                        "</div>" +
                        "<div class='advisory'>" +
                        "<img src='img/doctor_list_go.png' alt=''>" +
                        "</div>" +
                        "</div>";
                    $("section").append(ele);
                    if (Data[i].FaceImgUrl != null){
                        $("section .doctor:nth-of-type("+parseInt((pageindex-1)*pagesize+(i+1))+") .head_portrait").css("background-image","url('"+Data[i].FaceImgUrl+"')")
                    }
                    if (Data[i].JobLevelName === null){
                        $("section .doctor:nth-of-type("+parseInt((pageindex-1)*pagesize+(i+1))+") span:nth-of-type(3)").addClass("hide")
                    }
                }
                if (Data.length === pagesize){
                    $("footer").removeClass("hide");
                }else {
                    var ele = "<div class='noMoreData'> - 没有了 - </div>";
                    $("section").append(ele);
                }
                if (pageindex !== 1){
                    callback(Data);
                }
            }
        },
        error: function (xhr ,errorType ,error) {
            console.log("错误");
            $(".loading").addClass("hide");
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    });
}
$("header .back").on("click",function(){
    history.back();
});
$("section").on("click",".doctor",function(){
    var doctorid = $(this).attr("doctorid");
    if (location.search){
        location.href = "personage.html"+location.search+"&userid="+doctorid;
    }else {
        location.href = "personage.html?userid="+doctorid;
    }
});
$("footer button").on("click",function(){
    $(this).find("img").removeClass("hide");
    $(this).find("span").addClass("hasImg").text("加载中");
    var dep = getSessionDep();
    var self = this;
    pageindex++;
    getDoctor(dep.depId, function (data) {
        if (data.length === pagesize){
            $(self).find("img").addClass("hide");
            $(self).find("span").removeClass("hasImg ").text("点击加载更多");
        }else {
            $("footer").addClass("hide");
        }
    })
});