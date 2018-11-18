var instance = axios.create({
    baseURL: window.location.origin+'/renren-fast/',
    timeout: 1000,
});

function UrlSearch() {
    var name, value;
    var str = location.href; //取得整个地址栏
    if((str.lastIndexOf("#")>0)&&(str.lastIndexOf("?")<str.lastIndexOf("#"))){//如果末尾有#，并且是出现在？号后面的
        str=str.substring(0,str.lastIndexOf("#"));
    }
    var num = str.indexOf("?")
    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
    var arr = str.split("&"); //各个参数放到数组里
    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            this[name] = value;
        }
    }
}