import { Database, RefreshCw, Search } from 'lucide-react';
import { DataTag } from '@/app/components/DataTag';

export function DataHub() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">数据中心</h1>
          <p className="text-gray-600 mt-1">管理和查看所有数据源</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-blue-600 hover:bg-brand-blue-700 rounded-lg">
          <RefreshCw className="w-4 h-4" />
          刷新全部
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Data Type Navigation */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">数据类型</h2>
          <div className="space-y-2">
            {[
              { type: 'D1', label: '招聘信息', count: 245 },
              { type: 'D2', label: '政策法规', count: 128 },
              { type: 'D3', label: '社会热点', count: 332 },
              { type: 'D4', label: '热点趋势', count: 189 },
              { type: 'D5', label: '竞赛信息', count: 95 },
              { type: 'D6', label: '获奖模板', count: 67 },
              { type: 'D7', label: '基金项目', count: 43 },
            ].map((item) => (
              <button
                key={item.type}
                className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <DataTag type={item.type as any} />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <span className="text-xs text-gray-500">{item.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Data Overview & Table */}
        <div className="col-span-3 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: '总数据量', value: '1,099', trend: '+12%' },
              { label: '今日更新', value: '45', trend: '+8%' },
              { label: '覆盖度', value: '94%', trend: '+2%' },
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-green-600 mt-1">{stat.trend}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索数据..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr className="text-left">
                    <th className="pb-3 font-medium text-gray-700">类型</th>
                    <th className="pb-3 font-medium text-gray-700">标题</th>
                    <th className="pb-3 font-medium text-gray-700">来源</th>
                    <th className="pb-3 font-medium text-gray-700">更新时间</th>
                    <th className="pb-3 font-medium text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-3">
                        <DataTag type="D5" />
                      </td>
                      <td className="py-3 text-gray-900">全国大学生信息安全竞赛</td>
                      <td className="py-3 text-gray-600">教育部</td>
                      <td className="py-3 text-gray-600">2024-01-15</td>
                      <td className="py-3">
                        <button className="text-brand-blue-600 hover:underline">查看</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}