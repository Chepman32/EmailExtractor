/* global beforeEach, by, describe, device, element, expect, it */

describe('EmailExtractor', () => {
  beforeEach(async () => {
    await device.launchApp({newInstance: true});
  });

  it('shows the extractor home screen', async () => {
    await expect(element(by.id('screen-title'))).toBeVisible();
    await expect(element(by.id('extract-button'))).toBeVisible();
    await expect(element(by.text('No emails found'))).toBeVisible();
  });
});
