$(function(){
    var id = getUrlParam("id");
    var token = getUrlParam("token");
    getDetails(id,token);
});
$("header .back").on("click", function () {
    history.back();
});
$(".present_box button").on("click", function () {
    $(".present_box").addClass("hide");
    $("html,body").removeClass("ovfHiden");
});
function getDetails(id,token){
    var postData = {
        "appToken": token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"3.0",
            "id": id
        }
    };
    //console.log(token);
    $.ajax({
        "url": ebase+ "/api/Question/QueryById",
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
                if (!isAndroid){
                    $("section>div:nth-of-type(1) div:nth-of-type(2)").css("margin-top","-.3rem");
                    $("section>div:last-of-type .img_box").removeClass("fontSize");
                }
                $("section .head_portrait").css("background-image","url('"+faceImage+"')");
                $("section>div:nth-of-type(1) div:nth-of-type(2) p:nth-of-type(1)").text(Data.Author);
                $("section>div:nth-of-type(2) p:nth-of-type(1) span").text(Data.UserName);
                $("section>div:nth-of-type(2) p:nth-of-type(2) span").text(sex);
                $("section>div:nth-of-type(2) p:nth-of-type(3) span").text(Data.Age);
                $("section>div:nth-of-type(2) p:nth-of-type(4) a").attr("href","tel:"+Data.Phone).text(Data.Phone);
                $("section>div:nth-of-type(3) p:nth-of-type(1) span").text(Data.VisitingTime);
                $("section>div:nth-of-type(3) p:nth-of-type(2) span").text(Data.CardNumber);
                $("section>div:nth-of-type(3) p:nth-of-type(3) span").text(Data.FirstVisitingTime);
                $("section>div:nth-of-type(4) p:nth-of-type(1) span").text(Data.PatientAddr);
                $("section>div:nth-of-type(4) p:nth-of-type(2) span").text(Data.CureInfo);
                $("section>div:nth-of-type(4) p:nth-of-type(3) span").text(Data.CheckInfo);
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
                var notes = Data.Notes;
                if (notes.length > 0){
                    for (var x = 0; x < notes.length; x++){
                        if (notes[x].NoteResultInfo){
                            var diagnosisEle = "<p>"+notes[x].Uname+"批注："+notes[x].NoteResultInfo+"</p>";
                            $("section .count .diagnosis_postil").append(diagnosisEle);
                        }
                        if (notes[x].NoteCureInfo){
                            var cureEle = "<p>"+notes[x].Uname+"批注："+notes[x].NoteCureInfo+"</p>";
                            $("section .count .cure_postil").append(cureEle);
                        }
                        if (notes[x].Pics.length > 0){
                            var imgs = notes[x].Pics;
                            var content = "";
                            var z = x;
                            var imgwh = "1080x1920";
                            if (pics.length > 0){
                                z += 1;
                            }
                            for (var y = 0; y < imgs.length; y++ ){
                                content += "<figure itemscope itemtype='1'><a id='minimg"+z+y+"' href='"+imgs[y]+"' itemprop='contentUrl' data-size='"+imgwh+"'><img src='"+imgs[y]+"'  alt='此图片已过期' itemprop='thumbnail' alt='Image description' /></a><figcaption itemprop='caption description'>"+(y+1)+"</figcaption></figure>";
                                var imgurl = imgs[y];
                                var k3=z+""+y;
                                getImageWidth(imgurl,k3,function(w,h,x){
                                    setTimeout(function () {
                                        var imgwh2=w+"x"+h;
                                        $("#minimg"+x).attr("data-size",imgwh2);
                                    }, 20)
                                });
                            }
                            var ele = '<div class="Pics my-simple-gallery" itemscope itemtype="http://schema.org/ImageGallery">'+content+'</div>'
                            var img_postil = "<div><p>"+notes[x].Uname+"批注：</p><div>"+ele+"</div></div>";
                            $("section>div:last-of-type .img_postil").append(img_postil);
                            initPhotoSwipeFromDOM('.my-simple-gallery');
                        }
                    }
                }
                var date = Data.CreateTime.replace(/-/g,"/").split("T");
                var hour = date[1].split(":")[0];
                var min = date[1].split(":")[1];
                var time = date[0]+" "+hour+":"+min;
                $("section>div:nth-of-type(1) div:nth-of-type(2) p:last-of-type").text("填表时间："+time);
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