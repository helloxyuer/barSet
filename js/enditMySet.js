var passParams = new UrlSearch();

var app = new Vue({
    el: '#app',
    data: {
        tips:'',
        isSubmit:false,
        timeArr:[],
        showTimePicker:false,//时间弹窗
        barOpentime:'',//营业时间
        number:passParams.number||'',
        maxnum:passParams.num||'',
        arrivaldate:passParams.arrivaldate||'',//当前选择时间
        arrivaltime:'',
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
            var timeArrList = [];
            var timeArr = this.barOpentime.split(',');
            var startTime = timeArr[0].split(':');
            var startTimeNum = (+startTime[0])*60 + (+startTime[1]);
            var midTimeNum = startTimeNum;
            var endTime = timeArr[1].split(':');
            var endTimeNum = (+endTime[0])*60 + (+endTime[1]);
            while((midTimeNum>=startTimeNum) && (endTimeNum>=midTimeNum)){
                var min = midTimeNum%60;
                timeArrList.push(parseInt(midTimeNum/60)+':'+(min==0?'00':min))
                midTimeNum = midTimeNum + 30
            }
            this.timeArr = timeArrList;
        },
        //获取店铺营业和停业时间
        getBarTime: function () {
            var that = this;
            instance.post('app/seat/abouttime').then(function (res) {
                var resVal = res.data;
                if(res.status=='200' &&　resVal){
                    if(resVal.code==0){
                        that.barOpentime = resVal.data;
                        that.creatTimeArr();
                    }else{
                        that.requestErrFun(res.data.msg)
                    }
                }
            }).catch(that.netErrFun);
        },
        //打开时间弹窗
        openTimePicker:function(){
            this.showTimePicker = true;
        },
        //选择时间
        pickedTime:function(item){
            this.arrivaltime  = item;
            this.showTimePicker = false;
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
                openId:sessionStorage.getItem('openid'),
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
                            window.location.replace("mySet.html")
                        },1000)
                    }else{
                        that.requestErrFun(res.data.msg)
                    }
                }
            }).catch(function(err){
                that.isSubmit = false;
                that.netErrFun(err)
            });

        },
        //校验数据
        checkParams:function(){
            if (!this.arrivaltime) {
                this.errTipsFun('请选择到店时间')
                return
            }
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
            if (this.num>this.maxnum) {
                this.errTipsFun('到客人数超过该桌最大人数')
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
        requestErrFun:function (msg) {
            this.errTipsFun(msg)
        },
        netErrFun:function (err) {
            this.errTipsFun('网络异常')
        }

    },
})