import * as path from 'path';
import { loadJsonFile } from '../../src/load';
import { Attribute, AttributeType, BaseDataRecord, Dataset, jsonObjectToDataset, ValueType } from '../../src/dataset';
import { LinearRegressionRelationshipModel } from '../../src/relationship/LinearRegressionRelationshipModel';

// dataset for testing purposes
const carsDataset = loadJsonFile(path.join(__dirname,"..","..","datasets","cars.json"));

describe('LinearRegressionRelationshipModel', () => {
  test('#constructor works', () => {
    const lrm: LinearRegressionRelationshipModel = new LinearRegressionRelationshipModel(
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
    expect(lrm.name).toBe("test");
  });
  test('#constructor attribute type check works', () => {
    expect(() => {
      return new LinearRegressionRelationshipModel(
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
    }).toThrow("LinearRegressionRelationshipModel can only be used with quantitative attributes.");
    expect(() => {
      return new LinearRegressionRelationshipModel(
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
    }).toThrow("LinearRegressionRelationshipModel can only be used with quantitative attributes.");
  });
  test('#train runs without errors', () => {
    const cars: Dataset = jsonObjectToDataset(carsDataset,"cars");
    const lrm: LinearRegressionRelationshipModel = new LinearRegressionRelationshipModel(
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
    const lrm: LinearRegressionRelationshipModel = new LinearRegressionRelationshipModel(
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
  test('#train throws error if training set does note exist', () => {
    const attributes: Attribute[] = [
      {"name":"x", "attributeType": AttributeType.quantitative},
      {"name":"y", "attributeType": AttributeType.quantitative}
    ];
    const lrm: LinearRegressionRelationshipModel = new LinearRegressionRelationshipModel(
      "y=x",
      // input attributes
      attributes.filter(a => a.name === "x"),
      // output attribute
      attributes.filter(a => a.name === "y")[0]
    );
    expect(() => { return lrm.train(null) }).toThrow("No training data provided.");
    expect(() => { return lrm.train(undefined) }).toThrow("No training data provided.");
    expect(() => { return lrm.train([]) }).toThrow("No training data provided.");
  });
  test('#train throws errors for training data of wrong type', () => {
    const attributes: Attribute[] = [
      {"name":"x", "attributeType": AttributeType.quantitative},
      {"name":"y", "attributeType": AttributeType.quantitative}
    ];
    let dataRecords: BaseDataRecord[] = [new BaseDataRecord(
      attributes,
      {"x": "0", "y": 0},
      "0"
    )];
    const lrm: LinearRegressionRelationshipModel = new LinearRegressionRelationshipModel(
      "y=x",
      // input attributes
      attributes.filter(a => a.name === "x"),
      // output attribute
      attributes.filter(a => a.name === "y")[0]
    );
    
    expect(() => { return lrm.train(dataRecords) }).toThrow("input attribute 'x' is not of type 'number'.");
    dataRecords = [new BaseDataRecord(
      attributes,
      {"x": 0, "y": "0"},
      "0"
    )];
    expect(() => { return lrm.train(dataRecords) }).toThrow("output attribute 'y' is not of type 'number'.");
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
    const lrm: LinearRegressionRelationshipModel = new LinearRegressionRelationshipModel(
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
  test('#predict throws errors for input data of wrong type', () => {
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
    const lrm: LinearRegressionRelationshipModel = new LinearRegressionRelationshipModel(
      "y=x",
      // input attributes
      attributes.filter(a => a.name === "x"),
      // output attribute
      attributes.filter(a => a.name === "y")[0]
    );
    lrm.train(dataRecords);    
    const toPredict: BaseDataRecord = new BaseDataRecord(
      attributes,
      {"x": "5", "y": 5},
      "0"
    );
    expect(() => { return lrm.predict(toPredict) }).toThrow("input attribute 'x' is not of type 'number'.");
  });
});
