const util = require('../../../utils/util.js');
const urls = require('../../../utils/urls');
const network = require('../../../utils/network.js');

Page({
  data: {
    phone: "",//评估型号
    versionId: "", //评估型号ID
    assessments: [],
    selectedOptions: [],//选中的功能选项
    price: 0
  },

  onReady: function () {
    console.log("onReady");
  },
  onLoad: function (options) { // 页面初始化 options为页面跳转所带来的参数
    console.log('onLoad')
    this.init(options);
  },
  onShow: function () {
    // 页面显示
    console.log("onShow");
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
    console.log("onUnload");
  },
  init: function (options) {
    console.log("init");

    // 页面初始化 options为页面跳转所带来的参数
    var phone = options.phone
    this.data.versionId = options.versionId
    this.data.assessments = JSON.parse(options.assessments)
    var optionList = [];
    if (options.options != 'undefined') {
      optionList = JSON.parse(options.options)
    }

    var selectedOptions = [];//选中的功能选项
    for (var i = 0; i < optionList.length; i++) {
      var optionItem = optionList[i];
      if(optionItem.isSelected==true) {
        selectedOptions.push(optionItem)
      }
    }

    this.setData({
      phone: phone,
      assessments: this.data.assessments,
      selectedOptions: selectedOptions
    });

    var detailIds = this.getDetailIds();
    this.getRecyclerPrice(this.data.versionId, detailIds);
  },

  getDetailIds: function () {//属性ID，多属性ID用逗号分割
    var assess = this.data.assessments
    var assList = ""
    for (var i = 0; i < assess.length; i++) {
      var detail = assess[i].detail
      for (var k = 0; k < detail.length; k++) {
        if (detail[k].isSelected) {
          if (i == 0) {
            assList += detail[k].id
          } else {
            assList = assList + ","
            assList = assList + detail[k].id
          }
        }
      }
    }
    
    for (var i = 0; i < this.data.selectedOptions.length; i++) {
      var selectedOption = this.data.selectedOptions[i];
      assList += "," + selectedOption.id
    }
    return assList;
  },
  getRecyclerPrice: function (versionId, detailIds) {//获取回收价格
    const that = this;
    const myparams = Object();
    myparams.content = JSON.stringify({
      'versionId': versionId,
      'detailIds': detailIds,
    });
    network.get({
      params: myparams,
      url: urls.estimateCalculate_get,
      success: (data) => {
        this.setData({
          price: data.price
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
  add: function () {
    my.navigateTo({
      url: "../recyclingcar/recyclingcar"
    })
  },
  order: function () {
    var detailIds = this.getDetailIds()
    var selectedDetailList = [{
      "phone": this.data.phone,//评估型号
      "versionId": this.data.versionId,
      "price": this.data.price,
      "detailIds": detailIds
    }]
    my.navigateTo({
      url: "../placeorder/placeorder?selectedDetailList=" + JSON.stringify(selectedDetailList)
    })
  },
  remodify: function () {
    my.navigateBack({
      delta: 1
    })
  }
})