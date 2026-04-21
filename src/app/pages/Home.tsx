import { TrendingUp, Calendar, FileText, Database, Plus, Eye, ArrowRight } from 'lucide-react';
import { DataTag } from '@/app/components/DataTag';

export function Home() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">总览</h1>
        <p className="text-gray-600 mt-1">欢迎回来！这是您的工作台。</p>
      </div>

      {/* Today's Key Actions */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-brand-blue-50 border border-brand-blue-100 rounded-xl">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-brand-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-brand-blue-600" />
            </div>
            <span className="text-xs font-medium text-brand-blue-600">紧急</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            完成挑战杯计划书初稿
          </h3>
          <p className="text-xs text-gray-600">截止日期：3天后</p>
        </div>

        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600">推荐</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            查看最新竞赛推荐
          </h3>
          <p className="text-xs text-gray-600">5个新机会待审阅</p>
        </div>

        <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-purple-600">待办</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            更新研究方向文档
          </h3>
          <p className="text-xs text-gray-600">基于最新趋势数据</p>
        </div>
      </div>

      {/* Deadline Reminders & Recommended Actions */}
      <div className="grid grid-cols-3 gap-6">
        {/* Deadline Reminders */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">截止提醒</h2>
            <DataTag type="D5" />
          </div>
          <div className="space-y-3">
            {[
              { name: '全国大学生信息安全竞赛', days: 15, level: '国家级' },
              { name: '蓝桥杯软件类省赛', days: 28, level: '省级' },
              { name: '中国高校计算机大赛', days: 45, level: '国家级' },
            ].map((item, i) => (
              <div key={i} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                  <p className="text-xs text-gray-600 mt-0.5">{item.level}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-600">{item.days}天</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Three Things */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">今日推荐三件事</h2>
          <div className="space-y-3">
            <div className="p-4 border border-gray-200 rounded-xl hover:border-brand-blue-600 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  聚焦"AI大模型安全"研究方向
                </h3>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                  <span>匹配度</span>
                  <span className="font-bold">92%</span>
                </div>
              </div>
              <div className="space-y-1 text-xs text-gray-600 mb-3">
                <p>• 符合教育部重点支持领域</p>
                <p>• 国内外顶会论文数量增长300%</p>
                <p>• 相关企业岗位需求旺盛（D1）</p>
              </div>
              <div className="flex items-center gap-2">
                <DataTag type="D4" />
                <DataTag type="D2" />
                <DataTag type="D1" />
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <button className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  查看证据
                </button>
                <button className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-brand-blue-600 hover:bg-brand-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1">
                  加入计划
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-xl hover:border-brand-blue-600 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  申报挑战杯"区块链溯源"选题
                </h3>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                  <span>匹配度</span>
                  <span className="font-bold">88%</span>
                </div>
              </div>
              <div className="space-y-1 text-xs text-gray-600 mb-3">
                <p>• 历史获奖案例丰富（D6）</p>
                <p>• 技术成熟度适中，可落地性强</p>
                <p>• 与现有课程研究内容高度相关</p>
              </div>
              <div className="flex items-center gap-2">
                <DataTag type="D5" />
                <DataTag type="D6" />
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <button className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  查看证据
                </button>
                <button className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-brand-blue-600 hover:bg-brand-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1">
                  加入计划
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Outputs & Data Freshness */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Outputs */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">最近生成物</h2>
            <button className="text-sm text-brand-blue-600 hover:text-brand-blue-700 flex items-center gap-1">
              查看全部
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                title: '挑战杯计划书大纲 v1.2',
                type: '计划书',
                date: '2024-01-15',
                status: '草稿',
              },
              {
                title: 'AI安全研究路线图',
                type: '路线图',
                date: '2024-01-14',
                status: '已完成',
              },
              {
                title: '演示PPT结构',
                type: 'PPT',
                date: '2024-01-13',
                status: '待审阅',
              },
              {
                title: '文献综述初稿',
                type: '文档',
                date: '2024-01-12',
                status: '已完成',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                    {item.type}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">{item.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{item.date}</span>
                  <span>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Freshness */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-gray-600" />
            <h2 className="text-base font-semibold text-gray-900">数据新鲜度</h2>
          </div>
          <div className="space-y-3">
            {[
              { type: 'D1', label: '招聘信息', lastUpdate: '2小时前', status: 'fresh' },
              { type: 'D2', label: '政策法规', lastUpdate: '1天前', status: 'fresh' },
              { type: 'D3', label: '社会热点', lastUpdate: '3小时前', status: 'fresh' },
              { type: 'D4', label: '热点趋势', lastUpdate: '5小时前', status: 'fresh' },
              { type: 'D5', label: '竞赛信息', lastUpdate: '1小时前', status: 'fresh' },
              { type: 'D6', label: '获奖模板', lastUpdate: '3天前', status: 'warn' },
              { type: 'D7', label: '基金项目', lastUpdate: '7天前', status: 'outdated' },
            ].map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DataTag type={item.type as any} />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.status === 'fresh'
                        ? 'bg-green-500'
                        : item.status === 'warn'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <span className="text-xs text-gray-500">{item.lastUpdate}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-3 py-2 text-sm font-medium text-brand-blue-600 hover:bg-brand-blue-50 rounded-lg transition-colors">
            刷新全部数据
          </button>
        </div>
      </div>
    </div>
  );
}