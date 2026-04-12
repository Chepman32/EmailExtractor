import {ExtractableDataType} from '../shared/extractedData';
import {ExtractionSource} from '../shared/types';
import {ThemeId} from '../theme/themes';

export type SupportedLocale =
  | 'en'
  | 'zh-Hans'
  | 'ja'
  | 'ko'
  | 'de'
  | 'fr'
  | 'es'
  | 'pt-BR'
  | 'ar'
  | 'ru'
  | 'it'
  | 'nl'
  | 'tr'
  | 'th'
  | 'vi'
  | 'id'
  | 'pl'
  | 'uk'
  | 'hi'
  | 'he'
  | 'sv'
  | 'no'
  | 'da'
  | 'fi'
  | 'cs'
  | 'hu'
  | 'ro'
  | 'el'
  | 'ms';

export type CountForms = {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
};

export type TranslationSet = {
  tabs: Record<'home' | 'history' | 'settings', string>;
  common: {
    skip: string;
    continue: string;
    getStarted: string;
    keepGoing: string;
    runPreview: string;
    startExtracting: string;
    back: string;
    stepCounter: string;
    copied: string;
    issue: string;
    warnings: string;
    found: string;
    reset: string;
    copy: string;
    share: string;
    exportTxt: string;
    exportCsv: string;
    tapToCopy: string;
    dismiss: string;
  };
  dataTypes: Record<
    ExtractableDataType,
    {
      label: string;
      listLabel: string;
      goalLabel: string;
      goalDescription: string;
      settingsDescription: string;
      count: CountForms;
    }
  >;
  sources: Record<
    ExtractionSource,
    {
      label: string;
      listLabel: string;
      extractorDescription: string;
      onboardingLabel: string;
      onboardingDescription: string;
    }
  >;
  themes: Record<
    ThemeId,
    {
      label: string;
      description: string;
    }
  >;
  onboarding: {
    welcomeEyebrow: string;
    welcomeTitle: string;
    welcomeSubtitle: string;
    sampleInputLabel: string;
    sampleInputText: string;
    featureStartTitle: string;
    featureStartText: string;
    featureWorkflowTitle: string;
    featureWorkflowText: string;
    goalsTitle: string;
    goalsSubtitle: string;
    painTitle: string;
    painSubtitle: string;
    sourcesTitle: string;
    sourcesSubtitle: string;
    permissionTimingTitle: string;
    permissionTimingMedia: string;
    permissionTimingText: string;
    demoTitle: string;
    demoSubtitle: string;
    previewThreadLabel: string;
    previewThreadText: string;
    pulledOutForYou: string;
    runPreviewHint: string;
    readyTitle: string;
    readySubtitle: string;
    prioritizedOutputsTitle: string;
    prioritizedOutputsText: string;
    bestFitSourcesTitle: string;
    bestFitSourcesText: string;
    frictionTitle: string;
    painPoints: Record<
      'retyping' | 'buried' | 'screenshots' | 'handoff',
      {label: string; description: string}
    >;
  };
  extractor: {
    manualTextFallback: string;
    importedSourceFallback: string;
    sourceHelperText: string;
    sourceHelperAttached: string;
    sourceHelperChoose: string;
    extractData: string;
    extracting: string;
    ready: string;
    awaitingText: string;
    awaitingImport: string;
    extractHintReady: string;
    extractHintNeedText: string;
    extractHintNeedImport: string;
    importError: string;
    extractionFailed: string;
    unknownExtractionError: string;
    historySaveError: string;
    clipboardEmpty: string;
    pasteClipboardError: string;
    itemCopied: string;
    sectionCopied: string;
    shareTitle: string;
    exportedMessage: string;
    exportError: string;
    shareError: string;
    resultSectionHint: string;
    inputEyebrow: string;
    inputTitle: string;
    inputSubtitle: string;
    pasteTextTitle: string;
    importedSourceTitle: string;
    pastePlaceholder: string;
    noSourceSelected: string;
    replaceSourceHint: string;
    chooseSourceHint: string;
    resultsEyebrow: string;
    resultsTitle: string;
    resultsSubtitlePopulated: string;
    resultsSubtitleEmpty: string;
    emptyEyebrow: string;
    emptyTitle: string;
    emptySubtitle: string;
  };
  history: {
    unknownTime: string;
    noResultsStored: string;
    heroEyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    emptyTitle: string;
    emptyText: string;
  };
  settings: {
    themeEyebrow: string;
    themeTitle: string;
    dataTypesEyebrow: string;
    dataTypesTitle: string;
    dataTypesSubtitle: string;
    themeUpdated: string;
    preferencesUpdated: string;
    selectOneDataType: string;
  };
  runtime: {
    nativeModuleUnavailable: string;
    multiTypeUnavailable: string;
    noSourceAssetSelected: string;
    unsupportedFileType: string;
    unableToExportExtractedItems: string;
    fileMissing: string;
    unableToReadImage: string;
    primaryOcrFailed: string;
    highContrastOcrFailed: string;
    unableToProcessImage: string;
    unableToOpenPdf: string;
    pdfOcrFallbackFailed: string;
    unableToDecodeTextFile: string;
  };
};

const en: TranslationSet = {
  tabs: {
    home: 'Home',
    history: 'History',
    settings: 'Settings',
  },
  common: {
    skip: 'Skip',
    continue: 'Continue',
    getStarted: 'Get started',
    keepGoing: 'Keep going',
    runPreview: 'Run the preview',
    startExtracting: 'Start extracting',
    back: 'Back',
    stepCounter: 'Step {current} of {total}',
    copied: 'Copied',
    issue: 'Issue',
    warnings: 'Warnings',
    found: 'found',
    reset: 'Reset',
    copy: 'Copy',
    share: 'Share',
    exportTxt: 'Export TXT',
    exportCsv: 'Export CSV',
    tapToCopy: 'Tap to copy',
    dismiss: 'Dismiss',
  },
  dataTypes: {
    email: {
      label: 'Email',
      listLabel: 'email addresses',
      goalLabel: 'Email addresses',
      goalDescription: 'Turn threads and screenshots into a clean contact list.',
      settingsDescription: 'Capture email addresses with OCR-tolerant matching.',
      count: {
        one: '{count} email',
        other: '{count} emails',
      },
    },
    date: {
      label: 'Dates',
      listLabel: 'dates',
      goalLabel: 'Dates and deadlines',
      goalDescription: 'Catch events, due dates, and follow-up moments fast.',
      settingsDescription: 'Detect date strings from text, documents, and OCR output.',
      count: {
        one: '{count} date',
        other: '{count} dates',
      },
    },
    link: {
      label: 'Links',
      listLabel: 'links',
      goalLabel: 'Links and references',
      goalDescription: 'Pull buried URLs out of long messages and documents.',
      settingsDescription: 'Pull out URLs and web links from scanned content.',
      count: {
        one: '{count} link',
        other: '{count} links',
      },
    },
  },
  sources: {
    text: {
      label: 'Text',
      listLabel: 'text',
      extractorDescription: 'Paste copied content',
      onboardingLabel: 'Copied text',
      onboardingDescription: 'Threads, notes, copied docs',
    },
    camera: {
      label: 'Camera',
      listLabel: 'camera',
      extractorDescription: 'Capture on the spot',
      onboardingLabel: 'Live capture',
      onboardingDescription: 'Grab details on the spot',
    },
    photos: {
      label: 'Photos',
      listLabel: 'screenshots',
      extractorDescription: 'Pick from library',
      onboardingLabel: 'Screenshots',
      onboardingDescription: 'Images already in your library',
    },
    files: {
      label: 'Files',
      listLabel: 'files',
      extractorDescription: 'Import a document',
      onboardingLabel: 'Files',
      onboardingDescription: 'Docs, PDFs, and imports',
    },
  },
  themes: {
    light: {
      label: 'Light',
      description: 'Cool daylight blues and white surfaces.',
    },
    dark: {
      label: 'Dark',
      description: 'Deep slate surfaces with luminous blue accents.',
    },
    solar: {
      label: 'Solar',
      description: 'Warm yellow paper tones with amber contrast.',
    },
    mono: {
      label: 'Mono',
      description: 'Neutral gray scale with graphite contrast.',
    },
  },
  onboarding: {
    welcomeEyebrow: 'Fast first-run setup',
    welcomeTitle: 'Turn messy messages into clean details',
    welcomeSubtitle:
      'Paste a thread, scan a screenshot, or import a file. The app pulls out the parts you actually need.',
    sampleInputLabel: 'Sample input',
    sampleInputText:
      '“Can you send the signed file before {sampleDate}? If not, email hello@northstar.studio or use the link in the brief.”',
    featureStartTitle: 'One tap to start',
    featureStartText:
      'Pick a source and the home screen is ready right after setup.',
    featureWorkflowTitle: 'Fits your workflow',
    featureWorkflowText:
      'We’ll tune the extractor around what you need to pull out most often.',
    goalsTitle: 'What do you usually need first?',
    goalsSubtitle:
      'Pick everything that would save you the most time on day one.',
    painTitle: 'What slows you down most?',
    painSubtitle: 'Choose the one that feels a little too familiar.',
    sourcesTitle: 'Where does the mess usually live?',
    sourcesSubtitle:
      'We’ll tune the first run around the sources you reach for most.',
    permissionTimingTitle: 'Permission timing',
    permissionTimingMedia:
      'Photo and camera access are only requested when you tap those tools.',
    permissionTimingText:
      'You can start with pasted text now and bring in files or camera later.',
    demoTitle: 'Run a 10-second preview',
    demoSubtitle:
      'This is the core moment: messy input in, usable details out.',
    previewThreadLabel: 'Preview thread',
    previewThreadText:
      'Alex, can you review the brief before {sampleDate}? If anything changes, message hello@northstar.studio or use https://northstar.studio/invite.',
    pulledOutForYou: 'Pulled out for you',
    runPreviewHint:
      'Tap “Run the preview” to reveal the exact details this app would surface first.',
    readyTitle: 'Your extractor is tuned for fast wins',
    readySubtitle:
      'You can change any of this later, but this gives you the fastest path to value on the home screen.',
    prioritizedOutputsTitle: 'Prioritized outputs',
    prioritizedOutputsText:
      'We’ll put {typesSummary} front and center from the first scan.',
    bestFitSourcesTitle: 'Best-fit sources',
    bestFitSourcesText:
      'Your most likely first win comes from {sourcesSummary}.',
    frictionTitle: 'Built to remove this friction',
    painPoints: {
      retyping: {
        label: 'I keep retyping details by hand',
        description: 'The info is already there, just not in a usable format.',
      },
      buried: {
        label: 'Important info gets buried in long threads',
        description: 'I waste time scanning messages for one key detail.',
      },
      screenshots: {
        label: 'I save screenshots and forget to process them',
        description: 'Useful details sit in my camera roll instead of becoming actions.',
      },
      handoff: {
        label: 'I need a clean list I can share fast',
        description: 'I want results I can copy, send, or export right away.',
      },
    },
  },
  extractor: {
    manualTextFallback: 'Manual text',
    importedSourceFallback: 'Imported source',
    sourceHelperText:
      'Paste any copied thread, note, or document text and the app will pull out the selected data types.',
    sourceHelperAttached:
      'Source attached and ready to scan. Tap the same option again to replace it.',
    sourceHelperChoose: 'Select a source to continue.',
    extractData: 'Extract Data',
    extracting: 'Extracting...',
    ready: 'Ready',
    awaitingText: 'Awaiting text',
    awaitingImport: 'Awaiting import',
    extractHintReady: 'Extract {typesSummary} from the current input.',
    extractHintNeedText: 'Paste some text to enable extraction.',
    extractHintNeedImport: 'Import a source to enable extraction.',
    importError: 'Unable to import source. Please try again.',
    extractionFailed: 'Extraction failed: {message}',
    unknownExtractionError: 'Unknown extraction error',
    historySaveError: 'Results were extracted, but history could not be saved.',
    clipboardEmpty: 'Clipboard is empty.',
    pasteClipboardError: 'Unable to paste from clipboard.',
    itemCopied: 'Item copied to clipboard.',
    sectionCopied: '{countLabel} copied.',
    shareTitle: 'Extracted results',
    exportedMessage: 'Exported {countLabel} as {format}.',
    exportError: 'Unable to export {format} file.',
    shareError: 'Unable to share these results.',
    resultSectionHint:
      'Tap any result to copy it, or use the section actions below.',
    inputEyebrow: 'Input',
    inputTitle: 'Data Extractor',
    inputSubtitle:
      'Select a source above, prepare the content here, and run the scan when it is ready.',
    pasteTextTitle: 'Paste text to scan',
    importedSourceTitle: 'Imported source',
    pastePlaceholder: 'Paste text to scan for the selected data types',
    noSourceSelected: 'No source selected',
    replaceSourceHint: 'Tap the same source option above to replace this file.',
    chooseSourceHint: 'Select a source to continue.',
    resultsEyebrow: 'Results',
    resultsTitle: 'Extracted results',
    resultsSubtitlePopulated:
      'Results are grouped by data type so each section can be copied, shared, or exported separately.',
    resultsSubtitleEmpty:
      'Your extracted data will appear here once you run a scan.',
    emptyEyebrow: 'Ready when you are',
    emptyTitle: 'No results found',
    emptySubtitle:
      'Paste text or import a source, then run extraction to populate the selected result types.',
  },
  history: {
    unknownTime: 'Unknown time',
    noResultsStored: 'No results stored',
    heroEyebrow: 'History',
    heroTitle: 'Recent extraction sessions',
    heroSubtitle:
      'Reopen previous scans and jump straight back into the {homeTabLabel} tab with the selected source and results restored.',
    emptyTitle: 'No history yet',
    emptyText:
      'Completed scans will appear here so you can reopen them later.',
  },
  settings: {
    themeEyebrow: 'Theme',
    themeTitle: 'Choose a look',
    dataTypesEyebrow: 'Data types',
    dataTypesTitle: 'Choose what to extract',
    dataTypesSubtitle:
      'These selections apply across the app for every new scan.',
    themeUpdated: 'Theme updated.',
    preferencesUpdated: 'Extraction preferences updated.',
    selectOneDataType: 'Select at least one data type.',
  },
  runtime: {
    nativeModuleUnavailable: 'The extraction module is not available.',
    multiTypeUnavailable: 'This source currently supports email-only extraction.',
    noSourceAssetSelected: 'No source has been selected yet.',
    unsupportedFileType: 'This file type is not supported.',
    unableToExportExtractedItems: 'Unable to export extracted items.',
    fileMissing: 'File does not exist at path: {path}',
    unableToReadImage: 'Unable to read image at path: {path}',
    primaryOcrFailed: 'The first OCR pass did not return usable text.',
    highContrastOcrFailed: 'The high-contrast OCR fallback also failed.',
    unableToProcessImage: 'Unable to process this image.',
    unableToOpenPdf: 'Unable to open the PDF file.',
    pdfOcrFallbackFailed: 'OCR fallback failed for PDF page {page}.',
    unableToDecodeTextFile: 'Unable to decode the text file.',
  },
};

const zhHans: TranslationSet = {
  tabs: {home: '首页', history: '历史', settings: '设置'},
  common: {
    skip: '跳过',
    continue: '继续',
    getStarted: '开始使用',
    keepGoing: '继续下一步',
    runPreview: '运行预览',
    startExtracting: '开始提取',
    back: '返回',
    stepCounter: '第 {current} 步，共 {total} 步',
    copied: '已复制',
    issue: '问题',
    warnings: '提醒',
    found: '项',
    reset: '重置',
    copy: '复制',
    share: '分享',
    exportTxt: '导出 TXT',
    exportCsv: '导出 CSV',
    tapToCopy: '点击即可复制',
    dismiss: '收起',
  },
  dataTypes: {
    email: {
      label: '邮箱',
      listLabel: '邮箱地址',
      goalLabel: '邮箱地址',
      goalDescription: '把聊天记录和截图整理成干净的联系人列表。',
      settingsDescription: '通过更耐受 OCR 误差的匹配方式提取邮箱地址。',
      count: {other: '{count} 个邮箱'},
    },
    date: {
      label: '日期',
      listLabel: '日期',
      goalLabel: '日期和截止时间',
      goalDescription: '快速抓取活动时间、截止日期和后续跟进节点。',
      settingsDescription: '从文本、文档和 OCR 结果中识别日期内容。',
      count: {other: '{count} 个日期'},
    },
    link: {
      label: '链接',
      listLabel: '链接',
      goalLabel: '链接和参考信息',
      goalDescription: '把长消息和文档里埋得很深的网址提取出来。',
      settingsDescription: '从扫描内容中提取网址和网页链接。',
      count: {other: '{count} 个链接'},
    },
  },
  sources: {
    text: {label: '文本', listLabel: '文本', extractorDescription: '粘贴已复制内容', onboardingLabel: '复制的文本', onboardingDescription: '聊天、笔记、复制的文档'},
    camera: {label: '相机', listLabel: '相机', extractorDescription: '现场拍摄', onboardingLabel: '实时拍摄', onboardingDescription: '当场抓取关键信息'},
    photos: {label: '照片', listLabel: '截图', extractorDescription: '从相册选择', onboardingLabel: '截图', onboardingDescription: '图库里已有的图片'},
    files: {label: '文件', listLabel: '文件', extractorDescription: '导入文档', onboardingLabel: '文件', onboardingDescription: '文档、PDF 和导入文件'},
  },
  themes: {
    light: {label: '浅色', description: '清爽的日光蓝与白色界面。'},
    dark: {label: '深色', description: '深灰蓝底色，配明亮蓝色点缀。'},
    solar: {label: '暖阳', description: '温暖纸张色调配琥珀对比。'},
    mono: {label: '黑白', description: '中性色灰阶配石墨质感。'},
  },
  onboarding: {
    welcomeEyebrow: '快速完成首次设置',
    welcomeTitle: '把杂乱信息整理成清晰结果',
    welcomeSubtitle: '粘贴聊天内容、扫描截图或导入文件，应用会提取真正有用的信息。',
    sampleInputLabel: '示例输入',
    sampleInputText: '“你能在 {sampleDate} 前把签好的文件发来吗？不行的话发邮件到 hello@northstar.studio，或者用简介里的链接。”',
    featureStartTitle: '一点就能开始',
    featureStartText: '选好来源后，首页会立刻按你的需求准备好。',
    featureWorkflowTitle: '贴合你的工作方式',
    featureWorkflowText: '我们会根据你最常提取的内容来调整提取器。',
    goalsTitle: '你通常最先需要什么？',
    goalsSubtitle: '把第一天最能帮你省时间的内容都选上。',
    painTitle: '最拖慢你的是哪一件事？',
    painSubtitle: '选一个最让你有共鸣的问题。',
    sourcesTitle: '这些信息通常散落在哪里？',
    sourcesSubtitle: '我们会优先围绕你最常用的来源来配置首次体验。',
    permissionTimingTitle: '权限说明',
    permissionTimingMedia: '只有你点到照片或相机工具时，才会请求相应权限。',
    permissionTimingText: '你现在可以先从粘贴文本开始，之后再接入文件或相机。',
    demoTitle: '运行一个 10 秒预览',
    demoSubtitle: '这就是核心体验：杂乱输入进来，可用结果出来。',
    previewThreadLabel: '预览内容',
    previewThreadText: 'Alex，你能在 {sampleDate} 前看一下这份简介吗？如果有变动，请发消息到 hello@northstar.studio，或者使用 https://northstar.studio/invite。',
    pulledOutForYou: '为你提取出',
    runPreviewHint: '点“运行预览”，看看应用会优先提取哪些具体信息。',
    readyTitle: '你的提取器已经调到最顺手的状态',
    readySubtitle: '以后随时都能改，但现在这样最容易在首页立刻看到价值。',
    prioritizedOutputsTitle: '优先提取内容',
    prioritizedOutputsText: '从第一次扫描开始，我们会把 {typesSummary} 放在最显眼的位置。',
    bestFitSourcesTitle: '最适合的来源',
    bestFitSourcesText: '你最可能最快看到效果的来源是 {sourcesSummary}。',
    frictionTitle: '就是为了解决这个麻烦',
    painPoints: {
      retyping: {label: '我总在手动重新输入信息', description: '信息明明已经有了，只是还不能直接拿来用。'},
      buried: {label: '重要信息总是淹没在长聊天里', description: '我经常为了一个关键点来回翻消息。'},
      screenshots: {label: '我存了很多截图，却一直没处理', description: '有用的信息躺在相册里，始终没变成行动。'},
      handoff: {label: '我需要一份能马上分享的清单', description: '我想要能立刻复制、发送或导出的结果。'},
    },
  },
  extractor: {
    manualTextFallback: '手动输入文本',
    importedSourceFallback: '已导入来源',
    sourceHelperText: '粘贴任意聊天、笔记或文档内容，应用会提取你选中的数据类型。',
    sourceHelperAttached: '来源已附加，可以开始扫描。再次点同一来源可替换。',
    sourceHelperChoose: '请选择一个来源继续。',
    extractData: '提取数据',
    extracting: '正在提取...',
    ready: '就绪',
    awaitingText: '等待文本',
    awaitingImport: '等待导入',
    extractHintReady: '从当前内容中提取 {typesSummary}。',
    extractHintNeedText: '先粘贴一些文本，才能开始提取。',
    extractHintNeedImport: '先导入一个来源，才能开始提取。',
    importError: '无法导入来源，请重试。',
    extractionFailed: '提取失败：{message}',
    unknownExtractionError: '未知提取错误',
    historySaveError: '结果已提取，但无法保存到历史记录。',
    clipboardEmpty: '剪贴板为空。',
    pasteClipboardError: '无法从剪贴板粘贴。',
    itemCopied: '已复制到剪贴板。',
    sectionCopied: '已复制 {countLabel}。',
    shareTitle: '提取结果',
    exportedMessage: '已将 {countLabel} 导出为 {format}。',
    exportError: '无法导出 {format} 文件。',
    shareError: '无法分享这些结果。',
    resultSectionHint: '点任意结果即可复制，也可使用下方操作。',
    inputEyebrow: '输入',
    inputTitle: '数据提取器',
    inputSubtitle: '先选择上方来源，在这里准备内容，准备好后再开始扫描。',
    pasteTextTitle: '粘贴待扫描文本',
    importedSourceTitle: '已导入来源',
    pastePlaceholder: '粘贴文本以扫描所选数据类型',
    noSourceSelected: '尚未选择来源',
    replaceSourceHint: '再次点上方同一来源即可替换当前文件。',
    chooseSourceHint: '请选择一个来源继续。',
    resultsEyebrow: '结果',
    resultsTitle: '提取结果',
    resultsSubtitlePopulated: '结果会按数据类型分组，方便分别复制、分享或导出。',
    resultsSubtitleEmpty: '扫描完成后，提取到的数据会显示在这里。',
    emptyEyebrow: '准备好就开始',
    emptyTitle: '未找到结果',
    emptySubtitle: '先粘贴文本或导入来源，再运行提取以填充所选结果类型。',
  },
  history: {
    unknownTime: '时间未知',
    noResultsStored: '未保存结果',
    heroEyebrow: '历史',
    heroTitle: '最近的提取记录',
    heroSubtitle: '重新打开之前的扫描，直接回到 {homeTabLabel} 标签页，并恢复所选来源与结果。',
    emptyTitle: '还没有历史记录',
    emptyText: '完成的扫描会显示在这里，方便你之后再次打开。',
  },
  settings: {
    themeEyebrow: '主题',
    themeTitle: '选择外观',
    dataTypesEyebrow: '数据类型',
    dataTypesTitle: '选择要提取的内容',
    dataTypesSubtitle: '这些选择会应用到应用里的每一次新扫描。',
    themeUpdated: '主题已更新。',
    preferencesUpdated: '提取偏好已更新。',
    selectOneDataType: '至少选择一种数据类型。',
  },
  runtime: {
    nativeModuleUnavailable: '提取模块当前不可用。',
    multiTypeUnavailable: '这个来源目前只支持提取邮箱。',
    noSourceAssetSelected: '还没有选择来源。',
    unsupportedFileType: '暂不支持这种文件类型。',
    unableToExportExtractedItems: '无法导出提取结果。',
    fileMissing: '该路径下不存在文件：{path}',
    unableToReadImage: '无法读取该路径下的图片：{path}',
    primaryOcrFailed: '首次 OCR 识别未返回可用文本。',
    highContrastOcrFailed: '高对比度 OCR 兜底识别也失败了。',
    unableToProcessImage: '无法处理这张图片。',
    unableToOpenPdf: '无法打开该 PDF 文件。',
    pdfOcrFallbackFailed: 'PDF 第 {page} 页的 OCR 兜底识别失败。',
    unableToDecodeTextFile: '无法解码该文本文件。',
  },
};

const ja: TranslationSet = {
  tabs: {home: 'ホーム', history: '履歴', settings: '設定'},
  common: {
    skip: 'スキップ', continue: '続ける', getStarted: 'はじめる', keepGoing: '次へ進む', runPreview: 'プレビューを実行', startExtracting: '抽出を開始', back: '戻る', stepCounter: '{total} ステップ中 {current}', copied: 'コピーしました', issue: '問題', warnings: '注意', found: '件', reset: 'リセット', copy: 'コピー', share: '共有', exportTxt: 'TXTを書き出す', exportCsv: 'CSVを書き出す', tapToCopy: 'タップでコピー', dismiss: '閉じる',
  },
  dataTypes: {
    email: {label: 'メール', listLabel: 'メールアドレス', goalLabel: 'メールアドレス', goalDescription: 'スレッドやスクリーンショットを、きれいな連絡先リストにまとめます。', settingsDescription: 'OCR のゆらぎに強い判定でメールアドレスを抽出します。', count: {other: '{count} 件のメール'}},
    date: {label: '日付', listLabel: '日付', goalLabel: '日付と締切', goalDescription: '予定日、期限、フォローアップのタイミングをすばやく拾います。', settingsDescription: 'テキスト、書類、OCR 結果から日付表現を検出します。', count: {other: '{count} 件の日付'}},
    link: {label: 'リンク', listLabel: 'リンク', goalLabel: 'リンクと参照先', goalDescription: '長いメッセージや資料に埋もれた URL を抜き出します。', settingsDescription: 'スキャンした内容から URL やウェブリンクを抽出します。', count: {other: '{count} 件のリンク'}},
  },
  sources: {
    text: {label: 'テキスト', listLabel: 'テキスト', extractorDescription: 'コピーした内容を貼り付け', onboardingLabel: 'コピーしたテキスト', onboardingDescription: 'スレッド、メモ、コピーした資料'},
    camera: {label: 'カメラ', listLabel: 'カメラ', extractorDescription: 'その場で撮影', onboardingLabel: 'その場で撮影', onboardingDescription: '必要な情報をその場で取り込む'},
    photos: {label: '写真', listLabel: 'スクリーンショット', extractorDescription: 'ライブラリから選択', onboardingLabel: 'スクリーンショット', onboardingDescription: 'ライブラリにある画像'},
    files: {label: 'ファイル', listLabel: 'ファイル', extractorDescription: '書類を読み込む', onboardingLabel: 'ファイル', onboardingDescription: '書類、PDF、インポートしたファイル'},
  },
  themes: {
    light: {label: 'ライト', description: '爽やかな昼光ブルーと白基調の画面。'},
    dark: {label: 'ダーク', description: '深いスレート調に明るいブルーの差し色。'},
    solar: {label: 'ソーラー', description: '温かみのある紙色にアンバーのコントラスト。'},
    mono: {label: 'モノ', description: 'グレースケールを基調にした落ち着いた配色。'},
  },
  onboarding: {
    welcomeEyebrow: '初回設定はすぐ完了', welcomeTitle: '散らかった情報を、使える形に', welcomeSubtitle: 'スレッドを貼り付ける、スクリーンショットを読み込む、ファイルを取り込む。それだけで必要な情報だけを抜き出します。', sampleInputLabel: '入力例', sampleInputText: '「{sampleDate} までに署名済みファイルを送れますか？ 難しければ hello@northstar.studio にメールするか、概要のリンクを使ってください。」', featureStartTitle: 'すぐに使い始められる', featureStartText: 'ソースを選べば、セットアップ直後からホーム画面が使える状態になります。', featureWorkflowTitle: '普段の流れに合わせる', featureWorkflowText: 'よく抜き出す情報に合わせて抽出体験を整えます。', goalsTitle: 'まず何を取り出したいですか？', goalsSubtitle: '初日からいちばん時間が浮きそうなものを選んでください。', painTitle: 'いちばん時間を取られるのは？', painSubtitle: '一番しっくりくるものを選んでください。', sourcesTitle: 'その情報はどこに散らばっていますか？', sourcesSubtitle: '最初の体験を、よく使うソース中心に調整します。', permissionTimingTitle: '権限について', permissionTimingMedia: '写真やカメラの権限は、その機能をタップしたときだけ求めます。', permissionTimingText: 'まずは貼り付けテキストから始めて、あとでファイルやカメラを使えます。', demoTitle: '10 秒でプレビュー', demoSubtitle: 'これがアプリの核です。雑然とした入力から、使える情報だけが残ります。', previewThreadLabel: 'プレビュー内容', previewThreadText: 'Alex、{sampleDate} までにこの概要を見てもらえますか？ 変更があれば hello@northstar.studio へ連絡するか、https://northstar.studio/invite を使ってください。', pulledOutForYou: '抽出された内容', runPreviewHint: '「プレビューを実行」を押すと、このアプリが最初に拾う情報がそのまま見られます。', readyTitle: 'すぐ成果が出るように調整しました', readySubtitle: 'あとでいつでも変更できますが、この設定ならホームですぐに価値を感じられます。', prioritizedOutputsTitle: '優先して見る項目', prioritizedOutputsText: '最初のスキャンから {typesSummary} を前面に表示します。', bestFitSourcesTitle: '相性の良いソース', bestFitSourcesText: '最初の成果につながりやすいのは {sourcesSummary} です。', frictionTitle: 'この手間を減らすために設計', painPoints: {
      retyping: {label: '情報を毎回手で打ち直している', description: '情報はあるのに、そのままでは使えません。'},
      buried: {label: '大事な情報が長いスレッドに埋もれる', description: 'ひとつの重要事項を探すだけで時間がかかります。'},
      screenshots: {label: 'スクリーンショットを保存したまま放置しがち', description: '使える情報が写真フォルダにたまったままになります。'},
      handoff: {label: 'すぐ共有できるきれいな一覧がほしい', description: 'コピーして送るか、書き出すかをすぐできる状態にしたいです。'},
    },
  },
  extractor: {
    manualTextFallback: '手入力テキスト', importedSourceFallback: '読み込み済みソース', sourceHelperText: 'コピーしたスレッド、メモ、資料のテキストを貼り付けると、選択した種類の情報を抽出します。', sourceHelperAttached: 'ソースの準備ができました。同じ項目をもう一度押すと差し替えられます。', sourceHelperChoose: '続けるにはソースを選んでください。', extractData: 'データを抽出', extracting: '抽出中...', ready: '準備完了', awaitingText: 'テキスト待ち', awaitingImport: '読み込み待ち', extractHintReady: '現在の入力から {typesSummary} を抽出します。', extractHintNeedText: '抽出するにはテキストを貼り付けてください。', extractHintNeedImport: '抽出するにはソースを読み込んでください。', importError: 'ソースを読み込めませんでした。もう一度お試しください。', extractionFailed: '抽出に失敗しました: {message}', unknownExtractionError: '不明な抽出エラー', historySaveError: '抽出は完了しましたが、履歴を保存できませんでした。', clipboardEmpty: 'クリップボードは空です。', pasteClipboardError: 'クリップボードから貼り付けできませんでした。', itemCopied: 'クリップボードにコピーしました。', sectionCopied: '{countLabel} をコピーしました。', shareTitle: '抽出結果', exportedMessage: '{countLabel} を {format} で書き出しました。', exportError: '{format} ファイルを書き出せませんでした。', shareError: 'この結果を共有できませんでした。', resultSectionHint: '各結果はタップでコピーできます。下の操作ボタンも使えます。', inputEyebrow: '入力', inputTitle: 'データ抽出', inputSubtitle: '上でソースを選び、ここで内容を整えて、準備ができたらスキャンを実行してください。', pasteTextTitle: 'スキャンするテキストを貼り付け', importedSourceTitle: '読み込み済みソース', pastePlaceholder: '選択したデータ種別を抽出するテキストを貼り付け', noSourceSelected: 'ソースが選ばれていません', replaceSourceHint: '差し替えるには上の同じソースをもう一度押してください。', chooseSourceHint: '続けるにはソースを選んでください。', resultsEyebrow: '結果', resultsTitle: '抽出結果', resultsSubtitlePopulated: '結果は種類ごとにまとまるので、個別にコピー・共有・書き出しできます。', resultsSubtitleEmpty: 'スキャンを実行すると、抽出データがここに表示されます。', emptyEyebrow: '準備ができたらどうぞ', emptyTitle: '結果は見つかりませんでした', emptySubtitle: 'テキストを貼り付けるかソースを読み込み、抽出を実行するとここに結果が出ます。',
  },
  history: {unknownTime: '時刻不明', noResultsStored: '保存された結果はありません', heroEyebrow: '履歴', heroTitle: '最近の抽出セッション', heroSubtitle: '以前のスキャンを開き直して、選択したソースと結果を復元したまま {homeTabLabel} タブへ戻れます。', emptyTitle: 'まだ履歴はありません', emptyText: '完了したスキャンはここに表示され、あとから開き直せます。'},
  settings: {themeEyebrow: 'テーマ', themeTitle: '見た目を選ぶ', dataTypesEyebrow: 'データ種別', dataTypesTitle: '抽出する内容を選ぶ', dataTypesSubtitle: 'この設定は新しいスキャンすべてに適用されます。', themeUpdated: 'テーマを更新しました。', preferencesUpdated: '抽出設定を更新しました。', selectOneDataType: '少なくとも 1 つはデータ種別を選んでください。'},
  runtime: {nativeModuleUnavailable: '抽出モジュールを利用できません。', multiTypeUnavailable: 'このソースでは現在、メール抽出のみ利用できます。', noSourceAssetSelected: 'ソースがまだ選択されていません。', unsupportedFileType: 'このファイル形式には対応していません。', unableToExportExtractedItems: '抽出結果を書き出せませんでした。', fileMissing: '次のパスにファイルがありません: {path}', unableToReadImage: '次のパスの画像を読み込めません: {path}', primaryOcrFailed: '最初の OCR で使えるテキストを取得できませんでした。', highContrastOcrFailed: '高コントラストの OCR フォールバックも失敗しました。', unableToProcessImage: 'この画像を処理できません。', unableToOpenPdf: 'PDF ファイルを開けません。', pdfOcrFallbackFailed: 'PDF の {page} ページで OCR フォールバックに失敗しました。', unableToDecodeTextFile: 'テキストファイルをデコードできません。'},
};

const ko: TranslationSet = {
  tabs: {home: '홈', history: '기록', settings: '설정'},
  common: {skip: '건너뛰기', continue: '계속', getStarted: '시작하기', keepGoing: '계속 진행', runPreview: '미리보기 실행', startExtracting: '추출 시작', back: '뒤로', stepCounter: '{total}단계 중 {current}단계', copied: '복사됨', issue: '문제', warnings: '주의', found: '개', reset: '초기화', copy: '복사', share: '공유', exportTxt: 'TXT 내보내기', exportCsv: 'CSV 내보내기', tapToCopy: '탭해서 복사', dismiss: '닫기'},
  dataTypes: {
    email: {label: '이메일', listLabel: '이메일 주소', goalLabel: '이메일 주소', goalDescription: '대화와 스크린샷을 깔끔한 연락처 목록으로 정리합니다.', settingsDescription: 'OCR 오차에 강한 방식으로 이메일 주소를 추출합니다.', count: {other: '이메일 {count}개'}},
    date: {label: '날짜', listLabel: '날짜', goalLabel: '날짜와 마감일', goalDescription: '일정, 마감, 후속 조치 시점을 빠르게 잡아냅니다.', settingsDescription: '텍스트, 문서, OCR 결과에서 날짜 표현을 감지합니다.', count: {other: '날짜 {count}개'}},
    link: {label: '링크', listLabel: '링크', goalLabel: '링크와 참고 정보', goalDescription: '긴 메시지나 문서에 묻힌 URL을 꺼내줍니다.', settingsDescription: '스캔한 내용에서 URL과 웹 링크를 추출합니다.', count: {other: '링크 {count}개'}},
  },
  sources: {
    text: {label: '텍스트', listLabel: '텍스트', extractorDescription: '복사한 내용 붙여넣기', onboardingLabel: '복사한 텍스트', onboardingDescription: '스레드, 메모, 복사한 문서'},
    camera: {label: '카메라', listLabel: '카메라', extractorDescription: '바로 촬영', onboardingLabel: '즉시 촬영', onboardingDescription: '현장에서 필요한 정보를 바로 캡처'},
    photos: {label: '사진', listLabel: '스크린샷', extractorDescription: '라이브러리에서 선택', onboardingLabel: '스크린샷', onboardingDescription: '사진 보관함에 있는 이미지'},
    files: {label: '파일', listLabel: '파일', extractorDescription: '문서 가져오기', onboardingLabel: '파일', onboardingDescription: '문서, PDF, 가져온 파일'},
  },
  themes: {
    light: {label: '라이트', description: '시원한 주간 블루와 화이트 표면.'},
    dark: {label: '다크', description: '짙은 슬레이트 톤에 밝은 블루 포인트.'},
    solar: {label: '솔라', description: '따뜻한 종이 톤과 앰버 대비.'},
    mono: {label: '모노', description: '그레이스케일 중심의 차분한 대비.'},
  },
  onboarding: {
    welcomeEyebrow: '첫 설정을 빠르게 끝내기', welcomeTitle: '복잡한 내용을 깔끔한 정보로', welcomeSubtitle: '대화를 붙여넣거나 스크린샷을 읽히거나 파일을 가져오면, 필요한 정보만 추려냅니다.', sampleInputLabel: '예시 입력', sampleInputText: '"{sampleDate} 전까지 서명된 파일을 보내주실 수 있나요? 어렵다면 hello@northstar.studio 로 메일을 보내거나 안내의 링크를 사용해 주세요."', featureStartTitle: '한 번 탭하면 시작', featureStartText: '소스를 고르면 바로 홈 화면에서 사용할 수 있습니다.', featureWorkflowTitle: '내 흐름에 맞춤', featureWorkflowText: '자주 뽑아내는 정보를 기준으로 추출기를 조정합니다.', goalsTitle: '보통 가장 먼저 필요한 것은 무엇인가요?', goalsSubtitle: '첫날 가장 시간을 아껴줄 항목을 모두 선택하세요.', painTitle: '무엇이 가장 시간을 잡아먹나요?', painSubtitle: '가장 공감되는 한 가지를 골라 주세요.', sourcesTitle: '이 정보는 주로 어디에 있나요?', sourcesSubtitle: '자주 쓰는 소스를 중심으로 첫 경험을 맞춥니다.', permissionTimingTitle: '권한 안내', permissionTimingMedia: '사진과 카메라 권한은 해당 도구를 눌렀을 때만 요청합니다.', permissionTimingText: '지금은 텍스트 붙여넣기로 시작하고, 나중에 파일이나 카메라도 추가할 수 있습니다.', demoTitle: '10초 미리보기 실행', demoSubtitle: '이 앱의 핵심 순간입니다. 지저분한 입력이 들어오면 쓸 수 있는 정보가 나옵니다.', previewThreadLabel: '미리보기 스레드', previewThreadText: 'Alex, {sampleDate} 전에 이 브리프를 확인해 줄 수 있나요? 변경 사항이 있으면 hello@northstar.studio 로 연락하거나 https://northstar.studio/invite 를 사용해 주세요.', pulledOutForYou: '추출된 내용', runPreviewHint: '"미리보기 실행"을 누르면 앱이 가장 먼저 꺼내는 정보가 그대로 보입니다.', readyTitle: '빠르게 성과가 나도록 맞춰졌습니다', readySubtitle: '나중에 언제든 바꿀 수 있지만, 지금 설정이 홈 화면에서 가장 빨리 효과를 보여줍니다.', prioritizedOutputsTitle: '우선 표시할 항목', prioritizedOutputsText: '첫 스캔부터 {typesSummary} 를 가장 먼저 보여드립니다.', bestFitSourcesTitle: '잘 맞는 소스', bestFitSourcesText: '가장 빨리 효과를 볼 가능성이 큰 소스는 {sourcesSummary} 입니다.', frictionTitle: '이 불편을 줄이기 위해 설계됨', painPoints: {
      retyping: {label: '정보를 계속 손으로 다시 입력해요', description: '이미 있는 정보인데 바로 쓰기 어렵습니다.'},
      buried: {label: '중요한 정보가 긴 대화 속에 묻혀요', description: '핵심 하나 찾으려고 메시지를 계속 훑게 됩니다.'},
      screenshots: {label: '스크린샷만 저장해 두고 처리하지 못해요', description: '유용한 정보가 사진 보관함에만 쌓입니다.'},
      handoff: {label: '바로 공유할 수 있는 깔끔한 목록이 필요해요', description: '곧바로 복사하거나 보내거나 내보낼 수 있는 결과가 필요합니다.'},
    },
  },
  extractor: {
    manualTextFallback: '직접 입력한 텍스트', importedSourceFallback: '가져온 소스', sourceHelperText: '복사한 대화, 메모, 문서 텍스트를 붙여넣으면 선택한 데이터 유형을 추출합니다.', sourceHelperAttached: '소스가 준비되었습니다. 같은 항목을 다시 누르면 교체됩니다.', sourceHelperChoose: '계속하려면 소스를 선택하세요.', extractData: '데이터 추출', extracting: '추출 중...', ready: '준비됨', awaitingText: '텍스트 대기 중', awaitingImport: '가져오기 대기 중', extractHintReady: '현재 입력에서 {typesSummary} 를 추출합니다.', extractHintNeedText: '추출하려면 먼저 텍스트를 붙여넣으세요.', extractHintNeedImport: '추출하려면 먼저 소스를 가져오세요.', importError: '소스를 가져오지 못했습니다. 다시 시도해 주세요.', extractionFailed: '추출 실패: {message}', unknownExtractionError: '알 수 없는 추출 오류', historySaveError: '추출은 완료됐지만 기록 저장에는 실패했습니다.', clipboardEmpty: '클립보드가 비어 있습니다.', pasteClipboardError: '클립보드에서 붙여넣지 못했습니다.', itemCopied: '클립보드에 복사했습니다.', sectionCopied: '{countLabel} 복사됨.', shareTitle: '추출 결과', exportedMessage: '{countLabel} 를 {format} 로 내보냈습니다.', exportError: '{format} 파일을 내보내지 못했습니다.', shareError: '이 결과를 공유하지 못했습니다.', resultSectionHint: '각 결과를 탭해 복사하거나 아래 작업 버튼을 사용하세요.', inputEyebrow: '입력', inputTitle: '데이터 추출기', inputSubtitle: '위에서 소스를 고르고 여기서 내용을 준비한 뒤, 준비가 되면 스캔을 실행하세요.', pasteTextTitle: '스캔할 텍스트 붙여넣기', importedSourceTitle: '가져온 소스', pastePlaceholder: '선택한 데이터 유형을 스캔할 텍스트를 붙여넣으세요', noSourceSelected: '선택된 소스 없음', replaceSourceHint: '교체하려면 위의 같은 소스 항목을 다시 누르세요.', chooseSourceHint: '계속하려면 소스를 선택하세요.', resultsEyebrow: '결과', resultsTitle: '추출 결과', resultsSubtitlePopulated: '결과는 데이터 유형별로 묶여 각 섹션을 따로 복사, 공유, 내보내기 할 수 있습니다.', resultsSubtitleEmpty: '스캔을 실행하면 추출된 데이터가 여기에 표시됩니다.', emptyEyebrow: '준비되면 시작하세요', emptyTitle: '결과를 찾지 못했습니다', emptySubtitle: '텍스트를 붙여넣거나 소스를 가져온 다음 추출을 실행하면 여기에 결과가 채워집니다.',
  },
  history: {unknownTime: '시간 알 수 없음', noResultsStored: '저장된 결과 없음', heroEyebrow: '기록', heroTitle: '최근 추출 기록', heroSubtitle: '이전 스캔을 다시 열고 선택한 소스와 결과를 복원한 채 {homeTabLabel} 탭으로 돌아갈 수 있습니다.', emptyTitle: '아직 기록이 없습니다', emptyText: '완료한 스캔이 여기에 표시되어 나중에 다시 열 수 있습니다.'},
  settings: {themeEyebrow: '테마', themeTitle: '화면 스타일 선택', dataTypesEyebrow: '데이터 유형', dataTypesTitle: '추출할 항목 선택', dataTypesSubtitle: '이 설정은 앞으로의 모든 새 스캔에 적용됩니다.', themeUpdated: '테마가 업데이트되었습니다.', preferencesUpdated: '추출 설정이 업데이트되었습니다.', selectOneDataType: '최소 한 가지 데이터 유형을 선택하세요.'},
  runtime: {nativeModuleUnavailable: '추출 모듈을 사용할 수 없습니다.', multiTypeUnavailable: '이 소스에서는 현재 이메일 추출만 지원합니다.', noSourceAssetSelected: '아직 소스를 선택하지 않았습니다.', unsupportedFileType: '지원하지 않는 파일 형식입니다.', unableToExportExtractedItems: '추출 항목을 내보내지 못했습니다.', fileMissing: '다음 경로에 파일이 없습니다: {path}', unableToReadImage: '다음 경로의 이미지를 읽지 못했습니다: {path}', primaryOcrFailed: '첫 번째 OCR 시도에서 사용할 수 있는 텍스트를 찾지 못했습니다.', highContrastOcrFailed: '고대비 OCR 보정도 실패했습니다.', unableToProcessImage: '이 이미지를 처리할 수 없습니다.', unableToOpenPdf: 'PDF 파일을 열 수 없습니다.', pdfOcrFallbackFailed: 'PDF {page}페이지에서 OCR 보정이 실패했습니다.', unableToDecodeTextFile: '텍스트 파일을 디코딩할 수 없습니다.'},
};

const de: TranslationSet = {
  tabs: {home: 'Start', history: 'Verlauf', settings: 'Einstellungen'},
  common: {skip: 'Uberspringen', continue: 'Weiter', getStarted: 'Loslegen', keepGoing: 'Weiter', runPreview: 'Vorschau starten', startExtracting: 'Extraktion starten', back: 'Zuruck', stepCounter: 'Schritt {current} von {total}', copied: 'Kopiert', issue: 'Problem', warnings: 'Hinweise', found: 'gefunden', reset: 'Zurucksetzen', copy: 'Kopieren', share: 'Teilen', exportTxt: 'TXT exportieren', exportCsv: 'CSV exportieren', tapToCopy: 'Zum Kopieren tippen', dismiss: 'Schliessen'},
  dataTypes: {
    email: {label: 'E-Mail', listLabel: 'E-Mail-Adressen', goalLabel: 'E-Mail-Adressen', goalDescription: 'Macht aus Threads und Screenshots eine saubere Kontaktliste.', settingsDescription: 'Erfasst E-Mail-Adressen mit OCR-toleranter Erkennung.', count: {one: '{count} E-Mail', other: '{count} E-Mails'}},
    date: {label: 'Daten', listLabel: 'Daten', goalLabel: 'Daten und Fristen', goalDescription: 'Findet Termine, Deadlines und Follow-up-Zeitpunkte schnell.', settingsDescription: 'Erkennt Datumsangaben aus Texten, Dokumenten und OCR.', count: {one: '{count} Datum', other: '{count} Daten'}},
    link: {label: 'Links', listLabel: 'Links', goalLabel: 'Links und Verweise', goalDescription: 'Zieht versteckte URLs aus langen Nachrichten und Dokumenten.', settingsDescription: 'Extrahiert URLs und Weblinks aus gescannten Inhalten.', count: {one: '{count} Link', other: '{count} Links'}},
  },
  sources: {
    text: {label: 'Text', listLabel: 'Text', extractorDescription: 'Kopierten Inhalt einfugen', onboardingLabel: 'Kopierter Text', onboardingDescription: 'Threads, Notizen, kopierte Dokumente'},
    camera: {label: 'Kamera', listLabel: 'Kamera', extractorDescription: 'Direkt erfassen', onboardingLabel: 'Live-Erfassung', onboardingDescription: 'Details sofort vor Ort aufnehmen'},
    photos: {label: 'Fotos', listLabel: 'Screenshots', extractorDescription: 'Aus der Mediathek wahlen', onboardingLabel: 'Screenshots', onboardingDescription: 'Bilder aus deiner Galerie'},
    files: {label: 'Dateien', listLabel: 'Dateien', extractorDescription: 'Dokument importieren', onboardingLabel: 'Dateien', onboardingDescription: 'Docs, PDFs und Importe'},
  },
  themes: {
    light: {label: 'Hell', description: 'Kuhles Tageslichtblau auf weissen Flachen.'},
    dark: {label: 'Dunkel', description: 'Tiefe Schiefertone mit leuchtenden Blauakzenten.'},
    solar: {label: 'Solar', description: 'Warme Papiertone mit Amber-Kontrast.'},
    mono: {label: 'Mono', description: 'Neutrale Graustufen mit grafitstarkem Kontrast.'},
  },
  onboarding: {
    welcomeEyebrow: 'Schnelles Setup zum Start', welcomeTitle: 'Aus unordentlichen Nachrichten werden klare Details', welcomeSubtitle: 'Fuge einen Thread ein, scanne einen Screenshot oder importiere eine Datei. Die App holt genau die Infos heraus, die du wirklich brauchst.', sampleInputLabel: 'Beispiel', sampleInputText: '"Kannst du die unterschriebene Datei bis {sampleDate} schicken? Wenn nicht, schreib an hello@northstar.studio oder nutze den Link im Briefing."', featureStartTitle: 'Mit einem Tipp startklar', featureStartText: 'Quelle auswahlen und der Startbildschirm ist direkt einsatzbereit.', featureWorkflowTitle: 'Passt zu deinem Ablauf', featureWorkflowText: 'Wir richten den Extraktor auf die Infos aus, die du am haufigsten brauchst.', goalsTitle: 'Was brauchst du meist zuerst?', goalsSubtitle: 'Wahle alles aus, was dir vom ersten Tag an Zeit spart.', painTitle: 'Was bremst dich am meisten aus?', painSubtitle: 'Nimm den Punkt, der sich unangenehm bekannt anfuhlt.', sourcesTitle: 'Wo liegt das Chaos normalerweise?', sourcesSubtitle: 'Wir stimmen den ersten Durchlauf auf deine typischen Quellen ab.', permissionTimingTitle: 'Zeitpunkt der Berechtigungen', permissionTimingMedia: 'Zugriff auf Fotos und Kamera fragen wir erst an, wenn du die Tools wirklich antippst.', permissionTimingText: 'Du kannst jetzt mit eingefugtem Text starten und spater Dateien oder Kamera nutzen.', demoTitle: 'Starte eine 10-Sekunden-Vorschau', demoSubtitle: 'Das ist der Kernmoment: unruhige Eingabe rein, nutzbare Infos raus.', previewThreadLabel: 'Vorschau-Thread', previewThreadText: 'Alex, kannst du das Briefing bis {sampleDate} prufen? Wenn sich etwas andert, schreib an hello@northstar.studio oder nutze https://northstar.studio/invite.', pulledOutForYou: 'Fur dich herausgezogen', runPreviewHint: 'Tippe auf "Vorschau starten", um genau die Details zu sehen, die die App zuerst hervorholt.', readyTitle: 'Dein Extraktor ist auf schnelle Ergebnisse eingestellt', readySubtitle: 'Du kannst alles spater andern, aber so kommst du am schnellsten auf dem Startscreen zum ersten Nutzen.', prioritizedOutputsTitle: 'Priorisierte Ergebnisse', prioritizedOutputsText: 'Schon beim ersten Scan stehen {typesSummary} ganz vorn.', bestFitSourcesTitle: 'Passende Quellen', bestFitSourcesText: 'Dein wahrscheinlich schnellster Erfolg kommt uber {sourcesSummary}.', frictionTitle: 'Genau fur diesen Engpass gebaut', painPoints: {
      retyping: {label: 'Ich tippe Details standig von Hand neu ab', description: 'Die Info ist schon da, aber noch nicht in einer brauchbaren Form.'},
      buried: {label: 'Wichtige Infos verschwinden in langen Threads', description: 'Ich verliere Zeit beim Suchen nach einem einzigen Detail.'},
      screenshots: {label: 'Ich speichere Screenshots und verarbeite sie nie', description: 'Wichtige Infos bleiben in der Galerie statt weiterverwendet zu werden.'},
      handoff: {label: 'Ich brauche schnell eine saubere Liste zum Teilen', description: 'Ich will Ergebnisse, die ich sofort kopieren, senden oder exportieren kann.'},
    },
  },
  extractor: {
    manualTextFallback: 'Manueller Text', importedSourceFallback: 'Importierte Quelle', sourceHelperText: 'Fuge einen kopierten Thread, eine Notiz oder Dokumenttext ein und die App zieht die gewahlten Datentypen heraus.', sourceHelperAttached: 'Quelle angehangt und scanbereit. Tippe dieselbe Option erneut an, um sie zu ersetzen.', sourceHelperChoose: 'Wahle eine Quelle, um fortzufahren.', extractData: 'Daten extrahieren', extracting: 'Extraktion lauft...', ready: 'Bereit', awaitingText: 'Warte auf Text', awaitingImport: 'Warte auf Import', extractHintReady: 'Extrahiere {typesSummary} aus der aktuellen Eingabe.', extractHintNeedText: 'Fuge Text ein, um die Extraktion zu aktivieren.', extractHintNeedImport: 'Importiere eine Quelle, um die Extraktion zu aktivieren.', importError: 'Quelle konnte nicht importiert werden. Bitte versuche es erneut.', extractionFailed: 'Extraktion fehlgeschlagen: {message}', unknownExtractionError: 'Unbekannter Extraktionsfehler', historySaveError: 'Die Ergebnisse wurden extrahiert, konnten aber nicht im Verlauf gespeichert werden.', clipboardEmpty: 'Die Zwischenablage ist leer.', pasteClipboardError: 'Einfügen aus der Zwischenablage nicht moglich.', itemCopied: 'In die Zwischenablage kopiert.', sectionCopied: '{countLabel} kopiert.', shareTitle: 'Extrahierte Ergebnisse', exportedMessage: '{countLabel} als {format} exportiert.', exportError: '{format}-Datei konnte nicht exportiert werden.', shareError: 'Diese Ergebnisse konnten nicht geteilt werden.', resultSectionHint: 'Tippe auf ein Ergebnis zum Kopieren oder nutze die Aktionen darunter.', inputEyebrow: 'Eingabe', inputTitle: 'Daten-Extraktor', inputSubtitle: 'Wahle oben eine Quelle, bereite den Inhalt hier vor und starte den Scan, sobald alles bereit ist.', pasteTextTitle: 'Text zum Scannen einfugen', importedSourceTitle: 'Importierte Quelle', pastePlaceholder: 'Text einfugen, um die gewahlten Datentypen zu scannen', noSourceSelected: 'Keine Quelle ausgewahlt', replaceSourceHint: 'Tippe oben dieselbe Quelle erneut an, um diese Datei zu ersetzen.', chooseSourceHint: 'Wahle eine Quelle, um fortzufahren.', resultsEyebrow: 'Ergebnisse', resultsTitle: 'Extrahierte Ergebnisse', resultsSubtitlePopulated: 'Die Ergebnisse sind nach Datentyp gruppiert, damit du jeden Abschnitt separat kopieren, teilen oder exportieren kannst.', resultsSubtitleEmpty: 'Deine extrahierten Daten erscheinen hier, sobald du einen Scan startest.', emptyEyebrow: 'Sobald du bereit bist', emptyTitle: 'Keine Ergebnisse gefunden', emptySubtitle: 'Fuge Text ein oder importiere eine Quelle und starte dann die Extraktion fur die gewahlten Ergebnistypen.',
  },
  history: {unknownTime: 'Unbekannte Zeit', noResultsStored: 'Keine Ergebnisse gespeichert', heroEyebrow: 'Verlauf', heroTitle: 'Letzte Extraktionssitzungen', heroSubtitle: 'Offne fruhere Scans erneut und springe direkt zur Registerkarte {homeTabLabel}, wobei Quelle und Ergebnisse wiederhergestellt werden.', emptyTitle: 'Noch kein Verlauf', emptyText: 'Abgeschlossene Scans erscheinen hier, damit du sie spater erneut offnen kannst.'},
  settings: {themeEyebrow: 'Design', themeTitle: 'Look auswahlen', dataTypesEyebrow: 'Datentypen', dataTypesTitle: 'Wahle, was extrahiert werden soll', dataTypesSubtitle: 'Diese Auswahl gilt appweit fur jeden neuen Scan.', themeUpdated: 'Design aktualisiert.', preferencesUpdated: 'Extraktionseinstellungen aktualisiert.', selectOneDataType: 'Wahle mindestens einen Datentyp aus.'},
  runtime: {nativeModuleUnavailable: 'Das Extraktionsmodul ist nicht verfugbar.', multiTypeUnavailable: 'Diese Quelle unterstutzt derzeit nur die Extraktion von E-Mails.', noSourceAssetSelected: 'Es wurde noch keine Quelle ausgewahlt.', unsupportedFileType: 'Dieser Dateityp wird nicht unterstutzt.', unableToExportExtractedItems: 'Extrahierte Eintrage konnten nicht exportiert werden.', fileMissing: 'An diesem Pfad existiert keine Datei: {path}', unableToReadImage: 'Bild an diesem Pfad konnte nicht gelesen werden: {path}', primaryOcrFailed: 'Der erste OCR-Durchlauf lieferte keinen brauchbaren Text.', highContrastOcrFailed: 'Auch der OCR-Fallback mit hohem Kontrast ist fehlgeschlagen.', unableToProcessImage: 'Dieses Bild konnte nicht verarbeitet werden.', unableToOpenPdf: 'PDF-Datei konnte nicht geoffnet werden.', pdfOcrFallbackFailed: 'OCR-Fallback fur PDF-Seite {page} fehlgeschlagen.', unableToDecodeTextFile: 'Textdatei konnte nicht dekodiert werden.'},
};

const fr: TranslationSet = {
  tabs: {home: 'Accueil', history: 'Historique', settings: 'Reglages'},
  common: {skip: 'Passer', continue: 'Continuer', getStarted: 'Commencer', keepGoing: 'Continuer', runPreview: 'Lancer l\'apercu', startExtracting: 'Commencer l\'extraction', back: 'Retour', stepCounter: 'Etape {current} sur {total}', copied: 'Copie', issue: 'Probleme', warnings: 'Avertissements', found: 'trouves', reset: 'Reinitialiser', copy: 'Copier', share: 'Partager', exportTxt: 'Exporter en TXT', exportCsv: 'Exporter en CSV', tapToCopy: 'Touchez pour copier', dismiss: 'Fermer'},
  dataTypes: {
    email: {label: 'E-mail', listLabel: 'adresses e-mail', goalLabel: 'Adresses e-mail', goalDescription: 'Transforme fils de discussion et captures d\'ecran en liste de contacts propre.', settingsDescription: 'Capture les adresses e-mail avec une detection tolerante a l\'OCR.', count: {one: '{count} e-mail', other: '{count} e-mails'}},
    date: {label: 'Dates', listLabel: 'dates', goalLabel: 'Dates et echeances', goalDescription: 'Repere vite les evenements, deadlines et moments de suivi.', settingsDescription: 'Detecte les dates dans le texte, les documents et les resultats OCR.', count: {one: '{count} date', other: '{count} dates'}},
    link: {label: 'Liens', listLabel: 'liens', goalLabel: 'Liens et references', goalDescription: 'Sort les URL enfouies dans de longs messages et documents.', settingsDescription: 'Extrait les URL et liens web du contenu scanne.', count: {one: '{count} lien', other: '{count} liens'}},
  },
  sources: {
    text: {label: 'Texte', listLabel: 'texte', extractorDescription: 'Coller du contenu copie', onboardingLabel: 'Texte copie', onboardingDescription: 'Fils, notes, documents copies'},
    camera: {label: 'Appareil photo', listLabel: 'camera', extractorDescription: 'Capturer sur le moment', onboardingLabel: 'Capture en direct', onboardingDescription: 'Recuperer les details sur place'},
    photos: {label: 'Photos', listLabel: 'captures d\'ecran', extractorDescription: 'Choisir dans la phototheque', onboardingLabel: 'Captures d\'ecran', onboardingDescription: 'Images deja dans votre galerie'},
    files: {label: 'Fichiers', listLabel: 'fichiers', extractorDescription: 'Importer un document', onboardingLabel: 'Fichiers', onboardingDescription: 'Docs, PDF et imports'},
  },
  themes: {
    light: {label: 'Clair', description: 'Des bleus frais de jour et des surfaces blanches.'},
    dark: {label: 'Sombre', description: 'Des tons ardoise profonds avec des accents bleus lumineux.'},
    solar: {label: 'Solaire', description: 'Des tons papier chauds avec un contraste ambre.'},
    mono: {label: 'Mono', description: 'Une palette de gris neutres avec contraste graphite.'},
  },
  onboarding: {
    welcomeEyebrow: 'Configuration rapide de depart', welcomeTitle: 'Transformez le fouillis en informations nettes', welcomeSubtitle: 'Collez un fil, scannez une capture ou importez un fichier. L\'app ressort uniquement ce qui compte vraiment.', sampleInputLabel: 'Exemple', sampleInputText: '"Pouvez-vous envoyer le fichier signe avant le {sampleDate} ? Sinon, ecrivez a hello@northstar.studio ou utilisez le lien du brief."', featureStartTitle: 'Un tap et c\'est parti', featureStartText: 'Choisissez une source et l\'ecran d\'accueil est pret juste apres la configuration.', featureWorkflowTitle: 'Adapte a votre facon de faire', featureWorkflowText: 'Nous ajustons l\'extracteur selon ce que vous sortez le plus souvent.', goalsTitle: 'De quoi avez-vous generalement besoin en premier ?', goalsSubtitle: 'Choisissez tout ce qui vous ferait gagner du temps des le premier jour.', painTitle: 'Qu\'est-ce qui vous ralentit le plus ?', painSubtitle: 'Choisissez celui qui vous parle le plus.', sourcesTitle: 'Ou se trouve generalement le bazar ?', sourcesSubtitle: 'Nous allons adapter le premier parcours aux sources que vous utilisez le plus.', permissionTimingTitle: 'Moment des autorisations', permissionTimingMedia: 'L\'acces aux photos et a la camera n\'est demande que lorsque vous touchez ces outils.', permissionTimingText: 'Vous pouvez commencer avec du texte colle, puis ajouter fichiers ou camera plus tard.', demoTitle: 'Lancer un apercu de 10 secondes', demoSubtitle: 'C\'est le moment cle : une entree brouillonne, des details exploitables en sortie.', previewThreadLabel: 'Fil d\'apercu', previewThreadText: 'Alex, peux-tu relire le brief avant le {sampleDate} ? Si quelque chose change, ecris a hello@northstar.studio ou utilise https://northstar.studio/invite.', pulledOutForYou: 'Ce qui a ete extrait', runPreviewHint: 'Touchez "Lancer l\'apercu" pour voir exactement les details que l\'app ferait remonter en premier.', readyTitle: 'Votre extracteur est regle pour des gains rapides', readySubtitle: 'Vous pourrez toujours modifier cela plus tard, mais cette configuration est le chemin le plus rapide vers la valeur sur l\'accueil.', prioritizedOutputsTitle: 'Sorties prioritaires', prioritizedOutputsText: 'Des le premier scan, nous mettrons {typesSummary} en avant.', bestFitSourcesTitle: 'Sources les plus pertinentes', bestFitSourcesText: 'Votre premier gain viendra probablement de {sourcesSummary}.', frictionTitle: 'Concu pour enlever ce point de friction', painPoints: {
      retyping: {label: 'Je retape sans cesse les informations a la main', description: 'Les infos sont deja la, mais pas encore dans un format utile.'},
      buried: {label: 'Les infos importantes se perdent dans de longs fils', description: 'Je perds du temps a fouiller les messages pour un seul detail.'},
      screenshots: {label: 'Je garde des captures sans jamais les traiter', description: 'Des infos utiles dorment dans ma galerie au lieu de devenir actionnables.'},
      handoff: {label: 'J\'ai besoin d\'une liste propre a partager vite', description: 'Je veux des resultats que je peux copier, envoyer ou exporter tout de suite.'},
    },
  },
  extractor: {
    manualTextFallback: 'Texte saisi', importedSourceFallback: 'Source importee', sourceHelperText: 'Collez un fil, une note ou du texte de document et l\'app extraira les types de donnees choisis.', sourceHelperAttached: 'Source jointe et prete a etre analysee. Touchez la meme option pour la remplacer.', sourceHelperChoose: 'Choisissez une source pour continuer.', extractData: 'Extraire les donnees', extracting: 'Extraction en cours...', ready: 'Pret', awaitingText: 'En attente de texte', awaitingImport: 'En attente d\'import', extractHintReady: 'Extraire {typesSummary} a partir de l\'entree actuelle.', extractHintNeedText: 'Collez du texte pour activer l\'extraction.', extractHintNeedImport: 'Importez une source pour activer l\'extraction.', importError: 'Impossible d\'importer la source. Reessayez.', extractionFailed: 'Echec de l\'extraction : {message}', unknownExtractionError: 'Erreur d\'extraction inconnue', historySaveError: 'Les resultats ont ete extraits, mais l\'historique n\'a pas pu etre enregistre.', clipboardEmpty: 'Le presse-papiers est vide.', pasteClipboardError: 'Impossible de coller depuis le presse-papiers.', itemCopied: 'Element copie dans le presse-papiers.', sectionCopied: '{countLabel} copies.', shareTitle: 'Resultats extraits', exportedMessage: '{countLabel} exportes en {format}.', exportError: 'Impossible d\'exporter le fichier {format}.', shareError: 'Impossible de partager ces resultats.', resultSectionHint: 'Touchez un resultat pour le copier, ou utilisez les actions ci-dessous.', inputEyebrow: 'Entree', inputTitle: 'Extracteur de donnees', inputSubtitle: 'Choisissez une source ci-dessus, preparez le contenu ici, puis lancez l\'analyse quand tout est pret.', pasteTextTitle: 'Coller le texte a analyser', importedSourceTitle: 'Source importee', pastePlaceholder: 'Collez le texte a analyser pour les types de donnees selectionnes', noSourceSelected: 'Aucune source selectionnee', replaceSourceHint: 'Touchez la meme source ci-dessus pour remplacer ce fichier.', chooseSourceHint: 'Choisissez une source pour continuer.', resultsEyebrow: 'Resultats', resultsTitle: 'Resultats extraits', resultsSubtitlePopulated: 'Les resultats sont regroupes par type de donnee pour pouvoir etre copies, partages ou exportes separement.', resultsSubtitleEmpty: 'Vos donnees extraites apparaitront ici des que vous lancerez une analyse.', emptyEyebrow: 'Quand vous voulez', emptyTitle: 'Aucun resultat trouve', emptySubtitle: 'Collez du texte ou importez une source, puis lancez l\'extraction pour remplir les types de resultat selectionnes.',
  },
  history: {unknownTime: 'Heure inconnue', noResultsStored: 'Aucun resultat enregistre', heroEyebrow: 'Historique', heroTitle: 'Dernieres sessions d\'extraction', heroSubtitle: 'Rouvrez vos analyses precedentes et revenez directement a l\'onglet {homeTabLabel} avec la source et les resultats restaures.', emptyTitle: 'Pas encore d\'historique', emptyText: 'Les analyses terminees apparaitront ici pour pouvoir etre rouvertes plus tard.'},
  settings: {themeEyebrow: 'Theme', themeTitle: 'Choisir un style', dataTypesEyebrow: 'Types de donnees', dataTypesTitle: 'Choisissez ce qu\'il faut extraire', dataTypesSubtitle: 'Ces choix s\'appliquent a toute l\'app pour chaque nouvelle analyse.', themeUpdated: 'Theme mis a jour.', preferencesUpdated: 'Preferences d\'extraction mises a jour.', selectOneDataType: 'Selectionnez au moins un type de donnee.'},
  runtime: {nativeModuleUnavailable: 'Le module d\'extraction n\'est pas disponible.', multiTypeUnavailable: 'Cette source prend actuellement en charge l\'extraction d\'e-mails uniquement.', noSourceAssetSelected: 'Aucune source n\'a encore ete selectionnee.', unsupportedFileType: 'Ce type de fichier n\'est pas pris en charge.', unableToExportExtractedItems: 'Impossible d\'exporter les elements extraits.', fileMissing: 'Aucun fichier n\'existe a cet emplacement : {path}', unableToReadImage: 'Impossible de lire l\'image a cet emplacement : {path}', primaryOcrFailed: 'Le premier passage OCR n\'a pas fourni de texte exploitable.', highContrastOcrFailed: 'La tentative OCR de secours a fort contraste a aussi echoue.', unableToProcessImage: 'Impossible de traiter cette image.', unableToOpenPdf: 'Impossible d\'ouvrir le fichier PDF.', pdfOcrFallbackFailed: 'Le repli OCR a echoue pour la page {page} du PDF.', unableToDecodeTextFile: 'Impossible de decoder le fichier texte.'},
};

const es: TranslationSet = {
  tabs: {home: 'Inicio', history: 'Historial', settings: 'Ajustes'},
  common: {skip: 'Omitir', continue: 'Continuar', getStarted: 'Empezar', keepGoing: 'Seguir', runPreview: 'Probar vista previa', startExtracting: 'Empezar a extraer', back: 'Atras', stepCounter: 'Paso {current} de {total}', copied: 'Copiado', issue: 'Problema', warnings: 'Avisos', found: 'encontrados', reset: 'Restablecer', copy: 'Copiar', share: 'Compartir', exportTxt: 'Exportar TXT', exportCsv: 'Exportar CSV', tapToCopy: 'Toca para copiar', dismiss: 'Cerrar'},
  dataTypes: {
    email: {label: 'Correo', listLabel: 'correos electronicos', goalLabel: 'Direcciones de correo', goalDescription: 'Convierte chats y capturas en una lista de contactos limpia.', settingsDescription: 'Detecta correos con coincidencia tolerante a errores de OCR.', count: {one: '{count} correo', other: '{count} correos'}},
    date: {label: 'Fechas', listLabel: 'fechas', goalLabel: 'Fechas y vencimientos', goalDescription: 'Detecta eventos, plazos y seguimientos con rapidez.', settingsDescription: 'Encuentra fechas en texto, documentos y resultados OCR.', count: {one: '{count} fecha', other: '{count} fechas'}},
    link: {label: 'Enlaces', listLabel: 'enlaces', goalLabel: 'Enlaces y referencias', goalDescription: 'Saca URLs escondidas en mensajes largos y documentos.', settingsDescription: 'Extrae URLs y enlaces web del contenido escaneado.', count: {one: '{count} enlace', other: '{count} enlaces'}},
  },
  sources: {
    text: {label: 'Texto', listLabel: 'texto', extractorDescription: 'Pegar contenido copiado', onboardingLabel: 'Texto copiado', onboardingDescription: 'Chats, notas, documentos copiados'},
    camera: {label: 'Camara', listLabel: 'camara', extractorDescription: 'Capturar al momento', onboardingLabel: 'Captura en vivo', onboardingDescription: 'Recoger datos sobre la marcha'},
    photos: {label: 'Fotos', listLabel: 'capturas', extractorDescription: 'Elegir de la galeria', onboardingLabel: 'Capturas de pantalla', onboardingDescription: 'Imagenes que ya tienes en tu galeria'},
    files: {label: 'Archivos', listLabel: 'archivos', extractorDescription: 'Importar documento', onboardingLabel: 'Archivos', onboardingDescription: 'Docs, PDF e importaciones'},
  },
  themes: {light: {label: 'Claro', description: 'Azules luminosos y superficies blancas.'}, dark: {label: 'Oscuro', description: 'Tonos pizarra con acentos azules vivos.'}, solar: {label: 'Solar', description: 'Tonos calidos de papel con contraste ambar.'}, mono: {label: 'Mono', description: 'Escala de grises neutra con contraste grafito.'}},
  onboarding: {
    welcomeEyebrow: 'Configuracion inicial rapida', welcomeTitle: 'Convierte mensajes desordenados en datos claros', welcomeSubtitle: 'Pega un hilo, escanea una captura o importa un archivo. La app saca justo lo que de verdad necesitas.', sampleInputLabel: 'Ejemplo', sampleInputText: '"Puedes enviar el archivo firmado antes del {sampleDate}? Si no, escribe a hello@northstar.studio o usa el enlace del briefing."', featureStartTitle: 'Empiezas con un toque', featureStartText: 'Elige una fuente y la pantalla de inicio queda lista al terminar la configuracion.', featureWorkflowTitle: 'Se adapta a tu forma de trabajar', featureWorkflowText: 'Ajustamos el extractor segun lo que mas sueles sacar.', goalsTitle: 'Que sueles necesitar primero?', goalsSubtitle: 'Marca todo lo que mas tiempo te ahorraria desde el primer dia.', painTitle: 'Que es lo que mas te frena?', painSubtitle: 'Elige el que te suene demasiado familiar.', sourcesTitle: 'Donde suele estar el caos?', sourcesSubtitle: 'Ajustaremos la primera experiencia a las fuentes que mas usas.', permissionTimingTitle: 'Cuando pedimos permisos', permissionTimingMedia: 'El acceso a fotos y camara solo se solicita cuando tocas esas herramientas.', permissionTimingText: 'Puedes empezar ahora con texto pegado y usar archivos o camara mas tarde.', demoTitle: 'Haz una vista previa de 10 segundos', demoSubtitle: 'Este es el momento clave: entra contenido caotico y salen datos utiles.', previewThreadLabel: 'Hilo de muestra', previewThreadText: 'Alex, puedes revisar el briefing antes del {sampleDate}? Si cambia algo, escribe a hello@northstar.studio o usa https://northstar.studio/invite.', pulledOutForYou: 'Extraido para ti', runPreviewHint: 'Toca "Probar vista previa" para ver exactamente que datos mostraria primero la app.', readyTitle: 'Tu extractor esta afinado para darte resultados rapidos', readySubtitle: 'Luego puedes cambiarlo todo, pero asi llegas mas rapido al valor desde la pantalla principal.', prioritizedOutputsTitle: 'Resultados prioritarios', prioritizedOutputsText: 'Desde el primer escaneo pondremos {typesSummary} en primer plano.', bestFitSourcesTitle: 'Fuentes mas utiles', bestFitSourcesText: 'Tu primer resultado rapido seguramente vendra de {sourcesSummary}.', frictionTitle: 'Hecho para quitar esta friccion', painPoints: {
      retyping: {label: 'Sigo reescribiendo datos a mano', description: 'La informacion ya esta, pero no en un formato que me sirva.'},
      buried: {label: 'La informacion importante se pierde en hilos largos', description: 'Pierdo tiempo buscando un detalle entre mensajes.'},
      screenshots: {label: 'Guardo capturas y nunca las proceso', description: 'Los datos utiles se quedan en la galeria en vez de convertirse en accion.'},
      handoff: {label: 'Necesito una lista limpia para compartir rapido', description: 'Quiero resultados que pueda copiar, enviar o exportar al instante.'},
    },
  },
  extractor: {
    manualTextFallback: 'Texto manual', importedSourceFallback: 'Fuente importada', sourceHelperText: 'Pega cualquier hilo, nota o texto de documento y la app sacara los tipos de datos seleccionados.', sourceHelperAttached: 'Fuente adjunta y lista para escanear. Toca la misma opcion para reemplazarla.', sourceHelperChoose: 'Elige una fuente para continuar.', extractData: 'Extraer datos', extracting: 'Extrayendo...', ready: 'Listo', awaitingText: 'Esperando texto', awaitingImport: 'Esperando importacion', extractHintReady: 'Extraer {typesSummary} de la entrada actual.', extractHintNeedText: 'Pega texto para activar la extraccion.', extractHintNeedImport: 'Importa una fuente para activar la extraccion.', importError: 'No se pudo importar la fuente. Intentalo de nuevo.', extractionFailed: 'La extraccion fallo: {message}', unknownExtractionError: 'Error de extraccion desconocido', historySaveError: 'Se extrajeron los resultados, pero no se pudieron guardar en el historial.', clipboardEmpty: 'El portapapeles esta vacio.', pasteClipboardError: 'No se pudo pegar desde el portapapeles.', itemCopied: 'Elemento copiado al portapapeles.', sectionCopied: 'Se ha copiado {countLabel}.', shareTitle: 'Resultados extraidos', exportedMessage: 'Se exporto {countLabel} como {format}.', exportError: 'No se pudo exportar el archivo {format}.', shareError: 'No se pudieron compartir estos resultados.', resultSectionHint: 'Toca cualquier resultado para copiarlo o usa las acciones de abajo.', inputEyebrow: 'Entrada', inputTitle: 'Extractor de datos', inputSubtitle: 'Selecciona arriba una fuente, prepara aqui el contenido y lanza el analisis cuando este listo.', pasteTextTitle: 'Pega texto para analizar', importedSourceTitle: 'Fuente importada', pastePlaceholder: 'Pega texto para analizar los tipos de datos seleccionados', noSourceSelected: 'Ninguna fuente seleccionada', replaceSourceHint: 'Toca la misma fuente arriba para reemplazar este archivo.', chooseSourceHint: 'Elige una fuente para continuar.', resultsEyebrow: 'Resultados', resultsTitle: 'Resultados extraidos', resultsSubtitlePopulated: 'Los resultados se agrupan por tipo de dato para poder copiarlos, compartirlos o exportarlos por separado.', resultsSubtitleEmpty: 'Tus datos extraidos apareceran aqui en cuanto lances un analisis.', emptyEyebrow: 'Cuando quieras', emptyTitle: 'No se encontraron resultados', emptySubtitle: 'Pega texto o importa una fuente y luego ejecuta la extraccion para llenar los tipos de resultado seleccionados.',
  },
  history: {unknownTime: 'Hora desconocida', noResultsStored: 'No hay resultados guardados', heroEyebrow: 'Historial', heroTitle: 'Ultimas sesiones de extraccion', heroSubtitle: 'Vuelve a abrir analisis anteriores y salta directo a la pestana {homeTabLabel} con la fuente y los resultados restaurados.', emptyTitle: 'Todavia no hay historial', emptyText: 'Los analisis completados apareceran aqui para que puedas reabrirlos despues.'},
  settings: {themeEyebrow: 'Tema', themeTitle: 'Elige un estilo', dataTypesEyebrow: 'Tipos de datos', dataTypesTitle: 'Elige que extraer', dataTypesSubtitle: 'Estas selecciones se aplican en toda la app a cada analisis nuevo.', themeUpdated: 'Tema actualizado.', preferencesUpdated: 'Preferencias de extraccion actualizadas.', selectOneDataType: 'Selecciona al menos un tipo de dato.'},
  runtime: {nativeModuleUnavailable: 'El modulo de extraccion no esta disponible.', multiTypeUnavailable: 'Esta fuente solo admite extraccion de correos por ahora.', noSourceAssetSelected: 'Todavia no se ha seleccionado ninguna fuente.', unsupportedFileType: 'Este tipo de archivo no es compatible.', unableToExportExtractedItems: 'No se pudieron exportar los elementos extraidos.', fileMissing: 'No existe ningun archivo en esta ruta: {path}', unableToReadImage: 'No se pudo leer la imagen en esta ruta: {path}', primaryOcrFailed: 'La primera pasada de OCR no devolvio texto util.', highContrastOcrFailed: 'Tambien fallo el OCR de respaldo con alto contraste.', unableToProcessImage: 'No se pudo procesar esta imagen.', unableToOpenPdf: 'No se pudo abrir el archivo PDF.', pdfOcrFallbackFailed: 'Fallo el OCR de respaldo en la pagina {page} del PDF.', unableToDecodeTextFile: 'No se pudo decodificar el archivo de texto.'},
};

const ptBR: TranslationSet = {
  tabs: {home: 'Inicio', history: 'Historico', settings: 'Ajustes'},
  common: {skip: 'Pular', continue: 'Continuar', getStarted: 'Comecar', keepGoing: 'Seguir', runPreview: 'Rodar preview', startExtracting: 'Comecar extracao', back: 'Voltar', stepCounter: 'Etapa {current} de {total}', copied: 'Copiado', issue: 'Problema', warnings: 'Avisos', found: 'encontrados', reset: 'Limpar', copy: 'Copiar', share: 'Compartilhar', exportTxt: 'Exportar TXT', exportCsv: 'Exportar CSV', tapToCopy: 'Toque para copiar', dismiss: 'Fechar'},
  dataTypes: {
    email: {label: 'E-mail', listLabel: 'enderecos de e-mail', goalLabel: 'Enderecos de e-mail', goalDescription: 'Transforma conversas e capturas em uma lista de contatos limpa.', settingsDescription: 'Captura e-mails com correspondencia tolerante a erros de OCR.', count: {one: '{count} e-mail', other: '{count} e-mails'}},
    date: {label: 'Datas', listLabel: 'datas', goalLabel: 'Datas e prazos', goalDescription: 'Encontra eventos, vencimentos e momentos de acompanhamento bem rapido.', settingsDescription: 'Detecta datas em texto, documentos e saida de OCR.', count: {one: '{count} data', other: '{count} datas'}},
    link: {label: 'Links', listLabel: 'links', goalLabel: 'Links e referencias', goalDescription: 'Puxa URLs escondidas em mensagens longas e documentos.', settingsDescription: 'Extrai URLs e links da web do conteudo escaneado.', count: {one: '{count} link', other: '{count} links'}},
  },
  sources: {
    text: {label: 'Texto', listLabel: 'texto', extractorDescription: 'Colar conteudo copiado', onboardingLabel: 'Texto copiado', onboardingDescription: 'Conversas, notas, documentos copiados'},
    camera: {label: 'Camera', listLabel: 'camera', extractorDescription: 'Capturar na hora', onboardingLabel: 'Captura ao vivo', onboardingDescription: 'Pegar os detalhes na hora'},
    photos: {label: 'Fotos', listLabel: 'capturas de tela', extractorDescription: 'Escolher da galeria', onboardingLabel: 'Capturas de tela', onboardingDescription: 'Imagens que ja estao na sua biblioteca'},
    files: {label: 'Arquivos', listLabel: 'arquivos', extractorDescription: 'Importar documento', onboardingLabel: 'Arquivos', onboardingDescription: 'Docs, PDFs e importacoes'},
  },
  themes: {light: {label: 'Claro', description: 'Azuis leves de dia com superficies brancas.'}, dark: {label: 'Escuro', description: 'Tons profundos com acentos azuis luminosos.'}, solar: {label: 'Solar', description: 'Tons quentes de papel com contraste ambar.'}, mono: {label: 'Mono', description: 'Escala neutra de cinza com contraste grafite.'}},
  onboarding: {
    welcomeEyebrow: 'Configuracao inicial rapida', welcomeTitle: 'Transforme bagunca em informacao organizada', welcomeSubtitle: 'Cole uma conversa, escaneie uma captura ou importe um arquivo. O app puxa so o que realmente importa.', sampleInputLabel: 'Exemplo', sampleInputText: '"Voce consegue enviar o arquivo assinado ate {sampleDate}? Se nao, mande para hello@northstar.studio ou use o link do briefing."', featureStartTitle: 'Comeca com um toque', featureStartText: 'Escolha uma fonte e a tela inicial fica pronta logo depois da configuracao.', featureWorkflowTitle: 'Se adapta ao seu fluxo', featureWorkflowText: 'Vamos ajustar o extrator ao que voce mais costuma tirar das mensagens.', goalsTitle: 'O que voce costuma precisar primeiro?', goalsSubtitle: 'Marque tudo o que mais faria voce ganhar tempo no primeiro dia.', painTitle: 'O que mais te atrasa?', painSubtitle: 'Escolha o que parece familiar demais.', sourcesTitle: 'Onde a bagunca costuma estar?', sourcesSubtitle: 'Vamos ajustar a primeira experiencia em torno das fontes que voce mais usa.', permissionTimingTitle: 'Momento dos acessos', permissionTimingMedia: 'O acesso a fotos e camera so e pedido quando voce toca nessas ferramentas.', permissionTimingText: 'Voce pode comecar agora com texto colado e deixar arquivos ou camera para depois.', demoTitle: 'Rodar um preview de 10 segundos', demoSubtitle: 'Esse e o momento principal: entra conteudo baguncado, sai dado util.', previewThreadLabel: 'Preview da conversa', previewThreadText: 'Alex, voce pode revisar o briefing ate {sampleDate}? Se algo mudar, fale com hello@northstar.studio ou use https://northstar.studio/invite.', pulledOutForYou: 'Extraido para voce', runPreviewHint: 'Toque em "Rodar preview" para ver exatamente o que o app destacaria primeiro.', readyTitle: 'Seu extrator esta ajustado para ganhos rapidos', readySubtitle: 'Da para mudar tudo depois, mas assim voce chega mais rapido ao resultado na tela inicial.', prioritizedOutputsTitle: 'Saidas priorizadas', prioritizedOutputsText: 'Desde o primeiro scan, {typesSummary} vao aparecer em destaque.', bestFitSourcesTitle: 'Fontes mais adequadas', bestFitSourcesText: 'Sua primeira vitoria mais provavel vem de {sourcesSummary}.', frictionTitle: 'Feito para tirar esse atrito', painPoints: {
      retyping: {label: 'Eu fico redigitando detalhes na mao', description: 'A informacao ja existe, so nao esta em um formato util.'},
      buried: {label: 'Informacao importante some em conversas longas', description: 'Perco tempo varrendo mensagens para achar um detalhe.'},
      screenshots: {label: 'Eu salvo capturas e nunca processo depois', description: 'Detalhes uteis ficam largados na galeria em vez de virar acao.'},
      handoff: {label: 'Eu preciso de uma lista limpa para compartilhar rapido', description: 'Quero resultados que eu possa copiar, enviar ou exportar na hora.'},
    },
  },
  extractor: {
    manualTextFallback: 'Texto manual', importedSourceFallback: 'Fonte importada', sourceHelperText: 'Cole qualquer conversa, nota ou texto de documento e o app vai extrair os tipos de dado selecionados.', sourceHelperAttached: 'Fonte anexada e pronta para escanear. Toque na mesma opcao para trocar.', sourceHelperChoose: 'Escolha uma fonte para continuar.', extractData: 'Extrair dados', extracting: 'Extraindo...', ready: 'Pronto', awaitingText: 'Aguardando texto', awaitingImport: 'Aguardando importacao', extractHintReady: 'Extrair {typesSummary} da entrada atual.', extractHintNeedText: 'Cole algum texto para liberar a extracao.', extractHintNeedImport: 'Importe uma fonte para liberar a extracao.', importError: 'Nao foi possivel importar a fonte. Tente de novo.', extractionFailed: 'Falha na extracao: {message}', unknownExtractionError: 'Erro de extracao desconhecido', historySaveError: 'Os resultados foram extraidos, mas nao foi possivel salvar no historico.', clipboardEmpty: 'A area de transferencia esta vazia.', pasteClipboardError: 'Nao foi possivel colar da area de transferencia.', itemCopied: 'Item copiado para a area de transferencia.', sectionCopied: '{countLabel} copiados.', shareTitle: 'Resultados extraidos', exportedMessage: '{countLabel} exportados como {format}.', exportError: 'Nao foi possivel exportar o arquivo {format}.', shareError: 'Nao foi possivel compartilhar esses resultados.', resultSectionHint: 'Toque em qualquer resultado para copiar ou use as acoes abaixo.', inputEyebrow: 'Entrada', inputTitle: 'Extrator de dados', inputSubtitle: 'Escolha uma fonte acima, prepare o conteudo aqui e rode a analise quando estiver tudo pronto.', pasteTextTitle: 'Cole o texto para analisar', importedSourceTitle: 'Fonte importada', pastePlaceholder: 'Cole texto para analisar os tipos de dado selecionados', noSourceSelected: 'Nenhuma fonte selecionada', replaceSourceHint: 'Toque na mesma fonte acima para substituir este arquivo.', chooseSourceHint: 'Escolha uma fonte para continuar.', resultsEyebrow: 'Resultados', resultsTitle: 'Resultados extraidos', resultsSubtitlePopulated: 'Os resultados sao agrupados por tipo de dado para que cada bloco possa ser copiado, compartilhado ou exportado separadamente.', resultsSubtitleEmpty: 'Os dados extraidos vao aparecer aqui assim que voce rodar uma analise.', emptyEyebrow: 'Quando quiser', emptyTitle: 'Nenhum resultado encontrado', emptySubtitle: 'Cole texto ou importe uma fonte e depois rode a extracao para preencher os tipos de resultado selecionados.',
  },
  history: {unknownTime: 'Horario desconhecido', noResultsStored: 'Nenhum resultado salvo', heroEyebrow: 'Historico', heroTitle: 'Ultimas sessoes de extracao', heroSubtitle: 'Abra scans anteriores e volte direto para a aba {homeTabLabel} com a fonte e os resultados restaurados.', emptyTitle: 'Ainda nao ha historico', emptyText: 'Os scans concluidos aparecem aqui para voce reabrir depois.'},
  settings: {themeEyebrow: 'Tema', themeTitle: 'Escolha um visual', dataTypesEyebrow: 'Tipos de dado', dataTypesTitle: 'Escolha o que extrair', dataTypesSubtitle: 'Essas selecoes valem para todo novo scan no app.', themeUpdated: 'Tema atualizado.', preferencesUpdated: 'Preferencias de extracao atualizadas.', selectOneDataType: 'Selecione pelo menos um tipo de dado.'},
  runtime: {nativeModuleUnavailable: 'O modulo de extracao nao esta disponivel.', multiTypeUnavailable: 'Essa fonte so aceita extracao de e-mail por enquanto.', noSourceAssetSelected: 'Ainda nao foi selecionada nenhuma fonte.', unsupportedFileType: 'Esse tipo de arquivo nao e suportado.', unableToExportExtractedItems: 'Nao foi possivel exportar os itens extraidos.', fileMissing: 'Nao existe arquivo neste caminho: {path}', unableToReadImage: 'Nao foi possivel ler a imagem neste caminho: {path}', primaryOcrFailed: 'A primeira passada de OCR nao retornou texto utilizavel.', highContrastOcrFailed: 'A tentativa de OCR com alto contraste tambem falhou.', unableToProcessImage: 'Nao foi possivel processar esta imagem.', unableToOpenPdf: 'Nao foi possivel abrir o arquivo PDF.', pdfOcrFallbackFailed: 'Falha no OCR de contingencia da pagina {page} do PDF.', unableToDecodeTextFile: 'Nao foi possivel decodificar o arquivo de texto.'},
};

const ru: TranslationSet = {
  tabs: {home: 'Главная', history: 'История', settings: 'Настройки'},
  common: {skip: 'Пропустить', continue: 'Далее', getStarted: 'Начать', keepGoing: 'Продолжить', runPreview: 'Запустить предпросмотр', startExtracting: 'Начать извлечение', back: 'Назад', stepCounter: 'Шаг {current} из {total}', copied: 'Скопировано', issue: 'Проблема', warnings: 'Предупреждения', found: 'найдено', reset: 'Сбросить', copy: 'Копировать', share: 'Поделиться', exportTxt: 'Экспорт TXT', exportCsv: 'Экспорт CSV', tapToCopy: 'Нажмите, чтобы скопировать', dismiss: 'Закрыть'},
  dataTypes: {
    email: {label: 'Почта', listLabel: 'адреса электронной почты', goalLabel: 'Адреса электронной почты', goalDescription: 'Превращает переписки и скриншоты в аккуратный список контактов.', settingsDescription: 'Извлекает адреса почты с учетом ошибок OCR.', count: {one: '{count} email', few: '{count} email', many: '{count} email', other: '{count} email'}},
    date: {label: 'Даты', listLabel: 'даты', goalLabel: 'Даты и дедлайны', goalDescription: 'Быстро находит события, сроки и точки для follow-up.', settingsDescription: 'Распознает даты в тексте, документах и OCR.', count: {one: '{count} дата', few: '{count} даты', many: '{count} дат', other: '{count} даты'}},
    link: {label: 'Ссылки', listLabel: 'ссылки', goalLabel: 'Ссылки и материалы', goalDescription: 'Достает спрятанные URL из длинных сообщений и документов.', settingsDescription: 'Извлекает URL и веб-ссылки из отсканированного контента.', count: {one: '{count} ссылка', few: '{count} ссылки', many: '{count} ссылок', other: '{count} ссылки'}},
  },
  sources: {
    text: {label: 'Текст', listLabel: 'текст', extractorDescription: 'Вставить скопированный текст', onboardingLabel: 'Скопированный текст', onboardingDescription: 'Переписки, заметки, скопированные документы'},
    camera: {label: 'Камера', listLabel: 'камера', extractorDescription: 'Снять на месте', onboardingLabel: 'Съемка в моменте', onboardingDescription: 'Сразу захватить нужные детали'},
    photos: {label: 'Фото', listLabel: 'скриншоты', extractorDescription: 'Выбрать из галереи', onboardingLabel: 'Скриншоты', onboardingDescription: 'Изображения, которые уже есть в библиотеке'},
    files: {label: 'Файлы', listLabel: 'файлы', extractorDescription: 'Импортировать документ', onboardingLabel: 'Файлы', onboardingDescription: 'Документы, PDF и импортированные файлы'},
  },
  themes: {light: {label: 'Светлая', description: 'Свежие дневные синие оттенки и белые поверхности.'}, dark: {label: 'Темная', description: 'Глубокие графитовые поверхности с яркими синими акцентами.'}, solar: {label: 'Солнечная', description: 'Теплые бумажные тона с янтарным контрастом.'}, mono: {label: 'Моно', description: 'Нейтральная серо-графитовая палитра.'}},
  onboarding: {
    welcomeEyebrow: 'Быстрая первая настройка', welcomeTitle: 'Превратите хаос в понятные данные', welcomeSubtitle: 'Вставьте переписку, отсканируйте скриншот или импортируйте файл. Приложение вытянет только то, что действительно нужно.', sampleInputLabel: 'Пример', sampleInputText: '"Сможете отправить подписанный файл до {sampleDate}? Если нет, напишите на hello@northstar.studio или используйте ссылку из брифа."', featureStartTitle: 'Старт в одно касание', featureStartText: 'Выберите источник, и главный экран сразу будет готов к работе.', featureWorkflowTitle: 'Под ваш рабочий ритм', featureWorkflowText: 'Мы подстроим экстрактор под то, что вы чаще всего достаете из контента.', goalsTitle: 'Что вам обычно нужно в первую очередь?', goalsSubtitle: 'Отметьте все, что сильнее всего экономит время уже в первый день.', painTitle: 'Что сильнее всего тормозит?', painSubtitle: 'Выберите то, что звучит слишком знакомо.', sourcesTitle: 'Где обычно прячется весь этот хаос?', sourcesSubtitle: 'Первый сценарий будет настроен вокруг тех источников, к которым вы обращаетесь чаще всего.', permissionTimingTitle: 'Когда запрашиваются доступы', permissionTimingMedia: 'Доступ к фото и камере запрашивается только тогда, когда вы нажимаете на эти инструменты.', permissionTimingText: 'Сейчас можно начать с вставленного текста, а файлы и камеру подключить позже.', demoTitle: 'Запустите 10-секундный предпросмотр', demoSubtitle: 'Это и есть главный момент: на входе беспорядок, на выходе полезные детали.', previewThreadLabel: 'Предпросмотр переписки', previewThreadText: 'Alex, сможете посмотреть бриф до {sampleDate}? Если что-то изменится, напишите на hello@northstar.studio или используйте https://northstar.studio/invite.', pulledOutForYou: 'Что будет извлечено', runPreviewHint: 'Нажмите "Запустить предпросмотр", чтобы увидеть, какие именно детали приложение покажет первыми.', readyTitle: 'Экстрактор настроен на быстрый результат', readySubtitle: 'Позже это всегда можно поменять, но сейчас это самый короткий путь к пользе на главном экране.', prioritizedOutputsTitle: 'Приоритетные результаты', prioritizedOutputsText: 'С первого скана на первом плане будут {typesSummary}.', bestFitSourcesTitle: 'Лучшие источники', bestFitSourcesText: 'Скорее всего первый быстрый результат придет из {sourcesSummary}.', frictionTitle: 'Сделано, чтобы убрать именно это трение', painPoints: {
      retyping: {label: 'Я постоянно перепечатываю детали вручную', description: 'Информация уже есть, но не в удобном для работы виде.'},
      buried: {label: 'Важное тонет в длинных переписках', description: 'Я трачу время на поиск одного нужного фрагмента.'},
      screenshots: {label: 'Я сохраняю скриншоты и потом не разбираю их', description: 'Полезные данные лежат в галерее и не превращаются в действие.'},
      handoff: {label: 'Мне нужен чистый список, которым можно быстро поделиться', description: 'Я хочу результат, который можно сразу скопировать, отправить или экспортировать.'},
    },
  },
  extractor: {
    manualTextFallback: 'Введенный текст', importedSourceFallback: 'Импортированный источник', sourceHelperText: 'Вставьте переписку, заметку или текст документа, и приложение извлечет выбранные типы данных.', sourceHelperAttached: 'Источник прикреплен и готов к сканированию. Нажмите ту же опцию еще раз, чтобы заменить его.', sourceHelperChoose: 'Выберите источник, чтобы продолжить.', extractData: 'Извлечь данные', extracting: 'Извлечение...', ready: 'Готово', awaitingText: 'Ожидается текст', awaitingImport: 'Ожидается импорт', extractHintReady: 'Извлечь {typesSummary} из текущего ввода.', extractHintNeedText: 'Вставьте текст, чтобы включить извлечение.', extractHintNeedImport: 'Импортируйте источник, чтобы включить извлечение.', importError: 'Не удалось импортировать источник. Попробуйте еще раз.', extractionFailed: 'Ошибка извлечения: {message}', unknownExtractionError: 'Неизвестная ошибка извлечения', historySaveError: 'Результаты извлечены, но сохранить их в историю не удалось.', clipboardEmpty: 'Буфер обмена пуст.', pasteClipboardError: 'Не удалось вставить из буфера обмена.', itemCopied: 'Элемент скопирован в буфер обмена.', sectionCopied: 'Скопировано: {countLabel}.', shareTitle: 'Извлеченные результаты', exportedMessage: 'Экспортировано {countLabel} в формате {format}.', exportError: 'Не удалось экспортировать файл {format}.', shareError: 'Не удалось поделиться этими результатами.', resultSectionHint: 'Нажмите на любой результат, чтобы скопировать, или используйте действия ниже.', inputEyebrow: 'Ввод', inputTitle: 'Экстрактор данных', inputSubtitle: 'Выберите источник выше, подготовьте здесь содержимое и запустите сканирование, когда все будет готово.', pasteTextTitle: 'Вставьте текст для сканирования', importedSourceTitle: 'Импортированный источник', pastePlaceholder: 'Вставьте текст для сканирования выбранных типов данных', noSourceSelected: 'Источник не выбран', replaceSourceHint: 'Нажмите тот же источник выше, чтобы заменить этот файл.', chooseSourceHint: 'Выберите источник, чтобы продолжить.', resultsEyebrow: 'Результаты', resultsTitle: 'Извлеченные результаты', resultsSubtitlePopulated: 'Результаты сгруппированы по типу данных, поэтому каждый блок можно отдельно копировать, делиться им или экспортировать.', resultsSubtitleEmpty: 'Извлеченные данные появятся здесь после запуска сканирования.', emptyEyebrow: 'Когда будете готовы', emptyTitle: 'Результаты не найдены', emptySubtitle: 'Вставьте текст или импортируйте источник, затем запустите извлечение, чтобы заполнить выбранные типы результатов.',
  },
  history: {unknownTime: 'Время неизвестно', noResultsStored: 'Сохраненных результатов нет', heroEyebrow: 'История', heroTitle: 'Последние сессии извлечения', heroSubtitle: 'Открывайте прошлые сканы и сразу возвращайтесь на вкладку {homeTabLabel} с восстановленным источником и результатами.', emptyTitle: 'История пока пуста', emptyText: 'Завершенные сканы будут появляться здесь, чтобы вы могли открыть их позже.'},
  settings: {themeEyebrow: 'Тема', themeTitle: 'Выберите оформление', dataTypesEyebrow: 'Типы данных', dataTypesTitle: 'Выберите, что извлекать', dataTypesSubtitle: 'Эти настройки применяются ко всем новым сканам в приложении.', themeUpdated: 'Тема обновлена.', preferencesUpdated: 'Параметры извлечения обновлены.', selectOneDataType: 'Выберите хотя бы один тип данных.'},
  runtime: {nativeModuleUnavailable: 'Модуль извлечения недоступен.', multiTypeUnavailable: 'Для этого источника сейчас доступно только извлечение email.', noSourceAssetSelected: 'Источник пока не выбран.', unsupportedFileType: 'Этот тип файла не поддерживается.', unableToExportExtractedItems: 'Не удалось экспортировать извлеченные элементы.', fileMissing: 'По этому пути нет файла: {path}', unableToReadImage: 'Не удалось прочитать изображение по пути: {path}', primaryOcrFailed: 'Первый проход OCR не вернул пригодный текст.', highContrastOcrFailed: 'Резервный OCR с высоким контрастом тоже завершился неудачно.', unableToProcessImage: 'Не удалось обработать это изображение.', unableToOpenPdf: 'Не удалось открыть PDF-файл.', pdfOcrFallbackFailed: 'Сбой резервного OCR на странице {page} PDF.', unableToDecodeTextFile: 'Не удалось декодировать текстовый файл.'},
};

export const translations: Partial<Record<SupportedLocale, TranslationSet>> & {
  en: TranslationSet;
} = {
  en,
  'zh-Hans': zhHans,
  ja,
  ko,
  de,
  fr,
  es,
  'pt-BR': ptBR,
  ru,
};
