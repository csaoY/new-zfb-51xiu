const util = require('../../../utils/util.js');
const urls = require('../../../utils/urls');
const network = require('../../../utils/network.js');
var app = getApp()

Page({
  data: {
    cityList: [],//城市列表
    areaList: [],//区域列表
    versionName: "",
    cityListIndex: 0,//选中城市列表下标
    areaListIndex: 0,//选中区域列表下标
    selectedDetailList: [],//选择的评估列表
    orderFormOK: true //表单是否准备OK
  },
  onLoad: function (options) {
    console.log('onLoad')
    this.init(options);
    this.loadVersionGetAreaByCode()
  },
  model: function () {
    if (util.isRepeatClick()) return//判断是否为重复点击
    my.navigateTo({
      url: '../../clause/recoveryclause/recoveryclause'
    })
  },
  //获取行政区域
  loadVersionGetAreaByCode: function (code = "") {
    var that = this;
    const myparams = Object();
    myparams.content = JSON.stringify({
      'code': code,
    });
    network.get({
      params: myparams,
      url: urls.recycle_getAreaByCode,
      success: (data) => {
        if (code == '') {
          var cityList = data.areaList;
          that.setData({
            cityListIndex: 0,//重置选中城市列表下标
            cityList: cityList//设置城市列表
          });
          if (typeof cityList[0] != 'undefined') {
            //加载第一个城市的区域
            that.loadVersionGetAreaByCode(cityList[0].code)
          }
        } else {
          var areaList = data.areaList;
          that.setData({
            areaListIndex: 0,//重置选中区域列表下标
            areaList: areaList//设置区域列表
          });
        }
        console.log("获取行政区域接口成功");
      },
      fail: () => {
        // fail
        that.setData({
          hasNetError: true,
        });
      },
    });
  },
  //城市列表改变
  bindCityPickerChange: function (e) {
    var index = e.detail.value
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      cityListIndex: index
    })
    var cityCode = this.data.cityList[index].code //客户城市编码
    if (cityCode == -1 || cityCode == -2) {//未选择或者选择邮寄回收
      this.setData({
        areaListIndex: 0,//重置选中区域列表下标
        areaList: []//设置区域列表
      });
      return
    }
    this.loadVersionGetAreaByCode(this.data.cityList[this.data.cityListIndex].code);
  },
  //区域列表改
  bindAreaPickerChange: function (e) {
    this.setData({
      areaListIndex: e.detail.value
    })
  },
  init: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.data.selectedDetailList = JSON.parse(options.selectedDetailList);
    console.log("接收到的参数是selectedDetailList=" + this.data.selectedDetailList);
    this.setData({
      selectedDetailList: this.data.selectedDetailList
    });
  },
  //提交维修订单
  submitOrder: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this
    var cityIndex = e.detail.value.cityIndex //客户选择城市下标
    this.setData({
      cityIndex: cityIndex
    });
    var areaCode = "" //客户地区编码【必填】
    var repairType = "4"//0.上门维修1.预约到店2.寄修3.邮寄回收4.上门回收
    if (cityIndex == 1) {//选择邮寄回收
      repairType = 3
    } else {
      if (this.data.areaList.length === 0 || that.data.cityListIndex == 0) {
        my.showToast({
          content: '请选择地区',
          type: 'success',
          duration: 2000
        })
        return
      } else {
        areaCode = this.data.areaList[e.detail.value.areaCode].code //客户地区编码【必填】
      }
    }
    var address = e.detail.value.address //详细地址【必填】
    var contactName = e.detail.value.contactName//客户姓名【必填】
    var contactPhone = e.detail.value.contactPhone //客户手机号码【必填】
    var remark = e.detail.value.remark //客户备注【选填】
    var userAgreement = e.detail.value.userAgreement //客户备注【选填】

    if (address.replace(/\s/g, "") == "") {
      my.showToast({
        content: '请填写详细地址',
        type: 'success',
        duration: 2000
      })
      return
    }
    if (contactName.replace(/\s/g, "") == "") {
      my.showToast({
        title: '请填写联系人',
        icon: 'success',
        duration: 2000
      })
      return
    }
    if (!(/^[a-zA-Z ]{1,20}$/.test(contactName)) && !(/^[\u4e00-\u9fa5]{1,10}$/.test(contactName))) {
      my.showToast({
        content: '请填写正确的联系人名',
        type: 'success',
        duration: 2000
      })
      return
    }
    if (!(/^1[34578]\d{9}$/.test(contactPhone))) {
      my.showToast({
        content: '请填写正确的手机号码',
        type: 'success',
        duration: 2000
      })
      return
    }
    if (userAgreement) {
      orderFormOK = true
    }
    var openId = ""
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      if (!userInfo) {
        return
      } else {
        my.getAuthCode({
          scopes: 'auth_user',
          success: function (res) {
            if (res.authCode) {
              //发起网络请求
              openId = res.authCode
              const myparams = Object();
              myparams.content = JSON.stringify({
                openId: openId,
                index: 0,
                areaCode: areaCode,
                address: address,
                contactName: contactName,
                contactPhone: contactPhone,
                remark: remark,
                repairType: repairType,
                orderList: that.data.selectedDetailList
              });
              network.post({
                params: myparams,
                url: urls.recycleOrder_insert,
                success: (data) => {
                  if (data.result.code === '5004') {
                    my.alert({ title: String(data.result.info) });
                    return;
                  }
                  my.setStorageSync({
                    key: 'mailInfo',
                    data: data.mailInfo,
                  });
                  my.setStorageSync({
                    key: 'precautions',
                    data: data.precautions,
                  });

                  my.navigateTo({
                    url: '../../last/rebuylast/last?orderid=' + data.orderId + '&cityIndex=' + that.data.cityIndex
                  })
                  console.log("提交回收订单成功");
                },
                fail: () => {
                  // fail
                  that.setData({
                    hasNetError: true,
                  });
                },
              });
            } else {
              my.showToast({
                content: '需要允许支付宝授权才能继续使用',
                type: 'success',
                duration: 2000
              })
              console.log('获取用户登录态失败！' + res.errMsg)
              return
            }
          }
        });
      }
    })
  },
  //用户协议同意
  checkboxChange: function (e) {
    var checked = e.detail.value
    if (checked == "true") {
      this.setData({
        orderFormOK: true
      });
    } else {
      this.setData({
        orderFormOK: false
      });
    }
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  }
})