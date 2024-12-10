const cloud = require('wx-server-sdk');
cloud.init();  // 初始化云函数
const db = cloud.database();  // 获取数据库引用

exports.main = async (event, context) => {
  const { expectedAgeRange, expectedSubjects, educationLevel, universityLevel } = event;

  try {
    // 查询符合条件的工作
    const jobRes = await db.collection('jobs').get();
    let jobList = jobRes.data

    jobList = jobList.filter(job => {
      // 筛选符合条件的工作
      const isSubjectMatched = job.subject ? expectedSubjects.includes(job.subject) : false;
      const isAgeMatched = job.ageRequirement ? expectedAgeRange.includes(job.ageRequirement) : false;
      const isEducationMatched = job.educationalLevel ? job.educationalLevel.includes(educationLevel) || job.educationalLevel.includes('不限') : false;
      const isUniversityMatched = job.universityLevel ? job.universityLevel.includes(universityLevel) || job.universityLevel.includes('不限') : false;
      return isSubjectMatched && isAgeMatched && isEducationMatched && isUniversityMatched;
    });
    return {
      jobs: jobList
    };
  } catch (err) {

    return {
      jobs: [],
      code:err
    };
  }
};
