import { useState } from 'react';
import { Filter, GitCompare, Plus, Calendar, Award, TrendingUp, Eye } from 'lucide-react';
import { DataTag } from '@/app/components/DataTag';

export function Opportunities() {
  const [activeTab, setActiveTab] = useState<'competition' | 'funding'>('competition');
  const [compareList, setCompareList] = useState<string[]>([]);

  const competitions = [
    {
      id: '1',
      name: '全国大学生信息安全竞赛',
      deadline: '2024-03-15',
      level: '国家级',
      track: '网络安全',
      effort: '高',
      matchScore: 95,
      deliverables: ['作品演示', '技术文档', '答辩PPT'],
      templates: 3,
    },
    {
      id: '2',
      name: '中国高校计算机大赛-网络技术挑战赛',
      deadline: '2024-04-20',
      level: '国家级',
      track: 'SDN/NFV',
      effort: '中',
      matchScore: 88,
      deliverables: ['系统实现', '设计文档'],
      templates: 5,
    },
    {
      id: '3',
      name: '挑战杯全国大学生课外学术科技作品竞赛',
      deadline: '2024-05-10',
      level: '国家级',
      track: '科技发明制作',
      effort: '高',
      matchScore: 92,
      deliverables: ['作品实物', '计划书', '展示视频'],
      templates: 12,
    },
  ];

  const toggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter((i) => i !== id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">机会情报</h1>
        <p className="text-gray-600 mt-1">发现最适合您的竞赛和基金项目</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('competition')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'competition'
              ? 'border-brand-blue-600 text-brand-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          竞赛信息
        </button>
        <button
          onClick={() => setActiveTab('funding')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'funding'
              ? 'border-brand-blue-600 text-brand-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          基金项目
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Filter Panel */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-base font-semibold text-gray-900">筛选条件</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                时间窗口
              </label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-600">
                <option>全部</option>
                <option>1个月内</option>
                <option>3个月内</option>
                <option>6个月内</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                方向标签
              </label>
              <div className="space-y-2">
                {['网络安全', '人工智能', '大数据', '物联网', '区块链'].map((tag) => (
                  <label key={tag} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-gray-700">{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                级别
              </label>
              <div className="space-y-2">
                {['国家级', '省级', '校级'].map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                推荐投入
              </label>
              <div className="space-y-2">
                {['低', '中', '高'].map((effort) => (
                  <label key={effort} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-gray-700">{effort}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full px-4 py-2 text-sm font-medium text-white bg-brand-blue-600 hover:bg-brand-blue-700 rounded-lg transition-colors">
              应用筛选
            </button>
          </div>
        </div>

        {/* Competition List */}
        <div className="col-span-2 space-y-4">
          {competitions.map((comp) => (
            <div
              key={comp.id}
              className={`bg-white border rounded-xl p-5 transition-all ${
                compareList.includes(comp.id)
                  ? 'border-brand-blue-600 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-semibold text-gray-900">{comp.name}</h3>
                    <DataTag type="D5" />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{comp.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>{comp.level}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  <span>{comp.matchScore}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-xs text-gray-500">赛道</span>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{comp.track}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">推荐投入</span>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">{comp.effort}</p>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-xs text-gray-500 block mb-2">交付物</span>
                <div className="flex flex-wrap gap-2">
                  {comp.deliverables.map((item, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-brand-blue-50 text-brand-blue-700 text-xs rounded-md"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {comp.templates} 个可复用模板
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCompare(comp.id)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      compareList.includes(comp.id)
                        ? 'bg-brand-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {compareList.includes(comp.id) ? '已加对比' : '加入对比'}
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    查看详情
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium text-white bg-brand-blue-600 hover:bg-brand-blue-700 rounded-lg transition-colors flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    生成计划
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compare Drawer */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <GitCompare className="w-5 h-5 text-gray-600" />
            <h2 className="text-base font-semibold text-gray-900">对比分析</h2>
          </div>

          {compareList.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              <GitCompare className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>请选择最多3个项目进行对比</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                已选择 {compareList.length}/3 个项目
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-2">截止时间对比</h4>
                  {compareList.map((id) => {
                    const comp = competitions.find((c) => c.id === id);
                    return (
                      <div key={id} className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600 truncate">
                          {comp?.name.slice(0, 10)}...
                        </span>
                        <span className="text-xs font-medium">{comp?.deadline}</span>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-2">适配度对比</h4>
                  {compareList.map((id) => {
                    const comp = competitions.find((c) => c.id === id);
                    return (
                      <div key={id} className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">{comp?.matchScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-brand-blue-600 h-2 rounded-full"
                            style={{ width: `${comp?.matchScore}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button className="w-full px-3 py-2 text-sm font-medium text-white bg-brand-blue-600 hover:bg-brand-blue-700 rounded-lg transition-colors">
                详细对比分析
              </button>
              <button
                onClick={() => setCompareList([])}
                className="w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                清空对比
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}