import * as carsDataset from '../datasets/cars.json'; // dataset for testing purposes
import {jsonObjectToDataset,jsonToDataRecord,Dataset,DataRecord,AttributeType,Attribute,ValueType} from '../src/dataset';

describe('dataset.ts tests', () => {
  describe('Attribute', () => {
    test('Attribute constructor works', () => {
      const isAttribute = (attribute: Attribute): boolean => { return true };
      const a = {
        name: "test",
        attributeType: AttributeType.nominal
      };
      expect(isAttribute(a)).toBeTruthy();
    });
  });
  describe('DataRecord', () => {
    test('DataRecord constructor works', () => {
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
    test('can load real data as DataRecord and BaseDataRecord', () => {
      const or: Record<string, ValueType | null> = carsDataset[0];
      const dr: DataRecord = jsonToDataRecord(or);
      expect(dr.attributes).toHaveLength(Object.keys(or).length);
      const attributeNames: string[] = dr.attributes.map((a) => a.name);
      Object.keys(or).forEach((k) => {
        const i: number = attributeNames.indexOf(k);
        expect(i >= 0).toBeTruthy();
        expect(dr.values[i]).toEqual(or[k]);
      });
    });
  });
  describe('Dataset', () => {
    test('Dataset constructor works', () => {
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
    test('can load full JSON object to Dataset', () => {
      expect(jsonObjectToDataset(carsDataset,"cars")).toBeTruthy();
    });

  });
});
