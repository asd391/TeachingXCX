const cloud = require('wx-server-sdk');
cloud.init();  // 初始化云函数
const db = cloud.database();  // 获取数据库引用

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();  // 获取 wxContext
  const openid = wxContext.OPENID;  // 获取当前用户的 openid
  const appid = wxContext.APPID;    // 获取小程序的 appid
  const unionid = wxContext.UNIONID; // 如果用户绑定了开放平台账号，获取 unionid

  // 打印 wxContext 信息
  console.log('openid:', openid);
  console.log('appid:', appid);
  console.log('unionid:', unionid);

  // 根据 openid 查询数据库中的用户记录
  const userCollection = db.collection('users');
  const userRecord = await userCollection.where({
    openid: openid  // 根据 openid 查询用户信息
  }).get();

  if (userRecord.data.length > 0) {
    await userCollection.doc(userRecord.data[0]._id).update({
      data: {
        nickName: event.nickName || '',
        avatarUrl: event.avatarUrl || ''
      }
    });
    return {
      openid: openid,
      appid: appid,
      unionid: unionid
    };
  } else {
    // 如果用户不存在，插入新的用户记录
    await userCollection.add({
      data: {
        openid: openid,
        nickName: event.nickName || '',
        avatarUrl: event.avatarUrl || '',
        nickname: '',
        age: '',
        gender: '',
        introduction: '',
        expectedSubjects: '',
        expectedAgeRange: '',
        universityName: '', // 大学名称
        universityLevel: '', // 大学水平
        educationLevel: '', // 教育水平
      }
    });
    return { 
      openid: openid,
      appid: appid,
      unionid: unionid
    };
  }
};
