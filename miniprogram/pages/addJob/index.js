Page({
  data: {
    jobData: {
      id: '',            // 职位ID
      jobTitle: '',      // 职位标题
      address: '',       // 地址
      ageRequirement: '',// 年龄要求
      time: '',          // 时间
      salary: '',        // 薪资
      subject: [],       // 科目
      jobDetails: '',    // 备注
      contactwx: ''      // 联系微信
    },
    ageOptions: ['学前', '小学', '初中', '高中', '大学', '大学以上'],
    ageIndex: -1,  // 默认选择第一个选项
    subjectOptions: ['数学', '语文', '英语','物理','化学'],  // 默认的科目选项
    subjectChecked: {}, // 用于记录每个科目的选择状态
    newSubject: ''      // 输入的新科目
  },

  onLoad() {
    // 初始化数据，或者可以通过云函数获取现有数据
  },

  onIdInput(e){
    this.setData({ 'jobData.id': e.detail.value });
  },

  onJobTitleInput(e) {
    this.setData({ 'jobData.jobTitle': e.detail.value });
  },

  onAddressInput(e) {
    this.setData({ 'jobData.address': e.detail.value });
  },

  onAgeRequirementChange: function (e) {
    const selectedIndex = e.detail.value;
    this.setData({
      ageIndex: selectedIndex,
      'jobData.ageRequirement': this.data.ageOptions[selectedIndex]
    });
  },

  onTimeInput(e) {
    this.setData({ 'jobData.time': e.detail.value });
  },

  onSalaryInput(e) {
    this.setData({ 'jobData.salary': e.detail.value });
  },

  onSubjectChange(e) {
    this.setData({ 'jobData.subject': e.detail.value });
  },

  onNewSubjectInput(e) {
    this.setData({ newSubject: e.detail.value });
  },

  onAddSubject() {
    const { newSubject, subjectOptions } = this.data;
    if (newSubject && !subjectOptions.includes(newSubject)) {
      subjectOptions.push(newSubject);
      this.setData({
        subjectOptions: [...subjectOptions],
        newSubject: ''
      });
    }
  },

  onJobDetailsInput(e) {
    this.setData({ 'jobData.jobDetails': e.detail.value });
  },

  onContactwxInput(e) {
    this.setData({ 'jobData.contactwx': e.detail.value });
  },

  onSubmit() {
    const jobData = this.data.jobData;
    if (!jobData.id) {
      wx.showToast({ title: '请填写职位ID', icon: 'none' });
      return;
    }
    // 进行提交操作，可以通过云函数添加到数据库
    wx.cloud.callFunction({
      name: 'addJob',  // 云函数名称
      data: jobData,
      success: res => {
        if (res.result.success) {
          wx.showToast({
            title: '职位添加成功',
            icon: 'success'
          });
          // 这里可以跳转到其他页面或清空表单
          wx.navigateBack()
        } else {
          wx.showToast({
            title: res.result.message || '添加失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        wx.showToast({
          title: '云函数调用失败',
          icon: 'none'
        });
        console.error('云函数调用失败', err);
      }
    });
    wx.showToast({
      title: '职位添加成功',
      icon: 'success'
    });
  }
});
