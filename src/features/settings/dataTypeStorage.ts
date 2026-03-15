import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  createDefaultDataTypeSelection,
  DataTypeSelection,
  isDataTypeSelection,
} from '../../shared/extractedData';

const STORAGE_KEY = 'emailExtractor.dataTypes.v1';

export async function readDataTypeSelection(): Promise<DataTypeSelection> {
  try {
    const rawValue = await AsyncStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return createDefaultDataTypeSelection();
    }

    const parsed = JSON.parse(rawValue);

    if (!isDataTypeSelection(parsed)) {
      return createDefaultDataTypeSelection();
    }

    return parsed;
  } catch {
    return createDefaultDataTypeSelection();
  }
}

export async function persistDataTypeSelection(
  selection: DataTypeSelection,
): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
}
