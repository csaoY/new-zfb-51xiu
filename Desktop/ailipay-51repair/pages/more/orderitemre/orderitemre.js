const util = require('../../../utils/util.js');
const urls = require('../../../utils/urls');
const network = require('../../../utils/network.js');
const timeUtil = require('../../../utils/util');

Page({
  data: {
    deviceStatStr: '', // 订单状态
    createTime: '', // 下单时间
    totalPrice: 0, // 总价
    orderDetailList: [], // 设备故障列表
    orderid: '', // 订单号
    orderInfo: {}, // 订单信息
  },
  onLoad(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.data.orderid = options.orderId;
    this.loadOrder();
  },
  makePhoneCall() {
    if (util.isRepeatClick()) return; // 判断是否为重复点击
    my.makePhoneCall({
      number: '4008625151', // 打客服电话
    });
  },
  backHome() {
    my.navigateBack({
      delta: 4,
    });
  },
  loadOrder() {
    const that = this;
    const myparams = Object();
    myparams.content = JSON.stringify({
      'orderId': this.data.orderid,
    });
    network.get({
      params: myparams,
      url: urls.order_getByOrderId,
      success: (data) => {
        const mycreateTime = data.orderInfo.createTime;
        const deviceState = data.orderInfo.state;
        var mydeviceStatStr = '';
        switch (deviceState) {
          case -1:
            mydeviceStatStr = '等待中';
            break;
          case 0:
            mydeviceStatStr = '等待中';
            break;
          case 1:
            mydeviceStatStr = '等待中';
            break;
          case 2:
            mydeviceStatStr = '等待中';
            break;
          case 3:
            mydeviceStatStr = '等待中';
            break;
          case 4:
            mydeviceStatStr = '已完成';
            break;
          case 6:
            mydeviceStatStr = '已取消';
            break;
          case 7:
            mydeviceStatStr = '已完成';
            break;
          default:
        }
        // 计算总计
        const mytotalPrice = data.recycleDetail.reduce((prevVal, elem) => {
          return prevVal + elem.PRICE;
        }, 0);
        that.setData({
          createTime: timeUtil.formatTime(new Date(mycreateTime)),
          deviceStatStr: mydeviceStatStr,
          orderInfo: data.orderInfo,
          totalPrice: mytotalPrice,
          orderDetailList: data.recycleDetail,
        });
        console.log(that.data);
      },
      fail: () => {
        // fail
        that.setData({
          hasNetError: true,
        });
      },
    });
  },
});
