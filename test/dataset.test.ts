import {BaseDataset,DataRecord,AttributeType,Attribute,ValueType} from '../src/dataset';

describe('dataset.ts tests', () => {
  describe('Attribute', () => {
    test('Attribute works', () => {
      const isAttribute = (attribute: Attribute): boolean => { return true };
      const a = {
        name: "test",
        attributeType: AttributeType.nominal
      };
      expect(isAttribute(a)).toBeTruthy();
    });
  });
});
