var passParams = new UrlSearch();

var app = new Vue({
    el: '#app',
    data: {
        tips:'',
        isSubmit:false,
        openId:passParams.openId,//传过来的参数
        myOrderList:[],//预订列表
        deleteMsg:'',//删除座
        showModel:false,
    },
    created: function () {
        this.getMyBarSet();
    },
    methods: {
        //获取订座信息
        getMyBarSet: function () {
            var that = this;
            var params = {
                openId: this.openId||'10000',
            }
            instance.post('app/seat/myseatplan', Qs.stringify(params)).then(function (res) {
                var resVal = res.data;
                if(res.status=='200' &&　resVal){
                    if(resVal.code==0){
                        that.myOrderList = resVal.data.list
                    }else{
                        that.requestErrFun(resVal.msg)
                    }
                }
            }).catch(that.netErrFun);
        },
        pickeedDel:function(item){
            this.delItem = item;
            this.deleteMsg = item.arrivaldate+'的'+item.number;
            this.showModel = true
        },
        //不取消
        noDel:function(){
            this.showModel = false
        },
        //删除提交
        cancelOrder(){
            var that = this;
            if(that.isSubmit){
                that.errTipsFun('删除中,请稍后..')
                return
            }
            var params = {
                seatplanid:this.delItem.uuid,
            }
            this.showModel = false;
            that.isSubmit = true;
            instance.post('app/seat/celseatplan', Qs.stringify(params)).then(function (res) {
                that.isSubmit = false;
                var resVal = res.data;
                if(res.status=='200' &&　resVal){
                    if(resVal.code==0){
                        that.errTipsFun('取消成功')
                        setTimeout(function () {
                            that.getMyBarSet();
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