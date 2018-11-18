var appid = 'wx11a1b266d02b9112';
var params = new UrlSearch();
var local = window.location.href;
if(!params.code){
    window.location.href ='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+encodeURIComponent(local)+'&response_type=code&scope=snsapi_base&state=1&connect_redirect=1#wechat_redirect'
}else{
    axios.get("https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + appsecret
        + "&code=" + params.code + "&grant_type=authorization_code").then(function (data) {
            console.log(data)

    })


    //getOpenId(params.code)
}