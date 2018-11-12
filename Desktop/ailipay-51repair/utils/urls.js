const BASE_URL = 'https://ssit.51xiuj.com/51xiu-sroutine/';// 测试环境
// const BASE_URL = 'https://s.51xiuj.com/51xiu-sroutine/';// 正式环境
// const BASE_URL = 'http://192.168.1.132:8080/51xiu-sroutine/';// 内网环境
// const BASE_URL = 'https://www.easy-mock.com/mock/590184457a878d73716db365/51xiuj/';

module.exports = {
  baseURL: 'https://ssit.51xiuj.com',
  brand_query: BASE_URL + 'v1/brand/query', // 维修手机品牌列表
  recyclebrand_query: BASE_URL + 'v1/recyclebrand/query', // 获取回收品牌与类型数据接口
  recycleVersion_query: BASE_URL + 'v1/recycleVersion/query', // 获取回收型号数据接口
  versionRam_queryById: BASE_URL + 'v1/versionRam/queryById', // 获取内存升级型号
  versionProperty_get: BASE_URL + 'v1/versionProperty/get', // 估价属性查询接口
  estimateCalculate_get: BASE_URL + 'v1/estimateCalculate/get', // 回收数据评估接口
  recyclingcars: BASE_URL + 'recyclingcars', // 回收车列表(还没实现)
  version_queryById: BASE_URL + 'v1/version/queryById', // 根据品牌ID与类型ID查询型号接口
  version_queryVersionColor: BASE_URL + 'v1/version/queryVersionColor', // 根据型号查询颜色接口
  fault_queryById: BASE_URL + 'v1/fault/queryById', // 根据颜色型号查询故障列表
  versionRamFault_queryById: BASE_URL + 'v1/versionRamFault/queryById', // 根据型号查询内存故障列
  version_getAreaByCode: BASE_URL + 'v1/version/getAreaByCode', // 获取维修订单行政区域接口
  order_insert: BASE_URL + 'v1/order/insert', // 提交维修订单
  recycle_getAreaByCode: BASE_URL + 'v1/recycle/getAreaByCode', // 获取回收订单行政区域接口
  recycleOrder_insert: BASE_URL + 'v1/recycleOrder/insert', // 提交回收订单接口
  order_query: BASE_URL + 'v1/order/query', // 我的订单查询接口
  customer_login: BASE_URL + 'v1/appCustomer/login', // 登录接口
  vercode_send: BASE_URL + 'v1/vercode/send', // 短信验证码接口
  order_getByOrderId: BASE_URL + 'v1/order/getByOrderId', // 订单详情查询接口
  verifyCode_GenerateVerifyCode: BASE_URL + 'verifyCode/GenerateVerifyCode', // 获取图形验证码接口
  order_orderSubmit: BASE_URL + 'v1/order/orderSubmit', // 一键下单
  order_coupon: BASE_URL + 'coupon/getPhoneCouponInfo', // 根据手机号与维修方案id查询优惠券可使用的优惠券
  submitInexpress: BASE_URL + 'v1/submitInexpress', // 发货保存快递单号
  queryInexpress: BASE_URL + 'v1/queryInexpress', // 查询发货&快递单号
};
