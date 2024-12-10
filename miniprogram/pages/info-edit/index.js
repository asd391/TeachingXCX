Page({
  data: {
    // 表单字段
    nickname: '',
    age: '',
    genderOptions: ['男', '女', '其他'],
    genderIndex: 0,
    introduction: '',
    ageRangeOptions: ['学前', '小学', '初中', '高中','大学','大学以上'],
    selectedAgeRanges: [],
    subjectOptions: ['语文', '数学', '英语', '物理', '化学'],
    selectedSubjects: [],
    newSubject: '',
    universityName: '', // 新增字段：大学名称
    universityLevels: ['普通本科', '211', '985', '其他'],
    universityLevelIndex: 0,
    educationLevels: ['本科', '硕士', '博士', '其他'],
    educationLevelIndex: 0,
    subjectChecked: {} ,// 用于存储每个科目的选中状态
    ageChecked:{}
  },

  // 昵称输入
  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value });
  },

  // 年龄输入
  onAgeInput(e) {
    this.setData({ age: e.detail.value });
  },

  // 性别选择
  onGenderChange(e) {
    this.setData({ genderIndex: e.detail.value });
  },

  // 个人介绍输入
  onIntroductionInput(e) {
    this.setData({ introduction: e.detail.value });
  },

  // 家教年龄段选择
  onAgeRangeChange(e) {
    this.setData({ selectedAgeRanges: e.detail.value });
  },

  // 家教科目选择
  onSubjectChange(e) {
    this.setData({ selectedSubjects: e.detail.value });
  },

  // 新科目输入
  onNewSubjectInput(e) {
    this.setData({ newSubject: e.detail.value });
  },

  // 添加新科目
  onAddSubject() {
    if (this.data.newSubject.trim() !== '') {
      const updatedSubjects = [...this.data.subjectOptions, this.data.newSubject.trim()];
      this.setData({
        subjectOptions: updatedSubjects,
        newSubject: '',
      });
    }
  },

  // 大学名称输入
  onUniversityNameInput(e) {
    this.setData({ universityName: e.detail.value });
  },

  // 大学水平选择
  onUniversityLevelChange(e) {
    this.setData({ universityLevelIndex: e.detail.value });
  },

  // 教育水平选择
  onEducationLevelChange(e) {
    this.setData({ educationLevelIndex: e.detail.value });
  },

  onLoad: function () {
    this.loadUserData();
  },

  loadUserData: function () {
    const openid = wx.getStorageSync('openid');  // 获取本地存储的 openid

    if (!openid) {
      wx.showToast({
        title: '未找到用户信息',
        icon: 'none',
      });
      return;
    }

    // 调用云函数获取用户信息
    wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        openid: openid,  // 传递 openid
      },
      success: res => {
        if (res.result.code === 200) {
          const userData = res.result.data;
          
          
          // 设置默认值
          this.setData({
            nickname: userData.nickname || '',
            age: userData.age || '',
            genderIndex: this.data.genderOptions.indexOf(userData.gender || '其他'),
            introduction: userData.introduction || '',
            selectedAgeRanges: userData.expectedAgeRange || [],
            selectedSubjects: userData.expectedSubjects || [],
            universityName: userData.universityName || '',
            universityLevelIndex: this.data.universityLevels.indexOf(userData.universityLevel || '其他'),
            educationLevelIndex: this.data.educationLevels.indexOf(userData.educationLevel || '本科'),
          });

          const userSelectedSubjects = userData.expectedSubjects;
          let updatedSubjectOptions = [...this.data.subjectOptions];
          userSelectedSubjects.forEach(subject => {
            if (!updatedSubjectOptions.includes(subject)) {
              updatedSubjectOptions.push(subject);  // 如果该科目不在原选项中，添加到 subjectOptions
            }
          });
          this.setData({
            subjectOptions: updatedSubjectOptions
          });

          let subjectChecked = {};
          this.data.subjectOptions.forEach(subject => {
            // 如果用户已选择该科目，则设为选中状态
            subjectChecked[subject] = userData.expectedSubjects.includes(subject);
          });
          let ageChecked = {};
          this.data.ageRangeOptions.forEach(ageRange => {
            // 如果用户已选择该科目，则设为选中状态
            ageChecked[ageRange] = userData.expectedAgeRange.includes(ageRange);
          });
          this.setData({
            subjectChecked: subjectChecked, // 更新checkbox的选中状态
            ageChecked: ageChecked
          });
        } else {
          wx.showToast({
            title: '用户信息加载失败',
            icon: 'none',
          });
        }
      },
      fail: err => {
        console.error('获取用户信息失败', err);
        wx.showToast({
          title: '加载用户信息失败',
          icon: 'none',
        });
      },
    });
  },

  // 提交表单
  onSubmit() {
    const dataToSubmit = {
      nickname: this.data.nickname,
      age: this.data.age,
      gender: this.data.genderOptions[this.data.genderIndex],
      introduction: this.data.introduction,
      expectedAgeRange: this.data.selectedAgeRanges,
      expectedSubjects: this.data.selectedSubjects,
      universityName: this.data.universityName,
      universityLevel: this.data.universityLevels[this.data.universityLevelIndex],
      educationLevel: this.data.educationLevels[this.data.educationLevelIndex],
    };
    console.log(dataToSubmit)
    // 调用云函数或接口提交数据
    wx.cloud.callFunction({
      name: 'updateUserInfo',
      data:{
        openid:wx.getStorageSync('openid'),
        formData:dataToSubmit
      },
      success: () => {
        wx.showToast({ title: '提交成功', icon: 'success' });
        wx.reLaunch({
          url: '/pages/index/index'
        });
      },
      fail: () => {
        wx.showToast({ title: '提交失败', icon: 'none' });
      },
    });
  },
});
