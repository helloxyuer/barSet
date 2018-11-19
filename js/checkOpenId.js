var appid = 'wx11a1b266d02b9112';
var params = new UrlSearch();
var local = window.location.href;
if(!sessionStorage.getItem('openid')||!params.code){
    window.location.href ='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+encodeURIComponent(local)+'&response_type=code&scope=snsapi_base&state=1&connect_redirect=1#wechat_redirect'
}else{
    if(!sessionStorage.getItem('openid')){
        var passData = {
            code:params.code
        }
        instance.post('app/seat/openid', Qs.stringify(passData)).then(function (res) {
            var resVal = res.data;
            if(res.status=='200' &&　resVal){
                if(resVal.code==0){
                    sessionStorage.setItem('openid',resVal.data)
                }
            }
        });
    }
}