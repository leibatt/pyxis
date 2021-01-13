import {Transforms, View, parse} from 'vega';
import {BaseDataRecord, BaseDataset, Dataset, jsonToDataRecord, dataRecordToJson} from '../dataset';

// given a list of Vega transforms, this function will apply the transforms to
// the given Dataset and return a new dataset with the transforms applied
export function executeTransforms(transforms: Transforms[], source: Dataset): BaseDataset {
  const spec: Record<string, any> = {
    "data": [
      {
        "name": "dataset0",
        "values": source.records.map(dataRecordToJson)
      },
      {
        "name": "dataset1",
        "source": "dataset0",
        "transform": transforms
      }
    ]
  };
  const view: View = new View(parse(spec), {renderer: 'none'});
  view.run();
  const newRecords: BaseDataRecord[] = view.data('dataset1').map((r) => jsonToDataRecord(r));
  const datasetName = source.name + "-" + transforms.map(t => t.type).join("-");
  return new BaseDataset(datasetName, newRecords);
}
