const cloud = require('wx-server-sdk');
cloud.init();  // 初始化云函数
const db = cloud.database();  // 获取数据库引用
exports.main = async (event, context) => {
  try {
    const { jobId } = event; // 获取传递的工作 ID
    const res = await db.collection('jobs').where({id:jobId}).remove(); // 删除对应 ID 的工作
    return {
      success: true,
      message: '删除成功',
    };
  } catch (error) {
    return {
      error: '删除工作失败',
    };
  }
};
