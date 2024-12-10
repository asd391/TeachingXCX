const cloud = require('wx-server-sdk');
cloud.init();  // 初始化云函数
const db = cloud.database();  // 获取数据库引用
exports.main = async (event, context) => {
  try {
    const jobList = await db.collection('jobs').get(); // 从数据库中获取所有工作
    return {
      jobs: jobList.data,
    };
  } catch (error) {
    return {
      error: '获取工作列表失败',
    };
  }
};
