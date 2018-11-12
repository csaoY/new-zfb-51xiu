// const requestHandler = {
//   params: {},
//   url: '',
//   success: (res) => {
//   // success
//     my.alert({ content: res.method });
//   },
//   fail: () => {
//     // fail
//   },
// };

// GET请求
function GET(_requestHandler) {
  request('GET', _requestHandler);
}
// POST请求
function POST(_requestHandler) {
  request('POST', _requestHandler);
}

function request(_method, _requestHandler) {
  _requestHandler.params.channel = 7;
  // 注意：可以对params加密等处理
  my.httpRequest({
    url: _requestHandler.url,
    data: _requestHandler.params,
    method: _method, // OPTIONS, GET, HEAD, POST
    // header: {}, // 设置请求的 header
    success: (res) => {
      console.log( _requestHandler.params,)
      // 注意：可以对参数解密等处理
      //   my.alert({ title: String(res.status) });
      if (res.data.result.code === '2000' || res.data.result.code === '5018' || res.data.result.code === '5004') {
        _requestHandler.success(res.data);
      }else{
        my.showToast({
          type: 'success',
          content: res.data.result.info,
          duration: 3000,
          success: () => {
          },
        });
        return;
      }
    },
    fail: () => {
      _requestHandler.fail();
    },
    complete: () => {
      // complete
    },
  });
}


module.exports = {
  get: GET,
  post: POST,
};
