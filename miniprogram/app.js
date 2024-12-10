// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: "",
        traceUser: true,
      });

      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        wx.reLaunch({
          url: '/pages/index/index' // 根据你的页面路径调整
        });
      } else {
        // 用户未登录，跳转到登录界面
        wx.reLaunch({
          url: '/pages/login/index' // 跳转到登录页
        });
      }
    }

    this.globalData = {};
  },
});
