export const EXTRACTABLE_DATA_TYPES = ['email', 'date', 'link'] as const;

export type ExtractableDataType = (typeof EXTRACTABLE_DATA_TYPES)[number];

export type DataTypeSelection = Record<ExtractableDataType, boolean>;

export type ExtractedMatches = Record<ExtractableDataType, string[]>;

export const DATA_TYPE_LABELS: Record<ExtractableDataType, string> = {
  email: 'Email',
  date: 'Dates',
  link: 'Links',
};

export function createDefaultDataTypeSelection(): DataTypeSelection {
  return {
    email: true,
    date: true,
    link: true,
  };
}

export function createEmptyMatches(): ExtractedMatches {
  return {
    email: [],
    date: [],
    link: [],
  };
}

export function isExtractableDataType(value: unknown): value is ExtractableDataType {
  return (
    typeof value === 'string' &&
    (EXTRACTABLE_DATA_TYPES as readonly string[]).includes(value)
  );
}

export function isDataTypeSelection(value: unknown): value is DataTypeSelection {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return EXTRACTABLE_DATA_TYPES.every(type => typeof candidate[type] === 'boolean');
}

export function isExtractedMatches(value: unknown): value is ExtractedMatches {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return EXTRACTABLE_DATA_TYPES.every(
    type =>
      Array.isArray(candidate[type]) &&
      candidate[type].every(item => typeof item === 'string'),
  );
}

export function getEnabledDataTypes(
  selection: DataTypeSelection,
): ExtractableDataType[] {
  return EXTRACTABLE_DATA_TYPES.filter(type => selection[type]);
}

export function hasEnabledDataType(selection: DataTypeSelection): boolean {
  return EXTRACTABLE_DATA_TYPES.some(type => selection[type]);
}

export function countExtractedMatches(matches: ExtractedMatches): number {
  return EXTRACTABLE_DATA_TYPES.reduce(
    (total, type) => total + matches[type].length,
    0,
  );
}

export function formatDataTypeCount(
  type: ExtractableDataType,
  count: number,
): string {
  if (type === 'link') {
    return `${count} ${count === 1 ? 'link' : 'links'}`;
  }

  if (type === 'date') {
    return `${count} ${count === 1 ? 'date' : 'dates'}`;
  }

  return `${count} ${count === 1 ? 'email' : 'emails'}`;
}
