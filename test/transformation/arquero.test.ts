import * as path from 'path';
import { loadJsonFile, ValueType, BaseDataset, Dataset, jsonObjectToDataset } from '../../src/dataset';
import { ArqueroDataTransformation, executeDataTransformation } from '../../src/transformation/arquero';

// dataset for testing purposes
const carsDataset = loadJsonFile(path.join(__dirname,"..","..","datasets","cars.json"));

describe('transformation/arquero.ts', () => {
  const cars: Dataset = jsonObjectToDataset(carsDataset,"cars");

  test('arquero executes as expected', () => {
    const t: ArqueroDataTransformation = {
      sources: [cars],
      ops: ["filter"],
      transforms: [
        {
          op: "filter",
          args: [(d: Record<string,ValueType>) => d.Horsepower >= 200]
        }
      ]
    };
    expect(() => executeDataTransformation(t)).not.toThrow();
  });
  test('arquero join executes as expected', () => {
    const d1: BaseDataset = jsonObjectToDataset([{"a":1,"b":2}]);
    const d2: BaseDataset = jsonObjectToDataset([{"a":1,"c":3}]);
    const t: ArqueroDataTransformation = {
      sources: [d1,d2],
      ops: ["join"],
      transforms: [
        {
          op: "join",
          args: [],
          toJoin: d2
        }
      ]
    };
    const d3: BaseDataset = executeDataTransformation(t);
    expect(d3.records).toHaveLength(1); // should emit a single join pair
    expect(d3.records[0].values).toEqual({"a": 1,"b": 2,"c": 3}); // join pair should have these values
  });
  test('multiple arquero verbs are processed as expected', () => {
    const d1: BaseDataset = jsonObjectToDataset([{"a":1,"b":2},{"a":2,"b":3}]);
    const d2: BaseDataset = jsonObjectToDataset([{"a":1,"c":3},{"a":1,"c":4}]);
    const t: ArqueroDataTransformation = {
      sources: [d1,d2],
      ops: ["filter", "join", "filter"],
      transforms: [
        {
          op: "filter",
          args: [(d: Record<string,ValueType>) => d.a < 2]
        },
        {
          op: "join",
          args: [],
          toJoin: d2
        },
        {
          op: "filter",
          args: [(d: Record<string,ValueType>) => d.c > 3]
        }
      ]
    };
    const d3: BaseDataset = executeDataTransformation(t);
    expect(d3.records).toHaveLength(1); // should emit a single join pair
    expect(d3.records[0].values).toEqual({"a": 1,"b": 2,"c": 4}); // join pair should have these values
  });
});
