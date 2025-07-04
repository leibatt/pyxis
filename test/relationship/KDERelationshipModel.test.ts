import * as path from 'path';
import { loadJsonFile } from '../../src/load';
import { AttributeType, Dataset, jsonObjectToDataset, ValueType} from '../../src/dataset';
import { KDERelationshipModel } from '../../src/relationship/KDERelationshipModel';

// dataset for testing purposes
const carsDataset = loadJsonFile(path.join(__dirname,"..","..","datasets","cars.json"));

describe('KDERelationshipModel', () => {
  test('#constructor works', () => {
    const kdem: KDERelationshipModel = new KDERelationshipModel(
      "test",
      // input attribute
      {
        name: "x",
        attributeType: AttributeType.quantitative
      }
    );
    expect(kdem.name).toBe("test");
    expect(kdem.model).toBeNull();
  });
  test('#train runs without errors', () => {
    const cars: Dataset = jsonObjectToDataset(carsDataset,"cars");
    const kdem: KDERelationshipModel = new KDERelationshipModel(
      "cars",
      // input attribute
      {
        name: "Horsepower",
        attributeType: AttributeType.quantitative
      }
    );
    expect(() => { kdem.train(cars.records); }).not.toThrow();
  });
  test('#simulate runs without errors', () => {
    const cars: Dataset = jsonObjectToDataset(carsDataset,"cars");
    const kdem: KDERelationshipModel = new KDERelationshipModel(
      "cars",
      { // input attribute
        name: "Horsepower",
        attributeType: AttributeType.quantitative
      }
    );
    kdem.train(cars.records);
    const res: ValueType = kdem.simulate();
    expect(res).toEqual(expect.anything());
  });
  test('#train throws error if training set does not exist', () => {
    const kdem: KDERelationshipModel = new KDERelationshipModel(
      "x",
      {"name":"x", "attributeType": AttributeType.quantitative} // input attribute
    );
    expect(() => { return kdem.train(null) }).toThrow("No training data provided.");
    expect(() => { return kdem.train(undefined) }).toThrow("No training data provided.");
    expect(() => { return kdem.train([]) }).toThrow("No training data provided.");
  });
});
