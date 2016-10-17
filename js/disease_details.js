$(function(){
    var id = getUrlParam("id");
    getDetails(id);
});
$("header .back").on("click", function () {
    history.back();
});
$(".present_box button").on("click", function () {
    $(".present_box").addClass("hide");
    $("html,body").removeClass("ovfHiden");
})
function getDetails(id){
    getLoginUserToken();
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
        "url": ebase+ "/api/Question/QueryByIdV2",
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
                var faceImage = "http://www.11deyi.com/img/30.png";
                if (Data.FaceImgUrl){
                    faceImage = Data.FaceImgUrl;
                }
                $("section .head_portrait").css("background-image","url('"+faceImage+"')");
                $("section div:nth-of-type(2) p:nth-of-type(1)").text(Data.UserName);
                $("section div:nth-of-type(2) p:nth-of-type(2) span").text(sex);
                $("section div:nth-of-type(2) p:nth-of-type(3) span").text(Data.Age);
                $("section div:nth-of-type(2) p:nth-of-type(4) span").text(Data.Phone);
                $("section div:nth-of-type(3) p:nth-of-type(1) span").text(Data.VisitingTime);
                $("section div:nth-of-type(3) p:nth-of-type(2) span").text(Data.CardNumber);
                $("section div:nth-of-type(3) p:nth-of-type(3) span").text(Data.FirstVisitingTime);
                $("section div:nth-of-type(3) p:nth-of-type(4) span").text(Data.PatientAddr);
                $("section div:nth-of-type(3) p:nth-of-type(5) span").text(Data.CureInfo);
                $("section div:nth-of-type(3) p:nth-of-type(6) span").text(Data.CheckInfo);
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
                }else {
                    var dontHaveImg = "<p class='noImg'>暂无病历图片</p>"
                    $(dontHaveImg).insertBefore(".img_box")
                }
                var date = Data.CreateTime.indexOf("T");
                var time = Data.CreateTime.substring(0,date);
                $("section div:nth-of-type(4) p:last-of-type").text(time);
                $(".loading_box").addClass("hide");
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