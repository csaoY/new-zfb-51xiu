// const util = require('../../utils/util.js');
const urls = require('../../utils/urls');
const network = require('../../utils/network.js');

Page({
  data: {
    currentSelectedMobile: '0',
    currentSelectedBrandId: '', // 当前选中BrandId
    currentSelectedTypeId: '', // 当前选中TypeID
    phoneTypeInfoId: '', // phone类型ID
    padTypeInfoId: '', // pad类型ID
    type: 'phone',
    mobiles: [], // 品牌列表数据
    versionList: [], // 品牌下对应的所有的型号
    scrollViewHeight: '100',
    isShare: false, // 用于解决转发点开的页面在ios系统上有高度的问题
    hasNetError: false,
  },
  onLoad(options) {
    // 页面初始化 options为页面跳转所带来的参数
    const myIsShare = options.isShare;
    if (typeof isShare !== 'undefined') {
      this.data.isShare = myIsShare;
    }
    this.loadMobiles();
  },
  onShareAppMessage() {
    return {
      title: '51修丨手机维修与回收支付宝小程序',
      path: '/pages/recycling/recycling?isShare=true',
      success: () => {
        // 转发成功
        my.showToast({
          content: '感谢分享',
          type: 'success',
          duration: 2000,
        });
      },
      fail: () => {
        // 转发失败
      },
    };
  },
  // 获取回收品牌与类型数据接口
  loadMobiles() {
    const that = this;
    // 写入参数
    const myparams = Object();
    myparams.id = '123';
    network.get({
      params: myparams,
      url: urls.recyclebrand_query,
      success: (data) => {
        // success
        that.recycleVersionQuery(data.brandInfo[0].id, data.typeInfo[0].id);
        that.setData({
          currentSelectedBrandId: data.brandInfo[0].id,
          mobiles: data.brandInfo,
          phoneTypeInfoId: data.typeInfo[0].id,
          padTypeInfoId: data.typeInfo[1].id,
        });
        console.log('获取回收品牌与类型数据接口成功');
      },
      fail: () => {
        // fail
        that.setData({
          hasNetError: true,
        });
      },
    });

    my.getSystemInfo({
      success: (res) => {
        var extendHeight = 0;
        if (res.platform === 'Android') {
          extendHeight = res.windowHeight + 50;
        } else if (res.platform === 'iOS' && that.data.isShare === false) {
          // extendHeight = res.windowHeight - 52;
          extendHeight = res.windowHeight;
        } else if (res.platform === 'devtools') {
          extendHeight = res.windowHeight;
        } else {
          extendHeight = res.windowHeight;
        }
        that.setData({
          scrollViewHeight: extendHeight,
        });
      },
    });
  },
  // 获取回收型号数据接口
  recycleVersionQuery(brandId, typeId) {
    const that = this;
    // 写入参数
    const myparams = Object();
    myparams.content = JSON.stringify({
      'brandId': brandId,
      'typeId': typeId,
    });
    network.get({
      params: myparams,
      url: urls.recycleVersion_query,
      success: (data) => {
        that.setData({
          currentSelectedTypeId: typeId,
          versionList: data.versionList,
        });
        console.log('获取回收型号数据接口成功');
      },
      fail: () => {
        // fail
        that.setData({
          versionList: [],
          hasNetError: true,
        });
      },
    });
  },
  switchTab(e) {
    var type_ = e.target.dataset.type;
    if (type_ === 'phone') {
      type_ = 'phone';
      this.recycleVersionQuery(this.data.currentSelectedBrandId, this.data.phoneTypeInfoId);
    } else if (type_ === 'pad') {
      type_ = 'pad';
      this.recycleVersionQuery(this.data.currentSelectedBrandId, this.data.padTypeInfoId);
    }

    this.setData({
      type: type_,
    });
  },
  mobileTypeTap(event) {
    const index = event.target.dataset.idx;
    const brandId = event.target.dataset.brandid;
    this.setData({
      currentSelectedMobile: index,
      currentSelectedBrandId: brandId,
    });
    this.recycleVersionQuery(brandId, this.data.currentSelectedTypeId);
  },
  ontapTobuy(e) {
    const myphone = e.target.dataset.phone;
    const myversionId = e.target.dataset.versionId;
    my.navigateTo({
      url: '../assessment/assessment?phone=' + myphone + '&versionId=' + myversionId,
    });
  },
  // 网络刷新
  refresh() {
    console.log('刷新');
    this.setData({
      hasNetError: false,
    });
    this.recycleVersionQuery(this.data.currentSelectedBrandId, this.data.currentSelectedTypeId);
  },
});

