// const util = require('../../utils/util.js');
// const _ = require('../../utils/underscore');
// const request = require('../../utils/request');
const urls = require('../../utils/urls');
const network = require('../../utils/network.js');

Page({
  data: {
    hasNetError: false,
    item: {

    },
    imgUrls: [
      '../../images/mobile_ad_shili.jpg',
      '../../images/memory.jpg',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    brandInfo: [],
  },
  onLoad() {
    console.log('onLoad');
    this.loadBandQuery();
  },
  onShareAppMessage() {
    return {
      title: '51修丨手机维修与回收支付宝小程序',
      path: '/pages/brand/brand',
      success: () => {
        // 转发成功
        my.alert({
          title: '感谢分享',
        });
      },
      fail: () => {
        // 转发失败
      },
    };
  },
  bindItemTap() {
    my.navigateTo({
      url: '../answer/answer',
    });
  },
  bannerTap(event) {
    const srcs = event.target.dataset.src;
    if (srcs.includes('memory.jpg')) {
      my.navigateTo({
        url: '../memoryUpgrade/memoryUpgrade',
      });
    }
  },
  bindQueTap(e) {
    const brandid = e.target.dataset.brandId;
    const typeid = e.target.dataset.typeId;
    my.navigateTo({
      url: 'selectmodel/selectmodel?typeId=' + typeid + '&brandId=' + brandid,
    });
  },
  // 网络请求数据, 实现刷新
  loadBandQuery() {
    const that = this;
    // 写入参数
    const myparams = Object();
    myparams.account = 'hanqing';
    myparams.password = '123456';
    network.get({
      params: myparams,
      url: urls.brand_query,
      success: (data) => {
        // success
        that.setData({
          brandInfo: data.brandInfo,
        });
        console.log('装载维修列表成功' + data.result.info);
        // my.alert({ title: data.result.info });
      },
      fail: () => {
        // fail
        that.setData({
          hasNetError: true,
        });
      },
    });
  },
  refresh() {
    console.log('刷新');
    this.setData({
      hasNetError: false,
    });
    this.loadBandQuery();
  },
});
