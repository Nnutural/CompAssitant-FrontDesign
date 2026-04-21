import { FileText, Presentation, Code, File, Download } from 'lucide-react';

export function Assets() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">成果资产库</h1>
        <p className="text-gray-600 mt-1">管理您的文档、演示、代码等成果资产</p>
      </div>

      <div className="flex items-center gap-4 border-b border-gray-200">
        {['文档', '演示', '代码', '证明材料'].map((tab) => (
          <button
            key={tab}
            className="px-4 py-2 text-sm font-medium border-b-2 border-brand-blue-600 text-brand-blue-600"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: FileText, name: '挑战杯计划书 v2.0', version: 'v2.0', date: '2024-01-15' },
          { icon: Presentation, name: '答辩PPT', version: 'v1.5', date: '2024-01-14' },
          { icon: Code, name: '系统源代码', version: 'v1.0', date: '2024-01-13' },
          { icon: File, name: '获奖证书', version: '-', date: '2024-01-10' },
        ].map((asset, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <asset.icon className="w-8 h-8 text-gray-400" />
              <button className="p-1 hover:bg-gray-100 rounded">
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">{asset.name}</h3>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{asset.version}</span>
              <span>{asset.date}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">提交清单（挑战杯）</h2>
        <div className="space-y-2">
          {[
            { item: '项目计划书', status: '已完成' },
            { item: '答辩PPT', status: '已完成' },
            { item: '演示视频', status: '进行中' },
            { item: '源代码', status: '待开始' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-900">{item.item}</span>
              <span className={`text-xs px-2 py-1 rounded ${
                item.status === '已完成' ? 'bg-green-100 text-green-700' :
                item.status === '进行中' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}