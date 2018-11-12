const util = require('../../utils/util.js');
const urls = require('../../utils/urls');
const network = require('../../utils/network.js');

Page({
  data: {
    eventId: 0,
    pro: 0,
    phone: '', // 评估型号
    versionId: '', // 评估型号ID
    assessments: [],
    options: [], // 功能选项列表
    assessments_length: 1,
  },
  onLoad(options) {
    console.log('onLoad');
    this.init(options);
    this.loadAssessments();
  },
  onReady() {
    // 页面渲染完成
  },
  init(options) {
    // 页面初始化 options为页面跳转所带来的参数
    const phone = options.phone;
    const versionId = options.versionId;
    console.log('接收到的参数是phone=' + options.phone + ' versionId=' + options.versionId);
    this.setData({
      phone: phone,
      versionId: versionId,
    });
  },
  // 手机评估列表
  loadAssessments() {
    const that = this;
    const myparams = Object();
    myparams.content = JSON.stringify({
      'versionId': that.data.versionId,
    });
    network.get({
      params: myparams,
      url: urls.versionProperty_get,
      success: (data) => {
        const assessments = data.detailInfoList;
        for (var i = 0; i < assessments.length; i++) {
          const assessmentSub = assessments[i].detail;
          for (var y = 0; y < assessmentSub.length; y++) {
            const assessment = assessmentSub[y];
            assessment.isSelected = false;
          }
        }
        const options = data.functionOptionsList;
        console.log('估价属性查询接口成功' + options);
        if (typeof options != 'undefined') {
          for (var i = 0; i < options.length; i++) {
            const option = options[i];
            option.isSelected = false;
          }
        }

        that.setData({
          assessments: assessments,
          options: options,
          assessments_length: assessments.length,
        });
        console.log('估价属性查询接口成功');
      },
      fail: () => {
        // fail
        that.setData({
          hasNetError: true,
        });
      },
    });
  },
  onSelectItem(event) {
    const idx = event.target.dataset.idx;
    const assessmentName = event.target.dataset.assessmentName;
    const assessmentid = event.target.dataset.assessmentid;
    const eventId = parseInt(idx) + 1;
    const pro = eventId / this.data.assessments_length * 100;
    const currentAssessment = this.data.assessments[idx];//当前选中的Assessment
    currentAssessment.assessment_name_selected = assessmentName;
    const assessment = currentAssessment.detail;
    const assessmentLength = assessment.length
    for (var i = 0; i < assessmentLength; i++) {
      var assessmentSub = assessment[i];
      if (assessmentSub.id == assessmentid) {
        assessmentSub.isSelected = true
      } else {
        assessmentSub.isSelected = false
      }
    }
    this.setData({
      assessments: this.data.assessments,
      eventId: eventId,
      pro: Math.ceil(pro),
    });
    console.log(this.data.eventId);
  },
  // 功能选项选择
  onSelectOptionItem(event) {
    const idx = event.target.dataset.idx;
    const optionid = event.target.dataset.optionid;
    const currentOption = this.data.options[idx]; // 当前选中的功能选项
    currentOption.isSelected = !currentOption.isSelected;
    console.log('values: ' + currentOption.isSelected);
    this.data.options[idx] = currentOption;
    this.setData({
      options: this.data.options,
    });
  },
  onModifyItem(event) {
    const idx = event.target.dataset.idx;
    const eventId = parseInt(idx);
    this.setData({
      eventId: eventId,
    });
    console.log(this.data.eventId);
  },
  showList() {
    my.navigateTo({
      url: 'assessment_list/assessment_list?phone=' + this.data.phone + '&versionId=' + this.data.versionId + '&assessments=' + JSON.stringify(this.data.assessments) + '&options=' + JSON.stringify(this.data.options),
    });
  },
  // 网络刷新
  refresh() {
    console.log('刷新');
    this.setData({
      hasNetError: false,
    });
    this.loadAssessments();
  },
});
