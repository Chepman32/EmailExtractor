import DocumentPicker from 'react-native-document-picker';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import {SelectedAsset} from './types';

function mapPickerResponse(response: ImagePickerResponse): SelectedAsset | null {
  const asset = response.assets?.[0];

  if (!asset?.uri) {
    return null;
  }

  return {
    uri: asset.uri,
    mimeType: asset.type,
    name: asset.fileName,
  };
}

export async function pickFromCamera(): Promise<SelectedAsset | null> {
  const response = await launchCamera({
    mediaType: 'photo',
    saveToPhotos: false,
    quality: 0.9,
  });

  if (response.didCancel) {
    return null;
  }

  return mapPickerResponse(response);
}

export async function pickFromPhotoLibrary(): Promise<SelectedAsset | null> {
  const response = await launchImageLibrary({
    mediaType: 'photo',
    selectionLimit: 1,
  });

  if (response.didCancel) {
    return null;
  }

  return mapPickerResponse(response);
}

export async function pickFromFiles(): Promise<SelectedAsset | null> {
  try {
    const file = await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.allFiles],
      copyTo: 'cachesDirectory',
      mode: 'import',
    });

    return {
      uri: file.fileCopyUri ?? file.uri,
      mimeType: file.type,
      name: file.name,
    };
  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      return null;
    }

    throw error;
  }
}
