import {ExtractionSource} from '../../shared/types';

export type SelectedAsset = {
  uri: string;
  mimeType?: string | null;
  name?: string | null;
};

export type ExtractionInput = {
  source: ExtractionSource;
  text: string;
  selectedAsset: SelectedAsset | null;
};
