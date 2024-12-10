Page({
  data: {
    gradeOptions: ['学前', '小学', '初中', '高中', '大学', '大学以上'],
    subjectOptions: ['数学', '语文', '英语', '物理', '化学', '生物'],
    genderOptions: ['男', '女', '不限'],
    teachingMethods: ['线上', '线下', '不限'],
    selectedAddress: '不限',
    selectedGrades: {},
    selectedSubjects: {},
    selectedGender: '不限',
    selectedTime: '不限',
    salary: '不限',
    selectedTeachingMethod: '不限',

    // Dialog 状态
    showDialog: false,
    newSubject: ''
  },

  // 处理目标地址输入
  onAddressInput: function(e) {
    this.setData({
      selectedAddress: e.detail.value
    });
  },

  // 处理年级变化
  onGradeChange: function(e) {
    const selectedGrades = e.detail.value.reduce((acc, curr) => {
      acc[curr] = true;
      return acc;
    }, {});
    this.setData({
      selectedGrades
    });
  },

  // 处理科目变化
  onSubjectChange: function(e) {
    const selectedSubjects = e.detail.value.reduce((acc, curr) => {
      acc[curr] = true;
      return acc;
    }, {});
    this.setData({
      selectedSubjects
    });
  },

  // 处理性别选择
  onGenderChange: function(e) {
    this.setData({
      selectedGender: this.data.genderOptions[e.detail.value]
    });
  },

  // 处理时间输入
  onTimeInput: function(e) {
    this.setData({
      selectedTime: e.detail.value
    });
  },

  // 处理薪资输入
  onSalaryInput: function(e) {
    this.setData({
      salary: e.detail.value
    });
  },

  // 处理授课方式选择
  onTeachingMethodChange: function(e) {
    this.setData({
      selectedTeachingMethod: this.data.teachingMethods[e.detail.value]
    });
  },

  // 显示科目添加对话框
  onShowSubjectDialog: function() {
    this.setData({
      showDialog: true
    });
  },

  // 关闭对话框
  onHideDialog: function() {
    this.setData({
      showDialog: false,
      newSubject: ''
    });
  },

  // 处理新科目输入
  onNewSubjectInput: function(e) {
    this.setData({
      newSubject: e.detail.value
    });
  },

  // 确认添加科目
  onAddSubject: function() {
    const newSubject = this.data.newSubject.trim();
    if (newSubject && !this.data.subjectOptions.includes(newSubject)) {
      this.setData({
        subjectOptions: [...this.data.subjectOptions, newSubject],
        showDialog: false,
        newSubject: ''
      });
    } else {
      wx.showToast({
        title: '科目已存在或无效',
        icon: 'none'
      });
    }
  },

  // 提交表单
  onSubmit: function() {
    // 提交表单的数据
    const data = {
      address: this.data.selectedAddress,
      grades: Object.keys(this.data.selectedGrades),
      subjects: Object.keys(this.data.selectedSubjects),
      gender: this.data.selectedGender,
      time: this.data.selectedTime,
      salary: this.data.salary,
      teachingMethod: this.data.selectedTeachingMethod
    };
    console.log('提交数据：', data);

    wx.cloud.callFunction({
      name: 'searchJob',
      data: data,
      success: res => {
        const jobs = res.result.jobs;
        console.log(res.result)
        if (jobs.length > 0) {
          // 重定向到职位展示页面，并传递职位信息
          wx.navigateTo({
            url: `/pages/jobDetails/index?jobs=${JSON.stringify(jobs)}`,
          });
        } else {
          wx.showToast({
            title: '没有找到相关职位',
            icon: 'none',
          });
        }
      },
      fail: err => {
        console.log(err)
        wx.showToast({
          title: '查询失败',
          icon: 'none',
        });
      },
    });
  }
});
