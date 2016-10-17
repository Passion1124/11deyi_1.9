$("header .back").on("click",function(){
    history.back();
});
$("footer").on("click",function(){
    location.href = "register.html"
});
$("section input").bind("focus", function () {
    $("footer").hide();
}).bind("blur", function () {
    setTimeout(function () {
        $("footer").show();
    },450)
});
$("section button").on("click",function(){
    var tel = $("section input:nth-of-type(1)").val();
    var pwd = $("section input:nth-of-type(2)").val();
    var reg =  /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (!reg.test(tel)){
        alert("请输入正确的手机号码");
    }else {
        if (pwd){
            $(this).text("正在登陆...");
            login(tel,pwd);
        }else {
            alert("密码不能为空")
        }
    }
});

function login(tel,pwd){
    var postData = {
        "appToken":"",
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "phone":tel,
            "pwd":pwd
        }
    };
    $.ajax({
        "url":ebase+"/api/User/Login",
        "type":"POST",
        "data":postData,
        "dataType":"json",
        success:function(data){
            console.log(data);
            var Data = data.Data;
            if (data.Code === "0000"){
                console.log(Data);
                addLocalStorageLogin(function(login){
                    login.token = Data.token;
                    login.tel = Data.userInfo.Phone;
                    login.name = Data.userInfo.Name;
                    login.faceimg = Data.userInfo.FaceImgUrl;
                    login.userid = Data.userInfo.UserID;
                    localStorage.login = JSON.stringify(login);
                });
                localStorage.hxuser = Data.userInfo.HxUserId;
                localStorage.hxpwd = Data.userInfo.HxUserPwd;
                var backUrl = getLocalStorageBackUrl();
                location.href = backUrl;
            }
            if (data.Code === "0005"){
                $("section button").text("登陆");
                $(".hint").text("账号或密码有误,请重试");
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