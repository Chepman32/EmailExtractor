import RNFS from 'react-native-fs';
import {unzip} from 'react-native-zip-archive';

import {extractEmailsFromText} from '../../domain/email/parseEmails';

export function extractTextFromDocumentXml(xml: string): string {
  const textSegments: string[] = [];
  const textRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;

  for (const match of xml.matchAll(textRegex)) {
    const content = match[1]?.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>') ?? '';

    if (content) {
      textSegments.push(content);
    }
  }

  return textSegments.join(' ').replace(/\s+/g, ' ').trim();
}

export async function extractEmailsFromDocxFile(fileUri: string): Promise<string[]> {
  const tmpDir = `${RNFS.CachesDirectoryPath}/docx-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;

  await RNFS.mkdir(tmpDir);

  try {
    await unzip(decodeURIComponent(fileUri.replace('file://', '')), tmpDir);
    const xmlPath = `${tmpDir}/word/document.xml`;
    const xml = await RNFS.readFile(xmlPath, 'utf8');
    const text = extractTextFromDocumentXml(xml);

    return extractEmailsFromText(text);
  } finally {
    // Best-effort cleanup; stale cache directories are acceptable if deletion fails.
    await RNFS.unlink(tmpDir).catch(() => undefined);
  }
}
