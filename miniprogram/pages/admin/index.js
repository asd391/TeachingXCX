Page({
  data: {
    jobList: [], // 存储工作列表
  },

  onShow: function () {
    this.getJobList(); // 页面加载时获取工作列表
  },

  // 获取工作列表
  getJobList: function () {
    wx.cloud.callFunction({
      name: 'getJobList', // 云函数名称
      success: res => {
        this.setData({
          jobList: res.result.jobs, // 设置工作列表数据
        });
      },
      fail: err => {
        console.error('获取工作列表失败', err);
      },
    });
  },

  // 编辑工作
  onEditJob: function (e) {
    const jobId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/editJob/index?id=${jobId}`, // 跳转到编辑页面
    });
  },

  // 删除工作
  onDeleteJob: function (e) {
    const jobId = e.currentTarget.dataset.id;
    wx.cloud.callFunction({
      name: 'deleteJob', // 云函数名称
      data: {
        jobId: jobId, // 传递 jobId
      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: '删除成功',
          icon: 'success',
        });
        this.getJobList(); // 删除成功后重新获取工作列表
      },
      fail: err => {
        wx.showToast({
          title: '删除失败',
          icon: 'none',
        });
        console.error('删除工作失败', err);
      },
    });
  },

  // 添加新工作
  onAddJob: function () {
    wx.navigateTo({
      url: '/pages/addJob/index', // 跳转到添加工作页面
    });
  },
});
