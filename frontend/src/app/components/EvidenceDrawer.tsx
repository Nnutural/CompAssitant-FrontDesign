import { X, ExternalLink, Copy, Star } from 'lucide-react';
import { DataTag } from './DataTag';

interface Evidence {
  id: string;
  type: 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7';
  title: string;
  source: string;
  url: string;
  excerpt: string;
  updatedAt: string;
  reliability: number;
}

const mockEvidences: Evidence[] = [
  {
    id: '1',
    type: 'D5',
    title: '2024年中国大学生计算机设计大赛',
    source: '教育部',
    url: 'https://example.com/1',
    excerpt: '全国性赛事，涵盖软件应用与开发、微课与教学辅助、物联网应用、大数据、人工智能等多个赛道...',
    updatedAt: '2024-01-15',
    reliability: 5,
  },
  {
    id: '2',
    type: 'D2',
    title: '《网络安全法》最新修订版',
    source: '中国人大网',
    url: 'https://example.com/2',
    excerpt: '加强数据安全和个人信息保护，对关键信息基础设施安全保护提出更高要求...',
    updatedAt: '2024-01-10',
    reliability: 5,
  },
  {
    id: '3',
    type: 'D4',
    title: 'AI大模型安全趋势报告',
    source: '中国信通院',
    url: 'https://example.com/3',
    excerpt: '大模型攻击面分析、提示词注入、数据投毒等新型安全威胁正在成为研究热点...',
    updatedAt: '2024-01-08',
    reliability: 4,
  },
  {
    id: '4',
    type: 'D1',
    title: '腾讯安全岗位招聘',
    source: '腾讯招聘',
    url: 'https://example.com/4',
    excerpt: '招聘网络安全工程师，要求熟悉渗透测试、漏洞挖掘、安全加固等技能...',
    updatedAt: '2024-01-05',
    reliability: 4,
  },
  {
    id: '5',
    type: 'D6',
    title: '挑战杯特等奖作品：智能防护系统',
    source: '挑战杯官网',
    url: 'https://example.com/5',
    excerpt: '基于机器学习的网络入侵检测系统，实现了99.2%的检测准确率...',
    updatedAt: '2023-12-20',
    reliability: 5,
  },
];

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EvidenceDrawer({ isOpen, onClose }: EvidenceDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-[360px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-gray-900">证据链 / Evidence</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {mockEvidences.map((evidence) => (
            <div
              key={evidence.id}
              className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <DataTag type={evidence.type} />
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < evidence.reliability
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-sm font-medium text-gray-900 mb-1">{evidence.title}</h3>
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">{evidence.excerpt}</p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{evidence.source}</span>
                <span>{evidence.updatedAt}</span>
              </div>

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Copy className="w-3 h-3" />
                  复制引用
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-blue-600 hover:bg-brand-blue-50 rounded-lg transition-colors">
                  <ExternalLink className="w-3 h-3" />
                  查看来源
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}