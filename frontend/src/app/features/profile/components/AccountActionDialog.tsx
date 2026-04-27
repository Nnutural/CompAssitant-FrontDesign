import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';
import type { AccountDialogConfig } from '../types';

export function AccountActionDialog({
  config,
  onClose,
  onConfirm,
}: {
  config: AccountDialogConfig | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);

  if (!config) return null;
  const canConfirm = !config.danger || confirmed;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[60] w-[440px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div className="flex gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.danger ? 'bg-red-50 text-red-600' : 'bg-brand-blue-50 text-brand-blue-600'}`}>
              {config.danger ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">{config.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{config.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </header>

        {config.danger && (
          <div className="border-b border-slate-100 p-5">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
              我已确认这是演示注销申请，不会访问真实账户系统
            </label>
          </div>
        )}

        <footer className="flex justify-end gap-2 p-4">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
            取消
          </button>
          <button
            onClick={onConfirm}
            disabled={!canConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${
              config.danger ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-blue-600 hover:bg-brand-blue-700'
            }`}
          >
            {config.confirmLabel}
          </button>
        </footer>
      </div>
    </>
  );
}
