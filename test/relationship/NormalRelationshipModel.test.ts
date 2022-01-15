import * as carsDataset from '../../datasets/cars.json'; // dataset for testing purposes
import { AttributeType, Dataset, jsonObjectToDataset, ValueType} from '../../src/dataset';
import { NormalRelationshipModel } from '../../src/relationship/NormalRelationshipModel';

describe('NormalRelationshipModel', () => {
  test('#constructor works', () => {
    const nmm: NormalRelationshipModel = new NormalRelationshipModel(
      "test",
      // input attribute
      {
        name: "x",
        attributeType: AttributeType.quantitative
      }
    );
    expect(nmm.name).toEqual("test");
    expect(nmm.model).toBeNull();
  });
  test('#train runs without errors', () => {
    const cars: Dataset = jsonObjectToDataset(carsDataset,"cars");
    const nmm: NormalRelationshipModel = new NormalRelationshipModel(
      "cars",
      // input attribute
      {
        name: "Horsepower",
        attributeType: AttributeType.quantitative
      }
    );
    expect(() => { nmm.train(cars.records); }).not.toThrow();
  });
  test('#train mean and stdev are calculated correctly', () => {
    const cars: Dataset = jsonObjectToDataset(carsDataset,"cars");
    const nmm: NormalRelationshipModel = new NormalRelationshipModel(
      "cars",
      // input attribute
      {
        name: "Weight_in_lbs",
        attributeType: AttributeType.quantitative
      }
    );
    nmm.train(cars.records);
    expect(nmm.model.mean()).toBeCloseTo(2979.41379,5);
    expect(nmm.model.stdev()).toBeCloseTo(845.96058,5);
  });
  test('#simulate runs without errors', () => {
    const cars: Dataset = jsonObjectToDataset(carsDataset,"cars");
    const nmm: NormalRelationshipModel = new NormalRelationshipModel(
      "cars",
      { // input attribute
        name: "Horsepower",
        attributeType: AttributeType.quantitative
      }
    );
    nmm.train(cars.records);
    const res: ValueType = nmm.simulate();
    expect(res).toEqual(expect.anything());
  });
  test('#train throws error if training set does not exist', () => {
    const nmm: NormalRelationshipModel = new NormalRelationshipModel(
      "x",
      {"name":"x", "attributeType": AttributeType.quantitative} // input attribute
    );
    expect(() => { return nmm.train(null) }).toThrow("No training data provided.");
    expect(() => { return nmm.train(undefined) }).toThrow("No training data provided.");
    expect(() => { return nmm.train([]) }).toThrow("No training data provided.");
  });
});
