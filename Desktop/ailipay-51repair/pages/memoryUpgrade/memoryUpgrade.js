const wx = my;
const util = require('../../utils/util.js');
const urls = require('../../utils/urls');
const network = require('../../utils/network.js');

Page({
  data: {
    text: '内存升级页面',
    postid: '', // 被选中的内存升级型号的id
    upid: '', // 被选中的升级内存容量的id
    price: '', // 价格
    selectedPlanList: [], // 用户选择的故障列表
    hasNetError: false, // 是否网络错误
  },
  onLoad() {
    this.loaditem();
    // 页面初始化 options为页面跳转所带来的参数
  },
  onShareAppMessage() {
    return {
      title: '51修丨手机维修与回收支付宝小程序',
      path: '/pages/memoryUpgrade/memoryUpgrade',
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
  loaditem() {
    const that = this;
    // 写入参数
    const myparams = Object();
    myparams.id = '123';
    network.get({
      params: myparams,
      url: urls.versionRam_queryById,
      success: (data) => {
        // success
        that.setData({
          versionList: data.versionList,
        });
        console.log(data);
        console.log('装载内存列表成功');
      },
      fail: () => {
        // fail
        that.setData({
          hasNetError: true,
        });
      },
    });
  },
  selectmodel(event) {
    if (util.isRepeatClick()) return; // 判断是否为重复点击
    const versionid = event.target.dataset.id;
    const myversionName = event.target.dataset.versionName
    if (this.data.postid === versionid) return;
    this.setData({
      postid: versionid,
      versionName: myversionName,
      price: '',
      selectedPlanList: [], // 重置
      upid: '',
    });
    this.loadVersionRamFaultQueryById(versionid);
  },
  // 根据品牌ID与类型ID查询型号
  loadVersionRamFaultQueryById(versionid) {
    const that = this;
    // 写入参数
    const myparams = Object();
    myparams.content = JSON.stringify({
      'versionId': versionid,
    });
    network.get({
      params: myparams,
      url: urls.versionRamFault_queryById,
      success: (data) => {
        that.setData({
          ramPlanList: data.ramPlanList,
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
  // 选择内存
  sizeselect(event) {
    if (util.isRepeatClick()) return; // 判断是否为重复点击
    const myupid = event.target.dataset.id;
    const myprice = event.target.dataset.price;
    const mylist = event.target.dataset.list;
    this.data.selectedPlanList = []; // 用户选择的故障列
    const selectedPlan = {};
    selectedPlan.faultPartDetail = mylist.detail;
    selectedPlan.plan = mylist.plan;
    selectedPlan.price = mylist.price;
    selectedPlan.id = mylist.pId;
    this.data.selectedPlanList.push(selectedPlan);

    this.setData({
      upid: myupid,
      price: myprice,
      selectedPlanList: this.data.selectedPlanList,
    });
    console.log(this.data.selectedPlanList);
  },
  // 下一步
  next() {
    if (util.isRepeatClick()) return; // 判断是否为重复点击
    wx.navigateTo({
      url: '../brand/placeorder/placeorder?selectedPlanList=' + JSON.stringify(this.data.selectedPlanList) + '&totalPrice=' + this.data.price,
    });
  },
  // 网络刷新
  refresh() {
    console.log('刷新');
    this.setData({
      hasNetError: false,
    });
    this.loaditem();
  },
});
