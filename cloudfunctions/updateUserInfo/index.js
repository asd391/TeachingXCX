const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database(); // 初始化数据库

// 云函数入口函数
exports.main = async (event, context) => {
  const { openid, formData } = event; // 接收传入的参数
  const wxContext = cloud.getWXContext(); // 获取微信上下文
  
  try {
    // 查询数据库是否已存在该 openid 的记录
    const userRes = await db.collection('users').where({ openid }).get();
    if (userRes.data.length > 0) {
      const updateRes = await db.collection('users').doc(userRes.data[0]._id).update({
        data: {
          nickname: formData.nickname,
          age: formData.age,
          gender: formData.gender,
          introduction: formData.introduction,
          expectedSubjects: formData.expectedSubjects,
          expectedAgeRange: formData.expectedAgeRange,
          universityName: formData.universityName,
          universityLevel: formData.universityLevel, 
          educationLevel: formData.educationLevel, 
        },
      });
      return {
        success: true,
        message: '更新成功',
        updateCount: updateRes.stats.updated,
      };
    } else {
      // 如果不存在记录，新增数据
      const addRes = await db.collection('users').add({
        data: {
          openid,
          nickname: formData.nickname,
          age: parseInt(formData.age),
          gender: formData.gender,
          introduction: formData.introduction,
          expectedSubjects: formData.expectedSubjects || [],
          expectedAgeRange: formData.expectedAgeRange || [],
          createTime: new Date(), // 创建的时间戳
        },
      });

      return {
        success: true,
        message: '新增成功',
        newId: addRes._id,
      };
    }
  } catch (err) {
    console.error('操作数据库失败:', err);
    return {
      success: false,
      message: '操作失败',
      error: err,
    };
  }
};