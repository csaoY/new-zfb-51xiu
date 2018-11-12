const wx = my;
const util = require('../../../utils/util.js');
const urls = require('../../../utils/urls');
const network = require('../../../utils/network.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderId: ''//订单ID
  },

  onLoad: function (options) {
    var orderId = options.orderId;
    this.setData({
      orderId: orderId
    })
    this.queryInexpress();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  queryInexpress: function () {
    var that = this;
    // 写入参数
    const myparams = Object();
    myparams.content = JSON.stringify({
      "orderId": that.data.orderId
    });
    network.get({
      params: myparams,
      url: urls.queryInexpress,
      success: (data) => {
        console.log(data);
        that.setData({
          com: data.expressInfo.inExpressCompany,
          no: data.expressInfo.inExpressNo
        });
      },
      fail: () => {
        // fail
        that.setData({
          hasNetError: true,
        });
      },
    });
  },

  submitOrder: function (e) {
    if (util.isRepeatClick()) return//判断是否为重复点击
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var com = e.detail.value.com//快递公司【必填】
    var no = e.detail.value.no //快递单号【必填】

    if (com.replace(/\s/g, "") == "") {
      my.showToast({
        content: '请填写快递公司',
        type: 'success',
        duration: 2000,
      });
      return
    }

    if (no.replace(/\s/g, "") == "") {
      my.showToast({
        content: '请填写快递单号',
        type: 'success',
        duration: 2000,
      });
      return
    }

    if (!(/^\w+$/.test(no))) {
      my.showToast({
        content: '请填写正确的快递单号',
        type: 'success',
        duration: 2000,
      });
      return
    }
    const myparams = Object();
    myparams.content = JSON.stringify({
      "orderId": that.data.orderId,
      "inexpressName": com,
      "inexpressNo": no
    });
    network.post({
      params: myparams,
      url: urls.submitInexpress,
      success: (data) => {
        my.alert({
          title: '亲',
          content: data.result.info,
          buttonText: '确定',
          success: () => {
          },
        });
      },
      fail: () => {
        // fail
        that.setData({
          hasNetError: true,
        });
      },
    });
  },
})