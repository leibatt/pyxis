import * as path from 'path';
import { loadJsonFile } from '../src/load';
import { jsonObjectToDataset,jsonToDataRecord,BaseDataset,Dataset,BaseDataRecord,DataRecord,AttributeType,Attribute,ValueType} from '../src/dataset';

// dataset for testing purposes
const carsDataset = loadJsonFile(path.join(__dirname,"..","datasets","cars.json"));

describe('dataset.ts tests', () => {
  describe('Attribute', () => {
    test('#constructor works', () => {
      const attribute: Attribute = {
        name: "test",
        attributeType: AttributeType.nominal
      };
      expect(attribute.name).toBe("test");
      expect(attribute.attributeType).toEqual(AttributeType.nominal);
    });
  });
  describe('BaseDataRecord', () => {
    test('#constructor works', () => {
      const attributes: Attribute[] = [
        {
          name: "a",
          attributeType: AttributeType.nominal
        }
      ];
      const values: Record<string, ValueType | null> = {"a": "test"};
      const id = "d";
      const d: DataRecord = {
        attributes: attributes,
        values: values,
        id: id
      };
      expect(d.attributes[0].name).toBe("a");
      expect(d.values["a"]).toBe("test");
    });
    test('#constructor enforces attribute and value array lengths', () => {
      const attributes: Attribute[] = [
        {
          name: "a",
          attributeType: AttributeType.nominal
        }
      ];
      const values: Record<string, ValueType | null> = {"a": "test", "b": "test2"};
      const id = "d";
      expect(() => new BaseDataRecord(attributes,values,id)).toThrow(Error);
    });
    test('#jsonToDataRecord can load real data as BaseDataRecord', () => {
      const or: Record<string, ValueType | null> = carsDataset[0];
      const dr: BaseDataRecord = jsonToDataRecord(or);
      expect(dr.attributes).toHaveLength(Object.keys(or).length);
      const attributeNames: string[] = dr.attributes.map((a) => a.name);
      Object.keys(or).forEach((k) => {
        const i: number = attributeNames.indexOf(k);
        expect(i >= 0).toBeTruthy();
        expect(dr.values[dr.attributes[i].name]).toEqual(or[k]);
      });
    });
    test('#jsonToDataRecord can parse date strings if requested', () => {
      const or: Record<string, ValueType | null> = {
        date1: "01/17/2022",
        date2: "01/17/2022"
      }
      const dr: BaseDataRecord = jsonToDataRecord(or, null, { date1: AttributeType.temporal });
      expect(dr.attributes[0].attributeType).toEqual(AttributeType.temporal);
      expect(typeof dr.values["date1"]).toBe("object");
      expect((dr.values["date1"] as Date).getFullYear()).toBe(2022);
      expect(dr.attributes[1].attributeType).toEqual(AttributeType.nominal);
      expect(typeof dr.values["date2"]).toBe("string");
    });
    test('#getValueByName retrieves correct values', () => {
      const or: Record<string, ValueType | null> = carsDataset[0];
      const dr: BaseDataRecord = jsonToDataRecord(or);
      Object.keys(or).forEach((k) => {
        expect(dr.getValueByName(k)).toEqual(or[k]);
      });
    });
    test('#getValueByName returns null if invalid input passed', () => {
      const or: Record<string, ValueType | null> = carsDataset[0];
      const dr: BaseDataRecord = jsonToDataRecord(or);
      expect(dr.getValueByName("junk")).toBeNull();
      expect(dr.getValueByName(null)).toBeNull();
    });
    test('#getValueByIndex retrieves correct values', () => {
      const or: Record<string, ValueType | null> = carsDataset[0];
      const dr: BaseDataRecord = jsonToDataRecord(or);
      const attributeNames: string[] = dr.attributes.map((a) => a.name);
      Object.keys(or).forEach((k) => {
        const i: number = attributeNames.indexOf(k);
        expect(dr.getValueByIndex(i)).toEqual(or[k]);
      });
    });
    test('#getValueByIndex returns null if invalid input passed', () => {
      const or: Record<string, ValueType | null> = carsDataset[0];
      const dr: BaseDataRecord = jsonToDataRecord(or);
      expect(dr.getValueByIndex(-1)).toBeNull();
      expect(dr.getValueByIndex(dr.attributes.length+1)).toBeNull();
    });
    describe('#hash', () => {
      test('hash for same record should be consistent', () => {
        const dr: BaseDataRecord = jsonToDataRecord(carsDataset[0],"d");
        const dr2: BaseDataRecord = jsonToDataRecord(carsDataset[0],"d");
        expect(dr.hash()).toEqual(dr.hash());
        expect(dr.hash()).toEqual(dr2.hash());
      });
      test('hash for different records should not match', () => {
        const dr: BaseDataRecord = jsonToDataRecord(carsDataset[0]);
        const dr2: BaseDataRecord = jsonToDataRecord(carsDataset[1]);
        expect(dr.hash() === dr2.hash()).toBeFalsy();
      });
    });
  });
  describe('BaseDataset', () => {
    const cars: Dataset = jsonObjectToDataset(carsDataset,"cars");
    test('#constructor works', () => {
      const records: DataRecord[] = [
        {
          attributes: [
            {
              name: "a",
              attributeType: AttributeType.nominal
            }
          ],
          values: {"a": "test"},
          id: "d"
        }
      ];
      const d: Dataset = {
        name: "test",
        records: records
      };
      expect(d.name).toBe("test");
      expect(d.records[0].attributes).toHaveLength(1);
      expect(Object.keys(d.records[0].values)).toHaveLength(1);
      expect(d.records[0].attributes[0].name).toBe("a");
      expect(d.records[0].values["a"]).toBe("test");
    });
    test('#jsonObjectToDataset can load full JSON object to Dataset', () => {
      expect(jsonObjectToDataset(carsDataset,"cars")).toBeTruthy();
      expect(jsonObjectToDataset(carsDataset)).toBeTruthy();
    });
    describe('#compareCoverage', () => {
      test('Calculated coverage is 0% for different datasets', () => {
        const cars1: Dataset = new BaseDataset(cars.name+"1", cars.records.slice(0,10));
        const cars2: Dataset = new BaseDataset(cars.name+"2", cars.records.slice(10,20));
        const coverage: { overlap: Dataset, percentOverlap: Record<string, number> } = cars1.compareCoverage(cars2);
        expect(coverage.percentOverlap["cars1"]).toBe(0.0);
        expect(coverage.percentOverlap["cars2"]).toBe(0.0);
      });
      test('Calculated coverage is 100% for the same datasets', () => {
        const cars1: Dataset = new BaseDataset(cars.name+"1", cars.records.slice(0,10));
        const cars2: Dataset = new BaseDataset(cars.name+"2", cars.records.slice(0,10));
        const coverage: { overlap: Dataset, percentOverlap: Record<string, number> } = cars1.compareCoverage(cars2);
        expect(coverage.percentOverlap["cars1"]).toBe(1.0);
        expect(coverage.percentOverlap["cars2"]).toBe(1.0);
      });
      test('Calculated coverage is 50% for half the dataset', () => {
        const cars1: Dataset = new BaseDataset(cars.name+"1", cars.records.slice(0,10));
        const cars2: Dataset = new BaseDataset(cars.name+"2", cars.records.slice(0,5));
        const coverage: { overlap: Dataset, percentOverlap: Record<string, number> } = cars1.compareCoverage(cars2);
        expect(coverage.percentOverlap["cars1"]).toBe(0.5);
        expect(coverage.percentOverlap["cars2"]).toBe(1.0);
      });
    });
    describe('#subsumes', () => {
      test('Dataset subsumes equivalent dataset', () => {
        const cars1: Dataset = new BaseDataset(cars.name+"1", cars.records.slice(0,10));
        const cars2: Dataset = new BaseDataset(cars.name+"2", cars.records.slice(0,10));
        expect(cars1.subsumes(cars2)).toBeTruthy();
      });
      test('Dataset subsumes a subset of itself', () => {
        const cars1: Dataset = new BaseDataset(cars.name+"1", cars.records.slice(0,10));
        const cars2: Dataset = new BaseDataset(cars.name+"2", cars.records.slice(0,5));
        expect(cars1.subsumes(cars2)).toBeTruthy();
      });
      test('Dataset does not subsume a superset of itself', () => {
        const cars1: Dataset = new BaseDataset(cars.name+"1", cars.records.slice(0,10));
        const cars2: Dataset = new BaseDataset(cars.name+"2", cars.records.slice(0,5));
        expect(cars2.subsumes(cars1)).toBeFalsy();
      });

    });
  });
});
