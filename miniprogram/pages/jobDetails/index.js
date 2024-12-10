Page({
  data: {
    jobs: [],
  },

  onLoad(options) {
    const jobs = JSON.parse(options.jobs); // 获取传递的职位数据
    console.log(jobs)
    this.setData({
      jobs: jobs,
    });
  },

  onLongTap: function (e) {
    const item = e.currentTarget.dataset.item;  // 获取长按的item
    console.log(item);
    
    // 创建一个新的对象，排除 _id 字段
    const { _id, jobTitle, jobDetails, contactwx, ...itemToCopy } = item;
    
    // 将需要的字段转换为中文
    let textToCopy = '';
    textToCopy += `职位ID: ${item.id}\n`;
    textToCopy += `职位标题: ${item.jobTitle}\n`;
    textToCopy += `职位详情: ${item.jobDetails}\n`;
    textToCopy += `联系方式 (微信): ${item.contactwx}\n`;

    // 执行复制操作
    wx.setClipboardData({
      data: textToCopy,
      success: function () {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1500
        });
      },
      fail: function () {
        wx.showToast({
          title: '复制失败',
          icon: 'none',
          duration: 1500
        });
      }
    });
  }
});