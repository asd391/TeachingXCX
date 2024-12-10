// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  const {
    address,
    grades,
    subjects,
    gender,
    time,
    salary,
    teachingMethod
  } = event;

  try {
    const query = {};

    // 处理 address
    if (address !== '不限' && address !== '') {
      query.address = db.RegExp({
        regexp: address, // 模糊匹配 address
        options: 'i', // 不区分大小写
      });
    }

    // 处理 grades
    if (grades.length > 0) {
      query.ageRequirement = _.in(grades); // grades 包含查询的年级
    }

    // 处理 subjects
    if (subjects.length > 0) {
      query.subject = _.in(subjects); // subjects 包含查询的科目
    }

    // 处理 gender
    if (gender !== '不限') {
      query.jobDetails = _.or(
        db.RegExp({
          regexp: gender, // 模糊匹配 gender
          options: 'i', // 不区分大小写
        }),
        db.RegExp({
          regexp: '未知性别', // 模糊匹配 gender
          options: 'i', // 不区分大小写
        })
      )
    }

    // 处理 time
    if (time !== '不限' && time !== '') {
      const timeArray = time.split(' ');  // 将用户输入的时间拆分为数组
      query.time = _.and(timeArray.map(item => db.RegExp({
        regexp: item,
        options: 'i',
      }))); 
    }

    // 处理 teachingMethod
    if (teachingMethod !== '不限') {
      query.jobDetails = _.or(
        db.RegExp({
          regexp: teachingMethod, // 模糊匹配 gender
          options: 'i', // 不区分大小写
        }),
        db.RegExp({
          regexp: '未知方式', // 模糊匹配 gender
          options: 'i', // 不区分大小写
        })
      );
    }

    // 查询符合条件的职位
    const result = await db.collection('jobs').where(query).get();
    if (salary !== '不限' && salary !== '')
    {
      jobList = result.data.filter(job => {
        // 筛选符合条件的工作
        const salaryRangeMatch = salary.match(/^(\d+)-(\d+)$/);
        const [_, minSalary, maxSalary] = salaryRangeMatch.map(Number);
        
        if(job.salary.includes('-'))
        {
          const queryRangeMatch = job.salary.match(/^(\d+)-(\d+)$/);
          const [__, queryMin, queryMax] = queryRangeMatch.map(Number);
          if (Math.max(minSalary,queryMin) <= Math.min(maxSalary,queryMax)) {
            return true; 
          } else {
            return false; // 区间无交集
        }
        }
        else{
          const querySalary = Number(job.salary)
          if (querySalary >= minSalary && querySalary <= maxSalary) {
            return true;
          } else {
            return false;
          }
        }
      });
    }
    else{
      jobList = result.data
    }

    return {
      jobs: jobList, // 返回符合条件的岗位列表
    };
  } catch (err) {
    return {
      error: err.message,
    };
  }
}