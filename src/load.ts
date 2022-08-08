import * as fs from 'fs';
import * as path from 'path';
import { AttributeType, BaseDataset, jsonObjectToDataset, ValueType } from './dataset';

// load a JSON file from the local filesystem, assumes a flat structure similar to CSV
export function loadJsonFile(filepath: string): Record<string, ValueType | null>[] {
  return JSON.parse(fs.readFileSync(filepath,{ encoding:'utf8', flag:'r' }));
}

// write JSON object to local filesystem, assumes a flat structure similar to CSV
export function writeJsonFile(jsonData: Record<string, ValueType | null>[], filepath: string): void {
  fs.writeFileSync(filepath, JSON.stringify(jsonData));
}

// export a BaseDataset object to the datasets folder
export function exportDatasetJson(dataset: BaseDataset, dataset_filename: string): void {
  writeJsonFile(dataset.records.map((r) => r.values), path.join(__dirname,"..","datasets",dataset_filename));
}

// load a JSON file from the datasets folder and return a BaseDataset object
export function loadDataset(dataset_filename: string, name: string = null, typeHints: Record<string, AttributeType> = {}): BaseDataset {
  const jsonObj = loadJsonFile(path.join(__dirname,"..","datasets",dataset_filename));
  return jsonObjectToDataset(jsonObj, name, typeHints);
}
