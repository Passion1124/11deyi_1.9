var type = "D";
$("section .identity p").on("click", function () {
    $("section .identity p").each(function (item,index) {
        $(this).removeClass("yes");
        $(this).find("img").attr("src","img/unchecked@2x.png")
    });
    $(this).addClass("yes");
    $(this).find("img").attr("src","img/selected@2x.png")
    var text = $(this).text();
    console.log(text);
    if (text === "医生/ 护士"){
        type = "D";
    }
    if (text === "普通用户"){
        type = "U"
    }
    if (text === "医院"){
        type = "H"
    }
    if (text === "其他机构"){
        type = "O";
    }
});
$("section .verify button").on("click", function () {
    var userid = getLocalStorageUserId();
    var name = getLocalStroagelogin().name;
    updataUser(userid,name)
});
function updataUser(userid,name){
    var login = getLocalStroagelogin();
    var token = login.token;
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
            "type": type,
            "adviser":"wap"
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
                var backurl = getLocalStorageBackUrl();
                location.href = backurl;
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