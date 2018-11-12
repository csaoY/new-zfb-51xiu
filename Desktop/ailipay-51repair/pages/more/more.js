const wx = my;
const util = require('../../utils/util.js');
const urls = require('../../utils/urls');
const network = require('../../utils/network.js');

const app = getApp();
Page({
  data: {
    mytime: new Date('2017-11-14 7:30'.replace(/-/g,"\/")),
    now: new Date(),
  },
  onLoad() {
    console.log('onLoad');
    const that = this;
    // 调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
    });
  },
  makePhoneCall() {
    if (util.isRepeatClick()) return; // 判断是否为重复点击
    my.makePhoneCall({
      number: '4008625151', // 打客服电话
    });
  },
  myorder() {
    if (util.isRepeatClick()) return//判断是否为重复点击
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      // if (typeof userInfo.nickName === 'undefined') {
      //   return
      // } else {
        var openId = ""
        my.getAuthCode({
          scopes: 'auth_user',
          success: (res) => {
            if (res.authCode) {
              
              const myPhoneNumber = my.getStorageSync({ key: 'myPhoneNumber' }).data;
              if (typeof myPhoneNumber === 'undefined') {
                wx.redirectTo({
                  url: '../login/login'
                })
                return;
              }
              openId = res.authCode;
              const myparams = Object();
              myparams.content = JSON.stringify({
                // 'openId': openId,
                "phone": myPhoneNumber,
                'index': 0,
              });
              network.get({
                params: myparams,
                url: urls.order_query,
                success: (data) => {
                  if (data.result.code === '2000') {
                    my.navigateTo({
                      url: 'myorder/myorder'+ '?phoneNumber=' + myPhoneNumber,
                    });
                  } else if (data.result.code === '5018') {
                    my.navigateTo({
                      url: '../login/login',
                    });
                  } else {
                    my.navigateTo({
                      url: '../login/login',
                    });
                  }
                  console.log('装载我的订单查询成功');
                },
                fail: () => {
                  // fail

                },
              });
            } else {
              my.showToast({
                type: 'success',
                content: '需要允许授权才能继续使用',
                duration: 2000,
              });
              console.log('获取用户登录态失败！');
              return
            }
          },
        });
      // }
    });
  },
});
