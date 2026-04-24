import { apiGet, apiPost } from '@/lib/api';
import type {
  CompareItem,
  DetailResponse,
  FundItem,
  InnovationItem,
  LabItem,
  NewsItem,
  PaperItem,
  PatentItem,
  ResearchFilters,
  ResearchItem,
  ResearchItemType,
  ToggleResponse,
} from './types';

function params(filters: ResearchFilters): string {
  const search = new URLSearchParams();
  if (filters.query) search.set('query', filters.query);
  if (filters.direction) search.set('direction', filters.direction);
  if (filters.sort) search.set('sort', filters.sort);
  const value = search.toString();
  return value ? `?${value}` : '';
}

export function fetchFunds(filters: ResearchFilters) {
  return apiGet<FundItem[]>(`/api/v1/research/funds${params(filters)}`);
}

export function fetchNews(filters: ResearchFilters) {
  return apiGet<NewsItem[]>(`/api/v1/research/news${params(filters)}`);
}

export function fetchInnovations(filters: ResearchFilters) {
  return apiGet<InnovationItem[]>(`/api/v1/research/innovations${params(filters)}`);
}

export function fetchPapers(filters: ResearchFilters) {
  return apiGet<PaperItem[]>(`/api/v1/research/papers${params(filters)}`);
}

export function fetchPatents(filters: ResearchFilters) {
  return apiGet<PatentItem[]>(`/api/v1/research/patents${params(filters)}`);
}

export function fetchLabs(filters: ResearchFilters) {
  return apiGet<LabItem[]>(`/api/v1/research/labs${params(filters)}`);
}

export function fetchCompareItems() {
  return apiGet<CompareItem[]>('/api/v1/research/compare');
}

export function fetchResearchDetail(itemType: ResearchItemType, itemId: string) {
  return apiGet<DetailResponse>(`/api/v1/research/items/${itemType}/${itemId}`);
}

export function toggleFavorite(itemType: ResearchItemType, itemId: string) {
  return apiPost<ToggleResponse, { item_type: ResearchItemType; item_id: string }>(
    '/api/v1/research/favorites/toggle',
    { item_type: itemType, item_id: itemId },
  );
}

export function toggleSubscription(itemType: ResearchItemType, itemId: string) {
  return apiPost<ToggleResponse, { item_type: ResearchItemType; item_id: string }>(
    '/api/v1/research/subscriptions/toggle',
    { item_type: itemType, item_id: itemId },
  );
}

export function toggleCompare(itemType: ResearchItemType, itemId: string) {
  return apiPost<ToggleResponse, { item_type: ResearchItemType; item_id: string }>(
    '/api/v1/research/compare/toggle',
    { item_type: itemType, item_id: itemId },
  );
}

export function toggleRead(itemType: ResearchItemType, itemId: string) {
  return apiPost<ToggleResponse, { item_type: ResearchItemType; item_id: string }>(
    '/api/v1/research/read/toggle',
    { item_type: itemType, item_id: itemId },
  );
}

export function toggleReadingList(itemType: ResearchItemType, itemId: string) {
  return apiPost<ToggleResponse, { item_type: ResearchItemType; item_id: string }>(
    '/api/v1/research/reading-list/toggle',
    { item_type: itemType, item_id: itemId },
  );
}

export function updateItemFlag(
  items: ResearchItem[],
  itemId: string,
  key: 'favorited' | 'subscribed' | 'compared' | 'read' | 'in_reading_list',
  value: boolean,
): ResearchItem[] {
  return items.map((item) => (item.id === itemId ? { ...item, [key]: value } as ResearchItem : item));
}
