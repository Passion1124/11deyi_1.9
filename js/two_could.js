$(function(){
    var name=getUrlParam('name');
    var img1=decodeURIComponent(getUrlParam('img1'));
    var img2=decodeURIComponent(getUrlParam('img2'));
    var code=decodeURIComponent(getUrlParam('code'));
    if(!!name&&!!img1&&!!img2&&!!code){
        $(".dName").html(name);
        $($(".doc_pat>img")[0]).attr('src',img1);
        $($(".doc_pat>img")[0]).attr('src',img2);
        $("#code").attr('src',code);
    }
    else{
        console.log('参数不全！');
    }
})