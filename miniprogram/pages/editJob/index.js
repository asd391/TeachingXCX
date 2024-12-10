Page({
  data: {
    jobData: {
      jobTitle: '',
      time: '',
      salary: '',
      ageRequirement: '',
      address: '',
      subject: [], // 多选科目
      jobDetails: '',
      contactwx: '',
    },
    subjectOptions: ['语文', '数学', '英语', '物理', '化学'],  // 科目选项
    subjectChecked: {},  // 存储已选中的科目
    newSubject: '',
    jobId:'',
  },

  // 监听职位标题输入
  onJobTitleInput(e) {
    this.setData({
      'jobData.jobTitle': e.detail.value
    });
  },

  // 监听时间输入
  onTimeInput(e) {
    this.setData({
      'jobData.time': e.detail.value
    });
  },

  // 监听薪资输入
  onSalaryInput(e) {
    this.setData({
      'jobData.salary': e.detail.value
    });
  },

  // 监听年龄要求输入
  onAgeRequirementInput(e) {
    this.setData({
      'jobData.ageRequirement': e.detail.value
    });
  },

  // 监听地址输入
  onAddressInput(e) {
    this.setData({
      'jobData.address': e.detail.value
    });
  },

  // 监听科目选择
  onSubjectChange(e) {
    const selectedSubjects = e.detail.value;
    let subjectChecked = {};
    // 更新已选择的科目
    selectedSubjects.forEach(subject => {
      subjectChecked[subject] = true;
    });

    this.setData({
      subjectChecked: subjectChecked,
      'jobData.subject': selectedSubjects
    });
  },

  // 监听新科目输入
  onNewSubjectInput(e) {
    this.setData({
      newSubject: e.detail.value
    });
  },

  // 添加新科目
  onAddSubject() {
    if (this.data.newSubject.trim() !== '') {
      const newSubject = this.data.newSubject.trim();
      if (!this.data.subjectOptions.includes(newSubject)) {
        const updatedSubjects = [...this.data.subjectOptions, newSubject];
        this.setData({
          subjectOptions: updatedSubjects,
          newSubject: ''
        });
      }
    }
  },

  // 监听工作介绍输入
  onJobDetailsInput(e) {
    this.setData({
      'jobData.jobDetails': e.detail.value
    });
  },

  // 监听联系微信输入
  onContactwxInput(e) {
    this.setData({
      'jobData.contactwx': e.detail.value
    });
  },

  // 提交修改
  onSubmit() {
    const jobData = this.data.jobData;

    // 此处可以根据需要进行表单验证
    if (!jobData.jobTitle || !jobData.salary || !jobData.time) {
      wx.showToast({
        title: '请填写必要信息',
        icon: 'none'
      });
      return;
    }

    // 提交数据到云函数
    console.log(jobData)
    wx.cloud.callFunction({
      name: 'updateJobData',  // 假设更新工作信息的云函数名称
      data: {
        jobId:this.data.jobId,
        jobData:jobData
      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: '修改成功',
          icon: 'success'
        });
        wx.navigateBack();  // 返回上一页
      },
      fail: err => {
        wx.showToast({
          title: '修改失败',
          icon: 'none'
        });
        console.error('修改失败', err);
      }
    });
  },

  // 页面加载时获取当前工作信息填充表单
  onLoad(options) {
    const jobId = options.id;  // 获取工作 ID
    this.setData({
      jobId:jobId
    });
    wx.cloud.callFunction({
      name: 'getJobData',  // 假设获取工作详情的云函数名称
      data: { jobId },
      success: res => {
        this.setData({
          jobData: res.result.job[0]
        });

        const SelectedSubjects = res.result.job[0].subject || [];
        let updatedSubjectOptions = [...this.data.subjectOptions];
        SelectedSubjects.forEach(subject => {
          if (!updatedSubjectOptions.includes(subject)) {
            updatedSubjectOptions.push(subject);  // 如果该科目不在原选项中，添加到 subjectOptions
          }
        });
        this.setData({
          subjectOptions: updatedSubjectOptions
        });

        // 设置已选科目
        const selectedSubjects = res.result.job[0].subject || [];
        let subjectChecked = {};
        this.data.subjectOptions.forEach(subject => {
          subjectChecked[subject] = selectedSubjects.includes(subject)
        });
        console.log(subjectChecked)
        this.setData({
          subjectChecked: subjectChecked
        });
      },
      fail: err => {
        console.error('获取工作详情失败', err);
      }
    });
  }
});
