const STRICT_EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}/gi;
const OCR_EMAIL_REGEX =
  /[A-Z0-9._%+-]+\s*[@＠]\s*[A-Z0-9-]+(?:\s*[.。｡．·•]\s*[A-Z0-9-]+|\s*[,:][A-Z0-9-]+)+/gi;
const EDGE_TRIM_REGEX = /^[\s[\\](){}<>"'`.,;:!?]+|[\s[\\](){}<>"'`.,;:!?]+$/g;
const ZERO_WIDTH_REGEX = /[\u200B-\u200D\uFEFF]/g;
const LOCAL_PART_REGEX = /^[A-Z0-9._%+-]+$/i;
const DOMAIN_LABEL_REGEX = /^[A-Z0-9-]+$/i;

type CandidateMatch = {
  value: string;
  index: number;
  permissive: boolean;
};

function collectMatches(
  input: string,
  regex: RegExp,
  permissive: boolean,
): CandidateMatch[] {
  regex.lastIndex = 0;

  const matches: CandidateMatch[] = [];

  for (const match of input.matchAll(regex)) {
    if (typeof match.index !== 'number') {
      continue;
    }

    const nextNonWhitespace = input
      .slice(match.index + match[0].length)
      .match(/\S/)?.[0];

    if (permissive && nextNonWhitespace === '@') {
      continue;
    }

    matches.push({
      value: match[0],
      index: match.index,
      permissive,
    });
  }

  return matches;
}

function normalizeEmail(raw: string, permissive = false): string | null {
  const cleaned = raw
    .replace(ZERO_WIDTH_REGEX, '')
    .replace(EDGE_TRIM_REGEX, '')
    .replace(/[＠﹫]/g, '@');
  const candidate = permissive ? cleaned.replace(/\s*@\s*/g, '@') : cleaned;
  const parts = candidate.split('@');

  if (parts.length !== 2) {
    return null;
  }

  let [localPart, domainPartRaw] = parts;

  if (permissive) {
    localPart = localPart.replace(/\s+/g, '');
    domainPartRaw = domainPartRaw
      .replace(/\s+/g, '')
      .replace(/[。｡．·•,:]/g, '.');
  }

  if (!localPart || !domainPartRaw || !LOCAL_PART_REGEX.test(localPart)) {
    return null;
  }

  if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
    return null;
  }

  const domainPart = domainPartRaw.toLowerCase();

  if (
    domainPart.startsWith('.') ||
    domainPart.endsWith('.') ||
    domainPart.startsWith('-') ||
    domainPart.endsWith('-') ||
    domainPart.includes('..')
  ) {
    return null;
  }

  const labels = domainPart.split('.');
  const topLevelLabel = labels[labels.length - 1];

  if (
    labels.some(
      label =>
        !label ||
        label.startsWith('-') ||
        label.endsWith('-') ||
        !DOMAIN_LABEL_REGEX.test(label),
    )
  ) {
    return null;
  }

  if (!topLevelLabel || topLevelLabel.length < 2 || topLevelLabel.length > 63) {
    return null;
  }

  return `${localPart}@${domainPart}`;
}

export function extractEmailsFromText(input: string): string[] {
  if (!input) {
    return [];
  }

  const seen = new Set<string>();
  const result: string[] = [];
  const candidates = [
    ...collectMatches(input, STRICT_EMAIL_REGEX, false),
    ...collectMatches(input, OCR_EMAIL_REGEX, true),
  ].sort(
    (left, right) =>
      left.index - right.index || Number(left.permissive) - Number(right.permissive),
  );

  for (const candidate of candidates) {
    const normalized = normalizeEmail(candidate.value, candidate.permissive);

    if (!normalized) {
      continue;
    }

    const key = normalized.toLowerCase();

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(normalized);
  }

  return result;
}
