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
var passParams = new UrlSearch();
var instance = axios.create({
    baseURL: window.location.origin+'/renren-fast/',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
});

var app = new Vue({
    el: '#app',
    data: {
        tips:'',
        isSubmit:false,
        number:passParams.number,//传过来的参数
        arrivaldate:passParams.arrivaldate||'',//当前选择时间
        time:'',
        name:'',
        phone:'',
        num:'',
    },
    created: function () {
        this.getBarTime();
    },
    methods: {
        //获取店铺营业和停业时间
        getBarTime: function () {
            var that = this;
            instance.post('app/seat/abouttime').then(function (res) {
                var resVal = res.data;
                if(res.status=='200' &&　resVal){
                    if(resVal.code==0){
                        console.log(resVal.data)
                    }else{
                        that.requestErrFun(resVal.msg)
                    }
                }
            }).catch(that.netErrFun);
        },
        //确认提交
        submitSet:function(){

        },
        //校验数据
        checkParams:function(){
            if (!this.name) {
                this.errTipsFun('请输入姓名')
                return
            }
            if (!this.num) {
                this.errTipsFun('请输入到客人数')
                return
            }
            if (!this.phone) {
                this.errTipsFun('请输入电话')
                return
            }
            if (!/^1[0-9]{10}$/.test(this.phone)) {
                this.errTipsFun('电话号有误')
                return
            }
        },
        errTipsFun:function (err,time) {
            var that = this;
            time = time||'1000';
            that.tips = err;
            setTimeout(function () {
                that.tips = '';
            },time)
        },
        requestErrFun:function (err) {
            this.errTipsFun(err.msg)
        },
        netErrFun:function (err) {
            this.errTipsFun('网络异常')
        }

    },
})