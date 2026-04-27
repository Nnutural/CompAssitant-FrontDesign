import { UploadCloud } from 'lucide-react';
import { useMemo, useState, type Dispatch } from 'react';
import { toast } from 'sonner';
import { Card, Tag } from '@/app/components/PageShell';
import { createMockAsset, defaultAssetFilters, type ProfileAction } from '../store';
import type { AssetFilters, ProfileAsset, ProfileAssetType, ProfileWorkspace } from '../types';
import {
  activeAssets,
  assetStatusLabels,
  assetStatusTones,
  assetTypeLabels,
  filterAndSortAssets,
  formatDateTime,
} from '../utils';
import { AssetPreviewDrawer } from './AssetPreviewDrawer';
import { AssetRowActions } from './AssetVaultPanel';
import { AssetVersionDrawer } from './AssetVersionDrawer';
import { ProfileEmptyState } from './ProfileEmptyState';

const titleMap: Record<ProfileAssetType, string> = {
  document: '文档资产',
  slides: '演示资产',
  code: '代码资产',
  proof: '证明材料',
};

export function AssetListPanel({
  assetType,
  workspace,
  dispatch,
  onNavigate,
}: {
  assetType: ProfileAssetType;
  workspace: ProfileWorkspace;
  dispatch: Dispatch<ProfileAction>;
  onNavigate: (path: string, message: string) => void;
}) {
  const assets = activeAssets(workspace).filter((asset) => asset.type === assetType);
  const [filters, setFilters] = useState<AssetFilters>({ ...defaultAssetFilters, type: assetType });
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [versionAsset, setVersionAsset] = useState<ProfileAsset | null>(null);

  const filteredAssets = useMemo(
    () => filterAndSortAssets(assets, { ...filters, type: assetType }),
    [assets, assetType, filters],
  );
  const selectedAsset = assets.find((asset) => asset.id === selectedAssetId) ?? null;

  const uploadMock = () => {
    dispatch({ type: 'addAsset', asset: createMockAsset(assetType) });
    toast.success('已模拟上传资产');
  };

  return (
    <>
      <Card
        title={titleMap[assetType]}
        subtitle="按类型复用统一资产能力，支持预览、版本、导出、收藏和归档"
        right={
          <button
            onClick={uploadMock}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-blue-700"
          >
            <UploadCloud className="h-4 w-4" />
            上传模拟
          </button>
        }
      >
        <div className="grid gap-3 md:grid-cols-[1fr_160px_160px]">
          <input
            value={filters.query}
            onChange={(event) => setFilters({ ...filters, query: event.target.value })}
            placeholder={`搜索${titleMap[assetType]}`}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
          />
          <select
            value={filters.status}
            onChange={(event) => setFilters({ ...filters, status: event.target.value as AssetFilters['status'] })}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
          >
            <option value="all">全部状态</option>
            <option value="draft">草稿</option>
            <option value="reviewing">审核中</option>
            <option value="completed">已完成</option>
            <option value="archived">已归档</option>
          </select>
          <select
            value={filters.sort}
            onChange={(event) => setFilters({ ...filters, sort: event.target.value as AssetFilters['sort'] })}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
          >
            <option value="updated">最近更新</option>
            <option value="created">创建时间</option>
            <option value="status">状态</option>
          </select>
          <label className="inline-flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={filters.includeArchived}
              onChange={(event) => setFilters({ ...filters, includeArchived: event.target.checked })}
            />
            包含归档资产
          </label>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="mt-4">
            <ProfileEmptyState title="暂无资产" description="可以点击上传模拟创建一条演示资产。" />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-[900px] w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-500">
                  <th className="py-3 text-left font-normal">{assetType === 'code' ? '仓库 / 资产' : '名称'}</th>
                  <th className="text-left font-normal">重点信息</th>
                  <th className="text-left font-normal">来源</th>
                  <th className="text-left font-normal">状态</th>
                  <th className="text-left font-normal">更新时间</th>
                  <th className="text-right font-normal">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50">
                    <td className="py-3 pr-3">
                      <div className="font-medium text-slate-900">{asset.title}</div>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        <Tag tone="blue">{assetTypeLabels[asset.type]}</Tag>
                        <Tag>{asset.format}</Tag>
                        <Tag>{asset.version}</Tag>
                      </div>
                    </td>
                    <td className="max-w-[260px] text-slate-600">{detailText(asset)}</td>
                    <td className="text-slate-500">{asset.sourceModule}</td>
                    <td><Tag tone={assetStatusTones[asset.status]}>{assetStatusLabels[asset.status]}</Tag></td>
                    <td className="text-slate-500">{formatDateTime(asset.updatedAt)}</td>
                    <td>
                      <AssetRowActions
                        asset={asset}
                        dispatch={dispatch}
                        onPreview={() => {
                          setSelectedAssetId(asset.id);
                          toast.success('已打开资产预览');
                        }}
                        onNavigate={onNavigate}
                        onShowVersions={() => {
                          setVersionAsset(asset);
                          toast.success('已打开版本历史');
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <AssetPreviewDrawer
        asset={selectedAsset}
        dispatch={dispatch}
        onClose={() => setSelectedAssetId(null)}
        onNavigate={onNavigate}
        onShowVersions={setVersionAsset}
      />
      <AssetVersionDrawer asset={versionAsset} onClose={() => setVersionAsset(null)} />
    </>
  );
}

function detailText(asset: ProfileAsset): string {
  if (asset.type === 'document') {
    return `${asset.metadata.wordCount ?? '未知'} 字 · ${asset.summary}`;
  }
  if (asset.type === 'slides') {
    return `${asset.metadata.slideCount ?? '未知'} 页 · ${asset.metadata.scene ?? '演示场景'}`;
  }
  if (asset.type === 'code') {
    return `${asset.metadata.language ?? 'Unknown'} · ${asset.metadata.contributions ?? asset.summary}`;
  }
  return `${asset.metadata.issuer ?? '证明机构'} · ${asset.metadata.certificateNo ?? asset.metadata.validUntil ?? '材料元数据'}`;
}
