const util = require('../../../utils/util.js');

Page({
  data: {
    orderid: '', // 订单号
  },
  onLoad(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.data.orderid = options.orderid;
    const mymailInfo = my.getStorageSync({ key: 'mailInfo' }).data;
    const myprecautions = my.getStorageSync({ key: 'precautions' }).data;
    this.setData({
      ind: options.cityIndex,
      mailInfo: mymailInfo,
      precautions: myprecautions,
    });
  },
  onReady() {
    // 页面渲染完成
  },
  // 订单详情
  orderDetail() {
    if (util.isRepeatClick()) return; // 判断是否为重复点击
    my.redirectTo({
      url: '../../more/orderitemre/orderitemre?orderId=' + this.data.orderid,
    });
  },
  // 返回首页
  backHome() {
    if (util.isRepeatClick()) return; // 判断是否为重复点击
    my.navigateBack({
      delta: 5,
    });
  },
});
