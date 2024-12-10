// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
exports.main = async (event, context) => {
  const { jobId } = event;
  try {
    const jobData = await db.collection('jobs').where({id:jobId}).get();
    return {
      job: jobData.data,
    };
  } catch (err) {
    return {
      error: '获取工作数据失败',
    };
  }
};
