/**
 * Created by Administrator on 2016/11/10.
 */
var getDeoLength = 0;
$(function () {
    var paperid=getUrlParam('paperid');
    var isDoctor=getUrlParam('isDoctor');
    var docid = getUrlParam("docid");
    var chatid = getUrlParam("chatid");
    var token=getUrlParam('token'),myPics={};
    !token&&(token = getLocalStroagelogin().token);

    //医生用户入口，只可预览
    if(isDoctor){
        getData(paperid);
        notPatient();
        $("#sub").css('opacity','0');
        $("<div id='modal'></div>").insertBefore($("#sub"));
        $("#modal").height($("#box").height()+'px');
    }
    else{
        //-------------------------必须参数  paperid问卷id，name患者id，token，doc
        //获取参数并且更新本地存储
        var userid=getUrlParam('userid');
        var patientId=getUrlParam('name');
        //chose当前患者   senddata填写问卷后的答案数据
        var chose='',senddata='';
        if(!!docid){
            localStorage.docid = docid;
        }
        else{
            docid = localStorage.docid;
        }
        if(!!chatid){
            localStorage.chatid = chatid;
        }
        else{
            chatid = localStorage.chatid;
        }
        //若从网址未获取，尝试从本地读取
        !userid&&(userid= getLocalStroagelogin().userid);
        if(!!token&&!!userid){
            var user=getLocalStroagelogin();
            user.token=token;
            user.userid=userid;
            localStorage.login=JSON.stringify(user);
        }
        if (!localStorage[docid] || !localStorage[chatid + "_info"]){
            getDoc(token);
        }
        var pat_user = getLocalStroagelogin();
        if (!pat_user.name || !pat_user.faceimg){
            getUser(userid, token, function (data) {
                console.log("成功获取用户信息");
            })
        }
        if (!token || !userid || !paperid  || !docid){
            var buttonText = "";
            var pText = "";
            var add = "";
            if (!docid){
                pText = "问卷填写后需要发送给医生，请选择一位医生。";
                buttonText = "找我的医生";
                add = "doc";
            }else if (!userid || !token){
                pText = "你还没有登录";
                buttonText = "微信登录";
                add = "login";
            }else if (!paperid){
                pText = "问卷ID有误，请返回重试";
                $(".present_box .present button").addClass("hide");
            }
            $(".present").addClass(add);
            $(".present_box .present p").text(pText);
            $(".present_box .present button").text(buttonText);
            $(".present_box").removeClass("hide");
            $(".loading_box").addClass("hide");
            console.log("token:"+token+"userid:"+userid+"paperid:"+paperid+"patientId"+patientId);
            return null;
        }
        //检测是否有患者
        var QData = {
            "appToken": token,
            "para": {
                "device_type": "PC",
                "device_id": "",
                "api_version": "1.0.0.0",
                "event": "Q",
                "uid":userid
            }
        };
        $.ajax({
            "url": ebase + "/api/LookUp/OptionUserTemp",
            "type": "POST",
            "data": QData,
            "dataType": "json",
            success: function (data) {
                console.log(data);
                if(!!paperid){
                    getData(paperid);
                }
                else{
                    getData('7840c576a5410073ce8d51dd3116b53a');
                }
                //获取当前用户下患者失败
                if(data['Code']!='0000'){
                    notPatient('N');
                    return;
                };
                var patientData=data['Data'][0];
                //查询成功，但未添加过患者，患者列不存在
                if(!patientData.PatientTemp){
                    notPatient('N');
                    return;
                };
                //查询成功，但患者列并无数据
                if(patientData.PatientTemp.length==0){
                    notPatient('N');
                    return;
                };
                var patient=strToJson(patientData.PatientTemp);
                //uid=patientData['Uid'];
                var h=0;
                if(!patient||patient.length==0){
                    notPatient('N');
                    return;
                }
                else{
                    if(patientId){
                        while(chose==''){
                            console.log(patient[h].id)
                            if(patient[h].id==patientId){
                                chose=patient[h];break;
                            }
                            h++;
                        }
                    }
                    else{
                        chose=patient[0];
                    }
                    $("#patient").html(chose['name']);
                    $("#ptinfo").on('click',function(){
                        location.href='patient_list.html?id=0&questionid='+paperid+'&pid='+chose['id'];
                    });

                    //提交
                    $("#sub").on('click', function () {
                        var postData=getAnswer('Y');
                        !!postData&&$.ajax({
                                "url": ebase + "/api/LookUp/OptionAnswer",
                                "type": "POST",
                                "data": postData,
                                "dataType": "json",
                                success: function (data) {
                                    localStorage.question=JSON.stringify({
                                        'answerid':postData['para']['answerid'],
                                        'state':1,
                                        'title':postData['para']['papertitle'],
                                        'type':'7',
                                        'docid':docid
                                    });
                                    location.href='chat.html#id='+docid + "&chatid=" + chatid;
                                },
                                error: function (xhr, errorType, error) {
                                    //alert("错误");
                                    alert("提交问卷答案超时!");
                                    console.log(xhr);
                                    console.log(errorType);
                                    console.log(error)
                                }
                            });
                    })
                }
            },
            error: function (xhr, errorType, error) {
                //alert("错误");
                alert("ajax进入到错误了！检测是否有患者！");
                console.log(xhr);
                console.log(errorType);
                console.log(error)
            }
        });
    }
    //处理IOS和安卓的css样式bug
    isAndroid&&$("#tell_info>img").css('top','1rem');
    //患者信息不存在
    function  notPatient(){
        $(".header-info").hide();
        localStorage.hasOwnPatient='false';
        $("#sub").on('click', function () {
            var postData=getAnswer('N');
            postData&&(location.href='patient_info.html?id=0&paperid='+paperid);
        });
    }

    //获取填写的答案
    function getAnswer(Is){
        //获取返回的问卷数据遍历添加答案
        var data = strToJson(senddata['Subs']);
        for (var i = 0, leng = data.length; i < leng; i++) {
            var t = $("[data-i='" + i + "']").attr('double');
            data[i].questionnaire = senddata['_id'];
            //data[i].id= md5(String(userid + Date.now() + senddata['_id']));
            if(data[i]['type']!=0){
                var reque=$("[data-i='" + i + "']").attr('required');
                //  t=1是单选和多选,否则是填空或图片
                if (t == 1) {
                    var ck = $("[data-i='" + i + "']:checked");
                    if (ck.length == 0) {
                        if(reque==1){
                            alert("题目："+data[i]['title']+" 未填写,请认真填写完全部问卷再提交！");
                            return null;
                        }
                        else{
                            data[i]['answer'] = [];
                        }
                    }
                    else {
                        delete data[i].required;
                        delete data[i].option;
                        var arr = [];
                        if (data[i].type == 1) {
                            //判断是单选
                            arr.push($(ck).attr('value'));
                        }
                        else {
                            for (var q = 0, len = ck.length; q < len; q++) {
                                arr.push($(ck[q]).attr('name'));
                            }
                            $("[data-i='" + i + "']").last().get(0).type!='checkbox' && arr.push($("[data-i='" + i + "']").last().val());
                        }
                        data[i]['answer'] = arr;
                    }
                }
                else {
                    //图片
                    if (data[i].type == 5) {
                        data[i].answer = myPics[i];
                    }
                    else{
                        var v=$("[data-i='" + i + "']").val();
                        if(!v){
                            if(reque==1){
                                alert("题目："+data[i]['title']+" 未填写,请认真填写完全部问卷再提交！");
                                return null;
                            }
                            else{
                                data[i]['answer'] = [];
                            }
                        }
                        else{
                            data[i].answer = [v];
                        }
                    }

                }
                delete data[i].required;
                delete data[i].rows;
                delete data[i].width;
                delete data[i].number;
            }
            else{}
        }
        console.log( JSON.stringify(data));
        $(".consult_loading").removeClass('hide');
        if(Is=='N'){
            var postData = {
                "appToken": token,
                "para": {
                    "device_type": "PC",
                    "device_id": "",
                    "api_version": "1.0.0.0",
                    "event": "C",
                    "papertitle":senddata['Title'],
                    "paperid": paperid,
                    "answerid": md5(String(userid + Date.now() + senddata['_id'])),
                    "patientid": userid,
                    "uinfo":'',
                    "subjects": JSON.stringify(data)
                }
            };
            localStorage.answerData=JSON.stringify(postData);
            location.href='patient_info.html?id=0&paperid='+paperid;
            return null;
        }
        var postData = {
            "appToken": token,
            "para": {
                "device_type": "PC",
                "device_id": "",
                "api_version": "1.0.0.0",
                "event": "C",
                "papertitle":chose.name+'的'+senddata['Title'],
                "paperid": paperid,
                "answerid": md5(String(userid + Date.now() + senddata['_id'])),
                "patientid": userid,
                "uinfo":JSON.stringify(chose),
                "subjects": JSON.stringify(data)
            }
        };
        return postData;
    }

    //请求问卷数据
    function getData(paperid){
       var postData = {
           "appToken":token,
           "para":{
               "device_type":"PC",
               "device_id":"",
               "api_version":"1.0.0.0",
               "paperid":paperid,
           }
       };
       $.ajax({
           "url": ebase + "/api/LookUp/QueryPaperByUidOrByIdOrForAll",
           "type":"POST",
           "data":postData,
           "dataType":"json",
           success:function(data){
               var questionList=data['Data'];
               if(questionList){
                   initQuestion(questionList);
                   senddata=questionList;
                   console.log(data);
                   $("#box").removeClass('hide');
                   $(".loading_box").addClass('hide');
               }
              else{
                   alert('问卷获取失败！');
               }
           },
           error: function (xhr ,errorType ,error){
               //alert("错误");
               console.log(xhr);
               console.log(errorType);
               console.log(error)
           }
       })
   };

    //生成问卷
    function initQuestion(data){
        var title=data.Des;
        if(!!title){
            $("#tell_info>span").html(title);
        }else{
            $("#tell_info").addClass('hide');
            $(".box").css('paddingTop','1.5rem');
        }
        var result=strToJson(data['Subs']);console.log(result);
        var allhtml='',online= 0,fileEle=[];
        for(var i= 0,len=result.length;i<len;i++){
            var now=result[i];
            var type=parseInt(now['type']);
            var html="";
            switch (type){
                // 单选
                case 1:
                    var option=now['option'];
                    var l1=option.length;
                    html+="<div class='question'><h1 class='title'>"+(now['required']==1?now['title']+'[必填]':now['title'])+"</h1><div class='input_container'>"+"<table class='tb_input' cellpadding='0' cellspacing='0'>";
                        for(var j= 0;j<l1;j++){
                            if(j%2==0){
                                html+="<tr><td><label><input type='radio' double='1' required='"+now['required']+"'  qid='"+now['id']+"'  data-i='"+i+"' value='"+option[j]['title']+"' name="+now['title']+"><i><img src='img/axz@2x.png' alt=''></i><span>";
                                html+=option[j]['title']+"</span></label></td>";
                            }
                            else if(j%2!=0) {
                                html+="<td><label><input type='radio' double='1' required='"+now['required']+"' data-i='"+i+"' qid='"+now['id']+"' value='"+option[j]['title']+"'  name="+now['title']+"><i><img src='img/axz@2x.png' alt=''></i><span>";
                                html+=option[j]['title']+"</span></label></td></tr>";
                            }
                            else if(j%2!=0&&j==(l1-1)){
                                html+="<tr><td></td></tr>";
                            }
                        }
                    html+="</table></div></div>";
                    break;
                //多选
                case 2:
                    var option=now['option'];
                    var l1=option.length;
                    html+="<div class='question'><h1 class='title'>"+(now['required']==1?now['title']+'[必填]':now['title'])+"</h1><div class='input_container'><table class='tb_input' cellpadding='0' cellspacing='0'>";
                    for(var j= 0;j<l1;j++){
                        if(option[j]['type']==2){
                            var last="<tr><td colspan='2'><h2>"+option[j]['title']+"</h2>" +
                                "<input type='text'  double='1' qid='"+now['id']+"' data-i='"+i+"' class='another_desc' name='"+option[j]['title']+"'></td></tr>";
                        }else{
                            if(j%2==0){
                                html+="<tr><td><label>" +
                                    "<input type='checkbox' double='1' required='"+now['required']+"' qid='"+now['id']+"' data-i='"+i+"' name="+option[j]['title']+">" +
                                    "<b><img src='img/xz@2x.png' alt=''></b><span>";
                                html+=option[j]['title']+"</span></label></td>";
                            }
                            else if(j%2!=0) {
                                html+="<td><label>" +
                                    "<input type='checkbox' double='1' qid='"+now['id']+"' required='"+now['required']+"' data-i='"+i+"' name="+option[j]['title']+">" +
                                    "<b><img src='img/xz@2x.png' alt=''></b><span>";
                                html+=option[j]['title']+"</span></label></td></tr>";
                            }
                            else if(j%2!=0&&j==(l1-1)){
                                html+="<td><label>" +
                                    "<input type='checkbox' double='1' required='"+now['required']+"' qid='"+now['id']+"' data-i='"+i+"' name="+option[j]['title']+">" +
                                    "<b><img src='img/xz@2x.png' alt=''></b><span>";
                                html+=option[j]['title']+"</span></label></td><td></td></tr>";
                            }
                        }
                    }
                    html+=last;
                    html+="</table></div></div>";
                    break;
                //填空
                case 3:
                    if(now['width']==50){
                        if(online==0){
                            html+="<div class='question'><div class='t_left'><h1 class='title'>"+(now['required']==1?now['title']+'[必填]':now['title'])+
                            "</h1><div class='input_line'><textarea class='area' required='"+now['required']+"' double='2'  qid='"+now['id']+"' data-i='"+i+"' rows='"+now['rows']+"'></textarea></div></div>";
                            online++;
                        }
                        else{
                            html+="<div class='t_left'><h1 class='title'>"+(now['required']==1?now['title']+'[必填]':now['title'])+
                                "</h1><div class='input_line'><textarea class='area' double='2' required='"+now['required']+"' qid='"+now['id']+"' data-i='"+i+"' rows='"+now['rows']+"'></textarea></div></div></div></div>";
                            online=0;
                        }
                    }
                    else{
                        html+="<div class='question'><h1 class='title'>"+(now['required']==1?now['title']+'[必填]':now['title'])+"</h1><div class='input_line'><textarea class='area' double='2' required='"+now['required']+"'  qid='"+now['id']+"' data-i='"+i+"' rows='"+now['rows']+"'></textarea></div></div>";
                    }
                    break;
                //日期
                case 4:
                    if(now['width']==50){
                        if(online==0){
                            html+="<div class='question'><div class='t_left'><h1 class='title'>"+(now['required']==1?now['title']+'[必填]':now['title'])+
                                "</h1><div class='input_short'><p class='birth'><span id='first_date' class='date-span'></span><span class='dateimg'><img src='img/rq@2x.png' alt=''></span><input type='date' double='2' required='"+now['required']+"' qid='"+now['id']+"' data-i='"+i+"' unselectable='on' class='birth_time'></p></div></div>";
                            online++;
                        }
                        else{
                            html+="<div class='t_left'><h1 class='title'>"+(now['required']==1?now['title']+'[必填]':now['title'])+
                                "</h1><div class='input_short'><p class='birth'><span id='first_date' class='date-span'></span><span class='dateimg'><img src='img/rq@2x.png' alt=''></span><input type='date' double='2' required='"+now['required']+"' qid='"+now['id']+"' data-i='"+i+"' unselectable='on' class='birth_time'></p></div></div></div>";
                            online=0;
                        }
                    }
                    else{
                        html+="<div class='question'><h1 class='title'>"+(now['required']==1?now['title']+'[必填]':now['title'])+
                            "</h1><div class='input_short'><p class='birth'><span id='first_date' class='date-span'></span><span class='dateimg'><img src='img/rq@2x.png' alt=''></span><input type='date' required='"+now['required']+"' double='2' qid='"+now['id']+"' data-i='"+i+"' unselectable='on' class='birth_time'></p></div></div>";
                    }
                    break;
                //文件
                case 5:
                    fileEle.push(i);
                    html+="<div class='question'><h1 class='title'>"+now['title']+"</h1><div filearr='"+i+"' class='file_container'><span filearr='"+i+"'  class='upfile'><span id='up-info' class='upfile'><img src='./img/xj@2x.png' alt='uploading'/></span><input num='"+now['number']+"' required='"+now['required']+"'  qid='"+now['id']+"' data-i='"+i+"' type='file' accept = 'image/*'></span></div></div>";
                    myPics[i]=[];
                    break;
            }
            allhtml+=html;
        }
        var u='undefined';
        allhtml.replace(/u/g,'');
        $(allhtml).insertBefore($("#sub"));
        //  初始化绑定事件
        $(".patient_question").on('change',$(".birth_time"),function(e){
            var ev=$(e.target);
            ev.prev().prev().html(ev.val());
        });
        $(".file_container").on('click','b',function(){
            var picidx=$(this).parent().parent().attr('filearr');
            var idx=$(this).parent().index();
            myPics[picidx.toString()].splice(idx,1);console.log(myPics);
            $(this).parent().remove();
        });
        if(fileEle.length!=0){
            for(var f = 0;f < fileEle.length;f++){
                //文件上传
                $("span[filearr='"+fileEle[f]+"']").on("change","input[type='file']",function(event){
                    var imagefile=event.target.files[0];
                    var fileName = imagefile.name;
                    if(fileName){
                        var ev_p=$(event.target).parent();
                        console.log('change');
                        var max=parseInt($(event.target).attr("num"));
                        var picidx=ev_p.attr('filearr');
                        !max&&(max=1);
                        if ($("div[filearr='"+ev_p.attr('filearr')+"']>.upimg").length < max){
                            $("<div class='upimg up'><div class='loadDiv'><img src='img/animation.gif' alt=''></div><b></b><img src='"+URL.createObjectURL(imagefile)+"' alt='loading...' class='load'/></div>").insertBefore($(this).parent());
                            $(".file_container input[type='file']").attr('disabled','');
                            var file = event.target.files;
                            if(file.length!=0){
                                var file=file[0];
                                var resCanvas = document.getElementById('test');
                                var myimage=new Image();
                                myimage.src=URL.createObjectURL(file);
                                myimage.onload=function() {
                                    if (typeof myimage.naturalWidth == "undefined") {
                                        // IE 6/7/8
                                        var w = myimage.width;
                                        var h = myimage.height;
                                    }
                                    else {
                                        // HTML5 browsers
                                        var w = myimage.naturalWidth;
                                        var h = myimage.naturalHeight;
                                    }
                                    //判断是否需要压缩
                                    if ((file.size / 1024) > 60) {
                                        //若需要进行压缩，判断手机型号
                                        if (isAndroid) {
                                            var mpImg = new MegaPixImage(file);
                                            mpImg.render(resCanvas, {
                                                maxWidth: w,
                                                maxHeight: h,
                                                quality: .5
                                            }, function () {
                                                blobObj.getBlob(resCanvas.src, function (blob) {
                                                    getUploadAli(blob, picidx);
                                                })
                                            });
                                        }
                                        else {
                                            var orientation;
                                            EXIF.getData(file, function () {
                                                orientation = EXIF.getTag(this, 'Orientation');
                                            });
                                            var reader = new FileReader();
                                            reader.onload = function (e) {
                                                getImgData(this.result, orientation, function (data) {
                                                    //这里可以使用校正后的图片data了
                                                    blobObj.getBlob(data, function (blob) {
                                                        var mpImg = new MegaPixImage(blob);
                                                        mpImg.render(resCanvas, {
                                                            maxWidth: w,
                                                            maxHeight: h,
                                                            quality:.2
                                                        }, function () {
                                                            blobObj.getBlob(resCanvas.src, function (newblob) {
                                                                getUploadAli(newblob, picidx);
                                                            })
                                                        });
                                                    });
                                                });
                                            }
                                            reader.readAsDataURL(file);
                                        }
                                    }
                                    else {
                                        getUploadAli(file, picidx);
                                    }
                                };
                            }
                            else{return;}
                        }else {
                            setTimeout(function(){
                                alert("上传的图片不能超过"+max+"张！");
                            },200);
                            return;
                        }
                    }
                });
            }
        }
    }

    //图片信息获取
    function getImgData(img,dir,next){
        var image=new Image();
        image.src=img;
        image.onload=function(){
            var degree=0,drawWidth,drawHeight,width,height;  drawWidth=this.naturalWidth;    drawHeight=this.naturalHeight;  //以下改变一下图片大小
            var maxSide = Math.max(drawWidth, drawHeight);
            if (maxSide > 1280) {
                var minSide = Math.min(drawWidth, drawHeight);    minSide = minSide / maxSide * 1280;    maxSide = 1280;
                if (drawWidth > drawHeight) {
                    drawWidth = maxSide;      drawHeight = minSide;
                }
                else {
                    drawWidth = minSide;      drawHeight = maxSide;
                }
            }
            var canvas=document.createElement('canvas');  canvas.width=width=drawWidth;  canvas.height=height=drawHeight;
            var context=canvas.getContext('2d');
            //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
            switch(dir){
                //iphone横屏拍摄，此时home键在左侧
                case 3:      degree=180;      drawWidth=-width;      drawHeight=-height;      break;
                //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
                case 6:      canvas.width=height;      canvas.height=width;       degree=90;      drawWidth=width;      drawHeight=-height;      break;    //iphone竖屏拍摄，此时home键在上方
                case 8:      canvas.width=height;      canvas.height=width;       degree=270;      drawWidth=-width;      drawHeight=height;      break;
            }
            //使用canvas旋转校正
            context.rotate(degree*Math.PI/180);  context.drawImage(this,0,0,drawWidth,drawHeight);
            //返回校正图片
            next(canvas.toDataURL("image/jpeg",.2));
        }
    }

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
    function getUploadAli(file,picidx){
        var ali=localStorage['Ali_token'];
        var fileName = uuid();
        if(!!ali){
            qusUpAli(fileName,ali,file,picidx);
        }
        else{
            qusGetAli(fileName,file,picidx);
        }
    }

    function qusGetAli(fileName,file,picidx){
        if (!token){
            token = getLocalStroagelogin().token;
        }
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
                //console.log(data.Data)
                if (data.Code === "0000"){
                    localStorage.setItem('Ali_token',data.Data);
                    qusUpAli(fileName,data.Data,file,picidx);
                }
            },
            error: function (xhr ,errorType ,error){
                //alert("错误");
                alert("上传失败，请重新上传！");
                $(".file_container input[type='file']").removeAttr('disabled');
                $("section img[src='img/loading.gif']").remove();
                console.log(xhr);
                console.log(errorType);
                console.log(error)
            }
        })
    }
    function qusUpAli(fileName,ali,file,picidx){
        uploadJSSDK({
            file: file,   //文件，必填,html5 file类型，不需要读数据流
            name:fileName,
            token: 'UPLOAD_AK_TOP ' + ali,  //鉴权token，必填
            dir: 'patient_img',  //目录，选填，默认根目录''
            retries: 0,  //重试次数，选填，默认0不重试
            maxSize: 0,  //上传大小限制，选填，默认0没有限制
            callback: function (percent, result) {
                if (percent === 100 && result){
                    //$("#up-btn").prev().attr("src",result.url);
                    myPics[picidx].push(result.url);
                    $(".file_container .upimg.up .loadDiv").remove();
                    $(".upimg.up").removeClass('up');
                }else if (percent === -1){
                    alert("上传失败");
                    $(".file_container .upimg.up .loadDiv").parent().remove();
                    $(".upimg.up").remove();
                }
                $(".file_container input[type='file']").removeAttr('disabled');
                //percent（上传百分比）：-1失败；0-100上传的百分比；100即完成上传
                //result(服务端返回的responseText，json格式)
            }
        })
    }
});

$(".present_box .present").on("click","button", function () {
    var father = $(this).parent();
    if (father.hasClass("doc")){
        location.href = "http://www.11deyi.com/"+Api+"/Weixin/profile?type=MD";
    }else if (father.hasClass("login")){
        localStorage.goLogin = location.href;
    }
});

function getDoc(token){
    var postData = {
        "appToken":token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "search_userid":localStorage['docid']
        }
    };
    $.ajax({
        "url": phpEbase + "/api/php/QueryUserById",
        "type":"POST",
        "data":postData,
        "dataType":"json",
        success:function(data){
            console.log(data);
            if (data.Code === "0000"){
                getDeoLength = 0;
                var docData = data.Data;
                createChatDoctorInfo(docData.UserId,docData.Name,docData.HeadImg);
                createDoctorOrUserInfo(docData.UserId,docData.Name,docData.HeadImg);
            }else {
                getDeoLength++;
                console.log("请求没成功，准备重新请求");
                if (getDeoLength < 3){
                    getDoc();
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