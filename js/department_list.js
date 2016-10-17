$(function () {
    getDepartmentList();
});

function getDepartmentList(){
    var postData = {
        "appToken":token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0"
        }
    };
    $.ajax({
        url:ebase+"/api/Admin/Question/QueryDepList",
        type:"POST",
        data:postData,
        dataType:"json",
        success: function (data) {
            console.log(data);
            $(".loading").addClass("hide");
            if (data.Code === "0000"){
                var Data = data.Data;
                for (var i = 0; i < Data.length; i++){
                    var ele = "<div class='department'  depid='"+Data[i].ParentID+"'>" +
                        "<div class='info'>" +
                        "<p>"+Data[i].ParentName+"</p>" +
                        "<p>"+Data[i].DoctorCount+" 个医生</p>" +
                        "</div>" +
                        "<div class='goToPage'>" +
                        "<img src='img/go.png' alt=''>" +
                        "</div>" +
                        "</div>";
                    $("section").append(ele);
                }
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
$("section").on("click",".department", function () {
    var depName = $(this).find(".info p:nth-of-type(1)").text();
    var depId = $(this).attr("depid");
    var dep = {"depName":depName,"depId":depId};
    createSessionDep(dep);
    location.href = "doctor_list.html"+location.search;
});
$("header .back").on("click", function () {
    history.back();
})
function createSessionDep(dep){
    sessionStorage.dep = JSON.stringify(dep);
}