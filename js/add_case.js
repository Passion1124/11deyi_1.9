var myPics = [];
var caseData = "";
$(function () {
    //alert(location.href)
    initSelectData();
    if (location.hash){
        $(".add_case").removeClass("hide");
        $(window).scrollTop(0);
        $(".loading_box").addClass("hide");
        var token = getUrlParam("token");
        var userid = getUrlParam("userid");
        var docid = getUrlParam("docid")
        if (token && userid){
            updateLogin();
            getUser(function () {
                console.log("成功修改用户信息");
            });
            if (docid){
                getDoctor(docid, function (data) {
                    var Data = data.Data;
                    createChatUserInfo(Data.Name,Data.FaceImgUrl,Data.HxUserId,Data.UserID);
                })
            }
        }
    }else {
        var uid = getUrlParam("userid");
        getCaseList(uid);
        $(".my_case").removeClass("hide");
    }

})
$(".my_case section").on("click","button", function () {
    $(".my_case").addClass("hide");
    $(".add_case").removeClass("hide");
    window.location = "#add_case";
});
$(".add_case section .patient_more>div textarea").on("focus", function () {
    $(this).parent().find("input[type='date']").focus();
})
$(window).bind('hashchange', function() {
    if (location.hash){
        $(".my_case").addClass("hide");
        $(".add_case").removeClass("hide");
        $("head title").text("添加新的病历")
    }else {
        $(".my_case").removeClass("hide");
        $(".add_case").addClass("hide");
        $("head title").text("我的病历")
    }
})
$("header .back").on("click", function () {
    history.back();
});
$(".add_case section .patient_more div:nth-of-type(1) input[type='date'],.add_case section .patient_more div:last-of-type input[type='date']").on("change", function () {
    $(this).next().val($(this).val());
});
$(".add_case section .patient_info p:nth-of-type(1) span").on("click", function () {
    $(".add_case section .patient_info p:nth-of-type(1) span").each(function (item,index) {
        $(this).removeClass("sex");
    });
    $(this).addClass("sex")
});
$(".add_case section .patient_info p:nth-of-type(2) select").on("change", function () {
    $(".add_case section .patient_info p:nth-of-type(2) span:nth-of-type(1)").text($(this).val());
});
/*---------------------------------------点击完成-------------------------------------------------*/
$(".add_case section .finish").on("click", function () {
    var name = $(".patient_name input").val();
    var sex = "M";
    if ($(".patient_info p:nth-of-type(1) span:nth-of-type(2)").hasClass("sex")){
        sex = "W"
    }
    var age = $(".patient_info p:nth-of-type(2) span:nth-of-type(1)").text();
    var tel = $(".patient_tel input").val();
    var examineTime = $(".patient_more div:nth-of-type(1) textarea").val();
    var examineNumber = $(".patient_more div:nth-of-type(1)+textarea").val();
    var firstTime = $(".patient_more div:last-of-type textarea").val();
    var part = $(".patient_more textarea:nth-of-type(2)").val();
    var result = $(".patient_more textarea:nth-of-type(3)").val();
    var treat = $(".patient_more textarea:nth-of-type(4)").val();
    var pics = "";
    if (myPics.length > 0){
        for (var i = 0; i < myPics.length; i++){
            pics += ","+myPics[i]
        }
    }
    var doctorid = "";
    if (location.search.indexOf("docid") !== -1){
        doctorid = getUrlParam("docid");
    }

    var reg =  /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (!name){
        alert("请输入姓名")
    }else if(!tel){
        alert("请输入您的联系电话");
    }else if(!reg.test(tel)){
        alert("请输入正确的手机号码");
    }else if(!examineTime){
        alert("请输入您的就诊时间")
    }else if(!firstTime){
        alert("请输入您的首发症状时间")
    }else if(!part){
        alert("请输入您的患病疼痛部位")
    }
    var str=$("#in_time").val().replace(/\-/g, "\/");
    var d=new Date(str);
    var now=Date.now();
    var i=1,k=1;
    d>now&&(alert('就诊日期不能早于当前日期！'),i=0);

    var str=$("#find_time").val().replace(/\-/g, "\/");
    var intime=$("#in_time").val().replace(/\-/g, "\/");
    var i=new Date(intime);
    var d=new Date(str);
    d>i&&(alert('患病日期不能晚于就诊日期！'),k=0);
    if (name && tel && reg.test(tel) && examineTime && firstTime && part&&i!=0&&k!=0){
        $(this).attr("disabled","disabled");
        $(".consult_loading").removeClass("hide");
        createCase(sex,age,pics,doctorid,part,result,treat,examineTime,firstTime,examineNumber,name,tel);
    }
});
$(".patient_pics span input[type='file']").on("change",function(event){
    //var fileName = event.target.files[0].name;
    if ($(".patient_pics img").length < 9){
        var file = event.target.files[0];
        getUploadAli(file);
    }else {
        setTimeout(function(){
            alert("上传的图片不能超过9张");
        },400);
    }
});
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}
//获取阿里百川上传鉴权
function getUploadAli(file){
    var fileName = uuid();
    var postData = {
        "appToken":token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "name":fileName
        }
    };
    $.ajax({
        "url": ebase + "/api/Sign/GetUploadSignWithAlibbForImg",
        "type":"POST",
        "data":postData,
        "dataType":"json",
        success: function (data) {
            console.log(data);
            console.log(file);
            //console.log(data.Data)
            if (data.Code === "0000"){
                uploadJSSDK({
                    file: file,   //文件，必填,html5 file类型，不需要读数据流
                    name:fileName,
                    token: 'UPLOAD_AK_TOP ' + data.Data,  //鉴权token，必填
                    dir: 'patient_img',  //目录，选填，默认根目录''
                    retries: 0,  //重试次数，选填，默认0不重试
                    maxSize: 0,  //上传大小限制，选填，默认0没有限制
                    callback: function (percent, result) {
                        console.log(result);
                        if (percent === 100 && result){
                            var html = "<img src='"+result.url+"'>";
                            $(html).insertBefore("#up-btn");
                            myPics.push(result.url);
                        }else {
                            alert("上传失败");
                        }
                        //percent（上传百分比）：-1失败；0-100上传的百分比；100即完成上传
                        //result(服务端返回的responseText，json格式)
                    }
                })
            }
        },
        beforeSend: function () {
            $("#up-info").html(" <img src='img/loading.gif' alt='loading...' class='load'>");
        },
        complete:function(){
            $("#up-info").html("&#xe604;");
        },
        error: function (xhr ,errorType ,error){
            //alert("错误");
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}

$(".my_case section").on("click"," .case_list",function(){
    if (getUrlParam("hxid")){
        $(window).scrollTop(0);
        $('body,html').height('100%').css('overflow','hidden');
        $(".send").removeClass("hide");
        $(".send .send_box .info>p:last-of-type").text("[病历]"+caseData[$(this).index() - 1].UserName+" 就诊时间："+caseData[$(this).index() - 1].VisitingTime)
        createChatSend(caseData[$(this).index() - 1],false,getUrlParam("hxid"))
    }else {
        location.href = "disease_details.html?id="+caseData[$(this).index() - 1].QuestionID;
    }
});
$(".my_case .send .send_btm p:nth-of-type(1)").on("click", function () {
    $(".send").addClass("hide");
    $('body,html').height('auto').css('overflow','auto');
    updateChatSend(false);
})
$(".my_case .send .send_btm p:nth-of-type(2)").on("click", function () {
    updateChatSend(true);
    location.href = "chat.html#id="+getUrlParam("hxid");
})
/*---------------------------------------------------新建病历-----------------------------------------------------*/
function createCase(sex,age,questionpics,doctorid,addr,cureinfo,checkinfo,visitingtime,firstvisitingtime,cardnumber,username,phone){
    getLoginUserToken();
    var postData = {
        "appToken":token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"2.0",
            "sex":sex,                       //性别
            "age":age,                        //年龄
            "questionpics":questionpics,    // 图片
            "doctorid":doctorid,            //医生id
            "addr":addr,                    //疼痛部位
            "cureinfo":cureinfo,            //诊断结果
            "checkinfo":checkinfo,         //做过什么治疗
            "visitingtime":visitingtime,   //就诊时间
            "firstvisitingtime":firstvisitingtime, //首发症状时间
            "cardnumber":cardnumber,  //就诊卡编号
            "username":username,
            "phone":phone
        }
    };
    //alert(postData);
    $.ajax({
        url: ebase + "/api/Question/Submit",
        data: postData,
        type:"POST",
        dataType:"json",
        success: function (data) {
            console.log(data)
            //alert("成功")
            $(".add_case section .finish").removeAttr("disabled");
            if(data.Code === "0000"){
                var caseData = {
                    Age:age,
                    CardNumber: cardnumber,
                    CheckInfo: checkinfo,
                    CreateTime: data.Data.CreateTime,
                    CureInfo: cureinfo,
                    Description: data.Data.Description,
                    FirstVisitingTime: firstvisitingtime,
                    Name: getLocalStroagelogin().name,
                    PatientAddr: addr,
                    Phone: phone,
                    PicUrls: questionpics,
                    QuestionID: data.Data.QuestionID,
                    Sex: sex,
                    Title: "",
                    UserID: getLocalStroagelogin().userid,
                    UserName: username,
                    VisitingTime: visitingtime
                };
                createChatSend(caseData,true,getUrlParam("hxid"));
                $(".consult_loading img").addClass("result").attr("src","img/success@2x.png");
                $(".consult_loading p").text("提交成功");
                if (getUrlParam("hxid")){
                    setTimeout(function () {
                        location.href = "chat.html#id="+getUrlParam("hxid");
                    },300)
                }else {
                    history.back();
                    getCaseList(getUrlParam("userid"));
                    setTimeout(function(){
                        $(".consult_loading").addClass("hide");
                        $(".consult_loading p").text("正在提交");
                        $(".consult_loading img").removeClass("result").attr("src","img/loading.gif");
                    },300);
                }
            }else {
                $(".consult_loading p").text("提交失败");
                $(".consult_loading img").addClass("result").attr("src","img/fail@2x.png");
                setTimeout(function(){
                    $(".consult_loading").addClass("hide");
                    $(".consult_loading p").text("正在提交");
                    $(".consult_loading img").removeClass("result").attr("src","img/loading.gif");
                },300);
            }
            //alert("新建成功")
        },
        error: function (xhr ,errorType ,error){
            alert("错误");
            $(".consult_loading p").text("提交失败");
            $(".consult_loading img").addClass("result").attr("src","img/fail@2x.png");
            setTimeout(function(){
                $(".consult_loading").addClass("hide");
                $(".consult_loading p").text("正在提交");
                $(".consult_loading img").removeClass("result").attr("src","img/loading.gif");
            },300);
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
/*-------------------------------------------------获取病历列表---------------------------------------------------*/
function getCaseList(uid){
    getLoginUserToken();
    var postData = {
        "appToken":token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"2.0",
            "uid":uid,
            "pageindex":pageindex,
            "pagesize":pagesize
        }
    };
    $.ajax({
        url: ebase + "/api/Question/QueryListByUid",
        data: postData,
        type:"POST",
        dataType:"json",
        success: function (data) {
            console.log(data)
            if (data.Code === "0000"){
                var Data = data.Data;
                caseData = Data;
                if (getUrlParam("docid") && getUrlParam("docid") !== "undefined"){
                    getDoctor(getUrlParam("docid"), function (data) {
                        $(".loading_box").addClass("hide");
                        $(".send .send_box .info>div .head_portrait").css("background-image","url('"+data.Data.FaceImgUrl+"')")
                        $(".send .send_box .info>div p:last-of-type").text(data.Data.Name)
                    });
                }else {
                    $(".loading_box").addClass("hide");
                }
                $(".my_case section").empty();
                if (Data.length > 0){
                    var newCase = "<div class='new_case'><button>新建病历</button></div>";
                    $(".my_case section").append(newCase);
                    for (var i = 0; i < Data.length; i++){
                        var ele = "<div class='case_list'>" +
                            "<p>"+Data[i].UserName+"</p>" +
                            "<p>就诊时间："+Data[i].VisitingTime+"</p>" +
                            "<p>"+Data[i].PatientAddr+"</p></div>";
                        $(".my_case section").append(ele);
                    }
                }else {
                    var html = "<div class='not_case'><img src='img/my_case.png' alt=''><p>为了让医生更了解你的病情</p><p>请填写最近就诊的病历信息</p><button>新建病历</button></div>";
                    $(".my_case section").append(html);
                }
            }
        },
        error: function (xhr ,errorType ,error){
            //alert("错误");
            alert("网络异常！请刷新此页面");
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
/*---------------------------------------------获取医生信息-------------------------------------------------------*/
function getDoctor(doctorid,callback){
    getLoginUserToken();
    var postData = {
        "appToken":token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "search_userid":doctorid
        }
    };
    $.ajax({
        url: ebase + "/api/User/QueryUserById",
        data: postData,
        type:"POST",
        dataType:"json",
        success: function (data) {
            console.log(data);
            if (data.Code === "0000"){
                callback(data);
            }
        },
        error: function (xhr ,errorType ,error){
            //alert("错误");
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
/*---------------------------------------------------年龄---------------------------------------------------------*/
function initSelectData(){
    for (var k = 1; k < 13; k++){
        var ele = "<option value='"+k+"月'>"+k+"月</option>";
        $(".add_case .patient_info p:nth-of-type(2) select").append(ele)
    }
    for (var i = 1; i < 101; i++){
        if (i == 18){
            var ele = "<option value='"+i+"岁' selected>"+i+"岁</option>";

        }else {
            var ele = "<option value='"+i+"岁'>"+i+"岁</option>";

        }
        $(".add_case .patient_info p:nth-of-type(2) select").append(ele)
    }
}
