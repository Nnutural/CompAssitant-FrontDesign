import { createDefaultProfileWorkspace } from './mockData';
import type { ProfileWorkspace } from './types';

function delay<T>(value: T, ms = 450): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), ms);
  });
}

export function fetchProfileWorkspaceDemo(): Promise<ProfileWorkspace> {
  return delay(createDefaultProfileWorkspace());
}

export function saveProfileWorkspaceDemo(workspace: ProfileWorkspace): Promise<ProfileWorkspace> {
  return delay(workspace, 300);
}
