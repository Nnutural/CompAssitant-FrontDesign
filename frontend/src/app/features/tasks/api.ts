const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function simulateTaskSave(): Promise<{ savedAt: string }> {
  await delay(180);
  return { savedAt: new Date().toISOString() };
}

export async function simulateTaskImport(): Promise<void> {
  await delay(520);
}
