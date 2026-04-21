import { Briefcase, Target, TrendingUp } from 'lucide-react';

export function Careers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">就业洞察</h1>
        <p className="text-gray-600 mt-1">分析岗位需求，规划职业发展路径</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[
          { title: '网络安全工程师', company: '腾讯', skills: ['渗透测试', '漏洞挖掘', 'Python'], match: 85 },
          { title: '安全研究员', company: '阿里巴巴', skills: ['逆向分析', '威胁情报', 'C/C++'], match: 78 },
          { title: 'AI安全专家', company: '字节跳动', skills: ['大模型安全', '对抗样本', 'PyTorch'], match: 92 },
        ].map((job, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <Briefcase className="w-6 h-6 text-gray-400" />
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                {job.match}% 匹配
              </span>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">{job.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{job.company}</p>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span key={skill} className="px-2 py-1 bg-brand-blue-50 text-brand-blue-700 text-xs rounded">
                  {skill}
                </span>
              ))}
            </div>
            <button className="w-full mt-4 px-3 py-2 text-sm font-medium text-brand-blue-600 hover:bg-brand-blue-50 rounded-lg transition-colors">
              查看详情
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">技能差距分析</h2>
        <div className="space-y-4">
          {[
            { skill: '渗透测试', current: 70, required: 90 },
            { skill: '大模型安全', current: 60, required: 85 },
            { skill: 'Python开发', current: 80, required: 85 },
          ].map((item) => (
            <div key={item.skill}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{item.skill}</span>
                <span className="text-xs text-gray-500">
                  当前 {item.current}% / 要求 {item.required}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-brand-blue-600 h-2 rounded-full" style={{ width: `${item.current}%` }} />
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-brand-blue-600 hover:bg-brand-blue-700 rounded-lg">
          生成训练计划
        </button>
      </div>
    </div>
  );
}