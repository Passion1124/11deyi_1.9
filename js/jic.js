/**
 * Created by Administrator on 2016/10/21.
 */
var jic = {
    /**
     * Receives an Image Object (can be JPG OR PNG) and returns a new Image Object compressed
     * @param {Image} source_img_obj The source Image Object
     * @return {Image} result_image_obj The compressed Image Object
     */
    compress: function(source_img_obj, output_format){
        var mime_type = "image/jpeg";
        if(output_format!=undefined && output_format=="png"){
            mime_type = "image/png";
        }

        var cvs = document.createElement('canvas');
        //naturalWidth真实图片的宽度
        cvs.width = source_img_obj.naturalWidth;
        cvs.height = source_img_obj.naturalHeight;
        var ctx = cvs.getContext("2d").drawImage(source_img_obj, 0, 0);
        var newImageData = cvs.toDataURL(mime_type, 0.2);
        var result_image_obj = new Image();
        result_image_obj.src = newImageData;
        //  result_image_obj.style.width=source_img_obj.naturalWidth;
        //  result_image_obj.style.height=source_img_obj.naturalHeight;
        return result_image_obj;
    },
}

//console.dir(WebIM.utils,WebIM);
/*WebIM.utils.getFileUrl= function(fileInputId,callback) {
    var fileObj = typeof fileInputId === 'string' ? document.getElementById(fileInputId) : fileInputId;
    try {
        if (window.URL.createObjectURL) {
            var fileItems = fileObj.files;
            var u = fileItems.item(0);
            for (var i = 0, f; f = fileItems[i]; i++) {
                // Only process image files.
                if (!f.type.match('image.*')) {
                    continue;
                }

                var reader = new FileReader();

                // Closure to capture the file information.
                reader.onload = (function(theFile) {
                    return function(e) {
                        // Render thumbnail.
                        // console.log(evt.target.files[0]);
                        // console.log(e.target);
                        //console.log(e.target.result);
                        var i = document.getElementById("test");
                        i.src = event.target.result;
                        $(i).css('width',$(i).width()+'px');
                        var quality =  50;
                        var base = jic.compress(i,quality).src;
                        //base64 to blob
                        var obj = base.split(','), mime = obj[0].match(/:(.*?);/)[1], //获取类型
                            bstr = atob(obj[1]);
                        var n = bstr.length, arr = new Array(n);
                        while (n--) {
                            arr[n] = bstr.charCodeAt(n);
                        }
                        var u8arr=new Uint8Array(arr);
                        var newb=new Blob([u8arr], { type: mime });
                        console.log(newb);
                        callback(newb,u);
                    };
                })(f);

                // Read in the image file as a data URL.
                reader.readAsDataURL(f);
            }

            //if (fileItems.length > 0) {
            //    var u = fileItems.item(0);
            //    uri.data = u;
            //    uri.url = window.URL.createObjectURL(u);
            //    uri.filename = u.name || '';
            //}
        } else {
            // IE
            var u = document.getElementById(fileInputId).value;
            uri.url = u;
            var pos1 = u.lastIndexOf('/');
            var pos2 = u.lastIndexOf('\\');
            var pos = Math.max(pos1, pos2);
            if (pos < 0) uri.filename = u;else uri.filename = u.substring(pos + 1);
        }


    } catch (e) {
        throw e;
    }
}*/

function getCompressImage(files,callback){

    for (var i = 0, f; f = files[i]; i++) {
        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }

        var reader = new FileReader();

        reader.onload = (function(theFile) {
            return function(event) {
                var img = document.getElementById('test');
                img.src = event.target.result;
                $(img).css('width', $(img).width() + 'px');
                var base = jic.compress(img).src;

                var obj = base.split(','),
                    mime = obj[0].match(/:(.*?);/)[1], //获取类型
                    bstr = atob(obj[1]);
                var n = bstr.length,
                    arr = new Array(n);
                while (n--) {
                    arr[n] = bstr.charCodeAt(n);
                }
                var u8arr = new Uint8Array(arr);
                var newb = new Blob([u8arr], {
                    type: mime
                });
                //console.log(newb);
                var imgsrc = URL.createObjectURL(newb);
                img.src = imgsrc;
                //return imgsrc
                callback(newb)
            }
        })(f);
        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}

