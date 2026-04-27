import { createDefaultDashboard } from './mockData';
import type { InsightItem } from './types';
import { nextFreshnessScore } from './utils';

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function loadPolicyFeedDemo(options?: { fail?: boolean; empty?: boolean }): Promise<InsightItem[]> {
  await delay(650);
  if (options?.fail) {
    throw new Error('演示政策源加载失败');
  }
  if (options?.empty) {
    return [];
  }
  return createDefaultDashboard().policies;
}

export async function refreshDataSourceDemo(currentScore: number, fail = false) {
  await delay(750 + Math.floor(Math.random() * 220));
  if (fail) {
    throw new Error('演示刷新失败');
  }
  return {
    freshnessScore: nextFreshnessScore(currentScore),
    lastSyncText: '刚刚同步',
  };
}
