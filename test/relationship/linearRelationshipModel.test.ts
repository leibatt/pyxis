import * as carsDataset from '../../datasets/cars.json'; // dataset for testing purposes
import {Attribute,AttributeType,BaseDataRecord,Dataset,jsonObjectToDataset,ValueType} from '../../src/dataset';
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
  test('#predict throws errors for training data of wrong type', () => {
    const attributes: Attribute[] = [
      {"name":"x", "attributeType": AttributeType.quantitative},
      {"name":"y", "attributeType": AttributeType.quantitative}
    ];
    const dataRecords: BaseDataRecord[] = [new BaseDataRecord(
      [
        {"name":"x", "attributeType": AttributeType.nominal},
        {"name":"y", "attributeType": AttributeType.quantitative}
      ],
      {"x": 0, "y": 0},
      "0"
    )];
    const lrm: LinearRelationshipModel = new LinearRelationshipModel(
      "y=x",
      // input attributes
      attributes.filter(a => a.name === "x"),
      // output attribute
      attributes.filter(a => a.name === "y")[0]
    );
    
    expect(() => { return lrm.train(dataRecords) }).toThrow(Error);
    dataRecords[0].attributes[0].attributeType = AttributeType.quantitative;
    dataRecords[0].attributes[1].attributeType = AttributeType.nominal;
    expect(() => { return lrm.train(dataRecords) }).toThrow(Error);
  });
  test('#predict y=x', () => {
    const dataRecords: BaseDataRecord[] = [];
    const attributes: Attribute[] = [
      {"name":"x", "attributeType": AttributeType.quantitative},
      {"name":"y", "attributeType": AttributeType.quantitative}
    ];
    for(let i = 0; i < 10; i++) {
      dataRecords.push(new BaseDataRecord(
        attributes,
        {
          "x": i,
          "y": i
        },
        ""+i
      ));
    }
    const lrm: LinearRelationshipModel = new LinearRelationshipModel(
      "y=x",
      // input attributes
      attributes.filter(a => a.name === "x"),
      // output attribute
      attributes.filter(a => a.name === "y")[0]
    );
    lrm.train(dataRecords);
    const res: ValueType = lrm.predict(dataRecords[5]);
    expect(res).toBeCloseTo(5);
  });
});
