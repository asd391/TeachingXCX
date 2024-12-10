const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  const { openid } = event;

  try {
    // 查询数据库中的用户信息
    const userRes = await db.collection('users').where({
      openid: openid,  // 根据 openid 查找用户
    }).get();

    if (userRes.data.length > 0) {
      // 如果找到用户，返回期望年龄和期望科目信息
      const userData = userRes.data[0];  // 获取第一条记录（假设 openid 唯一）
      return {
        expectedAgeRange: userData.expectedAgeRange || '未设置',
        expectedSubjects: userData.expectedSubjects || '未设置',
        universityLevel: userData.universityLevel || '未设置', 
        educationLevel: userData.educationLevel || '未设置',
      };
    } else {
      return {
        expectedAgeRange: '未设置',
        expectedSubjects: '未设置',
        universityLevel: '未设置',
        educationLevel: '未设置',
      };
    }
  } catch (err) {
    console.error('获取用户期望信息失败', err);
    return {
      expectedAgeRange: '未设置',
      expectedSubjects: '未设置',
    };
  }
};
