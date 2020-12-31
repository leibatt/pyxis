import * as carsDataset from '../../datasets/cars.json';
import * as vega from 'vega';
import {BaseDataset,Dataset,DataRecord,jsonObjectToDataset,dataRecordToJson} from '../../src/dataset';
import {executeTransforms} from '../../src/transformation/vegaTransform';

describe('transformation/vegaTransform.ts', () => {
  const cars: Dataset = jsonObjectToDataset(carsDataset,"cars");
  const carsSubset: DataRecord[] = cars.records.slice(0,10);
  const transforms = [
    {
      "type": "filter",
      "expr": "datum.Horsepower >= 200",
    }
  ];
  test('vega executes as expected', () => {
    const spec: Record<string, any> = {
      "data": [
        {
          "name": "cars",
          "values": carsSubset.map(dataRecordToJson)
        },
        {
          "name": "test",
          "source": "cars",
          "transform": transforms
        }
      ]
    }; 
    const view = new vega.View(vega.parse(spec), {renderer: 'none'});
    view.run();
    expect(view.data('test')).toHaveLength(3);
  });
  test('#executeTransforms executes Vega as expected', () => {
    const newDataset: BaseDataset = executeTransforms(transforms, new BaseDataset("carsSubset",carsSubset));
    expect(newDataset.name).toEqual("carsSubset-filter");
    expect(newDataset.records).toHaveLength(3);
  });
});



