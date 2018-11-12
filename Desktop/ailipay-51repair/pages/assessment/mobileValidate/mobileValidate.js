const wx = my;
// pages/assessment/phonetest/phonetest.js
var util = require('../../../utils/util.js')
Page({
  data: {},
  onLoad: function (options) {
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
  next: function () {
    if (util.isRepeatClick()) return//判断是否为重复点击
    wx.navigateTo({
      url: "../placeorder/placeorder"
    })
  }
})