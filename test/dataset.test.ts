import {Dataset,DataRecord,AttributeType,Attribute,ValueType} from '../src/dataset';

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
      const id = 1;
      const d = {
        attributes: attributes,
        values: values,
        id: id
      };
      expect(isDataRecord(d)).toBeTruthy();
    });
  });
});
