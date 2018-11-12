// pages/band/detailed/detailed.js
const util = require('../../../utils/util.js');

Page({
  data: {
    plan: [],
    selectedPlanList: [],
    totalPrice: 0,
  },
  onLoad(options) {
    const that = this;
    // 页面初始化 options为页面跳转所带来的参数
    this.data.plan = JSON.parse(options.plan);
    const myplanList = this.data.plan.planList;
    myplanList.map((plan) => {
      if (plan.isSelected) {
        that.data.totalPrice += plan.price;
        // 添加到选中的维修项中
        that.data.selectedPlanList.push(plan);
      }
      return plan;
    });

    this.setData({
      selectedPlanList: this.data.selectedPlanList,
      plan: this.data.plan,
      totalPrice: this.data.totalPrice,
    });
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
  next() {
    if (util.isRepeatClick()) return; // 判断是否为重复点击
    my.navigateTo({
      url: '../../brand/placeorder/placeorder?selectedPlanList=' + JSON.stringify(this.data.selectedPlanList) + '&totalPrice=' + this.data.totalPrice,
    });
  },
  // 维修项选择
  selectItem(event) {
    var mytotalPrice = this.data.totalPrice; // 维修总价格
    const myid = event.target.dataset.id;
    const myplanList = this.data.plan.planList;
    const planListLength = myplanList.length;
    for (var y = 0; y < planListLength; y++) {
      const plan = myplanList[y];
      if (plan.id === myid) {
        plan.isSelected = !plan.isSelected; // 置反
        if (plan.isSelected) {
          mytotalPrice += plan.price;
          // 添加到选中的维修项中
          this.data.selectedPlanList.push(plan);
        } else {
          mytotalPrice -= plan.price;
          // 从选中的维修项中删除
          for (var i = this.data.selectedPlanList.length; i--;) {
            if (this.data.selectedPlanList[i].id === plan.id) {
              this.data.selectedPlanList.splice(i, 1);
              break;
            }
          }
        }
      }
    }
    this.setData({
      selectedPlanList: this.data.selectedPlanList,
      plan: this.data.plan,
      totalPrice: mytotalPrice,
    });
  },
});
