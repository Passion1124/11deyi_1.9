$("header .back").on("click",function(){
    history.back();
});

$("section>button").on("click", function () {
    var tel = $("section input:nth-of-type(1)").val();
    var code = $("section input:nth-of-type(2)").val();
    var pwd = $("section input:nth-of-type(3)").val();
    var reg =  /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (!reg.test(tel)){
        alert("请输入正确的手机号码");
    }else  if (!pwd){
        alert("密码不能为空,请输入您的密码")
    }else if (reg.test(tel) && pwd){
        register(tel, code, pwd);
    }
});
$("section div button").on("click", function () {
    var tel = $("section input:nth-of-type(1)").val();
    if (tel){
        getCode(tel);
        $(this).addClass("send");
        $(this).attr("disabled",true);
        var timelong = 59;
        var self = this;
        $(self).text(timelong);
        var codeTime = setInterval(function(){
            $(self).text(timelong--);
            if (timelong === 0){
                clearInterval(codeTime);
                $(self).removeClass("send");
                $(self).text("获取验证码");
                $(self).removeAttr("disabled")
            }
        },1000);
    }else {
        alert("请输入您的手机号");
    }
});

function getCode(tel){
    var postData = {
        "appToken":token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "phone": tel,
            "codetype":0
        }
    };
    $.ajax({
        "url": ebase+"/api/User/SendCode",
        "data": postData,
        "type":"POST",
        "dataType":"json",
        success: function (data) {
            console.log(data);
            if (data.Code === "0000"){

            }
            if (data.Code === "0006"){
                //alert("账号已经注册,请去登陆吧！")
                if (confirm("账号已经注册,是否去登陆！")){
                    location.href = "login.html"
                }
            }
        },
        error: function (xhr ,errorType ,error) {
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
function register(tel, code, pwd){
    var postData = {
        "appToken":token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "codetype": 2,
            "phone": tel,
            "code": code,
            "pwd": pwd
        }
    };
    $.ajax({
        "url": ebase+"/api/User/ValidityCode",
        "data": postData,
        "type":"POST",
        "dataType":"json",
        success: function (data) {
            console.log(data);
            if (data.Code === "0000"){
                addLocalStorageLogin(function(login){
                    login.token = data.Data.AppToken;
                    login.tel = tel;
                    login.name = "用户"+tel.substring(8);
                    localStorage.login = JSON.stringify(login);
                });
                createUserId(data.Data.UserID);
                location.href = "basic_info.html";
            }
        },
        error: function (xhr ,errorType ,error) {
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}