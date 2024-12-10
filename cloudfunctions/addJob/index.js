const cloud = require('wx-server-sdk');
cloud.init();  // 初始化云函数
const db = cloud.database();
const jobsCollection = db.collection('jobs');
exports.main = async (event, context) => {
  const {
    jobTitle,
    jobDetails,
    address,
    salary,
    time,
    subject,
    ageRequirement,
    id,
    contactwx
  } = event;

  const res = await jobsCollection.where({
    id: id  // 查询条件：id 字段等于传入的 jobId
  }).get();

  // 如果查询到记录，则报错
  if (res.data.length > 0) {
    return {
      code: 400,
      message: '该ID已存在，请使用其他ID'
    };}
  try {
    // 添加工作数据到数据库
    creationDate = new Date()
    const res = await jobsCollection.add({
      data: {
        id,
        jobTitle,
        jobDetails,
        address,
        salary,
        time,
        subject,
        ageRequirement,
        contactwx,
        creationDate: creationDate.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),  // 记录创建时间
      }
    });

    return {
      success: true,
      _id: res._id,  // 返回新记录的 ID
    };
  } catch (err) {
    console.error('添加工作失败', err);
    return {
      success: false,
      message: '添加工作失败',
    };
  }
};
