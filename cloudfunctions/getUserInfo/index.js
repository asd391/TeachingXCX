// 云函数代码：getUserInfo
const cloud = require('wx-server-sdk');
cloud.init();

const db = cloud.database();

exports.main = async (event, context) => {
  const openid = event.openid;
  
  try {
    const userRes = await db.collection('users').where({
      openid: openid,
    }).get();

    // 如果有用户数据，返回数据，否则返回空数据
    if (userRes.data.length > 0) {
      return {
        code: 200,
        data: userRes.data[0],
      };
    } else {
      return {
        code: 404,
        data: null,
      };
    }
  } catch (err) {
    return {
      code: 500,
      message: '查询失败',
    };
  }
};
