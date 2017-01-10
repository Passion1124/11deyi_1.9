var token = getLocalStroagelogin().token;
var uid = getLocalStroagelogin().userid;
var pid = getUrlParam("pid");
var paperid = getUrlParam("questionid");
$(function () {
    if (isAndroid){
        $(".selector p:nth-of-type(2):before").css("line-height","2.2rem");
    }
    var postData = {
        appToken : token,
        para: {
            device_type: "PC",
            device_id: "",
            api_version: "1.0.0.0",
            uid: uid,
            event: "Q"
        }
    };
    $.ajax({
        url: ebase + "/api/LookUp/OptionUserTemp",
        type: "POST",
        data: postData,
        dataType: "json",
        success: function(data){
            console.log(data);
            if (data.Code === "0000"){
                var patientData = JSON.parse(data.Data[0].PatientTemp);
                for (var i = 0; i < patientData.length; i++){
                    var ele = "<div class='patient' patientId='"+patientData[i].id+"'>" +
                        "<p></p>" +
                        "<p>"+patientData[i].name+"</p>" +
                        "<div class='right'><img src='img/xg@2x.png' alt=''></div></div>";
                    $(ele).insertBefore("section .add_patient");
                }
                //$("section .patient:nth-of-type(1)").addClass("selector");
                $("section .patient[patientid='"+pid+"']").addClass("okey");
            }
            $(".loading_box").addClass("hide");
        },
        error: function (xhr ,errorType ,error){
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
});
$("section").on("click", ".patient", function (e) {
    var patient = $(this).attr("patientid");
    location.href = "question.html?paperid="+paperid+"&name="+patient;
});
$("section").on("click", ".patient .right", function (event) {
    event.stopPropagation();
    var patient = $(this).parent().attr("patientid");
    location.href = "patient_info.html?id=1&name="+patient+"&paperid="+paperid;
});
$(".add_patient").on("click", function () {
    location.href = "patient_info.html?id=0&paperid="+paperid;
});