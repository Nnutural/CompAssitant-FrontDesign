type DataType = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7';

const dataTypes: Record<DataType, { label: string; color: string }> = {
  D1: { label: 'D1 职位', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  D2: { label: 'D2 政策', color: 'bg-brand-blue-100 text-brand-blue-700 border-brand-blue-100' },
  D3: { label: 'D3 学术', color: 'bg-green-100 text-green-700 border-green-200' },
  D4: { label: 'D4 报告', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  D5: { label: 'D5 赛事', color: 'bg-red-100 text-red-700 border-red-200' },
  D6: { label: 'D6 作品', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  D7: { label: 'D7 工具', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
};

interface DataTagProps {
  type: DataType;
  showFull?: boolean;
}

export function DataTag({ type, showFull = false }: DataTagProps) {
  const config = dataTypes[type];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${config.color}`}
    >
      {showFull ? config.label : type}
    </span>
  );
}