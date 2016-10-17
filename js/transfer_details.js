$(function(){
    var appToken = getUrlParam("token");
    var id = getUrlParam("id");
    getDetails(appToken,id);
});
$("header .back").on("click", function () {
    history.back();
});
$(".present_box button").on("click", function () {
    $(".present_box").addClass("hide");
    $("html,body").removeClass("ovfHiden");
})
$(".details_content .accept").on("click", function () {
    $(".consult_loading").removeClass("hide");
    var appToken = getUrlParam("token");
    var id = getUrlParam("id");
    accept(appToken,id);
});
function getDetails(appToken,id){
    if (appToken){
        token = appToken;
    }else {
        getLoginUserToken();
    }
    var postData = {
        "appToken": token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "id": id
        }
    };
    console.log(token);
    $.ajax({
        "url": ebase+ "/api/TransHospital/QueryThDetialbyId",
        "type":"POST",
        "dataType":"json",
        "data":postData,
        success:function(data){
            console.log(data);
            if (data.Code === "0000"){
                var Data = data.Data;
                var sex = "";
                if (Data.Sex === "M"){
                    sex = "男"
                }else {
                    sex = "女"
                }
                $(".loading_box").addClass("hide");
                $(".details .head_portrait").css("background-image","url('"+Data.FaceImgUrl+"')");
                $(".details_content p:nth-of-type(1) span:nth-of-type(1)").text(Data.Name);
                $(".details_content p:nth-of-type(2) span:nth-of-type(1)").text(Data.DepartmentName);
                $(".details_content p:nth-of-type(2) span:nth-of-type(2)").text(Data.Addr);
                $(".details_content p:nth-of-type(3) span:nth-of-type(2)").text(sex+"，"+Data.Age+"。"+Data.PatientDes);
                $(".details_content p:nth-of-type(4) span:nth-of-type(2)").text(Data.PatientTimeLong);
                $(".details_content p:nth-of-type(5) span:nth-of-type(2)").text(Data.CureDes);
                $(".details_content p:nth-of-type(6) span:nth-of-type(2)").text(Data.CheckInfo);
                var pics = Data.Pics;
                if (pics.length > 0){
                    var imgwh = "1080x1920";
                    var img = "";
                    for (var i = 0; i < pics.length; i++){
                        img += "<figure itemscope itemtype='1'>" +
                            "<a id='minimg"+0+i+"' href='"+pics[i]+"' itemprop='contentUrl' data-size='"+imgwh+"'>" +
                            "<img src='"+pics[i]+"' itemprop='thumbnail' alt='Image description'/>" +
                            "</a>" +
                            "<figcaption itemprop='caption description'>"+(i+1)+"</figcaption>" +
                            "</figure>";
                        var url = pics[i];
                        var k2=0+""+i;
                        getImageWidth(url,k2,function(w,h,x){
                            setTimeout(function () {
                                var imgwh2=w+"x"+h;
                                $("#minimg"+x).attr("data-size",imgwh2);
                            }, 20)
                        });
                    }
                    var imgBox = '<div class="Pics my-simple-gallery" itemscope itemtype="http://schema.org/ImageGallery">'+img+'</div>';
                    $(".img_box").append(imgBox);
                    initPhotoSwipeFromDOM('.my-simple-gallery');
                }
                var date = Data.CreateTime.indexOf("T");
                var time = Data.CreateTime.substring(0,date);
                $(".details_content .time_heat span:nth-of-type(1)").text(time);
                $(".details_content .time_heat span:nth-of-type(2)").text("有"+Data.ViewCount+"人看过");
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

function accept(appToken ,id){
    if (appToken){
        token = appToken;
    }else {
        getLoginUserToken();
    }
    var postData = {
        "appToken":token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "id":id,
            "isaccept":"Y"
        }
    };
    $.ajax({
        url: ebase + "/api/TransHospital/Accept",
        type:"POST",
        dataType:"json",
        data:postData,
        success: function (data) {
            console.log(data);
            if (data.Code === "0000"){
                $(".consult_loading").addClass("hide");
                $(".present_box").removeClass("hide");
                $(window).scrollTop(0);
                $("html,body").addClass("ovfHiden");
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