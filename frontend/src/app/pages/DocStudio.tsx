import { FileText, Download, Save } from 'lucide-react';

export function DocStudio() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">写作生成</h1>
        <p className="text-gray-600 mt-1">AI辅助生成竞赛计划书、作品说明等文档</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Wizard Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">生成配置</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                文档类型
              </label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>竞赛计划书</option>
                <option>作品说明书</option>
                <option>PPT大纲</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                关联竞赛
              </label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>挑战杯</option>
                <option>互联网+</option>
                <option>信息安全竞赛</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                参考模板
              </label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>特等奖模板 A</option>
                <option>一等奖模板 B</option>
                <option>经典模板 C</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                团队信息
              </label>
              <input
                type="text"
                placeholder="团队名称"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2"
              />
              <input
                type="text"
                placeholder="成员列表"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            <button className="w-full px-4 py-2 text-sm font-medium text-white bg-brand-blue-600 hover:bg-brand-blue-700 rounded-lg">
              开始生成
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">文档编辑器</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Save className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Outline */}
          <div className="space-y-2 mb-6">
            <div className="font-semibold text-gray-900">文档大纲</div>
            {[
              '1. 项目背景与意义',
              '2. 国内外研究现状',
              '3. 项目创新点',
              '4. 技术方案',
              '5. 实施计划',
              '6. 预期成果',
            ].map((section, i) => (
              <div
                key={i}
                className="p-2 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer"
              >
                {section}
              </div>
            ))}
          </div>

          {/* Content Preview */}
          <div className="border border-gray-200 rounded-lg p-4 min-h-[400px]">
            <h3 className="font-semibold text-gray-900 mb-3">1. 项目背景与意义</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              随着人工智能技术的快速发展，大模型在各个领域得到广泛应用。然而，大模型面临着提示词注入、数据投毒等新型安全威胁...
            </p>
            <p className="text-sm text-gray-600 italic">
              [AI生成内容预览，点击"开始生成"查看完整内容]
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
              导出 Markdown
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
              导出 DOCX
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-brand-blue-600 hover:bg-brand-blue-700 rounded-lg">
              保存到资产库
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}