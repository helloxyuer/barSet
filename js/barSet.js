var instance = axios.create({
    baseURL: window.location.origin+'/renren-fast/',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
});

var app = new Vue({
    el: '#app',
    data: {
        tips:'',//错误提示语
        arrivaldate:'',//当前选择时间
        timeArr:[],//时间列表
        selectSet:{},//锁定的座位
        isSubmit:false,
        setArr: [],
        openId:'10000'
    },
    created: function () {
        this.creatTimeArr();
        this.getBarSet();

    },
    methods: {
        //创建时间数组
        creatTimeArr:function(){
            var timeArr = [];
            var today = new Date();
            var todayStr = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            this.arrivaldate = todayStr;
            timeArr.push({
                time:todayStr,
                picked:true
            })
            for(var i=1;i<7;i++){
                var addDay = new Date(today.getTime() + i*24*60*60*1000);
                var addayStr = addDay.getFullYear()+'-'+(addDay.getMonth()+1)+'-'+addDay.getDate();
                timeArr.push({
                    time:addayStr,
                    picked:false
                })
            }
            this.timeArr = timeArr;
        },
        //时间选择
        pickedTime:function(item){
            this.timeArr.forEach(function (data) {
                data.picked = false
            });
            item.picked = true;
            this.arrivaldate = item.time;
            this.getBarSet(this.arrivaldate);
        },
        //获取可预定座位列表
        getBarSet: function (time) {
            var that = this;
            var params = {
                arrivaldate: time||'',
                page:1,
                limit:30,
            }
            instance.post('app/seat/list', Qs.stringify(params)).then(function (res) {
                var resVal = res.data;
                if(res.status=='200' &&　resVal){
                    if(resVal.code==0){
                        var resArr = resVal.data.list;
                        resArr.forEach(function (data) {
                            data.pressed = false,
                            data.barclass = 'bar'+ data.number,
                            data.imgurl_selected = '../images/'+ data.number+'_selected@3x.png',
                            data.imgurl_press = '../images/'+ data.number+'_press@3x.png',
                            data.imgurl_normal = '../images/'+ data.number+'_normal@3x.png'
                        })
                        that.setArr = resArr;
                    }else{
                        that.requestErrFun(resVal.msg)
                    }
                }
            }).catch(that.netErrFun);
        },
        //选择该座
        pickedThisSet(item){
            var that = this;
            if(item.status==0){
                that.errTipsFun('该座位已被预定,请选择其它桌')
                return
            }
            item.pressed = !item.pressed
            var pressedSetNum = 0;
            that.setArr.forEach(function (data) {
                if(data.pressed){
                    pressedSetNum++
                }
            })
            if(pressedSetNum>1){
                item.pressed = !item.pressed
                that.errTipsFun('一次只能预定一桌')
            }
        },
        //提交座位数据
        submitSet(){
            var that = this;
            var selectSet = this.setArr.find(function (data) {
                if(data.pressed){
                    return data
                }
            })
            if(that.isSubmit){
                that.errTipsFun('提交中,请稍后..')
                return
            }
            if(!selectSet){
                that.errTipsFun('请选择座位')
                return
            }
            var params = {
                number:selectSet.number ,
                arrivaldate:this.arrivaldate,
                openId:this.openId,
            }
            that.isSubmit = true;
            instance.post('app/seat/lockSeat', Qs.stringify(params)).then(function (res) {
                that.isSubmit = false;
                var resVal = res.data;
                if(res.status=='200' &&　resVal){
                    if(resVal.code==0){
                        that.errTipsFun('预定成功')
                        setTimeout(function () {
                            window.location.href ="enditMySet.html?arrivaldate="+(that.arrivaldate||'')+"&openId=" + (that.openId||'')+"&number=" + (selectSet.number||'')
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