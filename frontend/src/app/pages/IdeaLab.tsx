import { Lightbulb, Sparkles, BookOpen, Database } from 'lucide-react';
import { DataTag } from '@/app/components/DataTag';

export function IdeaLab() {
  const ideaPool = [
    {
      id: '1',
      title: 'AI大模型提示词注入防护系统',
      source: ['D4', 'D2'],
      innovation: '高',
      feasibility: '中',
    },
    {
      id: '2',
      title: '基于联邦学习的隐私保护数据共享平台',
      source: ['D3', 'D2'],
      innovation: '中',
      feasibility: '高',
    },
    {
      id: '3',
      title: '智能合约安全审计自动化工具',
      source: ['D4', 'D6'],
      innovation: '中',
      feasibility: '高',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">选题推演</h1>
        <p className="text-gray-600 mt-1">在创意画布上构建和完善您的研究选题</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Idea Pool */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h2 className="text-base font-semibold text-gray-900">选题卡池</h2>
          </div>

          <div className="space-y-3">
            {ideaPool.map((idea) => (
              <div
                key={idea.id}
                className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
              >
                <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                  {idea.title}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  {idea.source.map((s) => (
                    <DataTag key={s} type={s as any} />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">创新度:</span>
                    <span className="ml-1 font-medium">{idea.innovation}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">可行性:</span>
                    <span className="ml-1 font-medium">{idea.feasibility}</span>
                  </div>
                </div>
              </div>
            ))}

            <button className="w-full py-2 text-sm font-medium text-brand-blue-600 hover:bg-brand-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4" />
              AI生成更多
            </button>
          </div>
        </div>

        {/* Idea Canvas */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">创意画布</h2>

          <div className="grid grid-cols-2 gap-4">
            {[
              { title: '问题定义', placeholder: '要解决什么问题?' },
              { title: '目标用户', placeholder: '谁会使用这个方案?' },
              { title: '创新点', placeholder: '与现有方案的差异?' },
              { title: '可验证假设', placeholder: '如何证明有效性?' },
              { title: '数据可得性', placeholder: '数据来源是什么?' },
              { title: '技术路线', placeholder: '采用什么技术?' },
              { title: '预期成果', placeholder: '能产出什么?' },
              { title: '风险合规', placeholder: '有哪些风险?' },
            ].map((section, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">{section.title}</h3>
                <textarea
                  placeholder={section.placeholder}
                  className="w-full h-20 px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue-600"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              保存草稿
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-brand-blue-600 hover:bg-brand-blue-700 rounded-lg transition-colors">
              导出到写作生成
            </button>
          </div>
        </div>

        {/* Evidence Panel */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-gray-600" />
            <h2 className="text-base font-semibold text-gray-900">引用证据</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="p-3 bg-brand-blue-50 border border-brand-blue-100 rounded-lg">
              <DataTag type="D4" />
              <p className="text-gray-700 mt-2 mb-1 font-medium">AI安全趋势报告</p>
              <p className="text-gray-600 text-xs line-clamp-2">
                提示词注入攻击已成为大模型安全的主要威胁之一...
              </p>
              <button className="text-brand-blue-600 text-xs mt-2 hover:underline">
                插入引用
              </button>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <DataTag type="D2" />
              <p className="text-gray-700 mt-2 mb-1 font-medium">AI治理白皮书</p>
              <p className="text-gray-600 text-xs line-clamp-2">
                明确要求加强大模型安全审查和监管...
              </p>
              <button className="text-green-600 text-xs mt-2 hover:underline">
                插入引用
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}