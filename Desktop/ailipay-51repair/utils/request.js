const _ = require('underscore');
const util = require('util');

console.log(
	'%c名称：request\n' +
	'作者：萤火虫\n' +
	'版本：1.1.0\n' +
	'说明：  欢迎使用 request ，request 封装了小程序的 wx.request 、 wx.uploadFile 、wx.downloadFile 方法，' +
	'并额外处理了重复的业务工作，如显示loading，登录失效自动登录重连，让你专注于业务逻辑层处理。' +
	'request 提供了几个快捷方法：get，post，put，delete，upload,download。让你的开发更便捷' +
	'另外需要注意的是，request依赖 util 和 underscore 两个库文件！'
	, 'color:#16a085;text-shadow:0 0 10px #1abc9c;font-size:14px;');

//请求ID
const REQUEST_ID = {};
//登录失效回调函数
var checkLoginInvalidCallback = function (code, msg, data) {
};
//请求成功状态码
var successCodeList = [1, 2000, 5018];
module.exports = {
	/**
	 * 请求成功处理器
	 * @param {object} options
	 * @return {Function}
	 */
	successHandler: function (options) {
		return function (res) {
			try {
				res = options.isUpload ? JSON.parse(res.data) : res.data;
				const code = res.result.code === undefined ? parseInt(res.status) : parseInt(res.result.code);
				const msg = res.result.info !== undefined ? res.result.info : (res.info !== undefined ? res.info :
					(res.errMsg !== undefined ? res.errMsg : 'fail')
				);
				const data = res.data !== undefined ? res.data : res.info;

				//登录失效
				options.isLoginInvalid = false;
				if (checkLoginInvalidCallback && checkLoginInvalidCallback(code, msg, data) === true) {
					options.isLoginInvalid = true;

					//首先执行当前请求的登录失效回调函数，如果返回false则认为不在执行后面的数据，并且移除requestId
					if (options.loginInvalid && options.loginInvalid.apply(options.callbackObj, [res]) === true) {
						delete REQUEST_ID[options.requestId];
						return;
					}

					//触发登录失效监听器
					util.listener.fireListener("request.loginInvalid", [options], options.callbackObj);
					return;
				}

				//检查当前请求状态信息是否成功
				if (_(successCodeList).indexOf(code) !== -1) {
					options.callback.apply(options.callbackObj, [res, res]);
				} else {
					//如果当前请求的状态信息不在成功的状态码列表中则认为请求错误
					wx.showModal({
						content: msg,
						showCancel: false
					});
				}

			} catch (err) {
				console.error(err.stack);
				wx.showModal({
					content: "错误:" + err.message,
					showCancel: false
				});
			}
		};
	},
	/**
	 * 请求错误处理器
	 * @param {object} options
	 * @return {Function}
	 */
	failHandler: function (options) {
		return function (res) {
			console.error(res, options.url);
			if (options.failBefore && options.failBefore.apply(options.callbackObj, [res]) === false)
				return;

			options.isLoginInvalid = false;
			wx.showModal({
				content: "网络请求失败:" + res.errMsg,
				showCancel: false
			});

			options.failAfter && options.failAfter.apply(options.callbackObj, [res]);
		};
	},
	/**
	 * 请求完成处理
	 * @param options
	 * @return {Function}
	 */
	completeHandler: function (options) {
		return function (res) {
			if (options.completeBefore && options.completeBefore.apply(options.callbackObj, [res]) === false)
				return;

			if (options.isLoginInvalid) return;
			setTimeout(function () {
				if (options.isShowLoading) wx.hideToast();
				delete REQUEST_ID[options.requestId];
			}, options.delay);

			options.completeAfter && options.completeAfter.apply(options.callbackObj, [res]);
		}
	},
	/**
	 * 获取公共请求配置
	 * @param {Object} options
	 * @return {Object}
	 */
	getRequestOptions: function (options) {
		//必须配置
		options = _.extend({
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			isShowLoading: options.isShowLoading !== false,//是否显示loading
			loadingText: options.loadingText || "请稍后...",//显示loading的文字
			delay: options.delay || 500,//延迟多长时间进行删除requestId
		}, options);

		options.requestId = _.uniqueId("RQ");//生成唯一一个请求ID
		options.isLoginInvalid = false;//当前请求是否登录失效
		options.success = this.successHandler(options);
		options.fail = this.failHandler(options);
		options.complete = this.completeHandler(options);

		//把requestId缓存到全屏变量中
		REQUEST_ID[options.requestId] = 1;

		return options;
	},
	/**
	 * GET 请求
	 * @param {string} url 请求的URL 必须
	 * @param {Object} data  url 请求的URL 必须
	 * @param {Function} callback 接口状态信息成功回调函数 必须
	 * @param {Object} [callbackObj] 接口状态信息成功回调函数所属对象 可选
	 * @param {Object} [options] 请求额外配置参数 可选
	 * @param {string} [requestId] 上次请求的requestId 可选 防止多次请求
	 * @return {string} 新生成的requestId
	 */
	get: function (url, data, callback, callbackObj, options, requestId) {
		"use strict";
		return this.request(_.extend({
			url: url,
			data: data,
			method: "GET",
			callback: callback,
			callbackObj: callbackObj
		}, options || {}), requestId);
	},
	/**
	 * POST 请求
	 * @param {string} url 请求的URL 必须
	 * @param {Object} data  url 请求的URL 必须
	 * @param {Function} callback 接口状态信息成功回调函数 必须
	 * @param {Object} [callbackObj] 接口状态信息成功回调函数所属对象 可选
	 * @param {Object} [options] 请求额外配置参数 可选
	 * @param {string} [requestId] 上次请求的requestId 可选 防止多次请求
	 * @return {string} 新生成的requestId
	 */
	post: function (url, data, callback, callbackObj, options, requestId) {
		"use strict";
		console.log(data)
		return this.request(_.extend({
			url: url,
			data: data,
			method: "POST",
			callback: callback,
			callbackObj: callbackObj
		}, options || {}), requestId);
	},
	/**
	 * PUT 请求
	 * @param {string} url 请求的URL 必须
	 * @param {Object} data  url 请求的URL 必须
	 * @param {Function} callback 接口状态信息成功回调函数 必须
	 * @param {Object} [callbackObj] 接口状态信息成功回调函数所属对象 可选
	 * @param {Object} [options] 请求额外配置参数 可选
	 * @param {string} [requestId] 上次请求的requestId 可选 防止多次请求
	 * @return {string} 新生成的requestId
	 */
	put: function (url, data, callback, callbackObj, options, requestId) {
		"use strict";
		return this.request(_.extend({
			url: url,
			data: data,
			method: "PUT",
			callback: callback,
			callbackObj: callbackObj
		}, options || {}), requestId);
	},
	/**
	 * DELETE 请求
	 * @param {string} url 请求的URL 必须
	 * @param {Object} data  url 请求的URL 必须
	 * @param {Function} callback 接口状态信息成功回调函数 必须
	 * @param {Object} [callbackObj] 接口状态信息成功回调函数所属对象 可选
	 * @param {Object} [options] 请求额外配置参数 可选
	 * @param {string} [requestId] 上次请求的requestId 可选 防止多次请求
	 * @return {string} 新生成的requestId
	 */
	delete: function (url, data, callback, callbackObj, options, requestId) {
		"use strict";
		return this.request(_.extend({
			url: url,
			data: data,
			method: "DELETE",
			callback: callback,
			callbackObj: callbackObj
		}, options || {}), requestId);
	},
	/**
	 * 请求
	 * @param {Object} options
	 * @param {string} requestId  上次请求的requestId 可选 防止多次请求
	 * @return {string} 新生成的requestId
	 */
	request: function (options, requestId) {
		"use strict";

		//可以防止多次请求
		if (this.isLoading(requestId)) return requestId;

		options = this.getRequestOptions(options || {});
		//触发请求拦截器
		if (util.listener.fireListener("request.interceptor", [options], options.callbackObj) === false) {
			options.complete({ errMsg: 'request interceptor!' });
			return requestId;
		}

		if (options.isShowLoading)
			wx.showToast({ icon: "loading", title: options.loadingText, duration: 10000 });
		wx.request(options);

		return options.requestId;
	},
	/**
	 * 上传文件
	 * @param {string} url 请求的URL 必须
	 * @param {string} filePath 文件路径 必须
	 * @param {string} name 文件标识 必须
	 * @param {Object} data  url 请求的URL 必须
	 * @param {Function} callback 接口状态信息成功回调函数 必须
	 * @param {Object} [callbackObj] 接口状态信息成功回调函数所属对象 可选
	 * @param {Object} [options] 请求额外配置参数 可选
	 * @param {string} [requestId] 上次请求的requestId 可选 防止多次请求
	 * @return {string} 新生成的requestId
	 */
	upload: function (url, filePath, name, data, callback, callbackObj, options, requestId) {
		//可以防止多次请求
		if (this.isLoading(requestId)) return requestId;

		options = this.getRequestOptions(_.extend(options || {}, {
			url: url,
			filePath: filePath, name: name,
			formData: data,
			loadingText: '上传中...',
			isShowLoading: true,
			isUpload: true,
		}));

		//触发请求拦截器
		if (util.listener.fireListener("request.interceptor", [options], options.callbackObj) === false) {
			options.complete({ errMsg: 'request interceptor!' });
			return requestId;
		}

		wx.showToast({ title: options.loadingText, icon: 'loading', duration: 10000 });
		wx.uploadFile(options);

		return options.requestId;
	},
	/**
	 * 根据requestId检查是否正在请求
	 * @param {string} requestId
	 * @return {boolean}
	 */
	isLoading: function (requestId) {
		if (!requestId) return false;
		return REQUEST_ID[requestId] !== undefined;
	},
	/**
	 * 设置检测登录是否失效，返回false代表当前请求失效，true 代表当前请求正常执行
	 * @param {Function} callback
	 */
	setCheckLoginInvalidListener: function (callback) {
		checkLoginInvalidCallback = callback;
	},
	/**
	 * 请求成功码
	 * @param {Array} codeList
	 */
	setSuccessCodeList: function (codeList) {
		if (!_(codeList).isArray())
			throw new TypeError("请传递一个数字数组！");

		_(codeList).map(function (item) {
			item = parseInt(item);
			if (isNaN(item)) {
				throw new TypeError("请传递一个数字数组！");
			}
			return item;
		});

		successCodeList = codeList;
	}
};