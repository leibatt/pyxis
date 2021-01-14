import {Transforms,View, parse} from 'vega';
import * as carsDataset from '../../datasets/cars.json';
import {BaseDataset,Dataset,DataRecord,jsonObjectToDataset,dataRecordToJson} from '../../src/dataset';
import {DataTransformation,executeDataTransformation} from '../../src/transformation/vegaTransform';

describe('transformation/vegaTransform.ts', () => {
  const cars: Dataset = jsonObjectToDataset(carsDataset,"cars");
  const carsSubset: DataRecord[] = cars.records.slice(0,10);
  const transforms: Transforms[] = [
    {
      "type": "filter",
      "expr": "datum.Horsepower >= 200",
    },
    {
      "type": "filter",
      "expr": "datum.Displacement >= 450",
    },
    {
      "type": "lookup",
      "from": "carsSubset2",
      "key": "Name",
      "fields": ["Name"],
      "values": ["Origin"],
      "as": ["Origin2"]
    }
  ];

  test('vega executes as expected', () => {
    const spec: Record<string, any> = {
      "data": [
        {
          "name": "carsSubset",
          "values": carsSubset.map(dataRecordToJson)
        },
        {
          "name": "carsSubset2",
          "values": carsSubset.map(dataRecordToJson)
        },
        {
          "name": "test",
          "source": "carsSubset",
          "transform": transforms
        }
      ]
    }; 
    const view: View = new View(parse(spec), {renderer: 'none'});
    view.run();
    expect(view.data('test')).toHaveLength(2);
  });
  test('#executeDataTransformation executes Vega as expected', () => {
    const carsSubsetDataset: Dataset = {name: "carsSubset", records: carsSubset};
    const carsSubsetDataset2: Dataset = {name: "carsSubset2", records: carsSubset};
    const transformation: DataTransformation = {
      sources: [carsSubsetDataset,carsSubsetDataset2],
      transforms: transforms
    };
    const newDataset: BaseDataset = executeDataTransformation(transformation);
    expect(newDataset.name).toEqual("carsSubset-carsSubset2_filter-filter-lookup");
    expect(newDataset.records).toHaveLength(2);
  });
});


