const { envList } = require('../../envList');

// pages/me/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    showTip: false,
    nickName:"",
    avatarUrl:""
  },
  onLoad(){
    this.setData({
      openId: wx.getStorageSync('openid'),
      nickName:wx.getStorageSync('name'),
      avatarUrl:wx.getStorageSync('avatar'),
    })
    console.log(this.data.avatarUrl)
  },
  toinfo_edit: function() {
    
      wx.navigateTo({
        url: '/pages/info-edit/index'
      });
  },
  onShareAppMessage: function() {
    return {
      title: '推荐给你一个好用的小程序'
    };
  },
  logout() {
    // 清除用户登录信息（例如清除本地存储的用户信息）
    wx.removeStorageSync('openid');  // 删除openid

    // 跳转到登录页
    wx.redirectTo({
      url: '/pages/login/index'  // 替换为您的登录页面路径
    });
  }
});
