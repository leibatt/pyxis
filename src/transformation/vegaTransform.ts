import { Transforms, View, parse } from 'vega';
import { DataTransformation } from './DataTransformation';
import { BaseDataRecord, BaseDataset, Dataset, jsonToDataRecord, dataRecordToJson, ValueType } from '../dataset';

export interface VegaDataTransformation extends DataTransformation {
  transforms: Transforms[];
}

// given a list of Vega transforms, this function will apply the transforms to
// the given Dataset and return a new dataset with the transforms applied.
// The result of the last transform is returned.
export function executeDataTransformation(transformation: VegaDataTransformation): BaseDataset {
  if(transformation.transforms === null || transformation.transforms === undefined
    || transformation.transforms.length === 0) {
    throw new Error("no transforms passed!");
  }
  // collect source datasets, ignore duplicates (tracked by dataset names)
  const sourcesMap: Record<string, Record<string, ValueType | null>[]> = {};
  const sources: Dataset[] = [];
  transformation.sources.forEach((s) => {
    if(!(s.name in sourcesMap)) {
      sourcesMap[s.name] = s.records.map(dataRecordToJson);
      sources.push(s);
    }
  });
  const spec: Record<string, Record<string, string | Transforms[] | Record<string, ValueType | null>[]>[]> = {
    data: sources.map((s) => { return { name: s.name, values: sourcesMap[s.name] }; })
  };
  spec["data"].push({
    name: "_dataTransformationResult",
    source: sources[0].name,
    transform: transformation.transforms
  });

  const view: View = new View(parse(spec), {renderer: 'none'});
  view.run();
  const newRecords: BaseDataRecord[] = view.data("_dataTransformationResult")
    .map((r) => jsonToDataRecord(r));
  const datasetName = Object.keys(sourcesMap).join("-") + "_" + transformation.transforms.map(t => t.type).join("-");
  return new BaseDataset(datasetName, newRecords);
}

