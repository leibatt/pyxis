import * as carsDataset from '../datasets/cars.json'; // dataset for testing purposes
import {jsonObjectToDataset,jsonToDataRecord,BaseDataset,Dataset,BaseDataRecord,DataRecord,AttributeType,Attribute,ValueType} from '../src/dataset';

describe('dataset.ts tests', () => {
  describe('Attribute', () => {
    test('#constructor works', () => {
      const isAttribute = (attribute: Attribute): boolean => { return true };
      const a = {
        name: "test",
        attributeType: AttributeType.nominal
      };
      expect(isAttribute(a)).toBeTruthy();
    });
  });
  describe('BaseDataRecord', () => {
    test('#constructor works', () => {
      const isDataRecord = (d: DataRecord): boolean => { return true };
      const attributes: Attribute[] = [
        {
          name: "a",
          attributeType: AttributeType.nominal
        }
      ];
      const values: ValueType[] = ["test"];
      const id = "d";
      const d = {
        attributes: attributes,
        values: values,
        id: id
      };
      expect(isDataRecord(d)).toBeTruthy();
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
    test('#getValueByName and #getValueByIndex retrieve correct values', () => {
      const or: Record<string, ValueType | null> = carsDataset[0];
      const dr: BaseDataRecord = jsonToDataRecord(or);
      const attributeNames: string[] = dr.attributes.map((a) => a.name);
      Object.keys(or).forEach((k) => {
        const i: number = attributeNames.indexOf(k);
        expect(dr.getValueByIndex(i)).toEqual(or[k]);
        expect(dr.getValueByName(k)).toEqual(or[k]);
      });
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
      const isDataset = (d: Dataset): boolean => { return true };
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
      expect(isDataset(d)).toBeTruthy();
    });
    test('#jsonObjectToDataset can load full JSON object to Dataset', () => {
      expect(jsonObjectToDataset(carsDataset,"cars")).toBeTruthy();
    });
    describe('#compareCoverage', () => {
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
  });
});
