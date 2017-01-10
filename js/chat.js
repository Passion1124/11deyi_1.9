var client = null;
var getDeoLength = 0;
//绘制界面对象
var showChat = {
    //绘制会话列表
    chatList: function (name, data) {
        $(".message_list").empty();
        var userid = localStorage[getLocalStroagelogin().userid];
        if (!userid) {
            console.log("没有会话列表信息");
            return;
        }
        var chatArray = JSON.parse(userid);
        for (var i = 0; i < chatArray.length; i++) {
            if (!localStorage[chatArray[i]]) {
                break;
            }
            var messageArray = JSON.parse(localStorage[chatArray[i]]);
            if (messageArray.length < 1){
                continue;
            }
            var message = JSON.parse(localStorage[messageArray[messageArray.length - 1]]);
            if (typeof message.content == "string") {
                message.content = JSON.parse(message.content);
            }
            var text = "";
            switch (parseInt(message.type)) {
                case 1:
                case 9:
                case 11:
                    text = message.content.title;
                    break;
                case 2:
                    text = "[图片]";
                    break;
                case 3:
                    text = "[语音]";
                    break;
                case 4:
                    text = "[视频]";
                    break;
                case 5:
                    text = "[病历]";
                    break;
                case 6:
                case 7:
                    text = "[问卷]" + message.content.title;
                    break;
                case 8:
                    text = "[" + message.content.cName + "]" + message.content.title;
                    break;
            }
            if (localStorage[chatArray[i] + "_info"]) {
                var info = JSON.parse(localStorage[chatArray[i] + "_info"]);
            } else {
                var info = {name: "医生"};
            }
            var timeText = getChatIntervalTime(0, message, true);
            if (timeText.indexOf(" ") !== -1) {
                timeText = timeText.split(" ")[0];
            }
            var backUrl = "http://www.11deyi.com/img/30.png";
            if (info.faceimg) {
                backUrl = info.faceimg
            }
            if (!info.userimg){
                info.userimg = "http://www.11deyi.com/img/30.png"
            }
            var unread = localStorage[chatArray[i] + "_unread"];
            var unreadEle = "<span>"+unread+"</span>";
            if (!unread || unread == 0){
                unread = "";
                unreadEle = "";
            }
            var head_portrait = "";
            if (chatId(info.id,getLocalStroagelogin().userid) == chatArray[i]){
                head_portrait = "<div class='head_portrait' style='background-image: url(" + backUrl + ")'>" + unreadEle + "</div>";
            }else {
                head_portrait = "<div class='head_portrait'><img src='"+backUrl+"' alt=''><img src='"+info.userimg+"' alt=''>" + unreadEle + "</div>"
                if (info.name.indexOf("、") == -1){
                    var docName = "医生";
                    var userName = "患者";
                    if (localStorage[info.id]){
                        docName = JSON.parse(localStorage[info.id]).name;
                    }
                    if (localStorage[info.uid]){
                        userName = JSON.parse(localStorage[info.uid]).name;
                    }
                    info.name = docName + "、" + userName
                }
            }
            var ele = "<div class='list' chatid='" + chatArray[i] + "' docid='" + info.id + "'>" + head_portrait +
                "<div class='info'>" +
                "<p>" + info.name + "</p>" +
                "<p>" + text + "</p>" +
                "</div>" +
                "<div class='message_time'>" + timeText + "</div>" +
                "</div>";
            $(".message_list").append(ele);
        }
    },
    //绘制会话内容
    chatShow: function (name, data) {
        $(".chat section .list_loading").remove();
        $(".chat section").append("<p class='more hide'><img src='img/animation.gif' alt='' class='load'></p>");
        var chat = getRouterParam("chatid");
        if (!localStorage[chat]) {
            var hind = "<p><span class='ts'>你可以在这里与医生沟通病情，获得更多就医指导。</span></p>";
            $(".chat section").append(hind);
            return;
        }
        var msgArray = JSON.parse(localStorage[chat]);
        for (var i = msgArray.length - 1; i > -1; i--) {
            var chatLength = $(".chat section>div").length;
            if (chatLength >= 10) {
                break;
            }
            var message = JSON.parse(localStorage[msgArray[i]]);
            showChat.messageList(message);
            if (i == 0) {
                var intervalTime = getChatIntervalTime(0, message, true)
            } else {
                var message1 = JSON.parse(localStorage[msgArray[i - 1]]);
                var intervalTime = getChatIntervalTime(message1, message, false);
            }
            if (intervalTime) {
                var timeEle = "<p><span>" + intervalTime + "</span></p>";
                $(".chat section .more").after(timeEle);
            }
        }
        $(".right .head_portrait").css("background-image", "url('" + getLocalStroagelogin().faceimg + "')");
        var sectionWidth = $(".chat section").width();
        var rightPad = parseInt($(".chat .right").css("padding-right"));
        $(".chat .right").width(sectionWidth - rightPad);
        setTimeout(function(){
            goBottom();
        },120)
    },
    //下拉刷新加载更多数据
    addChatMessage: function (name, data) {
        $(".chat section .list_loading").remove();
        if ($(".chat section .more").length == 0){
            $(".chat section").append("<p class='more hide'><img src='img/animation.gif' alt='' class='load'></p>");
        }
        if (!getRouterParam("chatid")){
            return ;
        }
        var chatMessageNumberOne = $(".chat section>div:nth-of-type(1)").attr("msgid");
        var chat = getRouterParam("chatid");
        var msgArray = JSON.parse(localStorage[chat]);
        var chatLength = $(".chat section>div").length + $(".chat section>h2").length;
        if (msgArray.length - chatLength > 0) {
            $(".chat section .ts").parent().remove()
            var for_number = 0;
            for (var i = msgArray.length - chatLength - 1; i > -1; i--) {
                for_number++;
                if (for_number > 10) {
                    break;
                }
                var message = JSON.parse(localStorage[msgArray[i]]);
                showChat.messageList(message);
                if (i == 0) {
                    var intervalTime = getChatIntervalTime(0, message, true)
                } else {
                    var message1 = JSON.parse(localStorage[msgArray[i - 1]]);
                    var intervalTime = getChatIntervalTime(message1, message, false);
                }
                if (intervalTime) {
                    var timeEle = "<p><span>" + intervalTime + "</span></p>";
                    $(".chat section .more").after(timeEle);
                }
            }
            $(".more").addClass("hide");
            $(".right .head_portrait").css("background-image", "url('" + getLocalStroagelogin().faceimg + "')");
            var sectionWidth = $(".chat section").width();
            var rightPad = parseInt($(".chat .right").css("padding-right"));
            $(".chat .right").width(sectionWidth - rightPad);
            if (chatMessageNumberOne){
                var offsetTop = $(".chat section>div[msgid='" + chatMessageNumberOne + "']").offset().top;
                $(".chat section").scrollTop(parseInt(offsetTop));
            }else {
                setTimeout(function(){
                    goBottom();
                },120)
            }
        } else {
            $(".more").addClass("hide");
            var div_msgid = $(".chat section>div:nth-of-type(1)").attr("msgid");
            var h2_msgid = $(".chat section>h2:nth-of-type(1)").attr("msgid");
            var div_msgid_message = JSON.parse(localStorage[div_msgid]);
            var msgid = "";
            if (h2_msgid){
                var h2_msgid_message = JSON.parse(localStorage[h2_msgid]);
                if (h2_msgid_message.send_time > div_msgid_message.send_time){
                    msgid = div_msgid_message.message_id;
                }else {
                    msgid = h2_msgid_message.message_id;
                }
            }else {
                msgid = div_msgid_message.message_id;
            }
            chatSocket.getAllMsg(msgid,getRouterParam("chatid"));
            console.log("向服务器拉取旧消息！");
        }
    },
    //发送文本消息的处理
    sendTextMessage: function (name, data) {
        getTimeInt();
        var newData = JSON.parse(data);
        var text = newData.content.title.replace(/\n/g, "<br>").replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,'<a  target= _blank href="$1">链接：点击查看详情</a>');
        var html = "<div class='right send_text' msgid='" + newData.message_id + "'>" +
            "<div class='head_portrait'></div>" +
            "<div class='content'>" + text + "</div><img src='img/animation.gif' alt='' class='load'></div>";
        $(".chat section").append(html);
        $(".right .head_portrait").css("background-image", "url('" + getLocalStroagelogin().faceimg + "')");
        rightTop();
    },
    //发送图片消息的处理
    sendImageMessage: function (name, data) {
        var newData = JSON.parse(data);
        var content = newData.content;
        if (typeof content === "string") {
            content = JSON.parse(content);
        }
        var input = document.getElementById('pictureInput');//选择图片的input
        var remoteUrl = URL.createObjectURL(input.files[0]);
        getTimeInt();
        $(".chat section").append("<div class='right send_img' msgid='" + newData.message_id + "'>" +
            "<div class='head_portrait'></div>" +
            "<div class='content imgBox'><img  class='scaleImg' class='scaleImg' src='" + remoteUrl + "' alt='此图片已过期' itemprop='thumbnail' alt='Image description' />" +
            "</div><img src='img/animation.gif' alt='' class='load'></div>");
        $(".right .head_portrait").css("background-image", "url('" + getLocalStroagelogin().faceimg + "')");
        setTimeout(function(){
            rightTop();
        },100);
    },
    sendCase: function(name, data){
        var newData = JSON.parse(data);
        if (typeof newData.content == "string"){
            newData.content = JSON.parse(newData.content)
        }
        getTimeInt();
        var html = "<div class='right send_case' msgid='" + newData.message_id + "'>" +
            "<div class='head_portrait'></div>" +
            "<div class='content question' qid='" + newData.content.id + "'>" +
            "<div class='question_case'>" +
            "<div class='bg_img'></div>" +
            "<p>" + newData.content.title + "</p>" +
            "<p>点击查看</p>" +
            "</div>" +
            "<div class='question_btm_r'>患者病历</div>" +
            "</div>" +
            "<img src='img/animation.gif' alt='' class='load'></div>";
        $(".chat section").append(html);
        $(".right .head_portrait").css("background-image", "url('" + getLocalStroagelogin().faceimg + "')");
        rightTop();
    },
    //收到新消息时的处理
    receiveNewMessage: function (name, result) {
        var data = JSON.parse(result)[0];
        !Array.isArray(data) && (data = strToJson(data));
        var user = JSON.parse(result)[1];
        var roles = JSON.parse(result)[2];
        console.log(roles);
        if (typeof user == "string") {
            user = JSON.parse(user);
        }
        for (var k = 0; k < user.length; k++) {
            if (user[k].name && user[k].headimg) {
                if (user[k].userid != getLocalStroagelogin().userid) {
                    var doc = {
                        name: user[k].name,
                        id: user[k].userid,
                        headimg: user[k].headimg
                    };
                    localStorage[user[k].userid] = JSON.stringify(doc);
                }
                if (user[k].type == "D"){
                    createChatDoctorInfo(user[k].userid, user[k].name, user[k].headimg);
                }
            }
        }
        for (var n = 0; n < user.length; n++){
            if (user[n].type != "D"){
                continue;
            }
            for (var m = 0; m < user.length; m++) {
                if (user[m].type != "U"){
                    continue;
                }
                createChatInfo(user[n].userid,user[m].userid,user[n].name,user[n].headimg,user[m].headimg);
            }
        }
        for (var f = 0; f < roles.length; f++){
            if (roles[f].type == "F" && roles[f].userid == getLocalStroagelogin().userid) {
                try {
                    var newChat = JSON.parse(localStorage[roles[f].chat_id + "_info"]);
                    var doc_info = JSON.parse(localStorage[newChat.id]);
                    var pat_info = JSON.parse(localStorage[newChat.uid]);
                    newChat.name = doc_info.name + "、" + pat_info.name;
                    localStorage.setItem(roles[f].chat_id + "_info", JSON.stringify(newChat));
                }catch (e){
                    console.log(e);
                }
            }
        }
        console.log(JSON.parse(result));
        if (JSON.parse(result)[3]){
            return;
        }
        var cid = getRouterParam("chatid");
        if (cid) {
            var cidArray = [];
            if (localStorage[cid]) {
                cidArray = JSON.parse(localStorage[cid]);
            }
            for (var i = data.length - 1; i != -1; i--) {
                if (data[i].chat_id != cid){
                    console.log("收到的消息不是当前聊天界面");
                    continue;
                }
                if (typeof data[i].content == "string") {
                    data[i].content = JSON.parse(data[i].content);
                }
                if (data[i].type == 11 && data[i].chat_id === cid){
                    $(".chat section").append("<h2 msgid='"+data[i].message_id+"'><span>"+data[i].content.title+"</span></h2>");
                    continue;
                }
                if (data[i].chat_id == cid) {
                    var message = data[i];
                    var message1 = "";
                    var msgType = false;
                    if (i == 0) {
                        if (cidArray.length > 1) {
                            if (cidArray.length == data.length) {
                                message1 = data[i + 1]
                            } else {
                                message1 = JSON.parse(localStorage[cidArray[cidArray.length - data.length - 1]]);
                            }
                        } else {
                            message1 = 0;
                            msgType = true
                        }
                    } else {
                        if (cidArray.length == data.length) {
                            if (i == data.length - 1) {
                                message1 = 0;
                                msgType = true;
                            } else {
                                message1 = data[i + 1]
                            }
                        } else {
                            message1 = JSON.parse(localStorage[cidArray[cidArray.length - data.length - 1]]);
                        }
                    }
                    var intervalTime = getChatIntervalTime(message1, message, msgType);
                    if (intervalTime) {
                        var timeEle = "<p><span>" + intervalTime + "</span></p>";
                        $(".chat section").append(timeEle);
                    }
                }
                if (data[i].chat_id === cid) {
                    if (localStorage[data[i].from_id]) {
                        var mydoc = JSON.parse(localStorage[data[i].from_id]);
                        data[i].headimg = mydoc.headimg;
                        data[i].name = mydoc.name;
                    }
                    if (!data[i].headimg) {
                        data[i].headimg = "http://www.11deyi.com/img/30.png"
                    }
                    if (!data[i].name) {
                        if (data[i].from_id == getRouterParam("id")){
                            data[i].name = "医生"
                        }else {
                            data[i].name = "用户"
                        }
                    }
                    switch (parseInt(data[i].type)) {
                        case 1:
                            var text = data[i].content.title.replace(/\n/g, "<br>").replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,'<a  target= _blank href="$1">链接：点击查看详情</a>');
                            var ele = "<div class='head_portrait' style='background-image: url(" + data[i].headimg + ")'></div><p class='name'>" + data[i].name + "</p><div class='content'>" + text + "</div>";
                            break;
                        case 2:
                            var img_width = "@150w";
                            var ele = "<div class='head_portrait' style='background-image: url(" + data[i].headimg + ")'></div>" +
                                "<p class='name'>" + data[i].name + "</p>" +
                                "<div class='content imgBox'><img  class='scaleImg' src='" + data[i].content.remoteUrl + img_width + "'  alt='此图片已过期' itemprop='thumbnail' alt='Image description' />" +
                                "</div>";
                            break;
                        case 3:
                            var audioUrl = data[i].content.remoteUrl;
                            var audioL = parseInt(data[i].content.duration / 1000);
                            var ele = "<div class='head_portrait' style='background-image: url(" + data[i].headimg + ")'></div><p class='name'>" + data[i].name + "</p><div class='content audio" + (data[i].content.isRead == false ? " isRead" : "") + "' audio='" + audioUrl + "'><audio src='" + audioUrl + "'></audio><img src='img/chatyy.png' alt=''></div><span>" + audioL + "’’</span><span class='dot'></span>";
                            break;
                        case 6:
                            var ele = "<div class='head_portrait' style='background-image: url(" + data[i].headimg + ")'></div>" +
                                "<p class='name'>" + data[i].name + "</p>" +
                                "<div class='content question' paperid='" + data[i].content.id + "'>" +
                                "<div class='question_case'>" +
                                "<div class='bg_img'></div>" +
                                "<p>" + data[i].content.title + "</p>" +
                                "<p>" + data[i].content.desc + "</p></div>" +
                                "<div class='question_btm'>填写问卷</div></div>";
                            break;
                        case 7:
                            var ele = "<div class='head_portrait' style='background-image: url(" + data[i].headimg + ")'></div>" +
                                "<p class='name'>" + data[i].name + "</p>" +
                                "<div class='content question' qid='" + message.content.id + "'>" +
                                "<div class='question_case'>" +
                                "<div class='bg_img'></div>" +
                                "<p>" + message.content.title + "</p>" +
                                "<p>点击查看</p>" +
                                "</div>" +
                                "<div class='question_btm_r'>患者病历</div>" +
                                "</div>";
                            break;
                        case 8:
                            var addClass = "";
                            var addEle = "";
                            switch (data[i].content.type) {
                                case "P":
                                    var link = "img/tw@2x.png";
                                    if (data[i].content.icon) {
                                        link = data[i].content.icon;
                                    }
                                    break;
                                case "A":
                                    var link = "img/yp@2x.png";
                                    break;
                                case "V":
                                    var link = "img/sp@2x.png";
                                    if (data[i].content.icon) {
                                        link = data[i].content.icon;
                                        addEle = "<div></div>";
                                        addClass = "video";
                                    }
                                    break;
                            }
                            var ele = "<div class='head_portrait' style='background-image: url(" + data[i].headimg + ")'></div>" +
                                "<p class='name'>" + data[i].name + "</p>" +
                                "<div class='content repository' knowid='" + data[i].content.id + "'>" +
                                "<p>" + data[i].content.title + "</p>" +
                                "<div class='" + addClass + "'><p>" + data[i].content.content + "</p><p style='background-image: url(" + link + ")'>" + addEle + "</p></div></div>";
                    }
                    var left = "<div class='left' msgid='" + data[i].message_id + "'>" + ele + "</div>";
                    $(".chat section").append(left);
                }
            }
            $(".right .head_portrait").css("background-image", "url('" + getLocalStroagelogin().faceimg + "')");
        } else {
            console.log("当前不是会话界面");
        }
        setTimeout(function(){
            goBottom();
        },120)
    },
    //消息发送成功或者失败的处理
    messageState: function (name, data) {
        var message = JSON.parse(localStorage[data]);
        if (message.state == 1) {
            console.log("成功");
            var type = parseInt(message.type);
            var messageType = "";
            switch (type) {
                case 1:
                    messageType = "send_text";
                    break;
                case 2:
                    $("#pictureInput").removeAttr("disabled");
                    messageType = "send_img";
                    break;
                case 7:
                    messageType = "send_case";
                    break;
            }
            $(".right[msgid='" + data + "']").removeClass(messageType);
            $(".right[msgid='" + data + "']").find(".load").addClass("hide");
        } else {
            console.log("失败");
            $("#pictureInput").removeAttr("disabled");
            $(".right[msgid='" + data + "']").find(".load").attr("src", "./img/fail@2x.png");
        }
    },
    messageList: function(message){
        if (typeof message.content == "string") {
            message.content = JSON.parse(message.content);
        }
        if (message.type == 11){
            $(".chat section .more").after("<h2 msgid='"+message.message_id+"'><span>"+message.content.title+"</span></h2>");
            return;
        }
        if (message.from_id === getLocalStroagelogin().userid) {
            var right = "";
            var fail = '';
            var failClass = "";
            switch (message.type) {
                case 1:
                    if (message.state == 0) {
                        fail = '<img src="./img/fail@2x.png" class="load">';
                        failClass = "send_text";
                    }
                    var text = message.content.title.replace(/\n/g, "<br>").replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,'<a  target= _blank href="$1">链接：点击查看详情</a>');
                    var ele = "<div class='head_portrait'></div><div class='content'>" + text + "</div>" + fail;
                    break;
                case 2:
                    var img_width = "@150w";
                    if (message.state == 0) {
                        fail = '<img src="./img/fail@2x.png" class="load">';
                        failClass = "send_img";
                        img_width = "";
                    }
                    var ele = "<div class='head_portrait'></div>" +
                        "<div class='content imgBox'><img  class='scaleImg' src='" + message.content.remoteUrl + img_width + "'  alt='此图片已过期' itemprop='thumbnail' alt='Image description' />" +
                        "</div>" + fail;
                    break;
                case 7:
                    if (message.state == 0) {
                        fail = '<img src="./img/fail@2x.png" class="load">';
                        failClass = "send_case";
                    }
                    var ele = "<div class='head_portrait'></div>" +
                        "<div class='content question' qid='" + message.content.id + "'>" +
                        "<div class='question_case'>" +
                        "<div class='bg_img'></div>" +
                        "<p>" + message.content.title + "</p>" +
                        "<p>点击查看</p>" +
                        "</div>" +
                        "<div class='question_btm_r'>患者病历</div>" +
                        "</div>" + fail;
                    break;
            }
            var right = "<div class='right " + failClass + "' msgid='" + message.message_id + "'>" + ele + "</div>";
            $(".chat section .more").after(right);
        } else if (message.chat_id === getRouterParam("chatid")) {
            if (localStorage[message.from_id]) {
                var mydoc = JSON.parse(localStorage[message.from_id]);
                message.headimg = mydoc.headimg;
                message.name = mydoc.name;
            }
            if (!message.headimg) {
                message.headimg = "http://www.11deyi.com/img/30.png"
            }
            if (!message.name) {
                if (message.from_id == getRouterParam("id")){
                    message.name = "医生"
                }else {
                    message.name = "用户"
                }
            }
            switch (parseInt(message.type)) {
                case 1:
                    var text = message.content.title.replace(/\n/g, "<br>").replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,'<a  target= _blank href="$1">链接：点击查看详情</a>');
                    var ele = "<div class='head_portrait' style='background-image: url(" + message.headimg + ")'></div><p class='name'>" + message.name + "</p><div class='content'>" + text + "</div>";
                    break;
                case 2:
                    var img_width = "@150w";
                    var ele = "<div class='head_portrait' style='background-image: url(" + message.headimg + ")'></div>" +
                        "<p class='name'>" + message.name + "</p>" +
                        "<div class='content imgBox'><img  class='scaleImg' src='" + message.content.remoteUrl + img_width + "'  alt='此图片已过期' itemprop='thumbnail' alt='Image description' />" +
                        "</div>";
                    break;
                case 3:
                    var audioUrl = message.content.remoteUrl;
                    var audioL = parseInt(message.content.duration / 1000);
                    var ele = "<div class='head_portrait' style='background-image: url(" + message.headimg + ")'></div><p class='name'>" + message.name + "</p><div class='content audio" + (message.content.isRead == false ? " isRead" : "") + "' audio='" + audioUrl + "'><audio src='" + audioUrl + "'></audio><img src='img/chatyy.png' alt=''></div><span>" + audioL + "’’</span><span class='dot'></span>";
                    break;
                case 6:
                    var ele = "<div class='head_portrait' style='background-image: url(" + message.headimg + ")'></div>" +
                        "<p class='name'>" + message.name + "</p>" +
                        "<div class='content question' paperid='" + message.content.id + "'>" +
                        "<div class='question_case'>" +
                        "<div class='bg_img'></div>" +
                        "<p>" + message.content.title + "</p>" +
                        "<p>" + message.content.desc + "</p></div>" +
                        "<div class='question_btm'>填写问卷</div></div>";
                    break;
                case 7:
                    var ele = "<div class='head_portrait' style='background-image: url(" + message.headimg + ")'></div>" +
                        "<p class='name'>" + message.name + "</p>" +
                        "<div class='content question' qid='" + message.content.id + "'>" +
                        "<div class='question_case'>" +
                        "<div class='bg_img'></div>" +
                        "<p>" + message.content.title + "</p>" +
                        "<p>点击查看</p>" +
                        "</div>" +
                        "<div class='question_btm_r'>患者病历</div>" +
                        "</div>";
                    break;
                case 8:
                    var addClass = "";
                    var addEle = "";
                    switch (message.content.type) {
                        case "P":
                            var link = "img/tw@2x.png";
                            if (message.content.icon) {
                                link = message.content.icon;
                            }
                            break;
                        case "A":
                            var link = "img/yp@2x.png";
                            break;
                        case "V":
                            var link = "img/sp@2x.png";
                            if (message.content.icon) {
                                link = message.content.icon;
                                addEle = "<div></div>";
                                addClass = "video";
                            }
                            break;
                    }
                    var ele = "<div class='head_portrait' style='background-image: url(" + message.headimg + ")'></div>" +
                        "<p class='name'>" + message.name + "</p>" +
                        "<div class='content repository' knowid='" + message.content.id + "'>" +
                        "<p>" + message.content.title + "</p>" +
                        "<div class='" + addClass + "'><p>" + message.content.content + "</p><p style='background-image: url(" + link + ")'>" + addEle + "</p></div></div>";
            }
            var left = "<div class='left' msgid='" + message.message_id + "'>" + ele + "</div>";
            $(".chat section .more").after(left);
        } else {
            console.log("错误或者无用的消息!");
            console.log(message);
        }
    }
};
//数据处理对象
var chatSocket = {
    chatId: null,
    //会话创建
    init: function () {
        var userid = getLocalStroagelogin().userid;
        if (!!userid) {
            var chatid = getRouterParam('chatid');
                //生成会话id
                if (!!chatid) {
                    this.chatId=chatid;
                }
                else {
                    this.chatId = chatId(getRouterParam('id'),userid);
                }
                //本地存储用户会话集合
                var has = 0;
                var chatList = localStorage.getItem(userid);
                if (!!chatList) {
                    var list = strToJson(chatList);
                    for (var i = 0, len = list.length; i < len; i++) {
                        this.chatId == list[i] && (has = 1);
                    }
                    if (has != 1) {
                        list.push(this.chatId);
                        localStorage.setItem(userid, JSON.stringify(list));
                    }
                }
                else {
                    var arr = [this.chatId];
                    localStorage.setItem(userid, JSON.stringify(arr));
                }
            }
        else {
            console.log('userid is empty!');
        }
    },
    //发送文本消息
    sendMsg: function (msg) {
        this.init();
        if (!!this.chatId) {
            if(!msg.message_id){
                var send_time = (new Date().getTime()).toString();
                var userid = getLocalStroagelogin().userid;
                //生成消息id
                var message_id = md5(userid + this.chatId + send_time.toString());
                //本地存储会话信息集合
                var msgList = localStorage.getItem(this.chatId);
                if (!!msgList) {
                    var list = strToJson(msgList);
                    list.push(message_id);
                    localStorage.setItem(this.chatId, JSON.stringify(list));
                }
                else {
                    msgList = [message_id];
                    localStorage.setItem(this.chatId, JSON.stringify(msgList));
                }
                setLocalChatArr(this.chatId);
                //本地存储消息信息
                msg.chat_id = this.chatId;
                msg.to_id = getRouterParam('id');
                msg.send_time = send_time;
                msg.message_id = message_id;
                msg.from_id = userid;
                msg.content.did=getRouterParam('id');
                msg.content.uname=getLocalStroagelogin().name;
                msg.state=0;
                localStorage.setItem(message_id, JSON.stringify(msg));
                //发送通知
                if(msg.type==1){
                    NotificationCenter.postNotification('sendTextMessage', JSON.stringify(msg));
                }
                else{
                    var q=strToJson(localStorage.question);
                    q.state=false;
                    localStorage.question=JSON.stringify(q);
                    NotificationCenter.postNotification('sendCase', JSON.stringify(msg));
                }
                NotificationCenter.postNotification('chatList');
            }
            var postData = {
                "appToken": getLocalStroagelogin().token,
                "para": {
                    "device_type": "PC",
                    "device_id": "",
                    "api_version": "1.0.0.0",
                    "chat_id": msg.chat_id,
                    "to_id": msg.to_id,
                    "from_id":msg.from_id,
                    "send_time": msg.send_time,
                    "content": JSON.stringify(msg.content),
                    "type": msg.type
                }
            };
            client.addRequest(
                JSON.stringify(postData),
                function (response) {
                    var result = JSON.parse(new StringView(response));
                    console.log(result);
                    if (result.code == 0) {
                        msg.state = 1;
                        localStorage.setItem(msg.message_id, JSON.stringify(msg));
                        NotificationCenter.postNotification('messageState', msg.message_id);
                        NotificationCenter.postNotification('chatList');
                    }
                    else {
                        msg.state = 0;
                        localStorage.setItem(msg.message_id, JSON.stringify(msg));
                        NotificationCenter.postNotification('messageState', msg.message_id);
                        NotificationCenter.postNotification('chatList');
                    }
                },
                {'api': '/api/php/SendMessage'},
                function (err) {
                    console.log(err);
                    msg.state = 0;
                    localStorage.setItem(msg.message_id, JSON.stringify(msg));
                    NotificationCenter.postNotification('messageState', msg.message_id);
                    NotificationCenter.postNotification('chatList');
                }
            );
        }
        else {
            alert('会话id不存在！');
        }
    },
    //收到消息
    getMsg: function () {
        this.init();
        //最后一条发送成功的消息id
        var messageId = localStorage.getItem('lastMsgId');
        messageId = !!messageId ? messageId : null;
        //拉取收到的消息
        var reserData = {
            'appToken': getLocalStroagelogin().token,
            'para': {
                "device_type": "PC",
                "device_id": "",
                "api_version": "1.0.0.0",
                'currentlastid': messageId
            }
        }
        client.addRequest(
            JSON.stringify(reserData),
            function (response) {
                var result = new StringView(response);
                try{
                    result = strToJson(result);
                }
                catch(e){
                    console.log(e);
                }
                if((result.code!=0&&result.code!=1005)||result.data.length==0){
                    return;
                }
                //收到消息时判断若在聊天界面并且本地没有缓存，拉取当前聊天所有历史记录
                if (getRouterParam('id') && !messageId) {
                    NotificationCenter.postNotification('receiveNewMessage', JSON.stringify([result.data, result.users,result.roles,'getDocInfo']));
                    chatSocket.getAllMsg(null, chatSocket.chatId);
                    return;
                }
                if (result.code == 1005) {
                    //清空本地存储
                    var login=localStorage.login;
                    localStorage.clear();
                    localStorage.login=login;
                    setLocalData(result);
                }
                else if (result.code == 0) {
                    setLocalData(result);
                }
                else {
                    alert('响应码：', result);
                }
            },
            {'api': '/api/php/GetNewMessage'},
            function (err) {
                console.log(err);
            }
        );
    },
    //发送图片
    sendImage:function(msg){
        this.init();
        if(!!this.chatId){
            if(msg){
                if(msg.content.remoteUrl.indexOf('base')!=-1){
                    uploadImg(msg);
                }
                else{
                    blobObj.getBlob(msg.content.remoteUrl,function(file){
                        var w=msg.content.contentWidth;
                        var h=msg.content.contentHeight;
                        //判断是否需要压缩
                        if((file.size/1024)>50) {
                            var resCanvas = document.getElementById('test');
                            //若需要进行压缩，判断手机型号
                            if (isAndroid){
                                var maxSide = Math.max(w, h);
                                if (maxSide > 1280) {
                                    var minSide = Math.min(w, h);
                                    minSide = minSide / maxSide * 1280;
                                    maxSide = 1280;
                                    if (w > h) {
                                        w = maxSide;
                                        h = minSide;
                                    }
                                    else {
                                        w = minSide;
                                        h = maxSide;
                                    }
                                }
                                w=Math.ceil(w);
                                h=Math.ceil(h);
                                msg.content.contentWidth=w;
                                msg.content.contentHeight=h;
                                var mpImg = new MegaPixImage(file);
                                mpImg.render(resCanvas, { maxWidth:w,maxHeight:h,  quality:.5 },function(){
                                    blobObj.getBlob(resCanvas.src,function(blob){
                                        getUploadAli(blob,msg.filename,msg);
                                    })});
                            }
                            else {
                                var orientation;
                                EXIF.getData(file,function(){    orientation=EXIF.getTag(this,'Orientation');  });
                                var reader = new FileReader();
                                reader.onload = function(e) {
                                    getImgData(reader.result,orientation,function(data,w,h){
                                        //这里可以使用校正后的图片data了
                                        blobObj.getBlob(data,function(blob){
                                            var mpImg = new MegaPixImage(blob);
                                            msg.content.contentWidth=w;
                                            msg.content.contentHeight=h;
                                            mpImg.render(resCanvas, {maxWidth:w,maxHeight:h,  quality:.2 },function(){
                                                blobObj.getBlob(resCanvas.src,function(newblob){
                                                    getUploadAli(newblob,msg.filename,msg);
                                                })
                                            });
                                        });
                                    });
                                }
                                reader.readAsDataURL(file);
                            }
                        }
                        else{
                            getUploadAli(file,msg.filename,msg);
                        }
                    });
                    return;
                }
            }
            else{
                setLocalChatArr(this.chatId);
                var input = document.getElementById('pictureInput');//选择图片的input
                var file = input.files[0];
                var name=file.name.split('.').pop();
                name=getUpName()+"."+name;
                var send_time=(new Date().getTime()).toString();
                var userid=getLocalStroagelogin().userid;
                //生成消息id
                var message_id=md5(userid+this.chatId+send_time.toString());
                //本地存储会话信息集合
                var msgList=localStorage.getItem(this.chatId);
                if(!!msgList){
                    var list=strToJson(msgList);
                    list.push(message_id);
                    localStorage.setItem(this.chatId,JSON.stringify(list));
                }
                else{
                    msgList=[message_id];
                    localStorage.setItem(this.chatId,JSON.stringify(msgList));
                }
                //本地存储消息信息
                var msg=Object.create(null);
                msg.chat_id=this.chatId;
                msg.to_id=getRouterParam('id');
                msg.send_time=send_time;
                msg.message_id=message_id;
                msg.from_id=userid;
                msg.type=2;
                msg.state=0;
                msg.content={};
                msg.content.did=getRouterParam('id');
                msg.content.uname=getLocalStroagelogin().name;
                localStorage.setItem(message_id,JSON.stringify(msg));
                //发送通知
                NotificationCenter.postNotification('sendImageMessage', JSON.stringify(msg));
                NotificationCenter.postNotification('chatList');
                //保存本地图片信息
                blobObj.setBlob(file,function(base64){
                    msg.content.remoteUrl=base64;
                    localStorage.setItem(message_id,JSON.stringify(msg));
                });
                var myimage=new Image();
                myimage.src=URL.createObjectURL(file);
                myimage.onload=function(){
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
                    if((file.size/1024)>50) {
                        var resCanvas = document.getElementById('test');
                        //若需要进行压缩，判断手机型号
                        if (isAndroid){
                            var maxSide = Math.max(w, h);
                            if (maxSide > 1280) {
                                var minSide = Math.min(w, h);
                                minSide = minSide / maxSide * 1280;
                                maxSide = 1280;
                                if (w > h) {
                                    w = maxSide;
                                    h = minSide;
                                }
                                else {
                                    w = minSide;
                                    h = maxSide;
                                }
                            }
                            msg.content.contentWidth=w;
                            msg.content.contentHeight=h;
                            var mpImg = new MegaPixImage(file);
                            mpImg.render(resCanvas, { maxWidth:w,maxHeight:h,  quality:.5 },function(){
                                blobObj.getBlob(resCanvas.src,function(newblob){
                                    getUploadAli(newblob,name,msg);
                                })
                                });
                        }
                        else {
                            var orientation=null;
                            EXIF.getData(file,function(){    orientation=EXIF.getTag(this,'Orientation');  });
                            var reader = new FileReader();
                            reader.onload = function(e) {
                                getImgData(reader.result,orientation,function(data,ww,hh){
                                    //这里可以使用校正后的图片data了
                                    blobObj.getBlob(data,function(blob){
                                        var mpImg = new MegaPixImage(blob);
                                        msg.content.contentWidth=Math.abs(Math.floor(ww));
                                        msg.content.contentHeight=Math.abs(Math.floor(hh));
                                        mpImg.render(resCanvas, {
                                            maxWidth: w,
                                            maxHeight: h,
                                            quality: .2
                                        }, function () {
                                            blobObj.getBlob(resCanvas.src, function (newblob) {
                                                getUploadAli(newblob,name,msg);
                                            })
                                        });
                                    });
                                });
                            }
                            reader.readAsDataURL(file);
                        }
                    }
                    else{
                        getUploadAli(file,name,msg);
                    }
                }
            }
        }
        else{
            console.log('会话id不存在！');return;
        }
    },
    //拉取当前会话所有消息
    getAllMsg: function (mid, cid) {
        mid = !!mid ? mid : null;
        var postData = {
            'appToken': getLocalStroagelogin().token,
            'para': {
                'currentlastid': mid,
                'chat_id': cid,
                "device_type": "PC",
                "device_id": " ",
                "api_version": "1.0.0.0"
            }
        };
        client.addRequest(
            JSON.stringify(postData),
            function (response) {
                result = new StringView(response);
                try{
                    result = strToJson(result);
                }
                catch(e){
                    console.log(e);
                }
                var data = result.data;
                if (!!data && Array.isArray(data) && data.length > 0) {
                    //本地保存最后一条消息id不存在
                    if (!mid) {
                        localStorage.setItem(cid+'_state','already get all data');
                        var list = [];
                        for (var j = data.length - 1; j != -1; j--) {
                            list.push(data[j]['message_id']);
                            // audio
                            if (data[j]['type'] == 3) {
                                var content = data[j]['content'];
                                (typeof content == 'string') && (content = strToJson(content));
                                content.isRead = 0;
                                data[j]['content'] = content;
                                localStorage[data[j]['message_id']] = JSON.stringify(data[j]);
                            }
                            else {
                                localStorage[data[j]['message_id']] = JSON.stringify(data[j]);
                            }
                        }
                        for (var k = 0, j = data.length; k < j; k++) {
                            if (data[k]['chat_id'] == cid && data[k]['from_id'] != getLocalStroagelogin().userid) {
                                var last=localStorage['lastMsgId'];
                                if(!!last){
                                    last=strToJson(localStorage[last]);
                                    if(last.send_time<data[k]['send_time']){
                                        localStorage['lastMsgId'] = data[k]['message_id'];
                                    }
                                }
                                else{
                                    localStorage['lastMsgId'] = data[k]['message_id'];
                                }
                                break;
                            }
                        }
                    }
                    else {
                        var list = strToJson(localStorage[cid]);
                        for (var j = 0,length=data.length; j <length;j++) {
                            list.unshift(data[j]['message_id']);
                            // audio
                            if (data[j]['type'] == 3) {
                                var content = data[j]['content'];
                                (typeof content == 'string') && (content = strToJson(content));
                                content.isRead = 0;
                                data[j].state = 1;
                                data[j]['content'] = content;
                                localStorage[data[j]['message_id']] = JSON.stringify(data[j]);
                            }
                            else {
                                localStorage[data[j]['message_id']] = JSON.stringify(data[j]);
                            }
                        }
                    }
                    list = clearSame(list);
                    localStorage[cid] = JSON.stringify(list);
                    NotificationCenter.postNotification('addChatMessage', JSON.stringify([data, result.users]));
                    NotificationCenter.postNotification('chatList');
                }
                else {
                    console.log('数据为空！');
                }
            },
            {'api': '/api/php/GetMessageList'},
            function (err) {
                console.log(err);
            }
        );
    },
};

$(function () {
    connectFun();
    register();
    isAndroid && $(".chat .footer .add span").css("line-height", "2.8rem");
    isAndroid && $(".chat .invite_family .top_prompt>div").css("padding-top", "1.5rem");
    hideShare();
    if (getRouterParam("chatid")) {
        $(".chat").removeClass("hide");
        resizeSectionHeight();
        if (getRouterParam("uid")) {
            if (getRouterParam("uid") !== getLocalStroagelogin().userid || !getLocalStroagelogin().faceimg) {
                getUser(getRouterParam("uid"), getRouterParam("token"), function () {
                    showChat.chatShow();
                    setReserver(client, getLocalStroagelogin().userid, getLocalStroagelogin().token, 1);
                    sendCase();
                    if (getRouterParam("id")){
                        if (!localStorage[getRouterParam("id")]){
                            getDoc();
                        }
                    }
                })
            } else {
                showChat.chatShow();
                setReserver(client, getLocalStroagelogin().userid, getLocalStroagelogin().token, 1);
                sendCase();
                if (getRouterParam("id")){
                    if (!localStorage[getRouterParam("id")]){
                        getDoc();
                    }
                }
            }
        } else {
            showChat.chatShow();
            setReserver(client, getLocalStroagelogin().userid, getLocalStroagelogin().token, 1);
            sendCase();
            if (getRouterParam("id")){
                if (!localStorage[getRouterParam("id")]){
                    getDoc();
                }
            }
        }
        if (getRouterParam("uid") && getRouterParam("token")) {
            var Login = getLocalStroagelogin();
            Login.token = getRouterParam("token");
            Login.userid = getRouterParam("uid");
            localStorage.login = JSON.stringify(Login);
        }
        if (localStorage[getRouterParam("chatid") + "_info"]){
            var doc_info = JSON.parse(localStorage[getRouterParam("chatid") + "_info"]);
            $("head title").text(doc_info.name);
            if (!isAndroid){
                updateTitle(doc_info.name);
            }
        }
    }
    else {
        $(".message").removeClass("hide");
        var login = getLocalStroagelogin();
        if (login.userid != getUrlParam("userid") || !login.faceimg) {
            if (getUrlParam("userid") && getUrlParam("token")) {
                updateLogin();
            }
            getUser(getUrlParam("userid"), getUrlParam("token"), function () {
                showChat.chatList();
                setReserver(client, getLocalStroagelogin().userid, getLocalStroagelogin().token, 1);
            },function(){
                console.log("获取用户信息错误");
                $(".list_loading").remove();
            });
        } else {
            showChat.chatList();
            setReserver(client, getLocalStroagelogin().userid, getLocalStroagelogin().token, 1);
        }
        $("html,body").css("height", "auto")
    }
});

function connectFun(){
    //WebSocket聊天对象建立
    client = new stm.Client();
    client.setConnectArgs(web, function () {
            console.log("Connect Success!");
            chatSocket.getMsg();
        }
        , function (str) {
            console.log("WS down ! error Msg: " + str);
            connectFun();
            setReserver(client, getLocalStroagelogin().userid, getLocalStroagelogin().token, 1);
        }
    );
    client.onPush = function (msg) {
        console.log('Receive Message！');
        chatSocket.getMsg();
    };
}

//本地存储信息
function setLocalData(result){
    var data = result.data;
    if (!!data && Array.isArray(data) && data.length > 0) {
        //存储
        for (var i = data.length - 1; i != -1; i--) {
            setLocalChatArr(data[i]['chat_id']);
        }
        var chatList = strToJson(localStorage.getItem(getLocalStroagelogin().userid));
        for (var k = 0, leng = chatList.length; k < leng; k++) {
            var index = chatList[k];
            var list = localStorage[index];
            var unread=!!localStorage[index+'_unread']?localStorage[index+'_unread']:0;
            if (!!list) {
                list = strToJson(list);
            }
            else {
                list = [];
            }
            for (var j = data.length - 1; j != -1; j--) {
                if (data[j]['chat_id'] == index) {
                    index!=getRouterParam('chatid')&&unread++;
                    list.push(data[j]['message_id']);
                    // audio
                    if (k == 0&& data[j]['type'] == 3) {
                        var content = data[j]['content'];
                        (typeof content == 'string') && (content = strToJson(content));
                        content.isRead = 0;
                        data[j]['content'] = content;
                        localStorage[data[j]['message_id']] = JSON.stringify(data[j]);
                    }
                    else {
                        localStorage[data[j]['message_id']] = JSON.stringify(data[j]);
                    }
                }
                else {
                }
            }
            list = clearSame(list);
            localStorage[index] = JSON.stringify(list);
            localStorage[index+'_unread']=unread;
        }
        localStorage.setItem('lastMsgId', data[0]['message_id']);
        NotificationCenter.postNotification('receiveNewMessage', JSON.stringify([data, result.users,result.roles]));
        NotificationCenter.postNotification('chatList');
    }
    else {
        console.log('返回数据为空！');
    }
}

//生成用户下会话列表
function setLocalChatArr(cid) {
    var clist = localStorage[getLocalStroagelogin().userid];
    if (!!clist) {
        clist = strToJson(clist);
        for (var j = 0, length = clist.length; j < length; j++) {
            if (clist[j] == cid) {
                clist.unshift(cid);
                clist = clearSame(clist);
                localStorage[getLocalStroagelogin().userid] = JSON.stringify(clist);
                return;
            }
        }
        clist.unshift(cid);
        localStorage[getLocalStroagelogin().userid] = JSON.stringify(clist);
    }
    else {
        localStorage[getLocalStroagelogin().userid] = JSON.stringify([cid]);
    }
}

//通知事件注册
function register() {
    NotificationCenter.addObserver(showChat, 'sendTextMessage', 'sendTextMessage');
    NotificationCenter.addObserver(showChat, 'receiveNewMessage', 'receiveNewMessage');
    NotificationCenter.addObserver(showChat, 'messageState', 'messageState');
    NotificationCenter.addObserver(showChat, 'chatList', 'chatList');
    NotificationCenter.addObserver(showChat, 'sendImageMessage', 'sendImageMessage');
    NotificationCenter.addObserver(showChat, 'sendCase', 'sendCase');
    NotificationCenter.addObserver(showChat, 'addChatMessage', 'addChatMessage');
}

//分享功能隐藏
function hideShare() {
    var url=location.href.split('#')[0];
    var postData = {
        "appToken": getLocalStroagelogin().token,
        "para": {
            "url":url
        }
    };
    $.ajax({
    url:  nav + "GetJsSign",
    type: "POST",
    data:postData,
    dataType: "json",
    success: function (data) {
        if (data.code == '0000') {
            var Data = data.data;
            wxLicense(Data.appId, Data.timestamp, Data.nonceStr, Data.signature);
            setShare();
        }
    },
    error: function (xhr, errorType, error) {
        //alert("数据错误！请刷新页面！")
        console.log(xhr);
        console.log(errorType);
        console.log(error)
    }
    });
}

//微信授权
function wxLicense(aId, times, nonce, ticket) {
    wx.config({
        debug: false,
        appId: aId,
        timestamp: times,
        nonceStr: nonce,
        signature: ticket,
        jsApiList: [
            'checkJsApi',
            'hideMenuItems',
            'hideOptionMenu',
            'showOptionMenu',
            'onMenuShareAppMessage'
        ]
    });

    wx.ready(function () {
        console.log('wxShare is ready!');
        setShare();
    });
}
function setShare(){
    var chatid=getRouterParam('chatid');
    var did=getRouterParam('id');
    if(!did){
        var dInfo=localStorage[chatid+'_info'];
        if(!dInfo)
        {
            return;
        }
        did=strToJson(dInfo).id
    };
    var postData = {
        "appToken": getLocalStroagelogin().token,
        "para": {
            "device_type": "PC",
            "device_id": "",
            "api_version": "1.0.0.0",
            "chat_id":chatid,
            "doctor_id": did
        }
    };
    client.addRequest(
        JSON.stringify(postData),
        function (response) {
            var result = JSON.parse(new StringView(response));
            console.log(result);
            if (result.code == 0) {
                var data=result.data;
                $(".could").css('background-image','url('+data.code_url+')');
                var docInfo = JSON.parse(localStorage[did]);
                var chatId = getRouterParam("chatid");
                if (chatId && localStorage[chatId + "_info"]){
                    var cid = JSON.parse(localStorage[chatId + "_info"]);
                }else {
                    var cid = {};
                }
                var userInfo = getLocalStroagelogin();
                if (cid.uid != getLocalStroagelogin().userid && cid.uid){
                    userInfo = JSON.parse(localStorage[cid.uid]);
                    userInfo.faceimg = userInfo.headimg;
                    if (!userInfo){
                        userInfo = {name: "患者",faceimg:"http://www.11deyi.com/img/30.png"}
                    }
                }
                $(".invite_family .two_could .top .doc_pat>img:nth-of-type(1)").attr("src",docInfo.headimg);
                $(".invite_family .two_could .top .doc_pat>img:nth-of-type(2)").attr("src",userInfo.faceimg);
                $(".invite_family .two_could .top .dName").text(docInfo.name + "、" + userInfo.name);
                wx.showOptionMenu();
                //发送给好友
                var doc=strToJson(localStorage[did]);
                var h1=($(".doc_pat>img")[0]).src;
                var h2=($(".doc_pat>img")[1]).src;
                var name=$(".dName").html();
                wx.onMenuShareAppMessage({
                    title: '我正在与'+doc.name+'医生沟通病情', // 分享标题
                    desc: '点击进入识别二维码协助我与医生沟通。', // 分享描述
                    link: share+'/two_could.html?code='+encodeURIComponent(data.code_url)+'&img1='+encodeURIComponent(h1)+'&img2='+encodeURIComponent(h2)+'&name='+encodeURIComponent(name), // 分享链接
                    imgUrl: doc.headimg, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                });
            }
            else {
                console.log("没有图片");
            }
        },
        {'api': '/api/php/GetInveteCode'},
        function (err) {
            console.log(err);
        }
    );
}

//初始化绑定事件
$(window).on("resize", function () {
    resizeSectionHeight();
});

$(".chat section").on("click","img.scaleImg",function(){
    if ($(this).hasClass("me") || $(this).hasClass("load")){
        return;
    }
    var img_src = $(this).attr("src").replace(/@150w/g,"");
    var img=$(".img_show>img")[0];
    img.src=img_src;
    img.onload=function(){
            $(".img_show").show();
            var imgWidth = $(".img_show>img").width();
            var imgHeight = $(".img_show>img").height();
            $(".img_show>img").css({"margin-top":-(imgHeight / 2)+"px","margin-left": -(imgWidth / 2) + "px",'top':'50%','left':'50%'});
        }
   });
$(".img_show,.img_show>img").on("click",function(){
    $(this).addClass("me");
    $(".img_show").hide();
    $(".img_show>img").css({"margin-top":0,"margin-left": 0,'top':0,'left':0});
    $(".img_show>img")[0].src='';
});
$(".chat .invite .add_invite").on('click',function(){
    var chatid=getRouterParam('chatid');
    var did=getRouterParam('id');
    if(!did){
        var dInfo=localStorage[chatid+'_info'];
        if(!dInfo)
        {
            return;
        }
        did=strToJson(dInfo).id
    }
    window.location = "#id=" + did+"&chatid="+ chatid + "&could=yes";
    var title = "邀请家人和医生沟通";
    $("head title").text(title);
    if (!isAndroid) {
        updateTitle(title);
    }
    setShare();
    $(".invite_family").removeClass('hide');
});
$(".chat .invite .person_info").on('click',function(){
    var chatid=getRouterParam('chatid');
    var did=getRouterParam('id');
    if (did){
        goToHomePage(did);
    }else {
        var chatid_info = JSON.parse(localStorage[chatid + "_info"]);
        if (!chatid_info.id){
            console.log("没有医生id")
        }else {
            did = chatid_info.id;
            goToHomePage(did);
        }
    }
});

$(".chat section").on("scroll", function () {
    var chatid = getRouterParam("chatid");
    if (!localStorage[chatid + "_state"] || !chatid){
        return;
    }
    if ($(this).scrollTop() <= 0) {
        $(".more").removeClass("hide");
        setTimeout(function () {
            showChat.addChatMessage();
        }, 300);
    }
    //if (!$(".chat .btm").hasClass("hide")){
    //    $(".chat .btm").addClass("hide");
    //    resizeSectionHeight();
    //}
});
$(".chat section").on("click",function(){
    $(".chat .btm").addClass("hide");
    resizeSectionHeight();
});

$(".chat section").on("click",".load",function(){
    var msgid = $(this).parent().attr("msgid");
    if (!msgid){
        msgid = $(this).parent().parent().attr("msgid");
    }
    $(".chat section .right[msgid='"+msgid+"']").find(".load").attr("src","img/animation.gif");
    var message = JSON.parse(localStorage[msgid]);
    if (parseInt(message.type) == 2){
        chatSocket.sendImage(message);
    }else {
        chatSocket.sendMsg(message);
    }
});

$(".message .top div:nth-of-type(1),.message .bottom div:nth-of-type(3)").on("click", function () {
    location.href = nav + "GetCode?type=MD";
});
$(".message .top div:nth-of-type(2)").on("click", function () {
    location.href = "department_list.html"
});
$(".message .bottom div:nth-of-type(2)").on("click", function () {
    location.href = nav + "GetCode?type=DS";
});
$(".message .bottom div:nth-of-type(1)").on("click", function () {
    location.href = nav + "GetCode?type=ASK";
});

$(".chat section").on("click", ".other", function () {
    var qid = $(this).attr("qid");
    var token = getLocalStroagelogin().token;
    location.href = "disease_details.html?id=" + qid + "&token=" + token;
});

$(window).bind('hashchange', function () {
    var chatId = getRouterParam("chatid");
    var could = getRouterParam("could");
    var title = "";
    if (chatId) {
        title = JSON.parse(localStorage[chatId + "_info"]).name;
        if (!could){
            $(".invite_family").addClass("hide");
        }
        $(".chat").removeClass("hide");
        $(".message").addClass("hide");
        $("head title").text(title);
        $("html,body").css("height", "100%");
    } else {
        title = "咨询医生";
        $(".img_show").addClass("hide");
        $("head title").text(title);
        $(".chat").addClass("hide");
        $(".message").removeClass("hide");
        $("html,body").css("height", "auto");
        showChat.chatList();
    }
    if (!isAndroid) {
        updateTitle(title);
    }
});

$(".chat section").on("click", ".audio", function () {
    var self = this;
    var msg = $(this).parent().attr("msgid");
    var c = strToJson(localStorage.getItem(msg));
    if (typeof c.content == "string") {
        c.content = JSON.parse(c.content);
    }
    c.content['isRead'] = 1;
    localStorage.setItem(msg, JSON.stringify(c));
    var audioSrc = $(this).attr("audio");
    var onplay = $(".chat section .audio_play");
    $(this).removeClass('isRead');
    if (onplay.length !== 0 && !$(this).hasClass("audio_play")) {
        onplay.find("audio").get(0).pause();
        onplay.find("img").attr("src", "img/chatyy.png");
        onplay.removeClass("audio_play");
    }
    $(this).toggleClass("audio_play");
    $(this).find("audio").on("ended", function () {
        $(self).find("img").attr("src", "img/chatyy.png");
        $(self).removeClass("audio_play");
    });
    if ($(this).hasClass("audio_play")) {
        //var scroll=$(this).offset().top;
        $(this).find("audio").attr("src", "");
        $(this).find("audio").attr("src", audioSrc);
        $(this).find("audio").get(0).play();
        $(this).find("img").attr("src", "img/chatyy.gif");
        //$('.chat section').scrollTop(scroll);
    } else {
        $(this).find("audio").get(0).pause();
        $(this).find("img").attr("src", "img/chatyy.png");
    }
});

//在输入框输入文本时!
$(".chat").on("input", ".footer .text", function () {
    var bodySize = parseInt($("body").css("font-size"));
    var textHeight = $(this).height() - (parseInt($(this).css("padding")) * 2) - 2;
    var lineHeight = $(this).css("line-height");
    if (lineHeight.indexOf("px") != -1){
        lineHeight = parseInt(lineHeight) / 10;
    }else {
        lineHeight = parseFloat(lineHeight)
    }
    var textLineHeight = lineHeight * bodySize;
    if (parseFloat(textHeight / textLineHeight) > 1) {
        $(this).css("line-height","1.8rem")
    } else {
        $(this).css("line-height","1.5rem")
    }
    if (isAndroid) {
        resizeSectionHeight();
    }
    if ($(this).text()) {
        $(".footer .text").removeClass("txt");
        $(".footer button").removeClass("hide");
        $(".footer .add").addClass("hide");
    } else {
        $(".footer button").addClass("hide");
        $(".footer .add").removeClass("hide");
    }
    //resizeSectionHeight();
    goBottom();
});
//发送消息
$(".footer button").on("click", function () {
    var text = $(".footer .text").html();
    text = text.replace(/&nbsp;/g, "").replace(/ /g, "");
    //console.log(text);
    if (text && text !== " ") {
        var newText = $(".footer .text").html().replace(/&nbsp;/g, " ").replace(/<div>/g, "\n").replace(/<br>/g, " ");
        var divLength = newText.split("</div>");
        for (var i = 0; i < divLength.length; i++) {
            newText = newText.replace("</div>", " ");
        }
        if ($(".footer .text").find("a").length > 0){
            var aLength = $(".footer .text").find("a");
            for (var x = 0; x < aLength.length; x++ ){
                var href = '<a href="'+aLength.eq(x).text()+'">';
                newText = newText.replace(href,"").replace("</a>","");
            }
        }
        var msg = {
            content: {
                title: newText
            },
            type: 1
        };
        $(".footer .text").text("输入新消息").addClass("txt").css("line-height","1.5rem");
        chatSocket.sendMsg(msg);
    } else if (text == " " || !text) {
        alert("不能发送空白消息");
    }
    if (isAndroid) {
        resizeSectionHeight();
    }else {
        setTimeout(function(){
            resizeSectionHeight();
        },200)
    }
    if (!$(".footer .text").text() || $(".footer .text").text() == "输入新消息") {
        $(".footer button").addClass("hide");
        $(".footer .add").removeClass("hide");
    }
});
//发送图片
$(".chat .btm p:nth-of-type(2) input").on("change", function () {
    chatSocket.sendImage();
    $(this).val("");
    $(this).attr("disabled", "disabled");
});

$(".chat .footer .add").on("click", function () {
    $(".chat .btm").toggleClass("hide");
    resizeSectionHeight();
    goBottom();
});
$(".chat .footer .text").on("blur", function () {
    if (!$(this).text()){
        $(this).text("输入新消息").addClass("txt");
    }
    if (isAndroid){
        resizeSectionHeight();
    }else {
        setTimeout(function(){
            resizeSectionHeight();
        },200)
    }
});
$(".chat .footer .text").on("focus", function () {
    if (!$(this).text() || $(this).text() == "输入新消息"){
        $(this).text("").removeClass("txt");
    }
    $(".chat .btm").addClass("hide");
    resizeSectionHeight(function(){
        goBottom();
        if (!isAndroid) {
            setTimeout(function(){
                    $("body").scrollTop($("body")[0].scrollHeight);
            },100);
        }
    });
});

$(".message .message_list").on("click", ".list", function () {
    $(".message").addClass("hide");
    $(".chat").removeClass("hide");
    $(".footer .text").text("输入新消息").addClass("txt");
    resizeSectionHeight();
    $(".chat section").empty();
    window.location = "#id=" + $(this).attr("docid")+"&chatid="+$(this).attr("chatid");
    localStorage.setItem($(this).attr("chatid") + "_unread", 0);
    showChat.chatList();
    if (localStorage[$(this).attr("chatid") + "_state"]){
        showChat.chatShow();
    }else {
        chatSocket.getAllMsg(null,$(this).attr("chatid"));
    }
    setShare();
    if (official) {
        hideShare();
    }
});

$(".chat header .back").on("click", function () {
    history.back();
    $("head title").text("咨询医生")
});

$(".chat section").on("click", ".left .question", function () {
    var paperid = $(this).attr("paperid");
    var qid = $(this).attr("qid");
    if (paperid){
        localStorage.docid = getRouterParam("id");
        localStorage.chatid = getRouterParam("chatid");
        location.href = "question.html?paperid=" + paperid;
    }else {
        var token = getLocalStroagelogin().token;
        var title = $(this).find(".question_case>p:nth-of-type(1)").text();
        location.href = "patient_question.html?paperid=" + qid + "&token=" + token + "&title=" + title;
    }
});
$(".chat section").on("click", ".right .question", function () {
    var paperid = $(this).attr("qid");
    var token = getLocalStroagelogin().token;
    var title = $(this).find(".question_case>p:nth-of-type(1)").text();
    location.href = "patient_question.html?paperid=" + paperid + "&token=" + token + "&title=" + title;
});
$(".chat section").on("click", ".left .repository", function () {
    var id = $(this).attr("knowid");
    var token = getLocalStroagelogin().token;
    var title = $(this).find("p:nth-of-type(1)").text();
    location.href = "repository_details.html?id=" + id + "&token=" + token + "&title=" +title;
});

//到达页面底部
function goBottom() {
    if ($(".chat section div:last-of-type").hasClass("left")) {
        leftTop()
    } else if ($(".chat section div:last-of-type").hasClass("right")) {
        rightTop();
    }
}
//页面尺寸调整
function resizeSectionHeight(callback) {
    var windowHeight = $(window).height();
    var headerHeight = $(".chat header").height();
    var inviteHeight = $(".chat .invite").height();
    var footerHeight = $(".chat .footer").height();
    var btmHeight = $(".chat .btm").height();
    $(".chat section").height(windowHeight - inviteHeight - headerHeight - footerHeight - btmHeight);
    !!callback&&callback();
}
function rightTop() {
    var lastDivTop = $(".chat section").find(".right:last-of-type").offset().top;
    var docHeight = $(document).height();
    var scrollTop = $(".chat section").scrollTop();
    $(".chat section").scrollTop(lastDivTop + scrollTop + docHeight);
}
function leftTop() {
    var lastDivTop = $(".chat section").find(".left:last-of-type").offset().top;
    var docHeight = $(document).height();
    var scrollTop = $(".chat section").scrollTop();
    $(".chat section").scrollTop(lastDivTop + scrollTop + docHeight);
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
        if(dir==6||dir==8){
            next(canvas.toDataURL("image/jpeg",.2),drawHeight,drawWidth);
        }
        else{
            next(canvas.toDataURL("image/jpeg",.2),drawWidth,drawHeight);
        }
    }
}
//生成上传到百川的图片名称
function getUpName() {
    var time = new Date().format('yyyyMMdd_hhmmss');
    var num = parseInt(Math.random() * 9000) + 1000;
    return 'Img_' + time + '_' + num;
}
//获取阿里百川上传鉴权
function getUploadAli(file, fileName, msg) {
    var ali=localStorage['Ali_token'];
    if(!!ali){
        upAli(fileName,file,ali,msg);
    }
    else{
        getALi(fileName,file,msg)
    }
}
function upAli(fileName,file,ali,msg){
    uploadJSSDK({
        file: file,   //文件，必填,html5 file类型，不需要读数据流
        name: fileName,
        token: 'UPLOAD_AK_TOP ' + ali,  //鉴权token，必填
        dir: 'chat_img',  //目录，选填，默认根目录''
        retries: 0,  //重试次数，选填，默认0不重试
        maxSize: 0,  //上传大小限制，选填，默认0没有限制
        callback: function (percent, resultImg) {
            if (percent === 100 && resultImg) {
                msg.content.remoteUrl = resultImg.url;
                uploadImg(msg);
            } else if (percent === -1) {
                alert("上传失败");
                msg.state = 0;
                localStorage.setItem(msg.message_id, JSON.stringify(msg));
                NotificationCenter.postNotification('messageState', msg.message_id);
                NotificationCenter.postNotification('chatList');
            }
            $(".file_container input[type='file']").removeAttr('disabled');
            //percent（上传百分比）：-1失败；0-100上传的百分比；100即完成上传
            //result(服务端返回的responseText，json格式)
        }
    })
}
function uploadImg(msg){
    var postData = {
        "appToken": getLocalStroagelogin().token,
        "para": {
            "device_type": "PC",
            "device_id": "",
            "api_version": "1.0.0.0",
            "chat_id": msg.chat_id,
            "to_id": msg.to_id,
            "from_id":msg.from_id,
            "send_time": msg.send_time,
            "content": JSON.stringify(msg.content),
            "type": msg.type
        }
    };
    client.addRequest(
        JSON.stringify(postData),
        function (response) {
            var result = JSON.parse(new StringView(response));
            if (result.code == 0) {
                msg.state = 1;
                localStorage.setItem(msg.message_id, JSON.stringify(msg));
                NotificationCenter.postNotification('messageState', msg.message_id);
                NotificationCenter.postNotification('chatList');
            }
            else {
                msg.state = 0;
                localStorage.setItem(msg.message_id, JSON.stringify(msg));
                NotificationCenter.postNotification('messageState', msg.message_id);
                NotificationCenter.postNotification('chatList');
            }
        },
        {'api': '/api/php/SendMessage'},
        function (err) {
            console.log(err);
        }
    );
}
function getALi(name,file,msg){
        var fileName = name;
        if (!token) {
            token = getLocalStroagelogin().token;
        }
        var postData = {
            "appToken": token,
            "para": {
                "device_type": "PC",
                "device_id": "",
                "api_version": "1.0.0.0",
                "name": fileName
            }
        };
        $.ajax({
            "url": ebase + "/api/Sign/GetUploadSignWithAlibbForImg",
            "type": "POST",
            "data": postData,
            "dataType": "json",
            success: function (data) {
                if (data.Code === "0000") {
                    localStorage.setItem('Ali_token',data.Data);
                    upAli(fileName,file,data.Data,msg);
                }
            },
            error: function (xhr, errorType, error) {
                alert("上传失败，请重新上传！");
                $(".file_container input[type='file']").removeAttr('disabled');
                msg.state = 0;
                localStorage.setItem(msg.message_id, JSON.stringify(msg));
                NotificationCenter.postNotification('messageState', msg.message_id);
                NotificationCenter.postNotification('chatList');
                console.log(xhr);
                console.log(errorType);
                console.log(error)
            }
        })
}
/*-------------------------------------------发送病历---------------------------------------------------*/
function sendCase() {
    if (getQuestion().state && getQuestion().docid == getRouterParam("id")) {
        var send = getQuestion();
        chatSocket.sendMsg({
            content: {
                id: send.answerid,
                title: send.title
            },
            type: 7
        });
    }
}
/*--------------------------------------------------获取聊天间隔时间----------------------------------------------------------------------*/
function getChatIntervalTime(message1, message2, type) {
    var timeGap, msg2Timestamp, timeText = "";
    msg2Timestamp = new Date(parseInt(message2.send_time));
    if (!type) {
        timeGap = (parseInt(message2.send_time) - parseInt(message1.send_time)) / 1000;
        var minutes = parseInt(timeGap / 60);
        if (minutes < 5) {
            return null;
        }
    }
    var msg2Date = new Date(parseInt(message2.send_time)).format("yyyy-MM-dd");
    var todayDate = new Date().format("yyyy-MM-dd");
    var msg2Time = new Date(parseInt(message2.send_time)).format("hh:mm");
    if (msg2Date == todayDate) {
        timeText = msg2Time;
    } else {
        var todayTimestamp = new Date(todayDate).getTime();
        var msg2DateTimestamp = new Date(msg2Date).getTime();
        if (todayTimestamp - msg2DateTimestamp <= 24 * 60 * 60 * 1000) {
            //昨天
            timeText = "昨天 " + msg2Time;
        } else if (todayTimestamp - msg2DateTimestamp <= 7 * 24 * 60 * 60 * 1000) {
            //昨天之前
            var week = ["一", "二", "三", "四", "五", "六", "日"];
            timeText = "星期" + week[msg2Timestamp.getDay() - 1] + " " + msg2Time;
        } else {
            timeText = msg2Date + " " + msg2Time;
        }
    }
    return timeText;
}

function getTimeInt() {
    var chatArray = JSON.parse(localStorage[getRouterParam('chatid')]);
    var msg1 = 0, isNumberOne = true;
    var msg2 = {
        send_time: new Date().getTime()
    };
    if (chatArray.length > 1) {
        msg1 = getChatId(chatArray[chatArray.length - 2]);
        msg2 = getChatId(chatArray[chatArray.length - 1]);
        isNumberOne = false;
    }
    var intervalTime = getChatIntervalTime(msg1, msg2, isNumberOne);
    if (intervalTime) {
        var timeEle = "<p><span>" + intervalTime + "</span></p>";
        $(".chat section").append(timeEle);
    }
}

/*--------------------------------------获取医生个人信息----------------------------------------------------*/
function getDoc(){
    var token  = getLocalStroagelogin().token;
    var postData = {
        "appToken":token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "search_userid":getRouterParam("id")
        }
    };
    $.ajax({
        "url": phpEbase + "/api/php/QueryUserById",
        "type":"POST",
        "data":postData,
        "dataType":"json",
        success:function(data){
            debuger(data);
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
            alert("获取医生信息的时候服务器报错");
            debuger(xhr);
            debuger(errorType);
            debuger(error)
        }
    })
}