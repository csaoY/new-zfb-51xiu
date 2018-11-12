// 判断是否为重复点击
function isRepeatClick() {
  const currentTime = (new Date()).valueOf();
  if (currentTime - this.timestamp < 500) { // 点击时间差小于500毫秒时视为重复点击
    this.timestamp = currentTime;
    return true;
  } else {
    this.timestamp = currentTime;
    return false;
  }
}

function formatTime(date) {
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = date.getDate() + ' ';
  const h = date.getHours() + ':';
  const m = date.getMinutes() + ':';
  const s = date.getSeconds();
  console.log(Y + M + D + h + m + s); // 呀麻碟
  return (Y + M + D + h + m + s);
}

module.exports.isRepeatClick = isRepeatClick;
module.exports.formatTime = formatTime;
