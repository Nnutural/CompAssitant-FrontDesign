import { User, Target, Clock, TrendingUp, Award, Calendar } from 'lucide-react';
import { DataTag } from '@/app/components/DataTag';

export function Recommender() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">方向推荐</h1>
        <p className="text-gray-600 mt-1">基于您的背景和目标,为您推荐最适合的研究方向</p>
      </div>

      {/* User Profile */}
      <div className="bg-gradient-to-r from-brand-blue-600 to-brand-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">您的画像</h2>
            <div className="grid grid-cols-3 gap-6 mt-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4" />
                  <span className="text-sm opacity-90">当前阶段</span>
                </div>
                <p className="text-lg font-semibold">本科三年级</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4" />
                  <span className="text-sm opacity-90">主要目标</span>
                </div>
                <p className="text-lg font-semibold">竞赛获奖 + 保研</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm opacity-90">时间窗口</span>
                </div>
                <p className="text-lg font-semibold">12个月</p>
              </div>
            </div>
          </div>
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors">
            编辑画像
          </button>
        </div>
      </div>

      {/* Recommended Tracks */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">推荐研究方向</h2>
        <div className="space-y-4">
          {[
            {
              title: 'AI大模型安全',
              score: 95,
              reasons: [
                '教育部重点支持领域,政策导向明确（D2）',
                '国内外顶会论文数量增长300%,研究热度极高（D4）',
                '相关企业岗位需求旺盛,就业前景好（D1）',
              ],
              tags: ['D2', 'D4', 'D1'],
              competitions: 5,
              funding: 3,
            },
            {
              title: '区块链安全与隐私保护',
              score: 88,
              reasons: [
                '国家区块链创新应用试点持续推进（D2）',
                '金融、供应链等领域应用案例丰富（D3）',
                '多个竞赛设有专项赛道（D5）',
              ],
              tags: ['D2', 'D3', 'D5'],
              competitions: 8,
              funding: 2,
            },
            {
              title: '物联网入侵检测系统',
              score: 82,
              reasons: [
                '智能制造、智慧城市建设带来大量需求（D3）',
                '技术成熟度适中,易于快速出成果',
                '历史获奖案例丰富,有成功经验可借鉴（D6）',
              ],
              tags: ['D3', 'D6'],
              competitions: 6,
              funding: 4,
            },
          ].map((track, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{track.title}</h3>
                  <div className="flex items-center gap-2">
                    {track.tags.map((tag) => (
                      <DataTag key={tag} type={tag as any} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                  <div>
                    <div className="text-xs opacity-75">推荐度</div>
                    <div className="text-xl font-bold">{track.score}%</div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">推荐理由</h4>
                <ul className="space-y-1.5">
                  {track.reasons.map((reason, j) => (
                    <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-brand-blue-600 mt-1">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>{track.competitions} 个相关竞赛</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{track.funding} 个基金项目</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    查看证据
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-brand-blue-600 hover:bg-brand-blue-700 rounded-lg transition-colors">
                    查看路线图
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">行动路线图（基于"AI大模型安全"）</h2>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              8周计划
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-white bg-brand-blue-600 rounded-lg">
              12周计划
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-6">
            {[
              {
                week: 'Week 1-2',
                title: '基础知识储备',
                tasks: ['学习大模型基础原理', '了解常见安全威胁类型', '阅读2-3篇经典论文'],
              },
              {
                week: 'Week 3-4',
                title: '选题调研',
                tasks: ['分析当前研究热点', '确定具体研究问题', '完成文献综述初稿'],
              },
              {
                week: 'Week 5-8',
                title: '方案设计',
                tasks: ['设计技术方案', '搭建实验环境', '完成初步实验验证'],
              },
              {
                week: 'Week 9-12',
                title: '成果输出',
                tasks: ['撰写竞赛计划书', '准备演示PPT', '提交参赛作品'],
              },
            ].map((phase, i) => (
              <div key={i} className="relative pl-12">
                <div className="absolute left-0 w-8 h-8 bg-brand-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {i + 1}
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">{phase.title}</h3>
                    <span className="text-xs text-gray-500">{phase.week}</span>
                  </div>
                  <ul className="space-y-1">
                    {phase.tasks.map((task, j) => (
                      <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-brand-blue-600 mt-1">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-6 pt-6 border-t border-gray-100">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            导出路线图
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-brand-blue-600 hover:bg-brand-blue-700 rounded-lg transition-colors">
            写入计划面板
          </button>
        </div>
      </div>
    </div>
  );
}