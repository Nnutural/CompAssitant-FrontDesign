import { Download, FileSearch, PackageCheck, PlusCircle } from 'lucide-react';
import { useMemo, useState, type Dispatch, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Card, Tag } from '@/app/components/PageShell';
import type { ProfileAction } from '../store';
import type { ProfileWorkspace, SubmitChecklist, SubmitChecklistItem } from '../types';
import {
  activeAssets,
  buildChecklistMarkdown,
  calculateChecklistCompletionRate,
  checklistStatusLabels,
  checklistStatusTones,
  downloadTextFile,
  formatDate,
  formatDateTime,
  getChecklistMissingItems,
} from '../utils';
import { ProfileEmptyState } from './ProfileEmptyState';
import { SubmitPackageDrawer } from './SubmitPackageDrawer';

export function SubmitChecklistPanel({
  workspace,
  dispatch,
}: {
  workspace: ProfileWorkspace;
  dispatch: Dispatch<ProfileAction>;
}) {
  const assets = activeAssets(workspace).filter((asset) => !asset.archived);
  const selectedChecklist = useMemo(
    () => workspace.submitChecklists.find((checklist) => checklist.id === workspace.selectedChecklistId) ?? workspace.submitChecklists[0],
    [workspace.selectedChecklistId, workspace.submitChecklists],
  );
  const [missingItems, setMissingItems] = useState<SubmitChecklistItem[]>([]);
  const [packageChecklist, setPackageChecklist] = useState<SubmitChecklist | null>(null);

  if (!selectedChecklist) {
    return <ProfileEmptyState title="暂无提交清单" description="当前演示数据中没有可维护的提交场景。" />;
  }

  const missingRequired = getChecklistMissingItems(selectedChecklist);
  const completionRate = calculateChecklistCompletionRate(selectedChecklist.items);

  const checkMissing = () => {
    setMissingItems(missingRequired);
    toast.success('缺失项检查完成');
  };

  const recordSubmission = () => {
    dispatch({
      type: 'addSubmitHistory',
      checklistId: selectedChecklist.id,
      history: {
        id: `submit-${Date.now()}`,
        createdAt: new Date().toISOString(),
        summary: `${selectedChecklist.name}检查：已准备 ${selectedChecklist.items.filter((item) => item.status === 'ready').length} 项，缺失必交 ${missingRequired.length} 项`,
        readyCount: selectedChecklist.items.filter((item) => item.status === 'ready').length,
        missingCount: missingRequired.length,
      },
    });
    toast.success('提交记录已保存');
  };

  return (
    <>
      <div className="space-y-4">
        <Card title="提交清单" subtitle="切换场景、绑定资产、校验缺失项并生成提交包">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {workspace.submitChecklists.map((checklist) => (
                <button
                  key={checklist.id}
                  onClick={() => dispatch({ type: 'selectChecklist', checklistId: checklist.id })}
                  className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                    checklist.id === selectedChecklist.id
                      ? 'bg-brand-blue-600 text-white'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {checklist.name}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <ActionButton onClick={checkMissing} icon={<FileSearch className="h-4 w-4" />}>检查缺失项</ActionButton>
              <ActionButton onClick={() => setPackageChecklist(selectedChecklist)} icon={<PackageCheck className="h-4 w-4" />}>生成提交包</ActionButton>
              <ActionButton
                onClick={() => {
                  downloadTextFile(`${selectedChecklist.name}-提交清单.md`, buildChecklistMarkdown(selectedChecklist, assets));
                  toast.success('已导出提交清单');
                }}
                icon={<Download className="h-4 w-4" />}
              >
                导出清单
              </ActionButton>
              <ActionButton onClick={recordSubmission} icon={<PlusCircle className="h-4 w-4" />}>记录提交</ActionButton>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <Card title={selectedChecklist.name} subtitle={`${selectedChecklist.scenario} · 截止 ${formatDate(selectedChecklist.deadline)}`}>
            <div className="grid grid-cols-3 gap-3">
              <Metric label="完成率" value={`${completionRate}%`} />
              <Metric label="缺失必交" value={missingRequired.length} />
              <Metric label="材料项" value={selectedChecklist.items.length} />
            </div>
            <div className="mt-4 h-2 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-blue-600" style={{ width: `${completionRate}%` }} />
            </div>
            {missingItems.length > 0 && (
              <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-3">
                <p className="text-sm font-medium text-amber-800">缺失项</p>
                <ul className="mt-2 space-y-1 text-sm text-amber-700">
                  {missingItems.map((item) => <li key={item.id}>{item.title}</li>)}
                </ul>
              </div>
            )}
          </Card>

          <Card title="提交记录" subtitle="用于演示每次提交包检查结果">
            {selectedChecklist.submitHistory.length === 0 ? (
              <ProfileEmptyState title="暂无提交记录" description="点击“记录提交”后会在这里追加一条记录。" />
            ) : (
              <ul className="space-y-2">
                {selectedChecklist.submitHistory.map((item) => (
                  <li key={item.id} className="rounded-lg border border-slate-100 p-3">
                    <p className="text-sm font-medium text-slate-800">{item.summary}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDateTime(item.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card title="材料项绑定" subtitle={assets.length ? '选择资产并维护准备状态' : '当前没有可绑定资产'}>
          {assets.length === 0 ? (
            <ProfileEmptyState title="暂无可绑定资产" description="请先到资产库上传或生成资产。" />
          ) : (
            <div className="space-y-3">
              {selectedChecklist.items.map((item) => (
                <ChecklistItemRow
                  key={item.id}
                  item={item}
                  checklistId={selectedChecklist.id}
                  assets={assets}
                  dispatch={dispatch}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      <SubmitPackageDrawer
        checklist={packageChecklist}
        assets={assets}
        onClose={() => setPackageChecklist(null)}
        onDownload={(content) => {
          if (!packageChecklist) return;
          downloadTextFile(`${packageChecklist.name}-提交包摘要.md`, content);
          toast.success('已导出提交包摘要');
        }}
      />
    </>
  );
}

function ChecklistItemRow({
  item,
  checklistId,
  assets,
  dispatch,
}: {
  item: SubmitChecklistItem;
  checklistId: string;
  assets: ReturnType<typeof activeAssets>;
  dispatch: Dispatch<ProfileAction>;
}) {
  const boundAsset = assets.find((asset) => asset.id === item.boundAssetId);
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-slate-900">{item.title}</p>
            <Tag tone={item.requirement === '必交' ? 'red' : item.requirement === '建议' ? 'amber' : 'default'}>{item.requirement}</Tag>
            <Tag tone={checklistStatusTones[item.status]}>{checklistStatusLabels[item.status]}</Tag>
          </div>
          <p className="mt-1 text-xs text-slate-500">{boundAsset ? `已绑定：${boundAsset.title}` : '未绑定资产'}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-[220px_120px_auto]">
          <select
            value={item.boundAssetId ?? ''}
            onChange={(event) => {
              const assetId = event.target.value;
              if (assetId) {
                dispatch({ type: 'bindChecklistAsset', checklistId, itemId: item.id, assetId });
                toast.success('已绑定资产');
              } else {
                dispatch({ type: 'unbindChecklistAsset', checklistId, itemId: item.id });
                toast.success('已解除绑定');
              }
            }}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
          >
            <option value="">选择资产</option>
            {assets.map((asset) => <option key={asset.id} value={asset.id}>{asset.title}</option>)}
          </select>
          <select
            value={item.status}
            onChange={(event) => {
              dispatch({
                type: 'updateChecklistItemStatus',
                checklistId,
                itemId: item.id,
                status: event.target.value as SubmitChecklistItem['status'],
              });
              toast.success('材料状态已更新');
            }}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
          >
            <option value="ready">已准备</option>
            <option value="reviewing">准备中</option>
            <option value="missing">缺失</option>
          </select>
          <button
            onClick={() => {
              dispatch({ type: 'unbindChecklistAsset', checklistId, itemId: item.id });
              toast.success('已解除绑定');
            }}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            解除
          </button>
        </div>
      </div>
      <textarea
        value={item.note}
        onChange={(event) => dispatch({ type: 'updateChecklistItemNote', checklistId, itemId: item.id, note: event.target.value })}
        placeholder="添加备注"
        rows={2}
        className="mt-3 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm leading-6 outline-none focus:border-brand-blue-400"
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function ActionButton({
  children,
  icon,
  onClick,
}: {
  children: ReactNode;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
    >
      {icon}
      {children}
    </button>
  );
}
