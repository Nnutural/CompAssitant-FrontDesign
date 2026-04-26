import { RotateCcw, Save, Sparkles } from 'lucide-react';
import type { Dispatch } from 'react';
import type { CareerAction } from '../store';
import type { CareerCity, CareerWorkbench, JobDirection } from '../types';
import { CAREER_CITIES, JOB_DIRECTIONS } from '../types';

export function CareerToolbar({
  workbench,
  dispatch,
  quickLoading,
  onSave,
  onQuickGenerate,
  onReset,
}: {
  workbench: CareerWorkbench;
  dispatch: Dispatch<CareerAction>;
  quickLoading: boolean;
  onSave: () => void;
  onQuickGenerate: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <select
        value={workbench.selectedDirection}
        onChange={(event) =>
          dispatch({ type: 'setSelectedDirection', direction: event.target.value as '全部' | JobDirection })
        }
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
      >
        <option value="全部">全部方向</option>
        {JOB_DIRECTIONS.map((direction) => (
          <option key={direction} value={direction}>
            {direction}
          </option>
        ))}
      </select>
      <select
        value={workbench.selectedCity}
        onChange={(event) =>
          dispatch({ type: 'setSelectedCity', city: event.target.value as '全部' | CareerCity })
        }
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
      >
        <option value="全部">全部城市</option>
        {CAREER_CITIES.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onQuickGenerate}
        disabled={quickLoading}
        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-1.5 text-sm text-white hover:bg-brand-blue-700 disabled:opacity-70"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {quickLoading ? '生成中...' : '快速生成路径'}
      </button>
      <button
        type="button"
        onClick={onSave}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
      >
        <Save className="h-3.5 w-3.5" />
        保存
      </button>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        重置演示
      </button>
    </div>
  );
}
