/**
 * Created by Administrator on 2016/11/10.
 */
$(function(){
    for(var i=1;i<100;i++){
        $("#age").append("<option value='"+i+"'>"+i+"岁</option>");
    }
    var userid= getLocalStroagelogin().userid;
    !userid&&(userid=getUrlParam('userid'));
    //!userid&&(alert('微信授权拉取失败！'));
    var id=getUrlParam('id'),patient_data="",type='M';
    var reg =  /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    var paperid=getUrlParam('paperid');
    if (!token){
        token = getLocalStroagelogin().token;
    }
    var QData = {
        "appToken": token,
        "para": {
            "device_type": "PC",
            "device_id": "",
            "api_version": "1.0.0.0",
            "event": "Q",
            "uid": userid
        }
    };
    //首先查询
    $.ajax({
        "url": ebase + "/api/LookUp/OptionUserTemp",
        "type": "POST",
        "data": QData,
        "dataType": "json",
        success: function (data) {
            var patientId=getUrlParam('name');
            // ---------------------- 新增(id=0)-----------------------
            if(!patientId||id==0){
                $("#sub").on('click', function () {
                    var username=$("#username").val();
                    var sex=$(".sex").attr("value");
                    var age=$("#age option:checked").val();
                    var phone=$("#phone").val();
                    var now=new Date(parseInt(Date.now()));
                    var birth=(now.getFullYear()-parseInt(age))+'-01-01';
                    //var isdefault=$(".is_default").hasClass('check_default')?'Y':'N';
                    if(!!username&&!!sex&&!!age&&!!phone){
                        if(!reg.test(phone)){
                            alert('请输入正确的电话号码！');return;
                        }
                        if($("#age").prev().prev().html()=='年龄'){
                            alert('请选择您的年龄！');return;
                        }
                        $(".consult_loading").removeClass('hide');
                        //------------------患者数据---------------
                        var p_data={
                            'name':username,
                            'id':md5(String(userid+Date.now())),
                            'sex':sex,
                            'birthday':Date.parse(birth),
                            'tel':phone,
                        };
                        var did=p_data['id'],has=1    //患者id

                        if(data['Code']!='0009'){
                            patient_data=data['Data'][0];
                            !patient_data.PatientTemp&&(patient_data.PatientTemp=[]);
                            if(patient_data.PatientTemp.length!=0){
                                //if(isdefault=='Y'){
                                //    var parr=strToJson(patient_data.PatientTemp);
                                //    parr.splice(0,0,p_data);
                                //    patient_data.PatientTemp=parr;
                                //}
                                //else{
                                    var parr=patient_data.PatientTemp;
                                    parr=(strToJson(parr));
                                    parr.push(p_data);
                                    patient_data.PatientTemp=parr;
                                //}
                            }
                            else{
                                var parr=[];
                                parr.push(p_data);
                                patient_data.PatientTemp=parr;
                            }
                        }
                        else{
                           has=0;type='C';
                        }

                        //----------------------------发送新增患者请求--------------------
                        var CData = {
                            "appToken": token,
                            "para": {
                                "device_type": "PC",
                                "device_id": "",
                                "api_version": "1.0.0.0",
                                "event": type,
                                "uid": userid,
                                "subjects":has==1?patient_data.PatientTemp:[p_data]
                            }
                        };
                        $.ajax({
                            "url": ebase + "/api/LookUp/OptionUserTemp",
                            "type": "POST",
                            "data": CData,
                            "dataType": "json",
                            success: function (data) {
                                //若存在本地问卷答案
                                if(localStorage.hasOwnPatient=='false'){
                                    var answerdata=localStorage.answerData;
                                    console.log(answerdata);
                                    if(answerdata){
                                        answerdata=strToJson(answerdata);
                                        answerdata.para.uinfo=JSON.stringify(p_data);
                                        answerdata.para.papertitle=p_data.name+'的'+answerdata.para.papertitle;
                                        console.log(answerdata);
                                        //上传问卷答案
                                        $.ajax({
                                            "url": ebase + "/api/LookUp/OptionAnswer",
                                            "type": "POST",
                                            "data": answerdata,
                                            "dataType": "json",
                                            success: function (data) {
                                                var docid=localStorage.docid;
                                                if(docid){
                                                    localStorage.question=JSON.stringify({
                                                        'answerid':answerdata['para']['answerid'],
                                                        'state':true,
                                                        'title':answerdata['para']['papertitle'],
                                                        'type':'7',
                                                        'docid':docid
                                                    });
                                                    localStorage.removeItem('hasOwnPatient');
                                                    localStorage.removeItem('answerData');
                                                    location.href='chat.html#id='+docid +"&chatid=" + localStorage.chatid;
                                                }
                                               else{
                                                    console.log('docid is not define!');
                                                }
                                            },
                                            error: function (xhr, errorType, error) {
                                                //alert("错误");
                                                alert("创建问卷答案报错!");
                                                console.log(xhr);
                                                console.log(errorType);
                                                console.log(error)
                                            }
                                        });
                                    }
                                    else{
                                        console.log('没有问卷答案提交!');
                                    }
                                }
                                else{
                                    location.href='question.html?name='+did+"&paperid="+paperid;
                                }
                            },
                            error: function (xhr, errorType, error) {
                                //alert("错误");
                                console.log(xhr);
                                console.log(errorType);
                                console.log(error)
                            }
                        });
                    }
                    else{
                        alert('请填写完整的信息！');
                    }
                })
            }

            //-----------------------------------修改-----------------------------------
            else{
                patient_data=data['Data'][0];
                var olddata='';
                var p_data=strToJson(patient_data.PatientTemp);
                for(var r= 0,lenghs=p_data.length;r<lenghs;r++){
                    if(patientId==p_data[r].id){
                        olddata=p_data[r];
                        //r==0&&($(".is_default").addClass('check_default'));
                        break;
                    }
                }

                //----------------------初始化患者数据-------------------
                $("#username").val(olddata.name);
                $(".sex_choose span[value='"+olddata.sex+"']").addClass('sex').siblings().removeClass('sex');
                $("#phone").val(olddata.tel);
                var old=new Date(parseInt(olddata.birthday));
                var now=new Date(parseInt(Date.now()));
                var oldage=now.getFullYear()-old.getFullYear();
                $("#age option[value='"+oldage+"']").attr("selected",true);
                $("#age").prev().prev().html(oldage+'岁');

                $("#sub").on('click', function () {
                    var username=$("#username").val();
                    var sex=$(".sex").attr("value");
                    var phone=$("#phone").val();
                    var age=$("#age option:checked").val();
                    var now=new Date(parseInt(Date.now()));
                    var birth=(now.getFullYear()-parseInt(age))+'-01-01';
                    //var isdefault=$(".is_default").hasClass('check_default')?'Y':'N';
                    if(!!username&&!!sex&&!!age&&!!phone){
                        if(!reg.test(phone)){
                            alert('请输入正确的电话号码！');return;
                        }
                        if($("#age").prev().prev().html()=='年龄'){
                            alert('请选择您的年龄！');return;
                        }
                        $(".consult_loading").removeClass('hide');
                        //---------------------------------获取修改的患者数据---------------------------------
                        var p_data={
                            'name':username,
                            'id':getUrlParam('name'),
                            'sex':sex,
                            'birthday':Date.parse(birth),
                            'tel':phone
                        };
                        var did=p_data['id'],has=1    //患者id
                        if(data['Code']!='0009'){
                            if(patient_data.PatientTemp.length!=0){
                                //if(isdefault=='Y'){
                                //    var parr=patient_data.PatientTemp;
                                //    parr=(strToJson(parr));
                                //    for(var j=0;j<parr.length;j++){
                                //        if(parr[j]['id']==did){
                                //            parr.splice(j,1);break;
                                //        }
                                //    }
                                //    parr.splice(0,0,p_data);
                                //    patient_data.PatientTemp=parr;
                                //}
                                //else{
                                    var parr=patient_data.PatientTemp;
                                    parr=(strToJson(parr));
                                    for(var j=0;j<parr.length;j++){
                                        if(parr[j]['id']==did){
                                            parr[j]=p_data;
                                            break;
                                        }
                                    //}
                                }
                            }
                            else{
                                type='C';
                                var parr=[];
                                parr.push(p_data);
                            }
                            patient_data.PatientTemp=parr;
                        }
                        else{
                            has=0;
                        }

                        // -----------------发送修改请求---------------
                        var CData = {
                            "appToken": token,
                            "para": {
                                "device_type": "PC",
                                "device_id": "",
                                "api_version": "1.0.0.0",
                                "event": 'M',
                                "uid": userid,
                                "subjects":patient_data.PatientTemp
                            }
                        };
                        $.ajax({
                            "url": ebase + "/api/LookUp/OptionUserTemp",
                            "type": "POST",
                            "data": CData,
                            "dataType": "json",
                            success: function (data) {
                                location.href='question.html?name='+patientId+"&paperid="+paperid;
                            },
                            error: function (xhr, errorType, error) {
                                //alert("错误");
                                console.log(xhr);
                                console.log(errorType);
                                console.log(error)
                            }
                        })
                    }
                    else{
                        alert('请填写准确的信息！');return;
                    }
                })
            }
        },
        error: function (xhr, errorType, error) {
            //alert("错误");
            console.log(xhr);
            console.log(errorType);
            console.log(error);
            return;
        }
    });

    $("#age").on('change',function(e){
        $(this).prev().prev().html($(this).val()+'岁');
        $(this).prev().prev().css('color','#222222');
    });
    $(".sex_choose").on('click','span',function(e){
        $(e.target).addClass('sex').siblings().removeClass('sex');
    });
    //$(".is_default").on('click',function(){
    //    $(this).toggleClass('check_default');
    //});

})

////这个函数是必须的，因为在geo.js里每次更改地址时会调用此函数
//function promptinfo()
//{
//    var address = document.getElementById('address');
//    var s1 = document.getElementById('s1');
//    var s2 = document.getElementById('s2');
//    var s3 = document.getElementById('s3');
//    address.value = s1.value + s2.value + s3.value;
//}