var passParams = new UrlSearch();

var app = new Vue({
    el: '#app',
    data: {
        tips:'',
        isSubmit:false,
        number:passParams.number,//传过来的参数
        openId:passParams.openId,//传过来的参数
        arrivaldate:passParams.arrivaldate||'',//当前选择时间
        arrivaltime:'15:30',
        name:'',
        phone:'',
        num:'',
    },
    created: function () {
        this.getBarTime();
    },
    methods: {
        //生成到店时间点
        creatTimeArr:function(){

        },
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
        submitSet(){
            var that = this;
            if(that.isSubmit){
                that.errTipsFun('提交中,请稍后..')
                return
            }
            if(!this.checkParams()){
                return
            }
            var params = {
                openId:this.openId,
                number:this.number,
                arrivaldate:this.arrivaldate,
                arrivaltime:this.arrivaltime,
                phone:this.phone,
                name:this.name,
                num:this.num,
            }
            that.isSubmit = true;
            instance.post('app/seat/seatplan', Qs.stringify(params)).then(function (res) {
                that.isSubmit = false;
                var resVal = res.data;
                if(res.status=='200' &&　resVal){
                    if(resVal.code==0){
                        that.errTipsFun('预定成功')
                        setTimeout(function () {
                            window.location.href ="index.html"
                        },1000)
                    }else{
                        that.requestErrFun(resVal.msg)
                    }
                }
            }).catch(function(err){
                that.isSubmit = false;
                that.netErrFun(err)
            });

        },
        //校验数据
        checkParams:function(){
            if (!this.name) {
                this.errTipsFun('请输入姓名')
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
            if (!this.num) {
                this.errTipsFun('请输入到客人数')
                return
            }
            return true
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