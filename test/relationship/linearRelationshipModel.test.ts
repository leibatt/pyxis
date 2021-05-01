import * as carsDataset from '../../datasets/cars.json'; // dataset for testing purposes
import {AttributeType,Dataset,jsonObjectToDataset,ValueType} from '../../src/dataset';
import {LinearRelationshipModel} from '../../src/relationship/linearRelationshipModel';

describe('LinearRelationshipModel', () => {
  test('#constructor works', () => {
    const lrm: LinearRelationshipModel = new LinearRelationshipModel(
      "test",
      [ // input attributes
        {
          name: "x",
          attributeType: AttributeType.quantitative
        }
      ],
      { // output attribute
        name: "y",
        attributeType: AttributeType.quantitative
      }
    );
    expect(lrm.name).toEqual("test");
  });
  test('#constructor attribute type check works', () => {
    expect(() => {
      return new LinearRelationshipModel(
        "test",
        [ // input attributes
          {
            name: "x",
            attributeType: AttributeType.nominal
          }
        ],
        { // output attribute
          name: "y",
          attributeType: AttributeType.quantitative
        }
      );
    }).toThrow("LinearRelationshipModel can only be used with quantitative attributes.");
    expect(() => {
      return new LinearRelationshipModel(
        "test",
        [ // input attributes
          {
            name: "x",
            attributeType: AttributeType.quantitative
          }
        ],
        { // output attribute
          name: "y",
          attributeType: AttributeType.nominal
        }
      );
    }).toThrow("LinearRelationshipModel can only be used with quantitative attributes.");
  });
  test('#train runs without errors', () => {
    const cars: Dataset = jsonObjectToDataset(carsDataset,"cars");
    const lrm: LinearRelationshipModel = new LinearRelationshipModel(
      "cars",
      [ // input attributes
        {
          name: "Weight_in_lbs",
          attributeType: AttributeType.quantitative
        },
        {
          name: "Cylinders",
          attributeType: AttributeType.quantitative
        }
      ],
      { // output attribute
        name: "Horsepower",
        attributeType: AttributeType.quantitative
      }
    );
    expect(lrm.model).toBeNull();
    lrm.train(cars.records);
    expect(lrm.model).not.toBeNull();
  });
  test('#predict runs without errors', () => {
    const cars: Dataset = jsonObjectToDataset(carsDataset,"cars");
    const lrm: LinearRelationshipModel = new LinearRelationshipModel(
      "cars",
      [ // input attributes
        {
          name: "Weight_in_lbs",
          attributeType: AttributeType.quantitative
        },
        {
          name: "Cylinders",
          attributeType: AttributeType.quantitative
        }
      ],
      { // output attribute
        name: "Horsepower",
        attributeType: AttributeType.quantitative
      }
    );
    lrm.train(cars.records);
    const res: ValueType = lrm.predict(cars.records[0]);
    expect(res).toEqual(expect.anything());
  });
});
