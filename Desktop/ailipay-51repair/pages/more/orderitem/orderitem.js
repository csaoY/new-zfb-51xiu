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
    orderInfo: {}, // 订单信
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
            mydeviceStatStr = '已提交';
            break;
          case 0:
            mydeviceStatStr = '已提交';
            break;
          case 1:
            mydeviceStatStr = '已提交';
            break;
          case 2:
            mydeviceStatStr = '已分派';
            break;
          case 3:
            mydeviceStatStr = '修理中';
            break;
          case 4:
            mydeviceStatStr = '已修理';
            break;
          case 5:
            mydeviceStatStr = '已付款(已完成)';
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
        const mytotalPrice = data.orderInfo.totalPrice;
        that.setData({
          // createTime: timeUtil.formatTime('yyyy-MM-dd hh:mm:ss', mycreateTime),
          createTime: timeUtil.formatTime(new Date(mycreateTime)),
          deviceStatStr: mydeviceStatStr,
          orderInfo: data.orderInfo,
          totalPrice: mytotalPrice,
          orderDetailList: data.repairDetail,
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
});
