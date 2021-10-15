import * as carsDataset from '../../datasets/cars.json'; // dataset for testing purposes
import {Attribute,AttributeType,BaseDataRecord,Dataset,jsonObjectToDataset,ValueType} from '../../src/dataset';
import {DecisionTreeRegressionRelationshipModel} from '../../src/relationship/DecisionTreeRegressionRelationshipModel';

describe('DecisionTreeRegressionRelationshipModel', () => {
  test('#constructor works', () => {
    const dtrm: DecisionTreeRegressionRelationshipModel = new DecisionTreeRegressionRelationshipModel(
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
    expect(dtrm.name).toEqual("test");
  });
  test('#constructor attribute type check works', () => {
    expect(() => {
      return new DecisionTreeRegressionRelationshipModel(
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
    }).toThrow("DecisionTreeRegressionRelationshipModel can only be used with quantitative attributes.");
    expect(() => {
      return new DecisionTreeRegressionRelationshipModel(
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
    }).toThrow("DecisionTreeRegressionRelationshipModel can only be used with quantitative attributes.");
  });
  test('#train runs without errors', () => {
    const cars: Dataset = jsonObjectToDataset(carsDataset,"cars");
    const dtrm: DecisionTreeRegressionRelationshipModel = new DecisionTreeRegressionRelationshipModel(
      "cars",
      [ // input attributes
        {
          name: "Weight_in_lbs",
          attributeType: AttributeType.quantitative
        },
        {
          name: "Horsepower",
          attributeType: AttributeType.quantitative
        }
      ],
      { // output attribute
        name: "Cylinders",
        attributeType: AttributeType.quantitative
      }
    );
    expect(() => { dtrm.train(cars.records); }).not.toThrow();
  });
  test('#predict runs without errors', () => {
    const cars: Dataset = jsonObjectToDataset(carsDataset,"cars");
    const dtrm: DecisionTreeRegressionRelationshipModel = new DecisionTreeRegressionRelationshipModel(
      "cars",
      [ // input attributes
        {
          name: "Weight_in_lbs",
          attributeType: AttributeType.quantitative
        },
        {
          name: "Horsepower",
          attributeType: AttributeType.quantitative
        }
      ],
      { // output attribute
        name: "Cylinders",
        attributeType: AttributeType.quantitative
      }
    );
    dtrm.train(cars.records);
    const res: ValueType = dtrm.predict(cars.records[0]);
    expect(res).toEqual(expect.anything());
  });
  test('#train throws error if training set does note exist', () => {
    const attributes: Attribute[] = [
      {"name":"x", "attributeType": AttributeType.quantitative},
      {"name":"y", "attributeType": AttributeType.quantitative}
    ];
    const dtrm: DecisionTreeRegressionRelationshipModel = new DecisionTreeRegressionRelationshipModel(
      "y=x",
      // input attributes
      attributes.filter(a => a.name === "x"),
      // output attribute
      attributes.filter(a => a.name === "y")[0]
    );
    expect(() => { return dtrm.train(null) }).toThrow("No training data provided.");
    expect(() => { return dtrm.train(undefined) }).toThrow("No training data provided.");
    expect(() => { return dtrm.train([]) }).toThrow("No training data provided.");
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
    const dtrm: DecisionTreeRegressionRelationshipModel = new DecisionTreeRegressionRelationshipModel(
      "y=x",
      // input attributes
      attributes.filter(a => a.name === "x"),
      // output attribute
      attributes.filter(a => a.name === "y")[0]
    );
    
    expect(() => { return dtrm.train(dataRecords) }).toThrow("input attribute 'x' is not of type 'number'.");
    dataRecords = [new BaseDataRecord(
      attributes,
      {"x": 0, "y": "0"},
      "0"
    )];
    expect(() => { return dtrm.train(dataRecords) }).toThrow("output attribute 'y' is not of type 'number'.");
  });
/*
  test('#predict 3 clusters', () => {
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
          "y": 0
        },
        i+"-"+0
      ));
    }
    for(let i = 10; i < 20; i++) {
      dataRecords.push(new BaseDataRecord(
        attributes,
        {
          "x": i,
          "y": 16
        },
        i+"-"+16
      ));
    }
    for(let i = 20; i < 30; i++) {
      dataRecords.push(new BaseDataRecord(
        attributes,
        {
          "x": i,
          "y": 100
        },
        i+"-"+100
      ));
    }
    const dtrm: DecisionTreeRegressionRelationshipModel = new DecisionTreeRegressionRelationshipModel(
      "predict 3 clusters",
      // input attributes
      attributes.filter(a => a.name === "x"),
      // output attribute
      attributes.filter(a => a.name === "y")[0]
    );
    dtrm.train(dataRecords);
    let res: ValueType = dtrm.predict(dataRecords[5]);
    expect(res).toBeCloseTo(0);
    res = dtrm.predict(dataRecords[15]);
    expect(res).toBeCloseTo(16);
    res = dtrm.predict(dataRecords[25]);
    expect(res).toBeCloseTo(100);
  });
*/
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
    const dtrm: DecisionTreeRegressionRelationshipModel = new DecisionTreeRegressionRelationshipModel(
      "y=x",
      // input attributes
      attributes.filter(a => a.name === "x"),
      // output attribute
      attributes.filter(a => a.name === "y")[0]
    );
    dtrm.train(dataRecords);    
    const toPredict: BaseDataRecord = new BaseDataRecord(
      attributes,
      {"x": "5", "y": 5},
      "0"
    );
    expect(() => { return dtrm.predict(toPredict) }).toThrow("input attribute 'x' is not of type 'number'.");
  });
});
