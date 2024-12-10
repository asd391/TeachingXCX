const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

exports.main = async (event, context) => {
  const { jobId, jobData } = event;
  try {
    await db.collection('jobs').where({id:jobId}).update({
      data: {
        jobTitle: jobData.jobTitle,
        salary: jobData.salary,
        ageRequirement: jobData.ageRequirement,
        subject: jobData.subject,
        educationalLevel: jobData.educationalLevel,
        universityLevel: jobData.universityLevel,
        jobDetails: jobData.jobDetails,
        time: jobData.time
      },
    });
    return {
      success: true,
    };
  } catch (err) {
    return {
      error: '更新工作数据失败',
    };
  }
};
