export function normalizeSearchText(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeSearchText(item)).join(' ');
  }

  if (typeof value === 'object') {
    return Object.values(value).map((item) => normalizeSearchText(item)).join(' ');
  }

  return String(value).trim().toLowerCase();
}

export function matchesSearchTerm(row: Record<string, string | number | null | undefined>, searchTerm: string): boolean {
  const query = normalizeSearchText(searchTerm);

  if (!query) {
    return true;
  }

  return Object.values(row).some((value) => normalizeSearchText(value).includes(query));
}
