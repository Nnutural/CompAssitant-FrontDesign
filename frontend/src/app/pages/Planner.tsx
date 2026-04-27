// Legacy task prototype. /tasks is the active implementation; do not extend this page.
import { useState } from 'react';
import { Calendar, List, CheckCircle2, AlertCircle } from 'lucide-react';

export function Planner() {
  const [view, setView] = useState<'kanban' | 'timeline' | 'checklist'>('kanban');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">计划与任务</h1>
          <p className="text-gray-600 mt-1">管理您的研究任务和竞赛进度</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('kanban')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              view === 'kanban'
                ? 'bg-brand-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            看板视图
          </button>
          <button
            onClick={() => setView('timeline')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              view === 'timeline'
                ? 'bg-brand-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            时间线
          </button>
          <button
            onClick={() => setView('checklist')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              view === 'checklist'
                ? 'bg-brand-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            清单
          </button>
        </div>
      </div>

      {view === 'kanban' && (
        <div className="grid grid-cols-4 gap-4">
          {['待办', '进行中', '待审阅', '已完成'].map((status) => (
            <div key={status} className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-4">{status}</h3>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      完成文献综述
                    </h4>
                    <div className="text-xs text-gray-600 mb-2">
                      <div>负责人: 张三</div>
                      <div>截止: 2024-02-01</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-brand-blue-100 text-brand-blue-700 text-xs rounded">
                        高优先级
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'timeline' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-24 shrink-0 text-sm text-gray-600">2024-02-{i.toString().padStart(2, '0')}</div>
                <div className="flex-1">
                  <div className="bg-brand-blue-50 border border-brand-blue-100 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-gray-900">里程碑任务 {i}</h4>
                    <p className="text-xs text-gray-600 mt-1">相关描述信息</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'checklist' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="space-y-3">
            {[
              { task: '完成文献调研', done: true },
              { task: '撰写计划书大纲', done: true },
              { task: '完成技术方案设计', done: false },
              { task: '准备答辩材料', done: false },
            ].map((item, i) => (
              <label key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input type="checkbox" checked={item.done} className="w-5 h-5 rounded border-gray-300" readOnly />
                <span className={`text-sm ${item.done ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {item.task}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
