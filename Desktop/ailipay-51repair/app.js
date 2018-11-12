App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = my.getStorageSync({ key: 'logs' }).data || []
    logs.unshift(Date.now())
    my.setStorageSync({
      key: 'logs',
      data: logs,
    });
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      my.getAuthCode({
        scopes: 'auth_user',
        success: (res) => {
          if (res.authCode) {
            //发起网络请求
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
          that.authModal(cb);
        },
      });
    }
  },
  authModal: function (cb) {
    var that = this;
    my.getAuthUserInfo({
      success: function (res) {
        that.globalData.userInfo = res
        typeof cb == "function" && cb(that.globalData.userInfo)
      },
      fail: function () {
        my.alert({
          title: '亲',
          content: '若不授权登陆，则无法使用51修部分功能，点击重新获取授权，则可重新使用；',
          buttonText: '授权',
          success: () => {
            if (res.confirm) {
              console.log('用户点击授权')
              my.openSetting({
                success: function (res) {
                  if (!res.authSetting["scope.userInfo"]) {
                    that.authModal(cb)
                    console.log('用户没有授权。。！')
                  } else {
                    that.authModal(cb)
                  }
                }, fail: function (res) {
                  that.authModal(cb)
                  console.log('用户没有授权。。！')
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          },
        });
      }//end fail
    })
  },
  globalData: {
    userInfo: null
  },
});
