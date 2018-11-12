const util = require('../../utils/util.js');
const urls = require('../../utils/urls');
const network = require('../../utils/network.js');

Page({
  data: {
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    eventid: 1,
    brandInfo: [], // 维修品牌信息列表
    name: '', // 联系人
    phoneNumber: '', // 联系方式
    vercode: "",    //手机验证码
    verifyCodeURL: "", //图形验证码地址
    verifyCodeTip: "获取验证码",
    hasNetError: false,
    showModalStatus: false
  },
  onShareAppMessage() {
    return {
      title: '51修丨手机维修与回收支付宝小程序',
      path: '/pages/index/index',
      success: () => {
        // 转发成功
        my.showToast({
          type: 'success',
          content: '感谢分享',
        });
      },
      fail: () => {
        // 转发失败
      },
    };
  },
  // 事件处理函数
  bindItemTap() {
    my.navigateTo({
      url: '../answer/answer',
    });
  },
  onLoad() {
    this.loadBandQuery();
  },
  loadBandQuery() {
    const that = this;
    // 写入参数
    const myparams = Object();
    myparams.account = 'hanqing';
    myparams.password = '123456';
    network.get({
      params: myparams,
      url: urls.brand_query,
      success: (data) => {
        // success
        that.setData({
          brandInfo: data.brandInfo,
        });
        console.log('装载维修列表成功' + data.result.info);
        // my.alert({ title: data.result.info });
      },
      fail: () => {
        // fail
        that.setData({
          hasNetError: true,
        });
      },
    });
  },
  bindQueTap(e) {
    if (util.isRepeatClick()) return; // 判断是否为重复点击
    const brandid = e.target.dataset.brandId;
    const typeid = e.target.dataset.typeId;
    my.navigateTo({
      url: '../brand/selectmodel/selectmodel?typeId=' + typeid + '&brandId=' + brandid,
    });
  },
  submitOrder(e) {
    if (util.isRepeatClick()) return; // 判断是否为重复点击
    const that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    const myPhoneNumber = e.detail.value.phoneNumber; // 客户手机号码【必填】
    const myName = e.detail.value.name; // 客户名字【必填】
    var vercode = this.data.vercode    //手机验证码
    if (myName.replace(/\s/g, '') === '') {
      my.showToast({
        content: '请填写联系人',
        type: 'success',
        duration: 2000,
      });
      return;
    }
    if (!(/^[a-zA-Z ]{1,20}$/.test(myName)) && !(/^[\u4e00-\u9fa5]{1,10}$/.test(myName))) {
      my.showToast({
        content: '请填写正确的联系人名',
        type: 'success',
        duration: 2000,
      });
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(myPhoneNumber))) {
      my.showToast({
        content: '请填写正确的手机号码',
        type: 'success',
        duration: 2000,
      });
      return;
    }
    if (vercode.replace(/\s/g, '') === '') {
      my.showToast({
        content: '请填写验证码',
        type: 'success',
        duration: 2000,
      });
      return;
    }
    if (vercode.length != 4) {
      my.showToast({
        content: '验证码长度有误！',
        type: 'success',
        duration: 2000,
      });
      return;
    }
    // 写入参数
    const myparams = Object();
    myparams.content = JSON.stringify({
      'name': myName,
      'phoneNumber': myPhoneNumber,
      "vercode": vercode,
    });
    network.post({
      params: myparams,
      url: urls.order_orderSubmit,
      success: (data) => {
        if (data.result.code == '2000') {
          // 清空下表单
          that.setData({
            name: '',
            phoneNumber: '',
            vercode: '',
          });
          my.confirm({
            title: '温馨提示',
            content: data.msg,
            confirmButtonText: '确定',
            // cancelButtonText: '取消',
            success: () => {

            },
          });
          console.log('提交闪电下单成功' + data.result.info);
        } else {
          my.showToast({
            type: 'success',
            content: String(data.result.info),
            duration: 3000,
            success: () => {

            },
          });
        }
        // my.alert({ title: data.result.info });
      },
      fail: () => {
        // fail
        that.setData({
          hasNetError: true,
        });
      },
    });
  },
  // 网络刷新
  refresh() {
    console.log('刷新');
    this.setData({
      hasNetError: false,
    });
    this.loadBandQuery();
  },
  //手机号码改变
  bindChangePhoneNumber: function (e) {
    var phoneNumber = e.detail.value;
    this.data.phoneNumber = phoneNumber
    this.setData({
      phoneNumber: phoneNumber
    })
    console.log(this.data.phoneNumber)
  },
  //手机验证码改变
  bindChangeVercode: function (e) {
    var vercode = e.detail.value;
    this.data.vercode = vercode
    this.setData({
      vercode: vercode    //手机验证
    })
    console.log(this.data.vercode)
  },
  setVerify: function (e) {
    if (util.isRepeatClick()) return//判断是否为重复点击

    var that = this
    var phoneNumber = e.currentTarget.dataset.phoneNumber//手机号码
    var vercode = that.data.vercode    //手机验证码
    // var contactName = e.detail.value.contactName//客户姓名【必填】
    if (phoneNumber.length == 0) {
      my.showToast({
        content: '请输入手机号！',
        type: 'success',
        duration: 1500,
      });
      return
    }
    if (phoneNumber.length != 11) {
      my.showToast({
        content: '手机号长度有误！',
        type: 'success',
        duration: 1500,
      });
      return
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(phoneNumber)) {
      my.showToast({
        content: '手机号有误！',
        type: 'success',
        duration: 1500,
      });
      return
    }

    console.log(urls.verifyCode_GenerateVerifyCode + "?timestamp=" + new Date().getTime() + "&phoneNumber=" + phoneNumber)
    this.setData({
      verifyCodeURL: urls.verifyCode_GenerateVerifyCode + "?timestamp=" + new Date().getTime() + "&phoneNumber=" + phoneNumber
    });
    this.powerDrawer(e)
  },
  //加载图形验证码
  loadGenerateVerifyCode: function () {
    if (this.data.phoneNumber.length == 0) {
      return
    }
    console.log(urls.verifyCode_GenerateVerifyCode + "?timestamp=" + new Date().getTime() + "&phoneNumber=" + this.data.phoneNumber)
    this.setData({
      verifyCodeURL: urls.verifyCode_GenerateVerifyCode + "?timestamp=" + new Date().getTime() + "&phoneNumber=" + this.data.phoneNumber
    });
  },
  //验证图形验证码
  verifyCode: function (e) {
    var verifyCode = e.detail.value.verifyCode
    var that = this;
    // 写入参数
    const myparams = Object();
    myparams.content = JSON.stringify({
      'verifyCode': verifyCode,
      'phoneNumber': this.data.phoneNumber,
    });
    network.get({
      params: myparams,
      url: urls.vercode_send,
      success: (data) => {
        if (data.result.code == '2000') {
          that.util("close")
          var total_micro_second = 60 * 1000;    //表示60秒倒计时，想要变长就把60修改更大
          count_down(that, total_micro_second);//验证码倒计时
          console.log("验证图形验证码成功");
          that.setData({
            verifyCode: verifyCode,
            loginFormOK: true
          });
        } else {
          my.showToast({
            type: 'success',
            content: String(data.result.info),
            duration: 3000,
            success: () => {
              
            },
          });
        }
      },
      fail: () => {
        // fail
      },
    });
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu);
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = my.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });
    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;
    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();
    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    });
    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation.export(),
      });
      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200);
    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
});

//下面的代码在page({})外面
/* 毫秒级倒计时 */
function count_down(that, total_micro_second) {
  if (total_micro_second <= 0) {
    that.setData({
      verifyCodeTip: "重新发送"
    });
    // timeout则跳出递归
    return;
  }

  // 渲染倒计时时钟
  that.setData({
    verifyCodeTip: date_format(total_micro_second) + " 秒"
  });

  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 10;
    count_down(that, total_micro_second);
  }, 10)
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

  return sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}
