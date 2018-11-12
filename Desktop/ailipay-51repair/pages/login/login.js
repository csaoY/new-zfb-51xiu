const wx = my;
const util = require('../../utils/util.js');
const urls = require('../../utils/urls');
const network = require('../../utils/network.js');
var app = getApp()
Page({
  data: {
    loginFormOK: false,
    verifyCodeTip: "获取验证码",
    phoneNumber: "",//手机号码
    vercode: "",    //手机验证码
    verifyCodeURL: "", //图形验证码地址
    showModalStatus: false
  },
  onLoad: function () {
    this.loadGenerateVerifyCode()
  },
  submitLogin: function (e) {
    if (util.isRepeatClick()) return//判断是否为重复点击

    var that = this
    var phoneNumber = this.data.phoneNumber//手机号码
    var vercode = this.data.vercode    //手机验证码
    if (phoneNumber.length == 0) {
      my.showToast({
        title: '请输入手机号！',
        icon: 'success',
        duration: 1500
      })
      return
    }
    if (phoneNumber.length != 11) {
      my.showToast({
        title: '手机号长度有误！',
        icon: 'success',
        duration: 1500
      })
      return
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(phoneNumber)) {
      my.showToast({
        title: '手机号有误！',
        icon: 'success',
        duration: 1500
      })
      return
    }
    if (vercode.length != 4) {
      wx.showToast({
        title: '验证码长度有误！',
        icon: 'success',
        duration: 1500
      })
      return
    }

    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      if (!userInfo) {
        return
      } else {
        my.getAuthCode({
          scopes: 'auth_user',
          success: (res) => {
            var openId = ""
            if (res.authCode) {
              //发起网络请求
              openId = res.authCode
              // 写入参数
              const myparams = Object();
              myparams.content = JSON.stringify({
                "phoneNumber": phoneNumber,
                "vercode": vercode,
                // "openId": openId,
                // "index": 0
              });
              network.post({
                params: myparams,
                url: urls.customer_login,
                success: (data) => {
                  console.log("登录接口成功");
                  that.myorder();
                },
                fail: () => {
                  // fail
                  that.setData({
                    hasNetError: true,
                  });
                },
              });
            } else {
              wx.showToast({
                title: '需要允许授权才能继续使用',
                icon: 'success',
                duration: 2000
              })
              console.log('获取用户登录态失败！' + res.errMsg)
              return
            }
          },
        });
      }
    });
  },
  myorder: function () {
    var that = this;
    var openId = ""
    my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
        if (res.authCode) {
          //发起网络请求
          openId = res.authCode
          // 写入参数
          const myparams = Object();
          myparams.content = JSON.stringify({
            // 'openId': openId,
            'phone': that.data.phoneNumber,
            'index': 0,
          });
          network.get({
            params: myparams,
            url: urls.order_query,
            success: (data) => {
              if (data.result.code == '2000') {
                my.setStorageSync({
                  key: 'myPhoneNumber',
                  data: that.data.phoneNumber,
                });
                wx.redirectTo({
                  url: '../more/myorder/myorder?orderList=' + JSON.stringify(data.orderList) + '&phoneNumber=' + that.data.phoneNumber
                })
              } else if (data.result.code == '5018') {

              }
              console.log("装载我的订单查询成功")
            },
            fail: () => {
              // fail
              that.setData({
                hasNetError: true,
              });
            },
          });
        } else {
          wx.showToast({
            title: '需要允许授权才能继续使用',
            icon: 'success',
            duration: 2000
          })
          console.log('获取用户登录态失败！' + res.errMsg)
          return
        }
      }
    })
  },
  setVerify: function (e) {
    if (util.isRepeatClick()) return//判断是否为重复点击

    var that = this
    var phoneNumber = e.currentTarget.dataset.phonenumber//手机号码
    var vercode = that.data.vercode    //手机验证码
    // var contactName = e.detail.value.contactName//客户姓名【必填】
    if (phoneNumber.length == 0) {
      wx.showToast({
        title: '请输入手机号！',
        icon: 'success',
        duration: 1500
      })
      return
    }
    if (phoneNumber.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'success',
        duration: 1500
      })
      return
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(phoneNumber)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'success',
        duration: 1500
      })
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
          count_down(this, total_micro_second);//验证码倒计时
          console.log("验证图形验证码成功");
          that.setData({
            verifyCode: verifyCode,
            loginFormOK: true,
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
        that.setData({
          hasNetError: true,
        });
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
    var animation = wx.createAnimation({
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
  }
})

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