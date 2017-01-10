var official = false;
var share = 'http://static.11deyi.com';
var ebase = "http://app.11deyi.com:8082";
var phpEbase = "http://app.11deyi.com:8082";
var web = "ws://app.11deyi.com:10003";
var nav = "http://wx.11deyi.com/";
var Api = "Api";
var token = getUrlParam("token");
var pageindex = 1;
var pagesize = 10;
if (location.search) {
    var tel = getUrlParam("tel");
    var name = getUrlParam("name");
    var type = getUrlParam("type")
}
if (!official) {
    share = 'http://static.test.11deyi.com';
    ebase = "http://app.11deyi.com:8081";
    Api = "TApi";
    phpEbase = "http://app.test.11deyi.com";
    web = "ws://app.test.11deyi.com:10001";
    nav = "http://wx.test.11deyi.com/"
}
function initLocalStorage() {
    if (location.search) {
        if (!localStorage.judge && tel && name) {
            var a = {tel: tel, name: name, type: type, jcylw: true};
            localStorage.judge = JSON.stringify(a)
        }
    }
    if (!localStorage.login) {
        var b = {};
        localStorage.login = JSON.stringify(b)
    }
    if (!location.search && localStorage.judge) {
        localStorage.removeItem("judge")
    }
    if (!localStorage.testMyUrl) {
        localStorage.testMyUrl = ebase
    }
    if (localStorage.testMyUrl !== ebase) {
        localStorage.removeItem("testMyUrl");
        localStorage.login = JSON.stringify({});
        localStorage.testMyUrl = ebase
    }
}
initLocalStorage();
function win() {
    $(".consult_loading p").text("关注成功");
    $(".consult_loading img").addClass("result").attr("src", "img/chenggong_@2x.png");
    setTimeout(function () {
        $(".consult_loading").addClass("hide");
        $(".consult_loading img").removeClass("result").attr("src", "img/loading.gif");
        $(".consult_loading p").text("正在关注")
    }, 500)
}
function fail() {
    $(".consult_loading p").text("关注失败");
    $(".consult_loading img").addClass("result").attr("src", "img/fail@2x.png");
    setTimeout(function () {
        $(".consult_loading").addClass("hide");
        $(".consult_loading img").removeClass("result").attr("src", "img/loading.gif");
        $(".consult_loading p").text("正在关注")
    }, 500)
}
function clickFocus(c, a, b) {
    $(".consult_loading").removeClass("hide");
    createFocus(c, a, b)
}
function verdictLogin(c, d, e) {
    var b = "createFocus";
    var f = {userid: c, name: d, type: e};
    var a = getLocalStroagelogin();
    if (localStorage.judge || a.token) {
        getToken(function () {
            clickFocus(c, d, e)
        }, f, b)
    } else {
        $(".popup").removeClass("hide");
        $("html,body").addClass("ovfHiden")
    }
}
function updateLogin() {
    var a = getLocalStroagelogin();
    a.token = getUrlParam("token");
    a.userid = getUrlParam("userid").toUpperCase();
    localStorage.login = JSON.stringify(a)
}
function getLoginUserToken() {
    if (getLocalStroagelogin().token) {
        token = getLocalStroagelogin().token
    }
}
function goToHomePage(a) {
    location.href = nav + 'GetCode?id=' + a + '&type=SHARE'
}
function getUser(b, c, e, d) {
    var a = {appToken: c, para: {device_type: "PC", device_id: "", api_version: "1.0.0.0", search_userid: b}};
    $.ajax({
        url: phpEbase + "/api/php/QueryUserById", data: a, type: "POST", dataType: "json", success: function (f) {
            console.log(f);
            addLocalStorageLogin(function (h) {
                var g = f.Data;
                if (g.HeadImg) {
                    h.faceimg = g.HeadImg
                } else {
                    h.faceimg = "http://www.11deyi.com/img/30.png"
                }
                h.name = g.Name;
                localStorage.login = JSON.stringify(h)
            });
            e(f)
        }, error: function (h, g, f) {
            console.log(h);
            console.log(g);
            console.log(f);
            d()
        }
    })
}
function getUrlParam(a) {
    var b = new RegExp("(^|&)" + a + "=([^&]*)(&|$)");
    var c = window.location.search.substr(1).match(b);
    if (c != null) {
        return decodeURI(c[2])
    }
    return null
}
function getRouterParam(a) {
    var b = new RegExp("(^|&)" + a + "=([^&]*)(&|$)");
    var c = window.location.hash.substr(1).match(b);
    if (c != null) {
        return decodeURI(c[2])
    }
    return null
}
$(".case_science").on("click", function () {
    location.href = "case_science.html" + location.search
});
$(".index").on("click", function () {
    location.href = "index.html" + location.search
});
$(".turn_yard").on("click", function () {
    location.href = "turn_yard.html" + location.search
});
$(".popup button:nth-of-type(1)").on("click", function () {
    createBackUrl(location.href);
    location.href = "login.html"
});
$(".popup button:nth-of-type(2)").on("click", function () {
    createBackUrl(location.href);
    location.href = "register.html"
});
$(".popup .login_popup span").on("click", function () {
    $(".popup").addClass("hide");
    $("html,body").removeClass("ovfHiden")
});
$(".switch p:nth-of-type(1)").on("click", function () {
    location.href = "concern_doctor.html" + location.search
});
$(".switch p:nth-of-type(2)").on("click", function () {
    location.href = "my_turnyard.html" + location.search
});
function createChatDoctorInfo(e, c, b) {
    var a = chatId(e, getLocalStroagelogin().userid);
    var d = {name: c, id: e, faceimg: b, uid: getLocalStroagelogin().userid};
    localStorage.setItem(a + "_info", JSON.stringify(d))
}
function createChatInfo(c, b, d, f, g) {
    var a = chatId(c, b);
    var e = {name: d, id: c, faceimg: f, uid: b, userimg: g};
    localStorage.setItem(a + "_info", JSON.stringify(e))
}
function createDoctorOrUserInfo(f, b, a) {
    var e = b;
    var c = a;
    if (!f) {
        return null
    }
    if (!e) {
        e = "医生"
    }
    if (!c) {
        c = "http://www.11deyi.com/img/30.png"
    }
    var d = {name: e, headimg: c, id: f};
    localStorage[f] = JSON.stringify(d)
}
function addLocalStorageJudge(b) {
    var a = JSON.parse(localStorage.judge);
    b(a)
}
function addLocalStorageLogin(b) {
    var a = JSON.parse(localStorage.login);
    b(a)
}
function getLocalStroagelogin() {
    if (localStorage.login) {
        var a = JSON.parse(localStorage.login);
        return a
    }
    return null
}
function debuger(a) {
    console.log(a)
}
function createQuestionId(b) {
    var a = b;
    sessionStorage.questionid = a
}
function getLocalStorageQuestionId() {
    var a = sessionStorage.questionid;
    return a
}
function createBackUrl(b) {
    var a = b;
    localStorage.backurl = a
}
function getLocalStorageBackUrl() {
    var a = localStorage.backurl;
    return a
}
function createUserId(b) {
    var a = b;
    localStorage.userid = a
}
function getLocalStorageUserId() {
    var a = localStorage.userid;
    return a
}
function getChatId(a) {
    if (localStorage[a]) {
        return JSON.parse(localStorage[a])
    }
    return null
}
function createChatSend(c, b, d) {
    var a = c;
    a.state = b;
    a.hxid = d;
    localStorage.send = JSON.stringify(a)
}
function updateChatSend(a) {
    var b = JSON.parse(localStorage.send);
    b.state = a;
    localStorage.send = JSON.stringify(b)
}
function getQuestion() {
    if (localStorage.question) {
        return JSON.parse(localStorage.question)
    } else {
        return {}
    }
}
var browser = {
    versions: function () {
        var a = navigator.userAgent, b = navigator.appVersion;
        return {
            trident: a.indexOf("Trident") > -1,
            presto: a.indexOf("Presto") > -1,
            webKit: a.indexOf("AppleWebKit") > -1,
            gecko: a.indexOf("Gecko") > -1 && a.indexOf("KHTML") == -1,
            mobile: !!a.match(/AppleWebKit.*Mobile.*/),
            ios: !!a.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: a.indexOf("Android") > -1 || a.indexOf("Linux") > -1,
            iPhone: a.indexOf("iPhone") > -1,
            iPad: a.indexOf("iPad") > -1,
            webApp: a.indexOf("Safari") == -1
        }
    }(), language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
var isWx = false;
var isAndroid = browser.versions.android;
function wxBrowser() {
    if (browser.versions.mobile) {
        var a = navigator.userAgent.toLowerCase();
        if (a.match(/MicroMessenger/i) == "micromessenger") {
            $("header").addClass("hide");
            isWx = true
        }
    }
}
wxBrowser();
function getImageWidth(c, b, d) {
    var a = new Image();
    a.src = c;
    if (a.complete) {
        d(a.width, a.height, b)
    } else {
        a.onload = function () {
            d(a.width, a.height, b)
        }
    }
}
var blobObj = {
    setBlob: function (b, d, c) {
        var a = new window.FileReader();
        a.readAsDataURL(b);
        a.onloadend = function () {
            d(a.result, c)
        }
    }, getBlob: function (c, h) {
        var f = c.split(","), e = f[0].match(/:(.*?);/)[1], b = atob(f[1]);
        var g = b.length, a = new Array(g);
        while (g--) {
            a[g] = b.charCodeAt(g)
        }
        var d = new Uint8Array(a);
        h(new Blob([d], {type: e}))
    }, getAudioBlob: function (i, e, k) {
        var g = i.split(","), b = g[0].match(/:(.*?);/)[1], c = atob(g[1]);
        var d = c.length, h = new Array(d);
        while (d--) {
            h[d] = c.charCodeAt(d)
        }
        var j = new Uint8Array(h);
        var f = new Blob([j], {type: b});
        var a = URL.createObjectURL(f);
        var l = new XMLHttpRequest();
        l.open("GET", a, true);
        l.responseType = "blob";
        l.onload = function () {
            var m = this.response;
            k(m, e);
            window.URL.revokeObjectURL(a)
        };
        l.send(null)
    }, returnBlob: function (c, b) {
        var a = new XMLHttpRequest();
        a.open("GET", b.content.remoteUrl, true);
        a.responseType = "blob";
        a.onload = function () {
            var d = this.response;
            c(d, b)
        };
        a.send(null)
    }
};
function strToJson(str) {
    if (JSON.parse) {
        return JSON.parse(str)
    }
    var json = eval("(" + str + ")");
    return json
}
function md5(o) {
    function w(b, a) {
        return (b << a) | (b >>> (32 - a))
    }

    function E(k, b) {
        var U, a, d, x, c;
        d = (k & 2147483648);
        x = (b & 2147483648);
        U = (k & 1073741824);
        a = (b & 1073741824);
        c = (k & 1073741823) + (b & 1073741823);
        if (U & a) {
            return (c ^ 2147483648 ^ d ^ x)
        }
        if (U | a) {
            if (c & 1073741824) {
                return (c ^ 3221225472 ^ d ^ x)
            } else {
                return (c ^ 1073741824 ^ d ^ x)
            }
        } else {
            return (c ^ d ^ x)
        }
    }

    function s(a, c, b) {
        return (a & c) | ((~a) & b)
    }

    function r(a, c, b) {
        return (a & b) | (c & (~b))
    }

    function q(a, c, b) {
        return (a ^ c ^ b)
    }

    function p(a, c, b) {
        return (c ^ (a | (~b)))
    }

    function f(V, U, Z, Y, k, W, X) {
        V = E(V, E(E(s(U, Z, Y), k), X));
        return E(w(V, W), U)
    }

    function C(V, U, Z, Y, k, W, X) {
        V = E(V, E(E(r(U, Z, Y), k), X));
        return E(w(V, W), U)
    }

    function t(V, U, Z, Y, k, W, X) {
        V = E(V, E(E(q(U, Z, Y), k), X));
        return E(w(V, W), U)
    }

    function e(V, U, Z, Y, k, W, X) {
        V = E(V, E(E(p(U, Z, Y), k), X));
        return E(w(V, W), U)
    }

    function g(k) {
        var V;
        var d = k.length;
        var c = d + 8;
        var b = (c - (c % 64)) / 64;
        var U = (b + 1) * 16;
        var W = Array(U - 1);
        var a = 0;
        var x = 0;
        while (x < d) {
            V = (x - (x % 4)) / 4;
            a = (x % 4) * 8;
            W[V] = (W[V] | (k.charCodeAt(x) << a));
            x++
        }
        V = (x - (x % 4)) / 4;
        a = (x % 4) * 8;
        W[V] = W[V] | (128 << a);
        W[U - 2] = d << 3;
        W[U - 1] = d >>> 29;
        return W
    }

    function G(c) {
        var b = "", d = "", k, a;
        for (a = 0; a <= 3; a++) {
            k = (c >>> (a * 8)) & 255;
            d = "0" + k.toString(16);
            b = b + d.substr(d.length - 2, 2)
        }
        return b
    }

    function u(b) {
        b = b.replace(/\r\n/g, "\n");
        var a = "";
        for (var k = 0; k < b.length; k++) {
            var d = b.charCodeAt(k);
            if (d < 128) {
                a += String.fromCharCode(d)
            } else {
                if ((d > 127) && (d < 2048)) {
                    a += String.fromCharCode((d >> 6) | 192);
                    a += String.fromCharCode((d & 63) | 128)
                } else {
                    a += String.fromCharCode((d >> 12) | 224);
                    a += String.fromCharCode(((d >> 6) & 63) | 128);
                    a += String.fromCharCode((d & 63) | 128)
                }
            }
        }
        return a
    }

    var D = Array();
    var K, i, F, v, h, T, S, R, Q;
    var N = 7, L = 12, I = 17, H = 22;
    var B = 5, A = 9, z = 14, y = 20;
    var n = 4, m = 11, l = 16, j = 23;
    var P = 6, O = 10, M = 15, J = 21;
    o = u(o);
    D = g(o);
    T = 1732584193;
    S = 4023233417;
    R = 2562383102;
    Q = 271733878;
    for (K = 0; K < D.length; K += 16) {
        i = T;
        F = S;
        v = R;
        h = Q;
        T = f(T, S, R, Q, D[K + 0], N, 3614090360);
        Q = f(Q, T, S, R, D[K + 1], L, 3905402710);
        R = f(R, Q, T, S, D[K + 2], I, 606105819);
        S = f(S, R, Q, T, D[K + 3], H, 3250441966);
        T = f(T, S, R, Q, D[K + 4], N, 4118548399);
        Q = f(Q, T, S, R, D[K + 5], L, 1200080426);
        R = f(R, Q, T, S, D[K + 6], I, 2821735955);
        S = f(S, R, Q, T, D[K + 7], H, 4249261313);
        T = f(T, S, R, Q, D[K + 8], N, 1770035416);
        Q = f(Q, T, S, R, D[K + 9], L, 2336552879);
        R = f(R, Q, T, S, D[K + 10], I, 4294925233);
        S = f(S, R, Q, T, D[K + 11], H, 2304563134);
        T = f(T, S, R, Q, D[K + 12], N, 1804603682);
        Q = f(Q, T, S, R, D[K + 13], L, 4254626195);
        R = f(R, Q, T, S, D[K + 14], I, 2792965006);
        S = f(S, R, Q, T, D[K + 15], H, 1236535329);
        T = C(T, S, R, Q, D[K + 1], B, 4129170786);
        Q = C(Q, T, S, R, D[K + 6], A, 3225465664);
        R = C(R, Q, T, S, D[K + 11], z, 643717713);
        S = C(S, R, Q, T, D[K + 0], y, 3921069994);
        T = C(T, S, R, Q, D[K + 5], B, 3593408605);
        Q = C(Q, T, S, R, D[K + 10], A, 38016083);
        R = C(R, Q, T, S, D[K + 15], z, 3634488961);
        S = C(S, R, Q, T, D[K + 4], y, 3889429448);
        T = C(T, S, R, Q, D[K + 9], B, 568446438);
        Q = C(Q, T, S, R, D[K + 14], A, 3275163606);
        R = C(R, Q, T, S, D[K + 3], z, 4107603335);
        S = C(S, R, Q, T, D[K + 8], y, 1163531501);
        T = C(T, S, R, Q, D[K + 13], B, 2850285829);
        Q = C(Q, T, S, R, D[K + 2], A, 4243563512);
        R = C(R, Q, T, S, D[K + 7], z, 1735328473);
        S = C(S, R, Q, T, D[K + 12], y, 2368359562);
        T = t(T, S, R, Q, D[K + 5], n, 4294588738);
        Q = t(Q, T, S, R, D[K + 8], m, 2272392833);
        R = t(R, Q, T, S, D[K + 11], l, 1839030562);
        S = t(S, R, Q, T, D[K + 14], j, 4259657740);
        T = t(T, S, R, Q, D[K + 1], n, 2763975236);
        Q = t(Q, T, S, R, D[K + 4], m, 1272893353);
        R = t(R, Q, T, S, D[K + 7], l, 4139469664);
        S = t(S, R, Q, T, D[K + 10], j, 3200236656);
        T = t(T, S, R, Q, D[K + 13], n, 681279174);
        Q = t(Q, T, S, R, D[K + 0], m, 3936430074);
        R = t(R, Q, T, S, D[K + 3], l, 3572445317);
        S = t(S, R, Q, T, D[K + 6], j, 76029189);
        T = t(T, S, R, Q, D[K + 9], n, 3654602809);
        Q = t(Q, T, S, R, D[K + 12], m, 3873151461);
        R = t(R, Q, T, S, D[K + 15], l, 530742520);
        S = t(S, R, Q, T, D[K + 2], j, 3299628645);
        T = e(T, S, R, Q, D[K + 0], P, 4096336452);
        Q = e(Q, T, S, R, D[K + 7], O, 1126891415);
        R = e(R, Q, T, S, D[K + 14], M, 2878612391);
        S = e(S, R, Q, T, D[K + 5], J, 4237533241);
        T = e(T, S, R, Q, D[K + 12], P, 1700485571);
        Q = e(Q, T, S, R, D[K + 3], O, 2399980690);
        R = e(R, Q, T, S, D[K + 10], M, 4293915773);
        S = e(S, R, Q, T, D[K + 1], J, 2240044497);
        T = e(T, S, R, Q, D[K + 8], P, 1873313359);
        Q = e(Q, T, S, R, D[K + 15], O, 4264355552);
        R = e(R, Q, T, S, D[K + 6], M, 2734768916);
        S = e(S, R, Q, T, D[K + 13], J, 1309151649);
        T = e(T, S, R, Q, D[K + 4], P, 4149444226);
        Q = e(Q, T, S, R, D[K + 11], O, 3174756917);
        R = e(R, Q, T, S, D[K + 2], M, 718787259);
        S = e(S, R, Q, T, D[K + 9], J, 3951481745);
        T = E(T, i);
        S = E(S, F);
        R = E(R, v);
        Q = E(Q, h)
    }
    return (G(T) + G(S) + G(R) + G(Q)).toLowerCase()
}
function clearSame(a) {
    if (String.splice === undefined) {
        for (var d = 0; d < a.length - 1; d++) {
            for (var c = (d + 1); c < a.length;) {
                if (a[d] == a[c]) {
                    for (var b = c; b < a.length - 1; b++) {
                        a[b] = a[b + 1]
                    }
                    a.pop();
                    continue
                }
                c++
            }
        }
        return a
    }
    for (var d = 0; d < a.length - 1; d++) {
        for (var c = d + 1; c < a.length;) {
            if (a[d] == a[c]) {
                a.splice(c, 1);
                continue
            }
            c++
        }
    }
    return a
}
function loadPress() {
    return $("<div class='loadPress'> <div class='rect1'></div> <div class='rect2'></div> <div class='rect3'></div> <div class='rect4'></div> <div class='rect5'></div> </div>")
}
function chatId(b, a) {
    var c = "";
    if (b > a) {
        c = md5(b + a)
    } else {
        c = md5(a + b)
    }
    return c
}
Date.prototype.format = function (c) {
    var b = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(c)) {
        c = c.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    for (var a in b) {
        if (new RegExp("(" + a + ")").test(c)) {
            c = c.replace(RegExp.$1, RegExp.$1.length == 1 ? b[a] : ("00" + b[a]).substr(("" + b[a]).length))
        }
    }
    return c
};
function updateTitle(c) {
    var a = $("body");
    document.title = c;
    var b = $("<iframe style='display:none;' src='/favicon.ico'></iframe>");
    b.on("load", function () {
        setTimeout(function () {
            b.off("load").remove()
        }, 0)
    }).appendTo(a)
}
function setReserver(b, d, c, e) {
    var f = (e == 1 ? "PUSH" : "WX");
    var a = {
        appToken: c,
        para: {
            uid: d,
            channel: f,
            datestamp: (new Date().getTime()).toString(),
            device_type: "PC",
            device_id: " ",
            api_version: "1.0.0.0"
        }
    };
    b.addRequest(JSON.stringify(a), function (h) {
        var g = JSON.parse(new StringView(h));
        console.log(g);
        if (g.code == 0) {
            console.log("PushChannelSet Suc!")
        } else {
            console.log("fiald")
        }
    }, {api: "/api/php/PushChannelSet"}, function (g) {
        console.log(g)
    })
};
