// pages/assessment/placeorder/placeorder.js
const util = require('../../../utils/util.js');
const urls = require('../../../utils/urls');
const network = require('../../../utils/network.js');

Page({
  data: {
    cityList: [], // 城市列表
    areaList: [], // 区域列表
    versionName: '',
    cityListIndex: 0, // 选中城市列表下标
    areaListIndex: 0, // 选中区域列表下标
    selectedPlanList: [], // 用户选择的故障列
    totalPrice: 0, // 维修总价
    orderFormOK: true, // 表单是否准备OK
    couponList: [], // 优惠券列表
    totalCouponPrice: 0, // 优惠金额
    regulationList: [], // 优惠券列表选择限制条件
  },
  onLoad(options) {
    console.log('onLoad');
    this.init(options);
    this.loadVersionGetAreaByCode();
  },
  model() {
    if (util.isRepeatClick()) return; // 判断是否为重复点击
    my.navigateTo({
      url: '../../clause/maintenanceclause/maintenanceclause',
    });
  },

  // 获取行政区域
  loadVersionGetAreaByCode(mycode = '') {
    const that = this;
    const myparams = Object();
    myparams.content = JSON.stringify({
      'code': mycode,
    });
    network.get({
      params: myparams,
      url: urls.version_getAreaByCode,
      success: (data) => {
        if (mycode === '') {
          const mycityList = data.areaList;
          that.setData({
            cityListIndex: 0, // 重置选中城市列表下标
            cityList: mycityList, // 设置城市列表
          });
          if (typeof mycityList[0] !== 'undefined') {
            // 加载第一个城市的区域
            that.loadVersionGetAreaByCode(mycityList[0].code);
          }
        } else {
          const myareaList = data.areaList;
          that.setData({
            areaListIndex: 0, // 重置选中区域列表下标
            areaList: myareaList, // 设置区域列表
          });
        }
        console.log('获取行政区域接口成功');
      },
      fail: () => {
        // fail
        that.setData({
          hasNetError: true,
        });
      },
    });
  },
  // 城市列表改变
  bindCityPickerChange(e) {
    const index = e.detail.value;
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      cityListIndex: index,
    });
    const cityCode = this.data.cityList[index].code; // 客户城市编码
    if (cityCode === -1 || cityCode === -2) { // 未选择或者选择邮寄维修
      this.setData({
        areaListIndex: 0, // 重置选中区域列表下标
        areaList: [], // 设置区域列表
      });
      return;
    }
    this.loadVersionGetAreaByCode(this.data.cityList[this.data.cityListIndex].code);
  },
  // 区域列表改
  bindAreaPickerChange(e) {
    this.setData({
      areaListIndex: e.detail.value,
    });
  },
  init(options) {
    // 页面初始化 options为页面跳转所带来的参数
    const mytotalPrice = options.totalPrice;
    this.data.selectedPlanList = JSON.parse(options.selectedPlanList);
    console.log('接收到的参数是phone=' + this.data.selectedPlanList[0].plan);
    this.setData({
      totalPrice: mytotalPrice,
      selectedPlanList: this.data.selectedPlanList,
    });
  },
  // 电话号码输入框内容改变时触发
  bindContactPhoneInput(e) {
    const that = this;
    const contactPhone = e.detail.value; // 客户电话号码
    if (!(/^1[34578]\d{9}$/.test(contactPhone))) {
      return;
    }
    var pIds = ''; // 故障ID【必填,多个用逗号隔开】
    for (var i = 0; i < this.data.selectedPlanList.length; i++) {
      pIds += this.data.selectedPlanList[i].id + ',';
    }
    if (pIds !== '') {
      pIds = pIds.substr(0, pIds.length - 1);
    }
    const myparams = Object();
    myparams.content = JSON.stringify({
      'phoneNumber': contactPhone,
      'planIds': pIds,
    });
    network.get({
      params: myparams,
      url: urls.order_coupon,
      success: (data) => {
        const couponList = data.couponList.map((elem) => {
          const myelem = elem;
          myelem.isSelected = false;
          return myelem;
        });
        that.setData({
          couponList: couponList,
          regulationList: data.regulationList,
          totalCouponPrice: 0,
        });
        console.log('装载优惠券成功');
      },
      fail: () => {
        // fail
        that.setData({
          hasNetError: true,
        });
      },
    });
  },
  onSelectCoupon(e) {
    const id = e.target.dataset.id; // id
    const coupon_type = e.target.dataset.coupon_type; // 优惠券类型：1全场通用，2：指定故障专用券
    var selectedCouponCount = 0; // 择中的优惠劵数量
    var isSelected = false; // 是否是择中
    this.data.couponList.forEach((element) => {
      if (element.isSelected) {
        selectedCouponCount++;
      }
      if (id === element.id) {
        isSelected = !element.isSelected;
      }
    }, this);
    // 基于目前后台服务器的数据结构，客户端校验少一点
    if (this.data.selectedPlanList.length === selectedCouponCount && isSelected) { // 优惠劵数量达到上限
      my.alert({
        title: '亲',
        content: '对不起，该订单最多只能选用 ' + selectedCouponCount + ' 个优惠劵!',
        buttonText: '我知道了',
        success: () => {
        },
      });
      return;
    }
    if (this.data.regulationList[0].couponSum === selectedCouponCount && isSelected) { // 优惠劵数量达到上限
      my.alert({
        title: '亲',
        content: '对不起，该订单最多只能选用 ' + (selectedCouponCount) + ' 个优惠劵!',
        buttonText: '我知道了',
        success: () => {
        },
      });
      return;
    }

    this.data.couponList.forEach((element) => {
      if (element.isSelected) {
        totalCouponPrice += parseInt(element.coupon_price);
      }
    }, this);

    const couponList = this.data.couponList.map((elem) => {
      const myelem = elem;
      if (id === elem.id) {
        myelem.isSelected = !elem.isSelected;
      }
      return myelem;
    });

    var totalCouponPrice = 0;
    couponList.forEach((element) => {
      if (element.isSelected) {
        totalCouponPrice += parseInt(element.coupon_price);
      }
    }, this);
    this.setData({
      couponList: couponList,
      totalCouponPrice: totalCouponPrice,
    });
  },
  // 提交维修订单
  submitOrder(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    const that = this;
    var cityIndex = e.detail.value.cityIndex; // 客户选择城市下标
    this.setData({
      cityIndex: cityIndex,
    });
    var areaCode = ''; // 客户地区编码【必填】
    var repairType = 0; // 0.上门维修1.预约到店2.寄修3.邮寄回收4.上门回收
    if (cityIndex === 1) { // 选择邮寄维修
      repairType = 2;
    } else if ((this.data.areaList.length === 0) || (that.data.cityListIndex === 0)) {
      my.showToast({
        type: 'success',
        content: '请选择地区',
        duration: 2000,
      });
      return;
    } else {
      areaCode = this.data.areaList[e.detail.value.areaCode].code; // 客户地区编码【必填】
    }

    const address = e.detail.value.address; // 详细地址【必填】
    const contactName = e.detail.value.contactName; // 客户姓名【必填】
    const contactPhone = e.detail.value.contactPhone; // 客户手机号码【必填】
    const remark = e.detail.value.remark; // 客户备注【选填】
    var pIds = ''; // 故障ID【必填,多个用逗号隔开】
    const userAgreement = e.detail.value.userAgreement; // 客户备注【选填】
    var couponIDs = ''; // 优惠券id

    if (address.replace(/\s/g, '') == '') {
      my.showToast({
        content: '请填写详细地址',
        type: 'success',
        duration: 2000,
      });
      return;
    }
    if (contactName.replace(/\s/g, '') == '') {
      my.showToast({
        content: '请填写联系人',
        type: 'success',
        duration: 2000,
      });
      return;
    }
    if (!(/^[a-zA-Z ]{1,20}$/.test(contactName)) && !(/^[\u4e00-\u9fa5]{1,10}$/.test(contactName))) {
      my.showToast({
        content: '请填写正确的联系人名',
        type: 'success',
        duration: 2000,
      });
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(contactPhone))) {
      my.showToast({
        content: '请填写正确的手机号码',
        type: 'success',
        duration: 2000,
      });
      return;
    }
    if (userAgreement) {
      this.data.orderFormOK = true;
    }
    // 计算故障ID字符串
    for (var i = 0; i < this.data.selectedPlanList.length; i++) {
      pIds += this.data.selectedPlanList[i].id + ',';
    }
    if (pIds !== '') {
      pIds = pIds.substr(0, pIds.length - 1);
    }
    // 计算优惠券ID字符串
    for (var i = 0; i < this.data.couponList.length; i++) {
      if (this.data.couponList[i].isSelected) {
        couponIDs += this.data.couponList[i].id + ',';
      }
    }
    if (couponIDs !== '') {
      couponIDs = couponIDs.substr(0, couponIDs.length - 1);
    }

    const myparams = Object();
    myparams.content = JSON.stringify({
      "pIds": pIds,
      areaCode: areaCode,
      address: address,
      contactName: contactName,
      contactPhone: contactPhone,
      remark: remark,
      repairType: repairType,
      phonCouponStr: couponIDs,
    });
    network.post({
      params: myparams,
      url: urls.order_insert,
      success: (data) => {
        console.log('提交维修订单成功');
        my.setStorageSync({
          key: 'mailInfo',
          data: data.mailInfo,
        });
        my.setStorageSync({
          key: 'precautions',
          data: data.precautions,
        });
        my.navigateTo({
          url: '../../last/fixlast/last?orderid=' + data.orderId + '&cityIndex=' + that.data.cityIndex,
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
  // 用户协议同意
  checkboxChange(e) {
    const checked = e.detail.value;
    if (checked[0] === 'true') {
      this.setData({
        orderFormOK: true,
      });
    } else {
      this.setData({
        orderFormOK: false,
      });
    }
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
  },
});
