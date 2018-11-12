const wx = my;
const util = require('../../../utils/util.js');
const urls = require('../../../utils/urls');
const network = require('../../../utils/network.js');

var app = getApp();
Page({
  data: {
    currentSelectedMobile: '0', // 当前选中型号
    currentSelectedColor: '0', // 当前选中颜色
    versionList: [], // 机型列表
    colorList: [], // 颜色列表
    planList: [], // 故障列表
    selectedPlanList: [], // 用户选择的故障列表
    currentSelectedVersionId: '', // 当前选中型号ID
    currentSelectedColorId: '', // 当前选中颜色ID
    typeId: '', // 类型ID"
    brandId: '', // 品牌ID"
    totalPrice: 0, // 维修总价格
    selectItemCount: 0, // 选择的维修项数量
    hasNetError: false, // 是否网络错误
  },
  onLoad(options) {
    // 页面初始化 options为页面跳转所带来的参数
    const typeId = options.typeId;
    const brandId = options.brandId;
    console.log('接收到的参数是typeId=' + options.typeId + ' brandId=' + options.brandId);
    this.setData({
      typeId: typeId,
      brandId: brandId,
    });
    // 根据品牌ID与类型ID查询型号接口
    this.loadVersion();
  },
  onReady() {
    // 页面渲染完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面关闭
  },
  mobileTypeTap(e) {
    const idx = e.target.dataset.idx;
    const versionid = e.target.dataset.versionid;
    this.setData({
      currentSelectedMobile: idx,
      currentSelectedVersionId: versionid,
      selectedPlanList: [], // 重置
    });
    this.loadVersionQueryVersionColor(versionid);
  },
  next() {
    if (util.isRepeatClick()) return; // 判断是否为重复点击
    wx.navigateTo({
      url: '../../brand/placeorder/placeorder?selectedPlanList=' + JSON.stringify(this.data.selectedPlanList) + '&totalPrice=' + this.data.totalPrice,
    });
  },
  detailed(e) {
    if (util.isRepeatClick()) return; // 判断是否为重复点击
    const plan = e.target.dataset.plan;
    wx.navigateTo({
      url: '../detailed/detailed?plan=' + JSON.stringify(plan),
    });
  },
  // 选择颜色
  switchColor(e) {
    const idx = e.target.dataset.idx;
    const colorid = e.target.dataset.colorid;
    this.setData({
      selectedPlanList: [], // 重置
      currentSelectedColor: idx,
      currentSelectedColorId: colorid,
    });
    this.loadFaultQueryById(colorid);
  },
  // 根据品牌ID与类型ID查询型号
  loadVersion() {
    const that = this;
    const myparams = Object();
    myparams.content = JSON.stringify({
      'brandId': that.data.brandId,
      'deviceTypeId': that.data.typeId,
    });
    network.get({
      params: myparams,
      url: urls.version_queryById,
      success: (data) => {
        var currentSelectedVersionId = 0;
        if (typeof data.versionInfo[0] !== 'undefined') {
          currentSelectedVersionId = data.versionInfo[0].id;
        }
        that.setData({
          versionList: data.versionInfo,
          currentSelectedVersionId: currentSelectedVersionId,
        });
        that.loadVersionQueryVersionColor(currentSelectedVersionId);
        console.log('根据品牌ID与类型ID查询型号接口成功');
      },
      fail: () => {
        // fail
        that.setData({
          hasNetError: true,
        });
      },
    });
  },
  // 根据型号查询颜色
  loadVersionQueryVersionColor(versionId) {
    const that = this;
    const myparams = Object();
    myparams.content = JSON.stringify({
      'versionId': versionId,
    });
    network.get({
      params: myparams,
      url: urls.version_queryVersionColor,
      success: (data) => {
        var currentSelectedColorId = 0
        if (typeof data.colorList[0] != 'undefined') {
          currentSelectedColorId = data.colorList[0].id;
        }
        that.setData({
          colorList: data.colorList,
          currentSelectedColorId: currentSelectedColorId,
          currentSelectedColor: 0,
          hasNetError: false,
        });
        that.loadFaultQueryById(currentSelectedColorId);
        console.log('根据型号查询颜色接口成功');
      },
      fail: () => {
        // fail
        console.log('根据型号查询颜色接口失败');
        that.setData({
          colorList: [],
          planList: [],
          hasNetError: true,
        });
      },
    });
  },
  // 根据颜色型号查询故障列表
  loadFaultQueryById(colorId) {
    const that = this;
    const myparams = Object();
    myparams.content = JSON.stringify({
      'colorId': colorId,
    });
    network.get({
      params: myparams,
      url: urls.fault_queryById,
      success: (data) => {
        const planList = data.planList;
        const planListLength = planList.length;
        for (var i = 0; i < planListLength; i++) {
          const planList2 = planList[i].planList;
          const planList2Length = planList2.length;
          for (var y = 0; y < planList2Length; y++) {
            const plan = planList2[y];
            plan.isSelected = false;
          }
        }

        that.setData({
          planList: planList,
          selectItemCount: 0,
          totalPrice: 0,
          hasNetError: false,
        });
        console.log('根据颜色型号查询故障列表接口成功');
      },
      fail: () => {
        // fail
        console.log('根据颜色型号查询故障列表接口失败');
        that.setData({
          planList: [],
          hasNetError: true,
        });
      },
    });
  },
  // 维修项选择
  onSelectItem(event) {
    var totalPrice = this.data.totalPrice; // 维修总价格
    var selectItemCount = this.data.selectItemCount; // 选择的维修项数量
    const id = event.target.dataset.id;
    const planList = this.data.planList;
    const planListLength = planList.length;
    for (var i = 0; i < planListLength; i++) {
      const planList2 = planList[i].planList
      const planList2Length = planList2.length
      for (var y = 0; y < planList2Length; y++) {
        const plan = planList2[y];
        if (plan.id == id) {
          plan.isSelected = !plan.isSelected; // 置反
          if (plan.isSelected) {
            selectItemCount += 1;
            totalPrice += plan.price;
            // 添加到选中的维修项中
            this.data.selectedPlanList.push(plan);
          } else {
            selectItemCount -= 1;
            totalPrice -= plan.price;
            // 从选中的维修项中删除;
            for (var k = this.data.selectedPlanList.length; k--;) {
              if (this.data.selectedPlanList[k].id === plan.id) {
                this.data.selectedPlanList.splice(k, 1);
                break;
              }
            }
          }
        }
      }
    }
    this.setData({
      selectedPlanList: this.data.selectedPlanList,
      planList: planList,
      selectItemCount: selectItemCount,
      totalPrice: totalPrice,
    });
  },
  // 网络刷新
  refresh() {
    console.log('刷新');
    this.setData({
      hasNetError: false,
    });
    this.loadVersionQueryVersionColor(this.data.currentSelectedVersionId);
  },
});
