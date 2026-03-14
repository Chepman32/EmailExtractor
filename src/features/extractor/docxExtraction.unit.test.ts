import {extractTextFromDocumentXml} from './docxExtraction';

describe('extractTextFromDocumentXml', () => {
  it('concatenates text runs from DOCX xml', () => {
    const xml =
      '<w:document><w:body><w:p><w:r><w:t>hello</w:t></w:r><w:r><w:t xml:space="preserve"> world</w:t></w:r></w:p><w:p><w:r><w:t>a@example.com</w:t></w:r></w:p></w:body></w:document>';

    expect(extractTextFromDocumentXml(xml)).toContain('hello world');
    expect(extractTextFromDocumentXml(xml)).toContain('a@example.com');
  });

  it('returns empty text when no text tags exist', () => {
    expect(extractTextFromDocumentXml('<w:document />')).toBe('');
  });
});
