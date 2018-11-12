const wx = my;
// pages/assessment/recyclingcar/recyclingcar.js
var util = require('../../../utils/util.js')

Page({
  data: {
    recyclingcars: [],
    totalPrice: ""//合计金额
  },
  onLoad: function (options) {
    //回收车列表
    this.loadRecyclingCars();
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //回收车列表
  loadRecyclingCars: function () {

  },
  deleteCar: function (event) {
    if (util.isRepeatClick()) return//判断是否为重复点击
    var idx = event.currentTarget.dataset.idx;
    this.data.recyclingcars.splice(idx, 1);
    var totalPrice = 0;
    for (var i in this.data.recyclingcars) {
      totalPrice += this.data.recyclingcars[i].price;
    }
    this.setData({
      recyclingcars: this.data.recyclingcars,
      totalPrice: totalPrice
    });
  },
  //断续回收
  reStart: function () {
    wx.navigateBack({
      delta: 3
    })
  }
})