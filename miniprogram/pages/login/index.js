Page({
  data: {
    loading: false,
    showPasswordModal: false,  // 控制密码输入框是否显示
    passwordInput: '',         // 存储用户输入的密码
    correctPassword: 'UMVCd5UPjHOWJrsCAzO8',
  },

  onAdminButtonClick() {
    this.setData({
      showPasswordModal: true,  // 显示密码输入框
    });
  },

  // 监听密码输入框内容
  onPasswordInput(e) {
    this.setData({
      passwordInput: e.detail.value,
    });
  },

  // 提交密码进行验证
  submitPassword() {
    const { passwordInput, correctPassword } = this.data;

    if (passwordInput === correctPassword) {
      // 密码正确，跳转到管理端页面
      wx.navigateTo({
        url: '/pages/admin/index',  // 根据实际管理端页面路径修改
      });
    } else {
      // 密码错误，提示用户
      wx.showToast({
        title: '密码错误，请重新输入',
        icon: 'none',
        duration: 2000,
      });
    }

    // 无论密码是否正确，都关闭输入框
    this.closePasswordModal();
  },

  // 关闭密码输入框
  closePasswordModal() {
    this.setData({
      showPasswordModal: false,  // 隐藏密码输入框
      passwordInput: '',         // 清空输入的密码
    });
  },
  
  onLoad: function () {
    // this.showDisclaimer();
  },

  showDisclaimer: function() {
    wx.showModal({
      title: '免责声明',
      content: '本小程序非盈利，仅为交流信息\n但是提前需要说明的是：中介信息费是行业内公开透明的，有一个明确的收费标准。\n如果您可以理解并接受中介费的存在，那么在加到中介之后，中介会发给您这个收费标准',
      showCancel: false,  // 不显示取消按钮
      confirmText: '已了解',
      success: (res) => {
        if (res.confirm) {
          console.log('用户收到了免责声明');
        }
      },
      fail: (err) => {
        console.log('弹窗失败:', err);
      }
    });
  },
  
  onLogin: function () {
    this.setData({ loading: true });

    wx.getUserInfo({
      success: userRes => {
        const { nickName, avatarUrl } = userRes.userInfo;

        wx.cloud.callFunction({
          name: 'getOpenid',  // 云函数名称
          data: {
            nickName: nickName,
            avatarUrl: avatarUrl
          },
          success: res => {
            console.log('云函数调用成功:', res);
            wx.setStorage({
              data: res.result.openid,
              key: 'openid',
            })
            wx.setStorage({
              data: nickName,
              key: 'name',
            })
            wx.setStorage({
              data: avatarUrl,
              key: 'avatar',
            })
            wx.setStorage({
              data: avatarUrl,
              key: 'subjects',
            })
            wx.reLaunch({
              url: '/pages/index/index'
            });
          },
          fail: err => {
            console.error('云函数调用失败:', err);
          }
        });
  }
})},
});
