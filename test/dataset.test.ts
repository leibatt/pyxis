import * as carsDataset from '../datasets/cars.json'; // dataset for testing purposes
import {jsonObjectToDataset,jsonToDataRecord,BaseDataset,Dataset,BaseDataRecord,DataRecord,AttributeType,Attribute,ValueType} from '../src/dataset';

describe('dataset.ts tests', () => {
  describe('Attribute', () => {
    test('#constructor works', () => {
      const attribute: Attribute = {
        name: "test",
        attributeType: AttributeType.nominal
      };
      expect(attribute.name).toEqual("test");
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
      const values: ValueType[] = ["test"];
      const id = "d";
      const d: DataRecord = {
        attributes: attributes,
        values: values,
        id: id
      };
      expect(d.attributes[0].name).toEqual("a");
      expect(d.values[0]).toEqual("test");
    });
    test('#constructor enforces attribute and value array lengths', () => {
      const attributes: Attribute[] = [
        {
          name: "a",
          attributeType: AttributeType.nominal
        }
      ];
      const values: ValueType[] = ["test","test2"];
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
        expect(dr.values[i]).toEqual(or[k]);
      });
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
      expect(dr.getValueByIndex(dr.values.length+1)).toBeNull();
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
          values: ["test"],
          id: "d"
        }
      ];
      const d: Dataset = {
        name: "test",
        records: records
      };
      expect(d.name).toEqual("test");
      expect(d.records[0].attributes).toHaveLength(1);
      expect(d.records[0].values).toHaveLength(1);
      expect(d.records[0].attributes[0].name).toEqual("a");
      expect(d.records[0].values[0]).toEqual("test");
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
        expect(coverage.percentOverlap["cars1"]).toEqual(0.0);
        expect(coverage.percentOverlap["cars2"]).toEqual(0.0);
      });
      test('Calculated coverage is 100% for the same datasets', () => {
        const cars1: Dataset = new BaseDataset(cars.name+"1", cars.records.slice(0,10));
        const cars2: Dataset = new BaseDataset(cars.name+"2", cars.records.slice(0,10));
        const coverage: { overlap: Dataset, percentOverlap: Record<string, number> } = cars1.compareCoverage(cars2);
        expect(coverage.percentOverlap["cars1"]).toEqual(1.0);
        expect(coverage.percentOverlap["cars2"]).toEqual(1.0);
      });
      test('Calculated coverage is 50% for half the dataset', () => {
        const cars1: Dataset = new BaseDataset(cars.name+"1", cars.records.slice(0,10));
        const cars2: Dataset = new BaseDataset(cars.name+"2", cars.records.slice(0,5));
        const coverage: { overlap: Dataset, percentOverlap: Record<string, number> } = cars1.compareCoverage(cars2);
        expect(coverage.percentOverlap["cars1"]).toEqual(0.5);
        expect(coverage.percentOverlap["cars2"]).toEqual(1.0);
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
