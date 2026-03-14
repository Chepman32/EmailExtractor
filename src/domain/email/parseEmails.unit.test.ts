import {extractEmailsFromText} from './parseEmails';

describe('extractEmailsFromText', () => {
  it('extracts and normalizes valid emails preserving first-seen order', () => {
    const input = `Contact: Foo.Bar+tag@Example.COM, foo.bar+tag@example.com, admin@sub.domain.io`;

    expect(extractEmailsFromText(input)).toEqual([
      'Foo.Bar+tag@example.com',
      'admin@sub.domain.io',
    ]);
  });

  it('trims surrounding punctuation and invalid wrappers', () => {
    const input = '(sales@example.com), [team@company.org]; <hello@world.net>."';

    expect(extractEmailsFromText(input)).toEqual([
      'sales@example.com',
      'team@company.org',
      'hello@world.net',
    ]);
  });

  it('ignores malformed email-like tokens', () => {
    const input = 'missing@tld x@y..z nope@ domain.com @example.com';
    expect(extractEmailsFromText(input)).toEqual([]);
  });

  it('normalizes OCR-style spacing and punctuation around the domain', () => {
    const input = 'antonkerch555 @ gmail,com\nsales @ company . org';

    expect(extractEmailsFromText(input)).toEqual([
      'antonkerch555@gmail.com',
      'sales@company.org',
    ]);
  });

  it('does not merge adjacent emails when permissive OCR parsing runs', () => {
    const input = 'first@example.com,second@example.com';

    expect(extractEmailsFromText(input)).toEqual([
      'first@example.com',
      'second@example.com',
    ]);
  });

  it('returns empty list for empty input', () => {
    expect(extractEmailsFromText('')).toEqual([]);
  });
});
